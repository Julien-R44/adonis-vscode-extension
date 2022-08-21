/* eslint-disable sonarjs/no-duplicate-string */
import { test } from '@japa/runner'
import { SuggestionType } from '../../../src/contracts'
import { SuggestionProvider } from '../../../src/services/suggestion_provider'
import ProjectManager from '../../../src/services/adonis_project/manager'
import type { MarkdownString } from 'vscode'

const project = ProjectManager.getProjects()[0]

test.group('Suggestion Provider: Controllers Name', () => {
  test('Empty text should return all controllers', async ({ assert }) => {
    const suggestions = await SuggestionProvider.getSuggestions(
      '',
      project!,
      ['app/controllers'],
      ['controller.ts', 'Controller.ts'],
      SuggestionType.ControllerName
    )

    assert.deepEqual(suggestions.length, 4)
  })

  test('Should return the correct controller - "{result}"')
    .with([
      { needle: 'User', result: 'UserController' },
      { needle: 'Foo', result: 'FooController' },
      { needle: 'Client', result: 'Features/Client/ClientController' },
      { needle: 'Order', result: 'Features/Order/OrderController' },
    ])
    .run(async ({ assert }, { needle, result }) => {
      const suggestions = await SuggestionProvider.getSuggestions(
        needle,
        project!,
        ['app/controllers'],
        ['controller.ts', 'Controller.ts'],
        SuggestionType.ControllerName
      )

      const correctSuggestion = suggestions.find((suggestion) => suggestion.text.endsWith(result))
      assert.deepInclude(correctSuggestion!.text, result)
    })

  test('Should have documentation with available methods in suggestion - "{controller}"')
    .with([
      { controller: 'UserController', doc: ['destroy', 'update'] },
      { controller: 'FooController', doc: ['methodA'] },
    ])
    .run(async ({ assert }, { controller, doc }) => {
      const suggestions = await SuggestionProvider.getSuggestions(
        controller,
        project!,
        ['app/controllers'],
        ['controller.ts', 'Controller.ts'],
        SuggestionType.ControllerName
      )

      const correctSuggestion = suggestions.find((suggestion) =>
        suggestion.text.endsWith(controller)
      )

      doc.forEach((method) => {
        const markdown = correctSuggestion!.documentation as MarkdownString
        assert.deepInclude(markdown.value, method)
      })
    })
})

test.group('Suggestion Provider: Views', () => {
  test('Empty text should return all views', async ({ assert }) => {
    const suggestions = await SuggestionProvider.getSuggestions(
      '',
      project!,
      ['resources/views'],
      ['.edge'],
      SuggestionType.View
    )

    assert.deepEqual(suggestions.length, 7)
  })

  test('Should return the correct view - "{result}"')
    .with([
      { needle: 'flat', path: 'flat.edge', result: 'flat' },
      { needle: 'partialA', path: 'partials/sub/partialA.edge', result: 'partials/sub/partialA' },
      { needle: 'footer', path: 'partials/footer.edge', result: 'partials/footer' },
      { needle: 'button', path: 'components/button.edge', result: 'components/button' },
    ])
    .run(async ({ assert }, { needle, path, result }) => {
      const suggestions = await SuggestionProvider.getSuggestions(
        needle,
        project!,
        ['resources/views'],
        ['.edge'],
        SuggestionType.View
      )

      const correctSuggestion = suggestions.find((suggestion) => suggestion.filePath.endsWith(path))

      assert.deepInclude(correctSuggestion!.text, result)
    })
})
