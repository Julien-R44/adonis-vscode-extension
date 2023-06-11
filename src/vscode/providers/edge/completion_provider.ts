import { CompletionItem, CompletionItemKind, SnippetString } from 'vscode'
import GlobalEdgeSnippets from '../../../../snippets/edge/globals.json'
import ProjectManager from '../../project_manager'
import { ViewSuggester } from '../../../suggesters/view_suggester'
import { CompletionFactory } from '../../factories/completion_factory'
import { viewsCompletionRegex } from '../../../utilities/regexes'
import type { CompletionItemProvider, Position, TextDocument } from 'vscode'

class EdgeCompletionProvider implements CompletionItemProvider {
  /**
   * Get completion suggestions of view templates, based on the provided text.
   */
  #getViewSuggestions(text: string, doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    if (!project) return []

    return ViewSuggester.getViewSuggestions({ text, project })
  }

  async provideCompletionItems(doc: TextDocument, pos: Position) {
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
    const range = doc.getWordRangeAtPosition(pos, viewsCompletionRegex)
    if (!range) return

    const text = doc.getText(range)
    const suggestions = await this.#getViewSuggestions(text, doc)
    return CompletionFactory.fromSuggestions(suggestions)
  }
}

export default EdgeCompletionProvider
