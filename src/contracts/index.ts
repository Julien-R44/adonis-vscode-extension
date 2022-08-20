import type { Path } from '../utilities/path_matching'
import type { MarkdownString, Uri } from 'vscode'

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
export interface Suggestion {
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
export interface Controller {
  name: string
  fullname: string
  parentDirectory: string
  fullPath: string
  method: string
}

/**
 * Shape of a BaseNode that compose the tree view
 */
export interface BaseNode {
  label: string
  description: string
  icon?: string
}

/**
 * Shape of a Group of commands node
 */
export type CommandGroupNode = BaseNode & { children: CommandNode[] }

/**
 * Shape of a Command Node
 */
export type CommandNode = BaseNode & { commandIdentifier: string }
export type CommandGenericNode = CommandGroupNode | CommandNode

export type RouteGroupNode = BaseNode & { children: (RouteNode | RouteGroupNode)[] }
export type RouteDomainNode = BaseNode & { children: RouteGroupNode[] }
export type RouteNode = BaseNode & RawRoute & { path: Path | null; filename: string }

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS' | 'HEAD' | 'ANY'

/**
 * Shape of raw route returned by node ace list:routes command
 */
export interface RawRoute {
  domain: string
  handler: string
  methods: HttpMethod[]
  middleware: string[]
  name: string
  pattern: string
}

/**
 * Shape of node ace list:routes result
 */
export interface AceListRoutesResult {
  /**
   * Main domain
   */
  root: RawRoute[]

  /**
   * Other domains
   */
  [key: string]: RawRoute[]
}
