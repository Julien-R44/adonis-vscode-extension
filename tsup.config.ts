import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  external: ['vscode', 'typescript'],
  format: ['cjs'],
  shims: false,
  noExternal: [
    '@poppinss/module-methods-extractor',
    'docblock',
    'fast-glob',
    'lodash.groupby',
    'vscode-ext-help-and-feedback-view',
    'vscode-html-languageservice',
    'vscode-languageserver-types',
  ],
})
