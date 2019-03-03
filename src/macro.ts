import * as vscode from 'vscode';


type MacroObject = {
    command: string,
    args?: object,
    repeat?: number,
    delayBefore?: number,
    delayBetween?: number,
    delayAfter?: number
};

export type SingleMacroDefinition = string | MacroObject;


export async function execute(macroDefinition: SingleMacroDefinition) {
    if (typeof macroDefinition === 'string') {
        await vscode.commands.executeCommand(macroDefinition);
    } else {
        await executeMacro(macroDefinition);
    }
}


async function executeMacro(macroDefinition: MacroObject) {
    if (macroDefinition.delayBefore) {
        await sleep(macroDefinition.delayBefore);
    }

    const repeat = macroDefinition.repeat || 1;
    for (let idx = 0; idx < repeat; idx++) {
        await vscode.commands.executeCommand(macroDefinition.command, macroDefinition.args);
        if (macroDefinition.delayBetween && idx < repeat - 1) {
            await sleep(macroDefinition.delayBetween);
        }
    }

    if (macroDefinition.delayAfter) {
        await sleep(macroDefinition.delayAfter);
    }
}


function sleep(ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
}
