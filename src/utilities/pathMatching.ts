import { Uri, TextDocument, workspace as vsWorkspace, WorkspaceFolder } from 'vscode'
import { getDirectories } from './directory'
import * as fs from 'fs'

/**
 * A minimal file path representation.
 */
export type Path = {
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
  doc: TextDocument,
  targetDirectories: string[],
  extensions: string[]
): Path | null {
  let paths = getPathMatches(text, doc, targetDirectories, extensions)
  return paths.length > 0 ? paths[0] : null
}

/**
 * Get all view file path whose names matches the text provided.
 *
 * @param text Name of file for which to match for file names
 * @param document Workspace directory to match files.
 */
export function getPathMatches(
  text: string,
  doc: TextDocument,
  targetDirectories: string[],
  extensions: string[]
): Path[] {
  const workspace = vsWorkspace.getWorkspaceFolder(doc.uri)
  if (!workspace) return []

  const workspacePath = workspace.uri.fsPath
  const fileName = text.replace(/\"|\'/g, '').replace(/\./g, '/')
  const directories = getDirectories(workspacePath, targetDirectories)

  return buildPaths(workspace, directories, fileName, extensions)
}

function buildPaths(
  workspace: WorkspaceFolder,
  paths: string[],
  fileName: string,
  extensions: string[]
): Path[] {
  let result: Path[] = []

  for (const path in paths) {
    for (let extension of extensions) {
      const file = `${fileName}${extension}`
      const filePath = `${workspace.uri.fsPath}/${paths[path]}/${file}`
      const fullpath = `${workspace.name}/${paths[path]}/${file}`

      if (fs.existsSync(filePath)) {
        result.push({
          fullpath,
          name: paths[path],
          uri: Uri.file(filePath),
        })
      }
    }
  }

  return result
}
