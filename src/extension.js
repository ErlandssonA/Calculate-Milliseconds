const vscode = require("vscode");
const parseTimeToMilliseconds = require("./utils/parseTimeToMilliseconds");
const formatMilliseconds = require("./utils/formatMilliseconds");

function activate(context) {
  const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
      color: "#709D68",
      fontStyle: "italic",
      margin: "0 0 0 5px",
    },
  });

  let convertToReadableCommand = vscode.commands.registerCommand("extension.convertToReadable", async () => {
    const input = await vscode.window.showInputBox({
      prompt: "Enter milliseconds to convert",
    });
    if (input) {
      const ms = parseInt(input, 10);
      if (!isNaN(ms)) {
        vscode.window.showInformationMessage(`${input} milliseconds is ${formatMilliseconds(ms)}`);
      } else {
        vscode.window.showErrorMessage("Invalid input. Please enter a number.");
      }
    }
  });

  let convertToMillisecondsCommand = vscode.commands.registerCommand("extension.convertToMilliseconds", async () => {
    const input = await vscode.window.showInputBox({
      prompt: 'Enter time (e.g., "2h 30m") to convert to milliseconds',
    });
    if (input) {
      const ms = parseTimeToMilliseconds(input);
      if (ms !== null) {
        vscode.window.showInformationMessage(`${input} is ${ms} milliseconds`);
      } else {
        vscode.window.showErrorMessage('Invalid input. Please use formats like "2h 30m".');
      }
    }
  });

  context.subscriptions.push(convertToReadableCommand, convertToMillisecondsCommand);

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      updateDecorations(editor, decorationType);
    }
  });

  vscode.workspace.onDidChangeTextDocument((event) => {
    const editor = vscode.window.activeTextEditor;
    if (editor && event.document === editor.document) {
      updateDecorations(editor, decorationType);
    }
  });

  vscode.window.onDidChangeTextEditorSelection((e) => {
    if (e.textEditor) {
      updateDecorations(e.textEditor, decorationType);
    }
  });

  vscode.window.onDidChangeActiveTextEditor((editor) => {
    if (editor) {
      updateDecorations(editor, decorationType);
    }
  });

  function updateDecorations(editor, decorationType) {
    if (!editor) return;

    const text = editor.document.getText();
    const regex = /(\d+\s*\*\s*\d+\s*\*\s*\d+\s*\*\s*\d+(\s*\*\s*\d+){0,})/g;
    const decorations = [];

    let match;
    while ((match = regex.exec(text))) {
      try {
        const milliseconds = eval(match[0]);
        const humanReadableTime = formatMilliseconds(milliseconds);
        const startPos = editor.document.positionAt(match.index);

        const line = editor.document.lineAt(startPos.line);
        const lineEnd = new vscode.Position(startPos.line, line.text.length);

        const range = new vscode.Range(lineEnd, lineEnd);

        decorations.push({
          range,
          renderOptions: {
            after: {
              contentText: ` [${humanReadableTime}]`,
            },
          },
        });
      } catch (error) {
        console.error("Error evaluating expression:", match[0], error);
      }
    }

    editor.setDecorations(decorationType, decorations);
  }
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
