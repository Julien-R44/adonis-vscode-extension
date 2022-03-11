import BaseCommand from '../../BaseCommand'

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
    try {
      let command = `migration:refresh ${dbName ? `--database=${dbName}` : ''} ${
        seed ? '--seed' : ''
      }`
      await this.execCmd(command)
      this.showMessage('Database has been successfully refreshed.')
    } catch (err) {
      this.showError('Could not execute migration:fresh', err)
    }
  }
}
