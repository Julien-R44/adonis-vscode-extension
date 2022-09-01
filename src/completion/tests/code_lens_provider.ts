import { basename } from 'path'
import { Range } from 'vscode'
import { EXTENSION_NAME } from '../../utilities/constants'
import ConfigWrapper from '../../utilities/config'
import { TestsExtractor } from '../../services/tests_extractor'
import type {
  CancellationToken,
  CodeLens,
  CodeLensProvider,
  ProviderResult,
  TextDocument,
} from 'vscode'

export class TestsCodeLensProvider implements CodeLensProvider {
  /**
   * Build a CodeLens for the given parameters.
   */
  private buildCodeLens(options: {
    line: number
    title: string
    commandArguments?: string[]
    filename: string
  }) {
    const codeLensLine = Math.min(options.line - 1, 0)
    const baseCommandArguments = [
      ConfigWrapper.tests?.watchMode ? '--watch' : '',
      `--files "${basename(options.filename)}"`,
    ]

    return {
      range: new Range(codeLensLine, 0, codeLensLine, 0),
      isResolved: true,
      command: {
        command: `${EXTENSION_NAME}.test`,
        title: options.title,
        arguments: [
          { arguments: baseCommandArguments.concat(options.commandArguments || []).join(' ') },
        ],
      },
    }
  }

  /**
   * Provide CodeLens for each test in the file.
   */
  public provideCodeLenses(
    document: TextDocument,
    _token: CancellationToken
  ): ProviderResult<CodeLens[]> {
    const { tests, groups } = new TestsExtractor().extract(document.getText())
    const testsCodeLenses = [...tests, ...groups.flatMap((group) => group.tests)].map((test) =>
      this.buildCodeLens({
        line: test.location.start.line,
        title: `Run test ${test.title}`,
        commandArguments: [`--tests ${test.title}`],
        filename: document.fileName,
      })
    )

    return [
      ...testsCodeLenses,
      this.buildCodeLens({
        line: 0,
        title: 'Run tests for this file',
        filename: document.fileName,
      }),
    ]
  }
}
