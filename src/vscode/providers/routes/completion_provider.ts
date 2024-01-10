import ProjectManager from '../../project_manager'
import {
  controllerMethodCompletionRegex,
  controllerNameCompletionRegex,
} from '../../../utilities/regexes'
import { ControllerSuggester } from '../../../suggesters/controller_suggester'
import { CompletionFactory } from '../../factories/completion_factory'
import { ControllerMethodSuggester } from '../../../suggesters/controller_method_suggester'
import type { CompletionItemProvider, Position, TextDocument } from 'vscode'

export default class RouteControllerCompletionProvider implements CompletionItemProvider {
  public async provideCompletionItems(doc: TextDocument, pos: Position) {
    let showMethodSuggestions = false
    let range = doc.getWordRangeAtPosition(pos, controllerNameCompletionRegex)

    if (!range) {
      showMethodSuggestions = true
      range = doc.getWordRangeAtPosition(pos, controllerMethodCompletionRegex)
    }

    const text = doc.getText(range)

    return showMethodSuggestions
      ? await this.getControllerMethodSuggestions(text, doc)
      : await this.getControllerNameSuggestions(text, doc)
  }

  /**
   * Get controller names suggestions based on the provided route controller text.
   *
   * Example of a route controller text is `HomeController.get`.
   *
   * @param text Text to get suggestions for
   * @param doc Document text belongs to
   */
  private async getControllerMethodSuggestions(text: string, doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    if (!project) return []

    const suggestions = await ControllerMethodSuggester.getControllerMethodSuggestions({
      text,
      project,
    })

    return CompletionFactory.fromSuggestions(suggestions)
  }

  /**
   * Get controller methods suggestions based on the provided route controller text.
   *
   * Example of a route controller text is `HomeController.get`.
   *
   * @param text Text to get suggestions for
   * @param doc Document text belongs to
   */
  private async getControllerNameSuggestions(text: string, doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    if (!project) return []

    const suggestions = await ControllerSuggester.geControllerSuggestions({
      text,
      project,
    })

    return CompletionFactory.fromSuggestions(suggestions)
  }
}
