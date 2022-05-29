import { ExtensionContext, commands } from 'vscode'
import { commands as commandsExtension } from './commands'

/**
 * Register Ace commands to the extension context
 */
export const registerAceCommands = (context: ExtensionContext) => {
  const commandsDisposables = commandsExtension
    .map((group) => group.children)
    .flat()
    .map((command) => commands.registerCommand(command.commandIdentifier, command.handler))

  return context.subscriptions.push(...commandsDisposables)
}
