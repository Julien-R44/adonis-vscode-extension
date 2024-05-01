import type { WebviewPanel } from 'vscode'

import { Notifier } from '#vscode/notifier'
import type { AdonisProject } from '#types/projects'
import { HtmlTable } from '#vscode/helpers/html_table'
import BaseCommand from '#vscode/commands/base_command'

export class RouteList extends BaseCommand {
  private static readonly command = 'list:routes --json'

  /**
   * Parse the return of `list:routes --json` command
   */
  private static parseRoutes(rawRoutes: any): {
    headers: string[]
    rows: string[][]
  } {
    const jsonRoutes = JSON.parse(rawRoutes)
    const headers = ['Domain', 'Method', 'Path', 'Handler', 'Name', 'Middleware']

    const rows = Object.values(jsonRoutes)
      .flat()
      .map((route: any) => [
        route.domain === 'root' ? '/' : route.domain,
        route.methods.join(','),
        route.pattern,
        route.handler,
        route.name,
        route.middleware.join(','),
      ])

    return { headers, rows }
  }

  /**
   * Execute the `node ace list:routes --json` command and parse the JSON output
   */
  private static async execAndParseRoutes(project?: AdonisProject) {
    const res = await this.execCmd(this.command, true, project)
    const { headers, rows } = this.parseRoutes(res.result!.stdout)

    return { res, headers, rows }
  }

  /**
   * Handle message received by the table webview
   */
  private static async onReceiveWebviewMessage(
    panel: WebviewPanel,
    project: AdonisProject,
    message: any
  ) {
    if (message.command !== 'refresh') {
      return
    }

    try {
      const { rows } = await this.execAndParseRoutes(project)
      panel.webview.postMessage({ command: 'refresh', rows })
    } catch (error) {
      Notifier.showError('Failed to refresh routes list', error)
      panel.webview.postMessage({ command: 'refresh-failed', error })
    }
  }

  /**
   * Run the command
   */
  static async run() {
    try {
      const { res, headers, rows } = await this.execAndParseRoutes()
      const panel = await HtmlTable.openPanelWithTable('routes-list', 'Route List', headers, rows)
      panel.webview.onDidReceiveMessage(
        this.onReceiveWebviewMessage.bind(this, panel, res.adonisProject)
      )
    } catch (err: any) {
      return Notifier.showError('The route list could not be generated', err)
    }
  }
}
