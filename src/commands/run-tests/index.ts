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
    try {
      let command = `test ${suites} ${watchMode ? '-w' : ''}`
      await this.execCmd(command, false)
    } catch (err) {
      this.showError('Could not run test command.', err)
    }
  }
}
