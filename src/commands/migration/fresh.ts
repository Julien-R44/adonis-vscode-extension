/* eslint-disable sonarjs/no-nested-template-literals */

import BaseCommand from '../base_command'

/**
 * Handle migration:fresh command
 */
export class Fresh extends BaseCommand {
  public static async run() {
    /**
     * Prompt user database name and if it should be seeded
     */
    const dbName = await this.getInput(
      'Which database do you want to migrate ? Leave empty for using the default.'
    )
    const seed = await this.getYesNo('Do you want to seed the database ?')

    /**
     * Execute the command
     */
    const command = `migration:fresh ${dbName ? `--database=${dbName}` : ''} ${
      seed ? '--seed' : ''
    }`
    return this.handleExecCmd({
      command,
      successMessage: this.runMigrationInBackground ? 'Migration:fresh was successfully run.' : '',
      errorMessage: 'Migration:fresh command failed.',
      background: this.runMigrationInBackground,
    })
  }
}
