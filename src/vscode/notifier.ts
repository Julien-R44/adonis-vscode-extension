import { window } from 'vscode'

export class Notifier {
  static outputChannel = window.createOutputChannel('AdonisJS')

  static #buildMessage(message: string) {
    return `[AdonisJS] ${message}`
  }

  /**
   * Show a message to the user
   */
  static async showMessage(message: string) {
    return window.showInformationMessage(this.#buildMessage(message))
  }

  /**
   * Show a warning message to the user
   */
  static async showWarning(message: string) {
    return window.showWarningMessage(this.#buildMessage(message))
  }

  /**
   * Show an error message to the user
   */
  static async showError(message: string, consoleErr: any = null) {
    if (consoleErr !== null) {
      message += ' (See output console for more details)'
      this.outputChannel.appendLine(consoleErr)
      this.outputChannel.show()
    }
    window.showErrorMessage(message)
    return false
  }

  /**
   * Add error message to the output console
   */
  static async logError(message: string, consoleErr: any = null) {
    this.outputChannel.appendLine(message)
    if (consoleErr !== null) {
      this.outputChannel.appendLine(consoleErr)
    }
  }
}
