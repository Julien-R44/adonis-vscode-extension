import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'

/**
 * Handle make:middleware command
 */
export class Middleware extends BaseCommand {
  static async run() {
    /**
     * Get the middleware name
     */
    const name = await this.getInput('Middleware name')
    if (!name) {
      Notifier.showError('Middleware name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:middleware ${name}`,
      fileType: 'middleware',
      openCreatedFile: true,
    })
  }
}
