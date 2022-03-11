import { window, workspace } from 'vscode';
import { platform } from 'process';
import { promisify } from 'util';
import { exec as baseExec } from 'child_process';
const exec = promisify(baseExec);

export default class BaseCommand {

  /**
   * Show a message to the user
   */
  protected static async showMessage(message: string) {
    window.showInformationMessage(message);
  }

  /**
   * Show an error message to the user
   */
  protected static async showError(message: string, consoleErr: any = null) {
    if (consoleErr !== null) {
      message += ' (See output console for more details)';
      console.error(consoleErr + ' (See output console for more details)');
    }
    window.showErrorMessage(message);
    return false;
  }

  /**
   * Prompt the user to select Yes or No
   */
  protected static async getYesNo(placeHolder: string): Promise<boolean> {
    let value = await window.showQuickPick(['Yes', 'No'], { placeHolder });
    return value?.toLowerCase() === 'yes' ? true : false;
  }

  /**
   * Prompt the user for an input
   */
  protected static async getInput(placeHolder: string) {
    let name = await window.showInputBox({ placeHolder: placeHolder.replace(/\s\s+/g, ' ').trim() });
    name = name === undefined ? '' : name;
    return name;
  }

  /**
   * Returns the path to ace location
   *
   * TODO: Support multi-workspaces ? Custom path config ?
   */
  protected static getAcePath(): string {
    return workspace.workspaceFolders![0].uri.path;
  }

  /**
   * Execute the final `node ace x` command
   */
  protected static async execCmd(command: string, background: boolean = true) {
    let acePath = this.getAcePath();

    /**
     * If we are on windows, we need the remove the first slash
     */
    const isWindows = platform === 'win32';
    if (isWindows && acePath.startsWith('/')) {
      acePath = acePath.substring(1);
    }

    /**
     * Create the final command : cd {acePath} && node ace {cmd}
     */
    command = `node ace ${command}`;
    let cmd = platform === 'win32' ? `cd /d "${acePath}" && ${command}` : `cd "${acePath}" && ${command}`;

    /**
     * Execute the final command either in the background or not
     * by creating a new VSCode terminal and showing it
     */
    if (background) {
      return exec(cmd);
    }

    const terminal = window.createTerminal(`AdonisJS Ace`);
    terminal.show();
    terminal.sendText(cmd);

    return ;
  }
}
