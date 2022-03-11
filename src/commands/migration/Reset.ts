import BaseCommand from "../../BaseCommand";

/**
 * Handle migration:reset command
 */
export class Reset extends BaseCommand {

  public static async run() {
    /**
     * Prompt user database name
     */
    let dbName = await this.getInput('Which database do you want to migrate ? Leave empty for using the default.');

    /**
     * Execute the command
     */
    try {
      let command = `migration:reset ${dbName ? `--database=${dbName}` : ''}`;
      await this.execCmd(command);
      this.showMessage('Database has been successfully refreshed.');
    } catch (err) {
      this.showError('Could not execute migration:reset', err);
    }
  }
}
