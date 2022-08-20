import { platform } from 'process'
import { exec as baseExec } from 'child_process'
import { promisify } from 'util'
import ConfigWrapper from 'src/utilities/config'
import { window } from 'vscode'
import type { AdonisProject } from 'src/contracts'

const exec = promisify(baseExec)

interface ExecOptions {
  adonisProject: AdonisProject
  command: string
  background?: boolean
}

export class AceExecutor {
  /**
   * Execute a command in the foreground, in the VSCode integrated terminal
   */
  protected static sendTextToAdonisTerminal(command: string) {
    let terminal = window.terminals.find((openedTerminal) => openedTerminal.name === 'AdonisJS Ace')

    if (!terminal) {
      terminal = window.createTerminal(`AdonisJS Ace`)
    }

    terminal.show()
    terminal.sendText(command)
  }

  /**
   * Execute a `node ace x` command
   */
  public static async exec({ adonisProject, command, background = true }: ExecOptions) {
    const isWindows = platform === 'win32'
    if (isWindows && adonisProject.path.startsWith('/')) {
      adonisProject.path = adonisProject.path.substring(1)
    }

    /**
     * Execute the final command in the background
     */
    const nodePath = ConfigWrapper.misc.nodePath || 'node'
    command = `"${nodePath}" ace ${command}`
    if (background) {
      const result = await exec(command, { cwd: adonisProject.path })
      return { result, adonisProject }
    }

    /**
     * Since we are in the integrated terminal, we need to
     * manually set the cwd to the adonis project path
     */
    const cmdWithCd =
      platform === 'win32' && !ConfigWrapper.misc.useUnixCd
        ? `cd /d "${adonisProject.path}" && ${command}`
        : `cd "${adonisProject.path}" && ${command}`

    this.sendTextToAdonisTerminal(cmdWithCd)

    return { adonisProject }
  }
}
