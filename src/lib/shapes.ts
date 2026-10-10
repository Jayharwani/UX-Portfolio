/* --------------------------------------------------------------------------
   FOUR SHAPES, ONE GRID.

   Every one of Jay's products does the same thing: it takes a mess and gives
   back one clear thing. Ten thousand reviews become the problems that repeat.
   A balance that lies becomes one number you can spend. Events scattered over
   three states become one map. An impulse becomes one question.

   So the homepage is a single lattice that is never created and never
   destroyed, only deformed, and each deformation is that product's actual
   mechanic rather than a picture standing next to it.

   IT IS A GRID, NOT A CLOUD, AND THAT IS THE WHOLE DIFFERENCE. The first
   version scattered nine thousand points with random jitter and it read as
   static: scientific plotting, not design. A lattice has structure to lose,
   so when it bends you can see it bending, and every point keeps its place in
   the weave instead of being reshuffled into a new pile. That is what makes
   the morph legible and what makes it calm. Fewer points, larger, deliberate.

   Each shape writes three things per point: where it goes, how brightly it
   burns, and how big it is. "Lit" is the survivor of whatever the product
   does, which is why the lit points are always the few.

   Coordinates stay inside roughly -1.2 to 1.2 on every axis, so the camera
   never has to be re-framed between states.
   -------------------------------------------------------------------------- */

import { ICONS, iconPoints } from "./icons";

export type ShapeWriter = (
  pos: Float32Array,
  lit: Float32Array,
  size: Float32Array,
  n: number,
  /** seconds since the field started, for the states that are alive */
  time: number,
) => void;

/** the states that have to be recomputed every frame rather than only when
 *  the scroll moves */
export const ANIMATED = new Set<string>(["drift"]);

/** The lattice. 96 x 54 is 5,184 points. At 64 x 36 the spacing came out at
 *  about 25 screen pixels on a full-height canvas and the weave read as
 *  scattered dust; this is close enough together to be a surface and still
 *  far enough apart that you can see the individual points move. */
export const COLS = 96;
export const ROWS = 54;
export const COUNT = COLS * ROWS;

/** Where point i sits in the weave, -1 to 1 on both axes. */
export function cell(i: number): { u: number; v: number; col: number; row: number } {
  const col = i % COLS;
  const row = (i / COLS) | 0;
  return {
    col,
    row,
    u: (col / (COLS - 1)) * 2 - 1,
    v: 1 - (row / (ROWS - 1)) * 2,
  };
}

/** Deterministic, so the field is identical on every load and can be checked
 *  against a screenshot. */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const ASPECT = 1.35;

/* ── 01 to 04, THE PROJECTS ───────────────────────────────────────────────
   Each one resolves into the object somebody would draw if you asked them
   what the product was. A filter, money, a pin on a map, a cart. They were
   abstract diagrams before, which was honest and cost the reader a beat they
   do not spend.

   EXTRUDED, NOT CUT OUT. Every icon is given real thickness, because a flat
   silhouette facing the camera would throw away every depth cue the renderer
   has, and the camera orbits past it.

   THREE BANDS, NOT A RANDOM DEPTH. Scattering z evenly through the slab put
   half the points behind the other half at every pixel, so the accent and the
   paper salted together and the object had no surface anywhere. A dense front
   face, a thin wall and a sparse inset back is what an extrusion actually
   looks like: one lit plane you read, an edge that proves the thickness, and
   a ghost behind it that only shows when the camera moves.
   ------------------------------------------------------------------------ */

/** how far the icon reaches from the middle. Smaller than the old diagrams
 *  on purpose: the copy column has to stay readable, and a shape that runs
 *  under the headline is a layout bug however good it looks. */
const ICON_SCALE = 0.86;
/** thickness, in the same units */
const ICON_DEPTH = 0.34;

