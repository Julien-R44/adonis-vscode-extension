import { join } from 'node:path'
import { test } from '@japa/runner'

import { createAdonis6Project } from '../../../../test_helpers'
import { TreeRoutesBuilder } from '#/routes_tree/tree_routes_builder'

function urltrie(urls, skipempty) {
  const res = {}

  for (const url_ of urls) {
    const url = typeof url_.url === 'string' ? url_.url : url_
    const amount = url_.amount || 1

    var parts

    parts = url.split('/').filter((x) => x.trim())

    let parentparts = []
    let current = res
    for (let j = 0; j < parts.length; j++) {
      const part = parts[j]
      const partstohere = parentparts.concat(part)
      const id = partstohere.join('/')

      if (!current[id]) {
        current[id] = { amount: 0 }
      }
      current[id].amount += amount

      if (j === parts.length - 1) {
        // last part
        current[id].url = url
      } else {
        // descend
        current[id].children = current[id].children || {}
        current = current[id].children
        parentparts = partstohere
      }
    }
  }

  if (skipempty) {
    skip(res)
  }

  return res
}

function skip(node, justthisid) {
  const ids = justthisid ? [justthisid] : Object.keys(node)

  for (const id of ids) {
    const child = node[id]

    if (!child) continue

    const nextkeys = child.children ? Object.keys(child.children) : []
    if (nextkeys.length === 1 && !child.url) {
      const nextid = nextkeys[0]

      // skipping this child
      const grandchild = child.children[nextid]
      delete node[id]
      node[nextid] = grandchild
      skip(node, nextid)
    } else {
      // just recurse into the children children
      if (child.children) {
        skip(child.children)
      }
    }
  }
}
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

  test('group scenario 1', async ({ fs, assert }) => {
    const project = createAdonis6Project(join(fs.basePath, 'my-project'))
    const fixture = await import('../../../fixtures/routes.json').then((m) => m.default)

    const result = await TreeRoutesBuilder.build(project, fixture)

    console.log(result)
    // const patterns = fixture[0]?.routes.map((route) => {
    //   return route.pattern
    // })

    // const result = urltrie(patterns, true)
    // console.log(result['api/v1'].children
  })
})
