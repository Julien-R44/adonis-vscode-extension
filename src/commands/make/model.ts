import BaseCommand from '../base_command'

/**
 * Handle make:model command
 */
export class Model extends BaseCommand {
  public static async run() {
    /**
     * Get the migration name
     */
    const modelName = await this.getInput('Model name')
    if (!modelName) {
      this.showError('Model name is required.')
      return
    }

    /**
     * Prompt for generating migration + controller + factory with the model
     */
    const generateMigration = await this.getYesNo(
      'Do you want to generate a migration for this model ?'
    )
    const generateController = await this.getYesNo(
      'Do you want to generate a controller for this model ?'
    )
    const generateFactory = await this.getYesNo(
      'Do you want to generate a factory for this model ?'
    )

    /**
     * Execute the command
     */
    const command = `make:model ${modelName} --migration=${
      generateMigration ? 'true' : 'false'
    } --controller=${generateController ? 'true' : 'false'} ${generateFactory ? '-f' : ''}`

    return this.handleExecCmd({
      command,
      fileType: 'model',
      openCreatedFile: true,
    })
  }
}
