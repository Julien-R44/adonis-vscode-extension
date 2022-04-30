import BaseCommand from '../BaseCommand'

/**
 * Handle make:exception command
 */
export class Exception extends BaseCommand {
  public static async run() {
    /**
     * Get the exception name
     */
    let exceptionName = await this.getInput('Exception name')
    if (!exceptionName) {
      this.showError('Command name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:exception ${exceptionName}`,
      fileType: 'exception',
      openCreatedFile: true,
    })
  }
}
