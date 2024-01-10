/* eslint-disable sonarjs/no-nested-template-literals */

import BaseCommand from '../../commands/base_command'

/**
 * Handle migration:reset command
 */
export class Reset extends BaseCommand {
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
    const command = `migration:reset ${dbName ? `--database=${dbName}` : ''}`
    return this.handleExecCmd({
      command,
      successMessage: this.runMigrationInBackground ? 'Migration:reset was successfully run.' : '',
      errorMessage: 'Migration:reset command failed.',
      background: this.runMigrationInBackground,
    })
  }
}
