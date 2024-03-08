import BaseCommand from '../../commands/base_command'

/**
 * Handle migration:run command
 */
export class Run extends BaseCommand {
  static async run() {
    /**
     * Prompt user database name
     */
    const dbName = await this.getInput(
      'Which database do you want to migrate ? Leave empty for using the default.'
    )

    /**
     * Execute the command
     */
    const command = `migration:run ${dbName ? `--database=${dbName}` : ''}`
    return this.handleExecCmd({
      command,
      successMessage: this.runMigrationInBackground ? 'Migration:run was successfully run.' : '',
      errorMessage: 'Migration:run command failed.',
      background: this.runMigrationInBackground,
    })
  }
}
