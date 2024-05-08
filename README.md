<div align="center">
  <img width="650px" src="https://i.imgur.com/bUsqL2V.png" />
  <h2>💻 Official AdonisJS extension for VSCode</h2>
</div>

# Features
* Command palette for Ace
* Use all Adonis Assembler commands ( make:\* )
* Migrate and seed your database ( db:\*, migration:\* )
* Run your commands from the Activity Bar
* View your routes within VSCode
* Open and see docs within VSCode
* .adonisrc.json file validation with JSON Schema
* Multiple Workspaces and Monorepos support 
* Inertia.js support
* Go To Controller 

> [!NOTE]
> Make sure to also download [Edge](https://marketplace.visualstudio.com/items?itemName=AdonisJS.vscode-edge) and [Japa](https://marketplace.visualstudio.com/items?itemName=jripouteau.japa-vscode) extension for a better experience !

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

# Configuration

- `nodePath`: The path to the node executable.
- `useUnixCd`: Use Unix-style `cd` for windows terminals (Useful when using Cygwin or Git Bash)
- `quickJump`: Enable quick jump by using <kbd>Ctrl</kbd> + <kbd>Click</kbd>
- `runMigrationInBackground`: Run migration/seeds commands in background. By default, they are executed in the built-in terminal of VSCode so that you can see the output.
- `pagesDirectory` : The directory where your Inertia.js pages are located. Default is `inertia/pages`

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

# Contributing
* See [contributing guide](./.github/CONTRIBUTING.md)
* Clone the project and open it in VSCode
* Run `npm install`
* Press `F5` to open a new VSCode window with your extensions loaded.
* You can relaunch the extension from the debug toolbar after changing code in `src/extension.ts`.
* You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window with your extension to load your changes.

## Sponsors

If you like this project, [please consider supporting it by sponsoring it](https://github.com/sponsors/Julien-R44/). It will help a lot to maintain and improve it. Thanks a lot !

![](https://github.com/julien-r44/static/blob/main/sponsorkit/sponsors.png?raw=true)