function icon(key: string): ShapeWriter {
  return (pos, lit, size, n) => {
    const { xy, edge } = iconPoints(key, ICONS[key], n);
    for (let i = 0; i < n; i++) {
      const band = rand(i * 2.9);
      const j = rand(i * 5.3);

      let z: number;
      /* the back face sits a little inside the front one, so the two
         silhouettes read as a bevel rather than as a doubled print */
      let scale = ICON_SCALE;
      if (band < 0.58) {
        z = ICON_DEPTH * (1 - 0.14 * j);
      } else if (band < 0.82) {
        z = (j * 2 - 1) * ICON_DEPTH;
      } else {
        z = -ICON_DEPTH * (1 - 0.14 * j);
        scale = ICON_SCALE * 0.95;
      }

      pos[i * 3] = xy[i * 2] * scale;
      pos[i * 3 + 1] = xy[i * 2 + 1] * scale;
      pos[i * 3 + 2] = z;

      /* the front face carries the colour, and how close a point is to the
         outline carries the weight: the edge is drawn, the fill is texture */
      const face = (z / ICON_DEPTH + 1) / 2;
      const e = edge[i];
      lit[i] = Math.pow(face, 2.2) * (0.55 + 0.45 * e);
      size[i] = (1.5 + 1.5 * e) * (0.45 + 0.55 * face);
    }
  };
}

export const friction: ShapeWriter = icon("friction");
export const headroom: ShapeWriter = icon("headroom");
export const signal: ShapeWriter = icon("signal");
export const bumper: ShapeWriter = icon("bumper");

/* ── 00 THE OPENING ───────────────────────────────────────────────────────
   What the hero is: a sheet of the same material, suspended, breathing.

   IT USED TO BE A FLAT EVEN GRID AND THAT WAS THE PROBLEM. A rectangle of
   dots facing the camera is wallpaper: no depth, no silhouette, no reason to
   look, and a hard edge that cut straight through the headline. The three
   things that make this an object instead are a travelling wave through it, a
   soft edge where the sheet dissolves rather than being cropped, and near
   points drawn larger than far ones so the undulation reads as depth and not
   as a pattern.

   Two wave trains at different rates and directions, so it never repeats on
   any beat a viewer can anticipate. This is the calm the rest of the page is
   measured against, so it moves slowly enough to be furniture and enough to
   be alive. */

export const drift: ShapeWriter = (pos, lit, size, n, time) => {
  for (let i = 0; i < n; i++) {
    const { u, v } = cell(i);
    const x = u * ASPECT;
    const y = v * 0.9;

    /* how far out this point is, for the soft edge */
    const r = Math.min(1, Math.hypot(u * 0.92, v));
    const edge = 1 - r * r * r;

    const w =
      Math.sin(u * 2.1 + time * 0.42) * 0.3 +
      Math.sin(v * 2.7 - time * 0.33) * 0.22 +
      Math.sin((u + v) * 1.4 + time * 0.21) * 0.14;

    pos[i * 3] = x;
    pos[i * 3 + 1] = y + w * 0.16 * edge;
    /* the sheet leans away at the rim, so it ends rather than being cut off */
    pos[i * 3 + 2] = w * edge - (1 - edge) * 1.1;

    lit[i] = 0;
    /* Near is bigger, so the wave reads as a surface and not a pattern. The
       rim goes to nothing rather than merely getting small: leaving it at a
       quarter size drew a faint rectangle around the whole form, which put
       back exactly the boxy silhouette the soft edge exists to remove. */
    size[i] = (1.7 + 1.9 * (0.5 + 0.5 * Math.sin(u * 2.1 + time * 0.42))) * edge;
  }
};

/** Reduced motion gets the same sheet, frozen. */
export const rest: ShapeWriter = (pos, lit, size, n) => drift(pos, lit, size, n, 0);


