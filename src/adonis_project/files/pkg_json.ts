import { readFileSync } from 'fs'
import semverMajor from 'semver/functions/major'

/**
 * Responsible for parsing package.json file
 */
export class PkgJson {
  #packageJson: Record<string, any>

  constructor(path: string) {
    this.#packageJson = JSON.parse(readFileSync(path, 'utf8'))
  }

  get name() {
    return this.#packageJson.name
  }

  get dependencies() {
    return this.#packageJson.dependencies
  }

  /**
   * Get the major version of the given package
   */
  getMajorOf(pkgName: string) {
    const version = this.dependencies?.[pkgName]
    if (!version) return

    return semverMajor(version.replace(/^[^0-9]*/, ''))
  }
}
