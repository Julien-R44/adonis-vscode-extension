import { Uri } from 'vscode'
import { getLineNumber, getMaxLinesCount } from '../../utilities/functions'
import ExtConfig from '../../utilities/config'
import { DocumentLinker } from '../../services/document_linker'
import type { RouteControllerLink } from '../../utilities/controller'
import type { DocumentLink, DocumentLinkProvider, TextDocument } from 'vscode'

export class RouteControllerLinkProvider implements DocumentLinkProvider {
  public async provideDocumentLinks(doc: TextDocument) {
    const config = ExtConfig.autocomplete
    const docLinks: DocumentLink[] = []

    if (!config.quickJump) return docLinks

    let currentLine = 0
    const regex = new RegExp(config.controllersRegex, 'g')
    const maxLinesCount = getMaxLinesCount(doc)

    while (currentLine < maxLinesCount) {
      const links = await DocumentLinker.createControllerDocumentLinks(
        regex,
        doc,
        currentLine,
        config.controllersDirectories,
        config.controllersExtensions
      )

      docLinks.push(...links)
      currentLine++
    }

    return docLinks
  }

  public async resolveDocumentLink(link: RouteControllerLink) {
    const path = link.filePath.toString()
    const method = link.controller.method
    const location = await getLineNumber(link.filePath.fsPath, method)

    link.target = Uri.parse(location.lineno === -1 ? `${path}#1` : `${path}#${location.lineno}`)

    return link
  }
}
