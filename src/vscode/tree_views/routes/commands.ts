import type { ExtensionContext } from 'vscode'
import vscode, { SymbolKind, Uri, commands } from 'vscode'

import { Notifier } from '#vscode/notifier'
import { Extension } from '#vscode/extension'
import ExtConfig from '#vscode/utilities/config'
import ProjectManager from '#vscode/project_manager'
import type { RouteNode } from '#/routes_tree/nodes/route_node_factory'
import { searchAndOpenSymbol, showDocumentAtLine } from '#vscode/utilities'

function refreshRouteCommand() {
  return Extension.routesTreeDataProvider.getAllRoutes()
}

async function openControllerCommand(uriOrSymbol?: Uri) {
  const project = ProjectManager.getCurrentProject()

  if (!project) {
    return
  }

  if (uriOrSymbol instanceof Uri) {
    const uri = uriOrSymbol
    await showDocumentAtLine(uri)
    return
  }

  if (typeof uriOrSymbol === 'string') {
    await searchAndOpenSymbol({
      query: uriOrSymbol,
      symbolKind: SymbolKind.Class,
      picker: { placeholder: 'Select a controller', title: 'Select a controller' },
    })
  }
}

function openInBrowserCommand(route: RouteNode) {
  commands.executeCommand('vscode.open', Uri.parse(route.url))
}

function copyLinkCommand(route: RouteNode) {
  vscode.env.clipboard.writeText(route.url)
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
  const viewCommands: [string, (...args: any) => any][] = [
    [ExtConfig.buildCommandId('view.routes.refresh'), refreshRouteCommand],
    [ExtConfig.buildCommandId('view.routes.open-in-browser'), openInBrowserCommand],
    [ExtConfig.buildCommandId('view.routes.copy-link'), copyLinkCommand],
    [ExtConfig.buildCommandId('view.routes.viewAsList'), toggleFlatRouteViewCommand],
    [ExtConfig.buildCommandId('view.routes.viewAsTree'), toggleFlatRouteViewCommand],
    [ExtConfig.buildCommandId('view.routes.open-controller'), openControllerCommand],
  ]

  const commandsDisposables = viewCommands.map(([identifier, handler]) =>
    commands.registerCommand(identifier, handler as any)
  )

  context.subscriptions.push(...commandsDisposables)
}
