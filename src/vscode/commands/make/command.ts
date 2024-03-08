import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'

/**
 * Handle make:command command
 */
export class Command extends BaseCommand {
  static async run() {
    /**
     * Get the command name
     */
    const commandName = await this.getInput('Command name')
    if (!commandName) {
      Notifier.showError('Command name is required.')
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
