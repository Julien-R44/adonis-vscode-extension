import Config from '../../utilities/config'
import { getMethodsInSourceFile } from '../../utilities/functions'
import { parseControllerString } from '../../utilities/controller'
import { SuggestionProvider } from '../../services/suggestion_provider'
import { SuggestionType } from '../../contracts'
import ProjectManager from '../../services/adonis_project/manager'
import type { CompletionItemProvider, Position, TextDocument } from 'vscode'

const {
  controllersDirectories,
  controllersExtensions,
  controllersNameCompletionRegex: controllerNamePattern,
  controllersMethodCompletionRegex: controllerMethodPattern,
} = Config.autocomplete

class RouteControllerCompletionProvider implements CompletionItemProvider {
  public async provideCompletionItems(doc: TextDocument, pos: Position) {
    let showMethodSuggestions = false
    let range = this.matchPatternInDocument(controllerNamePattern, doc, pos)

    if (!range) {
      showMethodSuggestions = true
      range = this.matchPatternInDocument(controllerMethodPattern, doc, pos)
    }

    const text = doc.getText(range)
    const suggestions = showMethodSuggestions
      ? await this.getControllerMethodSuggestions(text, doc)
      : await this.getControllerNameSuggestions(text, doc)

    return SuggestionProvider.toCompletionItems(suggestions)
  }

  /**
   * Match a given pattern in a text document begining from a specified postion.
   *
   * @param pattern Pattern to match for
   * @param doc Document to match in
   * @param pos Postion in document to begin matching from
   */
  private matchPatternInDocument(pattern: string, doc: TextDocument, pos: Position) {
    const regex = new RegExp(pattern, 'gi')
    return doc.getWordRangeAtPosition(pos, regex)
  }

  /**
   * Get controller names suggestions based on the provided route controller text.
   *
   * Example of a route controller text is `HomeController.get`.
   *
   * @param text Text to get suggestions for
   * @param doc Document text belongs to
   */
  private async getControllerNameSuggestions(text: string, doc: TextDocument) {
    const controller = parseControllerString(text)
    if (controller) text = controller.name

    const project = ProjectManager.getProjectFromFile(doc.uri.path)
    if (!project) return []

    return SuggestionProvider.getSuggestions(
      text,
      project,
      controllersDirectories,
      controllersExtensions,
      SuggestionType.ControllerName
    )
  }

  /**
   * Get controller methods suggestions based on the provided route controller text.
   *
   * Example of a route controller text is `HomeController.get`.
   *
   * @param text Text to get suggestions for
   * @param doc Document text belongs to
   */
  private async getControllerMethodSuggestions(text: string, doc: TextDocument) {
    const suggestions = (await this.getControllerNameSuggestions(text, doc))[0]

    if (!suggestions) return []

    const methods = getMethodsInSourceFile(suggestions.filePath)
    return methods.map((method) => {
      const newSuggestion = Object.assign({}, suggestions)
      newSuggestion.text = method
      newSuggestion.documentation = SuggestionProvider.buildSuggestionDocumentation(
        method,
        newSuggestion.filePath,
        SuggestionType.ControllerMethod
      )
      return newSuggestion
    })
  }
}

export default RouteControllerCompletionProvider
