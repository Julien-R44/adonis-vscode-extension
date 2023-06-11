import { commands, languages } from 'vscode'
import { registerAceCommands } from './vscode/commands'
import EdgeCompletionProvider from './vscode/providers/edge/completion_provider'
import EdgeLinkProvider from './vscode/providers/edge/link_provider'
import RouteControllerCompletionProvider from './vscode/providers/routes/completion_provider'
import { RouteControllerLinkProvider } from './vscode/providers/routes/link_provider'
import { registerDocsCommands } from './vscode/commands/docs'
import { EdgeFormatterProvider } from './vscode/languages'
import { ViewContainer } from './vscode/tree_views/index'
import ProjectManager from './vscode/project_manager'
import ExtConfig from './vscode/utilities/config'
import { ViewsLinkProvider } from './vscode/providers/views/link_provider'
import { ViewsCompletionProvider } from './vscode/providers/views/completion_provider'
import { Extension } from './vscode/extension'
import type { ExtensionContext } from 'vscode'

export async function activate(context: ExtensionContext) {
  // eslint-disable-next-line no-console
  console.log('Activating AdonisJS extension...')
  await ProjectManager.load()

  /**
   * Set commands visibility
   */
  commands.executeCommand('setContext', ExtConfig.CONTEXT_ADONIS_PROJECT_LOADED, true)

  /**
   * Register views
   */
  ViewContainer.initViews(context)

  /**
   * Register commands
   */
  registerAceCommands(context)
  registerDocsCommands(context)

  commands.registerCommand('adonis-vscode-extension.pickProject', async () => {
    const project = await ProjectManager.quickPickProject()

    if (project) {
      ProjectManager.setCurrentProject(project)
      Extension.routesTreeDataProvider.getAllRoutes()
    }
  })

  /**
   * Formatting and syntax setup
   */
  const edgeSelector = { language: 'edge', scheme: 'file' }
  const edgeFormatter = new EdgeFormatterProvider()

  context.subscriptions.push(
    languages.registerDocumentFormattingEditProvider(edgeSelector, edgeFormatter),
    languages.registerDocumentRangeFormattingEditProvider(edgeSelector, edgeFormatter)
  )

  /**
   * Autocompletion, hover and links for TS files
   */
  const tsSelector = { language: 'typescript', scheme: 'file' }

  const routeLink = languages.registerDocumentLinkProvider(
    tsSelector,
    new RouteControllerLinkProvider()
  )

  const routeCompletion = languages.registerCompletionItemProvider(
    tsSelector,
    new RouteControllerCompletionProvider()
  )

  /**
   * Autocompletion, hover and links for Views in edge files
   */
  const viewSelector = [{ language: 'edge', scheme: 'file' }]

  const edgeLink = languages.registerDocumentLinkProvider(viewSelector, new EdgeLinkProvider())
  const edgeCompletion = languages.registerCompletionItemProvider(
    viewSelector,
    new EdgeCompletionProvider()
  )

  /**
   * Autocompletion, hover and links for Views in Ts files
   */
  const viewTsLink = languages.registerDocumentLinkProvider(tsSelector, new ViewsLinkProvider())
  const viewsCompletion = languages.registerCompletionItemProvider(
    tsSelector,
    new ViewsCompletionProvider()
  )

  context.subscriptions.push(
    routeLink,
    routeCompletion,
    edgeLink,
    edgeCompletion,
    viewTsLink,
    viewsCompletion
  )
}

export function deactivate() {}
