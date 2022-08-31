import { isCallExpression, isMemberExpression } from '@babel/types'
import type { CallExpression, SourceLocation } from '@babel/types'

export function convertLocation(loc: SourceLocation) {
  return {
    start: { line: loc.start.line, column: loc.start.column },
    end: { line: loc.end.line, column: loc.end.column },
  }
}

export function getLastCallExpression(expression: CallExpression) {
  let lastCallExpression = expression
  while (isCallExpression(lastCallExpression) && isMemberExpression(lastCallExpression.callee)) {
    lastCallExpression = lastCallExpression.callee.object as CallExpression
  }

  return lastCallExpression as CallExpression
}
