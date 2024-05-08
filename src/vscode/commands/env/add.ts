import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'

/**
 * Handle env:add command
 */
export class EnvAdd extends BaseCommand {
  static async run() {
    /**
     * Get the Variable name
     */
    const variableName = await this.getInput('Variable name')
    if (!variableName) {
      Notifier.showError('Variable name is required.')
      return
    }

    /**
     * Get the variable value
     */
    const variableValue = await this.getInput('Variable value')
    if (!variableValue) {
      Notifier.showError('Variable value is required.')
      return
    }

    /**
     * Get the variable type
     */
    const variableType = await this.getListInput('Variable type', [
      'string',
      'number',
      'boolean',
      'enum',
    ])

    if (!variableType) {
      Notifier.showError('Variable type is required.')
      return
    }

    /**
     * Execute the command
     */
    return this.handleExecCmd({
      command: `env:add ${variableName} ${variableValue} --type=${variableType}`,
      successMessage: 'Environment variable added successfully.',
      errorMessage: 'Failed to add environment variable.',
      openCreatedFile: false,
    })
  }
}
