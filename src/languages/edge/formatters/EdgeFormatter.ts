/**
 * Format the content of an edge file.
 */
class EdgeFormatter {
  private newLine: string = '\n'
  private indentPattern: string

  /**
   * Create an edge formatter instance.
   *
   * This allows the formatting of any edge text stream.
   *
   * @param options Formatting options
   */
  constructor(options?: EdgeFormatterContract) {
    options = options || {}

    options.tabSize = options.tabSize || 4
    if (typeof options.useSpaces === 'undefined') {
      options.useSpaces = true
    }

    this.indentPattern = options.useSpaces ? ' '.repeat(options.tabSize) : '\t'
  }

  /**
   * Format a given text which is assumed to be the source of an edge file.
   *
   * @param inputText Test to format
   */
  public format(inputText: string): string {
    console.log('format baby')
    let output: string = inputText

    // Block pattern
    const patternBlock = /(\@)(inject|extends|section|hasSection|include|stop|endpush|endphp)/g

    // edge format fix
    output = output.replace(patternBlock, (match) => `\n${match}`)
    output = output.replace(/(\s*)\@include/g, `\n${this.indentPattern}@include`)
    output = output.replace(/(\s*)\@endsection/g, '\n@endsection\n')

    // Fix empty new line after @extends and self-closing @section
    output = output.replace(
      /(\@(section|yield)\(.*\',.*|\@extends\(.*\))/g,
      (match) => `${match}\n`
    )

    output = inputText.replace(/url\(\"(\s*)/g, 'url("')
    return output.trim()
  }
}

/**
 * Edge formatter configuration.
 */
export interface EdgeFormatterContract {
  /**
   * Use spaces instead of tabs.
   */
  useSpaces?: boolean

  /**
   * The tab size to use for formatting.
   *
   * If spaces is preffered above tabs, the total number of spaces that
   * will be used, will equal the tab size specified.
   */
  tabSize?: number
}

export default EdgeFormatter
