import BaseCommand from '../BaseCommand'

/**
 * Handle make:factory command
 */
export class Factory extends BaseCommand {
  public static async run() {
    /**
     * Get the factory name
     */
    let factoryName = await this.getInput('Name of the model for which you want the Factory')
    if (!factoryName) {
      this.showError('Name is required.')
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
