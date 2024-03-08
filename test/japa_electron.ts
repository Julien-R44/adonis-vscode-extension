import * as path from 'node:path'
import { assert } from '@japa/assert'
import { snapshot } from '@japa/snapshot'
import { specReporter } from '@japa/spec-reporter'
import { configure, run as runJapa } from '@japa/runner'

import ProjectManager from '../src/vscode/project_manager'

export async function run() {
  const testsRoot = path.resolve(__dirname, '..')

  return new Promise((resolve) => {
    configure({
      files: [`**/*/e2e/**/routes_factory.test.js`],
      cwd: testsRoot,
      forceExit: false,
      plugins: [assert(), snapshot()],
      reporters: [specReporter()],
      setup: [async () => await ProjectManager.load()],
      teardown: [
        (runner) => {
          runner.end()
          resolve(true)
        },
      ],
      importer: (filePath) => import(filePath),
    })

    runJapa()
  })
}
