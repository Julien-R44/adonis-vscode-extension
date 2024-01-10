import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'

/**
 * Handle make:seeder command
 */
export class Seeder extends BaseCommand {
  public static async run() {
    /**
     * Get the seeder name
     */
    const seederName = await this.getInput('Seeder name')
    if (!seederName) {
      Notifier.showError('Seeder name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:seeder ${seederName}`,
      fileType: 'seeder',
      openCreatedFile: true,
    })
  }
}
