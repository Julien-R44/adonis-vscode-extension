import type { CommandsTreeDataProvider } from './tree_views/commands/tree_data_provider'
import type { RoutesTreeDataProvider } from './tree_views/routes/tree_data_provider'

/**
 * Store common objects used throughout the extension.
 */
export class Extension {
  public static routesTreeDataProvider: RoutesTreeDataProvider
  public static commandsTreeDataProvider: CommandsTreeDataProvider
}
