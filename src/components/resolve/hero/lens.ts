/* --------------------------------------------------------------------------
   THE LENS: AN INSPECTOR, NOT A WINDOW.

   A window would show whatever is behind it. This shows the code *for* the
   part of the interface under its centre, and the snippet travels with the
   lens so it is always square to the reader and always legible. That is the
   difference between a gimmick and a tool: it answers a question about the
   thing it is pointed at.

   MOVING IT COSTS NOTHING. Only transforms change — no layout, no clip-path
   edit, no repaint of the card underneath.
   -------------------------------------------------------------------------- */

import type { Region } from "../../../data/heroCards";

/** the lens radius in card space; the disc is twice this */
export const LENS_R = 124;
/** where the lens sits when nobody is pointing at it */
export const REST_X = 318;
export const REST_Y = 184;
/** how far the follow may wander, so the disc never leaves the card */
export const CLAMP = { minX: 110, maxX: 350, minY: 110, maxY: 514 };

export const seg = (x: number, a: number, b: number): number => Math.min(1, Math.max(0, (x - a) / (b - a)));

/** Place the disc, its rim and its tag. One transform each, nothing else. */
export function placeLens(
  lens: HTMLElement | null,
  rim: HTMLElement | null,
  tag: HTMLElement | null,
  x: number,
  y: number,
  s = 1,
): void {
  const t = `translate3d(${x - LENS_R}px, ${y - LENS_R}px, 0) scale(${s})`;
  if (lens) lens.style.transform = t;
  if (rim) rim.style.transform = t;
  /* the tag hangs off the rim at the lower right, so it rides the same scale */
  if (tag) tag.style.transform = `translate3d(${x + 0.74 * LENS_R * s}px, ${y + 0.46 * LENS_R * s}px, 0) translate(-50%, -50%)`;
}

/* WHICH PART OF THE INTERFACE THE LENS IS OVER. Bands, not element hit tests:
   the card is a tilted plane and the regions are fixed bands of card space,
   so this is four comparisons rather than a hit test per frame. */
const BOUNDS: [Region, number][] = [
  ["number", 300],
  ["module", 380],
  ["list", 530],
  ["cta", Infinity],
];

/** TWELVE PIXELS OF HYSTERESIS, because a lens resting exactly on a boundary
 *  would otherwise crossfade the snippet back and forth forever. */
export function regionAt(y: number, current: Region): Region {
  const idx = BOUNDS.findIndex(([, max]) => y < max);
  const next = BOUNDS[idx][0];
  if (next === current) return current;
  const ci = BOUNDS.findIndex(([n]) => n === current);
  const edge = idx > ci ? BOUNDS[ci][1] : BOUNDS[idx][1];
  return Math.abs(y - edge) > 12 ? next : current;
}

/** Where the lens drifts when nobody is pointing. Two sine waves at periods
 *  that do not divide into each other, so it never repeats on a beat anyone
 *  can anticipate, and it stays inside the `number` region throughout. */
export function driftAt(t: number): [number, number] {
  return [REST_X + 34 * Math.sin((t / 9) * Math.PI * 2), REST_Y + 22 * Math.sin((t / 6) * Math.PI * 2)];
}

/** The hand-off reveal: the lens stops being a lens and becomes the whole
 *  card. Radius and centre are pure functions of the scroll, so it reverses
 *  exactly on the way back up. */
export function revealAt(a: number): { r: number; x: number; y: number; codeOpacity: number } {
  const t = seg(a, 0.1, 0.55);
  const e = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  return {
    r: LENS_R + (470 - LENS_R) * e,
    x: REST_X + (230 - REST_X) * e,
    y: REST_Y + (312 - REST_Y) * e,
    codeOpacity: seg(a, 0.05, 0.15),
  };
}
