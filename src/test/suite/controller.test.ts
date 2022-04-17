import { test } from '@japa/runner'
import {
  parseControllerString,
  Controller,
  createControllerLink,
  RouteControllerLink,
} from '../../utilities/controller'
import { Position, Uri, Range, workspace, WorkspaceFolder } from 'vscode'
import * as path from 'path'

test.group('Parse route controller strings', (group) => {
  test('Controller string is parsed', ({ assert }) => {
    const text = 'HomeController'
    const controller = parseControllerString(text)
    const lPath = {
      name: 'Home',
      fullname: text,
      parentDirectory: '',
      fullPath: text,
      method: '',
    }

    assert.deepEqual(lPath, controller)
  })

  test('Controller parent directory is parsed', ({ assert }) => {
    const text = 'User/People/HomeController'
    const controller = parseControllerString(text)
    const lPath = {
      name: 'Home',
      fullname: 'User/People/HomeController',
      parentDirectory: 'User/People/',
      fullPath: text,
      method: '',
    }

    assert.deepEqual(lPath, controller)
  })

  test('Controller string without parent directory and method is parsed', ({ assert }) => {
    const text = 'UserController.getProfile'
    const controller = parseControllerString(text)
    const lPath = {
      name: 'User',
      fullname: 'UserController',
      parentDirectory: '',
      fullPath: text,
      method: 'getProfile',
    }

    assert.deepEqual(lPath, controller)
  })

  test('Controller string with parent directory and method is parsed', ({ assert }) => {
    const text = 'User/People/HomeController.me'
    const controller = parseControllerString(text)
    const lPath = {
      name: 'Home',
      fullname: 'User/People/HomeController',
      parentDirectory: 'User/People/',
      fullPath: text,
      method: 'me',
    }

    assert.deepEqual(lPath, controller)
  })

  test('Controller string with trailing fullstop and no parent directory is parsed', ({
    assert,
  }) => {
    const text = 'HomeController.'
    const controller = parseControllerString(text)
    const lPath = {
      name: 'Home',
      fullname: 'HomeController',
      parentDirectory: '',
      fullPath: text,
      method: '',
    }

    assert.deepEqual(lPath, controller)
  })

  test('Controller string with parent directory and trailing fullstop is parsed', ({ assert }) => {
    const text = 'User/People/HomeController.'
    const controller = parseControllerString(text)

    const lPath = {
      name: 'Home',
      fullname: 'User/People/HomeController',
      parentDirectory: 'User/People/',
      fullPath: text,
      method: '',
    }

    assert.deepEqual(lPath, controller)
  })

  test('Controller string without `controller` substring fails to parse', ({ assert }) => {
    const text = 'Home.'
    const controller = parseControllerString(text)
    assert.deepEqual(controller, null)
  })

  test('Controller string without `controller` substring and with parent directory fails to parse', ({
    assert,
  }) => {
    const text = 'Country/People/Home.'
    const controller = parseControllerString(text)
    assert.deepEqual(controller, null)
  })

  test('Controller without name is invalid', ({ assert }) => {
    const text = '.me'
    const controller = parseControllerString(text)
    assert.equal(controller, null)
  })
})
