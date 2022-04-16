import { getMethodsInSourceFile, getLineNumber } from '../../utilities/functions'
import { workspace, WorkspaceFolder } from 'vscode'
import * as assert from 'assert'
import * as path from 'path'

suite('Autocomplete: Get All Functions In File', () => {
  setup(function () {
    const workspaceFolders = workspace.workspaceFolders as WorkspaceFolder[]
    this.workspace = workspaceFolders[0].uri.fsPath
  })

  test('Test that all functions in a file is returned', function () {
    const filePath = path.resolve(this.workspace, 'app/Models/User.ts')
    const functions = getMethodsInSourceFile(filePath)
    assert.deepStrictEqual(functions, ['methodA', 'methodB'])
  })
})
