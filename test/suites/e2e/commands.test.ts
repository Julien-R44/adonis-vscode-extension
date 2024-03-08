import sinon from 'sinon'
import { test } from '@japa/runner'

import { AceExecutor } from '../../../src/vscode/ace_executor'
import { RunTests } from '../../../src/vscode/commands/run_tests'
import { Configure } from '../../../src/vscode/commands/configure'

test.group('Commands: Configure', (group) => {
  group.each.teardown(() => sinon.restore())

  test('Package name should be escaped ', async ({ assert }) => {
    sinon.stub(Configure, <any>'getInput').returns('adonis framework')
    const execCmdMock = sinon.stub(AceExecutor, <any>'sendTextToAdonisTerminal')

    await Configure.run()

    assert.deepEqual(execCmdMock.callCount, 1)
    assert.deepInclude(execCmdMock.lastCall.firstArg, 'configure "adonis framework"')
  })

  test('Command should be run in VSCode terminal', async ({ assert }) => {
    sinon.stub(Configure, <any>'getInput').returns('adonis framework')
    const execCmdMock = sinon.stub(AceExecutor, <any>'sendTextToAdonisTerminal')

    await Configure.run()

    assert.deepEqual(execCmdMock.callCount, 1)
  })
})

test.group('Commands: RunTests', (group) => {
  group.each.teardown(() => sinon.restore())

  test('Command should be run in VSCode terminal', async ({ assert }) => {
    sinon.stub(RunTests, <any>'getInput').returns('')
    sinon.stub(RunTests, <any>'getYesNo').returns(false)
    const execCmdMock = sinon.stub(AceExecutor, <any>'sendTextToAdonisTerminal')

    await RunTests.run()

    assert.deepEqual(execCmdMock.callCount, 1)
  })
})
