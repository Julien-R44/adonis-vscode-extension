import { readFileSync } from 'fs'
import { basename, join } from 'path'
import { PkgJson } from './pkg_json'
import { RcFile } from './rc_file'
import type { AdonisEnv } from '../types/projects'
import type { AceManifest } from '../types/projects/v5'

export abstract class BaseAdonisProject {
  name: string
  path: string
  env?: AdonisEnv
  manifest?: AceManifest
  packageJson?: PkgJson
  rcFile!: RcFile

  constructor(path: string) {
    this.path = path
    this.#parseProjectFiles()

    this.name = this.packageJson?.name ?? basename(this.path)
  }

  /**
   * Parse .env, package.json, ace-manifest.json and .adonisrc files
   */
  #parseProjectFiles() {
    this.#tryParse('.env', () => (this.env = this.#parseEnvFile()))

    this.#tryParse('package.json', () => {
      this.packageJson = new PkgJson(join(this.path, 'package.json'))
    })

    this.#tryParse('ace-manifest.json', () => {
      this.manifest = this.#parseManifestFile()
    })

    this.#tryParse('.adonisrc.json', () => {
      this.rcFile = new RcFile(join(this.path, '.adonisrc.json'))
    })
  }

  /**
   * Try to parse the given file. If it fails, output the error to the console
   */
  #tryParse(_filename: string, cb: () => void) {
    try {
      cb()
    } catch (err: any) {
      // console.error(`Failed to parse ${_filename} file`, err)
    }
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
   * Returns the directory where the views are stored
   */
  getViewsDirectory() {
    return this.rcFile?.directories().views ?? 'resources/views'
  }

  /**
   * Reload the project files
   */
  reload() {
    this.#parseProjectFiles()
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
