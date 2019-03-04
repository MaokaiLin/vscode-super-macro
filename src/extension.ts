// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as macro from './macro';

const MACRO_COMMAND_NAME = 'extension.macro';


type MacroConfig = macro.SingleMacroDefinition | Array<macro.SingleMacroDefinition>;

type MacroDefinitions = {
	[macroName: string]: MacroConfig
};


export function activate(context: vscode.ExtensionContext) {
	// Register an "extension.macro" command that can take args in the following formats:
	//   {"key": "cmd+n", "command": "extension.macro", "args": {"command": "cursorDown", "repeat": 5}}
	// or
	//   {"key": "cmd+p", "command": "extension.macro", "args": ["cursorDown", {"command": "cursorRight", "repeat": 2, "delayBetween": 200}]}
	const macroCommand = vscode.commands.registerCommand(MACRO_COMMAND_NAME, runMacro);
	context.subscriptions.push(macroCommand);

	// Register a command for each user defined macro with command name "extension.macro.{user_defined_macro_name}"
	const macroDefinitions: MacroDefinitions = vscode.workspace.getConfiguration("macro.definitions");
	Object.keys(macroDefinitions)
		// Filter out the additional properties added by vscode such as get, inspect, etc.
		.filter(macroName => typeof macroDefinitions[macroName] === 'object')
		.forEach(macroName => {
			const commandName = `${MACRO_COMMAND_NAME}.${macroName}`;
			const commandFunction = async () => {
				await vscode.commands.executeCommand(
					MACRO_COMMAND_NAME,
					macroDefinitions[macroName]
				);
			};
			const userDefinedMacroCommand = vscode.commands.registerCommand(commandName, commandFunction);
			context.subscriptions.push(userDefinedMacroCommand);
		});
}


async function runMacro(macroConfig: MacroConfig) {
	if (macroConfig instanceof Array) {
		for (let i = 0; i < macroConfig.length; i++) {
			await macro.execute(macroConfig[i]);
		}
	} else {
		await macro.execute(macroConfig);
	}
}


export function deactivate() {}
