import { join } from 'path'
import { test } from '@japa/runner'
import { ViewSuggester } from '../../../../src/suggesters/view_suggester'
import { AdonisProject } from '../../../../src/adonis_project'

test.group('View Suggester', () => {
  test('basic', async ({ fs, assert }) => {
    const project = new AdonisProject(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/views/button.edge', '')

    const suggestions = await ViewSuggester.getViewSuggestions({
      text: 'butt',
      project,
    })

    assert.deepEqual(suggestions, [
      {
        text: 'button',
        detail: 'resources/views/button.edge',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/views/button.edge'),
      },
    ])
  })

  test('nested', async ({ fs, assert }) => {
    const project = new AdonisProject(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/views/admin/button.edge', '')

    const suggestions = await ViewSuggester.getViewSuggestions({
      text: 'butt',
      project,
    })

    assert.deepEqual(suggestions, [
      {
        text: 'admin/button',
        detail: 'resources/views/admin/button.edge',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/views/admin/button.edge'),
      },
    ])
  })

  test('multiple results', async ({ fs, assert }) => {
    const project = new AdonisProject(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/views/button.edge', '')
    await fs.create('my-project/resources/views/admin/button.edge', '')

    const suggestions = await ViewSuggester.getViewSuggestions({
      text: 'butt',
      project,
    })

    assert.sameDeepMembers(suggestions, [
      {
        text: 'admin/button',
        detail: 'resources/views/admin/button.edge',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/views/admin/button.edge'),
      },
      {
        text: 'button',
        detail: 'resources/views/button.edge',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/views/button.edge'),
      },
    ])
  })

  test('should sanitize input text', async ({ fs, assert }) => {
    const project = new AdonisProject(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/views/button.edge', '')

    const suggestions = await ViewSuggester.getViewSuggestions({
      text: "'butt'",
      project,
    })

    assert.deepEqual(suggestions, [
      {
        text: 'button',
        detail: 'resources/views/button.edge',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/views/button.edge'),
      },
    ])
  })

  test('should works if using slash as separator', async ({ fs, assert }) => {
    const project = new AdonisProject(join(fs.basePath, 'my-project'))

    await fs.create('my-project/resources/views/components/button.edge', '')

    const suggestions = await ViewSuggester.getViewSuggestions({
      text: 'components/bu',
      project,
    })

    assert.deepEqual(suggestions, [
      {
        text: 'components/button',
        detail: 'resources/views/components/button.edge',
        documentation: '',
        filePath: join(fs.basePath, 'my-project/resources/views/components/button.edge'),
      },
    ])
  })
})
