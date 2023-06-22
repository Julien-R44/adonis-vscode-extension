import type { EdgeFormatterContract } from '../../../../types'

/**
 * Format the content of an edge file.
 */
class EdgeFormatter {
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
  public format(inputText: string) {
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
    output = output.replace(/route\((\"|\')(\s*)/g, 'route($1')

    return output.trim()
  }
}

export default EdgeFormatter
