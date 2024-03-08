import { join } from 'node:path'
import { test } from '@japa/runner'

import { createAdonis5Project, createAdonis6Project } from '../../../../test_helpers'
import { ControllerSuggester } from '../../../../src/suggesters/controller_suggester'

test.group('Controller suggester', () => {
  test('adonis 6 | basic', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/users_controller.ts',
      `
      export default class UsersController {
        async index() {}
        async show() {}
      }
    `
    )

    const suggestions = await ControllerSuggester.geControllerSuggestions({
      project,
      text: 'users',
    })

    assert.deepEqual(suggestions, [
      {
        text: '#controllers/users_controller',
        detail: 'app/controllers/users_controller.ts',
        documentation: '**Methods**\n* index\n* show',
        filePath: join(fs.basePath, 'my-project/app/controllers/users_controller.ts'),
      },
    ])
  })

  test('adonis 6 | should occult #controllers prefix fron search text if adonis 6', async ({
    fs,
    assert,
  }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/users_controller.ts',
      `
      export default class UsersController {
        async index() {}
        async show() {}
      }
    `
    )

    const suggestions = await ControllerSuggester.geControllerSuggestions({
      project,
      text: '#controllers/users',
    })

    assert.deepEqual(suggestions, [
      {
        text: '#controllers/users_controller',
        detail: 'app/controllers/users_controller.ts',
        documentation: '**Methods**\n* index\n* show',
        filePath: join(fs.basePath, 'my-project/app/controllers/users_controller.ts'),
      },
    ])
  })

  test('adonis 6 | should returns all controllers if empty', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/users_controller.ts',
      `export default class UsersController {}`
    )

    await fs.create(
      'my-project/app/controllers/posts_controller.ts',
      `export default class PostsController {}`
    )

    const suggestions = await ControllerSuggester.geControllerSuggestions({
      project,
      text: '',
    })

    assert.deepEqual(suggestions.length, 2)
  })

  test('adonis 6 | should returns all controllers if only #controllers with adonis6', async ({
    fs,
    assert,
  }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/users_controller.ts',
      `export default class UsersController {}`
    )

    await fs.create(
      'my-project/app/controllers/posts_controller.ts',
      `export default class PostsController {}`
    )

    const suggestions = await ControllerSuggester.geControllerSuggestions({
      project,
      text: '#controllers',
    })

    assert.deepEqual(suggestions.length, 2)
  })

  test('adonis 5 | basic', async ({ fs, assert }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create('my-project/app/Controllers/Http/UsersController.ts', '')

    const suggestions = await ControllerSuggester.geControllerSuggestions({
      project,
      text: 'users',
    })

    assert.deepEqual(suggestions, [
      {
        text: 'UsersController',
        detail: 'app/Controllers/Http/UsersController.ts',
        documentation: '**Methods**\n',
        filePath: join(fs.basePath, 'my-project/app/Controllers/Http/UsersController.ts'),
      },
    ])
  })

  test('adonis 5 | should returns all if empty', async ({ fs, assert }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create('my-project/app/Controllers/Http/UsersController.ts', '')
    await fs.create('my-project/app/Controllers/Http/PostsController.ts', '')
    await fs.create('my-project/app/Controllers/Http/Nest/CommentsController.ts', '')

    const suggestions = await ControllerSuggester.geControllerSuggestions({
      project,
      text: '',
    })

    assert.deepEqual(suggestions.length, 3)

    const texts = suggestions.map((s) => s.text)

    assert.sameDeepMembers(texts, ['UsersController', 'PostsController', 'Nest/CommentsController'])
  })
})
