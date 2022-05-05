import BaseCommand from '../BaseCommand'

/**
 * Handle migration:refresh command
 */
export class Refresh extends BaseCommand {
  public static async run() {
    /**
     * Prompt user database name and if it should be seeded
     */
    let dbName = await this.getInput(
      'Which database do you want to migrate ? Leave empty for using the default.'
    )
    let seed = await this.getYesNo('Do you want to seed the database ?')

    /**
     * Execute the command
     */
    let command = `migration:refresh ${dbName ? `--database=${dbName}` : ''} ${
      seed ? '--seed' : ''
    }`

    return this.handleExecCmd({
      command,
      successMessage: this.runMigrationInBackground
        ? 'Migration:refresh was successfully run.'
        : '',
      errorMessage: 'Migration:refresh command failed.',
      background: this.runMigrationInBackground,
    })
  }
}
