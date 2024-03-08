import type { ExtensionContext } from 'vscode'
import type { Command, Link } from 'vscode-ext-help-and-feedback-view'
import { HelpAndFeedbackView } from 'vscode-ext-help-and-feedback-view'

export class HelpTreeDataView {
  static createView(context: ExtensionContext) {
    const items: (Link | Command)[] = []

    items.push(
      {
        icon: 'github',
        title: 'Report an issue on the extension',
        url: 'https://github.com/Julien-R44/adonis-vscode-extension/issues/new/choose',
      },
      {
        icon: 'question',
        title: 'Ask a question on GitHub Discussions',
        url: 'https://github.com/adonisjs/core/discussions',
      },
      {
        icon: 'organization',
        title: 'Join Discord community',
        url: 'https://discord.com/invite/vDcEjq6',
      },
      {
        icon: 'repo',
        title: 'Access the extension repo',
        url: 'https://github.com/Julien-R44/adonis-vscode-extension',
      },
      {
        icon: 'remote-explorer-documentation',
        title: 'See AdonisJS documentation',
        url: 'https://docs.adonisjs.com/',
      },
      {
        icon: 'remote-explorer-documentation',
        title: 'See Japa documentation',
        url: 'https://japa.dev/',
      },
      {
        icon: 'package',
        title: 'See AdonisJS packages',
        url: 'https://packages.adonisjs.com',
      },
      {
        icon: 'heart',
        title: 'Become a Sponsor',
        url: 'https://github.com/sponsors/Julien-R44',
      }
    )

    new HelpAndFeedbackView(context, 'adonisjs.help', items)
  }
}
