import * as vscode from "vscode";
import { ConvertCallback, MatcherCallback } from "./types";
import { forEachLineIn, forEachWordIn } from "./lib";
import {
  charToHexUnicode,
  binaryStringToHexString,
  decimalUnicodeArrrayToString,
  decimalStringToHexString,
  hexUnicodeArrrayToString,
  hexUnicodeToChar,
  hexStringToBinaryString,
  hexStringToDecimalString,
  decimalBytesUtf8ToString,
  hexBytesUtf8ToString,
  stringToDecimalUtf8Bytes,
  stringToHexUtf8Bytes,
} from "./converters";
import {
  isASCIIString,
  isBinaryString,
  isDecimalString,
  isHexString,
} from "./matchers";
import { insertLineComment } from "./comments";
import { regxNum } from "./constants";

export function comment(
  editor: vscode.TextEditor | undefined,
  convert: ConvertCallback,
  matcher: MatcherCallback,
  regex: string,
) {
  if (!editor) {
    // No open editor
    return;
  }

  if (editor.selections.length < 1) {
    // No selections
    return;
  }

  return editor.edit((builder) => {
    for (const selection of editor.selections) {
      forEachLineIn(editor, selection, (line) => {
        // Keeps track of mutable text and end index
        let lineText: string = line.text;
        let lineEndIndex: number = line.range.end.character;

        forEachWordIn(editor, selection, line, (word) => {
          if (matcher(word)) {
            const converted = convert(word);
            if (typeof converted === "string") {
              insertLineComment(
                line,
                lineText,
                lineEndIndex,
                converted,
                (comment, updatedLineText, updatedLineEndIndex) => {
                  // Update line text and end index for next iteration.
                  // Needed for multiple values on same line.
                  lineText = updatedLineText;
                  lineEndIndex = updatedLineEndIndex;

                  builder.insert(
                    new vscode.Position(line.lineNumber, lineEndIndex),
                    comment,
                  );
                },
              );
            }
          }
        }, regex);
      });
    }
  });
}

export function replace(
  editor: vscode.TextEditor | undefined,
  convert: ConvertCallback,
  matcher: MatcherCallback,
  regex: string,
) {
  if (!editor) {
    // No open editor
    return;
  }

  if (editor.selections.length < 1) {
    // No selections
    return;
  }

  return editor.edit((builder) => {
    for (const selection of editor.selections) {
      forEachLineIn(editor, selection, (line) => {
        forEachWordIn(editor, selection, line, (word, wordIndex) => {
          if (matcher(word)) {
            const converted = convert(word);
            if (typeof converted === "string") {
              builder.replace(
                new vscode.Range(
                  line.lineNumber,
                  wordIndex,
                  line.lineNumber,
                  wordIndex + word.length,
                ),
                converted,
              );
            }
          }
        }, regex);
      });
    }
  });
}

export function replaceWholeLine(
  editor: vscode.TextEditor | undefined,
  convert: ConvertCallback,
) {
  if (!editor) {
    // No open editor
    return;
  }

  if (editor.selections.length < 1) {
    // No selections
    return;
  }

  return editor.edit((builder) => {
    for (const selection of editor.selections) {
      forEachLineIn(editor, selection, (line) => {

        const currentLine = editor.document.lineAt(line.lineNumber).text;

        const wordRange = new vscode.Range(
          line.lineNumber,
          0,
          line.lineNumber,
          currentLine.length,
        );
        const converted = convert(currentLine);
        if (typeof converted === "string") {
          builder.replace(
            wordRange,
            converted,
          );
        }

      });
    }
  });
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    // From hex conversions
    vscode.commands.registerCommand("hex-multi-converter.hexToDecimal", () => {
      const editor = vscode.window.activeTextEditor;
      replace(editor, hexStringToDecimalString, isHexString, regxNum.hex);
    }),
    vscode.commands.registerCommand(
      "hex-multi-converter.commentHexAsDecimal",
      () => {
        const editor = vscode.window.activeTextEditor;
        comment(editor, hexStringToDecimalString, isHexString, regxNum.hex);
      },
    ),
    vscode.commands.registerCommand("hex-multi-converter.hexToChar", () => {
      const editor = vscode.window.activeTextEditor;
      replace(editor, hexUnicodeToChar, isHexString, regxNum.hex);
    }),
    vscode.commands.registerCommand(
      "hex-multi-converter.commentHexAsChar",
      () => {
        const editor = vscode.window.activeTextEditor;
        comment(editor, hexUnicodeToChar, isHexString, regxNum.hex);
      },
    ),
    vscode.commands.registerCommand("hex-multi-converter.hexToBinary", () => {
      const editor = vscode.window.activeTextEditor;
      replace(editor, hexStringToBinaryString, isHexString, regxNum.hex);
    }),
    vscode.commands.registerCommand(
      "hex-multi-converter.commentHexAsBinary",
      () => {
        const editor = vscode.window.activeTextEditor;
        comment(editor, hexStringToBinaryString, isHexString, regxNum.hex);
      },
    ),
    // To hex conversions
    vscode.commands.registerCommand("hex-multi-converter.decimalToHex", () => {
      const editor = vscode.window.activeTextEditor;
      replace(editor, decimalStringToHexString, isDecimalString, regxNum.decimal);
    }),
    vscode.commands.registerCommand("hex-multi-converter.binaryToHex", () => {
      const editor = vscode.window.activeTextEditor;
      replace(editor, binaryStringToHexString, isBinaryString, regxNum.binary);
    }),
    vscode.commands.registerCommand("hex-multi-converter.stringToHexUnicode", () => {
      const editor = vscode.window.activeTextEditor;
      replaceWholeLine(editor, charToHexUnicode);
    }),
    vscode.commands.registerCommand("hex-multi-converter.hexArrayToString", () => {
      const editor = vscode.window.activeTextEditor;
      replaceWholeLine(editor, hexUnicodeArrrayToString);
    }),
    vscode.commands.registerCommand("hex-multi-converter.decimalArrayToString", () => {
      const editor = vscode.window.activeTextEditor;
      replaceWholeLine(editor, decimalUnicodeArrrayToString);
    }),
    vscode.commands.registerCommand("hex-multi-converter.hexUtf8BytesToString", () => {
      const editor = vscode.window.activeTextEditor;
      replaceWholeLine(editor, hexBytesUtf8ToString);
    }),
    vscode.commands.registerCommand("hex-multi-converter.decimalUtf8BytesToString", () => {
      const editor = vscode.window.activeTextEditor;
      replaceWholeLine(editor, decimalBytesUtf8ToString);
    }),
    vscode.commands.registerCommand("hex-multi-converter.stringToHexUtf8Bytes", () => {
      const editor = vscode.window.activeTextEditor;
      replaceWholeLine(editor, stringToHexUtf8Bytes);
    }),
    vscode.commands.registerCommand("hex-multi-converter.stringToDecimalUtf8Bytes", () => {
      const editor = vscode.window.activeTextEditor;
      replaceWholeLine(editor, stringToDecimalUtf8Bytes);
    }),
  );
}

// This method is called when your extension is deactivated
export function deactivate() { }
