import { ExtensionContext, commands, window, ViewColumn } from "vscode";

export const registerDocsCommands = (context: ExtensionContext) => {
  const extName = 'adonis-vscode-ace'

  /**
   * Open the AdonisJS docs
   */
  commands.registerCommand(`${extName}.docs.open`, () => {
    const panel = window.createWebviewPanel('adonisjs-docs', 'AdonisJS Docs', ViewColumn.One, {
      enableScripts: true,
    })

    panel.webview.html = `<iframe width="100%" height="650px" src="https://docs.adonisjs.com/"></iframe>`
  })
}
