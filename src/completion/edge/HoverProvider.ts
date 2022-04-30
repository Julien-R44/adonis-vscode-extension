import { HoverProvider, TextDocument, Position, ProviderResult, Hover } from 'vscode'
import { DocumentationProvider } from '../../services/DocumentationProvider'
import { getExactPathMatch } from '../../utilities/pathMatching'
import Config from '../../utilities/config'

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
      const markdown = DocumentationProvider.generateDocFromPath(matchedView, true)
      return new Hover(markdown)
    }
  }
}

export default EdgeHoverProvider
