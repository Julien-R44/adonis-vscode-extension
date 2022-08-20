import BaseCommand from '../base_command'

/**
 * Handle make:middleware command
 */
export class Middleware extends BaseCommand {
  public static async run() {
    /**
     * Get the middleware name
     */
    let name = await this.getInput('Middleware name')
    if (!name) {
      this.showError('Middleware name is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `make:middleware ${name}`,
      fileType: 'middleware',
      openCreatedFile: true,
    })
  }
}
