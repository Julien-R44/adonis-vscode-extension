import { join, normalize, relative } from 'path'
import fg from 'fast-glob'
import slash from 'slash'
import { EdgeComponentsFinder } from '../edge_components_finder'
import type { Suggestion } from '../types'
import type { AdonisProject } from '../adonis_project'

export class ViewSuggester {
  public static async getComponentsAsTagsSuggestions(options: {
    text: string
    project: AdonisProject
  }): Promise<Suggestion[]> {
    const text = options.text.replaceAll(/[@|!|(|)]/g, '')

    const components = await EdgeComponentsFinder.find(options.project)
    return components
      .filter((component) => component.name.startsWith(text))
      .map((component) => {
        return {
          text: component.name,
          detail: component.relativePath,
          documentation: '',
          filePath: normalize(component.path),
        }
      })
  }

  public static async getViewSuggestions(options: {
    text: string
    project: AdonisProject
  }): Promise<Suggestion[]> {
    // Sanitize input
    const text = options.text.replaceAll(/\"|\'/g, '').replaceAll('.', '/').replaceAll(/\s/g, '')

    // Search all file with .edge extension
    const viewsDirectory = join(options.project.path, 'resources/views')
    const globPattern = slash(`${viewsDirectory}/**/**.edge`)
    const matchedFiles = await fg(globPattern, {
      onlyFiles: true,
      caseSensitiveMatch: false,
    })

    // Check if the filename includes the text
    const regexPattern = `${viewsDirectory}/(.*)${text}(.*).edge`.replaceAll('\\', '/')
    const regex = new RegExp(regexPattern, 'i')
    const foundFiles = matchedFiles.filter((file) => regex.test(file))

    return foundFiles.map((file) => {
      return {
        text: slash(relative(viewsDirectory, file).replace('.edge', '')),
        detail: slash(relative(options.project.path, file)),
        documentation: '',
        filePath: normalize(file),
      }
    })
  }
}
