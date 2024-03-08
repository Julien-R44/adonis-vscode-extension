import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'

/**
 * Handle make:mailer command
 */
export class Mailer extends BaseCommand {
  static async run() {
    /**
     * Get the mailer name
     */
    const mailerName = await this.getInput('Name of the mailer class')
    if (!mailerName) {
      Notifier.showError('Name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:mailer ${mailerName}`,
      fileType: 'mailer',
      openCreatedFile: true,
    })
  }
}
