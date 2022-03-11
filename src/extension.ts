import { ExtensionContext, commands, workspace } from 'vscode';
import * as Commands from './commands';

export function activate(context: ExtensionContext) {
	const extName = 'adonis-vscode-ace';
  const registerCommand = commands.registerCommand;

	/**
	 * Register make:* commands
	 */
  context.subscriptions.push(...[
    registerCommand(`${extName}.make.command`, () => Commands.Command.run()),
    registerCommand(`${extName}.make.controller`, () => Commands.Controller.run()),
    registerCommand(`${extName}.make.exception`, () => Commands.Exception.run()),
    registerCommand(`${extName}.make.middleware`, () => Commands.Middleware.run()),
    registerCommand(`${extName}.make.migration`, () => Commands.Migration.run()),
    registerCommand(`${extName}.make.model`, () => Commands.Model.run()),
    registerCommand(`${extName}.make.seeder`, () => Commands.Seeder.run()),
    registerCommand(`${extName}.make.view`, () => Commands.View.run()),
    registerCommand(`${extName}.make.validator`, () => Commands.Validator.run()),
    registerCommand(`${extName}.make.prldfile`, () => Commands.PreloadedFile.run())
  ]);

  /**
   * Register migration:* commands
   */
  context.subscriptions.push(...[
    registerCommand(`${extName}.migration.fresh`, () => Commands.Fresh.run()),
    registerCommand(`${extName}.migration.refresh`, () => Commands.Refresh.run()),
    registerCommand(`${extName}.migration.reset`, () => Commands.Reset.run()),
  ]);

  /**
   * Register misc commands
   */
  context.subscriptions.push(...[
    registerCommand(`${extName}.generate.manifest`, () => Commands.Manifest.run()),
    registerCommand(`${extName}.configure`, () => Commands.Configure.run()),
    registerCommand(`${extName}.type-check`, () => Commands.TypeCheck.run())
  ]);
}

export function deactivate() { }
