import { CompletionItemKind } from 'vscode'
import { SuggestionProvider } from '../../services/suggestion_provider'
import { SuggestionType } from '../../contracts'
import ProjectManager from '../../services/adonis_project/manager'
import ExtConfig from '../../utilities/config'
import type { CompletionItemProvider, Position, TextDocument } from 'vscode'

export class ViewsCompletionProvider implements CompletionItemProvider {
  public async provideCompletionItems(doc: TextDocument, pos: Position) {
    /**
     * Check if we are within a view completion context and return view suggestions if so
     */
    const regex = new RegExp(ExtConfig.autocomplete.tsViewsCompletionRegex)
    const range = doc.getWordRangeAtPosition(pos, regex)
    if (!range) return

    const text = doc.getText(range)

    const suggestions = await this.getViewSuggestions(text, doc)
    return SuggestionProvider.toCompletionItems(suggestions, CompletionItemKind.Value)
  }

  /**
   * Get completion suggestions of view templates, based on the provided text.
   *
   * @param text Text to get suggestions for
   * @param doc Document text belongs to
   */
  private getViewSuggestions(text: string, doc: TextDocument) {
    const config = ExtConfig.autocomplete

    const project = ProjectManager.getProjectFromFile(doc.uri.path)
    if (!project) return []

    return SuggestionProvider.getSuggestions(
      text,
      project,
      config.viewsDirectories,
      config.viewsExtensions,
      SuggestionType.View
    )
  }
}
