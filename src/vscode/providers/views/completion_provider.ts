import { CompletionItemKind } from 'vscode'
import ProjectManager from '../../project_manager'
import { ViewSuggester } from '../../../suggesters/view_suggester'
import { tsViewsCompletionRegex } from '../../../utilities/regexes'
import { CompletionFactory } from '../../factories/completion_factory'
import type { CompletionItemProvider, Position, TextDocument } from 'vscode'

export class ViewsCompletionProvider implements CompletionItemProvider {
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
     * Check if we are within a view completion context and return view suggestions if so
     */
    const range = doc.getWordRangeAtPosition(pos, tsViewsCompletionRegex)
    if (!range) return

    const text = doc.getText(range)
    const suggestions = await this.#getViewSuggestions(text, doc)

    return CompletionFactory.fromSuggestions(suggestions, CompletionItemKind.Value)
  }
}
