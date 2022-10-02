<div align="center">
  <img width="650px" src="https://i.imgur.com/bUsqL2V.png" />
  <h2>💻 Official AdonisJS extension for VSCode</h2>

  <p align="center">
    <a href="https://github.com/Julien-R44/adonis-vscode-extension/actions/workflows/test.yml">
      <img src="https://img.shields.io/github/workflow/status/julien-r44/adonis-vscode-extension/test?label=%20&logo=github&style=flat-square&logoColor=white&color=5A45FF">
    </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=jripouteau.adonis-vscode-extension">
      <img src="https://vsmarketplacebadge.apphb.com/version-short/jripouteau.adonis-vscode-extension.svg?label=%20&style=flat-square&color=5A45FF">
    </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=jripouteau.adonis-vscode-extension">
      <img src="https://vsmarketplacebadge.apphb.com/installs-short/jripouteau.adonis-vscode-extension.svg?label=%20&style=flat-square&color=5A45FF">
    </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=jripouteau.adonis-vscode-extension">
      <img src="https://vsmarketplacebadge.apphb.com/rating-short/jripouteau.adonis-vscode-extension.svg?label=%20&style=flat-square&color=5A45FF">
    </a>
    <br>
  </p>

</div>

# Features
* Use all Adonis Assembler commands ( make:\* )
* Migrate and seed your database ( db:\*, migration:\* )
* Run your commands from the Activity Bar just by clicking
* View your routes within VSCode
* Open and see docs within VSCode
* .adonisrc.json file validation with JSON Schema
* Edge Support, syntax highlighting + formatting
* Multiple Workspaces and Monorepos support 
* Edge and AdonisJS Snippets
* Go To Controller 
* Go To View

> **Note**: I recommend you to take a look at the Japa extension for an even better experience:
>
> https://github.com/Julien-R44/japa-vscode

## Ace commands
Launch `ace` commands directly from VScode. 
Files created by adonis/assembler are automatically opened after their creation.

![](https://i.imgur.com/BEb6Xpc.gif)

## ActivityBar and Tree Views
Run your commands without typing anything, See your routes and go to its code just by clicking on the items in the Activity Bar.

![](https://i.imgur.com/fwOdNWF.gif)

## List Routes
List all routes in your project from VSCode and filter them.

![](https://i.imgur.com/WEr7s5K.png)

## Documentations
Consult and search the Adonis and Japa documentation directly from VSCode.

![](https://i.imgur.com/kMjBvdh.png)

## JSON Schema for .adonisrc
![](https://i.imgur.com/6K5wnvE.gif)

## Route controller completion + Go To
Autocompletion for the name and the handler of controllers. <kbd>Ctrl</kbd> + <kbd>Click</kbd> to open the file. Hovering the handler will show its documentation.

![](https://i.imgur.com/ZvnOtN3.gif)

## Edge support
Syntax highlighting, auto-completion of tags including partials, components, layouts. <kbd>Ctrl</kbd> + <kbd>Click</kbd> to open an included file.
**No automatic formatting for the moment.**

![](https://i.imgur.com/eDYb9fK.gif)

## Snippets
Snippets for Edge and AdonisJS are defined, take a look [here](./snippets/) to see the list of snippets.

_Since I'm not a big snippet user, feel free to propose a PR with snippets you think are useful._


# Configuration

- `nodePath`: The path to the node executable.
- `useUnixCd`: Use Unix-style `cd` for windows terminals (Useful when using Cygwin or Git Bash)
- `quickJump`: Enable quick jump by using <kbd>Ctrl</kbd> + <kbd>Click</kbd>
- `runMigrationInBackground`: Run migration/seeds commands in background. By default, they are executed in the built-in terminal of VSCode so that you can see the output.

# Known Issues
Below is the list of unsupported features (for the moment) by the extension, feel free to make a PR if you'd like to contribute to the project: 
- Edge Links Provider for [Component as tags](https://docs.adonisjs.com/guides/views/components#components-as-tags)
- Edge Links Provider for `@includeIf` tag

## IntelliSense while typing
In the context of controller and view autocompletion, we are inside strings. By default, VSCode totally disables the display of IntelliSense suggestions inside strings. If you want to see the autocompletion of your controllers and views, you will have to press <kbd>Ctrl</kbd> + <kbd>Space</kbd> to manually trigger IntelliSense.

If you want the suggestions while typing, you can add this to your VSCode settings:

```json
"editor.quickSuggestions": {
  "other": "off",
  "comments": "off",
  "strings": "on" 👈 // This
}
```

But be warned, this will automatically display intellisense even in "traditional" strings

## Emmet doesn't work in Edge files

Just add this in your VSCode settings: 
```json
"emmet.includeLanguages": {
  "edge": "html"
}
```

# Contributing
* See [contributing guide](./.github/CONTRIBUTING.md)
* Clone the project and open it in VSCode
* Run `npm install`
* Press `F5` to open a new VSCode window with your extensions loaded.
* You can relaunch the extension from the debug toolbar after changing code in `src/extension.ts`.
* You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.
