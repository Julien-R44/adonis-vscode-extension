import { TextDocument, ProviderResult, DocumentLink, DocumentLinkProvider, Uri } from 'vscode'
import { getLineNumber, getMaxLinesCount } from '../../utilities/functions'
import { RouteControllerLink } from '../../utilities/controller'
import ConfigWrapper from '../../utilities/config'
import { DocumentLinker } from '../../services/DocumentLinker'

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
    let path = link.filePath.toString()
    const method = link.controller.method

    return new Promise(async (resolve) => {
      const location = await getLineNumber(link.filePath.fsPath, method)

      link.target = Uri.parse(location.lineno === -1 ? `${path}#1` : `${path}#${location.lineno}`)

      return resolve(link)
    })
  }
}
