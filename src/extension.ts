import { basename } from 'path'
import { Uri } from 'vscode'

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
    const project = adonisProjects.find((adonisProject) => file.startsWith(adonisProject.path))
    return project || null
  }
}
