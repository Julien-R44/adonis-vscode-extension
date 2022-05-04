import { test } from '@japa/runner'
import { MarkdownString } from 'vscode'
import Extension from '../../../src/Extension'
import { SuggestionProvider, SuggestionType } from '../../../src/services/SuggestionProvider'

const project = Extension.getAdonisProjects()[0]

test.group('Suggestion Matcher: Controllers Name', () => {
  test('Empty text should return all controllers', ({ assert }) => {
    const suggestions = SuggestionProvider.getSuggestions(
      '',
      project,
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
    .run(({ assert }, { needle, result }) => {
      const suggestions = SuggestionProvider.getSuggestions(
        needle,
        project,
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
    .run(({ assert }, { controller, doc }) => {
      const suggestions = SuggestionProvider.getSuggestions(
        controller,
        project,
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

test.group('Suggestion Matcher: Views', () => {
  test('Empty text should return all views', ({ assert }) => {
    const suggestions = SuggestionProvider.getSuggestions(
      '',
      project,
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
    .run(({ assert }, { needle, path, result }) => {
      const suggestions = SuggestionProvider.getSuggestions(
        needle,
        project,
        ['resources/views'],
        ['.edge'],
        SuggestionType.View
      )

      const correctSuggestion = suggestions.find((suggestion) => suggestion.filePath.endsWith(path))

      assert.deepInclude(correctSuggestion!.text, result)
    })
})
