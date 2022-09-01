import { workspace } from 'vscode'
import { CONFIG_NAME } from './constants'

/**
 * A configuration value set by a user (default provided by extension).
 * See extension root `package.json` for default values.
 */
interface Config {
  [key: string]: any
}

interface ConfigMisc extends Config {
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

interface ConfigTests extends Config {
  /**
   * Run tests in watch mode when executed via shortcut/codelens
   */
  runTestsInWatchMode: boolean
}

/**
 * A wrapper around vscode configuration for this extension
 */
class ConfigWrapper {
  /**
   * In-built vscode HTML configuration.
   */
  public static get html(): Config {
    return workspace.getConfiguration('html')
  }

  /**
   * Configuration for autocompletion related activities.
   */
  public static get autocomplete(): Config {
    return workspace.getConfiguration(CONFIG_NAME).autocomplete
  }

  /**
   * Configuration for misc options
   */
  public static get misc(): ConfigMisc {
    return workspace.getConfiguration(CONFIG_NAME).misc
  }

  /**
   * Configuration for the tests
   */
  public static get tests(): ConfigTests {
    return workspace.getConfiguration(CONFIG_NAME).tests
  }
}

export default ConfigWrapper
