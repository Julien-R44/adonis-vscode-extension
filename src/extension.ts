import { ExtensionContext, languages } from 'vscode'
import { registerAceCommands } from './commands'
import { registerDocsCommands } from './docs'
import { EdgeFormatterProvider } from './languages'

export function activate(context: ExtensionContext) {
  registerAceCommands(context)
  registerDocsCommands(context)

  const edgeSelector = { language: 'edge', scheme: 'file' }

  // const edgeHover = languages.registerHoverProvider(edgeSelector, new EdgeHoverProvider())

  // const edgeLink = languages.registerDocumentLinkProvider(edgeSelector, new EdgeLinkProvider())

  // const edgeCompletion = languages.registerCompletionItemProvider(
  //   edgeSelector,
  //   new EdgeCompletionProvider()
  // )

  const edgeFormatters = [
    languages.registerDocumentFormattingEditProvider(edgeSelector, new EdgeFormatterProvider()),

    languages.registerDocumentRangeFormattingEditProvider(
      edgeSelector,
      new EdgeFormatterProvider()
    ),
  ]

  context.subscriptions.push(...edgeFormatters)
  // context.subscriptions.push(edgeHover)
}

export function deactivate() {}
