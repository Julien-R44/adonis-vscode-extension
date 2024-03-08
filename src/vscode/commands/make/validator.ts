import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'

/**
 * Handle make:validator command
 */
export class Validator extends BaseCommand {
  static async run() {
    /**
     * Get the validator name
     */
    const seederName = await this.getInput('Validator name')
    if (!seederName) {
      Notifier.showError('Validator name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:validator ${seederName}`,
      fileType: 'validator',
      openCreatedFile: true,
    })
  }
}
