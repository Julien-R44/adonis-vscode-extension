import BaseCommand from '../BaseCommand'

/**
 * Handle make:view command
 */
export class View extends BaseCommand {
  public static async run() {
    /**
     * Get the view name
     */
    let viewName = await this.getInput('View name')
    if (!viewName) {
      this.showError('View name is required.')
      return
    }

    /**
     * Execute the command
     */
    try {
      let command = `make:view ${viewName}`
      const res = await this.execCmd(command)
      this.openCreatedFile(res!.stdout)
      this.showMessage('View created successfully.')
    } catch (err) {
      this.showError('Could not create the view.', err)
    }
  }
}
