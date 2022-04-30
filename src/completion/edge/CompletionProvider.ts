import {
  TextDocument,
  Position,
  ProviderResult,
  CompletionItemProvider,
  CompletionItem,
  CompletionItemKind,
  workspace,
  SnippetString,
} from 'vscode'
import Config from '../../utilities/config'
import GlobalEdgeSnippets from '../../../snippets/edge/globals.json'
import { Suggestion, SuggestionMatcher } from '../../services/SuggestionMatcher'
import Extension from '../../Extension'

class EdgeCompletionProvider implements CompletionItemProvider {
  public provideCompletionItems(
    doc: TextDocument,
    pos: Position
  ): ProviderResult<CompletionItem[]> {
    /**
     * Create a completion item for each globals edge snippets
     */
    const snippetCompletionItems = Object.entries(GlobalEdgeSnippets).map(([label, snippet]) => {
      const item = new CompletionItem(label, CompletionItemKind.Snippet)
      item.detail = snippet.description
      item.insertText = new SnippetString(snippet.body)
      return item
    })

    /**
     * Check if we are in curly brace and return snippets if so
     */
    const isInMustache = doc.getWordRangeAtPosition(pos, /{{([^}].|\s)+}}/)
    if (isInMustache) {
      return snippetCompletionItems
    }

    /**
     * Check if we are within a view completion context and return view suggestions if so
     */
    const regex = new RegExp(Config.autocomplete.viewsCompletionRegex)
    const range = doc.getWordRangeAtPosition(pos, regex)
    if (!range) return

    const text = doc.getText(range)
    const suggestions = this.getViewSuggestions(text, doc)
    return SuggestionMatcher.toCompletionItems(suggestions, CompletionItemKind.Value)
  }

  /**
   * Get completion suggestions of view templates, based on the provided text.
   *
   * @param text Text to get suggestions for
   * @param doc Document text belongs to
   */
  private getViewSuggestions(text: string, doc: TextDocument): Suggestion[] {
    const config = Config.autocomplete

    const project = Extension.getAdonisProjectFromFile(doc.uri.path)
    if (!project) return []

    const suggestions = SuggestionMatcher.getSuggestions(
      text,
      project,
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
