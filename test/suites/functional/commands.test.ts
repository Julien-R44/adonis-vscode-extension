import { test } from '@japa/runner'
import { Configure } from '../../../src/commands/configure'
import sinon from 'sinon'

test.group('Commands: Configure', (group) => {
  group.teardown(() => sinon.restore())

  test('Package name should be escaped ', async ({ assert }) => {
    const getInputMock = sinon.stub(Configure, <any>'getInput').returns('adonis framework')
    const execCmdMock = sinon.stub(Configure, <any>'sendTextToAdonisTerminal')

    await Configure.run()

    assert.deepEqual(execCmdMock.callCount, 1)
    assert.deepInclude(execCmdMock.lastCall.firstArg, 'configure "adonis framework"')
  }).pin()
})
