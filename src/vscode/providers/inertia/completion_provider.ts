import { CompletionItemKind } from 'vscode'
import type { CompletionItemProvider, Position, TextDocument } from 'vscode'

import ExtConfig from '../../utilities/config'
import ProjectManager from '../../project_manager'
import { inertiaCompletionRegex } from '../../../utilities/regexes'
import { CompletionFactory } from '../../factories/completion_factory'
import { InertiaSuggester } from '../../../suggesters/inertia_suggester'

export class InertiaCompletionProvider implements CompletionItemProvider {
  /**
   * Get completion suggestions of inertia pages
   */
  #getInertiaSuggestions(text: string, doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    if (!project) return []

    return InertiaSuggester.getInertiaSuggestions({
      text,
      project,
      pagesDirectory: ExtConfig.inertia.pagesDirectory,
    })
  }

  async provideCompletionItems(doc: TextDocument, pos: Position) {
    /**
     * Check if we are within a inertia completion context and return suggestions if so
     */
    const range = doc.getWordRangeAtPosition(pos, inertiaCompletionRegex)
    if (!range) return

    const text = doc.getText(range)
    const suggestions = await this.#getInertiaSuggestions(text, doc)

    return CompletionFactory.fromSuggestions(suggestions, CompletionItemKind.Value)
  }
}
