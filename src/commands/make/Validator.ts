import BaseCommand from "../../BaseCommand";

/**
 * Handle make:validator command
 */
export class Validator extends BaseCommand {

  public static async run() {
    /**
     * Get the validator name
     */
    let seederName = await this.getInput('Validator name');
    if (!seederName) {
      this.showError('Validator name is required.');
      return;
    }

    /**
     * Execute the command
     */
    try {
      let command = `make:validator ${seederName}`;
      await this.execCmd(command);
    } catch (err) {
      this.showError('Could not create the validator.', err);
    }
  }
}
