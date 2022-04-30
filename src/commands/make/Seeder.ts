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
    try {
      let command = `make:seeder ${seederName}`
      const res = await this.execCmd(command)
      this.openCreatedFile(res.adonisProject, res.result!.stdout)
      this.showMessage('Seeder created successfully.')
    } catch (err) {
      this.showError('Could not create the seeder.', err)
    }
  }
}
