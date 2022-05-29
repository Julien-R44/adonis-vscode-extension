import { Range, DocumentLink, Uri, Position } from 'vscode'
import { Controller } from '../contracts'
import { getLineNumber } from './functions'

export class RouteControllerLink extends DocumentLink {
  public filePath: Uri
  public controller: Controller

  constructor(range: Range, path: Uri, controller: Controller) {
    super(range)
    this.filePath = path
    this.controller = controller
  }
}

/**
 * Parse a route controller string into a Controller type.
 *
 * @param text Route controller string
 */
export function parseControllerString(text: string): Controller | null {
  const fullPath = text.replace(/["']/g, '')
  const parts = fullPath.split('.')
  if (parts.length === 0) return null

  const matches = parts[0].match(/(([^\/]*\/)*)([^\/]+)Controller$/)
  if (!matches) return null

  return {
    fullname: parts[0],
    fullPath,
    parentDirectory: matches[1],
    name: matches[3],
    method: parts[1] || '',
  }
}

/**
 * Create a controller link that points to a method in an adonis controller file.
 *
 * @param start Postion in document to start link creation
 * @param end Postion in document to end link creation
 * @param controller Controller object to build link from
 * @param file Javascript file to point controller and method link to
 * @param useFallbackLink If no match is found, link to provided file, else return null
 */
export async function createControllerLink(
  start: Position,
  end: Position,
  controller: Controller,
  file: Uri,
  useFallbackLink = true
): Promise<RouteControllerLink | null> {
  const method = controller.method
  const range = new Range(start, end)
  if (range.isEmpty) return null

  const link = new RouteControllerLink(range, file, controller)
  const location = await getLineNumber(file.fsPath.toString(), method)

  if (location.lineno <= -1 && !useFallbackLink) return null

  if (location.lineno <= -1) {
    link.target = link.filePath
  }

  return link
}
