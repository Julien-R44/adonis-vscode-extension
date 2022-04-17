import * as vscode from 'vscode'
import * as path from 'path'
import { workspace, WorkspaceFolder } from 'vscode'
import { test } from '@japa/runner'
import { RouteControllerLinkProvider } from '../../completion/routes/LinkProvider'

let mainWorkspace: string

test.group('Routes Link Provider', (group) => {
  group.setup(() => {
    const workspaceFolders = workspace.workspaceFolders as WorkspaceFolder[]
    mainWorkspace = workspaceFolders[0].uri.fsPath
  })

  test('Simple flat links', async ({ assert }) => {
    const provider = new RouteControllerLinkProvider()
    const doc = await vscode.workspace.openTextDocument(path.join(mainWorkspace, 'start/routes.ts'))
    const links = await provider.provideDocumentLinks(doc)

    assert.deepEqual(links!.length, 2)
    // @ts-ignore
    assert.include(links![0].filePath.path, 'app/controllers/Http/Usercontroller.ts')
    // @ts-ignore
    assert.include(links![1].filePath.path, 'app/controllers/Http/Foocontroller.ts')
  })

  test('Link to nested controllers', async ({ assert }) => {
    const provider = new RouteControllerLinkProvider()
    const doc = await vscode.workspace.openTextDocument(
      path.join(mainWorkspace, 'start/routes2.ts')
    )
    const links = await provider.provideDocumentLinks(doc)

    assert.deepEqual(links!.length, 2)
    assert.include(
      // @ts-ignore
      links![0].filePath.path,
      'app/controllers/Http/Features/Client/Clientcontroller.ts'
    )
    assert.include(
      // @ts-ignore
      links![1].filePath.path,
      'app/controllers/Http/Features/Order/Ordercontroller.ts'
    )
  })

  test('Links redirect to correct line number', async ({ assert }) => {
    const provider = new RouteControllerLinkProvider()
    const doc = await vscode.workspace.openTextDocument(
      path.join(mainWorkspace, 'start/routes3.ts')
    )
    const links = await provider.provideDocumentLinks(doc)

    // @ts-ignore
    const providerResultA = await provider.resolveDocumentLink(links![0])
    // @ts-ignore
    const providerResultB = await provider.resolveDocumentLink(links![1])

    assert.deepEqual(providerResultA!.target?.fragment, '6')
    assert.deepEqual(providerResultB!.target?.fragment, '11')
  })
})
