import type { DocumentLinkProvider, TextDocument } from 'vscode'

import ExtConfig from '../../utilities/config'
import ProjectManager from '../../project_manager'
import { DiagnosticCollection } from '../../file_diagnostics'
import { InertiaLinker } from '../../../linkers/inertia_linker'
import { DocumentLinkFactory } from '../../factories/document_link_factory'

export default class InertiaLinkProvider implements DocumentLinkProvider {
  #collection = new DiagnosticCollection('adonisjs-inertia')

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
