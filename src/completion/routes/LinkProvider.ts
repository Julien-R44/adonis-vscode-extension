import { TextDocument, ProviderResult, DocumentLink, DocumentLinkProvider, Uri } from 'vscode'
import { getLineNumber } from '../../utilities/functions'
import { RouteControllerLink } from '../../utilities/controller'
import { createDocumentLinks } from '../../utilities/links'
import ConfigWrapper from '../../utilities/config'

export class RouteControllerLinkProvider implements DocumentLinkProvider {
  public provideDocumentLinks(doc: TextDocument): ProviderResult<DocumentLink[]> {
    console.log('lets provider')
    const config = ConfigWrapper.autocomplete
    const docLinks: DocumentLink[] = []

    return new Promise(async (resolve) => {
      if (config.quickJump) {
        let currentLine = 0
        const regex = new RegExp(config.controllersRegex, 'g')
        const maxLinesCount = getMaxLinesCount(doc)

        console.log(config.controllersDirectories)
        while (currentLine < maxLinesCount) {
          const links = await createDocumentLinks(
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

      console.log(docLinks)
      resolve(docLinks)
    })
  }

  public resolveDocumentLink(link: RouteControllerLink): ProviderResult<DocumentLink> {
    let path = link.filePath.toString()
    const method = link.controller.method

    console.log({ path, method })

    return new Promise(async (resolve) => {
      const location = await getLineNumber(link.filePath.toString(), method)

      link.target = Uri.parse(location.lineno === -1 ? `${path}#1` : `${path}#${location.lineno}`)

      console.log('hey', link.target)
      return resolve(link)
    })
  }
}

/**
 * Get the maximum line count to scan for a given document.
 *
 * @param doc Document to resolve line count
 */
function getMaxLinesCount(doc: TextDocument): number {
  const maxLinesCount = ConfigWrapper.autocomplete.maxLinesCount
  return doc.lineCount <= maxLinesCount ? doc.lineCount : maxLinesCount
}
