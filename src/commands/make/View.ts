import BaseCommand from "../../BaseCommand";

/**
 * Handle make:view command
 */
export class View extends BaseCommand {

  public static async run() {
    /**
     * Get the migration name
     */
    let viewName = await this.getInput('View name');
    if (!viewName) {
      this.showError('View name is required.');
      return;
    }

    /**
     * Execute the command
     */
    try {
      let command = `make:view ${viewName}`;
      await this.execCmd(command);
    } catch (err) {
      this.showError('Could not create the view.', err);
    }
  }
}
