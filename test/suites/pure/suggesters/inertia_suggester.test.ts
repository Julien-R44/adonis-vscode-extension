import { join } from 'path'
import { test } from '@japa/runner'
import { AdonisProject } from '../../../../src/adonis_project'
import { InertiaSuggester } from '../../../../src/suggesters/inertia_suggester'

test.group('View Suggester', () => {
  test('basic', async ({ fs, assert }) => {
    const project = new AdonisProject(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/js/pages/Users/Index.vue', '')

    const suggestions = await InertiaSuggester.getInertiaSuggestions({
      text: 'user',
      project,
      pagesDirectory: 'resources/js/pages',
    })

    assert.deepEqual(suggestions, [
      {
        text: 'Users/Index',
        detail: 'resources/js/pages/Users/Index.vue',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/js/pages/Users/Index.vue'),
      },
    ])
  })
})
