/* --------------------------------------------------------------------------
   The palette, mirrored for code that cannot read CSS.

   The canvas field needs real numbers, and a second hand-typed copy of a hex
   value is a drift waiting to happen. These are the same six colours declared
   on .v2.rs in resolve.css and nothing else may introduce a hue. The two
   copies are checked by eye, not by a script: an earlier comment here cited
   a scripts/check-tokens.mjs that has never existed.

   THE ACCENTS ARE NAMED FOR PROJECTS, NOT FOR COLOURS. They used to be teal,
   mint, cyan and gold, which was accurate and was the problem: three of the
   four sat within about thirty degrees of each other on the hue wheel, so
   four deliberate keys read as one colour drifting. The set below is five
   hues spaced around the wheel at one perceptual lightness and chroma
   (OKLCH 80% / 0.10), so each project has its own key and none of them is
   louder than the others. Naming them for the projects also means the name
   stops being a thing that can go stale when a hue moves.

   THE FIFTH ONE WAS PLACED BY THE RULE, NOT BY THE SUBJECT. Healthy Switch's
   own story is red to green and both of those were already spoken for: green
   is Headroom and the warm end is Friction. Sorted, the four sat at 35, 80,
   150 and 250 degrees, which leaves one gap of 145 degrees and nothing else
   wider than 100. Healthy Switch takes its midpoint. The red-to-green arc is
   carried by the shape instead, which is where this page puts meaning anyway.

   Every one of them carries at least 10.3:1 against --void, so --void text on
   an accent fill is safe on all five. Paper text on an accent fill is not,
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
  /* oklch(80% 0.10 323) — the one gap left on the wheel, 73 degrees clear of
     its nearest neighbour and the widest separation available. 10.36:1. */
  healthy: "#DDA8E4",
} as const;

export type Accent = "healthy" | "friction" | "headroom" | "signal" | "bumper";

export const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

export const accentRgb = (a: Accent): [number, number, number] => rgb(TOKENS[a]);
