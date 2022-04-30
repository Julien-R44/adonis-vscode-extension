import BaseCommand from '../BaseCommand'

/**
 * Handle make:model command
 */
export class Model extends BaseCommand {
  public static async run() {
    /**
     * Get the migration name
     */
    let modelName = await this.getInput('Model name')
    if (!modelName) {
      this.showError('Model name is required.')
      return
    }

    /**
     * Prompt for generating migration and/or controller with the model
     */
    let generateMigration = await this.getYesNo(
      'Do you want to generate a migration for this model ?'
    )
    let generateController = await this.getYesNo(
      'Do you want to generate a controller for this model ?'
    )

    /**
     * Execute the command
     */
    try {
      let command = `make:model ${modelName} --migration=${
        generateMigration ? 'true' : 'false'
      } --controller=${generateController ? 'true' : 'false'}`
      const res = await this.execCmd(command)
      this.openCreatedFile(res.adonisProject, res.result!.stdout)
      this.showMessage('Model created successfully.')
    } catch (err) {
      this.showError('Could not create the model.', err)
    }
  }
}
