import BaseCommand from '../base_command'

/**
 * Handle node ace test command
 */
export class RunTests extends BaseCommand {
  public static async run(options: { arguments?: string } = {}) {
    let commandArguments = options.arguments || ''

    /**
     * Prompt for arguments when not passed
     */
    if (!commandArguments) {
      const suites = await this.getInput('Suites to run. Leaves empty for running all tests')
      const watchMode = await this.getYesNo('Should run test in watch mode ?')

      commandArguments = `${suites} ${watchMode ? '-w' : ''}`
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `test ${commandArguments}`,
      successMessage: '',
      errorMessage: 'Could not run tests.',
      background: false,
    })
  }
}
