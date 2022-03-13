import { ExtensionContext, languages } from 'vscode'
import { registerAceCommands } from './commands'
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
}

export function deactivate() {}
