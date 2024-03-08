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

/**
 * Copy/paste from https://github.com/sindresorhus/slash/blob/main/index.js
 * Since the original package is now ESM only
 */
export function slash(path: string) {
  const isExtendedLengthPath = path.startsWith('\\\\?\\')

  if (isExtendedLengthPath) {
    return path
  }

  return path.replace(/\\/g, '/')
}
