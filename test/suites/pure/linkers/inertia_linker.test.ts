import dedent from 'dedent'
import { join } from 'node:path'
import { test } from '@japa/runner'

import { slash } from '../../../../src/utilities/index'
import { createAdonis5Project } from '../../../../test_helpers'
import { InertiaLinker } from '../../../../src/linkers/inertia_linker'

test.group('Inertia Linker', () => {
  test('should works', async ({ fs, assert }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/js/pages/Users/Index.vue', '')
    await fs.create('my-project/resources/js/pages/Users/Show.svelte', '')
    await fs.create('my-project/resources/js/pages/Users/Create.tsx', '')
    await fs.create('my-project/resources/js/pages/Users/Update.jsx', '')
    await fs.create('my-project/resources/js/pages/test.vue', '')

    const code = dedent`
      inertia.render('Users/Index')
      inertia.render('Users/Show')
      inertia.render('Users/Create')
      inertia.render('Users/Update')
      router.get('/test', (ctx) => {
        return ctx.inertia.render('test', { data: 'test' })
      })
    `

    const result = await InertiaLinker.getLinks({
      fileContent: code,
      pagesDirectory: 'resources/js/pages',
      project,
    })

    const positions = result.map((r) => r.position)
    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 27,
          "colStart": 16,
          "line": 0,
        },
        {
          "colEnd": 26,
          "colStart": 16,
          "line": 1,
        },
        {
          "colEnd": 28,
          "colStart": 16,
          "line": 2,
        },
        {
          "colEnd": 28,
          "colStart": 16,
          "line": 3,
        },
        {
          "colEnd": 33,
          "colStart": 29,
          "line": 5,
        },
      ]
      `)

    const paths = result.map((r) => r.templatePath)
    assert.sameDeepMembers(paths, [
      slash(join(project.path, 'resources/js/pages/Users/Index.vue')),
      slash(join(project.path, 'resources/js/pages/Users/Show.svelte')),
      slash(join(project.path, 'resources/js/pages/Users/Create.tsx')),
      slash(join(project.path, 'resources/js/pages/Users/Update.jsx')),
      slash(join(project.path, 'resources/js/pages/test.vue')),
    ])
  })
})
