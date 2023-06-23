import ProjectManager from '../../project_manager'
import { DocumentLinkFactory } from '../../factories/document_link_factory'
import { DiagnosticCollection } from '../../file_diagnostics'
import { InertiaLinker } from '../../../linkers/inertia_linker'
import ExtConfig from '../../utilities/config'
import type { DocumentLinkProvider, TextDocument } from 'vscode'

export default class InertiaLinkProvider implements DocumentLinkProvider {
  #collection = new DiagnosticCollection('adonisjs-inertia')

  async provideDocumentLinks(doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    const links = await InertiaLinker.getLinks({
      fileContent: doc.getText(),
      project: project!,
      pagesDirectory: ExtConfig.inertia.pagesDirectory,
    })

    this.#collection.setNew({ doc, links, message: 'Missing inertia page' })
    return DocumentLinkFactory.fromViewLink(links)
  }
}
