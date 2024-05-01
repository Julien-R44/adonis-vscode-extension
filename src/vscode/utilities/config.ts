import { workspace } from 'vscode'

import type { Config, ConfigMisc } from '#types/config'

/**
 * A wrapper around vscode configuration for this extension
 */
class ExtConfig {
  /**
   * Extension name/identifier
   */
  static readonly EXTENSION_NAME = 'adonis-vscode-extension'

  /**
   * Prefix of the extension configuration keys
   */
  static readonly CONFIG_NAME = 'adonisjs'

  /**
   * Context key set when extension is activated and loaded.
   */
  static readonly CONTEXT_ADONIS_PROJECT_LOADED = 'adonisProjectLoaded'

  /**
   * Build a command identifier
   */
  static buildCommandId(command: string) {
    return `${this.EXTENSION_NAME}.${command}`
  }

  /**
   * In-built vscode HTML configuration.
   */
  static get html(): Config {
    return workspace.getConfiguration('html')
  }

  /**
   * Configuration for misc options
   */
  static get misc(): ConfigMisc {
    return workspace.getConfiguration(this.CONFIG_NAME).misc
  }

  /**
   * Inertia configuration
   */
  static get inertia(): { pagesDirectory: string } {
    return workspace.getConfiguration(this.CONFIG_NAME).inertia
  }
}

export default ExtConfig
