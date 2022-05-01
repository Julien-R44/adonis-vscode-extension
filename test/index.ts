import * as path from 'path'
import { assert } from '@japa/assert'
import { specReporter } from '@japa/spec-reporter'
import { configure, run as runJapa } from '@japa/runner'
import Extension from '../src/Extension'

export async function run(): Promise<void> {
  const testsRoot = path.resolve(__dirname, '..')

  return new Promise((resolve, reject) => {
    configure({
      files: [`**/*.test.js`],
      cwd: testsRoot,
      forceExit: false,
      plugins: [assert()],
      reporters: [specReporter()],
      setup: [
        async () => {
          await Extension.loadAdonisProjects()
        },
      ],
      teardown: [
        (runner) => {
          runner.end()
          resolve()
        },
      ],
      importer: (filePath) => import(filePath),
    })

    runJapa()
  })
}
