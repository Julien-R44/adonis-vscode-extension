import BaseCommand from '../BaseCommand'

/**
 * Handle make:controller command
 */
export class Controller extends BaseCommand {
  public static async run() {
    /**
     * Get the controller name
     */
    let controllerName = await this.getInput('Controller name')
    if (!controllerName) {
      this.showError('Command name is required.')
      return
    }

    /**
     * Should controller be resourceful
     */
    let resource = await this.getYesNo('Should the controller be a resource ?')

    /**
     * Execute the command
     */
    try {
      let command = `make:controller ${controllerName} ${resource ? '-r' : ''}`
      const res = await this.execCmd(command)
      this.openCreatedFile(res.adonisProject, res.result!.stdout)
      this.showMessage('Controller created successfully.')
    } catch (err) {
      this.showError('Could not create the controller.', err)
    }
  }
}
