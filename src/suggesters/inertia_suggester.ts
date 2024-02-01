import { join, normalize, relative } from 'path'
import fg from 'fast-glob'
import slash from 'slash'
import type { Suggestion } from '../types'
import type { AdonisProject } from '../types/projects'

export class InertiaSuggester {
  public static async getInertiaSuggestions(options: {
    text: string
    project: AdonisProject
    pagesDirectory: string
  }): Promise<Suggestion[]> {
    const text = options.text.replaceAll(/\"|\'/g, '').replaceAll('.', '/').replaceAll(/\s/g, '')

    const pagesDirectory = join(options.project.path, options.pagesDirectory)
    const globPattern = slash(`${pagesDirectory}/**/**.{vue,jsx,tsx,svelte}`)
    const matchedFiles = await fg(globPattern, {
      onlyFiles: true,
      caseSensitiveMatch: false,
    })

    // Check if the filename includes the text
    const regexPattern = `${pagesDirectory}/(.*)${text}(.*).(vue|jsx|tsx|svelte)`.replaceAll(
      '\\',
      '/'
    )

    const regex = new RegExp(regexPattern, 'i')
    const foundFiles = matchedFiles.filter((file) => regex.test(file))

    return foundFiles.map((file) => {
      return {
        text: slash(relative(pagesDirectory, file).replace(/\.(vue|jsx|tsx|svelte)$/, '')),
        detail: slash(relative(options.project.path, file)),
        documentation: '',
        filePath: normalize(file),
      }
    })
  }
}
