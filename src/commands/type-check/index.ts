import BaseCommand from '../BaseCommand'
import { window } from 'vscode'

/**
 * Handle ace type-check command
 */
export class TypeCheck extends BaseCommand {
  public static async run() {
    /**
     * Execute the command
     */
    try {
      let command = `type-check`
      await this.execCmd(command, false)
    } catch (err) {
      this.showError('Could not run type-check command.', err)
    }
  }
}
