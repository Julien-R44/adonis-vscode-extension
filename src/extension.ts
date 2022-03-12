import { ExtensionContext, commands, workspace, window, ViewColumn } from 'vscode'
import { registerAceCommands } from './commands'
import { registerDocsCommands } from './docs'

export function activate(context: ExtensionContext) {
  registerAceCommands(context)
  registerDocsCommands(context)
}

export function deactivate() {}
