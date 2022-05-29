import { commands, ExtensionContext, languages } from 'vscode'
import { registerAceCommands } from './commands'
import EdgeCompletionProvider from './completion/edge/CompletionProvider'
import EdgeHoverProvider from './completion/edge/HoverProvider'
import EdgeLinkProvider from './completion/edge/LinkProvider'
import RouteControllerCompletionProvider from './completion/routes/CompletionProvider'
import RouteControllerHoverProvider from './completion/routes/HoverProvider'
import { RouteControllerLinkProvider } from './completion/routes/LinkProvider'
import { registerDocsCommands } from './commands/docs'
import { EdgeFormatterProvider } from './languages'
import ProjectFinder from './services/ProjectFinder'
import { CONTEXT_ADONIS_PROJECT_LOADED } from './utilities/constants'
import { ViewContainer } from './services/ViewContainer'

export async function activate(context: ExtensionContext) {
  console.log('Activating AdonisJS extension...')
  await ProjectFinder.loadAdonisProjects()

  /**
   * Set commands visibility
   */
  commands.executeCommand('setContext', CONTEXT_ADONIS_PROJECT_LOADED, true)

  /**
   * Register views
   */
  ViewContainer.createGetHelpView(context)
  ViewContainer.createExplorerView(context)

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
   * Autocompletion, hover and links for Edge files
   */
  const edgeLink = languages.registerDocumentLinkProvider(['edge'], new EdgeLinkProvider())
  const edgeHover = languages.registerHoverProvider(['edge'], new EdgeHoverProvider())
  const edgeCompletion = languages.registerCompletionItemProvider(
    ['edge'],
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
