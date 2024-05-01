import { Notifier } from '#vscode/notifier'
import type { AdonisProject } from '#types/projects'
import BaseCommand from '#vscode/commands/base_command'

/**
 * Handle make:view command
 */
export class View extends BaseCommand {
  static async run(viewName?: string, project?: AdonisProject) {
    /**
     * Get the view name
     */
    viewName = viewName || (await this.getInput('View name'))
    if (!viewName) {
      Notifier.showError('View name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:view ${viewName}`,
      fileType: 'view',
      openCreatedFile: true,
      project,
    })
  }
}
