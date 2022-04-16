import {
  TextDocument,
  ProviderResult,
  DocumentLink,
  Position,
  Range,
  DocumentLinkProvider,
} from 'vscode'
import { getExactPathMatch } from '../../utilities/pathMatching'
import Config from '../../utilities/config'

class EdgeLinkProvider implements DocumentLinkProvider {
  public provideDocumentLinks(doc: TextDocument): ProviderResult<DocumentLink[]> {
    const config = Config.autocomplete
    const docLinks: DocumentLink[] = []

    if (config.quickJump) {
      let currentLine = 0
      const regex = new RegExp(config.viewsRegex, 'g')
      const maxLinesCount = getMaxLinesCount(doc)

      while (currentLine < maxLinesCount) {
        const links = this.createDocumentLinks(
          regex,
          doc,
          currentLine,
          config.viewsDirectories,
          config.viewsExtensions
        )

        docLinks.push(...links)
        currentLine++
      }
    }

    return docLinks
  }

  /**
   * Create document links from a given line in a document.
   *
   * @param regex Regulars expression to match string for link
   * @param doc Document to create links from
   * @param lineNo Line number in document in which links are created
   */
  private createDocumentLinks(
    regex: RegExp,
    doc: TextDocument,
    lineNo: number,
    targetDirectories: string[],
    fileExtensions: string[]
  ) {
    let docLinks = []
    let line = doc.lineAt(lineNo)
    let matches = line.text.match(regex) || []
    if (matches.length < 0) return []

    for (let item of matches) {
      let file = getExactPathMatch(item, doc, targetDirectories, fileExtensions)

      if (file !== null) {
        let start = new Position(line.lineNumber, line.text.indexOf(item) + 1)
        let end = start.translate(0, item.length - 2)
        let docLink = new DocumentLink(new Range(start, end), file.uri)
        docLinks.push(docLink)
      }
    }

    return docLinks
  }
}

/**
 * Get the maximum line count to scan for a given document.
 *
 * @param doc Document to resolve line count
 */
function getMaxLinesCount(doc: TextDocument): number {
  const maxLinesCount = Config.autocomplete.maxLinesCount
  return doc.lineCount <= maxLinesCount ? doc.lineCount : maxLinesCount
}

export default EdgeLinkProvider
