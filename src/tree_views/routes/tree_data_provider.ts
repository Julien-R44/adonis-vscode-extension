import { EventEmitter, ThemeIcon, type TreeItem, TreeItemCollapsibleState } from 'vscode'
import { AceExecutor } from '../../services/ace_executor'
import { Extension } from '../../services/extension'
import { Notifier } from '../../services/notifier'
import ProjectManager from '../../services/adonis_project/manager'
import { RouteFactory } from './routes_factory'
import { RouteNodeItemFactory } from './route_node_item_factory'
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

  private rawRoutes: AceListRoutesResult | null = null
  private routes: RouteTreeDataProviderPossiblesNodes[] = []
  private errored = false
  public flatView = false

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
      return RouteNodeItemFactory.createItem(element)
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

  /**
   * Toggle the flat view
   */
  public toggleFlatView() {
    this.flatView = !this.flatView
    this.buildTreeItems()
  }

  /**
   * Convert the raw routes to a tree structure
   */
  private async buildTreeItems() {
    if (!this.rawRoutes) {
      return
    }

    this.routes = await RouteFactory.buildRoutesDomainTree(this.rawRoutes, this.flatView)
    this.refresh()
  }

  /**
   * Exec list:routes to get the application routes, then convert it to a tree structure
   */
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

      this.rawRoutes = JSON.parse(result!.stdout) as AceListRoutesResult
      this.buildTreeItems()
    } catch (err) {
      this.errored = true
      Notifier.showError('Error while fetching your routes !', err)
    }
  }
}
