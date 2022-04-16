import { ExtensionContext, languages } from 'vscode'
import { registerAceCommands } from './commands'
import EdgeLinkProvider from './completion/edge/LinkProvider'
import RouteControllerCompletionProvider from './completion/routes/CompletionProvider'
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
   * Autocompletion, hover and links for TS files
   */
  const tsSelector = { language: 'typescript', scheme: 'file' }

  const routeLink = languages.registerDocumentLinkProvider(
    tsSelector,
    new RouteControllerLinkProvider()
  )

  const routeHover = languages.registerHoverProvider(tsSelector, new RouteControllerHoverProvider())
  const routeCompletion = languages.registerCompletionItemProvider(
    tsSelector,
    new RouteControllerCompletionProvider()
  )

  /**
   * Autocompletion, hover and links for Edge files
   */
  const edgeLink = languages.registerDocumentLinkProvider(['edge'], new EdgeLinkProvider())

  context.subscriptions.push(routeLink, routeHover, routeCompletion, edgeLink)
}

export function deactivate() {}
