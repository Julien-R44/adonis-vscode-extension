import { EventEmitter, ThemeIcon, TreeItemCollapsibleState } from 'vscode'
import ProjectManager from '../../project_manager'
import { Extension } from '../../extension'
import type { AceCommandNode } from '../../../types/projects'
import type { Event, ProviderResult, TreeDataProvider, TreeItem } from 'vscode'

/**
 * Provide the data to be displayed in the VSCode "Commands" Tree View
 */
export class CommandsTreeDataProvider implements TreeDataProvider<AceCommandNode> {
  #onDidChangeTreeData = new EventEmitter()
  #tree: AceCommandNode[] = []

  public readonly onDidChangeTreeData: Event<any> = this.#onDidChangeTreeData.event

  constructor() {
    Extension.commandsTreeDataProvider = this
    ProjectManager.onDidChangeProject(() => {
      this.buildTree()
      this.refresh()
    })
    this.buildTree()
  }

  /**
   * Refresh the tree view
   */
  public refresh() {
    this.#onDidChangeTreeData.fire(undefined)
  }

  /**
   * Returns the UI state of the given walked node
   */
  public getTreeItem(element: AceCommandNode): TreeItem | Thenable<TreeItem> {
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
      contextValue: element.absoluteFilePath ? 'custom-command' : 'command',
    }
  }

  /**
   * Returns the children of the given node
   * If `element` is `undefined` then return the root node
   */
  public getChildren(element?: AceCommandNode): ProviderResult<AceCommandNode[]> {
    if (!element) {
      return this.#tree
    }

    if ('children' in element) {
      return element.children as any
    }

    return []
  }

  public async buildTree() {
    this.#tree = await ProjectManager.currentProject.getCommands()
    this.refresh()
  }
}
