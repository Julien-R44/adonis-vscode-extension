import BaseCommand from '../../commands/base_command'

/**
 * Handle node ace serve command
 */
export class Serve extends BaseCommand {
  static async run() {
    /**
     * Should watch the files ?
     */
    const watchMode = await this.getYesNo('Should run in watch mode ?')

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `serve ${watchMode ? '-w' : ''}`,
      successMessage: '',
      errorMessage: 'Could not run dev server.',
      background: false,
    })
  }
}
