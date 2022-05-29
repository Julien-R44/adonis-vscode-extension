import { Uri, MarkdownString } from 'vscode'

/**
 * Edge formatter configuration.
 */
export interface EdgeFormatterContract {
  /**
   * Use spaces instead of tabs.
   */
  useSpaces?: boolean

  /**
   * The tab size to use for formatting.
   *
   * If spaces is preffered above tabs, the total number of spaces that
   * will be used, will equal the tab size specified.
   */
  tabSize?: number
}

/**
 * Represent an Adonis Project in the current workspace
 */
export interface AdonisProject {
  path: string
  name: string
  uri: Uri
}

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
 * Different types of suggestions that can be provided.
 */
export enum SuggestionType {
  ControllerName,
  ControllerMethod,
  View,
}

/**
 * Destructured representation of a controller string.
 */
export type Controller = {
  name: string
  fullname: string
  parentDirectory: string
  fullPath: string
  method: string
}

/**
 * Shape of a BaseNode that compose the tree view
 */
type BaseNode = {
  label: string
  description: string
  icon?: string
}

/**
 * Shape of a Group of commands node
 */
type CommandGroupNode = BaseNode & {
  children: CommandNode[]
}

/**
 * Shape of a Command Node
 */
type CommandNode = BaseNode & {
  commandIdentifier: string
}

export type CommandGenericNode = CommandGroupNode | CommandNode
