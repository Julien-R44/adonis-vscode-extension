import { join } from 'node:path'
import { test } from '@japa/runner'
import dedent from 'dedent'
import { ViewsLinker } from '../../../../src/linkers/views_linker'
import { createAdonis5Project, createAdonis6Project } from '../../../../test_helpers'
import { Adonis6Project } from '../../../../src/adonis_project/adonis6_project'

test.group('Pure Edge Template Matcher', () => {
  test('edge source type', async ({ assert, fs }) => {
    const project = new Adonis6Project(join(fs.basePath, 'my-project'))

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
    const project = new Adonis6Project(join(fs.basePath, 'my-project'))

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

  test('should return empty link when no view found TS', async ({ assert, fs }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const template = dedent`
      return view.render('components/button', {
        props: 42
      })
    `

    const result = await ViewsLinker.getLinks({
      fileContent: template,
      project,
      sourceType: 'ts',
    })

    assert.deepEqual(result[0]?.templatePath, null)
    assert.deepEqual(result[0]?.position, {
      line: 0,
      colStart: 20,
      colEnd: 37,
    })
  })

  test('should return empty link when no view found edge', async ({ assert, fs }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const template = dedent`
      @!component('components/button', {})
    `

    const result = await ViewsLinker.getLinks({
      fileContent: template,
      project,
      sourceType: 'edge',
    })

    assert.deepEqual(result[0]?.templatePath, null)
    assert.deepEqual(result[0]?.position, {
      line: 0,
      colStart: 13,
      colEnd: 30,
    })
  })

  test('should return empty links when no component as tags found', async ({ assert, fs }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const template = dedent`
      @!button({
        type: 'primary',
        text: 'Login'
      })
    `

    const result = await ViewsLinker.getLinks({
      fileContent: template,
      project,
      sourceType: 'edge',
    })

    assert.deepEqual(result[0]?.templatePath, null)
    assert.deepEqual(result[0]?.position, {
      line: 0,
      colStart: 2,
      colEnd: 8,
    })
  })

  test('should not detect internal tags as components', async ({ assert, fs }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const template = dedent`
      @if(true)
      @inject('foo')

      @elseif
      @endif
      @!section
      @vite
      @entryPointScripts
      @entryPointStyles

      @unless(true)
        <p>hey</>
      @end
    `

    const result = await ViewsLinker.getLinks({
      fileContent: template,
      project,
      sourceType: 'edge',
    })

    assert.deepEqual(result, [])
  })

  test('should not mark emails as components', async ({ assert, fs }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))
    const template = `
      router.get('/send-email', async ({ response, session }) => {
          message.from('jul@adonisjs.com')
            .text('Hello world')
            .to('foo@bar.com').subject('My subject')
      })
    `

    const result = await ViewsLinker.getLinks({
      fileContent: template,
      project,
      sourceType: 'ts',
    })

    assert.deepEqual(result, [])
  })

  test('should not mark slot or section as missing views', async ({ assert, fs }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const template = `
      <div>
        @!section('body')

        @slot('logo')
        @end
      </div>
    `

    const result = await ViewsLinker.getLinks({
      fileContent: template,
      project,
      sourceType: 'edge',
    })

    assert.deepEqual(result, [])
  })

  test('edge source type with custom view directory', async ({ assert, fs }) => {
    await fs.create(
      'my-project/.adonisrc.json',
      JSON.stringify({ directories: { views: 'templates' } })
    )

    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create('my-project/templates/components/button.edge', '')
    await fs.create('my-project/templates/layouts/base.edge', '')

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
      join(project.path, 'templates/components/button.edge'),
      join(project.path, 'templates/layouts/base.edge'),
    ])
  })
})
