import dedent from 'dedent'
import { join } from 'node:path'
import { test } from '@japa/runner'

import { ControllersLinker } from '#/linkers/controllers_linker'
import {
  createAdonis5Project,
  createAdonis6Project,
  createControllerFile,
} from '../../../../test_helpers'

test.group('Controller Linker', () => {
  test('should works', async ({ fs, assert }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))
    await createControllerFile(fs, project, 'UsersController')

    const code = dedent`
      Route.get('/users', 'UsersController.index')
    `

    const result = await ControllersLinker.getLinks({
      fileContent: code,
      project,
    })

    const positions = result.map((r) => r.position)
    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 42,
          "colStart": 21,
          "line": 0,
        },
      ]
    `)

    const paths = result.map((r) => r.controllerPath)

    assert.sameDeepMembers(paths, [join(project.path, 'app/Controllers/Http/UsersController.ts')])
  })

  test('works with subpath import', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/users_controller.ts',
      dedent`
        export default class UsersController {}
      `
    )

    const code = dedent`
      router.get('/users', '#controllers/users_controller.index')
    `

    const result = await ControllersLinker.getLinks({
      fileContent: code,
      project,
    })

    const positions = result.map((r) => r.position)
    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 57,
          "colStart": 22,
          "line": 0,
        },
      ]
    `)

    const paths = result.map((r) => r.controllerPath)
    assert.sameDeepMembers(paths, [join(project.path, 'app/controllers/users_controller.ts')])
  })

  test('works with namespaces', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/admin/users_controller.ts',
      dedent`
        export default class AdminUsersController {}
      `
    )

    const code = dedent`
      router.get('/users', '#controllers/admin/users_controller.index')
    `

    const result = await ControllersLinker.getLinks({
      fileContent: code,
      project,
    })

    const positions = result.map((r) => r.position)
    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 63,
          "colStart": 22,
          "line": 0,
        },
      ]
    `)

    const paths = result.map((r) => r.controllerPath)
    assert.sameDeepMembers(paths, [join(project.path, 'app/controllers/admin/users_controller.ts')])
  })

  test('multiples links', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/admin/users_controller.ts',
      dedent`
        export default class AdminUsersController {}
      `
    )

    await fs.create(
      'my-project/app/controllers/foo/posts_controller.ts',
      dedent`
        export default class FooPostsController {}
      `
    )

    const code = dedent`
      router.get('/users', '#controllers/admin/users_controller.index')
      router.get('/posts', '#controllers/foo/posts_controller.index')
    `

    const result = await ControllersLinker.getLinks({
      fileContent: code,
      project,
    })

    const positions = result.map((r) => r.position)
    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 63,
          "colStart": 22,
          "line": 0,
        },
        {
          "colEnd": 61,
          "colStart": 22,
          "line": 1,
        },
      ]
    `)

    const paths = result.map((r) => r.controllerPath)
    assert.sameDeepMembers(paths, [
      join(project.path, 'app/controllers/admin/users_controller.ts'),
      join(project.path, 'app/controllers/foo/posts_controller.ts'),
    ])
  })

  test('should returns empty links when no controller found', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const code = dedent`
      router.get('/users', '#controllers/admin/users_controller.index')
    `

    const result = await ControllersLinker.getLinks({
      fileContent: code,
      project,
    })

    assert.deepEqual(result[0]!.controllerPath, null)
    assert.deepEqual(result[0]!.position, {
      colEnd: 63,
      colStart: 22,
      line: 0,
    })
  })
})
