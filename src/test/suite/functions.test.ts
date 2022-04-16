import { getMethodsInSourceFile, getLineNumber } from '../../utilities/functions'
import { workspace, WorkspaceFolder } from 'vscode'
import * as path from 'path'
import { test } from '@japa/runner'

let mainWorkspace: string

test.group('Autocomplete: Get All Functions In File', (group) => {
  group.setup(() => {
    const workspaceFolders = workspace.workspaceFolders as WorkspaceFolder[]
    mainWorkspace = workspaceFolders[0].uri.fsPath
  })

  test('Test that all functions in a file is returned', ({ assert }) => {
    const filePath = path.resolve(mainWorkspace, 'app/Models/User.ts')
    const functions = getMethodsInSourceFile(filePath)
    assert.deepEqual(functions, ['methodA', 'methodB'])
  })
})
