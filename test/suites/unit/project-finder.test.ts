import { resolve } from 'path'
import { test } from '@japa/runner'
import { Uri } from 'vscode'
import ProjectManager from '../../../src/services/adonis_project/manager'

test.group('Project Finder', () => {
  test('Find simple project', async ({ assert }) => {
    const ret = ProjectManager.getProjects()
    const projectPath = resolve(__dirname, '../.././../../test/fixtures/basic-app')

    assert.deepEqual(ret[0]?.uri.fsPath, projectPath)
    assert.deepEqual(ret[0]?.name, 'basic-app')
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

    const project = ProjectManager.getProjectFromFile(filePath.path)
    assert.isNotNull(project)
    assert.deepInclude(project, { name: 'basic-app' })
  })
})
