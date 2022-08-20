import { commands } from 'vscode'
import { Extension } from 'src/services/extension'
import { commands as commandsExtension } from './commands'
import type { ExtensionContext } from 'vscode'

/**
 * Register Ace commands to the extension context
 */
export const registerAceCommands = (context: ExtensionContext) => {
  const commandsDisposables = commandsExtension
    .map((group) => group.children)
    .flat()
    .map((command) => commands.registerCommand(command.commandIdentifier, command.handler))

  context.subscriptions.push(...commandsDisposables)

  // TODO: Move me
  context.subscriptions.push(
    commands.registerCommand('adonis-vscode-extension.view.routes.refresh', () => {
      Extension.routesTreeDataProvider.getAllRoutes()
    })
  )
}
