import BaseCommand from '../base_command'

/**
 * Handle make:suite command
 */
export class Suite extends BaseCommand {
  public static async run() {
    /**
     * Get the suite name
     */
    let suiteName = await this.getInput('Suite name')
    if (!suiteName) {
      this.showError('Suite name is required.')
      return
    }

    /**
     * Get the suite location
     */
    let suiteLocation = await this.getInput(
      'Path to the suite directory. Leave empty to use the default: "tests/{suiteName}/**/*.spec(.ts|.js)"'
    )

    /**
     * Should we add a sample test file
     */
    let shouldAddSampleFile = await this.getYesNo('Should we add a sample test file ?')

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:suite ${suiteName} ${suiteLocation} ${
        !shouldAddSampleFile ? '--with-example-test=false' : ''
      }`,
      fileType: 'suite',
      openCreatedFile: true,
    })
  }
}
