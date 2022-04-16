import {
  TextDocument,
  Position,
  ProviderResult,
  CompletionItemProvider,
  CompletionItem,
  CompletionItemKind,
  workspace,
  Range,
} from 'vscode'
import { getSuggestions, Suggestion, toCompletionItems } from '../../utilities/suggestion'
import Config from '../../utilities/config'
import { getMethodsInSourceFile } from '../../utilities/functions'
import { parseControllerString } from '../../utilities/controller'

const {
  controllersDirectories,
  controllersExtensions,
  controllersNameCompletionRegex: controllerNamePattern,
  controllersMethodCompletionRegex: controllerMethodPattern,
} = Config.autocomplete

class RouteControllerCompletionProvider implements CompletionItemProvider {
  public provideCompletionItems(
    doc: TextDocument,
    pos: Position
  ): ProviderResult<CompletionItem[]> {
    let showMethodSuggestions = false
    let range = this.matchPatternInDocument(controllerNamePattern, doc, pos)

    if (!range) {
      showMethodSuggestions = true
      range = this.matchPatternInDocument(controllerMethodPattern, doc, pos)
    }

    const text = doc.getText(range)
    const suggestions = showMethodSuggestions
      ? this.getControllerMethodSuggestions(text, doc)
      : this.getControllerNameSuggestions(text, doc)

    return toCompletionItems(suggestions, CompletionItemKind.Value)
  }

  /**
   * Match a given pattern in a text document begining from a specified postion.
   *
   * @param pattern Pattern to match for
   * @param doc Document to match in
   * @param pos Postion in document to begin matching from
   */
  private matchPatternInDocument(
    pattern: string,
    doc: TextDocument,
    pos: Position
  ): Range | undefined {
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
  private getControllerNameSuggestions(text: string, doc: TextDocument): Suggestion[] {
    const controller = parseControllerString(text)
    if (controller) text = controller.name

    const folder = workspace.getWorkspaceFolder(doc.uri)
    if (!folder) return []

    return getSuggestions(text, folder, controllersDirectories, controllersExtensions)
  }

  /**
   * Get controller methods suggestions based on the provided route controller text.
   *
   * Example of a route controller text is `HomeController.get`.
   *
   * @param text Text to get suggestions for
   * @param doc Document text belongs to
   */
  private getControllerMethodSuggestions(text: string, doc: TextDocument): Suggestion[] {
    const suggestions = this.getControllerNameSuggestions(text, doc)[0]
    const methods = getMethodsInSourceFile(suggestions.filePath)

    return methods.map((method) => {
      let newSuggestion = Object.assign({}, suggestions)
      newSuggestion.text = method
      return newSuggestion
    })
  }
}

export default RouteControllerCompletionProvider
