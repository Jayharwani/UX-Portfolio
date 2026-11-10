import { tokenize, type HeroCard, type ProductKey, type Tok } from "../../../data/heroCards";
import { TOKENS, UI } from "../../../styles/tokens";
import { BASE_H, BASE_W } from "./fit";
import type { Pt } from "./projector";

/* --------------------------------------------------------------------------
   THE CARD, AS PARTICLES.

   Two populations. A halo of paper points clinging just outside the card's
   edge, which is all you see while the card is opaque on top of them. And the
   code: four thousand points sampled from a raster of the product's own
   listing, each carrying the colour of the glyph it landed on, waiting under
   the card for the scroll to uncover them.

   THE RASTER IS THE SAME DRAWING THE DOM MAKES. Same font, same size, same
   line height, same origin — so when the card fades and the particles are
   all that is left, the code has not moved. Sampling the DOM instead would
   mean a layout read per glyph; sampling a canvas is one read of one image.

   Card-local coordinates throughout, so a resize never invalidates them.
   -------------------------------------------------------------------------- */

const chan = (h: string): [number, number, number] => [
  parseInt(h.slice(1, 3), 16),
  parseInt(h.slice(3, 5), 16),
  parseInt(h.slice(5, 7), 16),
];

/** EVERY FILL IS OPAQUE, AND THE DIMMING IS BAKED INTO THE COLOUR. The raster
 *  is sampled by coverage, so a token drawn at 42% alpha could never clear the
 *  gate however solid its stroke was — which is why the punctuation and the
 *  brackets disappeared and the listing read as a column of words. Compositing
 *  the same alpha over the void by hand gives the identical colour with the
 *  alpha channel left free to mean one thing only. */
const onVoid = (h: string, alpha: number): string => {
  const [r, g, b] = chan(h);
  const [vr, vg, vb] = chan(TOKENS.void);
  const m = (c: number, v: number) => Math.round(c * alpha + v * (1 - alpha));
  return `rgb(${m(r, vr)},${m(g, vg)},${m(b, vb)})`;
};

/** the colours the canvas needs as values, derived rather than retyped: the
 *  palette has exactly one home and this is not it */
const TOKEN_HEX: Record<Exclude<Tok, "sp">, string> = {
  kw: TOKENS.friction,
  tg: TOKENS.headroom,
  at: TOKENS.bumper,
  st: TOKENS.healthy,
  nu: UI.select,
  pu: onVoid(TOKENS.paper, 0.42),
  cm: onVoid(TOKENS.paper, 0.34),
  id: onVoid(TOKENS.paper, 0.82),
};

export type CardSample = {
  /** card-local x,y pairs: halo first, then code */
  xy: Float32Array;
  /** rgb per point, 0 to 1 */
  rgb: Float32Array;
  /** how many of the leading points are halo */
  halo: number;
  /** indices of plain-identifier code points, where halo particles slide to */
  plain: Int32Array;
};

/** deterministic, so the card is the same card on every load */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** a point on the card's rounded rectangle, by distance along its outline */
function onOutline(t: number, r: number): Pt {
  const w = BASE_W - 2 * r;
  const h = BASE_H - 2 * r;
  const arc = (Math.PI / 2) * r;
  const total = 2 * w + 2 * h + 4 * arc;
  let d = t * total;
  if (d < w) return [r + d, 0];
  d -= w;
  if (d < arc) { const a = d / r; return [BASE_W - r + Math.sin(a) * r, r - Math.cos(a) * r]; }
  d -= arc;
  if (d < h) return [BASE_W, r + d];
  d -= h;
  if (d < arc) { const a = d / r; return [BASE_W - r + Math.cos(a) * r, BASE_H - r + Math.sin(a) * r]; }
  d -= arc;
  if (d < w) return [BASE_W - r - d, BASE_H];
  d -= w;
  if (d < arc) { const a = d / r; return [r - Math.sin(a) * r, BASE_H - r + Math.cos(a) * r]; }
  d -= arc;
  if (d < h) return [0, BASE_H - r - d];
  d -= h;
  const a = d / r;
  return [r - Math.cos(a) * r, r - Math.sin(a) * r];
}

