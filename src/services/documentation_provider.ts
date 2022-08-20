import * as fs from 'fs'
import { Path } from '../utilities/path_matching'
import { MarkdownString } from 'vscode'
const DocBlock = require('docblock')

export class DocumentationProvider {
  /**
   * Read the content of a file. If the file doesn't exist, a null value
   * is return instead of an IO exception.
   */
  private static readFileSync(file: string): Buffer | null {
    try {
      return fs.readFileSync(file)
    } catch (err) {
      return null
    }
  }

  /**
   * Get DocBlock for the given method name in the given file
   */
  public static getDocForMethodInFile(file: string, methodName: string): MarkdownString | null {
    if (methodName.trim().length === 0) {
      return null
    }

    const source = this.readFileSync(file)
    if (!source) return null

    const matches = file.match(/\.[0-9a-z]+$/)
    const fileExtension = matches ? matches[0] : '.js'

    const docBlock = new DocBlock()
    let result: any[any] = docBlock.parse(source, fileExtension).filter((doc: any) => {
      const pattern = `.*${methodName}\\s*\\(.*\\)\\s*(:\\s*\\w+\\s*)?\\{((.[^\\}]|\\s)*)\\}`
      const regex = new RegExp(pattern, 'gm')
      return regex.test(doc.code)
    })

    if (result.length === 0) return null
    const docString = ` ${result[0].tags.title}  \r${result[0].description}`

    return new MarkdownString(docString)
  }

  /**
   * Generate a markdown of all possible file paths provided.
   */
  public static generateDocFromPath(path: Path, showFolderTip: boolean = false) {
    let text: string = ''
    text += showFolderTip ? `\`${path.name}\`` : ''
    text += ` [${path.fullpath}](${path.uri})  \r`

    return new MarkdownString(text)
  }
}
