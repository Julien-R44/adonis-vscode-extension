import { ExtensionContext, commands, workspace } from 'vscode';
import { Command } from './commands/make/Command';
import { Controller } from './commands/make/Controller';
import { Exception } from './commands/make/Exception';
import { Middleware } from './commands/make/Middleware';
import { Migration } from './commands/make/Migration';
import { Model } from './commands/make/Model';
import { Seeder } from './commands/make/Seeder';
import { Fresh } from './commands/migration/Fresh';
import { Refresh } from './commands/migration/Refresh';
import { Reset } from './commands/migration/Reset';

export function activate(context: ExtensionContext) {
	const extName = 'adonis-vscode-ace';

	/**
	 * Register make:* commands
	 */
	const ctxSubs = context.subscriptions;
	ctxSubs.push(commands.registerCommand(`${extName}.make.command`, () => Command.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.controller`, () => Controller.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.exception`, () => Exception.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.middleware`, () => Middleware.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.migration`, () => Migration.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.model`, () => Model.run()));
	ctxSubs.push(commands.registerCommand(`${extName}.make.seeder`, () => Seeder.run()));

  /**
   * Register migration:* commands
   */
  ctxSubs.push(commands.registerCommand(`${extName}.migration.fresh`, () => Fresh.run()));
  ctxSubs.push(commands.registerCommand(`${extName}.migration.refresh`, () => Refresh.run()));
  ctxSubs.push(commands.registerCommand(`${extName}.migration.reset`, () => Reset.run()));

}

export function deactivate() { }
