import type { AdonisProject } from '../types/projects'
import { RouteNodeFactory } from './nodes/route_node_factory'
import type { AceListRoutesResultV6, RawRouteV6 } from '../types'
import type { RouteNodeDetails } from './nodes/route_node_factory'

export interface TreeRouteNode {
  icon: string
  segment: string
  children: Array<TreeRouteNode>
  endpointsCount?: number
  endpoints: { label: string; description: string; icon: string; node: RouteNodeDetails }[]
}

export class TreeRoutesBuilder {
  static #EXCLUDED_ROUTES = ['/uploads/*']

  /**
   * Exclude non-important routes
   */
  static #filterExcludedRoutes(routes: RawRouteV6[]) {
    return routes.filter((route) => !this.#EXCLUDED_ROUTES.includes(route.pattern))
  }

  static #urlTrie(urls: string[], skipEmpty = false) {
    interface TrieNode {
      amount: number
      children?: Record<string, TrieNode>
    }

    const result: TrieNode = {}

    for (const url of urls) {
      const parts = url.split('/').filter((x) => x.trim())

      let parentparts: string[] = []
      let current = result
      for (let j = 0; j < parts.length; j++) {
        const part = parts[j]
        const partstohere = parentparts.concat(part)
        const id = partstohere.join('/')

        if (!current[id]) {
          current[id] = { amount: 0 }
        }
        current[id].amount += 1

        if (j === parts.length - 1) {
          // last part
          current[id].url = url
        } else {
          // descend
          current[id].children = current[id].children || {}
          current = current[id].children
          parentparts = partstohere
        }
      }
    }

    this.#skipEmpty(result)

    return result
  }

  static #skipEmpty(node: any, justThisId?: string) {
    const ids = justThisId ? [justThisId] : Object.keys(node)

    for (const id of ids) {
      const child = node[id]

      if (!child) continue

      const nextkeys = child.children ? Object.keys(child.children) : []
      if (nextkeys.length === 1 && !child.url) {
        const nextid = nextkeys[0]

        // skipping this child
        const grandchild = child.children[nextid]
        delete node[id]
        node[nextid] = grandchild
        this.#skipEmpty(node, nextid)
      } else {
        // just recurse into the children children
        if (child.children) {
          this.#skipEmpty(child.children)
        }
      }
    }
  }

  static async #buildRoutesGroupTree(project: AdonisProject, routes: RawRouteV6[]) {
    const filteredRoutes = this.#filterExcludedRoutes(routes)

    // const root: TreeRouteNode = {
    //   segment: '',
    //   children: [],
    //   endpoints: [],
    //   icon: 'debug-breakpoint-unverified',
    // }

    // for (const endpoint of filteredRoutes) {
    //   const segments = endpoint.pattern.split('/').filter((s) => s !== '')
    //   let current = root

    //   for (const segment of segments) {
    //     const existing = current.children.find((child) => child.segment === segment)
    //     if (!existing) {
    //       const newNode = {
    //         segment,
    //         children: [],
    //         endpoints: [],
    //         endpointsCount: 0,
    //         icon: 'debug-breakpoint-unverified',
    //       }
    //       current.children.push(newNode)
    //     }
    //     current.endpointsCount!++
    //     current = current.children.find((child) => child.segment === segment)!
    //   }

    //   current.endpoints.push({
    //     label: segments[segments.length - 1]!,
    //     description: `${routes.length} routes`,
    //     icon: 'debug-breakpoint-unverified',
    //     node: await RouteNodeFactory.build(project, endpoint),
    //   })
    // }

    return this.#urlTrie(filteredRoutes.map((route) => route.pattern))
    // return root
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
