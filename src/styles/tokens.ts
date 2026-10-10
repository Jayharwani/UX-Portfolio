/* --------------------------------------------------------------------------
   The palette, mirrored for code that cannot read CSS.

   The canvas field needs real numbers, and a second hand-typed copy of a hex
   value is a drift waiting to happen. These are the same six colours declared
   on .v2.rs in resolve.css and nothing else may introduce a hue.

   THE ACCENTS ARE NAMED FOR PROJECTS, NOT FOR COLOURS. They used to be teal,
   mint, cyan and gold, which was accurate and was the problem: three of the
   four sat within about thirty degrees of each other on the hue wheel, so
   four deliberate keys read as one colour drifting. The set below is four
   hues spaced around the wheel at one perceptual lightness and chroma
   (OKLCH 80% / 0.10), so each project has its own key and none of them is
   louder than the others. Naming them for the projects also means the name
   stops being a thing that can go stale when a hue moves.

   Every one of them carries at least 10.4:1 against --void, so --void text on
   an accent fill is safe on all four. Paper text on an accent fill is not,
   and never was.
   -------------------------------------------------------------------------- */

export const TOKENS = {
  void: "#05070C",
  paper: "#EEF1F5",
  /* oklch(80% 0.10 35) — heat, complaints */
  friction: "#F7A792",
  /* oklch(80% 0.10 150) — safe money */
  headroom: "#8ED09C",
  /* oklch(80% 0.10 250) — a live map */
  signal: "#8CC3FC",
  /* oklch(80% 0.10 80) — caution */
  bumper: "#E0B771",
} as const;

export type Accent = "friction" | "headroom" | "signal" | "bumper";

export const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

export const accentRgb = (a: Accent): [number, number, number] => rgb(TOKENS[a]);