const cache = new Map<string, CardSample>();

export function cardSample(card: HeroCard, total: number, haloCount: number): CardSample {
  const key = `${card.key}:${total}:${haloCount}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const rand = rng(0x9e37 ^ card.key.length ^ total);
  const xy = new Float32Array(total * 2);
  const rgb = new Float32Array(total * 3);

  /* ── the halo ───────────────────────────────────────────────────────── */
  const paper = chan(TOKENS.paper).map((c) => c / 255);
  for (let i = 0; i < haloCount; i++) {
    const t = rand();
    const [ox, oy] = onOutline(t, 34);
    /* outward by rand squared, so most of them hug the edge and a few stray */
    const push = 46 * rand() * rand();
    const cx = BASE_W / 2;
    const cy = BASE_H / 2;
    const dx = ox - cx;
    const dy = oy - cy;
    const d = Math.hypot(dx, dy) || 1;
    xy[i * 2] = ox + (dx / d) * push + (rand() - 0.5) * 6;
    xy[i * 2 + 1] = oy + (dy / d) * push + (rand() - 0.5) * 6;
    rgb[i * 3] = paper[0];
    rgb[i * 3 + 1] = paper[1];
    rgb[i * 3 + 2] = paper[2];
  }

  /* ── the code ───────────────────────────────────────────────────────── */
  const ink: Array<[number, number, number, number, number, boolean]> = [];
  const canvas = document.createElement("canvas");
  canvas.width = BASE_W;
  canvas.height = BASE_H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (ctx) {
    ctx.font = '400 14px "Geist Mono", ui-monospace, monospace';
    ctx.textBaseline = "middle";
    /* a monospace advance measured from the same font the DOM face uses, so
       column n lands under column n */
    const adv = ctx.measureText("0").width;
    card.listing.split("\n").forEach((line, row) => {
      let col = 0;
      for (const [t, s] of tokenize(line)) {
        if (t !== "sp") {
          ctx.fillStyle = TOKEN_HEX[t];
          ctx.fillText(s, 30 + col * adv, 34 + row * 26.5 + 13.25);
        }
        col += s.length;
      }
    });
    const { data } = ctx.getImageData(0, 0, BASE_W, BASE_H);
    for (let i = 0; i < data.length; i += 4) {
      /* COVERAGE DECIDES WHETHER A PIXEL IS SAMPLED, NOT HOW BRIGHT IT IS.
         At 14px most of a glyph is edge, so scaling the colour by its own
         antialiasing dragged half the sample toward black and took the syntax
         colour with it — measured at a chroma of 52 against 119 for a control.
         Taking only the solid part of each stroke keeps the colour at full
         strength and costs nothing: there are thousands of pixels per line and
         four thousand points to place. */
      if (data[i + 3] < 120) continue;
      const p = i / 4;
      const r = data[i] / 255;
      const g = data[i + 1] / 255;
      const b = data[i + 2] / 255;
      /* neutral pixels are identifiers and punctuation: the halo slides to
         those, so a paper particle never lands on a coloured keyword */
      const plain = Math.abs(r - g) < 0.04 && Math.abs(g - b) < 0.04;
      ink.push([p % BASE_W, Math.floor(p / BASE_W), r, g, b, plain]);
    }
  }

  const plainIdx: number[] = [];
  for (let i = haloCount; i < total; i++) {
    if (!ink.length) break;
    const s = ink[Math.floor(rand() * ink.length)];
    xy[i * 2] = s[0] + rand() - 0.5;
    xy[i * 2 + 1] = s[1] + rand() - 0.5;
    rgb[i * 3] = s[2];
    rgb[i * 3 + 1] = s[3];
    rgb[i * 3 + 2] = s[4];
    if (s[5]) plainIdx.push(i);
  }

  const out: CardSample = { xy, rgb, halo: haloCount, plain: Int32Array.from(plainIdx) };
  cache.set(key, out);
  return out;
}

/* --------------------------------------------------------------------------
   WHAT THE FIELD NEEDS TO DRAW IT.

   Module level, for the same reason the field's own target override is: the
   formation runs inside the field, the pose lives in the stage, and threading
   it through the page root would re-render the chapters on every frame of a
   pointer move.
   -------------------------------------------------------------------------- */

export type CardSource = {
  sample: CardSample;
  /** card-local to screen pixels, for the current pose */
  project: (u: number, v: number) => Pt;
  product: ProductKey;
  /** the viewport the field draws into, so screen pixels can become world
   *  units without this module guessing which width excludes the scrollbar */
  vw: number;
  vh: number;
};

/** what the field is drawn with. The stage knows where the card is, the
 *  scroll knows how far the hand-off has gone, and only the field knows the
 *  world rectangle its own camera sees — so the three are published
 *  separately and the formation reads all three. */
export type CardPlane = { halfW: number; halfH: number; fit: number; ox: number; oy: number };

let source: CardSource | null = null;
let planeNow: CardPlane | null = null;
let phaseNow = 0;

export const setCardSource = (s: CardSource | null): void => {
  source = s;
};
export const getCardSource = (): CardSource | null => source;

export const setCardPlane = (p: CardPlane | null): void => {
  planeNow = p;
};
export const getCardPlane = (): CardPlane | null => planeNow;

/** how far the halo has slid home, 0 to 1. The scroll owns this. */
export const setCardPhase = (v: number): void => {
  phaseNow = v;
};
export const cardPhase = (): number => phaseNow;

/* --------------------------------------------------------------------------
   THE CARD'S OWN SKELETON.

   The intro builds a wireframe before it builds the card, and the wireframe
   is not a table of rectangles written out by hand — it is the real layout,
   measured once. `offsetLeft` and friends are the element's position in its
   own untransformed coordinate space, which for the card's inner flow is
   exactly card-local pixels, so a tilted, scaled, perspective-projected card
   still reports the boxes the particles need.

   Hand-copying the boxes would have been a second description of the layout
   that goes stale the first time a row moves.
   -------------------------------------------------------------------------- */

export type CardRect = { x: number; y: number; w: number; h: number };

let wire: CardRect[] = [];

export const setCardWire = (rects: CardRect[]): void => {
  wire = rects;
};
export const getCardWire = (): CardRect[] => wire;

/** Measure every `[data-hc-el]` inside the card's inner flow, in card-local
 *  pixels. Call it from a layout, never from a frame. */
export function measureWire(inner: HTMLElement | null): CardRect[] {
  if (!inner) return [];
  const out: CardRect[] = [];
  for (const el of Array.from(inner.querySelectorAll<HTMLElement>("[data-hc-el]"))) {
    if (!el.offsetWidth || !el.offsetHeight) continue;
    let x = el.offsetLeft;
    let y = el.offsetTop;
    /* walk up to the card, because a row inside the list is positioned
       against the list and not against the face */
    for (let p = el.offsetParent as HTMLElement | null; p && p !== inner.offsetParent; p = p.offsetParent as HTMLElement | null) {
      x += p.offsetLeft;
      y += p.offsetTop;
    }
    out.push({ x, y, w: el.offsetWidth, h: el.offsetHeight });
  }
  return out;
}

/** Screen pixels to lattice space for the current card, or null when there
 *  is no card to be registered to. Every hero formation goes through it, so
 *  they all agree about where the card is to the pixel. */
export function cardMap(): null | {
  project: (u: number, v: number) => Pt;
  toWorld: (sx: number, sy: number) => Pt;
} {
  const src = source;
  const plane = planeNow;
  if (!src || !plane) return null;
  const { vw, vh } = src;
  const { halfW, halfH, fit, ox, oy } = plane;
  return {
    project: src.project,
    toWorld: (sx, sy) => [
      ((sx / vw) * 2 * halfW - halfW - ox) / fit,
      (halfH - (sy / vh) * 2 * halfH - oy) / fit,
    ],
  };
}
