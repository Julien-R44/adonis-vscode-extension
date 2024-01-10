/**
 * -------------------------------------------------------
 * Types for Adonis V5 projects
 * -------------------------------------------------------
 */

/**
 * Data returned by the `ace list --json` command
 */
export interface CommandEntry {
  commandName: string
  description: string
  help: string
  namespace: string
  aliases: string[]
  flags: {
    name: string
    flagName: string
    required: boolean
    description: string
    type: string
    alias: string
  }[]
  args: {
    name: string
    argumentName: string
    required: boolean
    description: string
    type: string
  }[]
  filePath: string
  absoluteFilePath: string
}
