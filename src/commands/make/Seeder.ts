import BaseCommand from '../BaseCommand'

/**
 * Handle make:seeder command
 */
export class Seeder extends BaseCommand {
  public static async run() {
    /**
     * Get the seeder name
     */
    let seederName = await this.getInput('Seeder name')
    if (!seederName) {
      this.showError('Seeder name is required.')
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
