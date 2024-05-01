import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  external: ['vscode', '#vscode/*', '#/*'],
  format: ['cjs'],
  shims: false,
})
