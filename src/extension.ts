import { ExtensionContext, languages } from 'vscode'
import { registerAceCommands } from './commands'
import EdgeLinkProvider from './completion/edge/LinkProvider'
import RouteControllerHoverProvider from './completion/routes/HoverProvider'
import { RouteControllerLinkProvider } from './completion/routes/LinkProvider'
import { registerDocsCommands } from './docs'
import { EdgeFormatterProvider } from './languages'

export function activate(context: ExtensionContext) {
  /**
   * Commands
   */
  registerAceCommands(context)
  registerDocsCommands(context)

  /**
   * Formatting and syntax
   */
  const edgeSelector = { language: 'edge', scheme: 'file' }
  const edgeFormatter = new EdgeFormatterProvider()

  context.subscriptions.push(
    languages.registerDocumentFormattingEditProvider(edgeSelector, edgeFormatter),
    languages.registerDocumentRangeFormattingEditProvider(edgeSelector, edgeFormatter)
  )

  /**
   * Autocompletion, hover and links
   */
  const tsSelector = { language: 'typescript', scheme: 'file' }

  const routeLink = languages.registerDocumentLinkProvider(
    tsSelector,
    new RouteControllerLinkProvider()
  )

  const routeHover = languages.registerHoverProvider(tsSelector, new RouteControllerHoverProvider())

  const edgeLink = languages.registerDocumentLinkProvider(['edge'], new EdgeLinkProvider())

  context.subscriptions.push(routeLink, routeHover, edgeLink)
}

export function deactivate() {}
