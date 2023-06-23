import { EventEmitter, ThemeIcon, TreeItemCollapsibleState } from 'vscode'
import { commands } from '../../commands/commands'
import ProjectManager from '../../project_manager'
import ExtConfig from '../../utilities/config'
import { AceExecutor } from '../../ace_executor'
import type { Event, ProviderResult, TreeDataProvider, TreeItem } from 'vscode'
import type { AceListCommandsResult, CommandGenericNode } from '../../../types'

/**
 * Provide the data to be displayed in the VSCode "Commands" Tree View
 */
export class CommandsTreeDataProvider implements TreeDataProvider<CommandGenericNode> {
  #onDidChangeTreeData = new EventEmitter()
  public readonly onDidChangeTreeData: Event<any> = this.#onDidChangeTreeData.event

  constructor() {
    ProjectManager.onDidChangeProject(() => {
      this.#onDidChangeTreeData.fire(undefined)
    })
  }

  /**
   * Build the list of built-in commands
   */
  private buildBuiltinCommands() {
    return commands.map((group) => ({
      label: group.groupName,
      description: group.description,
      icon: group.icon,
      children: group.children
        .filter((command) => command.hiddenFromTreeView !== true)
        .map((command) => ({
          commandIdentifier: command.commandIdentifier,
          label: command.aceCommand,
          description: command.description,
        })),
    }))
  }

  /**
   * Build the list of custom user commands
   */
  private buildUserCommands() {
    const adonisProject = ProjectManager.getCurrentProject()
    return {
      label: 'Custom commands',
      description: 'Run your custom commands',
      icon: 'terminal',
      children: adonisProject.getCustomAceCommands().map((command) => ({
        commandIdentifier: ExtConfig.buildCommandId('run-custom-command'),
        commandArguments: [adonisProject, command.command],
        description: command.command.description,
        label: command.name,
      })),
    }
  }

  private buildRootItems() {
    const builtinCommands = this.buildBuiltinCommands()
    const userCommands = this.buildUserCommands()

    return [...builtinCommands, userCommands]
  }

  /**
   * Returns the UI state of the given walked node
   */
  public getTreeItem(element: CommandGenericNode): TreeItem | Thenable<TreeItem> {
    if ('children' in element) {
      return {
        collapsibleState: TreeItemCollapsibleState.Collapsed,
        label: element.label,
        description: element.description,
        tooltip: element.description,
        iconPath: element.icon ? new ThemeIcon(element.icon) : undefined,
      }
    }

    return {
      label: element.label,
      description: element.description,
      tooltip: element.description,
      iconPath: element.icon ? new ThemeIcon(element.icon) : undefined,
      contextValue: 'command',
    }
  }

  async #listCommandsJson() {
    const { result } = await AceExecutor.exec({
      command: 'list --json',
      adonisProject: ProjectManager.getCurrentProject(),
      background: true,
    })

    return JSON.parse(result!.stdout) as AceListCommandsResult
  }

  /**
   * Returns the children of the given node
   * If `element` is `undefined` then return the root node
   */
  public getChildren(element?: CommandGenericNode): ProviderResult<CommandGenericNode[]> {
    if (!element) {
      return this.buildRootItems()
    } else if ('children' in element) {
      return element.children
    }

    return []
  }
}
