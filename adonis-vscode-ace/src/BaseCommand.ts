import { window, workspace } from 'vscode';
import { platform } from 'process';
import { resolve } from 'path';

import { promisify } from 'util';
import { exec as baseExec } from 'child_process';
const exec = promisify(baseExec);

export default class BaseCommand {
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
  protected static async getYesNo(placeHolder: string): Promise<Boolean> {
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
    return resolve(workspace.workspaceFolders![0].uri.path);
  }

  /**
   * Execute the final `node ace x` command
   */
  protected static async execCmd(command: string) {
    let acePath = this.getAcePath();

    command = `node ace ${command}`;
    let cmd = platform === 'win32' ? `cd "${acePath}" && ${command}` : `cd "${acePath}" && ${command}`;

    return exec(cmd);
  }
}