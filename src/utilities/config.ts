import { workspace } from 'vscode'
import { CONFIG_NAME } from './constants'

/**
 * A configuration value set by a user (default provided by extension).
 *
 * See extension root `package.json` for for information.
 */
type Config = { [key: string]: any }

/**
 * AdonisJS command task configuration.
 */
type TaskConfig = {
  /**
   * Executable path for Adonis CLI.
   */
  adonisExecutable: string

  /**
   * Disable showing of prompts for optional fields. All commands will
   * be ran with default values.
   */
  disableOptionalValuePrompts: boolean

  /**
   * Buffer size for stdout and stderr.
   */
  maxBuffer: number
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
   * Configuration for task related activities.
   */
  public static get tasks(): TaskConfig {
    return workspace.getConfiguration(CONFIG_NAME).tasks
  }
}

export default ConfigWrapper
