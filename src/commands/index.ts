import { Command } from './make/Command'
import { Controller } from './make/Controller'
import { Exception } from './make/Exception'
import { Middleware } from './make/Middleware'
import { Migration } from './make/Migration'
import { Model } from './make/Model'
import { Seeder } from './make/Seeder'
import { View } from './make/View'
import { Validator } from './make/Validator'
import { PreloadedFile } from './make/PreloadedFile'
import { Fresh } from './migration/Fresh'
import { Refresh } from './migration/Refresh'
import { Reset } from './migration/Reset'
import { Configure } from './configure'
import { TypeCheck } from './type-check'
import { Manifest } from './generate/Manifest'
import { RouteList } from './list/Routes'
import { Test } from './make/Test'

import { ExtensionContext, commands } from 'vscode'

export const registerAceCommands = (context: ExtensionContext) => {
  const extName = 'adonis-vscode-extension'
  const registerCommand = commands.registerCommand

  /**
   * Register make:* commands
   */
  context.subscriptions.push(
    registerCommand(`${extName}.make.command`, () => Command.run()),
    registerCommand(`${extName}.make.controller`, () => Controller.run()),
    registerCommand(`${extName}.make.exception`, () => Exception.run()),
    registerCommand(`${extName}.make.middleware`, () => Middleware.run()),
    registerCommand(`${extName}.make.migration`, () => Migration.run()),
    registerCommand(`${extName}.make.model`, () => Model.run()),
    registerCommand(`${extName}.make.seeder`, () => Seeder.run()),
    registerCommand(`${extName}.make.view`, () => View.run()),
    registerCommand(`${extName}.make.validator`, () => Validator.run()),
    registerCommand(`${extName}.make.prldfile`, () => PreloadedFile.run()),
    registerCommand(`${extName}.make.test`, () => Test.run())
  )

  /**
   * Register migration:* commands
   */
  context.subscriptions.push(
    registerCommand(`${extName}.migration.fresh`, () => Fresh.run()),
    registerCommand(`${extName}.migration.refresh`, () => Refresh.run()),
    registerCommand(`${extName}.migration.reset`, () => Reset.run())
  )

  /**
   * Register misc commands
   */
  context.subscriptions.push(
    registerCommand(`${extName}.generate.manifest`, () => Manifest.run()),
    registerCommand(`${extName}.configure`, () => Configure.run()),
    registerCommand(`${extName}.type-check`, () => TypeCheck.run()),
    registerCommand(`${extName}.list.routes`, () => RouteList.run())
  )
}
