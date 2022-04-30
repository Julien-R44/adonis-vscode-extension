import * as path from 'path'
import { downloadAndUnzipVSCode, runTests } from '@vscode/test-electron'

async function main() {
  try {
    const workspacePath = path.resolve(__dirname, '../../../src/test/fixtures/basic-app')
    const extensionDevelopmentPath = path.resolve(__dirname, '../../')
    const extensionTestsPath = path.resolve(__dirname, './index')

    const vscodeExecutablePath = await downloadAndUnzipVSCode('1.66.0')

    // @ts-ignore
    process.env.FORCE_COLOR = true

    await runTests({
      launchArgs: [workspacePath, '--disable-extensions'],
      vscodeExecutablePath,
      extensionDevelopmentPath,
      extensionTestsPath,
    })
  } catch (err) {
    console.error('Failed to run tests')
    process.exit(1)
  }
}

main()
