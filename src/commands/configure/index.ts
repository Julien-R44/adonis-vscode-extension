import BaseCommand from '../BaseCommand'

/**
 * Handle ace configure command
 */
export class Configure extends BaseCommand {
  public static async run() {
    /**
     * Get the package name to configure
     */
    let packageName = await this.getInput('Package name to configure')
    if (!packageName) {
      this.showError('Package name is required.')
      return
    }

    /**
     * Execute the command
     */
    try {
      let command = `configure "${packageName}"`
      await this.execCmd(command, false)
    } catch (err) {
      this.showError('Could not configure package.', err)
    }
  }
}
