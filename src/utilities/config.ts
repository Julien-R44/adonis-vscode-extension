import { workspace } from 'vscode'
import { CONFIG_NAME } from './constants'

/**
 * A configuration value set by a user (default provided by extension).
 *
 * See extension root `package.json` for for information.
 */
interface Config {
  [key: string]: any
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
  public static get misc(): Config {
    return workspace.getConfiguration(CONFIG_NAME).misc
  }
}

export default ConfigWrapper
