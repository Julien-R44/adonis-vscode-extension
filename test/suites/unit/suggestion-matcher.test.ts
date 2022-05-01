import { test } from '@japa/runner'
import Extension from '../../../src/Extension'
import { SuggestionMatcher } from '../../../src/services/SuggestionMatcher'

test.group('Suggestion Matcher: Controllers Name', (group) => {
  test('Empty text should return all controllers', ({ assert }) => {
    const project = Extension.getAdonisProjects()[0]
    const suggestions = SuggestionMatcher.getSuggestions(
      '',
      project,
      ['app/controllers'],
      ['controller.ts', 'Controller.ts']
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
      const project = Extension.getAdonisProjects()[0]

      const suggestions = SuggestionMatcher.getSuggestions(
        needle,
        project,
        ['app/controllers'],
        ['controller.ts', 'Controller.ts']
      )

      const correctSuggestion = suggestions.find((suggestion) => suggestion.text.endsWith(result))
      assert.deepInclude(correctSuggestion!.text, result)
    })
})
