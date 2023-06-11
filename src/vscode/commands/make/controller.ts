import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'

/**
 * Handle make:controller command
 */
export class Controller extends BaseCommand {
  public static async run() {
    /**
     * Get the controller name
     */
    const controllerName = await this.getInput('Controller name')
    if (!controllerName) {
      Notifier.showError('Controller name is required.')
      return
    }

    /**
     * Should controller be resourceful
     */
    const resource = await this.getYesNo('Should the controller be a resource ?')

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:controller ${controllerName} ${resource ? '-r' : ''}`,
      fileType: 'controller',
      openCreatedFile: true,
    })
  }
}
