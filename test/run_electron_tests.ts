import { resolve } from 'node:path'
import { downloadAndUnzipVSCode, runTests } from '@vscode/test-electron'

async function main() {
  try {
    const workspacePath = resolve(__dirname, '../../test/fixtures/basic-app')

    const extensionDevelopmentPath = resolve(__dirname, '../../')
    const extensionTestsPath = resolve(__dirname, './japa_electron')

    const vscodeExecutablePath = await downloadAndUnzipVSCode('1.66.0')

    process.env.FORCE_COLOR = 'true'

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
