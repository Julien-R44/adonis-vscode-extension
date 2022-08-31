import { parse } from '@babel/parser'
import {
  isArrowFunctionExpression,
  isFunctionExpression,
  isImportDeclaration,
  isStatement,
} from '@babel/types'
import { GroupNode } from './nodes/group_node'
import { TestNode } from './nodes/test_node'
import type { Ast, BabelTestGroupNode } from './contracts'
import type { Statement } from '@babel/types'

export class TestsExtractor {
  private ast!: Ast

  /**
   * Generate an AST from the given source
   */
  private generateAst(source: string) {
    return parse(source, {
      sourceType: 'module',
      plugins: [
        'typescript',
        'decoratorAutoAccessors',
        ['decorators', { decoratorsBeforeExport: true }],
      ],
    })
  }

  /**
   * Is the file importing `test` from `@japa/runner`
   */
  private doesImportJapaRunner() {
    return this.ast.program.body.some((node) => {
      return isImportDeclaration(node) && node.source.value === '@japa/runner'
    })
  }

  /**
   * Returns a boolean telling if the test.group has a callback defined
   *
   * `test.group('Group')` => false
   * `test.group('Group', () => {})` => true
   */
  private doesTestGroupHasCallbackDefined(node: BabelTestGroupNode): node is BabelTestGroupNode & {
    expression: { arguments: [any, { body: Statement & { body: Statement[] } }] }
  } {
    const secondArgumentOfCallExpression = node.expression.arguments[1]

    const isSecondArgumentIsFunction =
      isArrowFunctionExpression(secondArgumentOfCallExpression) ||
      isFunctionExpression(secondArgumentOfCallExpression)

    return isSecondArgumentIsFunction && isStatement(secondArgumentOfCallExpression.body)
  }

  /**
   * Create a GroupNode instance, and extract tests inside it.
   */
  private createGroupNode(node: BabelTestGroupNode) {
    const group = new GroupNode(node)

    if (!this.doesTestGroupHasCallbackDefined(node)) {
      return group
    }

    const callbackBody = node.expression.arguments[1].body.body
    const { tests } = this.searchTestsAndGroups(callbackBody, { ignoreGroups: true })
    group.addTests(tests)

    return group
  }

  /**
   * Walk over the AST and search for tests and groups. Recursive method.
   */
  private searchTestsAndGroups(nodes: Statement[], options: { ignoreGroups?: boolean } = {}) {
    const tests: TestNode[] = []
    const groups: GroupNode[] = []

    for (const node of nodes) {
      if (GroupNode.isTestGroupNode(node) && !options.ignoreGroups) {
        groups.push(this.createGroupNode(node))
      } else if (TestNode.isTestNode(node)) {
        tests.push(new TestNode(node))
      }
    }

    return { tests, groups }
  }

  /**
   * Extract tests and groups from the given source
   */
  public extract(source: string) {
    this.ast = this.generateAst(source)

    if (!this.doesImportJapaRunner()) {
      throw new Error('`test` from @japa/runner is not imported')
    }

    return this.searchTestsAndGroups(this.ast.program.body)
  }
}
