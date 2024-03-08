import { join, normalize, relative } from 'path'
import fg from 'fast-glob'
import {slash} from '../utilities/index'
import { getMethodsInSourceFile } from '../utilities/misc'
import type { Suggestion } from '../types'
import type { AdonisProject } from '../types/projects'

export class ControllerSuggester {
  /**
   * Sanitize text input by removing quotes and whitespaces.
   *
   * Also remove the #controllers/ prefix if the project is Adonis 6. So
   * we keep only the controller name + methods
   */
  static #sanitizeInput(project: AdonisProject, text: string) {
    text = text.replaceAll(/\"|\'/g, '').replaceAll('.', '/').replaceAll(/\s/g, '')

    if (project.isAdonis6()) {
      const match = text.match(/^#controllers\/(.*)$/)
      text = match ? match[1]! : ''
    }

    return text
  }

  /**
   * Returns an absolute path to the app controllers directory
   *
   * app/controllers for Adonis 6
   * app/Controllers/Http for Adonis 5
   *
   * TODO: Will need to use RC file namespaces to support custom directories
   */
  static #getAppControllersDirectory(project: AdonisProject) {
    let relativePath = ''
    if (project.isAdonis6()) {
      relativePath = 'app/controllers'
    } else {
      relativePath = 'app/Controllers/Http'
    }

    return join(project.path, relativePath)
  }

  /**
   * Get all controllers file paths in the project.
   */
  static async #getAllControllers(controllersDirectory: string) {
    const globPattern = slash(`${controllersDirectory}/**/**.ts`)
    return fg(globPattern, {
      onlyFiles: true,
      caseSensitiveMatch: false,
    })
  }

  /**
   * Given a list of controllers files and the text input, filter the files
   * to keep only the ones matching
   */
  static #filterControllersFiles(options: {
    controllersFiles: string[]
    controllersDirectory: string
    text: string
  }) {
    const { controllersFiles, controllersDirectory, text } = options

    const regexPattern = `${controllersDirectory}/(.*)${text}(.*).ts`.replaceAll('\\', '/')
    const regex = new RegExp(regexPattern, 'i')

    return controllersFiles.filter((file) => regex.test(file))
  }

  public static async geControllerSuggestions(options: {
    text: string
    project: AdonisProject
  }): Promise<Suggestion[]> {
    const text = this.#sanitizeInput(options.project, options.text)

    const controllersDirectory = this.#getAppControllersDirectory(options.project)
    const controllersFiles = await this.#getAllControllers(controllersDirectory)

    const foundFiles = this.#filterControllersFiles({
      controllersFiles,
      controllersDirectory,
      text,
    })

    return foundFiles.map((file) => {
      const controllerName = slash(relative(controllersDirectory, file).replace('.ts', ''))
      const withSubpathPrefix = `#controllers/${controllerName}`

      const fileMethods = getMethodsInSourceFile(normalize(file))
      const bulletListMethods = fileMethods.map((method) => `* ${method}`).join('\n')

      return {
        text: options.project.isAdonis6() ? withSubpathPrefix : controllerName,
        detail: slash(relative(options.project.path, file)),
        documentation: `**Methods**\n${bulletListMethods}`,
        filePath: normalize(file),
      }
    })
  }
}
