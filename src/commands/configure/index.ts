import BaseCommand from '../base_command'

/**
 * Handle ace configure command
 */
export class Configure extends BaseCommand {
  public static async run() {
    /**
     * Get the package name to configure
     */
    const packageName = await this.getInput('Package name to configure')
    if (!packageName) {
      this.showError('Package name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `configure "${packageName}"`,
      successMessage: '',
      errorMessage: 'Could not configure package.',
      background: false,
    })
  }
}
