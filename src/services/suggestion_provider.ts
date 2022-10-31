import { relative } from 'path'
import { CompletionItem, CompletionItemKind, MarkdownString } from 'vscode'
import fg from 'fast-glob'
import { SuggestionType } from '../contracts'
import { getMethodsInSourceFile } from '../utilities/functions'
import { DocumentationProvider } from './documentation_provider'
import type { AdonisProject } from './adonis_project'
import type { Suggestion } from '../contracts'

export class SuggestionProvider {
  /**
   * Convert a file path to a suggestion.
   */
  private static createSuggestionsFromFilePaths(
    directory: string,
    filePaths: string[],
    searchDirectories: string[],
    extensions: string[],
    suggestionType: SuggestionType
  ) {
    const suggestions: Set<Suggestion> = new Set()

    for (const filePath of filePaths) {
      const shortPath = relative(directory, filePath)

      const searchDirRegex = searchDirectories.join('|')
      const extensionRegex = extensions.join('|')
      const fullRegex = `${searchDirRegex}/([\\w\/-]*)(${extensionRegex})`
      const regex = new RegExp(fullRegex, 'i')
      const matches = filePath.match(regex) || []

      if (matches.length < 2) continue
      const extensionParts = matches[2]!.split('.')
      const textSuffix = extensionParts[0] === '.' ? '' : extensionParts[0]
      let text = `${matches[1]}${textSuffix}`

      if (suggestionType === SuggestionType.View) {
        text = text.replace(/\.+/g, '/')
      } else if (
        suggestionType === SuggestionType.ControllerMethod ||
        suggestionType === SuggestionType.ControllerName
      ) {
        text = text.replace(/^Http\//g, '')
      }

      const documentation = this.buildSuggestionDocumentation(text, filePath, suggestionType)

      suggestions.add({ text, documentation, detail: shortPath, filePath })
    }

    return Array.from(suggestions)
  }

  /**
   * Build a glob pattern string to match against files in a provided workspace
   *
   * @param project Adonis project where matching files
   * @param targetDirectories Directories in AdonisProject path to match
   * @param text Fragment text to match for
   * @param extensions File extensions to match for
   */
  private static async getMatches(
    project: AdonisProject,
    targetDirectories: string[],
    text: string,
    extensions: string[]
  ) {
    const result: string[] = []
    const fn = (rgx: string, cur: string) => `${rgx}|${cur}`
    const extensionRegex = extensions.reduce(fn, '')
    const textRegex = text.split("").map(c => `(?=.*${c})`).join(""); // prettier-ignore

    const directory = project.uri.fsPath.replace(/\\/g, '/')

    for (const dir of targetDirectories) {
      const globPattern = `${directory}/${dir}/**/**(${extensionRegex})`
      const files = await fg(globPattern, { onlyFiles: true, caseSensitiveMatch: false })

      const regexPattern = `${directory.replaceAll(
        '\\',
        '/'
      )}/${dir}/${textRegex}([\\w\/]*)(${extensionRegex})`

      const regex = new RegExp(regexPattern, 'i')
      const matchedFiles = files.filter((file) => regex.test(file))

      result.push(...matchedFiles)
    }

    return result
  }

  /**
   * Get completion suggestion based on a provided text.
   *
   * @param text Text to match against
   */
  public static async getSuggestions(
    text: string,
    project: AdonisProject,
    targetDirectories: string[],
    fileExtensions: string[],
    suggestionType: SuggestionType
  ) {
    text = text.replace(/\"|\'/g, '').replace(/\./g, '/').replace(/\s/g, '')

    const matchedFiles = await this.getMatches(project, targetDirectories, text, fileExtensions)

    return this.createSuggestionsFromFilePaths(
      project.uri.fsPath,
      matchedFiles,
      targetDirectories,
      fileExtensions,
      suggestionType
    )
  }

  /**
   * Convert a list of suggestions to a completion item.
   *
   * @param suggestions List of suggestions to be converted to completion
   * @param itemKind Kind of completion items being converted to
   */
  public static toCompletionItems(suggestions: Suggestion[], itemKind = CompletionItemKind.Value) {
    return suggestions.map((suggestion) => {
      const item = new CompletionItem(suggestion.text, itemKind)
      item.documentation = suggestion.documentation
      item.detail = suggestion.detail
      return item
    })
  }

  /**
   * Build a suggestion documentation based on SuggestionType provided.
   */
  public static buildSuggestionDocumentation(
    text: string,
    filePath: string,
    suggestionType: SuggestionType
  ) {
    if (suggestionType === SuggestionType.ControllerName) {
      const fileMethods = getMethodsInSourceFile(filePath)
      const bulletListMethods = fileMethods.map((item) => `- ${item}`).join('\n')
      return new MarkdownString(`**Available Methods**\n${bulletListMethods}`)
    }

    if (suggestionType === SuggestionType.ControllerMethod) {
      return DocumentationProvider.getDocForMethodInFile(filePath, text) || ''
    }

    return ''
  }
}
