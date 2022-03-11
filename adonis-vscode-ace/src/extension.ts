import { ExtensionContext, commands, workspace } from 'vscode';
import { Command } from './commands/make/Command';
import { Controller } from './commands/make/Controller';
import { Exception } from './commands/make/Exception';
import { Middleware } from './commands/make/Middleware';
import { Fresh } from './commands/migration/Fresh';

export function activate(context: ExtensionContext) {

	const extName = 'adonis-vscode-ace';

  console.log('activate')
	/**
	 * Register make:* commands
	 */
	const ctxSubs = context.subscriptions;
	ctxSubs.push(commands.registerCommand(`${extName}.make.command`, () => Command.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.controller`, () => Controller.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.exception`, () => Exception.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.middleware`, () => Middleware.run()));

  /**
   * Register migration:* commands
   */
  ctxSubs.push(commands.registerCommand(`${extName}.migration.fresh`, () => Fresh.run()));

}

export function deactivate() { }
