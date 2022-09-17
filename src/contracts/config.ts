/**
 * A configuration value set by a user (default provided by extension).
 * See extension root `package.json` for default values.
 */
export interface Config {
  [key: string]: any
}

export interface ConfigMisc extends Config {
  /**
   * Should migration/seeds commands run in background ?
   */
  runMigrationInBackground: boolean

  /**
   * The path to the node executable
   */
  nodePath: string

  /**
   * Use Unix-style cd for windows terminals ( Useful when using Cygwin or Git Bash )
   */
  useUnixCd: boolean
}
