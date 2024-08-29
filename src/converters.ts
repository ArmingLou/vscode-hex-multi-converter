import { convertASCIICharacterToText } from "./characters";
import { regxNum } from "./constants";

export function hexStringToDecimalString(word: string): string | null {
  if (word.startsWith("#")) {
    word = word.substring(1);
  }
  const decimal = Number.parseInt(word, 16);

  if (Number.isNaN(decimal)) {
    return null;
  }

  return decimal.toString(10);
}

export function hexUnicodeToChar(word: string): string | null {
  if (word.startsWith("#")) {
    word = word.substring(1);
  }
  const decimal = Number.parseInt(word, 16);

  if (Number.isNaN(decimal)) {
    return null;
  }

  return convertASCIICharacterToText(String.fromCharCode(decimal));
}

export function decimalUnicodeToChar(word: string): string | null {
  const decimal = Number.parseInt(word, 10);

  if (Number.isNaN(decimal)) {
    return null;
  }

  return convertASCIICharacterToText(String.fromCharCode(decimal));
}

function formatBinaryString(
  binaryString: string,
  options: { numBits: number },
) {
  const bits = [...binaryString].slice(0, options.numBits);

  const arr = new Array(options.numBits).fill("0");

  arr.splice(-bits.length, bits.length, ...bits);

  return arr.join("");
}

export function hexStringToBinaryString(
  word: string,
  // TODO: Make configurable?
  options: { numBits: number } = { numBits: 8 },
): string | null {
  if (word.startsWith("#")) {
    word = word.substring(1);
  }
  if (word.startsWith("0x") || word.startsWith("0X")) {
    word = word.substring(2);
  }
  options.numBits = word.length * 4;
  const decimal = Number.parseInt(word, 16);

  if (Number.isNaN(decimal)) {
    return null;
  }

  const binaryString = decimal.toString(2);

  return formatBinaryString(binaryString, options);
}

function formatHexString(
  hexString: string,
  options: { prefix: string; upperCase: boolean; minLength: number },
) {
  let hex = hexString;

  if (hexString.length === 0) {
    hex = `${"0".repeat(options.minLength)}${hex}`;
  } else {
    let m = hexString.length % options.minLength;
    hex = `${"0".repeat(m)}${hex}`;
  }

  return `${options.prefix}${options.upperCase ? hex.toUpperCase() : hex}`;
}

export function decimalStringToHexString(
  word: string,
  // TODO: Make configurable?
  options: { prefix: string; upperCase: boolean; minLength: number } = {
    prefix: "0x",
    upperCase: false,
    minLength: 2,
  },
): string | null {
  const decimal = Number.parseInt(word, 10);

  if (Number.isNaN(decimal)) {
    return null;
  }

  const hex = decimal.toString(16);

  return formatHexString(hex, options);
}

export function binaryStringToHexString(
  word: string,
  // TODO: Make configurable?
  options: {
    prefix: string;
    upperCase: boolean;
    minLength: number;
    numBits?: number;
  } = {
      prefix: "0x",
      upperCase: false,
      minLength: 2,
      numBits: undefined,
    },
) {
  const decimal = Number.parseInt(word, 2);

  if (Number.isNaN(decimal)) {
    return null;
  }

  const hex = decimal.toString(16);

  return formatHexString(hex, options);
}

export function charToHexUnicode(
  word: string,
  // TODO: Make configurable?
  options: {
    prefix: string;
    upperCase: boolean;
    minLength: number;
    numBits?: number;
  } = {
      prefix: "0x",
      upperCase: false,
      minLength: 2,
      numBits: undefined,
    },
) {
  const chars = [...word];

  const out: string[] = [];

  for (const char of chars) {
    const charCode = char.charCodeAt(0);

    // if (charCode >= 0 && charCode < 127) {
    out.push(formatHexString(charCode.toString(16), options));
    // } else {
    //   out.push(char);
    //   // return null;
    // }
  }

  return out.join(" ");
}

export function hexUnicodeArrrayToString(
  line: string,
) {

  const out: string[] = [];
  let regex = new RegExp(regxNum.hex, "gi");
  let lineText = line;
  let result = regex.exec(lineText);
  while (result) {
    let st0 = result[0];
    if (st0 === undefined) {
      break;
    }

    if (st0 === '') {
      break;
    }

    const word = result[1];
    const char = hexUnicodeToChar(word);
    if (char !== null) {
      out.push(char);
    }
    result = regex.exec(lineText);
  }

  return out.join("");
}

export function decimalUnicodeArrrayToString(
  line: string,
) {

  const out: string[] = [];
  const regex = new RegExp(regxNum.decimal, "g");
  let lineText = line;
  let result = regex.exec(lineText);
  while (result) {
    let st0 = result[0];
    if (st0 === undefined) {
      break;
    }

    if (st0 === '') {
      break;
    }

    const word = result[1];
    const char = decimalUnicodeToChar(word);
    if (char !== null) {
      out.push(char);
    }
    result = regex.exec(lineText);
  }

  return out.join("");
}
export function decimalBytesUtf8ToString(
  line: string,
) {

  var enc = new TextDecoder("utf-8");


  const out: number[] = [];
  const regex = new RegExp(regxNum.decimal, "g");
  let lineText = line;
  let result = regex.exec(lineText);
  while (result) {
    let st0 = result[0];
    if (st0 === undefined) {
      break;
    }

    if (st0 === '') {
      break;
    }

    const word = result[1];
    out.push(Number.parseInt(word, 10));

    result = regex.exec(lineText);

  }
  var arr = new Uint8Array(out);
  var str = enc.decode(arr);

  return str;
}
export function hexBytesUtf8ToString(
  line: string,
) {

  var enc = new TextDecoder("utf-8");


  const out: number[] = [];
  const regex = new RegExp(regxNum.hex, "gi");
  let lineText = line;
  let result = regex.exec(lineText);
  while (result) {
    let st0 = result[0];
    if (st0 === undefined) {
      break;
    }

    if (st0 === '') {
      break;
    }

    const word = result[1];
    out.push(Number.parseInt(word, 16));

    result = regex.exec(lineText);

  }
  var arr = new Uint8Array(out);
  var str = enc.decode(arr);

  return str;
}

export function stringToHexUtf8Bytes(
  word: string,
  // TODO: Make configurable?
  options: {
    prefix: string;
    upperCase: boolean;
    minLength: number;
    numBits?: number;
  } = {
      prefix: "0x",
      upperCase: false,
      minLength: 2,
      numBits: undefined,
    },
) {
  var enc = new TextEncoder(); // always utf-8
  const chars = enc.encode(word);

  const out: string[] = [];

  for (const charCode of chars) {

    // if (charCode >= 0 && charCode < 127) {
    out.push(formatHexString(charCode.toString(16), options));
    // } else {
    //   out.push(char);
    //   // return null;
    // }
  }

  return out.join(" ");
}

export function stringToDecimalUtf8Bytes(
  word: string,
) {
  var enc = new TextEncoder(); // always utf-8
  const chars = enc.encode(word);

  const out: string[] = [];

  for (const charCode of chars) {

    out.push(charCode.toString(10));
  }

  return out.join(" ");
}
