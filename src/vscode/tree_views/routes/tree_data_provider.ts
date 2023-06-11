import { pathToFileURL } from 'url'
import {
  EventEmitter,
  MarkdownString,
  ThemeColor,
  ThemeIcon,
  type TreeItem,
  TreeItemCollapsibleState,
  Uri,
} from 'vscode'
import { RoutesOutputConverter } from 'src/routes_tree/routes_output_converter'
import { AceExecutor } from '../../ace_executor'
import { Extension } from '../../extension'
import { Notifier } from '../../notifier'
import ProjectManager from '../../project_manager'
import { TreeRoutesBuilder } from '../../../routes_tree/tree_routes_builder'
import type { RouteNode } from '../../../routes_tree/nodes/route_node_factory'
import type {
  AceListRoutesResultV5,
  AceListRoutesResultV6,
  BaseNode,
  RouteDomainNode,
  RouteGroupNode,
} from '../../../types'
import type { Event, TreeDataProvider } from 'vscode'

type RouteTreeDataProviderPossiblesNodes = RouteNode | RouteGroupNode | RouteDomainNode | BaseNode

/**
 * Provide the data to be displayed in the VSCode "Routes" Tree View
 */
export class RoutesTreeDataProvider
  implements TreeDataProvider<RouteTreeDataProviderPossiblesNodes>
{
  #onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>()

  #routes: RouteTreeDataProviderPossiblesNodes[] = []
  #rawRoutes: AceListRoutesResultV6 = []
  #errored = false

  public flatView = false
  public readonly onDidChangeTreeData: Event<any> = this.#onDidChangeTreeData.event

  constructor() {
    Extension.routesTreeDataProvider = this
    this.getAllRoutes()
  }

  #buildGroupTreeItem(element: RouteGroupNode) {
    return {
      collapsibleState: TreeItemCollapsibleState.Collapsed,
      label: element.label,
      description: element.description,
      tooltip: element.description,
      iconPath: element.icon ? new ThemeIcon(element.icon) : undefined,
    }
  }

  #buildRouteTreeItem(element: RouteNode) {
    const command = {
      title: 'Open Controller',
      command: 'adonis-vscode-extension.view.routes.open-controller',
      arguments: [] as any,
    }

    if (element.controller.found) {
      const uri = Uri.parse(pathToFileURL(element.controller.path).href).with({
        fragment: element.controller.lineNumber.toString(),
      })
      command.arguments = [uri]
    } else if (!element.isClosure) {
      command.arguments = [element.controller.name]
    }

    const contextValue = element.methods.includes('GET') ? 'route/has-get' : 'route/no-get'

    return {
      label: element.label,
      command,
      description: element.description,
      tooltip: new MarkdownString(element.tooltip),
      contextValue,
      iconPath: new ThemeIcon('arrow-circle-right', new ThemeColor(element.color)),
    }
  }

  public refresh() {
    this.#onDidChangeTreeData.fire(undefined)
  }

  /**
   * Returns the UI state of the given walked node
   */
  public getTreeItem(element: RouteTreeDataProviderPossiblesNodes): TreeItem | Thenable<TreeItem> {
    if ('children' in element) {
      return this.#buildGroupTreeItem(element)
    }

    if ('controller' in element) {
      return this.#buildRouteTreeItem(element)
    }

    return {
      label: element.label,
      description: element.description,
      iconPath: element.icon ? new ThemeIcon(element.icon) : undefined,
    }
  }

  /**
   * Returns the children of the given node
   * If `element` is `undefined` then return the root node
   */
  public getChildren(element?: RouteTreeDataProviderPossiblesNodes) {
    if (this.#errored) {
      return [
        {
          label: 'Error',
          description: 'Error while fetching your routes. See the Output console for more details.',
          icon: 'error',
        },
      ]
    }

    if (!element) {
      return this.#routes
    } else if ('children' in element) {
      return element.children
    }

    return []
  }

  async #listRoutesJson() {
    const { result } = await AceExecutor.exec({
      command: 'list:routes --json',
      adonisProject: ProjectManager.currentProject,
      background: true,
    })

    const rawResult = JSON.parse(result!.stdout) as AceListRoutesResultV5 | AceListRoutesResultV6
    if (ProjectManager.currentProject!.isAdonis5()) {
      return RoutesOutputConverter.convert(rawResult as AceListRoutesResultV5)
    }

    return rawResult as AceListRoutesResultV6
  }

  public async toggleFlatView() {
    this.flatView = !this.flatView

    const project = ProjectManager.currentProject
    if (this.flatView) {
      this.#routes = await TreeRoutesBuilder.buildFlat(project, this.#rawRoutes)
    } else {
      this.#routes = await TreeRoutesBuilder.build(project, this.#rawRoutes)
    }

    this.refresh()
  }

  public async getAllRoutes() {
    this.#errored = false
    this.flatView = false

    try {
      const rawRoutes = await this.#listRoutesJson()
      this.#rawRoutes = rawRoutes

      const routes = await TreeRoutesBuilder.build(ProjectManager.currentProject, rawRoutes)
      this.#routes = routes

      this.refresh()
    } catch (err) {
      this.#errored = true
      Notifier.showError('Error while fetching your routes !', err)
    }
  }
}
