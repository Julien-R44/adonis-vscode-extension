import * as glob from 'glob'
import { MarkdownString, WorkspaceFolder, CompletionItem, CompletionItemKind } from 'vscode'

/**
 * A code completion suggestion
 */
export type Suggestion = {
  text: string
  detail: string
  documentation: string | MarkdownString
  filePath: string
}

/**
 * Get completion suggestion based on a provided text.
 *
 * @param text Text to get suggestions for
 * @param workspace Current workspace
 * @param targetDirectories Target directories to perform match in
 * @param fileExtensions Possible file extensions to match for.
 */
export function getSuggestions(
  text: string,
  workspace: WorkspaceFolder,
  targetDirectories: string[],
  fileExtensions: string[]
): Suggestion[] {
  text = text.replace(/\"|\'/g, '').replace(/\./g, '/').replace(/\s/g, '')

  const matchedFiles = getMatches(workspace.uri.fsPath, targetDirectories, text, fileExtensions)

  return fromFilePaths(workspace, matchedFiles, targetDirectories, fileExtensions)
}

/**
 * Convert a file path to a suggestion.
 *
 * @param workspace Workspace for all provided file paths
 * @param filePaths List of file paths to convert
 * @param searchDirectories Directoies to match against for each file path
 * @param extensions List of file extensions
 */
function fromFilePaths(
  workspace: WorkspaceFolder,
  filePaths: string[],
  searchDirectories: string[],
  extensions: string[]
): Suggestion[] {
  let suggestions: Set<Suggestion> = new Set()

  for (const filePath of filePaths) {
    const pwd = workspace.uri.fsPath
    const shortPath = `${workspace.name}/${filePath.replace(`${pwd}/`, '')}`

    const searchDirRegex = searchDirectories.join('|')
    const extensionRegex = extensions.join('|')
    const fullRegex = `${searchDirRegex}/([\\w\/]*)(${extensionRegex})`
    const regex = new RegExp(fullRegex, 'i')
    const matches = filePath.match(regex) || []

    if (matches.length < 2) continue
    const extensionParts = matches[2].split('.')
    const textSuffix = extensionParts[0] === '.' ? '' : extensionParts[0]

    const text: string = `${matches[1]}${textSuffix}`
    const detail = extensionDescription(matches[2])
    const documentation = new MarkdownString(shortPath)

    suggestions.add({ text, documentation, detail, filePath })
  }

  return Array.from(suggestions)
}

/**
 * Build a glob pattern string to match against files in a provided workspace
 *
 * @param workspacePath Workspace path to match for
 * @param targetDirectories Directories in workspace to match
 * @param text Fragment text to match for
 * @param extensions File extensions to match for
 */
function getMatches(
  workspacePath: string,
  targetDirectories: string[],
  text: string,
  extensions: string[]
): string[] {
  let result: string[] = []
  const fn = (rgx: string, cur: string) => `${rgx}|${cur}`
  const extensionRegex = extensions.reduce(fn, '')
  const textRegex = text.split("").map(c => `(?=.*${c})`).join(""); // prettier-ignore

  for (const dir of targetDirectories) {
    const globPattern = `${workspacePath}/${dir}/**/**(${extensionRegex})`
    const files = glob.sync(globPattern, { nodir: true })

    const regexPattern = `${workspacePath}/${dir}/${textRegex}([\\w\/]*)(${extensionRegex})`
    const regex = new RegExp(regexPattern, 'i')

    const matchedFiles = files.filter((file) => regex.test(file))
    result.push(...matchedFiles)
  }

  return result
}

/**
 * Convert a list of suggestions to a completion item.
 *
 * @param suggestions List of suggestions to be converted to completion
 * @param itemKind Kind of completion items being converted to
 */
export function toCompletionItems(
  suggestions: Suggestion[],
  itemKind: CompletionItemKind
): CompletionItem[] {
  let items: CompletionItem[] = []

  for (const suggestion of suggestions) {
    let item = new CompletionItem(suggestion.text, itemKind)
    item.documentation = suggestion.documentation
    item.detail = suggestion.detail
    items.push(item)
  }

  return items
}

/**
 * Get a short description text of a given file extension.
 *
 * TODO: Improve on this implementation.
 *
 * @param fileExtension File extension
 */
function extensionDescription(fileExtension: string): string {
  switch (fileExtension.trim()) {
    case '.edge':
      return 'Edge template'
    case 'controller.js':
      return 'AdonisJS controller'
    default:
      return ''
  }
}
