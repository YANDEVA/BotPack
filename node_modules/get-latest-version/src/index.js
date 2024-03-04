const url = require('url')
const {getIt} = require('get-it')
const {debug, retry, promise, httpErrors, jsonResponse} = require('get-it/middleware')
const registryUrl = require('registry-url')
const registryAuthToken = require('registry-auth-token')
const semver = require('semver')

const isJson = (contentType) => /(application\/json|\+json)/.test(contentType || '')

function shouldRetry(err, num, options) {
  const response = err.response || {statusCode: 500, headers: {}}

  return (
    // allow retries on low-level errors (socket errors et al)
    retry.shouldRetry(err, num, options) ||
    // npm registry routinely fails, giving 503 and similar
    (response && response.statusCode >= 500) ||
    // npm registry sometimes returns 2xx with HTML content
    (response.statusCode < 300 && !isJson(response.headers['content-type']))
  )
}

function resolveRegistryUrl(pkgName, options) {
  if (options.registryUrl) {
    return options.registryUrl
  }
  const scope = pkgName.split('/')[0]
  return registryUrl(scope);
}

const httpRequest = getIt([
  jsonResponse({force: true}),
  httpErrors(),
  debug({namespace: 'get-latest-version'}),
  promise(),
  retry({shouldRetry}),
])

async function getLatestVersion(pkgName, opts) {
  const options =
    typeof opts === 'string'
      ? {range: opts, auth: true}
      : Object.assign({range: 'latest', auth: true}, opts)

  const regUrl = resolveRegistryUrl(pkgName, options)
  const pkgUrl = url.resolve(regUrl, encodeURIComponent(pkgName).replace(/^%40/, '@'))
  const authInfo = options.auth && registryAuthToken(regUrl, {recursive: true})
  const request = options.request || httpRequest

  const headers = {
    accept: 'application/vnd.npm.install-v1+json; q=1.0, application/json; q=0.8, */*',
  }

  if (authInfo) {
    headers.authorization = `${authInfo.type} ${authInfo.token}`
  }

  let res
  try {
    res = await request({url: pkgUrl, headers})
  } catch (err) {
    if (err.response && err.response.statusCode === 404) {
      throw new Error(`Package \`${pkgName}\` doesn't exist`)
    }

    throw err
  }

  const data = res.body
  const range = options.range
  const latest = data['dist-tags'].latest

  if (data['dist-tags'][range]) {
    return options.includeLatest
      ? {latest, inRange: data['dist-tags'][range]}
      : data['dist-tags'][range]
  }

  if (data.versions[range]) {
    return options.includeLatest ? {latest, inRange: range} : range
  }

  const versions = Object.keys(data.versions)
  const version = semver.maxSatisfying(versions, range)

  if (version) {
    return options.includeLatest ? {latest, inRange: version} : version
  }

  return options.includeLatest ? {latest, inRange: undefined} : undefined
}

getLatestVersion.request = httpRequest

module.exports = getLatestVersion
