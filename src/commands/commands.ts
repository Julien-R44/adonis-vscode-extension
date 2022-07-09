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
import { Suite } from './make/Suite'
import { Factory } from './make/Factory'
import { Policy } from './make/Policy'
import { EXTENSION_NAME } from '../utilities/constants'

const buildIdentifier = (identifier: string) => EXTENSION_NAME + '.' + identifier

export const commands = [
  {
    groupName: 'Make',
    description: 'Create new files',
    icon: 'new-file',
    children: [
      {
        aceCommand: 'make:command',
        description: 'Make a new ace command',
        commandIdentifier: buildIdentifier(`make.command`),
        handler: () => Command.run(),
      },
      {
        aceCommand: 'make:controller',
        description: 'Make a new HTTP controller',
        commandIdentifier: buildIdentifier(`make.controller`),
        handler: () => Controller.run(),
      },
      {
        aceCommand: 'make:exception',
        description: 'Make a new exception',
        commandIdentifier: buildIdentifier(`make.exception`),
        handler: () => Exception.run(),
      },
      {
        aceCommand: 'make:middleware',
        description: 'Make a new middleware',
        commandIdentifier: buildIdentifier(`make.middleware`),
        handler: () => Middleware.run(),
      },
      {
        aceCommand: 'make:migration',
        description: 'Make a new migration',
        commandIdentifier: buildIdentifier(`make.migration`),
        handler: () => Migration.run(),
      },
      {
        aceCommand: 'make:model',
        description: 'Make a new model',
        commandIdentifier: buildIdentifier(`make.model`),
        handler: () => Model.run(),
      },
      {
        aceCommand: 'make:seeder',
        description: 'Make a new seeder',
        commandIdentifier: buildIdentifier(`make.seeder`),
        handler: () => Seeder.run(),
      },
      {
        aceCommand: 'make:view',
        description: 'Make a new view',
        commandIdentifier: buildIdentifier(`make.view`),
        handler: () => View.run(),
      },
      {
        aceCommand: 'make:validator',
        description: 'Make a new validator',
        commandIdentifier: buildIdentifier(`make.validator`),
        handler: () => Validator.run(),
      },
      {
        aceCommand: 'make:prldfile',
        description: 'Make a new preloaded file',
        commandIdentifier: buildIdentifier(`make.prldfile`),
        handler: () => PreloadedFile.run(),
      },
      {
        aceCommand: 'make:test',
        description: 'Make a new test',
        commandIdentifier: buildIdentifier(`make.test`),
        handler: () => Test.run(),
      },
      {
        aceCommand: 'make:suite',
        description: 'Make a new test suite',
        commandIdentifier: buildIdentifier(`make.suite`),
        handler: () => Suite.run(),
      },
      {
        aceCommand: 'make:factory',
        description: 'Make a new factory',
        commandIdentifier: buildIdentifier(`make.factory`),
        handler: () => Factory.run(),
      },
      {
        aceCommand: 'make:policy',
        description: 'Make a new bouncer policy',
        commandIdentifier: buildIdentifier(`make.policy`),
        handler: () => Policy.run(),
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
        commandIdentifier: buildIdentifier(`migration.fresh`),
        handler: () => Fresh.run(),
      },
      {
        aceCommand: 'migration:refresh',
        description: 'Rollback and migrate database',
        commandIdentifier: buildIdentifier(`migration.refresh`),
        handler: () => Refresh.run(),
      },
      {
        aceCommand: 'migration:reset',
        description: 'Rollback all migrations',
        commandIdentifier: buildIdentifier(`migration.reset`),
        handler: () => Reset.run(),
      },
      {
        aceCommand: 'migration:run',
        description: 'Migrate database by running pending migrations',
        commandIdentifier: buildIdentifier(`migration.run`),
        handler: () => Run.run(),
      },
      {
        aceCommand: 'migration:rollback',
        description: 'Rollback migrations to a specific batch number',
        commandIdentifier: buildIdentifier(`migration.rollback`),
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
        commandIdentifier: buildIdentifier(`generate.manifest`),
        handler: () => Manifest.run(),
      },
      {
        aceCommand: 'configure [invoke]',
        description: 'Configure one or more AdonisJS packages',
        commandIdentifier: buildIdentifier(`configure`),
        handler: () => Configure.run(),
      },
      {
        aceCommand: 'type-check',
        description: 'Type check TypeScript source without writing the compiled output on disk',
        commandIdentifier: buildIdentifier(`type-check`),
        handler: () => TypeCheck.run(),
      },
      {
        aceCommand: 'list:routes',
        description: 'List application routes',
        commandIdentifier: buildIdentifier(`list.routes`),
        handler: () => RouteList.run(),
      },
      {
        aceCommand: 'test',
        description: 'Run AdonisJS tests',
        commandIdentifier: buildIdentifier(`test`),
        handler: () => RunTests.run(),
      },
    ],
  },
]
