import { test } from '@japa/runner'
import { Uri } from 'vscode'
import ProjectFinder from '../../../src/services/ProjectFinder'
import { resolve } from 'path'

test.group('Project Finder', (group) => {
  test('Find simple project', async ({ assert }) => {
    const ret = ProjectFinder.getAdonisProjects()
    const projectPath = resolve(__dirname, '../.././../../test/fixtures/basic-app')
    assert.deepEqual(ret, [
      {
        name: 'basic-app',
        path: Uri.file(projectPath).path,
        uri: Uri.file(projectPath),
      },
    ])
  })

  /**
   * TODO: Find a clean way to test multiple Project Finding configuration
   * since VSCode does not support changing workspace while running tests
   */

  test('Get Project from file', async ({ assert }) => {
    const filePath = Uri.file(
      resolve(
        __dirname,
        '../.././../../test/fixtures/basic-app/app/Controllers/Http/FooController.ts'
      )
    )

    const project = ProjectFinder.getAdonisProjectFromFile(filePath.path)
    assert.isNotNull(project)
    assert.deepInclude(project, { name: 'basic-app' })
  })
})
