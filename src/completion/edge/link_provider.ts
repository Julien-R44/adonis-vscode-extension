import { TextDocument, ProviderResult, DocumentLink, DocumentLinkProvider } from 'vscode'
import Config from '../../utilities/config'
import { getMaxLinesCount } from '../../utilities/functions'
import { DocumentLinker } from '../../services/document_linker'

export default class EdgeLinkProvider implements DocumentLinkProvider {
  public provideDocumentLinks(doc: TextDocument): ProviderResult<DocumentLink[]> {
    const config = Config.autocomplete
    const docLinks: DocumentLink[] = []

    if (config.quickJump) {
      let currentLine = 0
      const regex = new RegExp(config.viewsRegex, 'g')
      const maxLinesCount = getMaxLinesCount(doc)

      while (currentLine < maxLinesCount) {
        const links = DocumentLinker.createViewDocumentLinks(
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
}
