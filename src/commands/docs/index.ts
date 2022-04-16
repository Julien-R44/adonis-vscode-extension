import { ExtensionContext, commands, window, ViewColumn } from "vscode";

/**
 * Open the given URL in a new panel as a webview
 */
const openUrlAsWebview = (viewId: string, panelName: string, url: string) => {
  const panel = window.createWebviewPanel(viewId, panelName, ViewColumn.One, {
    enableScripts: true,
  })

  panel.webview.html = `<iframe width="100%" height="650px" src="${url}"></iframe>`
}

export const registerDocsCommands = (context: ExtensionContext) => {
  const extName = 'adonis-vscode-ace'

  commands.registerCommand(`${extName}.docs.adonis`, () => openUrlAsWebview('adonis', 'AdonisJS Docs', 'https://docs.adonisjs.com/'))
  commands.registerCommand(`${extName}.docs.japa`, () => openUrlAsWebview('japa', 'Japa Docs', 'https://japa.dev'))
}
