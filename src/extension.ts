import { ExtensionContext, languages } from 'vscode'
import { registerAceCommands } from './commands'
import EdgeLinkProvider from './completion/edge/LinkProvider'
import { RouteControllerLinkProvider } from './completion/routes/LinkProvider'
import { registerDocsCommands } from './docs'
import { EdgeFormatterProvider } from './languages'

export function activate(context: ExtensionContext) {
  registerAceCommands(context)
  registerDocsCommands(context)

  const edgeSelector = { language: 'edge', scheme: 'file' }

  const edgeFormatter = new EdgeFormatterProvider()

  context.subscriptions.push(
    languages.registerDocumentFormattingEditProvider(edgeSelector, edgeFormatter),
    languages.registerDocumentRangeFormattingEditProvider(edgeSelector, edgeFormatter)
  )

  const tsSelector = { language: 'typescript', scheme: 'file' }

  const routeLink = languages.registerDocumentLinkProvider(
    tsSelector,
    new RouteControllerLinkProvider()
  )

  const edgeLink = languages.registerDocumentLinkProvider(['edge'], new EdgeLinkProvider())

  context.subscriptions.push(routeLink, edgeLink)
}

export function deactivate() {}
