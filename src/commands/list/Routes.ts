import BaseCommand, { ExtensionErrors } from '../BaseCommand'
import { HtmlTable } from '../../helpers/HtmlTable'

export class RouteList extends BaseCommand {
  public static async run() {
    let command = `list:routes --json`

    try {
      const res = await this.execCmd(command)
      const { headers, rows } = this.parseRoutes(res.result!.stdout)
      HtmlTable.openPanelWithTable('routes-list', 'Route List', headers, rows)
    } catch (err) {
      // @ts-ignore
      if (err.errorCode === ExtensionErrors.ERR_ADONIS_PROJECT_SELECTION_NEEDED) {
        return this.showError('You must select an AdonisJS project on which to run your command.')
      }

      return this.showError('The route list could not be generated', err)
    }
  }

  /**
   * Parse the return of `list:routes --json` command
   *
   * TODO: Handle multiples domains
   */
  private static parseRoutes(rawRoutes: any): {
    headers: string[]
    rows: string[][]
  } {
    const jsonRoutes = JSON.parse(rawRoutes)
    const headers = ['Domain', 'Method', 'Path', 'Handler', 'Name', 'Middleware']

    const rows = jsonRoutes.root.map((route: any) => [
      '/',
      route.methods.join(','),
      route.pattern,
      route.handler,
      route.name,
      route.middleware.join(','),
    ])

    return {
      headers,
      rows,
    }
  }
}
