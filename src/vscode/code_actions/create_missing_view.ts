import { CodeAction, CodeActionKind, WorkspaceEdit, languages } from 'vscode'
import ProjectManager from '../project_manager'
import type {
  CodeActionContext,
  CodeActionProvider,
  Command,
  ProviderResult,
  Range,
  Selection,
  TextDocument,
} from 'vscode'

/**
 * Search for Diagnostic with code `missing-view` and
 * create a CodeAction that will create the missing view
 */
export class CreateMissingViewAction implements CodeActionProvider {
  /**
   * On which documents this CodeAction should be available
   */
  static documentSelector = [{ language: 'typescript', schema: 'file' }]

  /**
   * Register the CodeAction provider
   */
  static register() {
    languages.registerCodeActionsProvider(this.documentSelector, new CreateMissingViewAction(), {
      providedCodeActionKinds: [CodeActionKind.QuickFix],
    })
  }

  provideCodeActions(
    document: TextDocument,
    range: Range | Selection,
    context: CodeActionContext
  ): ProviderResult<(CodeAction | Command)[]> {
    const matchingDiagnostic = context.diagnostics.find((diagnostic) =>
      diagnostic.range.intersection(range)
    )

    if (!matchingDiagnostic || matchingDiagnostic.code !== 'adonisjs.missing-view') return

    const fix = new CodeAction('Create missing View', CodeActionKind.QuickFix)
    fix.diagnostics = [matchingDiagnostic]

    fix.edit = new WorkspaceEdit()

    const viewName = document.getText(matchingDiagnostic.range)
    const project = ProjectManager.getProjectFromFile(document.uri.fsPath)

    fix.command = {
      command: 'adonis-vscode-extension.make.view',
      title: 'Create missing View',
      arguments: [viewName, project],
    }

    return [fix]
  }
}
