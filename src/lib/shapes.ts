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

/* ── 01 FRICTION ──────────────────────────────────────────────────────────
   A sieve. The lattice is squeezed: every row narrower than the one above it,
   so ten thousand reviews at the top arrive as a handful at the throat. The
   survivors are the bottom row, lit and large, because the product publishes
   a countable set and not a vibe. */

export const SURVIVORS = 25;

/** The 25 cells that make it through, picked once and deterministically so
 *  the knot is the same knot on every load. */
const survivorSet = (() => {
  const set = new Set<number>();
  let k = 0;
  while (set.size < SURVIVORS && k < 400) {
    const row = ROWS - 1 - (k % 3);
    const col = Math.floor(rand(k * 4.7) * COLS);
    set.add(row * COLS + col);
    k++;
  }
  return set;
})();

export const friction: ShapeWriter = (pos, lit, size, n) => {
  let seen = 0;
  for (let i = 0; i < n; i++) {
    const { u, v } = cell(i);
    /* rows converge toward the throat: the narrowing IS the filtering */
    const t = (1 - v) / 2;
    const narrow = 1 - 0.94 * Math.pow(t, 1.5);
    const survivor = survivorSet.has(i);

    if (survivor) {
      /* A KNOT, NOT A ROW. Letting the bottom rows simply arrive narrow drew
         two flat lines of sixty-four, which is neither countable nor the
         twenty-five the product actually publishes. These twenty-five leave
         the weave at the throat and gather, because they are the output and
         should look like a different kind of thing from the input. */
      const a = seen * 2.399963;
      const r = 0.085 * Math.sqrt((seen + 0.5) / SURVIVORS);
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = -1.04 + Math.sin(a) * r * 0.8;
      pos[i * 3 + 2] = (rand(i * 2.7) - 0.5) * 0.12;
      lit[i] = 1;
      size[i] = 7;
      seen++;
      continue;
    }

    pos[i * 3] = u * ASPECT * narrow;
    pos[i * 3 + 1] = v * 0.95;
    /* a shallow bowl, so the sieve has a mouth rather than being a flat fan */
    pos[i * 3 + 2] = (1 - narrow) * -0.45 + Math.cos(u * 1.4) * 0.12 * narrow;
    lit[i] = 0;
    size[i] = 1.8 + 1.3 * narrow;
  }
};

/* ── 02 HEADROOM ──────────────────────────────────────────────────────────
   A subtraction. The lattice splits across one line: everything above it is
   already committed and lifts away, and the short lit band left underneath is
   what is actually safe to spend. The gap between them is the product. */

const SAFE_ROWS = 7;

export const headroom: ShapeWriter = (pos, lit, size, n) => {
  for (let i = 0; i < n; i++) {
    const { u, v, row } = cell(i);
    const safe = row >= ROWS - SAFE_ROWS;

    /* committed rides up and away; safe settles. The distance between them is
       the only number the product ever shows you. */
    const y = safe ? -0.92 + (ROWS - 1 - row) * 0.055 : v * 0.78 + 0.26;

    pos[i * 3] = u * ASPECT * (safe ? 0.82 : 1);
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = Math.sin(u * 2.1) * 0.1;

    lit[i] = safe ? 1 : 0;
    size[i] = safe ? 5.4 : 1.9;
  }
};

/* ── 03 SIGNAL ────────────────────────────────────────────────────────────
   A map. The lattice lies down into a ground plane and the events that are
   actually happening stand up off it. Scattered sources become one surface
   you can read in a glance.

   The plane is authored already foreshortened rather than laid flat in XZ,
   because a flat plane is edge-on to a camera at eye level and the whole map
   collapses into a streak. */

export const signal: ShapeWriter = (pos, lit, size, n) => {
  for (let i = 0; i < n; i++) {
    const { u, v, col, row } = cell(i);
    /* a sparse, irregular scatter of live events, fixed per cell so the pins
       are in the same places every time */
    const pin = rand(col * 7.3 + row * 13.1) > 0.9962;
    const depth = (v + 1) / 2;

    const groundY = -0.46 + depth * 0.62;
    pos[i * 3] = u * ASPECT * (0.62 + 0.38 * (1 - depth));
    pos[i * 3 + 1] = pin ? groundY + 0.22 : groundY;
    pos[i * 3 + 2] = -depth * 1.1;

    lit[i] = pin ? 1 : 0;
    size[i] = pin ? 7 : 1.5 + 1.7 * (1 - depth);
  }
};

/* ── 04 BUMPER ────────────────────────────────────────────────────────────
   A pause. The lattice runs left to right, meets one barrier and banks up
   against it: the columns compress as they approach, which is what a queue
   looks like. A few still go through, because it slows you down, it does not
   stop you. */

export const bumper: ShapeWriter = (pos, lit, size, n) => {
  const WALL = 0.2;
  for (let i = 0; i < n; i++) {
    const { u, v, col, row } = cell(i);
    /* a regular sparse trail, not a random one: picking these at random
       scattered them into a scribble, and a scribble is not "a few got
       through", it is noise */
    const through = col > COLS - 13 && (col + row * 3) % 9 === 0;
    const barrier = col === COLS - 13;

    if (barrier) {
      pos[i * 3] = WALL;
      pos[i * 3 + 1] = v * 0.72;
      pos[i * 3 + 2] = 0;
      lit[i] = 1;
      size[i] = 5.6;
      continue;
    }

    const t = (u + 1) / 2;
    if (through) {
      const past = (col - (COLS - 13)) / 12;
      pos[i * 3] = WALL + 0.12 + past * 0.9;
      pos[i * 3 + 1] = v * 0.34;
      size[i] = 1.9;
    } else {
      /* COMPRESSED AT THE WALL, NOT AWAY FROM IT. The first curve bunched the
         columns at the upstream end, which draws a queue flowing away from
         the barrier it is supposed to be stuck behind. Easing the other way
         spaces them evenly upstream and jams them where they stop. */
      const packed = 1 - Math.pow(1 - Math.min(1, t / 0.87), 2.1);
      pos[i * 3] = -1.45 + packed * (WALL + 1.45);
      pos[i * 3 + 1] = v * 0.72;
      size[i] = 1.7 + 1.9 * packed;
    }
    pos[i * 3 + 2] = Math.sin(v * 2.4) * 0.16;
    lit[i] = 0;
  }
};

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
