import { getExactPathMatch } from './pathMatching'
import { TextDocument, DocumentLink, Position, Range } from 'vscode'
import { parseControllerString, createControllerLink } from './controller'

/**
 * Create document links from a given line in a document.
 *
 * @param regex Regulars expression to match string for link
 * @param doc Document to create links from
 * @param lineNo Line number in document in which links are created
 * @param targetDirectories Directories to target
 * @param fileExtensions File extensions of all possible files to link to
 */
export async function createDocumentLinks(
  regex: RegExp,
  doc: TextDocument,
  lineNo: number,
  targetDirectories: string[],
  fileExtensions: string[]
): Promise<DocumentLink[]> {
  const docLinks: DocumentLink[] = []
  const line = doc.lineAt(lineNo)
  const matches = line.text.match(regex) || []
  if (matches.length < 0) return []

  for (const text of matches) {
    const controller = parseControllerString(text)
    if (!controller) continue

    const file = getExactPathMatch(controller.name, doc, targetDirectories, fileExtensions)

    if (file !== null) {
      // Controller name
      const index = line.text.indexOf(controller.fullname)
      let start = new Position(line.lineNumber, index)
      let end = start.translate(0, controller.fullname.length)
      let link = await createControllerLink(start, end, controller, file.uri)
      if (!link) continue

      // Controller method
      const initialPosition = start
      const initialLink = link
      start = end.translate(0, 1)
      end = start.translate(0, controller.method.length)
      link = await createControllerLink(start, end, controller, file.uri, false)

      if (!link) {
        docLinks.push(initialLink)
        continue
      }

      end = initialPosition.translate(0, controller.fullPath.length)
      initialLink.range = new Range(initialPosition, end)
      docLinks.push(initialLink)
    }
  }

  return docLinks
}
