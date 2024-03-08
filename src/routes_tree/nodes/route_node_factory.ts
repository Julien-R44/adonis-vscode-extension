import { relative } from 'path'
import { pascalCase } from 'change-case'
import { parseMagicString, slash } from '../../utilities'
import { arraysEqual, controllerMagicStringToPath, getLineNumber } from '../../utilities/misc'
import type { AdonisProject } from '../../types/projects'
import type { HttpMethod, RawRouteV6 } from '../../types'

export interface RouteNode {
  /**
   * Description of the route Node. All HTTP methods
   */
  description: string

  /**
   * Label of the route node. Route pattern
   */
  label: string

  /**
   * Color of the route node. Depends on the HTTP method
   */
  color: string

  /**
   * Tooltip of the route node. All the information about the route
   */
  tooltip: string

  /**
   * If the route is handled by a closure
   */
  isClosure: boolean
  controller: {
    pattern: string
    lineNumber: number
    name: string
  } & ({ found: true; path: string } | { found: false; path: null })

  /**
   * The full URL to the route with the dev server in local
   */
  url: string

  middleware: string[]

  methods: HttpMethod[]
}

export class RouteNodeFactory {
  static #getRouteColor(route: RawRouteV6) {
    if (arraysEqual(route.methods, ['GET', 'HEAD']) || arraysEqual(route.methods, ['GET'])) {
      return 'charts.blue'
    } else if (arraysEqual(route.methods, ['POST'])) {
      return 'charts.green'
    } else if (arraysEqual(route.methods, ['PUT']) || arraysEqual(route.methods, ['PATCH'])) {
      return 'charts.yellow'
    } else if (arraysEqual(route.methods, ['DELETE'])) {
      return 'charts.red'
    }

    return 'charts.foreground'
  }

  static #buildTooltip(project: AdonisProject, route: RouteNode) {
    const relativePath = route.controller.found
      ? slash(relative(project.path, route.controller.path))
      : 'Not found'

    const controllerSection = route.controller.found
      ? [
          '#### Handler',
          `Controller: ${pascalCase(route.controller.name)}`,
          `Filename: ${relativePath}`,
          '---',
        ]
      : []

    return [
      '#### Endpoint',
      `${route.label}`,
      '---',
      '#### Methods',
      `${route.description}`,
      '---',
      ...controllerSection,
      '#### Middlewares',
      route.middleware.length ? route.middleware : 'None',
      '---',
    ].join('\n\n')
  }

  static #buildUrl(project: AdonisProject, route: RawRouteV6) {
    let host = project.env?.HOST || 'localhost'
    if (host === '0.0.0.0') host = 'localhost'

    const port = project.env?.PORT || '3333'
    return `http://${host}:${port}${route.pattern}`
  }

  static async build(project: AdonisProject, item: RawRouteV6) {
    const isClosure = item.handler.type === 'closure'

    const controller = parseMagicString(item.handler.moduleNameOrPath || '')

    let path: string | null = null
    if (controller) {
      path = controllerMagicStringToPath(project, controller)
    }

    let lineNumber = -1
    if (path) {
      const getLineNumberResult = await getLineNumber(path, item.handler.method)
      lineNumber = getLineNumberResult.lineno
    }

    const node: RouteNode = {
      description: item.methods.join(', '),
      label: item.pattern === '/*' ? '*' : `${item.pattern}`,
      color: this.#getRouteColor(item),
      tooltip: '',
      isClosure,
      // @ts-expect-error
      controller: {
        name: controller?.name || 'Unknown',
        found: !!path,
        path,
        lineNumber,
        pattern: item.pattern,
      },
      url: this.#buildUrl(project, item),
      middleware: item.middleware,
      methods: item.methods,
    }

    const tooltip = this.#buildTooltip(project, node)

    return {
      ...node,
      tooltip,
    }
  }
}
