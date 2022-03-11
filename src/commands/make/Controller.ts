import BaseCommand from '../../BaseCommand'

/**
 * Handle make:controller command
 */
export class Controller extends BaseCommand {
  public static async run() {
    /**
     * Get the controller name
     */
    let commandName = await this.getInput('Controller name')
    if (!commandName) {
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
      let command = `make:controller ${commandName} -r=${resource}`
      await this.execCmd(command)
    } catch (err) {
      this.showError('Could not create the controller.', err)
    }
  }
}
