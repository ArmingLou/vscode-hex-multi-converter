export const regexes = {
  /**  https://regex101.com/r/KuAtuw/1 */
  hex: "^(?:0x|#)?[0-9A-Fa-f]+$",
  /** https://regex101.com/r/KTruwH/1 */
  decimal: "^[0-9]+$",
  binary: "^[0-1]+$",
  whitespace: "\\s",
  newline: "\\n",
  character: "[a-zA-Z0-9]",
};
export const regxNum = {
  hex: '(?:0x|#)?((?:(?!0x)(?!0X)[0-9a-f])+)',
  decimal: '([0-9]+)',
  binary: '([0-1]+)',
};

export const commentSymbols = {
  slashes: "//",
};

export const characters: {
  escapes: string[];
  controls: Record<number, string>;
} = {
  escapes: ["\\n", "\\r", "\\t", "\\f", "\\v"],
  controls: {
    /* eslint-disable @typescript-eslint/naming-convention */
    0x00: "NUL",
    0x01: "SOH",
    0x02: "STX",
    0x03: "ETX",
    0x04: "EOT",
    0x05: "ENQ",
    0x06: "ACK",
    0x07: "BEL",
    0x08: "BS",
    0x09: "HT",
    0x0a: "LF",
    0x0b: "VT",
    0x0c: "FF",
    0x0d: "CR",
    0x0e: "SO",
    0x0f: "SI",
    0x7f: "DEL",
    0x10: "DLE",
    0x11: "DC1",
    0x12: "DC2",
    0x13: "DC3",
    0x14: "DC4",
    0x15: "NAK",
    0x16: "SYN",
    0x17: "ETB",
    0x18: "CAN",
    0x19: "EM",
    0x1a: "SUB",
    0x1b: "ESC",
    0x1c: "FS",
    0x1d: "GS",
    0x1e: "RS",
    0x1f: "US",
    /* eslint-enable @typescript-eslint/naming-convention */
  },
};
