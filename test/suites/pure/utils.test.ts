import { resolve } from 'path'
import { test } from '@japa/runner'
import { getLineNumber } from '../../../src/utilities/misc'

test.group('Utils | getLineNumber', () => {
  test('should works', async ({ assert }) => {
    const file = resolve(__dirname, '../../fixtures/my_controller.ts')
    const result = await getLineNumber(file, 'show')
    assert.deepEqual(result, { name: 'show', lineno: 6 })
  })
})
