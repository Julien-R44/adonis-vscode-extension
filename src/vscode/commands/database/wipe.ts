/* eslint-disable sonarjs/no-nested-template-literals */
import BaseCommand from '../../commands/base_command'

/**
 * Handle db:wipe command
 */
export class Wipe extends BaseCommand {
  public static async run() {
    const connection = await this.getInput(
      'Define a custom database connection for the seeders ? Leave empty for using the default.'
    )

    /**
     * Execute the command
     */
    const command = `db:wipe ${connection ? `--connection=${connection}` : ''}`
    return this.handleExecCmd({
      command,
      successMessage: this.runMigrationInBackground ? 'Db:wipe was successfully run.' : '',
      errorMessage: 'Db:wipe command failed.',
      background: this.runMigrationInBackground,
    })
  }
}
