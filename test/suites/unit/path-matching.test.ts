import { Uri, workspace, WorkspaceFolder, TextDocument } from 'vscode'
import * as path from 'path'
import { test } from '@japa/runner'
import { getPathMatches } from '../../../src/utilities/pathMatching'

let mainWorkspace: string
let routesDoc: TextDocument

test.group('Path Matching', (group) => {
  group.setup(async () => {
    const workspaceFolders = workspace.workspaceFolders as WorkspaceFolder[]
    mainWorkspace = workspaceFolders[0].uri.fsPath
    routesDoc = await workspace.openTextDocument(
      Uri.file(path.join(mainWorkspace, 'start/routes.ts'))
    )
  })

  test('Only controller name matching', async ({ assert }) => {
    const result = getPathMatches('User', routesDoc, ['app/controllers'], ['controller.ts'])
    assert.deepEqual(result.length, 1)
    assert.deepEqual(result[0].fullpath, 'basic-app/app/controllers/Http/Usercontroller.ts')
  })

  test('View matching', async ({ assert }) => {
    const viewDoc = await workspace.openTextDocument(
      Uri.file(path.join(mainWorkspace, 'resources/views/test.edge'))
    )

    const result = getPathMatches('partials/footer', viewDoc, ['resources/views'], ['.edge'])
    assert.deepEqual(result.length, 1)
    assert.deepEqual(result[0].fullpath, 'basic-app/resources/views/partials/footer.edge')
  })

  test('Flat view matching', async ({ assert }) => {
    const viewDoc = await workspace.openTextDocument(
      Uri.file(path.join(mainWorkspace, 'resources/views/test.edge'))
    )

    const result = getPathMatches('flat', viewDoc, ['resources/views'], ['.edge'])
    assert.deepEqual(result.length, 1)
    assert.deepEqual(result[0].fullpath, 'basic-app/resources/views/flat.edge')
  })

  test('Nested view matching', async ({ assert }) => {
    const viewDoc = await workspace.openTextDocument(
      Uri.file(path.join(mainWorkspace, 'resources/views/test.edge'))
    )

    const result = getPathMatches('partials/footer', viewDoc, ['resources/views'], ['.edge'])
    assert.deepEqual(result.length, 1)
    assert.deepEqual(result[0].fullpath, 'basic-app/resources/views/partials/footer.edge')
  })

  test('Nested*2 view matching', async ({ assert }) => {
    const viewDoc = await workspace.openTextDocument(
      Uri.file(path.join(mainWorkspace, 'resources/views/test.edge'))
    )

    const result = getPathMatches(
      'components/nested/nested-btn',
      viewDoc,
      ['resources/views'],
      ['.edge']
    )
    assert.deepEqual(result.length, 1)
    assert.deepEqual(
      result[0].fullpath,
      'basic-app/resources/views/components/nested/nested-btn.edge'
    )
  })
})
