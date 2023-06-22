import { window } from 'vscode'
import { CommandsTreeDataProvider } from './commands/tree_data_provider'
import { RoutesTreeDataProvider } from './routes/tree_data_provider'
import { HelpTreeDataView } from './help'
import { registerRoutesTreeViewCommands } from './routes/commands'
import { ProjectsTreeDataProvider } from './projects/tree_data_provider'
import type { ExtensionContext } from 'vscode'

/**
 * Responsible for adding the AdonisJS logo on the VSCode Sidebar
 * ( Tree View ) and create the UI interface
 */
export class ViewContainer {
  /**
   * Create the "Commands" view with the different ace commands
   */
  private static createCommandsView() {
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
  public static initViews(context: ExtensionContext) {
    if (process.env.NODE_ENV === 'test') return

    HelpTreeDataView.createView(context)
    this.createCommandsView()
    this.createRoutesView(context)
    this.createProjectsView(context)
  }
}
