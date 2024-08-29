import * as assert from "assert";
import * as vscode from "vscode";

import { findFirstWordRangeIn, forEachLineIn, forEachWordIn } from "../../lib";
import { regxNum } from "../../constants";

async function createEditor(content: string) {
  const editor = await vscode.window.showTextDocument(
    await vscode.workspace.openTextDocument({
      content,
    }),
  );

  return editor;
}

suite("findFirstWordRangeIn", () => {
  test("Hello World - line breaks", async () => {
    const editor = await createEditor("Hello World");

    assert.deepStrictEqual(
      findFirstWordRangeIn(
        regxNum.decimal,
        editor.document.lineAt(0),
        0,
      ),
      new vscode.Range(0, 0, 0, 5),
    );
  });
});

suite("forEachLineIn", () => {
  test("Hello World - line breaks", async () => {
    const editor = await createEditor(["Hello", "World"].join("\n"));

    const result: [string, number][] = [];

    forEachLineIn(editor, new vscode.Selection(0, 0, 1, 4), (line, i) => {
      result.push([line.text, i]);
    });

    assert.deepStrictEqual(result, [
      ["Hello", 0],
      ["World", 1],
    ]);
  });

  test("Hello World - line breaks, spaces", async () => {
    const editor = await createEditor(
      ["Hello World", "Hello World"].join("\n"),
    );

    const result: [string, number][] = [];

    forEachLineIn(editor, new vscode.Selection(0, 0, 1, 4), (line, i) => {
      result.push([line.text, i]);
    });

    assert.deepStrictEqual(result, [
      ["Hello World", 0],
      ["Hello World", 1],
    ]);
  });
});

suite("forEachWord", () => {
  test("Hello World - line breaks, spaces", async () => {
    const editor = await createEditor(
      ["Hello World", "Hello World"].join("\n"),
    );

    const result: [string, number][] = [];

    forEachWordIn(
      editor,
      new vscode.Selection(0, 0, 1, 11),
      editor.document.lineAt(0),
      (word, i) => {
        result.push([word, i]);
      },
      regxNum.hex,
    );

    forEachWordIn(
      editor,
      new vscode.Selection(1, 0, 2, 11),
      editor.document.lineAt(1),
      (word, i) => {
        result.push([word, i]);
      },
      regxNum.decimal,
    );

    assert.deepStrictEqual(result, [
      ["Hello", 0],
      ["World", 6],
      ["Hello", 0],
      ["World", 6],
    ]);
  });

  test("Code sample - line breaks, spaces", async () => {
    const editor = await createEditor(
      [
        "if (galaxies['milky-way'].includes('earth')) {",
        "  const [hello_world] = ['hello world', '- someone'];",
        "} 0x00-0x03 0x04 0x05 123 123-1234",
      ].join("\n"),
    );

    const result: [string, number][] = [];

    forEachWordIn(
      editor,
      new vscode.Selection(0, 0, 0, 46),
      editor.document.lineAt(0),
      (word, i) => {
        result.push([word, i]);
      },
      regxNum.decimal,
    );

    forEachWordIn(
      editor,
      new vscode.Selection(1, 0, 1, 53),
      editor.document.lineAt(1),
      (word, i) => {
        result.push([word, i]);
      },
      regxNum.decimal,
    );

    forEachWordIn(
      editor,
      new vscode.Selection(0, 2, 2, 34),
      editor.document.lineAt(2),
      (word, i) => {
        result.push([word, i]);
      },
      regxNum.decimal,
    );

    assert.deepStrictEqual(result, [
      ["if", 0],
      ["galaxies", 4],
      ["milky", 14],
      ["way", 20],
      ["includes", 26],
      ["earth", 36],
      ["const", 2],
      ["hello", 9],
      ["world", 15],
      ["hello", 26],
      ["world", 32],
      ["someone", 43],
      ["0x00", 2],
      ["0x03", 7],
      ["0x04", 12],
      ["0x05", 17],
      ["123", 22],
      ["123", 26],
      ["1234", 30],
    ]);
  });
});
