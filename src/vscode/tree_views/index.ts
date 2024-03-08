import { window } from 'vscode'
import type { ExtensionContext } from 'vscode'

import { HelpTreeDataView } from './help'
import { registerRoutesTreeViewCommands } from './routes/commands'
import { RoutesTreeDataProvider } from './routes/tree_data_provider'
import { registerCommandsTreeViewCommands } from './commands/commands'
import { CommandsTreeDataProvider } from './commands/tree_data_provider'
import { ProjectsTreeDataProvider } from './projects/tree_data_provider'

/**
 * Responsible for adding the AdonisJS logo on the VSCode Sidebar
 * ( Tree View ) and create the UI interface
 */
export class ViewContainer {
  /**
   * Create the "Commands" view with the different ace commands
   */
  private static createCommandsView(context: ExtensionContext) {
    registerCommandsTreeViewCommands(context)
    const treeDataProvider = new CommandsTreeDataProvider()
    window.createTreeView('adonisjs.commands', { treeDataProvider })
  }

  /**
   * Create the "Routes" view
   */
  private static createRoutesView(context: ExtensionContext) {
    registerRoutesTreeViewCommands(context)
    const treeDataProvider = new RoutesTreeDataProvider()
    window.createTreeView('adonisjs.routes', { treeDataProvider })
  }

  /**
   * Create the "Projects" view
   */
  private static createProjectsView(_context: ExtensionContext) {
    const treeDataProvider = new ProjectsTreeDataProvider()
    window.createTreeView('adonisjs.projects', { treeDataProvider })
  }

  /**
   * Initialize all tree views
   */
  static initViews(context: ExtensionContext) {
    if (process.env.NODE_ENV === 'test') return

    HelpTreeDataView.createView(context)
    this.createCommandsView(context)
    this.createRoutesView(context)
    this.createProjectsView(context)
  }
}
