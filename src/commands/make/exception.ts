import { Notifier } from '../../services/notifier'
import BaseCommand from '../base_command'

/**
 * Handle make:exception command
 */
export class Exception extends BaseCommand {
  public static async run() {
    /**
     * Get the exception name
     */
    const exceptionName = await this.getInput('Exception name')
    if (!exceptionName) {
      Notifier.showError('Exception name is required.')
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
