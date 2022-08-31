import {
  isCallExpression,
  isExpressionStatement,
  isIdentifier,
  isMemberExpression,
  isStringLiteral,
} from '@babel/types'
import { convertLocation, getLastCallExpression } from '../helpers'
import type { CallExpression, Statement } from '@babel/types'
import type { BabelTestNode, Location } from '../contracts'

export class TestNode {
  title: string
  location: Location

  /**
   * Indicates if the given node is a test() call
   */
  public static isTestNode(node: Statement): node is BabelTestNode {
    /**
     * The expression statement is one of the following :
     * 1. test('foo', () => {})
     * 2. test('foo', function () {})
     * 3. test('foo', fn)
     */
    const isBasicTest =
      isExpressionStatement(node) &&
      isCallExpression(node.expression) &&
      isIdentifier(node.expression.callee) &&
      node.expression.callee.name === 'test'

    if (isBasicTest) {
      return true
    }

    /**
     * The expression is a chain of member expressions so something like :
     * 1. test('foo', () => {}).skip()
     * 2. test('foo', () => {}.with().skip()
     * etc..
     */
    const isCalleeAMemberExpression =
      isExpressionStatement(node) &&
      isCallExpression(node.expression) &&
      isMemberExpression(node.expression.callee)

    if (isCalleeAMemberExpression) {
      const lastCallee = getLastCallExpression(node.expression as CallExpression)
      return isIdentifier(lastCallee.callee) && lastCallee.callee.name === 'test'
    }

    return false
  }

  /**
   * Get the defined test name from the AST node
   */
  private getTestName(node: BabelTestNode) {
    const lastCallExpression = getLastCallExpression(node.expression)
    const firstArgument = lastCallExpression.arguments[0]

    if (isStringLiteral(firstArgument)) {
      return firstArgument.value
    }
    return 'Unkown test name'
  }

  constructor(node: BabelTestNode) {
    this.title = this.getTestName(node)
    this.location = convertLocation(node.loc!)
  }
}
