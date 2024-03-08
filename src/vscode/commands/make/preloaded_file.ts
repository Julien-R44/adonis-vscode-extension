import { Notifier } from '../../notifier'
import ProjectManager from '../../project_manager'
import BaseCommand from '../../commands/base_command'

/**
 * Handle make:prldfile command
 */
export class PreloadedFile extends BaseCommand {
  static async run() {
    /**
     * Get the preloaded file name
     */
    const preloadName = await this.getInput('Preloaded file name')
    if (!preloadName) {
      Notifier.showError('Preloaded file name is required.')
      return
    }

    /**
     * Prompt the user to select the environment in which
     * the preloaded file will be loaded
     */
    const environment = await this.getListInput('Environment', ['console', 'web', 'repl'], true)
    if (!environment) {
      Notifier.showError('Environment is required.')
      return
    }

    const aceCommand = ProjectManager.currentProject.isAdonis5() ? 'make:prldfile' : 'make:preload'

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `${aceCommand} ${preloadName} --environments=${environment.join(',')}`,
      fileType: 'preloaded file',
      openCreatedFile: true,
    })
  }
}
