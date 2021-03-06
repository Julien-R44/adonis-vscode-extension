import BaseCommand from '../BaseCommand'

/**
 * Handle migration:rollback command
 */
export class Rollback extends BaseCommand {
  public static async run() {
    /**
     * Prompt user database name
     */
    let dbName = await this.getInput(
      'Which database do you want to migrate ? Leave empty for using the default.'
    )

    /**
     * Execute the command
     */
    let command = `migration:rollback ${dbName ? `--database=${dbName}` : ''}`
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
