import { window } from 'vscode'
import { CommandsTreeDataProvider } from './commands/tree_data_provider'
import { RoutesTreeDataProvider } from './routes/tree_data_provider'
import { HelpTreeDataView } from './help'
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
  private static createRoutesView() {
    const treeDataProvider = new RoutesTreeDataProvider()
    window.createTreeView('adonisjs.routes', { treeDataProvider })
  }

  /**
   * Initialize all tree views
   */
  public static initViews(context: ExtensionContext) {
    if (process.env.NODE_ENV === 'test') return

    HelpTreeDataView.createView(context)
    this.createCommandsView()
    this.createRoutesView()
  }
}
