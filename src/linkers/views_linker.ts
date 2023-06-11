import { join } from 'path'
import fg from 'fast-glob'
import slash from 'slash'
import { edgeRegex, tsRegex } from '../utilities/regexes'
import type { AdonisProject } from '../adonis_project'

export interface ViewLink {
  templatePath: string
  position: {
    line: number
    colStart: number
    colEnd: number
  }
}

/**
 * Purpose of this class is :
 * - Scan a .edge or .ts file for linked templates with some regexes
 * - If a linked template is found, search the related file in the project
 * - And return a Link, that will be used to create DocumentLink in the editor
 */
export class ViewsLinker {
  static async #matchIndexToPosition(options: { fileContent: string; match: RegExpMatchArray }) {
    const lines = options.fileContent.split('\n')

    const line = lines.findIndex((line) => line.includes(options.match[1]!))
    const colStart = lines[line]!.indexOf(options.match[1]!)
    const colEnd = colStart + options.match[1]!.length

    return { line, colStart, colEnd }
  }

  /**
   * Get all the links from a .edge file
   */
  public static async getLinks(options: {
    fileContent: string
    sourceType: 'edge' | 'ts'
    project: AdonisProject
  }): Promise<ViewLink[]> {
    const regex = options.sourceType === 'edge' ? edgeRegex : tsRegex
    const matches = options.fileContent.matchAll(regex) || []

    const matchesArray = Array.from(matches)

    const promises = matchesArray.map(async (match) => {
      const fileName = match[1]!.replace(/\"|\'/g, '').replace(/\./g, '/')
      const pattern = slash(`resources/views/${fileName}.edge`)

      const edgeFiles = await fg(pattern, {
        onlyFiles: true,
        caseSensitiveMatch: false,
        cwd: slash(options.project.path),
      })

      if (!edgeFiles.length) {
        return
      }

      const position = await ViewsLinker.#matchIndexToPosition({
        fileContent: options.fileContent,
        match,
      })

      return {
        templatePath: join(options.project.path, edgeFiles[0]!),
        position,
      }
    })

    const results = await Promise.all(promises)
    return results.filter(Boolean) as unknown as ViewLink[]
  }
}
