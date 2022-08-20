import BaseCommand from '../base_command'

/**
 * Handle make:view command
 */
export class View extends BaseCommand {
  public static async run() {
    /**
     * Get the view name
     */
    const viewName = await this.getInput('View name')
    if (!viewName) {
      this.showError('View name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:view ${viewName}`,
      fileType: 'view',
      openCreatedFile: true,
    })
  }
}
