import { dirname } from 'path'
import { Uri, window, workspace } from 'vscode'
import { AdonisProject } from '.'

export default class ProjectManager {
  private static projects: AdonisProject[] = []

  /**
   * Scan the whole workspace(s) for existing Adonis projects
   */
  public static async load() {
    const adonisRcUris = await workspace.findFiles(
      '**/.adonisrc.json',
      '**/node_modules/**',
      undefined
    )

    const projectsUris = adonisRcUris.map((file) => Uri.parse(dirname(file.path)))

    this.projects = projectsUris.map((uri) => new AdonisProject(uri))
    return this.projects
  }

  /**
   * Simple getter
   */
  public static getProjects() {
    return this.projects
  }

  /**
   * Return the AdonisProject instance that contains the given file
   */
  public static getProjectFromFile(file: string) {
    return this.projects.find((project) => {
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
  public static async quickPickProject(placeHolder?: string) {
    placeHolder = placeHolder || 'Select an Adonis project'

    /**
     * If only one project is available, just returns it
     */
    if (this.projects.length === 1) {
      return this.projects[0]!
    }

    /**
     * Show a VSCode quickPick to let the user select the project
     */
    const items = this.projects.map((project) => ({
      label: project.name,
      description: project.uri.fsPath,
    }))
    const target = await window.showQuickPick(items, { placeHolder })

    return this.projects.find((project) => project.uri.fsPath === target?.description)!
  }
}
