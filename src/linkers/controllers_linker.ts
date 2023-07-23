import { join } from 'node:path'
import { existsSync } from 'node:fs'
import { parseMagicString } from '../utilities'
import { controllersRegex } from '../utilities/regexes'
import type { RouteLink } from '../types/linkers'
import type { AdonisProject } from '../types/projects'

export class ControllersLinker {
  static async #matchIndexToPosition(options: { fileContent: string; match: RegExpMatchArray }) {
    const lines = options.fileContent.split('\n')

    const line = lines.findIndex((line) => line.includes(options.match[2]!))
    const colStart = lines[line]!.indexOf(options.match[2]!)
    const colEnd = colStart + options.match[2]!.length

    return { line, colStart, colEnd }
  }

  public static async getLinks(options: {
    fileContent: string
    project: AdonisProject
  }): Promise<RouteLink[]> {
    const matches = options.fileContent.matchAll(controllersRegex) || []
    const matchesArray = Array.from(matches)

    const promises = matchesArray.map(async (match) => {
      const controllerString = match[0]!.replace(/\"|\'/g, '')

      const controller = parseMagicString(controllerString)
      const position = await this.#matchIndexToPosition({
        fileContent: options.fileContent,
        match,
      })

      if (!controller) {
        return { controllerPath: null, controller: null, position }
      }

      let controllersDirectory = ''

      if (options.project.isAdonis5()) {
        controllersDirectory = 'app/Controllers/Http'
      } else if (options.project.isAdonis6()) {
        controllersDirectory = 'app/controllers'
      }

      const absPath = join(options.project.path, controllersDirectory)
      const filePath = `${join(absPath, controller.namespace || '', controller.name)}.ts`

      if (!existsSync(filePath)) {
        return { controller, controllerPath: null, position }
      }

      return {
        controller,
        controllerPath: filePath,
        position,
      }
    })

    return Promise.all(promises)
  }
}
