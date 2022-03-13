import BaseCommand from '../BaseCommand'

/**
 * Handle make:middleware command
 */
export class Middleware extends BaseCommand {
  public static async run() {
    /**
     * Get the migration name
     */
    let commandName = await this.getInput('Middleware name')
    if (!commandName) {
      this.showError('Middleware name is required.')
      return
    }

    /**
     * Execute the command
     */
    try {
      let command = `make:middleware ${commandName}`
      await this.execCmd(command)
    } catch (err) {
      this.showError('Could not create the middleware.', err)
    }
  }
}
