import * as glob from 'glob'
import { MarkdownString, CompletionItem, CompletionItemKind } from 'vscode'
import { AdonisProject } from '../Extension'

/**
 * A code completion suggestion
 */
export type Suggestion = {
  text: string
  detail: string
  documentation: string | MarkdownString
  filePath: string
}

export class SuggestionMatcher {
  /**
   * Convert a file path to a suggestion.
   */
  private static fromFilePaths(
    directory: string,
    filePaths: string[],
    searchDirectories: string[],
    extensions: string[]
  ): Suggestion[] {
    let suggestions: Set<Suggestion> = new Set()

    for (const filePath of filePaths) {
      const pwd = directory
      const shortPath = `${directory}/${filePath.replace(`${pwd}/`, '')}`

      const searchDirRegex = searchDirectories.join('|')
      const extensionRegex = extensions.join('|')
      const fullRegex = `${searchDirRegex}/([\\w\/]*)(${extensionRegex})`
      const regex = new RegExp(fullRegex, 'i')
      const matches = filePath.match(regex) || []

      if (matches.length < 2) continue
      const extensionParts = matches[2].split('.')
      const textSuffix = extensionParts[0] === '.' ? '' : extensionParts[0]

      const text: string = `${matches[1]}${textSuffix}`
      const detail = this.extensionDescription(matches[2])
      const documentation = new MarkdownString(shortPath)

      suggestions.add({ text, documentation, detail, filePath })
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
  private static getMatches(
    project: AdonisProject,
    targetDirectories: string[],
    text: string,
    extensions: string[]
  ): string[] {
    let result: string[] = []
    const fn = (rgx: string, cur: string) => `${rgx}|${cur}`
    const extensionRegex = extensions.reduce(fn, '')
    const textRegex = text.split("").map(c => `(?=.*${c})`).join(""); // prettier-ignore

    const directory = project.uri.fsPath

    for (const dir of targetDirectories) {
      const globPattern = `${directory}/${dir}/**/**(${extensionRegex})`
      const files = glob.sync(globPattern, { nodir: true })

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
   * Get a short description text of a given file extension.
   */
  private static extensionDescription(fileExtension: string): string {
    return (
      {
        '.edge': 'Edge Template',
        'controller.ts': 'Controller',
      }[fileExtension.trim()] || ''
    )
  }

  /**
   * Get completion suggestion based on a provided text.
   *
   * @param text Text to match against
   */
  public static getSuggestions(
    text: string,
    project: AdonisProject,
    targetDirectories: string[],
    fileExtensions: string[]
  ): Suggestion[] {
    text = text.replace(/\"|\'/g, '').replace(/\./g, '/').replace(/\s/g, '')

    const matchedFiles = this.getMatches(project, targetDirectories, text, fileExtensions)
    return this.fromFilePaths(project.uri.fsPath, matchedFiles, targetDirectories, fileExtensions)
  }

  /**
   * Convert a list of suggestions to a completion item.
   *
   * @param suggestions List of suggestions to be converted to completion
   * @param itemKind Kind of completion items being converted to
   */
  public static toCompletionItems(suggestions: Suggestion[], itemKind: CompletionItemKind) {
    return suggestions.map((suggestion) => {
      let item = new CompletionItem(suggestion.text, itemKind)
      item.documentation = suggestion.documentation
      item.detail = suggestion.detail
      return item
    })
  }
}
