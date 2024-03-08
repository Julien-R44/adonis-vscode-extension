import { readFileSync } from 'node:fs'

import type { RcFile } from '../../types'

/**
 * Parser of RC File defined using JSON
 */
export class RcJsonFile implements RcFile {
  #content: Record<string, any>

  constructor(path: string) {
    this.#content = JSON.parse(readFileSync(path, 'utf8'))
  }

  directories(): Record<string, string> {
    return this.#content.directories ?? {}
  }

  providers(): string[] {
    return this.#content.providers ?? []
  }
}
