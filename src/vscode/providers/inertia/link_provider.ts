import type { DocumentLinkProvider, TextDocument } from 'vscode'

import ExtConfig from '#vscode/utilities/config'
import ProjectManager from '#vscode/project_manager'
import { InertiaLinker } from '#/linkers/inertia_linker'
import { DocumentLinkFactory } from '#vscode/factories/document_link_factory'

export default class InertiaLinkProvider implements DocumentLinkProvider {
  async provideDocumentLinks(doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    const links = await InertiaLinker.getLinks({
      fileContent: doc.getText(),
      project: project!,
      pagesDirectory: ExtConfig.inertia.pagesDirectory,
    })

    return DocumentLinkFactory.fromViewLink(links)
  }
}
