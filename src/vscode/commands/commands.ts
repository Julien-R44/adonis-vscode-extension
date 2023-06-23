import * as vscode from 'vscode'
import ExtConfig from '../utilities/config'
import { Command } from './make/command'
import { Controller } from './make/controller'
import { Exception } from './make/exception'
import { Middleware } from './make/middleware'
import { Migration } from './make/migration'
import { Model } from './make/model'
import { Seeder } from './make/seeder'
import { View } from './make/view'
import { Validator } from './make/validator'
import { PreloadedFile } from './make/preloaded_file'
import { Fresh } from './migration/fresh'
import { Refresh } from './migration/refresh'
import { Reset } from './migration/reset'
import { Configure } from './configure'
import { TypeCheck } from './type_check'
import { Manifest } from './generate/manifest'
import { RouteList } from './list/routes'
import { Test } from './make/test'
import { RunTests } from './run_tests'
import { Run } from './migration/run'
import { Rollback } from './migration/rollback'
import { Suite } from './make/suite'
import { Factory } from './make/factory'
import { Policy } from './make/policy'
import { Serve } from './serve'
import { RunCustomCommand } from './custom'
import { Seed } from './database/seed'
import { Wipe } from './database/wipe'
import { Mailer } from './make/mailer'
import type { CommandNode } from '../../types/index.js'

