import { type DocumentLinkProvider, type TextDocument } from 'vscode'
import { ViewsLinker } from '../../../linkers/views_linker'
import ProjectManager from '../../project_manager'
import { DocumentLinkFactory } from '../../factories/document_link_factory'
import { DiagnosticCollection } from '../../file_diagnostics'

/**
 * Provide Document Links for templates files in TS file
 * Example : view.render('my-template')
 */
export class ViewsLinkProvider implements DocumentLinkProvider {
  #collection = new DiagnosticCollection('adonisjs-views')

  public async provideDocumentLinks(doc: TextDocument) {
    const project = ProjectManager.getProjectFromFile(doc.uri.fsPath)
    const links = await ViewsLinker.getLinks({
      fileContent: doc.getText(),
      project: project!,
      sourceType: 'ts',
    })

    this.#collection.setNew({ doc, links, code: 'missing-view', message: 'Missing view' })
    return DocumentLinkFactory.fromViewLink(links)
  }
}
