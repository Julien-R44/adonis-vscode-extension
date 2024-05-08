import * as vscode from 'vscode'
import { pathToFileURL } from 'node:url'
import type { Event, TreeDataProvider, TreeItem } from 'vscode'

import { Notifier } from '#vscode/notifier'
import { Extension } from '#vscode/extension'
import ProjectManager from '#vscode/project_manager'
import { TreeRoutesBuilder } from '#/routes_tree/tree_routes_builder'
import type { RouteNodeDetails } from '#/routes_tree/nodes/route_node_factory'
import type { AceListRoutesResultV6, BaseNode, RouteDomainNode, RouteGroupNode } from '#types/index'

type RouteTreeDataProviderPossiblesNodes =
  | RouteNodeDetails
  | RouteGroupNode
  | RouteDomainNode
  | BaseNode

/**
 * Provide the data to be displayed in the VSCode "Routes" Tree View
 */
export class RoutesTreeDataProvider
  implements TreeDataProvider<RouteTreeDataProviderPossiblesNodes>
{
  #onDidChangeTreeData = new vscode.EventEmitter()

  #routes: RouteTreeDataProviderPossiblesNodes[] = []
  #rawRoutes: AceListRoutesResultV6 = []
  #errored = false

  flatView = false
  readonly onDidChangeTreeData: Event<any> = this.#onDidChangeTreeData.event

  constructor() {
    Extension.routesTreeDataProvider = this
    this.getAllRoutes()
  }

  #buildGroupTreeItem(element: RouteGroupNode) {
    return {
      collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
      label: element.label,
      description: element.description,
      tooltip: element.description,
      iconPath: element.icon ? new vscode.ThemeIcon(element.icon) : undefined,
    }
  }

  #buildRouteTreeItem(element: RouteNodeDetails) {
    const command = {
      title: 'Open Controller',
      command: 'adonis-vscode-extension.view.routes.open-controller',
      arguments: [] as any,
    }

    if (element.controller.found) {
      const uri = vscode.Uri.parse(pathToFileURL(element.controller.path).href).with({
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
      tooltip: new vscode.MarkdownString(element.tooltip),
      contextValue,
      iconPath: new vscode.ThemeIcon('arrow-circle-right', new vscode.ThemeColor(element.color)),
    }
  }

  refresh() {
    this.#onDidChangeTreeData.fire(undefined)
  }

  /**
   * Returns the UI state of the given walked node
   */
  getTreeItem(element: RouteTreeDataProviderPossiblesNodes): TreeItem | Thenable<TreeItem> {
    console.log(element)
    if ('children' in element && element.children.length > 0) {
      return {
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        tooltip: element.description,
        iconPath: element.icon ? new vscode.ThemeIcon(element.icon) : undefined,
        label: element.segment,
        description: `${element.endpointsCount} endpoints`,
      }
    }

    // return {
    //   label: element.node.label,
    //   description: element.node.description,
    //   iconPath: element.node.icon ? new vscode.ThemeIcon(element.node.icon) : undefined,
    // }

    if ('node' in element) {
      return this.#buildRouteTreeItem({
        label: element.node.label,
        ...element.node,
      })
    }

    if ('endpoints' in element && element.endpoints.length > 0) {
      return {
        collapsibleState: vscode.TreeItemCollapsibleState.Collapsed,
        tooltip: element.description,
        iconPath: element.icon ? new vscode.ThemeIcon(element.icon) : undefined,
        label: element.endpoints[0].label,
        description: `${element.endpointsCount} endpoints`,
      }
    }

    return {}
  }

  /**
   * Returns the children of the given node
   * If `element` is `undefined` then return the root node
   */
  getChildren(element?: RouteTreeDataProviderPossiblesNodes) {
    if (this.#errored) {
      return [
        {
          label: 'Error',
          description: 'Error while fetching your routes. See the Output console for more details.',
          icon: 'error',
        },
      ]
    }

    console.log(this.#routes)
    if (!element) {
      return [...this.#routes.children]
    } else if ('endpoints' in element) {
      return [...element.children, ...element.endpoints]
    } else if ('children' in element) {
      return [...element.children]
    } else if ('node' in element) {
      return this.#routes
    }

    return []
  }

  async toggleFlatView() {
    this.flatView = !this.flatView

    const project = ProjectManager.currentProject
    if (this.flatView) {
      this.#routes = await TreeRoutesBuilder.buildFlat(project, this.#rawRoutes)
    } else {
      this.#routes = await TreeRoutesBuilder.build(project, this.#rawRoutes)
    }

    this.refresh()
  }

  async getAllRoutes() {
    this.#errored = false
    this.flatView = false

    try {
      this.#rawRoutes = await ProjectManager.currentProject.getRoutes()
      this.#routes = await TreeRoutesBuilder.build(ProjectManager.currentProject, this.#rawRoutes)

      this.refresh()
    } catch (err) {
      this.#errored = true
      this.refresh()
      Notifier.showError('Error while fetching your routes !', err)
    }
  }
}
