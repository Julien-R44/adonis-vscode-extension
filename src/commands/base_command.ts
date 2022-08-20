/* eslint-disable no-console */

import { join } from 'path'
import { commands, window, workspace } from 'vscode'
import { AceExecutor } from '../services/ace_executor'
import ProjectFinder from '../services/project_finder'
import { capitalize } from '../utilities/functions'
import ConfigWrapper from '../utilities/config'
import type { AdonisProject } from '../contracts'

const outputChannel = window.createOutputChannel('AdonisJS')

export enum ExtensionErrors {
  ERR_ADONIS_PROJECT_SELECTION_NEEDED,
}

export default class BaseCommand {
  /**
   * Should migration/seed commands be run in the background
   */
  protected static get runMigrationInBackground() {
    return ConfigWrapper.misc.runMigrationInBackground as boolean
  }

  /**
   * Show a message to the user
   */
  protected static async showMessage(message: string) {
    window.showInformationMessage(message)
  }

  /**
   * Show an error message to the user
   */
  protected static async showError(message: string, consoleErr: any = null) {
    if (consoleErr !== null) {
      message += ' (See output console for more details)'
      outputChannel.appendLine(consoleErr)
      outputChannel.show()
    }
    window.showErrorMessage(message)
    return false
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
  protected static async getInput(placeHolder: string) {
    let name = await window.showInputBox({ placeHolder: placeHolder.replace(/\s\s+/g, ' ').trim() })
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
   */
  protected static parseCreatedFilename(stdout: string) {
    const matches = stdout.match(/(?<=CREATE: )(.+)/)
    return matches ? matches[0] : null
  }

  /**
   * Open the new file generated by adonis/assembler in VSCode
   */
  protected static async openCreatedFile(adonisProject: AdonisProject, stdout: string) {
    if (!stdout) return

    const filename = this.parseCreatedFilename(stdout)
    if (filename) {
      await this.openFile(adonisProject.path, filename)
    }
  }

  /**
   * Prompt the user to select an AdonisJS project when multiple
   * are present in the workspace
   */
  protected static async pickAdonisProject() {
    const adonisProjects = ProjectFinder.getAdonisProjects()

    if (adonisProjects.length === 1) {
      return adonisProjects[0]
    }

    const target = await window.showQuickPick(
      adonisProjects.map((project) => ({
        label: project.name,
        description: project.path,
      })),
      { placeHolder: 'Select the project in which you want to run this command' }
    )

    return adonisProjects.find((project) => project.path === target?.description)
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
  }: {
    command: string
    successMessage?: string | null
    errorMessage?: string
    fileType?: string
    openCreatedFile?: boolean
    background?: boolean
  }) {
    successMessage = successMessage ?? `${capitalize(fileType)} created successfully`
    errorMessage = errorMessage || `Failed to create ${fileType.toLowerCase()}`

    try {
      const res = await this.execCmd(command, background)

      if (openCreatedFile) {
        this.openCreatedFile(res.adonisProject, res.result!.stdout)
      }

      console.log(successMessage)
      if (successMessage) {
        this.showMessage(successMessage)
      }
    } catch (err: any) {
      if (err.errorCode === ExtensionErrors.ERR_ADONIS_PROJECT_SELECTION_NEEDED) {
        return this.showError('You must select an AdonisJS project on which to run your command.')
      }

      this.showError(errorMessage, err)
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
    adonisProject = adonisProject || (await this.pickAdonisProject())

    if (!adonisProject) {
      return Promise.reject({ errorCode: ExtensionErrors.ERR_ADONIS_PROJECT_SELECTION_NEEDED })
    }

    return AceExecutor.exec({ adonisProject, command, background })
  }
}