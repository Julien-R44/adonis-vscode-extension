import { test } from '@japa/runner'
import { Uri } from 'vscode'
import Extension from '../../../Extension'
import { resolve } from 'path'

test.group('Project Finder', (group) => {
  // group.tap((g) => g.pin())

  test('Find simple project', async ({ assert }) => {
    await Extension.loadAdonisProjects()

    const ret = Extension.getAdonisProjects()
    const projectPath = resolve(__dirname, '../../.././../../src/test/fixtures/basic-app')
    assert.deepEqual(ret, [
      {
        name: 'basic-app',
        path: projectPath,
        uri: Uri.file(projectPath),
      },
    ])
  })

  /**
   * TODO: Find a clean way to test multiple Project Finding configuration
   * since VSCode does not support changing workspace while running tests
   */

  test('Get Project from file', ({ assert }) => {
    const filePath = resolve(
      __dirname,
      '../../.././../../src/test/fixtures/basic-app/app/Controllers/Http/FooController.ts'
    )

    const project = Extension.getAdonisProjectFromFile(filePath)
    assert.deepInclude(project, { name: 'basic-app' })
  })
})
