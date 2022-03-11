import { ExtensionContext, commands, workspace } from 'vscode';
import * as Commands from './commands';

export function activate(context: ExtensionContext) {
	const extName = 'adonis-vscode-ace';

	/**
	 * Register make:* commands
	 */
	const ctxSubs = context.subscriptions;
	ctxSubs.push(commands.registerCommand(`${extName}.make.command`, () => Commands.Command.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.controller`, () => Commands.Controller.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.exception`, () => Commands.Exception.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.middleware`, () => Commands.Middleware.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.migration`, () => Commands.Migration.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.model`, () => Commands.Model.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.seeder`, () => Commands.Seeder.run()));
  ctxSubs.push(commands.registerCommand(`${extName}.make.view`, () => Commands.View.run()));
  ctxSubs.push(commands.registerCommand(`${extName}.make.validator`, () => Commands.Validator.run()));

  /**
   * Register migration:* commands
   */
  ctxSubs.push(commands.registerCommand(`${extName}.migration.fresh`, () => Commands.Fresh.run()));
  ctxSubs.push(commands.registerCommand(`${extName}.migration.refresh`, () => Commands.Refresh.run()));
  ctxSubs.push(commands.registerCommand(`${extName}.migration.reset`, () => Commands.Reset.run()));

  /**
   * Register misc commands
   */
  ctxSubs.push(commands.registerCommand(`${extName}.generate.manifest`, () => Commands.Manifest.run()));
  ctxSubs.push(commands.registerCommand(`${extName}.configure`, () => Commands.Configure.run()));
  ctxSubs.push(commands.registerCommand(`${extName}.type-check`, () => Commands.TypeCheck.run()));
}

export function deactivate() { }
