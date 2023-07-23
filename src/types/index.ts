import type { MarkdownString } from 'vscode'

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
 * A code completion suggestion
 */
export interface Suggestion {
  text: string
  detail: string
  documentation: string | MarkdownString
  filePath: string
}

/**
 * Destructured representation of a controller string.
 */
export interface Controller {
  name: string
  subpathImport?: string
  namespace?: string
  method?: string
  fullPath: string
}

/**
 * Shape of a BaseNode that compose the tree view
 */
export interface BaseNode {
  label: string
  description: string
  icon?: string
}

export type RouteGroupNode = BaseNode & { children: (RouteNode | RouteGroupNode)[] }
export type RouteDomainNode = BaseNode & { children: RouteGroupNode[] }
export type RouteNode = BaseNode & RawRoute & { path: any | null; filename: string }

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

export interface RawRouteV6 {
  name: string
  pattern: string
  methods: HttpMethod[]
  handler: {
    type: 'controller' | 'closure'
    moduleNameOrPath: string
    method: string
  }
  middleware: string[]
}

/**
 * Output of node ace list:routes command
 */
export interface AceListRoutesResultV5 {
  /**
   * Main domain
   */
  root: RawRoute[]

  /**
   * Other domains
   */
  [key: string]: RawRoute[]
}

export type AceListRoutesResultV6 = {
  domain: string
  routes: RawRouteV6[]
}[]

/**
 * Output of node ace list --json command
 */
export type AceListCommandsResult = {
  commandName: string
  description: string
  help: string
  namespace: string
  aliases: string[]
  flags: {
    name: string
    flagName: string
    required: boolean
    type: string
    description: string
    alias: string
  }[]

  args: {
    name: string
    argumentName: string
    required: boolean
    description: string
    type: string
  }[]
  options: {
    allowUnknownFlags: boolean
  }
  filePath: string
  absoluteFilePath: string
}[]
