import BaseCommand from '../base_command'

/**
 * Handle make:policy command
 */
export class Policy extends BaseCommand {
  public static async run() {
    /**
     * Get the policy name
     */
    const policyName = await this.getInput('Policy name')
    if (!policyName) {
      this.showError('Policy name is required.')
      return
    }

    let command = `make:policy ${policyName}`
    const resourceModel = await this.getInput(
      'Enter the name of the resource model to authorize (Optional)'
    )

    if (resourceModel) {
      command += ` --resource-model=${resourceModel}`

      const userModel = await this.getInput(
        'Enter the name of the user model to be authorized (Optional)'
      )

      command += ` --user-model=${userModel || 'User'}`
    }

    const actions = await this.getListInput(
      'Select the actions you want to implement (Optional)',
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
      command,
      fileType: 'policy',
      openCreatedFile: true,
    })
  }
}
