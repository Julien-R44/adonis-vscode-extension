import BaseCommand from '../BaseCommand'

/**
 * Handle make:migration command
 */
export class Migration extends BaseCommand {
  public static async run() {
    /**
     * Get the migration name
     */
    let migrationName = await this.getInput('Migration name')
    if (!migrationName) {
      this.showError('Migration name is required.')
      return
    }

    let createTable = false
    let modifyTable = false
    let tableName = ''

    let dbName = await this.getInput(
      'For which database do you want create a migration ? Leave empty for using the default.'
    )

    /**
     * Prompt if we gonna create or altering a table
     */
    createTable = await this.getYesNo('Will this migration create a table?')
    if (!createTable) {
      modifyTable = await this.getYesNo('Will this migration modify an existing table?')
    }

    /**
     * Prompt for the table name
     */
    if (createTable || modifyTable) {
      tableName = await this.getInput('What is the name of the table?')
    }

    /**
     * Execute the command
     */
    const basePart = `make:migration ${migrationName}`
    const createPart = `${createTable ? `--create=${tableName}` : ''}`
    const modifyPart = `${modifyTable ? `--table=${tableName}` : ''}`
    const connectionPart = `${dbName ? `--database=${dbName}` : ''}`

    try {
      let command = `${basePart} ${createPart} ${modifyPart} ${connectionPart}`
      await this.execCmd(command)
    } catch (err) {
      this.showError('Could not create the migration.', err)
    }
  }
}
