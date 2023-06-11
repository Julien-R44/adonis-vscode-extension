import { readFileSync } from 'fs'
import { basename, join } from 'path'
import type { AceManifest, AdonisEnv } from './types'

export class AdonisProject {
  name: string
  path: string
  env?: AdonisEnv
  manifest?: AceManifest
  packageJson?: Record<string, any>

  constructor(path: string) {
    this.path = path

    this.#tryParse('.env', () => (this.env = this.#parseEnvFile()))
    this.#tryParse('package.json', () => (this.packageJson = this.#parsePackageJsonFile()))
    this.#tryParse('ace-manifest.json', () => (this.manifest = this.#parseManifestFile()))

    this.name = this.packageJson?.name ?? basename(this.path)
  }

  /**
   * Try to parse the given file. If it fails, output the error to the console
   */
  #tryParse(_filename: string, cb: () => void) {
    try {
      cb()
    } catch (err: any) {
      // console.error(`Failed to parse ${filename} file`, err)
    }
  }

  /**
   * Parse the package.json file as Record<string, any>
   */
  #parsePackageJsonFile() {
    const packageJsonPath = join(this.path, 'package.json')
    const packageJson = readFileSync(packageJsonPath, 'utf8')

    return JSON.parse(packageJson) as Record<string, any>
  }

  /**
   * Parse the .env file as Record<string, string>
   */
  #parseEnvFile() {
    const envPath = join(this.path, '.env')
    const lines = readFileSync(envPath, 'utf8').split('\n').filter(Boolean)

    const env: Record<string, any> = {}
    for (const line of lines) {
      const [key, value] = line.split('=')

      if (!key) continue

      env[key] = value?.trim()
    }

    return env as AdonisEnv
  }

  /**
   * Parse the ace-manifest.json file
   */
  #parseManifestFile() {
    const manifestPath = join(this.path, 'ace-manifest.json')
    const manifest = readFileSync(manifestPath, 'utf8')
    return JSON.parse(manifest) as AceManifest
  }

  /**
   * Get the custom commands for the project
   */
  getCustomAceCommands() {
    if (!this.manifest) return []

    return Object.entries(this.manifest.commands)
      .filter(([, command]) => command.commandPath.startsWith('./commands'))
      .map(([name, command]) => ({ name, command }))
  }

  /**
   * Get the Adonis version from the package.json file
   */
  get adonisVersion() {
    return this.packageJson?.dependencies?.['@adonisjs/core']
  }

  /**
   * Returns a boolean indicating if the project is using the given Adonis version
   */
  isAdonisX(version: number) {
    return (
      this.adonisVersion?.startsWith(version) ||
      this.adonisVersion?.startsWith(`^${version}`) ||
      this.adonisVersion?.startsWith(`~${version}`)
    )
  }

  /**
   * Check if the project is using Adonis 5
   */
  isAdonis5() {
    return this.isAdonisX(5)
  }

  /**
   * Check if the project is using Adonis 6
   */
  isAdonis6() {
    return this.isAdonisX(6)
  }
}
