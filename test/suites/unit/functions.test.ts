import { getMethodsInSourceFile, getLineNumber } from '../../../src/utilities/functions'
import { workspace, WorkspaceFolder } from 'vscode'
import * as path from 'path'
import { test } from '@japa/runner'

let mainWorkspace: string

test.group('Autocomplete: Get All Functions In File', (group) => {
  group.setup(() => {
    const workspaceFolders = workspace.workspaceFolders as WorkspaceFolder[]
    mainWorkspace = workspaceFolders[0].uri.fsPath
  })

  test('All functions in a file is returned', ({ assert }) => {
    const filePath = path.resolve(mainWorkspace, 'app/Models/User.ts')
    const functions = getMethodsInSourceFile(filePath)
    assert.deepEqual(functions, ['methodA', 'methodB'])
  })

  test('Get line number of a method', async ({ assert }) => {
    const filePath = path.resolve(mainWorkspace, 'app/Models/User.ts')
    const lineNumberA = await getLineNumber(filePath, 'methodA')
    const lineNumberB = await getLineNumber(filePath, 'methodB')

    assert.deepEqual(lineNumberA, { lineno: 5, name: 'methodA' })
    assert.deepEqual(lineNumberB, { lineno: 6, name: 'methodB' })
  })

  test('Get line number of a method that does not exist', async ({ assert }) => {
    const filePath = path.resolve(mainWorkspace, 'app/Models/User.ts')
    const lineNumber = await getLineNumber(filePath, 'xxx')

    assert.deepEqual(lineNumber, { lineno: -1, name: 'xxx' })
  })
})
