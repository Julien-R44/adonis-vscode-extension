import { join, relative } from 'node:path'
import fg from 'fast-glob'
import slash from 'slash'
import { camelCase } from 'change-case'
import type { AdonisProject } from './adonis_project'

/**
 * Scan a project for Edge components that can be used
 * by edge-supercharged
 */
export class EdgeComponentsFinder {
  static async find(project: AdonisProject) {
    const components = await fg(`resources/views/components/**/*.edge`, {
      onlyFiles: true,
      caseSensitiveMatch: false,
      cwd: project.path,
    })

    return components.map((file) => {
      const relativePath = slash(relative('resources/views/components', file))

      const name = relativePath
        .replace('.edge', '')
        .split('/')
        .map((part) => camelCase(part))
        .join('.')

      return {
        name,
        path: slash(join(project.path, file)),
        relativePath,
      }
    })
  }
}
