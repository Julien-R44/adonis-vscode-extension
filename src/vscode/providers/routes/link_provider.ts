import { type DocumentLinkProvider, type TextDocument, Uri } from 'vscode'
import ProjectManager from '../../project_manager'
import { ControllersLinker } from '../../../linkers/controllers_linker'
import { getLineNumber } from '../../../utilities/misc'
import { DocumentLinkFactory } from '../../factories/document_link_factory'
import type { RouteControllerLink } from '../../factories/document_link_factory'

export class RouteControllerLinkProvider implements DocumentLinkProvider {
  public async provideDocumentLinks(doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    const links = await ControllersLinker.getLinks({
      fileContent: doc.getText(),
      project: project!,
    })

    return DocumentLinkFactory.fromControllerLink(links)
  }

  public async resolveDocumentLink(link: RouteControllerLink) {
    const path = link.filePath.toString()
    const method = link.controller.method
    const location = await getLineNumber(link.filePath.fsPath, method!)

    link.target = Uri.parse(location.lineno === -1 ? `${path}#1` : `${path}#${location.lineno}`)

    return link
  }
}
