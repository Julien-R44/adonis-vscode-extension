import { basename, dirname, join, relative } from 'path'
import { existsSync } from 'fs'
import { window, workspace } from 'vscode'
import dedent from 'dedent'
import commonPathPrefix from 'common-path-prefix'
import { PkgJson } from '../adonis_project/files/pkg_json'
import { Adonis6Project } from '../adonis_project/adonis6_project'
import { Adonis5Project } from '../adonis_project/adonis5_project'
import { Logger } from './logger'
import type { AdonisProject } from '../types/projects'

export default class ProjectManager {
  /**
   * List of callbacks to call when the current project changes
   */
  static #changeProjectListeners: ((project: AdonisProject) => any)[] = []

  /**
   * List of all Adonis projects found in the current workspace
   */
  static #projects: AdonisProject[] = []

  /**
   * Current selected project. TreeViews are based on this adonis project.
   */
  static currentProject: AdonisProject

  /**
   * Register a callback to call when the current project changes
   */
  static onDidChangeProject(callback: (project: AdonisProject) => any) {
    this.#changeProjectListeners.push(callback)
  }

  /**
   * Log all found projects in the output channel
   */
  static #logFoundProjects() {
    const projetsDetails = this.#projects
      .map((project) => {
        return dedent`
          - Path : ${project.path}
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
   * Set the current project and call all callbacks
   */
  static setCurrentProject(project: AdonisProject) {
    this.currentProject = project
    this.#changeProjectListeners.forEach((callback) => callback(project))
  }

  /**
   * Get the current project
   */
  static getCurrentProject() {
    return this.currentProject
  }

  /**
   * Check if the given project is the current project
   */
  static isCurrentProject(project: AdonisProject) {
    return this.currentProject === project
  }

  /**
   * Get the most common path of all projects
   */
  static getMostCommonPath() {
    return commonPathPrefix(this.#projects.map((project) => project.path))
  }

  /**
   * Get the shortest path of the given project relative to
   * the most common path of all projects
   */
  static getShortPath(project: AdonisProject) {
    const mostCommonPath = this.getMostCommonPath()

    if (!mostCommonPath) {
      return basename(project.path)
    }
    return relative(mostCommonPath, project.path)
  }

  /**
   * Scan the whole workspace(s) for existing Adonis projects
   */
  static async load() {
    const adonisRcUris = await workspace.findFiles(
      '{**/.adonisrc.json,**/adonisrc.ts}',
      '**/node_modules/**',
      undefined
    )

    const projectsPaths = adonisRcUris
      .filter((file) => file.path.endsWith('build/.adonisrc.json') === false)
      .filter((file) => file.path.endsWith('build/adonisrc.ts') === false)
      .map((file) => dirname(file.fsPath))

    /**
     * Create an instance of Adonis6Project or Adonis5Project
     * depending on the major version of @adonisjs/core
     */
    this.#projects = projectsPaths
      .map((path) => {
        const hasPkgJson = existsSync(join(path, 'package.json'))
        if (!hasPkgJson) return null

        const pkgJson = new PkgJson(join(path, 'package.json'))
        const major = pkgJson.getMajorOf('@adonisjs/core')

        if (!major) return null

        if (major >= 6) return new Adonis6Project(path)
        return new Adonis5Project(path)
      })
      .filter(Boolean) as AdonisProject[]

    this.#logFoundProjects()

    this.currentProject = this.#projects[0]!

    return this.#projects
  }

  static getProjects() {
    return this.#projects
  }

  /**
   * Return the AdonisProject instance that contains the given file
   */
  static getProjectFromFile(file: string) {
    return this.#projects.find((project) => {
      const filename = file.toLowerCase()

      return filename.startsWith(project.path.toLowerCase())
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
      description: project.path,
    }))

    const target = await window.showQuickPick(items, { placeHolder })

    return this.#projects.find((project) => project.path === target?.description)!
  }
}
