import { join } from 'node:path'
import { test } from '@japa/runner'
import dedent from 'dedent'
import { AdonisProject } from '../../../../src/adonis_project'
import { ViewsLinker } from '../../../../src/linkers/views_linker'
import { createAdonis5Project } from '../../../../test_helpers'

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

  test('components as tags', async ({ assert, fs }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/views/components/button.edge', '')
    await fs.create('my-project/resources/views/components/checkout_form/input.edge', '')

    const template = dedent`
    @!button({
      type: 'primary',
      text: 'Login'
    })

    @!checkoutForm.input({
      type: 'email',
      name: 'email',
    })
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
          "colEnd": 8,
          "colStart": 2,
          "line": 0,
        },
        {
          "colEnd": 20,
          "colStart": 2,
          "line": 5,
        },
      ]
    `)
  })

  test('component as tags without !', async ({ assert, fs }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/views/components/button.edge', '')
    await fs.create('my-project/resources/views/components/checkout_form/input.edge', '')

    const template = dedent`
    @button({
      type: 'primary',
      text: 'Login'
    })

    @checkoutForm.input({
      type: 'email',
      name: 'email',
    })
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
          "colEnd": 7,
          "colStart": 1,
          "line": 0,
        },
        {
          "colEnd": 19,
          "colStart": 1,
          "line": 5,
        },
      ]
    `)
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
