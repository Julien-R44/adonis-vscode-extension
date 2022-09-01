import { Uri, commands } from 'vscode'
import ProjectManager from '../../services/adonis_project/manager'
import { Extension } from '../../services/extension'
import { Notifier } from '../../services/notifier'
import ExtConfig from '../../utilities/config'
import type { RouteNode } from '../../contracts'
import type { ExtensionContext } from 'vscode'

function refreshRouteCommand() {
  return Extension.routesTreeDataProvider.getAllRoutes()
}

function buildLinkToRoute(route: RouteNode) {
  // TODO: Here we need to store the adonis projet used in the route view instead
  const project = ProjectManager.getProjects()[0]!

  let host = project.env?.HOST || 'localhost'
  const port = project.env?.PORT || '3333'

  if (host === '0.0.0.0') {
    host = 'localhost'
  }

  return `http://${host}:${port}${route.pattern}`
}

function openInBrowserCommand(route: RouteNode) {
  const url = buildLinkToRoute(route)
  commands.executeCommand('vscode.open', Uri.parse(url))
}

function copyLinkCommand(route: RouteNode) {
  const url = buildLinkToRoute(route)
  commands.executeCommand('copy', url)
  Notifier.showMessage('Link was copied to your clipboard.')
}

function toggleFlatRouteViewCommand() {
  Extension.routesTreeDataProvider.toggleFlatView()
  commands.executeCommand(
    'setContext',
    ExtConfig.buildCommandId('view.routes.viewAsList'),
    Extension.routesTreeDataProvider.flatView
  )
}

export const registerRoutesTreeViewCommands = (context: ExtensionContext) => {
  const viewCommands: [string, Function][] = [
    [ExtConfig.buildCommandId('view.routes.refresh'), refreshRouteCommand],
    [ExtConfig.buildCommandId('view.routes.open-in-browser'), openInBrowserCommand],
    [ExtConfig.buildCommandId('view.routes.copy-link'), copyLinkCommand],
    [ExtConfig.buildCommandId('view.routes.viewAsList'), toggleFlatRouteViewCommand],
    [ExtConfig.buildCommandId('view.routes.viewAsTree'), toggleFlatRouteViewCommand],
  ]

  const commandsDisposables = viewCommands.map(([identifier, handler]) =>
    commands.registerCommand(identifier, handler as any)
  )

  context.subscriptions.push(...commandsDisposables)
}
