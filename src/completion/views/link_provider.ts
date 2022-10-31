import ExtConfig from '../../utilities/config'
import { getMaxLinesCount } from '../../utilities/functions'
import { DocumentLinker } from '../../services/document_linker'
import type { DocumentLink, DocumentLinkProvider, TextDocument } from 'vscode'

export class ViewsLinkProvider implements DocumentLinkProvider {
  public async provideDocumentLinks(doc: TextDocument) {
    const config = ExtConfig.autocomplete

    const docLinks: DocumentLink[] = []

    if (!config.quickJump) return docLinks

    let currentLine = 0
    const regex = new RegExp(config.tsViewsRegex)
    const maxLinesCount = getMaxLinesCount(doc)

    while (currentLine < maxLinesCount) {
      const links = await DocumentLinker.createViewDocumentLinks(
        regex,
        doc,
        currentLine,
        config.viewsDirectories,
        config.viewsExtensions
      )

      docLinks.push(...links)
      currentLine++
    }

    return docLinks
  }
}
