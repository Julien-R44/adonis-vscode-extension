import { parse } from '@babel/parser'
import { readFileSync } from 'node:fs'
import traverse from '@babel/traverse'
import type { NodePath } from '@babel/traverse'
import type { ObjectProperty } from '@babel/types'
import { isIdentifier, isStringLiteral } from '@babel/types'

import type { RcFile } from '#types/index'

/**
 * Parser of RC File defined using TypeScript
 */
export class RcTsFile implements RcFile {
  #directories: Record<string, string> = {}
  #providers: string[] = []

  constructor(path: string) {
    this.#parseFile(readFileSync(path, 'utf8'))
  }

  /**
   * Parse the directories from the AST
   */
  #parseDirectories(node: NodePath<ObjectProperty>) {
    const directories: Record<string, string> = {}

    node.traverse({
      ObjectProperty(dirPath) {
        let keyName = ''

        if (isStringLiteral(dirPath.node.key)) {
          keyName = dirPath.node.key.value
        } else if (isIdentifier(dirPath.node.key)) {
          keyName = dirPath.node.key.name
        }

        if (!isStringLiteral(dirPath.node.value)) return

        const key = keyName
        const value = dirPath.node.value.value
        directories[key] = value
      },
    })

    return directories
  }

  /**
   * Parse the providers from the AST
   */
  #parseProviders(innerPath: NodePath<ObjectProperty>) {
    const providers: string[] = []

    innerPath.traverse({
      /**
       * Capture providers defined with arrow functions syntax
       */
      ArrowFunctionExpression(providerPath) {
        providerPath.traverse({
          StringLiteral(importPath) {
            providers.push(importPath.node.value)
          },
        })
      },

      /**
       * Capture providers defined with object expression syntax
       */
      ObjectExpression(providerPath) {
        providerPath.traverse({
          ArrowFunctionExpression(arrowFunctionPath) {
            arrowFunctionPath.traverse({
              StringLiteral(importStringPath) {
                providers.push(importStringPath.node.value)
              },
            })
          },
        })
      },
    })

    return [...new Set(providers)]
  }

  /**
   * Parses the rc file and extracts the directories and
   * providers from the AST
   */
  #parseFile(content: string) {
    const ast = parse(content, {
      sourceType: 'module',
      plugins: [
        'typescript',
        'decoratorAutoAccessors',
        ['decorators', { decoratorsBeforeExport: true }],
      ],
    })

    traverse(ast, {
      ExportDefaultDeclaration: (path) => {
        path.traverse({
          ObjectProperty: (innerPath) => {
            if (!isIdentifier(innerPath.node.key)) return

            if (innerPath.node.key.name === 'directories') {
              this.#directories = this.#parseDirectories(innerPath)
            }

            if (innerPath.node.key.name === 'providers') {
              this.#providers = this.#parseProviders(innerPath)
            }
          },
        })
      },
    })
  }

  directories(): Record<string, string> {
    return this.#directories
  }

  providers(): string[] {
    return this.#providers
  }
}
