/* eslint-disable no-console */

import { join } from 'path'
import { commands, window, workspace } from 'vscode'
import { Notifier } from '../notifier'
import { AceExecutor } from '../ace_executor'
import ExtConfig from '../utilities/config'
import ProjectManager from '../project_manager'
import { capitalize } from '../../utilities/misc'
import type { AdonisProject } from '../../adonis_project'

export enum ExtensionErrors {
  ERR_ADONIS_PROJECT_SELECTION_NEEDED,
}

export default class BaseCommand {
  /**
   * Should migration/seed commands be run in the background
   */
  protected static get runMigrationInBackground() {
    return ExtConfig.misc.runMigrationInBackground as boolean
  }

  /**
   * Prompt the user to select Yes or No
   */
  protected static async getYesNo(placeHolder: string) {
    const value = await window.showQuickPick(['Yes', 'No'], { placeHolder })
    return value?.toLowerCase() === 'yes'
  }

  /**
   * Prompt the user for an input
   */
  protected static async getInput(placeHolder: string, title?: string) {
    let name = await window.showInputBox({
      title,
      placeHolder: placeHolder.replace(/\s\s+/g, ' ').trim(),
    })

    name = name === undefined ? '' : name

    return name
  }

  /**
   * Prompt the user to select one or multiple input from a list
   */
  protected static async getListInput(placeHolder: string, list: string[], canPickMany = false) {
    const name = (await window.showQuickPick(list, { placeHolder, canPickMany })) as
      | string[]
      | string
    return typeof name === 'string' ? [name] : name
  }

  /**
   * Open the given file in VSCode
   */
  protected static async openFile(path: string, filename: string) {
    try {
      const doc = await workspace.openTextDocument(join(path, filename))
      window.showTextDocument(doc)
      commands.executeCommand('workbench.files.action.refreshFilesExplorer')
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Parse stdout after generating command using adonis/assembler and returns
   * the freshly created file
   *
   * On Adonis 5, stdout is CREATE: {filename},
   * On Adonis 6, stdout is DONE:   create {filename}
   */
  protected static parseCreatedFilename(project: AdonisProject, stdout: string) {
    if (project.isAdonis5()) {
      const matches = stdout.match(/(?<=(CREATE): )(.+)/)
      return matches ? matches[0] : null
    } else {
      const matches = stdout.match(/(?<=(DONE: {4}create )).+/)
      return matches ? matches[0] : null
    }
  }

  /**
   * Open the new file generated by adonis/assembler in VSCode
   */
  protected static async openCreatedFile(project: AdonisProject, stdout: string) {
    if (!stdout) return

    const filename = this.parseCreatedFilename(project, stdout)
    if (filename) {
      await this.openFile(project.path, filename)
    }
  }

  /**
   * Execute execCmd and handle errors/success notifications
   */
  protected static async handleExecCmd({
    command,
    successMessage = null,
    errorMessage,
    fileType = 'file',
    openCreatedFile = false,
    background = true,
    project,
  }: {
    command: string
    successMessage?: string | null
    errorMessage?: string
    fileType?: string
    openCreatedFile?: boolean
    background?: boolean
    project?: AdonisProject
  }) {
    successMessage = successMessage ?? `${capitalize(fileType)} created successfully`
    errorMessage = errorMessage || `Failed to create ${fileType.toLowerCase()}`

    try {
      const res = await this.execCmd(command, background, project)

      if (openCreatedFile) {
        this.openCreatedFile(res.adonisProject, res.result!.stdout)
      }

      if (successMessage) {
        Notifier.showMessage(successMessage)
      }
    } catch (err: any) {
      if (err.errorCode === ExtensionErrors.ERR_ADONIS_PROJECT_SELECTION_NEEDED) {
        return Notifier.showError(
          'You must select an AdonisJS project on which to run your command.'
        )
      }

      Notifier.showError(errorMessage, err)
    }
  }

  /**
   * Execute the final `node ace x` command
   */
  protected static async execCmd(
    command: string,
    background = true,
    adonisProject?: AdonisProject
  ) {
    adonisProject = adonisProject || (await ProjectManager.quickPickProject())

    if (!adonisProject) {
      return Promise.reject({ errorCode: ExtensionErrors.ERR_ADONIS_PROJECT_SELECTION_NEEDED })
    }

    return AceExecutor.exec({ adonisProject, command, background })
  }
}