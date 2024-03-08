import dedent from 'dedent'
import { window } from 'vscode'

export class Logger {
  static #channel = window.createOutputChannel('AdonisJS')

  static #baseLog(message: string) {
    const timestamp = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '').split(' ')[1]
    this.#channel.appendLine(`[${timestamp}] ${dedent(message)}`)
  }

  static info(message: string) {
    this.#baseLog(`[INFO] ${message}`)
  }

  static async error(message: string, err?: any, prompt = true) {
    if (!err) {
      this.#baseLog(`[ERROR] ${message}`)
      return
    }

    const errorMessage = err.message || err
    this.#baseLog(`[ERROR] ${message}\n${errorMessage}`)

    if (prompt && errorMessage) {
      const result = await window.showErrorMessage(
        `${message} ( See output console for more details )`,
        'Show output'
      )

      if (result === 'Show output') {
        this.showChannel()
      }
    }
  }

  static showChannel() {
    this.#channel.show()
  }

  static divider() {
    this.#channel.appendLine(`\n――――――――――――――\n`)
  }
}
