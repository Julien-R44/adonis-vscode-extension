import { assert } from '@japa/assert'
import { pathToFileURL } from 'node:url'
import { snapshot } from '@japa/snapshot'
import { fileSystem } from '@japa/file-system'
import { specReporter } from '@japa/spec-reporter'
import { configure, processCliArgs, run } from '@japa/runner'

import { BASE_URL } from '../test_helpers/index'

/*
|--------------------------------------------------------------------------
| Configure tests
|--------------------------------------------------------------------------
|
| The configure method accepts the configuration to configure the Japa
| tests runner.
|
| The first method call "processCliArgs" process the command line arguments
| and turns them into a config object. Using this method is not mandatory.
|
| Please consult japa.dev/runner-config for the config docs.
*/
configure({
  ...processCliArgs(process.argv.slice(2)),
  files: ['./test/suites/pure/**/*.test.ts'],
  plugins: [
    assert(),
    snapshot(),
    fileSystem({
      autoClean: true,
      basePath: BASE_URL,
    }),
  ],
  reporters: [specReporter()],
  importer: (filePath) => import(pathToFileURL(filePath).href),
})

/*
|--------------------------------------------------------------------------
| Run tests
|--------------------------------------------------------------------------
|
| The following "run" method is required to execute all the tests.
|
*/
run()
