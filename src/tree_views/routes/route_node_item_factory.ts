import { MarkdownString, ThemeColor, ThemeIcon } from 'vscode'
import { arraysEqual } from '../../utilities/misc'
import type { TreeItem } from 'vscode'
import type { RouteNode } from '../../contracts'

export class RouteNodeItemFactory {
  /**
   * Create a color for the route based on the HTTP Methods
   */
  private static getRouteColor(route: RouteNode) {
    if (arraysEqual(route.methods, ['GET', 'HEAD'])) {
      return new ThemeColor('charts.blue')
    }

    if (arraysEqual(route.methods, ['POST'])) {
      return new ThemeColor('charts.green')
    }

    if (arraysEqual(route.methods, ['PUT']) || arraysEqual(route.methods, ['PATCH'])) {
      return new ThemeColor('charts.yellow')
    }

    if (arraysEqual(route.methods, ['DELETE'])) {
      return new ThemeColor('charts.red')
    }

    return new ThemeColor('charts.foreground')
  }

  /**
   * Build the tooltip associated with the route
   */
  private static buildTooltip(route: RouteNode) {
    return new MarkdownString(
      [
        '#### Endpoint',
        `${route.pattern}`,
        '---',
        '#### Methods',
        `${route.methods.join(' | ')}`,
        '---',
        '#### Handler',
        `Controller: ${route.handler}`,
        `Filename: ${route.filename}`,
        '---',
        '#### Middlewares',
        route.middleware.join(',') || 'None',
        '---',
      ].join('\n\n')
    )
  }

  /**
   * Create a TreeItem for the given RouteNode
   */
  public static createItem(route: RouteNode): TreeItem {
    const matchingControllerHasBeenFound = !!route.path

    return {
      label: route.label,
      ...(matchingControllerHasBeenFound
        ? {
            command: {
              command: 'vscode.open',
              title: 'Open File',
              arguments: [route.path!.uri],
            },
            resourceUri: route.path!.uri,
          }
        : {}),
      description: route.description,
      contextValue: 'route',
      tooltip: this.buildTooltip(route),
      iconPath: new ThemeIcon('arrow-circle-right', this.getRouteColor(route)),
    }
  }
}
