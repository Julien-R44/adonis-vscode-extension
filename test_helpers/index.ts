import { join } from 'path'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { pascalCase } from 'change-case'
import { AdonisProject } from '../src/adonis_project'
import type { FileSystem } from '@japa/file-system/build/src/file_system'

export const BASE_URL = join(__dirname, '..', 'test', 'suites', 'pure', '__app_fs')

export async function createControllerFile(
  fs: FileSystem,
  project: AdonisProject,
  fullName: string,
  methods: string[] = []
) {
  const name = fullName.split('/').pop()
  const path = project.isAdonis5() ? 'app/Controllers/Http' : 'app/controllers'

  await fs.create(
    `my-project/${path}/${fullName}.ts`,
    `export default class ${pascalCase(name!)} {
      ${methods.map((method) => `${method}() {}`).join('\n')}
    }`
  )
}

export function createAdonis6Project(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }

  writeFileSync(
    join(path, 'package.json'),
    JSON.stringify({
      name: 'my-project',
      dependencies: {
        '@adonisjs/core': '^6.0.0',
      },
      imports: {
        '#controllers/*': './app/controllers/*.js',
      },
    })
  )

  return new AdonisProject(path)
}

export function createAdonis5Project(path: string) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true })
  }

  writeFileSync(
    join(path, 'package.json'),
    JSON.stringify({
      name: 'my-project',
      dependencies: {
        '@adonisjs/core': '^5.0.0',
      },
    })
  )

  return new AdonisProject(path)
}