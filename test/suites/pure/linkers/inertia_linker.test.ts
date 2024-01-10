import { join } from 'node:path'
import { test } from '@japa/runner'
import dedent from 'dedent'
import slash from 'slash'
import { createAdonis5Project } from '../../../../test_helpers'
import { InertiaLinker } from '../../../../src/linkers/inertia_linker'

test.group('Inertia Linker', () => {
  test('should works', async ({ fs, assert }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/js/pages/Users/Index.vue', '')

    const code = dedent`
      inertia.render('Users/Index')
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
      ]
      `)

    const paths = result.map((r) => r.templatePath)
    assert.sameDeepMembers(paths, [slash(join(project.path, 'resources/js/pages/Users/Index.vue'))])
  })
})
