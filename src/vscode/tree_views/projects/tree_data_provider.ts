import {
  EventEmitter,
  type ProviderResult,
  ThemeColor,
  ThemeIcon,
  type TreeDataProvider,
  type TreeItem,
  TreeItemCollapsibleState,
} from 'vscode'

import ProjectManager from '../../project_manager'

/**
 * Display a TreeView with all Adonis Projects in the current workspace.
 * Allow to switch current project. All other views are updated when the current project changes.
 */
export class ProjectsTreeDataProvider implements TreeDataProvider<any> {
  #onDidChangeTreeData = new EventEmitter<any>()
  readonly onDidChangeTreeData = this.#onDidChangeTreeData.event

  constructor() {
    ProjectManager.onDidChangeProject(() => this.#onDidChangeTreeData.fire(null))
  }

  getTreeItem(element: any): TreeItem | Thenable<TreeItem> {
    const isCurrentProject = ProjectManager.isCurrentProject(element.project)

    let color
    let icon = 'circle-large-outline'
    if (isCurrentProject) {
      color = new ThemeColor('charts.purple')
      icon = 'pass-filled'
    }

    return {
      collapsibleState: TreeItemCollapsibleState.None,
      label: element.label,
      description: element.description,
      iconPath: new ThemeIcon(icon, color),
      contextValue: 'project',
      command: {
        command: 'adonis-vscode-extension.pickProject',
        title: 'Select project',
        arguments: [element.project],
        tooltip: 'Select project',
      },
    }
  }

  getChildren(element?: any): ProviderResult<any[]> {
    if (element) {
      return []
    }

    return ProjectManager.getProjects().map((project) => ({
      label: project.name,
      project,
      description: ProjectManager.getShortPath(project),
      icon: 'folder',
    }))
  }
}
