import {
  EventEmitter,
  MarkdownString,
  ThemeIcon,
  type TreeItem,
  TreeItemCollapsibleState,
} from 'vscode'
import { AceExecutor } from '../../services/ace_executor'
import { Extension } from '../../services/extension'
import { Notifier } from '../../services/notifier'
import ProjectManager from '../../services/adonis_project/manager'
import { RouteFactory } from './routes_factory'
import type {
  AceListRoutesResult,
  BaseNode,
  RouteDomainNode,
  RouteGroupNode,
  RouteNode,
} from '../../contracts'
import type { Event, TreeDataProvider } from 'vscode'

type RouteTreeDataProviderPossiblesNodes = RouteNode | RouteGroupNode | RouteDomainNode | BaseNode

/**
 * Provide the data to be displayed in the VSCode "Routes" Tree View
 */
export class RoutesTreeDataProvider
  implements TreeDataProvider<RouteTreeDataProviderPossiblesNodes>
{
  private _onDidChangeTreeData: EventEmitter<any> = new EventEmitter<any>()
  public readonly onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event
  private routes: (RouteDomainNode | RouteGroupNode)[] = []
  private errored = false

  constructor() {
    Extension.routesTreeDataProvider = this
    this.getAllRoutes()
  }

  public refresh() {
    this._onDidChangeTreeData.fire(undefined)
  }

  /**
   * Returns the UI state of the given walked node
   */
  public getTreeItem(element: RouteTreeDataProviderPossiblesNodes): TreeItem | Thenable<TreeItem> {
    if ('children' in element) {
      return {
        collapsibleState: TreeItemCollapsibleState.Collapsed,
        label: element.label,
        description: element.description,
        tooltip: element.description,
        iconPath: element.icon ? new ThemeIcon(element.icon) : undefined,
      }
    }

    if ('pattern' in element) {
      return {
        label: element.label,
        ...(element.path
          ? {
              command: {
                command: 'vscode.open',
                title: 'Open File',
                arguments: [element.path.uri],
              },
              resourceUri: element.path.uri,
            }
          : {}),
        description: element.description,
        contextValue: 'route',
        tooltip: new MarkdownString(
          [
            '#### Endpoint',
            `${element.pattern}`,
            '---',
            '#### Methods',
            `${element.methods.join(' | ')}`,
            '---',
            '#### Handler',
            `Controller: ${element.handler}`,
            `Filename: ${element.filename}`,
            '---',
            '#### Middlewares',
            element.middleware.join(',') || 'None',
            '---',
          ].join('\n\n')
        ),
        iconPath: new ThemeIcon('milestone'),
      }
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
    if (this.errored) {
      return [
        {
          label: 'Error',
          description: 'Error while fetching your routes. See the Output console for more details.',
          icon: 'error',
        },
      ]
    }

    if (!element) {
      return this.routes
    } else if ('children' in element) {
      return element.children
    }

    return []
  }

  public async getAllRoutes() {
    this.errored = false

    // TODO: Here we need to store the adonis projet used in the route view instead
    const adonisProject = ProjectManager.getProjects()[0]!

    try {
      const { result } = await AceExecutor.exec({
        command: 'list:routes --json',
        adonisProject,
        background: true,
      })

      const jsonRoutes = JSON.parse(result!.stdout) as AceListRoutesResult
      this.routes = await RouteFactory.buildRoutesDomainTree(jsonRoutes)
      this.refresh()
    } catch (err) {
      this.errored = true
      Notifier.showError('Error while fetching your routes !', err)
    }
  }
}
