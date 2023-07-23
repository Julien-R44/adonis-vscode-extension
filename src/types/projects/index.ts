import type { AceListRoutesResultV6 } from '..'

/**
 * Env file of an Adonis project
 */
export interface AdonisEnv {
  PORT: string
  HOST: string
  NODE_ENV: string
  [key: string]: string
}

export type Routes = AceListRoutesResultV6

/**
 * A node representing a Ace Command. Used to build the tree view
 */
export interface AceCommandNode {
  label: string
  description: string
  icon: string
  children?: {
    label: string
    description: string
    icon?: string
    commandIdentifier: string
    commandArguments?: any[]
  }[]
}

/**
 * Interface which all Adonis projects must implement
 */
export interface AdonisProject {
  name: string
  env?: AdonisEnv
  path: string
  adonisVersion: string

  reload(): void
  getRoutes(): Promise<Routes>
  getCommands(): Promise<AceCommandNode[]>

  /**
   * Parse stdout after generating command using adonis/assembler and returns
   * the freshly created file
   *
   * On Adonis 5, stdout is CREATE: {filename},
   * On Adonis 6, stdout is DONE:   create {filename}
   */
  parseCreatedFilename(stdout: string): string | null

  isAdonisX(version: number): boolean
  isAdonis5(): boolean
  isAdonis6(): boolean
}
