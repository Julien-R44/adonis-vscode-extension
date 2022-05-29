import { ExtensionContext, commands } from 'vscode'
import { EXTENSION_NAME } from '../utilities/constants'
import { commands as commandsExtension } from './commands'

/**
 * Register Ace commands to the extension context
 */
export const registerAceCommands = (context: ExtensionContext) => {
  const commandsDisposables = commandsExtension
    .map((group) => group.children)
    .flat()
    .map((command) => {
      return commands.registerCommand(
        EXTENSION_NAME + '.' + command.commandIdentifier,
        command.handler
      )
    })

  return context.subscriptions.push(...commandsDisposables)
}
