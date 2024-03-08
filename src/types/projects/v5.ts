/**
 * -------------------------------------------------------
 * Types for Adonis V5 projects
 * -------------------------------------------------------
 */

/**
 * Ace-manifest.json shape
 */
export interface AceManifest {
  commands: { [key: string]: AceManifestEntry }
}

/**
 * An entry in the ace-manifest.json file
 */
export interface AceManifestEntry {
  settings: {
    loadApp: boolean
    stayAlive: boolean
    [key: string]: any
  }
  commandPath: string
  commandName: string
  description: string
  args: (Arg & { required: boolean })[]
  flags: Arg[]
}

/**
 * An argument in the ace-manifest.json file
 */
export interface Arg {
  name: string
  propertyName: string
  type: ArgType
  description: string
}

/**
 * The type of an argument
 */
export enum ArgType {
  Array = 'array',
  Number = 'number',
  String = 'string',
  Boolean = 'boolean',
}
