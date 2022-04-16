import { ExtensionContext, languages } from 'vscode'
import { registerAceCommands } from './commands'
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

  context.subscriptions.push(routeLink)
}

export function deactivate() {}