export const commands = [
  {
    groupName: 'Make',
    description: 'Create new files',
    icon: 'new-file',
    children: [
      {
        aceCommand: 'make:command',
        description: 'Make a new ace command',
        commandIdentifier: ExtConfig.buildCommandId(`make.command`),
        handler: () => Command.run(),
      },
      {
        aceCommand: 'make:controller',
        description: 'Make a new HTTP controller',
        commandIdentifier: ExtConfig.buildCommandId(`make.controller`),
        handler: () => Controller.run(),
      },
      {
        aceCommand: 'make:exception',
        description: 'Make a new exception',
        commandIdentifier: ExtConfig.buildCommandId(`make.exception`),
        handler: () => Exception.run(),
      },
      {
        aceCommand: 'make:middleware',
        description: 'Make a new middleware',
        commandIdentifier: ExtConfig.buildCommandId(`make.middleware`),
        handler: () => Middleware.run(),
      },
      {
        aceCommand: 'make:migration',
        description: 'Make a new migration',
        commandIdentifier: ExtConfig.buildCommandId(`make.migration`),
        handler: () => Migration.run(),
      },
      {
        aceCommand: 'make:model',
        description: 'Make a new model',
        commandIdentifier: ExtConfig.buildCommandId(`make.model`),
        handler: () => Model.run(),
      },
      {
        aceCommand: 'make:seeder',
        description: 'Make a new seeder',
        commandIdentifier: ExtConfig.buildCommandId(`make.seeder`),
        handler: () => Seeder.run(),
      },
      {
        aceCommand: 'make:view',
        description: 'Make a new view',
        commandIdentifier: ExtConfig.buildCommandId(`make.view`),
        handler: View.run.bind(View),
      },
      {
        aceCommand: 'make:validator',
        description: 'Make a new validator',
        commandIdentifier: ExtConfig.buildCommandId(`make.validator`),
        handler: () => Validator.run(),
      },
      {
        aceCommand: 'make:prldfile',
        description: 'Make a new preloaded file',
        commandIdentifier: ExtConfig.buildCommandId(`make.prldfile`),
        handler: () => PreloadedFile.run(),
      },
      {
        aceCommand: 'make:test',
        description: 'Make a new test',
        commandIdentifier: ExtConfig.buildCommandId(`make.test`),
        handler: () => Test.run(),
      },
      {
        aceCommand: 'make:suite',
        description: 'Make a new test suite',
        commandIdentifier: ExtConfig.buildCommandId(`make.suite`),
        handler: () => Suite.run(),
      },
      {
        aceCommand: 'make:factory',
        description: 'Make a new factory',
        commandIdentifier: ExtConfig.buildCommandId(`make.factory`),
        handler: () => Factory.run(),
      },
      {
        aceCommand: 'make:policy',
        description: 'Make a new bouncer policy',
        commandIdentifier: ExtConfig.buildCommandId(`make.policy`),
        handler: () => Policy.run(),
      },
      {
        aceCommand: 'make:mailer',
        description: 'Make a new mailer',
        commandIdentifier: ExtConfig.buildCommandId(`make.mailer`),
        handler: () => Mailer.run(),
      },
    ],
  },
  {
    groupName: 'Migration & Database',
    description: 'Manage database migrations',
    icon: 'database',
    children: [
      {
        aceCommand: 'migration:fresh',
        description: 'Drop all tables and re-migrate the database',
        commandIdentifier: ExtConfig.buildCommandId(`migration.fresh`),
        handler: () => Fresh.run(),
      },
      {
        aceCommand: 'migration:refresh',
        description: 'Rollback and migrate database',
        commandIdentifier: ExtConfig.buildCommandId(`migration.refresh`),
        handler: () => Refresh.run(),
      },
      {
        aceCommand: 'migration:reset',
        description: 'Rollback all migrations',
        commandIdentifier: ExtConfig.buildCommandId(`migration.reset`),
        handler: () => Reset.run(),
      },
      {
        aceCommand: 'migration:run',
        description: 'Migrate database by running pending migrations',
        commandIdentifier: ExtConfig.buildCommandId(`migration.run`),
        handler: () => Run.run(),
      },
      {
        aceCommand: 'migration:rollback',
        description: 'Rollback migrations to a specific batch number',
        commandIdentifier: ExtConfig.buildCommandId(`migration.rollback`),
        handler: () => Rollback.run(),
      },
      {
        aceCommand: 'db:seed',
        description: 'Execute database seeders',
        commandIdentifier: ExtConfig.buildCommandId(`db.seed`),
        handler: () => Seed.run(),
      },
      {
        aceCommand: 'db:wipe',
        description: 'Drop all tables, views and types in database',
        commandIdentifier: ExtConfig.buildCommandId(`db.wipe`),
        handler: () => Wipe.run(),
      },
    ],
  },
  {
    groupName: 'Misc.',
    icon: 'symbol-misc',
    description: 'Miscellaneous commands',
    children: [
      {
        aceCommand: '__custom',
        description: 'Run a custom command',
        commandIdentifier: ExtConfig.buildCommandId(`run-custom-command`),
        handler: RunCustomCommand.run.bind(RunCustomCommand),
        hiddenFromTreeView: true,
      },
      {
        aceCommand: '__custom',
        description: 'Run a command',
        commandIdentifier: ExtConfig.buildCommandId(`run-command`),
        handler: (command: CommandNode) => {
          vscode.commands.executeCommand(
            command.commandIdentifier,
            ...(command.commandArguments || [])
          )
        },
        hiddenFromTreeView: true,
      },
      {
        aceCommand: 'serve',
        description:
          'Start the AdonisJS HTTP server, along with the file watcher. Also starts the webpack dev server when webpack encore is installed',
        commandIdentifier: ExtConfig.buildCommandId(`serve`),
        handler: () => Serve.run(),
      },
      {
        aceCommand: 'generate:manifest',
        description: 'Generate ace commands manifest file. Manifest file speeds up commands lookup',
        commandIdentifier: ExtConfig.buildCommandId(`generate.manifest`),
        handler: () => Manifest.run(),
      },
      {
        aceCommand: 'configure [invoke]',
        description: 'Configure one or more AdonisJS packages',
        commandIdentifier: ExtConfig.buildCommandId(`configure`),
        handler: () => Configure.run(),
      },
      {
        aceCommand: 'type-check',
        description: 'Type check TypeScript source without writing the compiled output on disk',
        commandIdentifier: ExtConfig.buildCommandId(`type-check`),
        handler: () => TypeCheck.run(),
      },
      {
        aceCommand: 'list:routes',
        description: 'List application routes',
        commandIdentifier: ExtConfig.buildCommandId(`list.routes`),
        handler: () => RouteList.run(),
      },
      {
        aceCommand: 'test',
        description: 'Run AdonisJS tests',
        commandIdentifier: ExtConfig.buildCommandId(`test`),
        handler: RunTests.run.bind(RunTests),
      },
    ],
  },
]
