import { ThemeIcon, TreeItemCollapsibleState } from 'vscode'
import { commands } from '../../commands/commands'
import ProjectManager from '../../services/adonis_project/manager'
import { EXTENSION_NAME } from '../../utilities/constants'
import type { ProviderResult, TreeDataProvider, TreeItem } from 'vscode'
import type { CommandGenericNode } from '../../contracts'

/**
 * Provide the data to be displayed in the VSCode "Commands" Tree View
 */
export class CommandsTreeDataProvider implements TreeDataProvider<CommandGenericNode> {
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
    // TODO: Here we need to store the adonis projet used in the tree view instead
    const adonisProject = ProjectManager.getProjects()[0]!
    return {
      label: 'Custom commands',
      description: 'Run your custom commands',
      icon: 'terminal',
      children: adonisProject.getCustomAceCommands().map((command) => ({
        commandIdentifier: `${EXTENSION_NAME}.run-custom-command`,
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
      command: {
        command: element.commandIdentifier,
        arguments: element.commandArguments || [],
        title: element.label,
      },
    }
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
