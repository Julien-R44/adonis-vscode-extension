import * as path from 'path'
import * as fs from 'fs'

/**
 * Get all directories in children directory, relative to the workspace path.
 *
 * TODO: Switch implementation to using glob.
 *
 * @param workspacePath Workspace for which the provided directories are located.
 * @param childDirectories Array of all possible directories to scan and match.
 */
export function getDirectories(workspacePath: string, childDirectories: string[]) {
  const folders = Object.values(childDirectories)
  childDirectories = Object.values(childDirectories)

  for (const childDir of childDirectories) {
    const directory = path.join(workspacePath, childDir)

    if (fs.existsSync(directory)) {
      fs.readdirSync(directory).forEach((dirItem: string) => {
        const fullPath = path.join(directory, dirItem)

        if (fs.statSync(fullPath).isDirectory()) {
          const theDirectory = `${childDir}/${dirItem}`
          folders.push(theDirectory)
          childDirectories.push(theDirectory)
        }
      })
    }
  }

  return folders
}
