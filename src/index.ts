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
import InertiaLinkProvider from './vscode/providers/inertia/link_provider'
import { InertiaCompletionProvider } from './vscode/providers/inertia/completion_provider'
import { CreateMissingViewAction } from './vscode/code_actions/create_missing_view'
import { Logger } from './vscode/logger'
import type { AdonisProject } from './adonis_project'
import type { ExtensionContext } from 'vscode'

export async function activate(context: ExtensionContext) {
  // eslint-disable-next-line no-console
  console.log('Activating AdonisJS extension...')
  const projects = await ProjectManager.load()

  if (!projects.length) {
    Logger.info('No AdonisJS project found')
    return
  }

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

  commands.registerCommand(
    'adonis-vscode-extension.pickProject',
    async (project?: AdonisProject) => {
      project = project || (await ProjectManager.quickPickProject())
      if (!project) return

      ProjectManager.setCurrentProject(project)
      Extension.routesTreeDataProvider.getAllRoutes()
    }
  )

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
   * Autocompletion and links for TS files
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
   * Autocompletion and links for Views in edge files
   */
  const viewSelector = [{ language: 'edge', scheme: 'file' }]

  const edgeLink = languages.registerDocumentLinkProvider(viewSelector, new EdgeLinkProvider())
  const edgeCompletion = languages.registerCompletionItemProvider(
    viewSelector,
    new EdgeCompletionProvider()
  )

  /**
   * Autocompletion and links for Inertia in TS files
   */
  const inertiaLink = languages.registerDocumentLinkProvider(tsSelector, new InertiaLinkProvider())
  const inertiaCompletion = languages.registerCompletionItemProvider(
    tsSelector,
    new InertiaCompletionProvider()
  )

  /**
   * Autocompletion and links for Views in Ts files
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
    viewsCompletion,
    inertiaLink,
    inertiaCompletion
  )

  /**
   * Code actions
   */
  CreateMissingViewAction.register()
}

export function deactivate() {}
