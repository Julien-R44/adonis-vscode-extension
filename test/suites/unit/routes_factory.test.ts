import { test } from '@japa/runner'
import { RouteFactory } from '../../../src/tree_views/routes/routes_factory'
import type { AceListRoutesResult } from '../../../src/contracts'

const rawRoutes: AceListRoutesResult = {
  root: [
    {
      domain: 'root',
      name: 'drive.local.serve',
      pattern: '/uploads/*',
      methods: ['GET', 'HEAD'],
      handler: 'Closure',
      middleware: [],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/login',
      methods: ['GET', 'HEAD'],
      handler: 'LoginController.create',
      middleware: ['guest'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/login',
      methods: ['POST'],
      handler: 'LoginController.store',
      middleware: ['guest'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/logout',
      methods: ['POST'],
      handler: 'LoginController.destroy',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/',
      methods: ['GET', 'HEAD'],
      handler: 'PollsController.index',
      middleware: [],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/me',
      methods: ['GET', 'HEAD'],
      handler: 'ProfileController.index',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/me/avatar',
      methods: ['POST'],
      handler: 'ProfileController.updateAvatar',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/polls/create',
      methods: ['GET', 'HEAD'],
      handler: 'PollsController.create',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/polls',
      methods: ['POST'],
      handler: 'PollsController.store',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/polls/:slug',
      methods: ['GET', 'HEAD'],
      handler: 'PollsController.show',
      middleware: [],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/polls/:id/vote',
      methods: ['POST'],
      handler: 'PollsController.submitVote',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/polls/:id',
      methods: ['DELETE'],
      handler: 'PollsController.destroy',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/api/v1/xapolls/:id/vote',
      methods: ['POST'],
      handler: 'PollsController.submitVote',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/api/v1/xapolls/:id',
      methods: ['DELETE'],
      handler: 'PollsController.destroy',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/v1/hey/:id',
      methods: ['DELETE'],
      handler: 'PollsController.destroy',
      middleware: ['auth'],
    },
    {
      domain: 'root',
      name: '',
      pattern: '/v1/test/:id',
      methods: ['DELETE'],
      handler: 'PollsController.destroy',
      middleware: ['auth'],
    },
  ],
}

test.group('RoutesFactory', () => {
  test('Should ignore excluded routes', async ({ assert }) => {
    const result = await RouteFactory.buildRoutesDomainTree(rawRoutes)

    assert.notDeepInclude(
      result.map((x) => x.label),
      'upload'
    )
  })

  test('Should return RouteGroupNode if only one domain', async ({ assert }) => {
    const res = await RouteFactory.buildRoutesDomainTree(rawRoutes)

    assert.notInclude(
      res.map((x) => x.label),
      'root'
    )
  })

  test('Should return RouteDomainNode if multiples domain', async ({ assert }) => {
    const res = await RouteFactory.buildRoutesDomainTree({
      ...rawRoutes,
      ...{
        domain2: [
          {
            domain: 'domain2',
            name: '',
            pattern: '/domain2',
            methods: ['GET', 'HEAD'],
            handler: 'TestController.index',
            middleware: [],
          },
        ],
      },
    })

    assert.deepEqual(
      res.map((x) => x.label),
      ['root', 'domain2']
    )
  })

  test('Should successfully group routes by their url', async ({ assert }) => {
    const result = await RouteFactory.buildRoutesDomainTree(rawRoutes)

    assert.deepEqual(
      result.map(({ label, description }) => ({ label, description })),
      [
        { label: 'login', description: '2 routes' },
        { label: 'logout', description: '1 routes' },
        { label: '/', description: '1 routes' },
        { label: 'me', description: '2 routes' },
        { label: 'polls', description: '5 routes' },
        { label: 'xapolls', description: '2 routes' },
        { label: 'hey', description: '1 routes' },
        { label: 'test', description: '1 routes' },
      ]
    )
  })
})
