import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'
import type { AdonisProject } from '../../../adonis_project'

/**
 * Handle make:view command
 */
export class View extends BaseCommand {
  public static async run(viewName?: string, project?: AdonisProject) {
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
