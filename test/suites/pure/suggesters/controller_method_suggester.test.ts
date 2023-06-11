import { join } from 'node:path'
import { test } from '@japa/runner'
import { ControllerMethodSuggester } from '../../../../src/suggesters/controller_method_suggester'
import { createAdonis5Project, createAdonis6Project } from '../../../../test_helpers'

test.group('Controller Method Suggester', () => {
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

    const suggestions = await ControllerMethodSuggester.getControllerMethodSuggestions({
      project,
      text: '#controllers/users_controller.in',
    })

    const texts = suggestions.map((s) => s.text)
    assert.sameDeepMembers(texts, ['index'])
  })

  test('adonis 6 | should list all methods if no text is provided', async ({ fs, assert }) => {
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

    const suggestions = await ControllerMethodSuggester.getControllerMethodSuggestions({
      project,
      text: '#controllers/users_controller.',
    })

    const texts = suggestions.map((s) => s.text)
    assert.sameDeepMembers(texts, ['index', 'show'])
  })

  test('adonis 5 | basic', async ({ fs, assert }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/Controllers/Http/UsersController.ts',
      `
      export default class UsersController {
        public async index() {}
        public async show() {}
      }
      `
    )

    const suggestions = await ControllerMethodSuggester.getControllerMethodSuggestions({
      project,
      text: 'UsersController.in',
    })

    const texts = suggestions.map((s) => s.text)
    assert.sameDeepMembers(texts, ['index'])
  })

  test('should sanitize input', async ({ fs, assert }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/Controllers/Http/UsersController.ts',
      `
      export default class UsersController {
        public async index() {}
        public async show() {}
      }
      `
    )

    const suggestions = await ControllerMethodSuggester.getControllerMethodSuggestions({
      project,
      text: "UsersController.in'",
    })

    const texts = suggestions.map((s) => s.text)
    assert.sameDeepMembers(texts, ['index'])
  })

  test('works with namespaced controllers', async ({ fs, assert }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/Controllers/Http/Admin/UsersController.ts',
      `
      export default class UsersController {
        public async index() {}
        public async show() {}
      }
      `
    )

    const suggestions = await ControllerMethodSuggester.getControllerMethodSuggestions({
      project,
      text: 'Admin/UsersController.in',
    })

    const texts = suggestions.map((s) => s.text)
    assert.sameDeepMembers(texts, ['index'])
  })
})
