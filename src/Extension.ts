import { basename } from 'path'
import { Uri, workspace } from 'vscode'

export interface AdonisProject {
  path: string
  name: string
  uri: Uri
}

export default class Extension {
  /**
   * The paths to the different Adonis project in the workspace
   */
  public static adonisProjectPaths: string[] = []

  /**
   * Scan the whole workspace(s) for existing Adonis projects
   */
  public static async loadAdonisProjects() {
    let files = await workspace.findFiles('**/ace', '**/node_modules/**', undefined)
    files.map((file) =>
      Extension.adonisProjectPaths.push(file.path.split('/').slice(0, -1).join('/'))
    )
  }

  /**
   * Returns the directories
   */
  public static getAdonisProjects(): AdonisProject[] {
    return this.adonisProjectPaths.map((path) => ({
      name: basename(path),
      path: path,
      uri: Uri.file(path),
    }))
  }

  /**
   * Return the AdonisProject where the file is
   */
  public static getAdonisProjectFromFile(file: string): AdonisProject | null {
    const adonisProjects = this.getAdonisProjects()
    const project = adonisProjects.find((adonisProject) =>
      file.toLowerCase().startsWith(adonisProject.path.toLowerCase())
    )
    return project || null
  }
}
