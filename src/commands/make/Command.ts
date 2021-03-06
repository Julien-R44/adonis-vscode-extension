import BaseCommand from '../BaseCommand'

/**
 * Handle make:command command
 */
export class Command extends BaseCommand {
  public static async run() {
    /**
     * Get the command name
     */
    let commandName = await this.getInput('Command name')
    if (!commandName) {
      this.showError('Command name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:command ${commandName}`,
      fileType: 'command',
      openCreatedFile: true,
    })
  }
}
