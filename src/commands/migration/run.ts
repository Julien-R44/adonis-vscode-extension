import BaseCommand from '../base_command'

/**
 * Handle migration:run command
 */
export class Run extends BaseCommand {
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
    let command = `migration:run ${dbName ? `--database=${dbName}` : ''}`
    return this.handleExecCmd({
      command,
      successMessage: this.runMigrationInBackground ? 'Migration:run was successfully run.' : '',
      errorMessage: 'Migration:run command failed.',
      background: this.runMigrationInBackground,
    })
  }
}
