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
import { RunTests } from './run-tests'
import { Run } from './migration/Run'
import { Rollback } from './migration/Rollback'

export const commands = [
  {
    groupName: 'Make',
    description: 'Create new files',
    icon: 'new-file',
    children: [
      {
        aceCommand: 'make:command',
        description: 'Make a new ace command',
        commandIdentifier: `make.command`,
        handler: () => Command.run(),
      },
      {
        aceCommand: 'make:controller',
        description: 'Make a new HTTP controller',
        commandIdentifier: `make.controller`,
        handler: () => Controller.run(),
      },
      {
        aceCommand: 'make:exception',
        description: 'Make a new exception',
        commandIdentifier: `make.exception`,
        handler: () => Exception.run(),
      },
      {
        aceCommand: 'make:middleware',
        description: 'Make a new middleware',
        commandIdentifier: `make.middleware`,
        handler: () => Middleware.run(),
      },
      {
        aceCommand: 'make:migration',
        description: 'Make a new migration',
        commandIdentifier: `make.migration`,
        handler: () => Migration.run(),
      },
      {
        aceCommand: 'make:model',
        description: 'Make a new model',
        commandIdentifier: `make.model`,
        handler: () => Model.run(),
      },
      {
        aceCommand: 'make:seeder',
        description: 'Make a new seeder',
        commandIdentifier: `make.seeder`,
        handler: () => Seeder.run(),
      },
      {
        aceCommand: 'make:view',
        description: 'Make a new view',
        commandIdentifier: `make.view`,
        handler: () => View.run(),
      },
      {
        aceCommand: 'make:validator',
        description: 'Make a new validator',
        commandIdentifier: `make.validator`,
        handler: () => Validator.run(),
      },
      {
        aceCommand: 'make:prldfile',
        description: 'Make a new preloaded file',
        commandIdentifier: `make.prldfile`,
        handler: () => PreloadedFile.run(),
      },
      {
        aceCommand: 'make:test',
        description: 'Make a new test',
        commandIdentifier: `make.test`,
        handler: () => Test.run(),
      },
    ],
  },
  {
    groupName: 'Migration',
    description: 'Manage database migrations',
    icon: 'database',
    children: [
      {
        aceCommand: 'migration:fresh',
        description: 'Drop all tables and re-migrate the database',
        commandIdentifier: `migration.fresh`,
        handler: () => Fresh.run(),
      },
      {
        aceCommand: 'migration:refresh',
        description: 'Rollback and migrate database',
        commandIdentifier: `migration.refresh`,
        handler: () => Refresh.run(),
      },
      {
        aceCommand: 'migration:reset',
        description: 'Rollback all migrations',
        commandIdentifier: `migration.reset`,
        handler: () => Reset.run(),
      },
      {
        aceCommand: 'migration:run',
        description: 'Migrate database by running pending migrations',
        commandIdentifier: `migration.run`,
        handler: () => Run.run(),
      },
      {
        aceCommand: 'migration:rollback',
        description: 'Rollback migrations to a specific batch number',
        commandIdentifier: `migration.rollback`,
        handler: () => Rollback.run(),
      },
    ],
  },
  {
    groupName: 'Misc.',
    icon: 'symbol-misc',
    description: 'Miscellaneous commands',
    children: [
      {
        aceCommand: 'generate:manifest',
        description: 'Generate ace commands manifest file. Manifest file speeds up commands lookup',
        commandIdentifier: `generate.manifest`,
        handler: () => Manifest.run(),
      },
      {
        aceCommand: 'configure [invoke]',
        description: 'Configure one or more AdonisJS packages',
        commandIdentifier: `configure`,
        handler: () => Configure.run(),
      },
      {
        aceCommand: 'type-check',
        description: 'Type check TypeScript source without writing the compiled output on disk',
        commandIdentifier: `type-check`,
        handler: () => TypeCheck.run(),
      },
      {
        aceCommand: 'list:routes',
        description: 'List application routes',
        commandIdentifier: `list.routes`,
        handler: () => RouteList.run(),
      },
      {
        aceCommand: 'test',
        description: 'Run AdonisJS tests',
        commandIdentifier: `test`,
        handler: () => RunTests.run(),
      },
    ],
  },
]
