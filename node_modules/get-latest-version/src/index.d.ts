declare namespace getLatestVersion {
  interface BaseOptions {
    readonly auth?: boolean
    readonly range?: string
    readonly registryUrl?: string
  }
  interface WithLatestOptions extends BaseOptions {
    readonly includeLatest: true
  }
  interface Options extends BaseOptions {
    readonly includeLatest?: false
  }
  interface ResolvedVersions {
    latest: string
    inRange: string | undefined
  }
}
declare function getLatestVersion(
  pkgName: string,
  optionsOrRange?: string
): Promise<string | undefined>
declare function getLatestVersion(
  pkgName: string,
  optionsOrRange: getLatestVersion.Options
): Promise<string | undefined>
declare function getLatestVersion(
  pkgName: string,
  optionsOrRange: getLatestVersion.WithLatestOptions
): Promise<getLatestVersion.ResolvedVersions>

export = getLatestVersion
