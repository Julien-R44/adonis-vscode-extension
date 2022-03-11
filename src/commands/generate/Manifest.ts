import BaseCommand from "../../BaseCommand";

/**
 * Handle generate:manifest command
 */
export class Manifest extends BaseCommand {

  public static async run() {
    /**
     * Execute the command
     */
    try {
      let command = `generate:manifest`;
      await this.execCmd(command);
      await this.showMessage('Manifest has been generated.');
    } catch (err) {
      this.showError('Could not generate the manifest file.', err);
    }
  }
}
