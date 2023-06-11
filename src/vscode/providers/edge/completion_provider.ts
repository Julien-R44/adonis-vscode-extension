import { CompletionItem, CompletionItemKind, Range, SnippetString } from 'vscode'
import GlobalEdgeSnippets from '../../../../snippets/edge/globals.json'
import ProjectManager from '../../project_manager'
import { ViewSuggester } from '../../../suggesters/view_suggester'
import { CompletionFactory } from '../../factories/completion_factory'
import { edgeComponentsAsTagsRegex, viewsCompletionRegex } from '../../../utilities/regexes'
import type { CompletionItemProvider, Position, TextDocument } from 'vscode'

class EdgeCompletionProvider implements CompletionItemProvider {
  /**
   * Get completion suggestions of view templates, based on the provided text
   */
  #getViewSuggestions(text: string, doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    if (!project) return []

    return ViewSuggester.getViewSuggestions({ text, project })
  }

  /**
   * Get completion suggestions of components as tags, based on the provided text
   */
  #getComponentsAsTagsSuggestions(text: string, doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    if (!project) return []

    return ViewSuggester.getComponentsAsTagsSuggestions({ text, project })
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
    const basicTagRanges = doc.getWordRangeAtPosition(pos, viewsCompletionRegex)
    if (basicTagRanges) {
      const text = doc.getText(basicTagRanges)
      const suggestions = await this.#getViewSuggestions(text, doc)
      return CompletionFactory.fromSuggestions(suggestions)
    }

    /**
     * Second view completion context possibility : components as tags. We either check if we are
     * in a component as tag context or if the last two characters are '@' or '@!'
     */
    const componentAsTagRange = doc.getWordRangeAtPosition(pos, edgeComponentsAsTagsRegex)
    const lastTwoChars = doc.getText(new Range(pos.translate(0, -2), pos))

    if (componentAsTagRange || lastTwoChars.trim() === '@' || lastTwoChars === '@!') {
      const text = doc.getText(componentAsTagRange)
      const suggestions = await this.#getComponentsAsTagsSuggestions(text, doc)
      return CompletionFactory.fromSuggestions(suggestions)
    }
  }
}

export default EdgeCompletionProvider
