import BaseCommand from "../../BaseCommand";

/**
 * Handle make:command command
 */
export class Command extends BaseCommand {

  public static async run() {

    /**
     * Get the command name
     */
    let commandName = await this.getInput('Command name');
    if (!commandName) {
      this.showError('Command name is required.');
      return;
    }

    /**
     * Execute the command
     */
    try {
      let command = `make:command ${commandName}`;
      await this.execCmd(command);
    } catch (err) {
      this.showError('Could not create the command.', err);
    }
  }
}