import BaseCommand from '../BaseCommand'

/**
 * Handle make:policy command
 */
export class Policy extends BaseCommand {
  public static async run() {
    /**
     * Get the policy name
     */
    let seederName = await this.getInput('Policy name')
    if (!seederName) {
      this.showError('Policy name is required.')
      return
    }

    let command = `make:policy ${seederName}`
    const resourceModel = await this.getInput(
      'Enter the name of the resource model to authorize (Optional)'
    )
    if (resourceModel) {
      command += ` --resource-model=${resourceModel}`

      // User model without resource model is not working as intended
      // TODO: In this getInput i would put a Default Value of 'User' to match adonis cli
      let userModel = await this.getInput(
        'Enter the name of the user model to be authorized (Optional)'
      )
      if (!userModel) {
        userModel = 'User'
      }
      command += ` --user-model=${userModel}`
    }

    const actions = await this.getListInput(
      'Select the actions you want to authorize (Optional)',
      ['viewList', 'view', 'create', 'update', 'delete'],
      true
    )
    if (actions.length > 0) {
      command += ` --actions=${actions.join(',')}`
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: command,
      fileType: 'policy',
      openCreatedFile: true,
    })
  }
}
