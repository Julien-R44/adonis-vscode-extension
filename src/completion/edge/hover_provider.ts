import { Hover } from 'vscode'
import { DocumentationProvider } from '../../services/documentation_provider'
import { getExactPathMatch } from '../../utilities/path_matching'
import Config from '../../utilities/config'
import type { HoverProvider, Position, ProviderResult, TextDocument } from 'vscode'

class EdgeHoverProvider implements HoverProvider {
  public provideHover(doc: TextDocument, pos: Position): ProviderResult<Hover> {
    const config = Config.autocomplete
    const regex = new RegExp(config.viewsRegex)
    const range = doc.getWordRangeAtPosition(pos, regex)
    if (!range) return

    const text = doc.getText(range)
    const matchedView = getExactPathMatch(
      text,
      doc,
      config.viewsDirectories,
      config.viewsExtensions
    )

    if (matchedView) {
      const markdown = DocumentationProvider.generateDocFromPath(matchedView)
      return new Hover(markdown)
    }
  }
}

export default EdgeHoverProvider
