import { normalize } from 'path'
import { BaseAdonisProject } from './base_adonis_project'
import type { AceListCommandsResult } from '../types'
import type { AceCommandNode, AdonisProject, Routes } from '../types/projects'

export class Adonis6Project extends BaseAdonisProject implements AdonisProject {
  constructor(path: string) {
    super(path)
  }

  /**
   * Get list of commands for the project using `ace list --json`
   */
  async #listCommands() {
    const { AceExecutor } = await import('../vscode/ace_executor')
    const { result } = await AceExecutor.exec({
      command: 'list --json',
      adonisProject: this,
      background: true,
    })

    return JSON.parse(result!.stdout) as AceListCommandsResult
  }

  /**
   * Extract custom/user-defined commands from the list of commands
   */
  #extractCustomCommands(commands: AceListCommandsResult) {
    const customCommands = commands.filter((aceCommand) => {
      if (!aceCommand.absoluteFilePath) return false
      return normalize(aceCommand.absoluteFilePath).includes(normalize(this.path))
    })

    return [
      {
        label: 'Custom commands',
        description: 'Run your custom commands',
        icon: 'terminal',
        children: customCommands.map((command) => ({
          commandIdentifier: 'adonis-vscode-extension.run-custom-command',
          commandArguments: [this, command],
          description: command.description,
          label: command.commandName,
        })),
      },
    ]
  }

  /**
   * Extract available commands from the list of commands
   */
  async #extractAvailableCommands(commands: AceListCommandsResult) {
    const { commands: vscodeCommands } = await import('../vscode/commands/commands')
    return vscodeCommands.map((group) => ({
      ...group,
      label: group.groupName,
      children: group.children
        .filter((command) =>
          commands.find(({ commandName }) => {
            if (commandName === command.aceCommand) return true
            return command.v6Name && commandName === command.v6Name
          })
        )
        .map((command) => ({ ...command, label: command.v6Name || command.aceCommand })),
    })) as AceCommandNode[]
  }

  /**
   * Get all routes for the project using `ace list:routes --json`
   */
  async getRoutes() {
    const { AceExecutor } = await import('../vscode/ace_executor')
    const { result } = await AceExecutor.exec({
      command: 'list:routes --json',
      adonisProject: this,
      background: true,
    })

    return JSON.parse(result!.stdout) as Promise<Routes>
  }

  /**
   * Get all commands for the project
   */
  async getCommands() {
    const commands = await this.#listCommands()

    const availableCommands = await this.#extractAvailableCommands(commands)
    const customCommands = this.#extractCustomCommands(commands)

    return [...availableCommands, ...customCommands]
  }

  /**
   * After executing a `make:*` command, we need to
   * parse the stdout to get the created filename
   */
  parseCreatedFilename(stdout: string) {
    const matches = stdout.match(/(?<=(DONE: {4}create )).+/)
    return matches ? matches[0] : null
  }
}
