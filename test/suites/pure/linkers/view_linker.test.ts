import { join } from 'node:path'
import { test } from '@japa/runner'
import dedent from 'dedent'
import { AdonisProject } from '../../../../src/adonis_project'
import { ViewsLinker } from '../../../../src/linkers/views_linker'

test.group('Pure Edge Template Matcher', () => {
  test('edge source type', async ({ assert, fs }) => {
    const project = new AdonisProject(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/views/components/button.edge', '')
    await fs.create('my-project/resources/views/layouts/base.edge', '')

    const template = dedent`
      @!component('components/button', {
        text: 'Login',
        type: 'submit'
      })

      @layout('layouts/base')
      @end
    `

    const result = await ViewsLinker.getLinks({
      fileContent: template,
      project,
      sourceType: 'edge',
    })

    const positions = result.map((r) => r.position)
    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 30,
          "colStart": 13,
          "line": 0,
        },
        {
          "colEnd": 21,
          "colStart": 9,
          "line": 5,
        },
      ]
    `)

    const paths = result.map((r) => r.templatePath)

    assert.sameDeepMembers(paths, [
      join(project.path, 'resources/views/components/button.edge'),
      join(project.path, 'resources/views/layouts/base.edge'),
    ])
  })

  test('ts source type', async ({ assert, fs }) => {
    const project = new AdonisProject(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/views/components/button.edge', '')
    await fs.create('my-project/resources/views/pages/admin.edge', '')

    const template = dedent`
      return view.render('components/button', {
        props: 42
      })


      return view.renderSync('pages/admin', {})
    `

    const result = await ViewsLinker.getLinks({
      fileContent: template,
      project,
      sourceType: 'ts',
    })

    const positions = result.map((r) => r.position)

    assert.snapshot(positions).matchInline(`
      [
        {
          "colEnd": 37,
          "colStart": 20,
          "line": 0,
        },
        {
          "colEnd": 35,
          "colStart": 24,
          "line": 5,
        },
      ]
    `)

    const paths = result.map((r) => r.templatePath)

    assert.sameDeepMembers(paths, [
      join(project.path, 'resources/views/components/button.edge'),
      join(project.path, 'resources/views/pages/admin.edge'),
    ])
  })
})
