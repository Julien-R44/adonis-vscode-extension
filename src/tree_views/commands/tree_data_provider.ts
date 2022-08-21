import { ThemeIcon, TreeItemCollapsibleState } from 'vscode'
import { commands } from '../../commands/commands'
import type { ProviderResult, TreeDataProvider, TreeItem } from 'vscode'
import type { CommandGenericNode } from '../../contracts'

/**
 * Provide the data to be displayed in the VSCode "Commands" Tree View
 */
export class CommandsTreeDataProvider implements TreeDataProvider<CommandGenericNode> {
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
        arguments: [],
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

    if ('children' in element) {
      return element.children
    }

    return []
  }
}
