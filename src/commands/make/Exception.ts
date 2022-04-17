import BaseCommand from '../BaseCommand'

/**
 * Handle make:exception command
 */
export class Exception extends BaseCommand {
  public static async run() {
    /**
     * Get the exception name
     */
    let commandName = await this.getInput('Exception name')
    if (!commandName) {
      this.showError('Command name is required.')
      return
    }

    /**
     * Execute the command
     */
    try {
      let command = `make:exception ${commandName}`
      const res = await this.execCmd(command)
      this.openCreatedFile(res!.stdout)
      this.showMessage('Exception created successfully.')
    } catch (err) {
      this.showError('Could not create the exception.', err)
    }
  }
}
