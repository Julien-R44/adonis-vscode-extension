# Change Log

## 1.1.12

- Fix bundling issue that prevented the extension from starting

## 1.1.11

This version remove all Edge related features :

Autocompletion for views/components in .edge and .ts files
Go to template on click on .edge and .ts files
Syntax highlighting + language configuration for Edge
Edge snippets
And others
We have ported all these features to the Edge standalone extension here:

https://marketplace.visualstudio.com/items?itemName=AdonisJS.vscode-edge

## 1.1.10

### Fixes

- Some edge tags were not recognised by the extension: `inject`, `let`, and `eval`.
- RC file parsing did not work when some property keys were defined using identifiers instead of string literals

## 1.1.9

For version 6, we'll allow users to define the rc file via an `adonisrc.ts` file. This means defining options via typescript rather than JSON

This release adds two things:

- Previously, to detect when to activate the extension, we relied on the presence of an `adonisrc.json` file. If this file was found, the folder was considered to be an Adonis project. Now, the `adonisrc.ts` file is also taken into account for that.
- We also parse the `adonisrc.ts` file using AST, in order to extract certain properties required for the extension to works correctly

## 1.1.8

- `@unless` was detected as an edge component 

## 1.1.7

- Added support for custom views directory. With Adonis projects, you can define a custom folder that will holds your template like : 
	```json
	{
	  "directories": {
	    "views": "templates"
	  },
	}
	```
	this is now handled by the extension. your links and autocompletion will work correctly

- Fixed bug that highlighted `@!section` and `@slot` as custom components

## 1.1.6

- Fix components-as-tags detection. Extension was detecting email litteral strings or even some TS decorators as components.
- Re-implement commands tree view that also works with Adonis 6
- Add a new "Open command file" in the commands tree view. An icon will be displayed next to each item that is a custom command and will allow you to open the related file

we should be feature-complete for the next stable release now. all we need to do now is fix the introduced bugs 

## 1.1.5  

- Added a new pretty TreeView that list all adonis projects in the current workspace. This allows to select one as a current active project. When one project is select, that means all tree views are now scoped to this project. For example, the routes tree view will only show routes for this project. Commands tree view will also only show commands for this project. Ace commands like `make:controller` will be executed on this project etc. 
![image](https://github.com/Julien-R44/adonis-vscode-extension/assets/8337858/9a3951e2-2395-4b35-85e1-5203915d7a68)


- Add "Create view" code action. If your code is referencing a missing view, then this code action will be proposed. It will create and open the missing view for you.

![createmissingview](https://github.com/Julien-R44/adonis-vscode-extension/assets/8337858/51c368a0-e94f-4755-be1f-6ad0104ae868)

- Now we are displaying a pretty welcome view when no Adonis project has been found in your workspace instead of displaying empty views.

![image](https://github.com/Julien-R44/adonis-vscode-extension/assets/8337858/16c20823-14b2-4525-9578-756aba0320af)

- Fixed a bug that caused the full absolute path of the open file to be displayed when clicking on a route in the treeview. This led to multiple duplicate entries in the editor history.


## 1.1.3

### Inertia support

Added Inertia support. So basically link provider + completion. Exactly as for edge templates. 

By default, the extension assumes that your inertia pages are located in `resources/js/pages/**/*`. If this is not the case, you can modify this with the `adonisjs.inertia.pagesDirectory` vscode config.

![image](https://github.com/Julien-R44/adonis-vscode-extension/assets/8337858/e0d75814-e08a-443c-826d-5bed530e684e)

### Component as tag support
Autocompletion + links wasn't supported before for [component as tags](https://docs.adonisjs.com/guides/views/components#components-as-tags). now it is! 

![image](https://github.com/Julien-R44/adonis-vscode-extension/assets/8337858/ea978d18-0533-4a8e-aa9c-eefbdcbd0377)

### Red wavy lines
For all link providers, i.e. inertia + controller strings + views in .edge or .ts. If your linked document is not found (which is probably an error on your part), a small red line is now displayed below it. Example:

![image](https://github.com/Julien-R44/adonis-vscode-extension/assets/8337858/64fe0ae5-442e-45be-a112-016fa16c26cd)

### `@end` wrongly parsed

Also fixed that little syntax highlighting bug in edge. the `@end` was never caught

## 1.1.0

This is a pre-release supporting AdonisJS 6. The update also maintains compatibility with AdonisJS 5.x. Given its pre-release status, you can probably expect few bugs.

This is a quite early pre-release, so I wouldn't recommend installing it just yet

### Configuration Changes
The following configuration options have been removed:

- All customizable regular expressions. Useless + added unnecessary complexity.
- Customizable extensions/directories. Same as above
- maxLinesCounts. Again same as above

### Code Refactoring
Significant code refactoring was done to make it dependency-free from vscode. Basically : if you write a file importing a 'vscode' module, you can't run it outside VSCode. That means it's making testing way more challenging and slow.

Now, much of the code is extracted into independent and "pure" modules that can be easily tested without vscode. This has allowed me to implement many more tests, and i am way more more confident in shipping next features.

With this substantial code update, some bugs may have slipped through. If you encounter any, please report them via an issue

### Removed Features
The various "hover providers" have been removed. These displayed data when hovering over a controller magic string for example. As they were not particularly useful and contributed to code complexity, I decided to remove them. However, if these were helpful to you, please let me know via an issue, and I may consider reintroducing them in the future

### New Features
- Enhanced support for multiple workspaces, specifically for the Tree view of routes. A "select project" icon has been added, allowing you to switch between workspaces within this view.
- The "Open in browser" feature has been removed when the route is not set to GET.

**Next coming versions will mainly add new features.**

