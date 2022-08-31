/** eslint-disable */

import { test } from '@japa/runner'

test.group('My super group', () => {
  test('My Test', ({ assert }) => {
    assert.isTrue(true)
  })
})
