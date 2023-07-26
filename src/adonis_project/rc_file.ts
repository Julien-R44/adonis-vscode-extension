import { readFileSync } from 'node:fs'

export class RcFile {
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