/* ── 05 REACH ─────────────────────────────────────────────────────────────
   The last state. Four screens of taking a mess and returning one clear
   thing, and then the lattice does it once more for the page itself: it
   resolves into the two ways to reach Jay.

   At rest it is a shallow dish opening toward the reader, which is as close
   as a lattice gets to an open hand. Hovering either button pulls it into
   what that button does, which is the only reason the hover is worth having:
   the field is answering the question the button asks.
   ------------------------------------------------------------------------ */

export const reach: ShapeWriter = (pos, lit, size, n) => {
  for (let i = 0; i < n; i++) {
    const { u, v } = cell(i);
    const x = u * ASPECT;
    const y = v * 0.8;
    /* a dish: the edges lean toward the viewer, the middle sits back */
    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = (x * x * 0.3 + y * y * 0.38) - 0.5;
    lit[i] = 0;
    size[i] = 2.1;
  }
};

/* Hovering EMAIL. Everything gathers into one stream and leaves: a message
   being sent, which is the single thing the button does. The leading edge is
   lit, because that is the part that has already gone. */

export const sent: ShapeWriter = (pos, lit, size, n) => {
  for (let i = 0; i < n; i++) {
    const { u, v, col } = cell(i);
    const along = (col / (COLS - 1));
    /* a narrow beam angled up and to the right, tightening as it travels */
    const taper = 1 - 0.88 * Math.pow(along, 0.8);
    const drift = (rand(i * 3.3) - 0.5) * 0.1;

    pos[i * 3] = -1.3 + along * 2.7;
    pos[i * 3 + 1] = -0.5 + along * 1.15 + v * 0.5 * taper + drift;
    pos[i * 3 + 2] = u * 0.42 * taper;

    const leading = along > 0.9;
    lit[i] = leading ? 1 : 0;
    size[i] = leading ? 4.2 : 1.1 + 1.6 * (1 - along);
  }
};

/* Hovering LINKEDIN. The lattice gathers into clusters around hubs, which is
   what a professional network is: not a logo, the thing the logo stands for.
   Fourteen hubs, every point belonging to one of them. */

const HUBS = 14;

export const network: ShapeWriter = (pos, lit, size, n) => {
  /* hub positions, fixed so the constellation is the same constellation */
  const hx: number[] = [];
  const hy: number[] = [];
  const hz: number[] = [];
  for (let h = 0; h < HUBS; h++) {
    const a = h * 2.399963;
    const r = 0.95 * Math.sqrt((h + 0.5) / HUBS);
    hx.push(Math.cos(a) * r * ASPECT);
    hy.push(Math.sin(a) * r * 0.82);
    hz.push((rand(h * 5.9) - 0.5) * 0.7);
  }

  for (let i = 0; i < n; i++) {
    const h = i % HUBS;
    const t = (i / n);
    const isHub = i >= n - HUBS;

    if (isHub) {
      const k = i - (n - HUBS);
      pos[i * 3] = hx[k];
      pos[i * 3 + 1] = hy[k];
      pos[i * 3 + 2] = hz[k];
      lit[i] = 1;
      size[i] = 6;
      continue;
    }

    /* each point sits on the line between its hub and the next one round, so
       the clusters read as connected rather than as fourteen separate blobs */
    const next = (h + 5) % HUBS;
    const f = Math.pow(rand(i * 1.9), 1.7);
    const jitter = (rand(i * 7.1) - 0.5) * 0.09;

    pos[i * 3] = hx[h] + (hx[next] - hx[h]) * f + jitter;
    pos[i * 3 + 1] = hy[h] + (hy[next] - hy[h]) * f + jitter;
    pos[i * 3 + 2] = hz[h] + (hz[next] - hz[h]) * f;
    lit[i] = 0;
    size[i] = 1.5 + 1.1 * (1 - f);
    void t;
  }
};

export const SHAPES = { rest, drift, friction, headroom, signal, bumper, reach, sent, network } as const;
export type ShapeName = keyof typeof SHAPES;
