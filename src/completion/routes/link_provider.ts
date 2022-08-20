import { Uri } from 'vscode'
import { getLineNumber, getMaxLinesCount } from '../../utilities/functions'
import ConfigWrapper from '../../utilities/config'
import { DocumentLinker } from '../../services/document_linker'
import type { RouteControllerLink } from '../../utilities/controller'
import type { DocumentLink, DocumentLinkProvider, ProviderResult, TextDocument } from 'vscode'

export class RouteControllerLinkProvider implements DocumentLinkProvider {
  public provideDocumentLinks(doc: TextDocument): ProviderResult<DocumentLink[]> {
    const config = ConfigWrapper.autocomplete
    const docLinks: DocumentLink[] = []

    return new Promise(async (resolve) => {
      if (config.quickJump) {
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
      }

      resolve(docLinks)
    })
  }

  public resolveDocumentLink(link: RouteControllerLink): ProviderResult<DocumentLink> {
    const path = link.filePath.toString()
    const method = link.controller.method

    return new Promise(async (resolve) => {
      const location = await getLineNumber(link.filePath.fsPath, method)

      link.target = Uri.parse(location.lineno === -1 ? `${path}#1` : `${path}#${location.lineno}`)

      return resolve(link)
    })
  }
}
