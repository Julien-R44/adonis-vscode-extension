import { type DocumentLinkProvider, type TextDocument, Uri } from 'vscode'

import { getLineNumber } from '#/utilities/misc'
import ProjectManager from '#vscode/project_manager'
import { DiagnosticCollection } from '#vscode/file_diagnostics'
import { ControllersLinker } from '#/linkers/controllers_linker'
import { DocumentLinkFactory } from '#vscode/factories/document_link_factory'
import type { RouteControllerLink } from '#vscode/factories/document_link_factory'

export class RouteControllerLinkProvider implements DocumentLinkProvider {
  #collection = new DiagnosticCollection('adonisjs-routes')

  async provideDocumentLinks(doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    const links = await ControllersLinker.getLinks({
      fileContent: doc.getText(),
      project: project!,
    })

    this.#collection.setNew({ doc, links, message: 'Missing controller' })
    return DocumentLinkFactory.fromControllerLink(links)
  }

  async resolveDocumentLink(link: RouteControllerLink) {
    const path = link.filePath.toString()
    const method = link.controller.method
    const location = await getLineNumber(link.filePath.fsPath, method!)

    link.target = Uri.parse(location.lineno === -1 ? `${path}#1` : `${path}#${location.lineno}`)

    return link
  }
}
