import { window } from 'vscode'
import { existsSync } from 'node:fs'
import { platform } from 'node:process'
import { node as execaNode } from 'execa'

import { Notifier } from './notifier'
import ExtConfig from './utilities/config'
import type { AdonisProject } from '../types/projects'

interface ExecOptions {
  adonisProject: AdonisProject
  command: string
  background?: boolean
}

export class AceExecutor {
  static #isWindows = platform === 'win32'
  static #shellPath = AceExecutor.#isWindows ? 'cmd.exe' : undefined

  /**
   * Ensure that node_modules are installed in the project
   */
  static #hasNodeModules(adonisProject: AdonisProject) {
    const hasNodeModules = existsSync(`${adonisProject.path}/node_modules`)
    return hasNodeModules
  }

  /**
   * Execute a command in the foreground, in the VSCode integrated terminal
   */
  static #sendTextToAdonisTerminal(command: string) {
    let terminal = window.terminals.find((openedTerminal) => openedTerminal.name === 'AdonisJS Ace')

    if (!terminal) {
      terminal = window.createTerminal(`AdonisJS Ace`, this.#shellPath)
    }

    terminal.show()
    terminal.sendText(command)
  }

  /**
   * Execute a `node ace x` command
   */
  static async exec({ adonisProject, command, background = true }: ExecOptions) {
    if (!this.#hasNodeModules(adonisProject)) {
      Notifier.showWarning(
        'Node modules seems to be missing in your project. Make sure to install your dependencies before using the extension.'
      )
      return { result: undefined, adonisProject }
    }

    let path = adonisProject.path
    if (this.#isWindows && path.startsWith('/')) {
      path = path.substring(1)
    }

    if (background) {
      const result = await execaNode(`ace`, command.split(' '), {
        cwd: path,
        nodePath: ExtConfig.misc.nodePath,
      })

      return { result, adonisProject }
    }

    /**
     * Execute the final command in the background
     */
    const nodePath = ExtConfig.misc.nodePath || 'node'
    command = `"${nodePath}" ace ${command}`

    /**
     * Since we are in the integrated terminal, we need to
     * manually set the cwd to the adonis project path
     */
    const cmdWithCd =
      platform === 'win32' && !ExtConfig.misc.useUnixCd
        ? `cd /d "${path}" && ${command}`
        : `cd "${path}" && ${command}`

    this.#sendTextToAdonisTerminal(cmdWithCd)

    return { adonisProject }
  }
}
