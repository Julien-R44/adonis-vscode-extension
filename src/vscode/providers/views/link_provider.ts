import { ViewsLinker } from '../../../linkers/views_linker'
import ProjectManager from '../../project_manager'
import { DocumentLinkFactory } from '../../factories/document_link_factory'
import type { DocumentLinkProvider, TextDocument } from 'vscode'

/**
 * Provide Document Links for templates files in TS file
 * Example : view.render('my-template')
 */
export class ViewsLinkProvider implements DocumentLinkProvider {
  public async provideDocumentLinks(doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    const links = await ViewsLinker.getLinks({
      fileContent: doc.getText(),
      project: project!,
      sourceType: 'ts',
    })

    return DocumentLinkFactory.fromViewLink(links)
  }
}
