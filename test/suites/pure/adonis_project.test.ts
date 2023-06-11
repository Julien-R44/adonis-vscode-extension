import { join } from 'path'
import { test } from '@japa/runner'
import { AdonisProject } from '../../../src/adonis_project'

test.group('Adonis Project', () => {
  test('should set name from package.json', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create('my-project/package.json', JSON.stringify({ name: '@acme/my-adonis-backend' }))

    const project = new AdonisProject(projectUrl)
    assert.equal(project.name, '@acme/my-adonis-backend')
  })

  test('should parse env file', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create('my-project/.env', 'PORT=3333\nHOST=localhost')

    const project = new AdonisProject(projectUrl)
    assert.deepEqual(project.env, { PORT: '3333', HOST: 'localhost' })
  })

  test('should parse manifest file', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create('my-project/ace-manifest.json', JSON.stringify({ foo: ['foo'] }))

    const project = new AdonisProject(projectUrl)
    assert.deepEqual(project.manifest, { foo: ['foo'] })
  })

  test('should parse package.json', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create('my-project/package.json', JSON.stringify({ name: '@acme/my-adonis-backend' }))

    const project = new AdonisProject(projectUrl)
    assert.deepEqual(project.packageJson, { name: '@acme/my-adonis-backend' })
  })

  test('check adonis version', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create(
      'my-project/package.json',
      JSON.stringify({ dependencies: { '@adonisjs/core': '5.0.0' } })
    )
    const project = new AdonisProject(projectUrl)

    assert.isTrue(project.isAdonis5())
    assert.isFalse(project.isAdonis6())
  })
})
