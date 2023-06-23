import { ViewsLinker } from '../../../linkers/views_linker'
import ProjectManager from '../../project_manager'
import { DocumentLinkFactory } from '../../factories/document_link_factory'
import { DiagnosticCollection } from '../../file_diagnostics'
import type { DocumentLinkProvider, TextDocument } from 'vscode'

export default class EdgeLinkProvider implements DocumentLinkProvider {
  #collection = new DiagnosticCollection('adonisjs-edge')

  async provideDocumentLinks(doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    const links = await ViewsLinker.getLinks({
      fileContent: doc.getText(),
      project: project!,
      sourceType: 'edge',
    })

    this.#collection.setNew({ doc, links, code: 'missing-view', message: 'Missing view' })
    return DocumentLinkFactory.fromViewLink(links)
  }
}
