/* eslint-disable sonarjs/no-nested-template-literals */
import BaseCommand from '../base_command'

/**
 * Handle db:seed command
 */
export class Seed extends BaseCommand {
  public static async run() {
    const connection = await this.getInput(
      'Define a custom database connection for the seeders ? Leave empty for using the default.'
    )

    /**
     * Execute the command
     */
    const command = `db:seed ${connection ? `--connection=${connection}` : ''}`
    return this.handleExecCmd({
      command,
      successMessage: this.runMigrationInBackground ? 'Db:seed was successfully run.' : '',
      errorMessage: 'Db:seed command failed.',
      background: this.runMigrationInBackground,
    })
  }
}
