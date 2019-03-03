# super-macro extension for VS Code

This extension provides ways to run multiple commands repeatedly with intervals.

## Features

The extension provides two ways to run combination of commands:

- A command `extension.macro` to invoke directly.

    For example, one can define the following key combo to insert 3 new lines below and move cursor back to the second line:

    ```json
    {
        "key": "cmd+ctrl+l 3",
        "command": "extension.macro",
        "args": [
            "cursorEnd",
            {"command": "type", "args": {"text": "\n"}, "repeat": 3},
            "cursorUp"
        ]
    }
    ```

- Define the `macro.definitions` configuration to introduce new commands.

    For example, one can define the following macros in settings (in `settings.json` file):

    ```json
    "macro.definitions": {
        "cursorDown5Lines": {
            "command": "cursorDown",
            "repeat": 5
        },
        "scrollDownAndBack": [
            {"command": "scrollPageDown", "repeat": 3, "delayBetween": 5000, "delayAfter": 10000},
            {"command": "scrollPageUp", "repeat": 3},
        ]
    }
    ```

    After reloading a window, one can invoke commands `extension.macro.cursorDown5Lines` and `extension.macro.scrollDownAndBack`:
    - The first command will move the cursor down 5 lines.
    - The second command will scroll 3 pages down while waiting for 5 seconds in between, then stop there for 10 seconds, and finally scroll 3 pages back up.

    The commands can be binded to specific keys:

    ```json
    {"key": "ctrl+j", "command": "extension.macro.cursorDown5Lines"}
    ```

Note in the examples above, a macro can be either a single macro object, such as

```json
{"command": "cursorDown", "repeat": 5}
```

or an array of strings and/or macro objects such as

```json
[
    "cursorHome",
    {"command": "scrollPageDown", "repeat": 3, "delayBetween": 5000, "delayAfter": 10000},
    {"command": "scrollPageUp", "repeat": 3},
    "cursorEnd"
]
```

If defined as an array, the commands in the array will be run sequentially.

A macro object should be defined in the following format:

```
{
    "command": string,       // required, vscode command to run
    "args": object,          // optional, arguments to pass to the command
    "repeat": number,        // optional, number of times to run, default to once if not provided
    "delayBefore": number,   // optional, milliseconds to wait before running the command, default not to wait
    "delayBetween": number,  // optional, milliseconds to wait between repeated command runs, default not to wait
    "delayAfter": number     // optional, milliseconds to wait after running the command, default not to wait
}
```

## Release Notes

Users appreciate release notes as you update your extension.

### 1.0.0

Initial release of Super Macro
