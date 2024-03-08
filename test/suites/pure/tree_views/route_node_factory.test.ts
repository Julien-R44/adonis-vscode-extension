import { join } from 'node:path'
import { test } from '@japa/runner'

import { slash } from '../../../../src/utilities/index'
import type { RawRouteV6 } from '../../../../src/types'
import { createAdonis5Project, createAdonis6Project } from '../../../../test_helpers'
import { RouteNodeFactory } from '../../../../src/routes_tree/nodes/route_node_factory'

test.group('Route node factory', () => {
  test('v6 magic | builds RouteNode', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/v2/users_controller.ts',
      `export default class UsersController {
        get() {}
      }`
    )

    const rawRoute: RawRouteV6 = {
      name: 'MyRoute',
      handler: {
        method: 'get',
        moduleNameOrPath: '#controllers/v2/users_controller',
        type: 'controller',
      },
      methods: ['GET'],
      middleware: [],
      pattern: '/v2/users/get',
    }

    const result = await RouteNodeFactory.build(project, rawRoute)

    assert.containsSubset(result, {
      description: 'GET',
      label: '/v2/users/get',
      controller: {
        path: slash(join(project.path, 'app/controllers/v2/users_controller.ts')),
        lineNumber: 2,
      },
    })
  })

  test('v6 magic | build tooltip for a RouteNode', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/v2/users_controller.ts',
      `export default class UsersController {
        get() {}
      }`
    )

    const rawRoute: RawRouteV6 = {
      name: 'MyRoute',
      handler: {
        method: 'get',
        moduleNameOrPath: '#controllers/v2/users_controller',
        type: 'controller',
      },
      methods: ['GET'],
      middleware: [],
      pattern: '/v2/users/get',
    }

    const result = await RouteNodeFactory.build(project, rawRoute)

    assert.snapshot(result.tooltip).matchInline(`
      "#### Endpoint

      /v2/users/get

      ---

      #### Methods

      GET

      ---

      #### Handler

      Controller: UsersController

      Filename: app/controllers/v2/users_controller.ts

      ---

      #### Middlewares

      None

      ---"
    `)
  })

  test('v5 | builds RouteNode', async ({ fs, assert }) => {
    const project = createAdonis5Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/Controllers/Http/V2/UsersController.ts',
      `export default class UsersController {
        public async get() {}
      }`
    )

    const rawRoute: RawRouteV6 = {
      name: 'MyRoute',
      handler: {
        method: 'get',
        moduleNameOrPath: 'V2/UsersController',
        type: 'controller',
      },
      methods: ['GET'],
      middleware: [],
      pattern: '/v2/users/get',
    }

    const result = await RouteNodeFactory.build(project, rawRoute)

    assert.containsSubset(result, {
      description: 'GET',
      label: '/v2/users/get',
      controller: {
        path: slash(join(project.path, 'app/Controllers/Http/V2/UsersController.ts')),
        lineNumber: 2,
      },
    })
  })

  test('v6 classic import | builds RouteNode', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    await fs.create(
      'my-project/app/controllers/v2/users_controller.ts',
      `export default class UsersController {
        get() {}
      }`
    )

    const rawRoute: RawRouteV6 = {
      name: 'MyRoute',
      handler: {
        method: 'get',
        moduleNameOrPath: 'UsersController',
        type: 'controller',
      },

      methods: ['GET'],
      middleware: [],
      pattern: '/v2/users/get',
    }

    const result = await RouteNodeFactory.build(project, rawRoute)

    assert.containsSubset(result, {
      description: 'GET',
      label: '/v2/users/get',
      controller: {
        path: null,
        lineNumber: -1,
      },
    })
  })

  test('handle closures', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const rawRoute: RawRouteV6 = {
      name: 'MyRoute',
      handler: {
        method: 'get',
        moduleNameOrPath: 'UsersController',
        type: 'closure',
      },
      methods: ['GET'],
      middleware: [],
      pattern: '/v2/users/get',
    }

    const result = await RouteNodeFactory.build(project, rawRoute)

    assert.containsSubset(result, {
      description: 'GET',
      label: '/v2/users/get',
      controller: {
        path: null,
        lineNumber: -1,
      },
    })
  })
})
