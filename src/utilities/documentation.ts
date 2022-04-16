import * as fs from 'fs'
import { Path } from './pathMatching'
import { MarkdownString } from 'vscode'
const DocBlock = require('docblock')

export function getDocForMethodInFile(file: string, methodName: string): MarkdownString | null {
  if (methodName.trim().length === 0) return null

  const source = readFileSync(file)
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
 * Read the content of a file. If the file doesn't exist, a null value
 * is return instead of an IO exception.
 *
 * @param file File to read content
 */
function readFileSync(file: string): Buffer | null {
  try {
    return fs.readFileSync(file)
  } catch (err) {
    return null
  }
}

/**
 * Generate a markdown of all possible file paths provided.
 *
 * @param filePaths File paths to link hover text tp
 */
export function generateDocFromPath(path: Path, showFolderTip: boolean = true) {
  let text: string = ''
  text += showFolderTip ? `\`${path.name}\`` : ''
  text += ` [${path.fullpath}](${path.uri})  \r`

  return new MarkdownString(text)
}
