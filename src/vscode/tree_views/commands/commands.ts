import { Uri, commands, window } from 'vscode'
import type { ExtensionContext } from 'vscode'

import { Extension } from '../../extension'
import ExtConfig from '../../utilities/config'
import ProjectManager from '../../project_manager'
import type { AceCommandNode } from '#types/projects'

function refreshCommands() {
  ProjectManager.currentProject.reload()
  return Extension.commandsTreeDataProvider.buildTree()
}

async function openCommandFile(node: AceCommandNode) {
  const project = ProjectManager.getCurrentProject()
  if (!project) return

  await window.showTextDocument(Uri.file(node.absoluteFilePath!))
}

export const registerCommandsTreeViewCommands = (context: ExtensionContext) => {
  const viewCommands: [string, (...args: any) => any][] = [
    [ExtConfig.buildCommandId('view.commands.refresh'), refreshCommands],
    [ExtConfig.buildCommandId('view.commands.open-command'), openCommandFile],
  ]

  const commandsDisposables = viewCommands.map(([identifier, handler]) =>
    commands.registerCommand(identifier, handler as any)
  )

  context.subscriptions.push(...commandsDisposables)
}
