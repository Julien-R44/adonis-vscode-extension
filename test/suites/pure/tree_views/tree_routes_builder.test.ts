import { join } from 'node:path'
import { test } from '@japa/runner'

import { createAdonis6Project } from '../../../../test_helpers'
import { TreeRoutesBuilder } from '../../../../src/routes_tree/tree_routes_builder'

test.group('Tree Routes Builder', () => {
  test('Should not group if only one domain', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const result = await TreeRoutesBuilder.build(project, [
      {
        domain: 'root',
        routes: [
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/foo',
          },
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/bar',
          },
        ],
      },
    ])

    assert.deepEqual(result.length, 2)
    assert.notDeepEqual(result[0]!.label, 'root')
  })

  test('should group routes by domain', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const result = await TreeRoutesBuilder.build(project, [
      {
        domain: 'root',
        routes: [
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/foo',
          },
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/bar',
          },
        ],
      },
      {
        domain: 'subdomain',
        routes: [
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/foo',
          },
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/bar',
          },
        ],
      },
    ])

    assert.deepEqual(result.length, 2)
    assert.deepEqual(result[0]!.label, 'root')
    assert.deepEqual(result[1]!.label, 'subdomain')

    assert.deepEqual(result[0]!.children!.length, 2)
    assert.deepEqual(result[1]!.children!.length, 2)
  })

  test('should group routes by path', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const result = await TreeRoutesBuilder.build(project, [
      {
        domain: 'root',
        routes: [
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/users/get',
          },
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/users/update',
          },
        ],
      },
    ])

    assert.deepEqual(result.length, 1)
    assert.deepEqual(result[0]!.label, 'users')
    assert.deepEqual(result[0]!.children!.length, 2)
    assert.deepEqual(result[0]!.children![0]!.label, '/users/get')
    assert.deepEqual(result[0]!.children![1]!.label, '/users/update')
  })

  test('buildFlat should flatten the tree', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))

    const result = await TreeRoutesBuilder.buildFlat(project, [
      {
        domain: 'root',
        routes: [
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/users/get',
          },
          {
            name: 'MyRoute',
            handler: {
              method: 'get',
              moduleNameOrPath: 'UsersController',
              type: 'controller',
            },
            methods: ['GET'],
            middleware: [],
            pattern: '/users/update',
          },
        ],
      },
    ])

    assert.deepEqual(result.length, 2)
  })
})
