# get-latest-version

Find the latest version of an npm module matching a given semver range

[![npm version](https://img.shields.io/npm/v/get-latest-version.svg?style=flat-square)](https://www.npmjs.com/package/get-latest-version)[![Build status](https://img.shields.io/github/actions/workflow/status/rexxars/get-latest-version/test.yml?branch=main&style=flat-square)](https://github.com/rexxars/get-latest-version/actions/workflows/test.yml)

## Installing

```
npm install --save get-latest-version
```

## Basic usage

```js
const getLatestVersion = require('get-latest-version')

getLatestVersion('some-module')
  .then((version) => console.log(version)) // 1.0.0, or whichever is 'latest'
  .catch((err) => console.error(err))

getLatestVersion('some-other-module', {range: '^1.0.0'})
  .then((version) => console.log(version)) // highest version matching ^1.0.0 range
  .catch((err) => console.error(err))

// Returns both the highest in the given range and the actual `latest` tag
// Note that this differens in that the return value is an object
getLatestVersion('@sanity/base', {range: '^1.0.0', includeLatest: true})
  .then((versions) => console.log(versions)) // {inRange: '1.150.8', latest '2.23.0'}
  .catch((err) => console.error(err))
```

## Disabling authenticated requests

By default, this module will read the authorization token for whichever registry the module belongs to, based on local npm configuration. To disable this and always send unauthenticated requests to the registry, provide `auth: false` to the options:

```js
getLatestVersion('some-module', {auth: false})
  .then((version) => console.log(version))
  .catch((err) => console.error(err))
```

## Using custom registry

By default, module utilizes [registry-url](https://www.npmjs.com/package/registry-url) to resolve registry URL from NPM configuration files. However, if you need to set up the registry programmatically, you can make use of the `registryUrl` option:

```js
getLatestVersion('some-module', {registryUrl: 'https://some-custom-registry.com'})
  .then((version) => console.log(version))
  .catch((err) => console.error(err))
```


## Developing

```bash
git clone git@github.com:rexxars/get-latest-version.git
cd get-latest-version
npm install
npm test
```

## License

MIT © [Espen Hovlandsdal](https://espen.codes/)
