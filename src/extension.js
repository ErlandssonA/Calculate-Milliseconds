const vscode = require("vscode");
const parseTimeToMilliseconds = require("./utils/parseTimeToMilliseconds");
const formatMilliseconds = require("./utils/formatMilliseconds");
const breakdownTime = require("./utils/breakdownTime");

function activate(context) {
  console.log("Extension 'Calculate Milliseconds' is now running!");

  const decorationType = vscode.window.createTextEditorDecorationType({
    after: {
      color: "#709D68",
      fontStyle: "italic",
      margin: "0 0 0 5px",
    },
  });

  // Register commands
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

  let ignoreLineCommand = vscode.commands.registerCommand("extension.ignoreLine", async (lineNumber) => {
    const editor = vscode.window.activeTextEditor;
    if (lineNumber === undefined) {
      vscode.window.showErrorMessage("You can only ignore a line by hovering over it.");
      return;
    }
    if (editor) {
      const line = editor.document.lineAt(lineNumber);
      const text = line.text;
      const newText = text + (text.trim().endsWith(";") ? "" : "") + " // @no-milliseconds";
      await editor.edit((editBuilder) => {
        editBuilder.replace(line.range, newText);
      });
    }
  });

  context.subscriptions.push(convertToReadableCommand, convertToMillisecondsCommand, ignoreLineCommand);

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

  // Register hover provider
  const hoverProvider = vscode.languages.registerHoverProvider("*", {
    provideHover(document, position) {
      const range = document.getWordRangeAtPosition(position, /\d+\s*\*\s*\d+(\s*\*\s*\d+)*/);
      if (range) {
        const expression = document.getText(range);
        try {
          const milliseconds = eval(expression);
          const { days, hours, minutes, seconds } = breakdownTime(milliseconds);
          const formattedMilliseconds = milliseconds.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

          let formatDay = "";
          let formatHour = "";
          let formatMinute = "";
          let formatSecond = "";

          if (days > 0) {
            formatDay = `- ${days} day${days > 1 ? "s" : ""}\n` || "";
          }
          if (hours > 0) {
            formatHour = `- ${hours} hour${hours > 1 ? "s" : ""}\n` || "";
          }
          if (minutes > 0) {
            formatMinute = `- ${minutes} minute${minutes > 1 ? "s" : ""}\n` || "";
          }
          if (seconds > 0) {
            formatSecond = `- ${seconds} second${seconds > 1 ? "s" : ""}\n` || "";
          }

          const hoverMessage =
            `**Time Breakdown:**\n` +
            formatDay +
            formatHour +
            formatMinute +
            formatSecond +
            `\n\n**Total:** ${formattedMilliseconds} ms`;

          const commandUri = vscode.Uri.parse(
            `command:extension.ignoreLine?${encodeURIComponent(JSON.stringify([position.line]))}`
          );
          const markdown = new vscode.MarkdownString(hoverMessage);
          markdown.appendMarkdown(`\n\n[Ignore this line](${commandUri})`);
          markdown.isTrusted = true;

          return new vscode.Hover(markdown);
        } catch (error) {
          console.error("Error evaluating expression:", expression, error);
        }
      }
    },
  });

  context.subscriptions.push(hoverProvider);

  function updateDecorations(editor, decorationType) {
    if (!editor) return;

    // Get configuration
    const text = editor.document.getText();
    const regex = /(\d+\s*\*\s*\d+(\s*\*\s*\d+)*)/g;
    const decorations = [];

    let match;
    while ((match = regex.exec(text))) {
      try {
        const startPos = editor.document.positionAt(match.index);
        const line = editor.document.lineAt(startPos.line);

        // Check if line has ignore comment
        if (line.text.includes("@no-milliseconds")) {
          continue;
        }

        const milliseconds = eval(match[0]);
        const humanReadableTime = formatMilliseconds(milliseconds);
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
