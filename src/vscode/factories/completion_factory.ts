import { CompletionItem, CompletionItemKind, MarkdownString } from 'vscode'
import type { Suggestion } from '../../types'

export class CompletionFactory {
  public static fromSuggestions(suggestions: Suggestion[], itemKind = CompletionItemKind.Value) {
    return suggestions.map((suggestion) => {
      const item = new CompletionItem(suggestion.text, itemKind)
      item.documentation = new MarkdownString(suggestion.documentation as string)
      item.detail = suggestion.detail
      return item
    })
  }
}
