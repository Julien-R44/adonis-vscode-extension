import { pathToFileURL } from 'url'
import { DocumentLink, Position, Range, Uri } from 'vscode'
import type { Controller } from '../../types'
import type { RouteLink } from '../../linkers/controllers_linker'
import type { ViewLink } from '../../linkers/views_linker'

export class RouteControllerLink extends DocumentLink {
  public filePath: Uri
  public controller: Controller

  constructor(range: Range, path: Uri, controller: Controller) {
    super(range)
    this.filePath = path
    this.controller = controller
  }
}

export class DocumentLinkFactory {
  static fromViewLink(links: ViewLink[]) {
    return links.map((link) => {
      const templateUri = Uri.parse(pathToFileURL(link.templatePath).href)

      const start = new Position(link.position.line, link.position.colStart)
      const end = new Position(link.position.line, link.position.colEnd)

      return new DocumentLink(new Range(start, end), templateUri)
    })
  }

  static fromControllerLink(links: RouteLink[]) {
    return links.map((link) => {
      const templateUri = Uri.parse(pathToFileURL(link.controllerPath).href)

      const start = new Position(link.position.line, link.position.colStart)
      const end = new Position(link.position.line, link.position.colEnd)

      return new RouteControllerLink(new Range(start, end), templateUri, link.controller)
    })
  }
}
