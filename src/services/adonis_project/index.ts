import { readFileSync } from 'fs'
import { basename, join } from 'path'
import { Notifier } from '../notifier'
import type { Uri } from 'vscode'
import type { AceManifest, AdonisEnv } from './contracts'

export class AdonisProject {
  public name: string
  public uri: Uri
  public env?: AdonisEnv
  public manifest?: AceManifest

  constructor(uri: Uri) {
    this.uri = uri
    this.name = basename(this.uri.fsPath)

    this.tryParse('.env', () => (this.env = this.parseEnvFile()))
    this.tryParse('ace-manifest.json', () => (this.manifest = this.parseManifestFile()))
  }

  /**
   * Try to parse the given file. If it fails, output the error to the console
   */
  private tryParse(filename: string, cb: () => void) {
    try {
      cb()
    } catch (err) {
      Notifier.logError(`Failed to parse ${filename} file for project ${this.name}`, err)
    }
  }

  /**
   * Parse the .env file as Record<string, string>
   */
  private parseEnvFile() {
    const envPath = join(this.uri.fsPath, '.env')
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
  private parseManifestFile() {
    const manifestPath = join(this.uri.fsPath, 'ace-manifest.json')
    const manifest = readFileSync(manifestPath, 'utf8')
    return JSON.parse(manifest) as AceManifest
  }
}