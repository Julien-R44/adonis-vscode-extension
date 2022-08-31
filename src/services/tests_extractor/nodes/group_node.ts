import {
  isCallExpression,
  isExpressionStatement,
  isIdentifier,
  isMemberExpression,
  isStringLiteral,
} from '@babel/types'
import { convertLocation } from '../helpers'
import type { Statement } from '@babel/types'
import type { BabelTestGroupNode, Location } from '../contracts'
import type { TestNode } from './test_node'

export class GroupNode {
  title: string
  tests: TestNode[]
  location: Location

  /**
   * Indicate if the given node is a test.group() call
   */
  public static isTestGroupNode(node: Statement): node is BabelTestGroupNode {
    return (
      isExpressionStatement(node) &&
      isCallExpression(node.expression) &&
      isMemberExpression(node.expression.callee) &&
      isIdentifier(node.expression.callee.property) &&
      node.expression.callee.property.name === 'group'
    )
  }

  /**
   * Get the defined group name from the AST node
   */
  getGroupName(node: BabelTestGroupNode) {
    const argument = node.expression.arguments[0]

    if (isStringLiteral(argument)) {
      return argument.value
    }

    throw new Error('Not supported group name')
  }

  constructor(node: BabelTestGroupNode) {
    this.title = this.getGroupName(node)
    this.location = convertLocation(node.loc!)
    this.tests = []
  }

  addTests(test: TestNode[]) {
    this.tests = this.tests.concat(test)
  }
}
