import { test } from '@japa/runner'

import { parseMagicString } from '#/utilities'

test.group('Utils | parseControllerString', () => {
  test('full v6', ({ assert }) => {
    const controller = parseMagicString('#controllers/foo/bar/users_controller.index')

    assert.deepEqual(controller, {
      name: 'users_controller',
      subpathImport: '#controllers',
      namespace: 'foo/bar',
      method: 'index',
      fullPath: '#controllers/foo/bar/users_controller.index',
    })
  })

  test('should not count subpath import as namespace', ({ assert }) => {
    const controller = parseMagicString('#controllers/users_controller.index')

    assert.deepEqual(controller, {
      name: 'users_controller',
      subpathImport: '#controllers',
      namespace: undefined,
      method: 'index',
      fullPath: '#controllers/users_controller.index',
    })
  })

  test('basic', ({ assert }) => {
    const controller = parseMagicString('HomeController')

    assert.deepEqual(controller, {
      name: 'HomeController',
      fullPath: 'HomeController',
      method: undefined,
      namespace: undefined,
      subpathImport: undefined,
    })
  })

  test('parse namespace', ({ assert }) => {
    const controller = parseMagicString('User/People/HomeController')

    assert.deepEqual(controller, {
      name: 'HomeController',
      fullPath: 'User/People/HomeController',
      method: undefined,
      namespace: 'User/People',
      subpathImport: undefined,
    })
  })

  test('only name and method', ({ assert }) => {
    const controller = parseMagicString('UserController.getProfile')

    assert.deepEqual(controller, {
      name: 'UserController',
      fullPath: 'UserController.getProfile',
      method: 'getProfile',
      namespace: undefined,
      subpathImport: undefined,
    })
  })

  test('only name and method snake_case', ({ assert }) => {
    const controller = parseMagicString('home_controller.get_profile')

    assert.deepEqual(controller, {
      name: 'home_controller',
      fullPath: 'home_controller.get_profile',
      method: 'get_profile',
      namespace: undefined,
      subpathImport: undefined,
    })
  })

  test('namespace name and method', ({ assert }) => {
    const controller = parseMagicString('User/People/HomeController.me')

    assert.deepEqual(controller, {
      name: 'HomeController',
      fullPath: 'User/People/HomeController.me',
      method: 'me',
      namespace: 'User/People',
      subpathImport: undefined,
    })
  })

  test('only name with trailing dot', ({ assert }) => {
    const controller = parseMagicString('HomeController')

    assert.deepEqual(controller, {
      name: 'HomeController',
      fullPath: 'HomeController',
      method: undefined,
      namespace: undefined,
      subpathImport: undefined,
    })
  })

  test('namespace with trailing dot', ({ assert }) => {
    const controller = parseMagicString('User/People/HomeController.')

    assert.deepEqual(controller, {
      name: 'HomeController',
      fullPath: 'User/People/HomeController.',
      method: '',
      namespace: 'User/People',
      subpathImport: undefined,
    })
  })

  test('Controller without name is invalid', ({ assert }) => {
    const controller = parseMagicString('.me')
    assert.equal(controller, null)
  })

  test('multiple word snake_case', ({ assert }) => {
    const controller = parseMagicString('my_profile_controller.me')
    assert.deepEqual(controller, {
      name: 'my_profile_controller',
      fullPath: 'my_profile_controller.me',
      method: 'me',
      namespace: undefined,
      subpathImport: undefined,
    })
  })

  test('handle snake_case strings with parent directory', ({ assert }) => {
    const controller = parseMagicString('user/people/my_controller.me')

    assert.deepEqual(controller, {
      name: 'my_controller',
      fullPath: 'user/people/my_controller.me',
      method: 'me',
      namespace: 'user/people',
      subpathImport: undefined,
    })
  })
})
