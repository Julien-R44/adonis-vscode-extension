import BaseCommand from '../BaseCommand'

/**
 * Handle make:test command
 */
export class Test extends BaseCommand {
  public static async run() {
    /**
     * Get the test suite name
     */
    let suiteName = await this.getInput('Suite name')
    if (!suiteName) {
      this.showError('Suite name is required.')
      return
    }

    /**
     * Get the test suite name
     */
    let testName = await this.getInput('Test name')
    if (!testName) {
      this.showError('Test name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:test ${suiteName} ${testName}`,
      fileType: 'test',
      openCreatedFile: true,
    })
  }
}
