import * as fs from 'fs'
import { Uri } from 'vscode'
import ProjectFinder from '../services/project_finder'
import { getDirectories } from './directory'
import type { AdonisProject } from '../contracts'
import type { TextDocument } from 'vscode'

/**
 * A minimal file path representation.
 */
export interface Path {
  name: string
  fullpath: string
  uri: Uri
}

/**
 * Get exact view file path whose name matches the text provided.
 *
 * @param text Name of file for which to match for file name.
 * @param doc Document from which text is extracted
 */
export function getExactPathMatch(
  text: string,
  doc: TextDocument | Uri,
  targetDirectories: string[],
  extensions: string[]
) {
  const paths = getPathMatches(text, doc, targetDirectories, extensions)
  return paths.length > 0 ? paths[0]! : null
}

/**
 * Get all view file path whose names matches the text provided.
 *
 * @param text Name of file for which to match for file names
 * @param document Workspace directory to match files.
 */
export function getPathMatches(
  text: string,
  doc: TextDocument | Uri,
  targetDirectories: string[],
  extensions: string[]
) {
  const project = ProjectFinder.getAdonisProjectFromFile(
    doc instanceof Uri ? doc.path : doc.uri.path
  )
  if (!project) return []

  const workspacePath = project.uri.fsPath
  const fileName = text.replace(/\"|\'/g, '').replace(/\./g, '/')
  const directories = getDirectories(workspacePath, targetDirectories)

  return buildPaths(project, directories, fileName, extensions)
}

function buildPaths(
  adonisProject: AdonisProject,
  paths: string[],
  fileName: string,
  extensions: string[]
) {
  const result: Path[] = []

  for (const path in paths) {
    for (const extension of extensions) {
      const file = `${fileName}${extension}`
      const filePath = `${adonisProject.uri.fsPath}/${paths[path]}/${file}`
      const fullpath = `${adonisProject.name}/${paths[path]}/${file}`

      if (fs.existsSync(filePath)) {
        result.push({
          fullpath,
          name: paths[path]!,
          uri: Uri.file(filePath),
        })
      }
    }
  }

  return result
}
