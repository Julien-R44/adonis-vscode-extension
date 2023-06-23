import { Diagnostic, DiagnosticSeverity, Range, languages } from 'vscode'
import type { TextDocument, DiagnosticCollection as VscodeDiagnosticCollection } from 'vscode'
import type { RouteLink } from '../linkers/controllers_linker'
import type { ViewLink } from '../linkers/views_linker'

export class DiagnosticCollection {
  #collection: VscodeDiagnosticCollection

  constructor(collectionName: string) {
    this.#collection = languages.createDiagnosticCollection(collectionName)
  }

  setNew({
    doc,
    links,
    code,
    message,
  }: {
    doc: TextDocument
    links: ViewLink[] | RouteLink[]
    code?: string
    message?: string
  }) {
    this.#collection.delete(doc.uri)

    if (links.length === 0) {
      return
    }

    for (const link of links) {
      if ('templatePath' in link && link.templatePath !== null) {
        continue
      }

      if ('controllerPath' in link && link.controllerPath !== null) {
        continue
      }

      const range = new Range(
        link.position.line,
        link.position.colStart,
        link.position.line,
        link.position.colEnd
      )

      message = message || 'Could not resolve document link'
      const diagnostic = new Diagnostic(range, message, DiagnosticSeverity.Error)
      diagnostic.code = `adonisjs.${code}`

      const alreadySet = this.#collection.get(doc.uri)
      this.#collection.set(doc.uri, alreadySet ? [...alreadySet, diagnostic] : [diagnostic])
    }
  }
}
