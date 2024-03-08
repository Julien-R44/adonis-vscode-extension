import type { SymbolInformation, SymbolKind, type Uri } from 'vscode'
import { Range, Selection, TextEditorRevealType, commands, window } from 'vscode'

import { Notifier } from '../notifier'

/**
 * Open a text document at the given line
 */
export async function showDocumentAtLine(uri: Uri) {
  const uriWithoutFragment = uri.with({ fragment: '' })
  const doc = await window.showTextDocument(uriWithoutFragment)

  // Focus at the line in the uri fragment
  const lineNumber = Number(uri.fragment) - 1
  const range = new Range(lineNumber, 0, lineNumber, 0)

  doc.selection = new Selection(range.start, range.end)
  doc.revealRange(range, TextEditorRevealType.AtTop)
}

/**
 * Show a quick pick to select a symbol from a list of symbols
 */
export async function quickPickSymbol(options: {
  symbols: SymbolInformation[]
  placeholder: string
  title?: string
}) {
  const quickPickItems = options.symbols.map((symbol) => ({
    label: symbol.name,
    description: symbol.containerName,
    detail: symbol.location.uri.fsPath,
    symbol,
  }))

  return window.showQuickPick(quickPickItems, {
    placeHolder: options.placeholder || 'Select a symbol',
    title: options.title,
  })
}

/**
 * Show a quick pick to select a symbol from a list of symbols
 * and open the selected symbol in the editor
 */
export async function pickAndOpenSymbol(options: {
  symbols: SymbolInformation[]
  placeholder: string
  title?: string
}) {
  const selectedSymbol = await quickPickSymbol(options)
  if (selectedSymbol) {
    await window.showTextDocument(selectedSymbol.symbol.location.uri)
  }
}

/**
 * - Search a given symbol of a given kind
 * - If there is only one result, open it
 * - If there are multiple results, show a quick pick to select one
 * - And finally open the selected file in the editor
 */
export async function searchAndOpenSymbol(options: {
  query: string
  symbolKind: SymbolKind
  picker: {
    placeholder: string
    title?: string
  }
}) {
  const symbols = await commands.executeCommand<SymbolInformation[]>(
    'vscode.executeWorkspaceSymbolProvider',
    options.query
  )

  const classSymbols = symbols?.filter((symbol) => symbol.kind === options.symbolKind)

  if (!classSymbols.length) {
    Notifier.showMessage("Couldn't find the symbol.")
    return
  }

  if (classSymbols.length === 1) {
    await window.showTextDocument(classSymbols[0]!.location.uri)
    return
  }

  await pickAndOpenSymbol({
    symbols: classSymbols,
    placeholder: options.picker.placeholder,
    title: options.picker.title,
  })
}
