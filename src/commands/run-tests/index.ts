import BaseCommand from '../BaseCommand'

/**
 * Handle node ace test command
 */
export class RunTests extends BaseCommand {
  public static async run() {
    /**
     * Suites to runs
     */
    let suites = await this.getInput('Suites to run. Leaves empty for running all tests')

    /**
     * Should run test in watch mode
     */
    let watchMode = await this.getYesNo('Should run test in watch mode ?')

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `test ${suites} ${watchMode ? '-w' : ''}`,
      successMessage: '',
      errorMessage: 'Could not run tests.',
    })
  }
}
