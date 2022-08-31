/** eslint-disable */

import { test } from '@japa/runner'

const hey = () => {}

test('Root test - 1', ({ assert }) => assert.isTrue(true))
test('Root test - 2', function () {})
test('Root test - 3', hey)

test.group('My super group 1', () => {
  test('My Test 1', ({ assert }) => assert.isTrue(true))
  test('My Test 2', hey)
  test('My Test 3', function () {})
  test('My Test 4', function () {}).skip()
})

test.group('My super group 2', (group) => {
  group.each.setup(() => {})
  group.each.teardown(() => {})

  test('Test 1', ({ assert }) => assert.isTrue(true))
  test('Test 2', hey)
  test('Test 3', function () {})
  test('Test 4', function () {}).skip()
})
