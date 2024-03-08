import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'

/**
 * Handle make:suite command
 */
export class Suite extends BaseCommand {
  static async run() {
    /**
     * Get the suite name
     */
    const suiteName = await this.getInput('Suite name')
    if (!suiteName) {
      Notifier.showError('Suite name is required.')
      return
    }

    /**
     * Get the suite location
     */
    const suiteLocation = await this.getInput(
      'Path to the suite directory. Leave empty to use the default: "tests/{suiteName}/**/*.spec(.ts|.js)"'
    )

    /**
     * Should we add a sample test file
     */
    const shouldAddSampleFile = await this.getYesNo('Should we add a sample test file ?')

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
