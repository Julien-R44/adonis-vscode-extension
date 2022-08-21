import { relative } from 'path'
import groupBy from 'lodash.groupby'
import { parseControllerString } from '../../utilities/controller'
import { getLineNumber } from '../../utilities/functions'
import { getExactPathMatch } from '../../utilities/path_matching'
import ProjectManager from '../../services/adonis_project/manager'
import type {
  AceListRoutesResult,
  RawRoute,
  RouteDomainNode,
  RouteGroupNode,
  RouteNode,
} from '../../contracts'

export class RouteFactory {
  private static EXCLUDED_ROUTES = ['/uploads/*']

  /**
   * Exclude nn-important routes and routes with handler that is a closure
   */
  private static filterExcludedAndClosureRoutes(routes: RawRoute[]) {
    return routes
      .filter((route) => !this.EXCLUDED_ROUTES.includes(route.pattern))
      .filter((route) => route.handler !== 'Closure')
  }

  /**
   * Build a RouteNode from a RawRoute. The RouteNode is the smallest unit of
   * data that can be displayed in the VSCode "Routes" Tree View.
   */
  private static async buildRouteNode(route: RawRoute): Promise<RouteNode> {
    // TODO: Here we need to store the adonis projet used in the route view instead
    const adonisProject = ProjectManager.getProjects()[0]

    const { name, method } = parseControllerString(route.handler)!
    const path = getExactPathMatch(name, adonisProject!.uri, ['app/controllers'], ['controller.ts'])

    if (path) {
      const number = await getLineNumber(path.uri.fsPath, method)
      path.uri = path.uri.with({ fragment: number.lineno.toString() })
    }

    return {
      ...route,
      description: route.methods.join(', '),
      label: `${route.pattern}`,
      icon: '',
      path,
      filename: relative(adonisProject!.uri.fsPath, path?.uri.fsPath || ''),
    }
  }

  /**
   * Build a RouteGroupNode from a RawRoute array. The RouteGroupNode is a collapsed group
   * of multiples routes grouped by their URL pattern.
   */
  private static async buildRoutesGroupTree(rawRoutes: RawRoute[]): Promise<RouteGroupNode[]> {
    const filteredRoutes = this.filterExcludedAndClosureRoutes(rawRoutes)

    const routesGroups = groupBy(filteredRoutes, (route) => {
      /**
       * We ignore the /api/\d+ pattern to make the groups
       */
      const pattern = route.pattern.replace(/^\/api\/v\d+\//, '/')
      return pattern.split('/').filter(Boolean)[0] || '/'
    })

    const promises = Object.entries(routesGroups)
      .map(async ([groupName, routes]) => {
        return {
          label: groupName,
          description: `${routes.length} routes`,
          icon: 'debug-breakpoint-unverified',
          children: await Promise.all(routes.map(this.buildRouteNode.bind(this))),
        }
      })
      .filter((promise) => promise !== undefined)

    return Promise.all(promises)
  }

  private static buildFlattenedRouteNodeTree(rawRoutes: AceListRoutesResult) {
    const flattenedRawRoutes = Object.entries(rawRoutes)
      .map(([domain, domainRoutes]) => domainRoutes.map((route) => ({ ...route, domain })))
      .flat()

    const promises = this.filterExcludedAndClosureRoutes(flattenedRawRoutes).map((route) =>
      this.buildRouteNode(route)
    )

    return Promise.all(promises)
  }

  public static async buildRoutesDomainTree(
    rawRoutes: AceListRoutesResult,
    flattened = false
  ): Promise<RouteDomainNode[] | RouteGroupNode[] | RouteNode[]> {
    if (flattened) {
      return this.buildFlattenedRouteNodeTree(rawRoutes)
    }

    if (Object.values(rawRoutes).length === 1) {
      return this.buildRoutesGroupTree(rawRoutes.root)
    }

    const promises = Object.entries(rawRoutes).map(async ([domain, routes]) => {
      return {
        label: domain,
        description: `${routes.length} routes`,
        icon: 'repo',
        children: await this.buildRoutesGroupTree(routes),
      }
    })

    return Promise.all(promises)
  }
}
