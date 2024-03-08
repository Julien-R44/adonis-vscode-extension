import groupBy from 'lodash.groupby'

import type { AdonisProject } from '../types/projects'
import { RouteNodeFactory } from './nodes/route_node_factory'
import type { AceListRoutesResultV6, RawRouteV6 } from '../types'

export class TreeRoutesBuilder {
  static #EXCLUDED_ROUTES = ['/uploads/*']

  /**
   * Exclude non-important routes
   */
  static #filterExcludedRoutes(routes: RawRouteV6[]) {
    return routes.filter((route) => !this.#EXCLUDED_ROUTES.includes(route.pattern))
  }

  static async #buildRoutesGroupTree(project: AdonisProject, routes: RawRouteV6[]) {
    const filteredRoutes = this.#filterExcludedRoutes(routes)

    const routesGroups = groupBy(filteredRoutes, (route) => {
      /**
       * We ignore the /api/\d+ pattern to make the groups
       */
      const pattern = route.pattern.replace(/^(\/api)?\/v\d+/, '/')
      return pattern.split('/').find(Boolean) || '/'
    })

    const promises = Object.entries(routesGroups).map(async ([groupName, routes]) => ({
      label: groupName,
      description: `${routes.length} routes`,
      icon: 'debug-breakpoint-unverified',
      children: await Promise.all(routes.map((route) => RouteNodeFactory.build(project, route))),
    }))

    return Promise.all(promises)
  }

  /**
   * Build the routes tree
   */
  static build(project: AdonisProject, rawRoutes: AceListRoutesResultV6) {
    if (rawRoutes.length === 1) {
      return this.#buildRoutesGroupTree(project, rawRoutes[0]!.routes)
    }

    const promises = rawRoutes.map(async ({ domain, routes }) => {
      return {
        label: domain,
        description: `${routes.length} routes`,
        icon: 'repo',
        children: await this.#buildRoutesGroupTree(project, routes),
      }
    })

    return Promise.all(promises)
  }

  /**
   * Build the routes tree flattened. No groups by domain or paths
   */
  static buildFlat(project: AdonisProject, rawRoutes: AceListRoutesResultV6) {
    const allRoutes = rawRoutes
      .flatMap(({ routes }) => routes)
      .map((route) => RouteNodeFactory.build(project, route))

    return Promise.all(allRoutes)
  }
}
