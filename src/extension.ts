// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposableWrapp = vscode.commands.registerCommand('extension.codeWrapperWrapp', () => {
		// The code you place here will be executed every time your command is executed
		// Check if the editor exist
		const editor = vscode.window.activeTextEditor;
		if(!editor) {
			vscode.window.showErrorMessage("Editor does not exist");
			return;
		}
		//Get the selected code
		const originalCode = editor.document.getText(editor.selection);
		//Get the user configured wrrapers
		const wrapperStart = vscode.workspace.getConfiguration('codeWrapper').get('wrapperStart');
		const wrappedEnd = vscode.workspace.getConfiguration('codeWrapper').get('wrapperEnd');
		//Create wrapped code
		const wrappedCode = `\n${wrapperStart}\n${originalCode}\n${wrappedEnd}\n`;
		//Replace the selected code with wrapped one
		editor.edit(edit => {
			edit.replace(editor.selection, wrappedCode);
		});
	});

	let disposableSearch = vscode.commands.registerCommand('extension.codeWrapperSearch', () => {
		// The code you place here will be executed every time your command is executed
		// Get the user configured expression
		const wrapperSearchExpression = vscode.workspace.getConfiguration('codeWrapper').get('wrapperSearchExpression');
		// Search the workspace for wrappers
		vscode.commands.executeCommand('workbench.action.findInFiles', {
			query: wrapperSearchExpression,
			triggerSearch: true,
			filesToInclude: "*.c,*.h,*.py",
			isRegex: true,
		});
	});

	let disposableLog = vscode.commands.registerCommand('extension.codeWrapperLog', () => {
		// The code you place here will be executed every time your command is executed
		// Get the user configured expression
		const wrapperSearchExpression = vscode.workspace.getConfiguration('codeWrapper').get('wrapperSearchExpression');
		// Search the workspace for wrappers
		vscode.commands.executeCommand('workbench.action.findInFiles', {
			query: wrapperSearchExpression,
			triggerSearch: true,
			filesToInclude: "*.c,*.h,*.py",
			isRegex: true,
		});

		// TODO  See how to get the search data

		// Create Log file, write the info in it and open the file
		const newFile = vscode.Uri.parse('untitled:' + path.join(vscode.workspace.workspaceFolders![0].toString(), 'Log.txt'));
		vscode.workspace.openTextDocument(newFile).then(async document => {
			const edit = new vscode.WorkspaceEdit();
			edit.insert(newFile, new vscode.Position(0, 0), "Search Data!");
			const success = await vscode.workspace.applyEdit(edit);
			if (success) {
				vscode.window.showTextDocument(document);
			}
			else {
				vscode.window.showInformationMessage('Error!');
			}
		});
	});

	context.subscriptions.push(disposableWrapp);
	context.subscriptions.push(disposableSearch);
	context.subscriptions.push(disposableLog);
}

// this method is called when your extension is deactivated
export function deactivate() {}
