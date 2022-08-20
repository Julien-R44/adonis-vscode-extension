import { ThemeIcon, TreeItemCollapsibleState, window } from 'vscode'
import { HelpAndFeedbackView } from 'vscode-ext-help-and-feedback-view'
import { commands } from '../commands/commands'
import type { Command, Link } from 'vscode-ext-help-and-feedback-view'
import type { ExtensionContext, ProviderResult, TreeDataProvider, TreeItem } from 'vscode'
import type { CommandGenericNode } from '../contracts'

/**
 * Responsible for adding the AdonisJS logo on the VSCode Sidebar
 * ( Tree View ) and create the UI interface
 */
export class ViewContainer {
  /**
   * Create the "Get Help" view
   */
  public static createGetHelpView(context: ExtensionContext) {
    const items: (Link | Command)[] = []

    items.push(
      {
        icon: 'github',
        title: 'Report an issue on the extension',
        url: 'https://github.com/Julien-R44/adonis-vscode-extension/issues/new/choose',
      },
      {
        icon: 'question',
        title: 'Ask a question on GitHub Discussions',
        url: 'https://github.com/adonisjs/core/discussions',
      },
      {
        icon: 'organization',
        title: 'Join Discord community',
        url: 'https://discord.com/invite/vDcEjq6',
      },
      {
        icon: 'repo',
        title: 'Access the extension repo',
        url: 'https://github.com/Julien-R44/adonis-vscode-extension',
      },
      {
        icon: 'remote-explorer-documentation',
        title: 'See AdonisJS documentation',
        url: 'https://docs.adonisjs.com/',
      },
      {
        icon: 'remote-explorer-documentation',
        title: 'See Japa documentation',
        url: 'https://japa.dev/',
      },
      {
        icon: 'package',
        title: 'See AdonisJS packages',
        url: 'https://packages.adonisjs.com',
      },
      {
        icon: 'heart',
        title: 'Become a Sponsor',
        url: 'https://github.com/sponsors/Julien-R44',
      }
    )

    new HelpAndFeedbackView(context, 'adonisjs.help', items)
  }

  /**
   * Create the "Explorer" view with the different ace commands
   */
  public static createExplorerView(_context: ExtensionContext) {
    const treeDataProvider = new CommandsTreeDataProvider()

    window.createTreeView('adonisjs.home', { treeDataProvider })
  }
}

/**
 * Provide the data to be displayed in the VSCode Tree View
 */
class CommandsTreeDataProvider implements TreeDataProvider<CommandGenericNode> {
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
        children: group.children.map((command) => ({
          commandIdentifier: command.commandIdentifier,
          label: command.aceCommand,
          description: command.description,
        })),
      }))
    }

    // @ts-expect-error TODO: fixme
    return element.children
  }
}
