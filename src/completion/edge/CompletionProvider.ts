import {
  TextDocument,
  Position,
  ProviderResult,
  CompletionItemProvider,
  CompletionItem,
  CompletionItemKind,
  workspace,
} from 'vscode'
import Config from '../../utilities/config'
import { getSuggestions, Suggestion, toCompletionItems } from '../../utilities/suggestion'

class EdgeCompletionProvider implements CompletionItemProvider {
  public provideCompletionItems(
    doc: TextDocument,
    pos: Position
  ): ProviderResult<CompletionItem[]> {
    const regex = new RegExp(Config.autocomplete.viewsCompletionRegex)
    const range = doc.getWordRangeAtPosition(pos, regex)
    if (!range) return

    const text = doc.getText(range)
    const suggestions = this.getViewSuggestions(text, doc)
    return toCompletionItems(suggestions, CompletionItemKind.Value)
  }

  /**
   * Get completion suggestions of view templates, based on the provided text.
   *
   * @param text Text to get suggestions for
   * @param doc Document text belongs to
   */
  private getViewSuggestions(text: string, doc: TextDocument): Suggestion[] {
    const config = Config.autocomplete
    const folder = workspace.getWorkspaceFolder(doc.uri)
    if (!folder) return []

    const suggestions = getSuggestions(
      text,
      folder,
      config.viewsDirectories,
      config.viewsExtensions
    ).map((suggestion) => {
      const txt = suggestion.text.replace(/\/+/g, '.')
      return { ...suggestion, text: txt }
    })

    return suggestions
  }
}

export default EdgeCompletionProvider
