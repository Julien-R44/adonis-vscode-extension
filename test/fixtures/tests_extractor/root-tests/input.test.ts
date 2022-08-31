/** eslint-disable */

import { test } from '@japa/runner'

const hey = () => {}

test('Root test - 1', ({ assert }) => assert.isTrue(true))
test('Root test - 2', function () {})
test('Root test - ', hey)
test('Root test - xx', hey).skip()
