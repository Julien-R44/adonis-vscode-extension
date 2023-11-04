import { join } from 'path'
import { test } from '@japa/runner'
import { Adonis6Project } from '../../../src/adonis_project/adonis6_project'
import { Adonis5Project } from '../../../src/adonis_project/adonis5_project'

test.group('Adonis Project', () => {
  test('should set name from package.json', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create('my-project/package.json', JSON.stringify({ name: '@acme/my-adonis-backend' }))

    const project = new Adonis6Project(projectUrl)
    assert.equal(project.name, '@acme/my-adonis-backend')
  })

  test('should parse env file', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create('my-project/.env', 'PORT=3333\nHOST=localhost')

    const project = new Adonis6Project(projectUrl)
    assert.deepEqual(project.env, { PORT: '3333', HOST: 'localhost' })
  })

  test('should parse manifest file', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create('my-project/ace-manifest.json', JSON.stringify({ foo: ['foo'] }))

    const project = new Adonis6Project(projectUrl)
    assert.deepEqual(project.manifest, { foo: ['foo'] })
  })

  test('should parse package.json', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create('my-project/package.json', JSON.stringify({ name: '@acme/my-adonis-backend' }))

    const project = new Adonis6Project(projectUrl)
    assert.deepEqual(project.packageJson?.name, '@acme/my-adonis-backend')
  })

  test('check adonis version', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create(
      'my-project/package.json',
      JSON.stringify({ dependencies: { '@adonisjs/core': '5.0.0' } })
    )
    const project = new Adonis6Project(projectUrl)

    assert.isTrue(project.isAdonis5())
    assert.isFalse(project.isAdonis6())
  })

  test('should parse json rc file', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create(
      'my-project/.adonisrc.json',
      JSON.stringify({
        directories: { controllers: 'app/Controllers' },
        providers: ['@adonisjs/core', '@adonisjs/session'],
      })
    )

    const project = new Adonis5Project(projectUrl)

    assert.deepEqual(project.rcFile.directories(), { controllers: 'app/Controllers' })
    assert.deepEqual(project.rcFile.providers(), ['@adonisjs/core', '@adonisjs/session'])
  })

  test('should parse ts rc file', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create(
      'my-project/adonisrc.ts',
      `
      export default defineConfig({
        directories: {
          'factories': 'App/Factories',
          'views': 'resources/views',
        },

        providers: [
          () => import('@adonisjs/core/providers/app_provider'),
          () => import('@adonisjs/core/providers/http_provider'),
          () => import('@adonisjs/core/providers/hash_provider'),
          {
            file: () => import('@adonisjs/core/providers/repl_provider'),
            environment: ['repl', 'test'],
          },
          () => import('./providers/app_provider.js'),
        ],
      })
      `
    )

    const project = new Adonis6Project(projectUrl)

    assert.deepEqual(project.rcFile.directories(), {
      factories: 'App/Factories',
      views: 'resources/views',
    })

    assert.deepEqual(project.rcFile.providers(), [
      '@adonisjs/core/providers/app_provider',
      '@adonisjs/core/providers/http_provider',
      '@adonisjs/core/providers/hash_provider',
      '@adonisjs/core/providers/repl_provider',
      './providers/app_provider.js',
    ])
  })

  test('should parse directories even if not quoted', async ({ fs, assert }) => {
    const projectUrl = join(fs.basePath, 'my-project')

    await fs.create(
      'my-project/adonisrc.ts',
      `
      export default defineConfig({
        directories: {
          'factories': 'App/Factories',
          views: 'resources/views',
        },
      })
      `
    )

    const project = new Adonis6Project(projectUrl)

    assert.deepEqual(project.rcFile.directories(), {
      factories: 'App/Factories',
      views: 'resources/views',
    })
  })
})
