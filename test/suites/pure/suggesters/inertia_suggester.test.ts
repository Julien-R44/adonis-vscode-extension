import { join } from 'node:path'
import { test } from '@japa/runner'

import { InertiaSuggester } from '#/suggesters/inertia_suggester'
import { Adonis6Project } from '#/adonis_project/adonis6_project'

test.group('View Suggester', () => {
  test('basic', async ({ fs, assert }) => {
    const project = new Adonis6Project(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/js/pages/Users/Index.vue', '')
    await fs.create('my-project/resources/js/pages/Users/Show.svelte', '')
    await fs.create('my-project/resources/js/pages/Users/Create.tsx', '')
    await fs.create('my-project/resources/js/pages/Users/Update.jsx', '')

    const suggestions = await InertiaSuggester.getInertiaSuggestions({
      text: 'user',
      project,
      pagesDirectory: 'resources/js/pages',
    })

    assert.deepEqual(suggestions, [
      {
        text: 'Users/Create',
        detail: 'resources/js/pages/Users/Create.tsx',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/js/pages/Users/Create.tsx'),
      },
      {
        text: 'Users/Index',
        detail: 'resources/js/pages/Users/Index.vue',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/js/pages/Users/Index.vue'),
      },
      {
        text: 'Users/Show',
        detail: 'resources/js/pages/Users/Show.svelte',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/js/pages/Users/Show.svelte'),
      },
      {
        text: 'Users/Update',
        detail: 'resources/js/pages/Users/Update.jsx',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/js/pages/Users/Update.jsx'),
      },
    ])
  })
})
