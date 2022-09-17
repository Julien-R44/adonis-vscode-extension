import { commands, languages } from 'vscode'
import { registerAceCommands } from './commands'
import EdgeCompletionProvider from './completion/edge/completion_provider'
import EdgeHoverProvider from './completion/edge/hover_provider'
import EdgeLinkProvider from './completion/edge/link_provider'
import RouteControllerCompletionProvider from './completion/routes/completion_provider'
import RouteControllerHoverProvider from './completion/routes/hover_provider'
import { RouteControllerLinkProvider } from './completion/routes/link_provider'
import { registerDocsCommands } from './commands/docs'
import { EdgeFormatterProvider } from './languages'
import { ViewContainer } from './tree_views/index'
import ProjectManager from './services/adonis_project/manager'
import ExtConfig from './utilities/config'
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

  const routeHover = languages.registerHoverProvider(tsSelector, new RouteControllerHoverProvider())
  const routeCompletion = languages.registerCompletionItemProvider(
    tsSelector,
    new RouteControllerCompletionProvider()
  )

  /**
   * Autocompletion, hover and links for Views
   */
  const viewSelector = [
    { language: 'edge', scheme: 'file' },
    { language: 'typescript', scheme: 'file' },
  ]

  const edgeLink = languages.registerDocumentLinkProvider(viewSelector, new EdgeLinkProvider())
  const edgeHover = languages.registerHoverProvider(viewSelector, new EdgeHoverProvider())
  const edgeCompletion = languages.registerCompletionItemProvider(
    viewSelector,
    new EdgeCompletionProvider()
  )

  context.subscriptions.push(
    routeLink,
    routeHover,
    routeCompletion,
    edgeLink,
    edgeHover,
    edgeCompletion
  )
}

export function deactivate() {}
