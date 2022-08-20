import { Notifier } from '../../services/notifier'
import BaseCommand from '../base_command'

/**
 * Handle make:factory command
 */
export class Factory extends BaseCommand {
  public static async run() {
    /**
     * Get the factory name
     */
    const factoryName = await this.getInput('Name of the model for which you want the Factory')
    if (!factoryName) {
      Notifier.showError('Name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:factory ${factoryName}`,
      fileType: 'factory',
      openCreatedFile: true,
    })
  }
}
