import { parseMagicString } from '../utilities'
import type { AceListRoutesResultV5, AceListRoutesResultV6, RawRoute } from '../types'

export class RoutesOutputConverter {
  /**
   * Convert a single route from V5 to V6
   */
  static #convertV5Route(route: RawRoute) {
    const magicString = parseMagicString(route.handler)

    const handlerType = route.handler === 'Closure' ? 'closure' : 'controller'
    const moduleNameOrPath = route.handler === 'Closure' ? 'closure' : route.handler

    return {
      name: route.name,
      pattern: route.pattern,
      methods: route.methods,
      handler: {
        type: handlerType as 'controller' | 'closure',
        moduleNameOrPath,
        method: magicString?.method || '',
      },
      middleware: route.middleware || [],
    }
  }

  /**
   * Convert the Adonis V5 output of node ace list:routes --json to the format
   * of the Adonis V6 output
   */
  static convert(data: AceListRoutesResultV5): AceListRoutesResultV6 {
    const result: AceListRoutesResultV6 = []

    for (const [domain, routes] of Object.entries(data)) {
      const newRoutes = routes.map((route) => this.#convertV5Route(route))
      result.push({ domain, routes: newRoutes })
    }

    return result
  }
}
