import type { Controller } from '../types'

/**
 * Parse a route controller string into a Controller type.
 *
 * @param text Route controller string
 */
export function parseMagicString(text: string): Controller | null {
  const sanitized = text.replaceAll(/["']/g, '').replaceAll(/\s/g, '')
  const [firstPart, method] = sanitized.split('.')

  if (!firstPart) return null

  const subpathImport = sanitized.match(/(#.+?)\//)
  const namespace = sanitized.match(/(?:#.+?\/)?(.+)\//)

  const name = firstPart!.split('/').pop()

  return {
    name: name!,
    subpathImport: subpathImport?.[1],
    namespace: namespace?.[1]?.startsWith('#') ? undefined : namespace?.[1],
    method,
    fullPath: sanitized,
  }
}
