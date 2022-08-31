import { readFileSync, readdirSync, statSync } from 'fs'
import { join } from 'node:path'
import { test } from '@japa/runner'
import { TestsExtractor } from '../../../src/services/tests_extractor'

const BASE_PATH = join(__dirname, '../../fixtures/tests_extractor')
const dirs = readdirSync(BASE_PATH).filter((file) => statSync(join(BASE_PATH, file)).isDirectory())

dirs.forEach((dir) => {
  const dirBasePath = join(BASE_PATH, dir)
  test(dir, async ({ assert }) => {
    const source = readFileSync(join(dirBasePath, 'input.test.ts'), 'utf-8')
    const expected = JSON.parse(readFileSync(join(dirBasePath, 'output.json'), 'utf-8'))
    const actual = new TestsExtractor().extract(source)
    assert.deepEqual(actual, expected)
  })
})
