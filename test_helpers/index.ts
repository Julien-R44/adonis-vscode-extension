import { join } from 'node:path'
import { pascalCase } from 'change-case'
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import type { FileSystem } from '@japa/file-system/build/src/file_system'

import type { AdonisProject } from '../src/types/projects'
import { Adonis6Project } from '../src/adonis_project/adonis6_project'
import { Adonis5Project } from '../src/adonis_project/adonis5_project'

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

  return new Adonis6Project(path)
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

  return new Adonis5Project(path)
}
