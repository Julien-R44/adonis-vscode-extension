import { dirname } from 'path'
import { Uri, window, workspace } from 'vscode'
import dedent from 'dedent'
import { Logger } from '../logger'
import { AdonisProject } from '.'

export default class ProjectManager {
  static #projects: AdonisProject[] = []

  static #logFoundProjects() {
    const projetsDetails = this.#projects
      .map((project) => {
        return dedent`
          - Path : ${project.uri.path}
          - Adonis Version : ${project.adonisVersion}
        `
      })
      .join('\n\n')

    Logger.info(
      `Found ${this.#projects.length} AdonisJS project(s) :
      ${projetsDetails}`
    )
  }

  /**
   * Scan the whole workspace(s) for existing Adonis projects
   */
  static async load() {
    const adonisRcUris = await workspace.findFiles(
      '**/.adonisrc.json',
      '**/node_modules/**',
      undefined
    )

    const projectsUris = adonisRcUris
      .filter((file) => file.path.endsWith('build/.adonisrc.json') === false)
      .map((file) => Uri.parse(dirname(file.path)))

    this.#projects = projectsUris.map((uri) => new AdonisProject(uri))

    this.#logFoundProjects()

    return this.#projects
  }

  /**
   * Simple getter
   */
  static getProjects() {
    return this.#projects
  }

  /**
   * Return the AdonisProject instance that contains the given file
   */
  static getProjectFromFile(file: string) {
    return this.#projects.find((project) => {
      const filename = file.toLowerCase()
      return (
        filename.startsWith(project.uri.fsPath.toLowerCase()) ||
        filename.startsWith(project.uri.path.toLowerCase())
      )
    })
  }

  /**
   * Prompt the user to select an AdonisJS project when multiple
   * are present in the workspace
   */
  static async quickPickProject(placeHolder?: string) {
    placeHolder = placeHolder || 'Select an Adonis project'

    /**
     * If only one project is available, just returns it
     */
    if (this.#projects.length === 1) {
      return this.#projects[0]!
    }

    /**
     * Show a VSCode quickPick to let the user select the project
     */
    const items = this.#projects.map((project) => ({
      label: project.name,
      description: project.uri.fsPath,
    }))
    const target = await window.showQuickPick(items, { placeHolder })

    return this.#projects.find((project) => project.uri.fsPath === target?.description)!
  }
}
