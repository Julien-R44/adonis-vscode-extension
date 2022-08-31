import type {
  CallExpression,
  ExpressionStatement,
  File,
  Identifier,
  MemberExpression,
  SourceLocation,
} from '@babel/types'
import type { ParseResult } from '@babel/parser'

export type BabelTestGroupNode = ExpressionStatement & {
  expression: CallExpression & {
    callee: MemberExpression & {
      property: Identifier
    }
  }
}

export type BabelTestNode = ExpressionStatement & {
  expression: CallExpression
}

export type Ast = ParseResult<File>

export type Location = Omit<SourceLocation, 'filename' | 'identifierName'>
