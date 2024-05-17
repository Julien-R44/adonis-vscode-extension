import { join } from 'node:path'

import { RcJsonFile } from './files/rc_json_file'
import type { CommandEntry } from '../types/projects/v6'
import { BaseAdonisProject } from './base_adonis_project'
import type { AceManifestEntry } from '../types/projects/v5'
import { RoutesOutputConverter } from '../routes_tree/routes_output_converter'
import type { AceCommandNode, AdonisProject, Routes } from '../types/projects'

export class Adonis5Project extends BaseAdonisProject implements AdonisProject {
  constructor(path: string) {
    super(path)

    this.tryParse('.adonisrc.json', () => {
      this.rcFile = new RcJsonFile(join(this.path, '.adonisrc.json'))
    })
  }

  /**
   * Convert a manifest entry to a command entry
   */
  #manifestEntryToCommand(manifestEntry: AceManifestEntry): CommandEntry {
    return {
      commandName: manifestEntry.commandName,
      description: manifestEntry.description,
      help: '',
      absoluteFilePath: '',
      namespace: '',
      aliases: [],
      args: manifestEntry.args.map((arg) => ({
        name: arg.name,
        argumentName: arg.propertyName,
        description: arg.description,
        required: arg.required,
        type: arg.type,
      })),
      flags: manifestEntry.flags.map((flag) => ({
        name: flag.name,
        flagName: flag.propertyName,
        description: flag.description,
        required: false,
        type: flag.type,
        alias: '',
      })),
      filePath: manifestEntry.commandPath,
    }
  }

  /**
   * Get the custom commands for the project
   */
  #getCustomAceCommands(): AceCommandNode[] {
    if (!this.manifest) return []

    return [
      {
        label: 'Custom commands',
        description: 'Run your custom commands',
        icon: 'terminal',
        children: Object.entries(this.manifest.commands)
          .filter(([, command]) => command.commandPath.startsWith('./commands'))
          .map(([name, command]) => ({
            commandIdentifier: 'adonis-vscode-extension.run-custom-command',
            commandArguments: [this, this.#manifestEntryToCommand(command)],
            description: command.description,
            label: name,
          })),
      },
    ]
  }

  /**
   * Returns all internal commands
   */
  async #getAppCommands() {
    const { commands } = await import('../vscode/commands/commands')

    return commands.map((group) => ({
      label: group.groupName,
      description: group.description,
      icon: group.icon,
      children: group.children
        .filter((command) => command.hiddenFromTreeView !== true)
        .map((command) => ({
          label: command.aceCommand,
          description: command.description,
          commandIdentifier: command.commandIdentifier,
        })),
    }))
  }

  /**
   * Get all routes for the project
   */
  async getRoutes(): Promise<Routes> {
    const { AceExecutor } = await import('../vscode/ace_executor')
    const { result } = await AceExecutor.exec({
      command: 'list:routes --json',
      adonisProject: this,
      background: true,
    })

    if (!result) return []

    return RoutesOutputConverter.convert(JSON.parse(result.stdout))
  }

  /**
   * Get all commands for the project
   */
  async getCommands() {
    const customCommands = this.#getCustomAceCommands()
    const appCommands = await this.#getAppCommands()

    return [...appCommands, ...customCommands]
  }

  /**
   * After executing a `make:*` command, we need to
   * parse the stdout to get the created filename
   */
  parseCreatedFilename(stdout: string) {
    const matches = stdout.match(/(?<=(CREATE): )(.+)/)
    return matches ? matches[0] : null
  }
}
