/* eslint-disable sonarjs/no-nested-template-literals */

import BaseCommand from '../base_command'

/**
 * Handle migration:rollback command
 */
export class Rollback extends BaseCommand {
  public static async run() {
    /**
     * Prompt user database name
     */
    const dbName = await this.getInput(
      'Which database do you want to migrate ? Leave empty for using the default.'
    )

    /**
     * Execute the command
     */
    const command = `migration:rollback ${dbName ? `--database=${dbName}` : ''}`
    return this.handleExecCmd({
      command,
      successMessage: this.runMigrationInBackground
        ? 'Migration:rollback was successfully run.'
        : '',
      errorMessage: 'Migration:rollback command failed.',
      background: this.runMigrationInBackground,
    })
  }
}
