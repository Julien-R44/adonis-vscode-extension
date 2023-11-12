import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  external: ['vscode'],
  format: ['cjs'],
  shims: false,
  noExternal: [
    'execa',
    'dedent',
    'docblock',
    'fast-glob',
    'slash',
    'common-path-prefix',
    '@julr/module-methods-extractor',
    'lodash.groupby',
    'vscode-ext-help-and-feedback-view',
    "@babel/parser",
    "@babel/traverse",
  ],
})
