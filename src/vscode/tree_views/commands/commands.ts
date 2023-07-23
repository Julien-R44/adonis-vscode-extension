import { commands } from 'vscode'
import { Extension } from '../../extension'
import ExtConfig from '../../utilities/config'
import ProjectManager from '../../project_manager'
import type { ExtensionContext } from 'vscode'

function refreshCommands() {
  ProjectManager.currentProject.reload()
  return Extension.commandsTreeDataProvider.buildTree()
}

export const registerCommandsTreeViewCommands = (context: ExtensionContext) => {
  const viewCommands: [string, Function][] = [
    [ExtConfig.buildCommandId('view.commands.refresh'), refreshCommands],
  ]

  const commandsDisposables = viewCommands.map(([identifier, handler]) =>
    commands.registerCommand(identifier, handler as any)
  )

  context.subscriptions.push(...commandsDisposables)
}
