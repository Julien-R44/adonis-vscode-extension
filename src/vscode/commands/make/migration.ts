/* eslint-disable sonarjs/no-nested-template-literals */

import { Notifier } from '../../notifier'
import BaseCommand from '../../commands/base_command'

/**
 * Handle make:migration command
 */
export class Migration extends BaseCommand {
  public static async run() {
    /**
     * Get the migration name
     */
    const migrationName = await this.getInput('Migration name')
    if (!migrationName) {
      Notifier.showError('Migration name is required.')
      return
    }

    let createTable = false
    let modifyTable = false
    let tableName = ''

    const dbName = await this.getInput(
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

    const command = `${basePart} ${createPart} ${modifyPart} ${connectionPart}`
    return this.handleExecCmd({
      command,
      fileType: 'migration',
      openCreatedFile: true,
    })
  }
}
