# Calculate Milliseconds

A simple VS Code extension to help developers work with timestamps by displaying "ghost text" that shows time in a readable format alongside milliseconds. It also provides commands for converting between milliseconds and readable time formats.

## Features

### Ghost Text in the Editor

- Displays "ghost text" alongside the current timestamp in a human-readable format or the reverse (milliseconds) to help you visualize time while working with timestamps instead of having to write e.g. `1000 * 60 * 60 * 24 * 7`.
- The ghost text updates in real-time, making it easier to compare and adjust times.

### Convert Between Milliseconds and Readable Time

- **Convert milliseconds to readable time**: Easily convert any milliseconds value into a human-readable format using a command.
- **Convert readable time to milliseconds**: Convert human-readable time back to milliseconds with a simple command.

## Commands

- `Convert Milliseconds to Readable Time`: Convert a selected milliseconds value to a readable time format.
- `Convert Readable Time to Milliseconds`: Convert a selected time format to milliseconds.

You can run these commands via the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS) or use keyboard shortcuts if configured.

## Installation

1. Open Visual Studio Code.
2. Go to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
3. Search for `Calculate Milliseconds`.
4. Click `Install` on the extension page.

## Usage

1. Once installed, open any file in the editor.
2. The extension will display the current timestamp as ghost text in a readable format or milliseconds in the editor.
3. Use the commands to convert between milliseconds and readable time when needed.

### Example

- **Milliseconds to Time**: Run the command `Convert Milliseconds to Readable Time` and enter `9000000` to get `2h 30m`.
- **Time to Milliseconds**: Run the command `Convert Readable Time to Milliseconds` and enter `2h 30m` to get `9000000`.

## Contributing

Feel free to fork and contribute to the project! If you find any bugs or have suggestions for new features, please open an issue or submit a pull request.

## License

This extension is licensed under the MIT License.
