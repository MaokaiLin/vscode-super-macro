import * as assert from 'assert';
import * as vscode from 'vscode';


suite("Extension Tests", function () {

    test("Should correctly move cursor when running the extension.macro command with an object arg", async () => {
        const editor = getEditor();
        await insertPreExistingText();

        await vscode.commands.executeCommand('cursorTop');
        await vscode.commands.executeCommand('cursorEnd');
        assertCursorPositionEqual(editor, 0, 4);

        await vscode.commands.executeCommand('extension.macro', {
            "command": "cursorDown",
            "repeat": 2,
            "delayBetween": 50
        });
        assertCursorPositionEqual(editor, 2, 4);
    });

    test("Should correctly move cursor when running the extension.macro command with an object arg", async () => {
        const editor = getEditor();
        await insertPreExistingText();

        await vscode.commands.executeCommand('cursorTop');
        await vscode.commands.executeCommand('cursorDown');
        await vscode.commands.executeCommand('cursorRight');
        assertCursorPositionEqual(editor, 1, 1);

        await vscode.commands.executeCommand('extension.macro', [
           "cursorDown",
           {"command": "cursorRight", "repeat": 3, "delayBefore": 150}
        ]);
        assertCursorPositionEqual(editor, 2, 4);
    });

    test("Should correctly move cursor when running the 'single' macro", async () => {
        const editor = getEditor();
        await insertPreExistingText();

        await vscode.commands.executeCommand('cursorTop');
        await vscode.commands.executeCommand('cursorDown');
        assertCursorPositionEqual(editor, 1, 0);

        await vscode.commands.executeCommand('extension.macro.single');
        assertCursorPositionEqual(editor, 4, 0);
    });

    test("Should correctly move cursor when running the 'sequence' macro", async () => {
        const editor = getEditor();
        await insertPreExistingText();

        await vscode.commands.executeCommand('cursorTop');
        await vscode.commands.executeCommand('cursorRight');
        await vscode.commands.executeCommand('cursorRight');
        assertCursorPositionEqual(editor, 0, 2);

        await vscode.commands.executeCommand('extension.macro.sequence');
        assertCursorPositionEqual(editor, 5, 11);
    });

    function getEditor(): vscode.TextEditor {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            throw assert.fail(`Expect to have an active editor, but got ${editor}.`);
        }
        return editor;
    }

    async function insertPreExistingText() {
        await vscode.commands.executeCommand('selectAll');
        await vscode.commands.executeCommand('type', {"text": "1111\n2222\n3333\n4444\n"});
    }

    function assertCursorPositionEqual(editor: vscode.TextEditor, line: number, character: number) {
        const expectedPosition = new vscode.Position(line, character);
        const position = editor.selection.active;
        assert.deepEqual(position, expectedPosition);
    }
});
