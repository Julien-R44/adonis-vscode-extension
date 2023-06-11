import BaseCommand from '../../commands/base_command'

/**
 * Handle ace type-check command
 */
export class TypeCheck extends BaseCommand {
  public static async run() {
    return this.handleExecCmd({
      command: `type-check`,
      successMessage: 'Type-check completed successfully.',
      errorMessage: 'Type-check failed.',
      background: false,
    })
  }
}
