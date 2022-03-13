import {
  Range,
  Position,
  TextEdit,
  TextDocument,
  FormattingOptions,
  DocumentFormattingEditProvider,
  DocumentRangeFormattingEditProvider,
} from 'vscode'
import ConfigWrapper from '../../../utilities/config'
import * as html from 'vscode-html-languageservice'
import * as lst from 'vscode-languageserver-types'
import EdgeFormatter from '../formatters/EdgeFormatter'

const HtmlLanguageService = html.getLanguageService()

class EdgeFormattingProvider
  implements DocumentFormattingEditProvider, DocumentRangeFormattingEditProvider
{
  /**
   * Provide formatting edits for a whole document.
   *
   * @param document The document in which the command was invoked.
   * @param options Options controlling formatting.
   * @return A set of text edits or a thenable that resolves to such. The lack of a result can be
   * signaled by returning `undefined`, `null`, or an empty array.
   */
  public provideDocumentFormattingEdits(
    document: TextDocument,
    options: FormattingOptions
  ): TextEdit[] {
    const range = new Range(
      new Position(0, 0),
      new Position(document.lineCount - 1, Number.MAX_VALUE)
    )

    return this.format(document, document.validateRange(range), options)
  }

  /**
   * Provide formatting edits for a range in a document.
   *
   * The given range is a hint and providers can decide to format a smaller
   * or larger range. Often this is done by adjusting the start and end
   * of the range to full syntax nodes.
   *
   * @param document The document in which the command was invoked.
   * @param range The range which should be formatted.
   * @param options Options controlling formatting.
   * @return A set of text edits or a thenable that resolves to such. The lack of a result can be
   * signaled by returning `undefined`, `null`, or an empty array.
   */
  public provideDocumentRangeFormattingEdits(
    document: TextDocument,
    range: Range,
    options: FormattingOptions
  ): TextEdit[] {
    return this.format(document, range, options)
  }

  /**
   * Format the content of an edge.
   *
   * @param document Edge document to format
   * @param range The range in document to format
   * @param options Formatting options and configuration
   */
  private format(document: TextDocument, range: Range, options: FormattingOptions): TextEdit[] {
    const htmlText = this.formatHtml(document, range, options)

    const formatter = new EdgeFormatter({
      tabSize: options.tabSize,
      useSpaces: options.insertSpaces,
    })

    const edgeText = formatter.format(htmlText.newText)

    return [TextEdit.replace(range, edgeText)]
  }

  /**
   * Format the html in a given document.
   *
   * @param document Document in which to perform HTML formatting
   * @param range Range in document to perform formatting
   * @param formatOptions Basic options to use in formatting the document
   */
  private formatHtml(
    document: TextDocument,
    range: Range,
    formatOptions: FormattingOptions
  ): html.TextEdit {
    Object.assign(formatOptions, ConfigWrapper.html.format)

    const htmlDoc = lst.TextDocument.create(document.uri.fsPath, 'html', 1, document.getText())

    return HtmlLanguageService.format(htmlDoc, range, formatOptions)[0]
  }
}

export default EdgeFormattingProvider
