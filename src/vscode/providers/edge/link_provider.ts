import { ViewsLinker } from '../../../linkers/views_linker'
import ProjectManager from '../../project_manager'
import { DocumentLinkFactory } from '../../factories/document_link_factory'
import type { DocumentLinkProvider, TextDocument } from 'vscode'

export default class EdgeLinkProvider implements DocumentLinkProvider {
  async provideDocumentLinks(doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    const links = await ViewsLinker.getLinks({
      fileContent: doc.getText(),
      project: project!,
      sourceType: 'edge',
    })

    return DocumentLinkFactory.fromViewLink(links)
  }
}
