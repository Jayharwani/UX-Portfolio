/* --------------------------------------------------------------------------
   The palette, mirrored for code that cannot read CSS.

   The canvas field and the WebGL emblem need real numbers, and a second
   hand-typed copy of a hex value is a drift waiting to happen. These are the
   same six colours declared on .v2 in v2.css and nothing else may introduce a
   hue. scripts/check-tokens.mjs fails the build if the two copies disagree.
   -------------------------------------------------------------------------- */

export const TOKENS = {
  void: "#05070C",
  paper: "#EEF1F5",
  teal: "#3FB9A6",
  mint: "#5FD8A4",
  cyan: "#5FD3D8",
  gold: "#E9C58B",
} as const;

export type Accent = "teal" | "mint" | "cyan" | "gold";

export const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

export const accentRgb = (a: Accent): [number, number, number] => rgb(TOKENS[a]);
