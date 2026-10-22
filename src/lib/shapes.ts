/* --------------------------------------------------------------------------
   FIVE SHAPES, ONE GRID.

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
  /** HOW FAR INTO THIS STATE THE READER IS, 0 to 1. A shape that only knows
   *  its final form can only be arrived at; one that knows how far through
   *  its own chapter you are can perform. It is what lets the cart roll in,
   *  the gauge fill, the pin land last and the stream gather into a number. */
  phase: number,
) => void;

/* WHICH STATES HAVE TO BE REWRITTEN, AND WHEN. Two different reasons, and
   collapsing them into one set cost a third of the per-frame shape work for
   nothing.

   LIVE states move on their own clock: the sphere turns, the map's events
   pulse. They have to be rewritten every frame wherever they appear.

   ACTING states only move with the reader: the funnel empties, the gauge
   fills, the cart rolls. They have to be rewritten while they are the state
   being arrived at, because that is when their phase is changing — but the
   state being LEFT is always at phase 1, which for these is a constant, so
   it can be written once and cached. */
const LIVE = new Set<string>(["drift", "reach", "signal"]);
const ACTING = new Set<string>(["healthy", "friction", "headroom", "bumper"]);

/** true if this state changes under its own power, wherever it is used */
export const isLive = (name: string): boolean => LIVE.has(name);
/** true if this state changes at all, which is what the scroll loop asks */
export const ANIMATED = new Set<string>([...LIVE, ...ACTING]);

/* THE LATTICE, AND HOW BIG IT IS ON THE DEVICE IN FRONT OF YOU.
   96 x 54 is 5,184 points. At 64 x 36 the spacing came out at about 25 screen
   pixels on a full-height canvas and the weave read as scattered dust; this is
   close enough together to be a surface and still far enough apart that you
   can see the individual points move.

   ON A PHONE IT IS FEWER, and the reason is fill rate, not arithmetic. A
   profile of a full scroll says the main thread is idle 94% of the time and
   the springs cost under two milliseconds a frame, so the loops were never
   the problem; what costs is rasterising thousands of overlapping
   alpha-blended sprites, and that is the one budget a phone GPU is actually
   short of. Halving the points halves the sprites and halves the bytes going
   up the bus with them. A 390 pixel screen showing the object at two thirds
   scale could not resolve five thousand dots anyway.

   Set before the field is built; the buffers are sized from it. */
const LATTICE = { cols: 96, rows: 54, count: 96 * 54 };

export const COLS = () => LATTICE.cols;
export const ROWS = () => LATTICE.rows;
export const COUNT = () => LATTICE.count;

/** Scale the weave, keeping its proportions so nothing that reads it as a
 *  grid has to know. 1 is the full lattice. */
export function setLattice(scale: number): void {
  LATTICE.cols = Math.max(8, Math.round(96 * scale));
  LATTICE.rows = Math.max(8, Math.round(54 * scale));
  LATTICE.count = LATTICE.cols * LATTICE.rows;
}

/** Where point i sits in the weave, -1 to 1 on both axes. */
export function cell(i: number): { u: number; v: number; col: number; row: number } {
  const cols = LATTICE.cols;
  const col = i % cols;
  const row = (i / cols) | 0;
  return {
    col,
    row,
    u: (col / (cols - 1)) * 2 - 1,
    v: 1 - (row / (LATTICE.rows - 1)) * 2,
  };
}

/** Deterministic, so the field is identical on every load and can be checked
 *  against a screenshot. */
function rand(seed: number): number {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

const ASPECT = 1.35;

/* ── 01 to 05, THE PROJECTS ───────────────────────────────────────────────
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

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

/** THE PHASE THE ORIGINAL FOUR WERE TIMED AGAINST. They were written when a
 *  shape's performance and its arrival were one number, and that number ran
 *  out at three quarters of the leg. The field now hands a shape the whole
 *  leg, so putting those four back on the old scale is what makes the change
 *  cost them nothing: every sub-move still happens at the scroll position it
 *  always did. Only Healthy Switch is authored against the full window. */
const authored = (p: number) => clamp01(p / 0.74);

/** where a point sits through the slab, and what that does to it. Shared by
 *  every icon so all four are lit and weighted the same way. */
const sl = { z: 0, scale: 1, lit: 0, size: 1 };
function slab(i: number, e: number): void {
  const band = rand(i * 2.9);
  const j = rand(i * 5.3);
  let z: number;
  let scale = 1;
  if (band < 0.58) z = ICON_DEPTH * (1 - 0.14 * j);
  else if (band < 0.82) z = (j * 2 - 1) * ICON_DEPTH;
  else {
    z = -ICON_DEPTH * (1 - 0.14 * j);
    scale = 0.95;
  }
  const face = (z / ICON_DEPTH + 1) / 2;
  sl.z = z;
  sl.scale = scale;
  sl.lit = Math.pow(face, 2.2) * (0.55 + 0.45 * e);
  sl.size = (1.5 + 1.5 * e) * (0.45 + 0.55 * face);
}

/** an extruded icon written into a slice of the buffers, so a formation can
 *  be an icon plus the things around it rather than only an icon */
function writeIcon(
  key: string,
  pos: Float32Array,
  lit: Float32Array,
  size: Float32Array,
  n: number,
  from: number,
  count: number,
  s: number,
  ox: number,
  oy: number,
): void {
  const { xy, edge } = iconPoints(key, ICONS[key], count);
  for (let k = 0; k < count; k++) {
    const i = from + k;
    if (i >= n) break;
    slab(i, edge[k]);
    pos[i * 3] = xy[k * 2] * s * sl.scale + ox;
    pos[i * 3 + 1] = xy[k * 2 + 1] * s * sl.scale + oy;
    pos[i * 3 + 2] = sl.z;
    lit[i] = sl.lit;
    size[i] = sl.size;
  }
}

/* ── 01 HEALTHY SWITCH ─ the toggle, and the one thing it changes ────────
   The product is named after a control, and the prototype puts that control
   in the header, so the object is the control. What makes it a product
   rather than a settings screen is what happens to the meal beside it when
   it is thrown.

   KEEP THE BURGER, SWAP THE FRIES. That is the case study's own sentence and
   it is why the burger is here at all: it never moves. A formation where the
   burger turned into a salad would say the opposite of the thing it stands
   for, which is that you do not have to give up the craving.

   THE COLOUR ARRIVES WITH THE SWITCH. The case study is called "From red to
   green", and this page has one accent per chapter, so that arc cannot be
   told in hue here. It is told in light instead: nothing is lit until the
   switch is thrown, and the accent comes up on the track behind the knob and
   on the leaf as it lands. Off to on, which is the same sentence in the
   palette the page actually has. */
const TOGGLE = { y: -0.6, hw: 0.52, r: 0.19 };
/** the track and the knob, as shares of the lattice. The meal takes the rest
 *  and splits it between the half that stays and the half that changes. */
const TRACK_SHARE = 0.17;
const KNOB_SHARE = 0.12;
/** the side is the one thing on this shape anybody has to read twice, so it
 *  gets the room. Smaller than this and five stick gaps are three dots each. */
const SIDE_SCALE = 0.38;

export const healthy: ShapeWriter = (pos, lit, size, n, _time, phase) => {
  const trackN = Math.round(n * TRACK_SHARE);
  const knobN = Math.round(n * KNOB_SHARE);
  const rest = n - trackN - knobN;
  const burgerN = Math.round(rest * 0.5);
  const sideN = rest - burgerN;

  /* BOTH OF THESE HAPPEN AFTER THE SHAPE HAS ARRIVED, and that is the only
     reason either of them is seen. The lattice finishes assembling at about
     0.65 of the leg: anything timed before that plays out inside a cloud that
     has not decided what it is yet, which is where the first version put the
     entire swap. So the toggle sits off while the meal forms, throws, and the
     side follows it over. The throw leads, because that is what makes the two
     of them read as cause and effect rather than as two things happening. */
  const s = clamp01((phase - 0.66) / 0.2);
  const slide = 1 - Math.pow(1 - s, 3);
  const f = clamp01((phase - 0.76) / 0.21);
  const flip = f * f * (3 - 2 * f);

  const { y: ty, hw, r } = TOGGLE;
  const run = hw - r;
  const knobX = -run + slide * 2 * run;

  /* 1. THE TRACK, walked as a perimeter rather than sampled as an icon: a
        capsule is four exact pieces, and a raster of one is a worse capsule. */
  const flat = 2 * run;
  const cap = Math.PI * r;
  const perim = 2 * flat + 2 * cap;
  for (let j = 0; j < trackN; j++) {
    const d = (j / trackN) * perim;
    let x: number;
    let y: number;
    if (d < flat) {
      x = -run + d;
      y = ty + r;
    } else if (d < flat + cap) {
      const a = Math.PI / 2 - (d - flat) / r;
      x = run + Math.cos(a) * r;
      y = ty + Math.sin(a) * r;
    } else if (d < 2 * flat + cap) {
      x = run - (d - flat - cap);
      y = ty - r;
    } else {
      const a = -Math.PI / 2 - (d - 2 * flat - cap) / r;
      x = -run + Math.cos(a) * r;
      y = ty + Math.sin(a) * r;
    }
    /* behind the knob is on; ahead of it is the track it has still to cross,
       which is an absence you can see, the way the dial's empty arc is */
    const on = x <= knobX;
    pos[j * 3] = x;
    pos[j * 3 + 1] = y;
    pos[j * 3 + 2] = (rand(j * 3.1) - 0.5) * 0.09;
    lit[j] = on ? 1 : 0;
    size[j] = on ? 2.9 : 1.05;
  }

  /* 2. THE KNOB, a puck and not a disc. It is the only part of this shape the
        reader watches travel, so it is the part that has to have a side. */
  const kr = r * 0.7;
  const rimN = Math.round(knobN * 0.55);
  for (let j = 0; j < knobN; j++) {
    const i = trackN + j;
    const rim = j < rimN;
    const a = rim ? (j / rimN) * Math.PI * 2 : rand(j * 9.1) * Math.PI * 2;
    const rr = rim ? kr : kr * Math.sqrt(rand(j * 4.3)) * 0.9;
    pos[i * 3] = knobX + Math.cos(a) * rr;
    pos[i * 3 + 1] = ty + Math.sin(a) * rr;
    pos[i * 3 + 2] = (rand(j * 2.3) - 0.5) * 0.3;
    lit[i] = rim ? 1 : 0.3;
    size[i] = rim ? 3 : 1.7;
  }

  /* 3. THE BURGER, AND IT DOES NOT MOVE. */
  writeIcon("burger", pos, lit, size, n, trackN + knobN, burgerN, 0.4, -0.44, 0.34);

  /* 4. THE SIDE, which is the only thing that changes. It travels while it
        changes, up over a short arc and out toward the reader, because a swap
        that happens in place is a crossfade between two pictures, and a
        crossfade is the one thing a lattice is worse at than a video is. */
  const base = trackN + knobN + burgerN;
  const fries = iconPoints("fries", ICONS.fries, sideN);
  const leafy = iconPoints("leaf", ICONS.leaf, sideN);
  const arc = Math.sin(flip * Math.PI);
  for (let k = 0; k < sideN; k++) {
    const i = base + k;
    if (i >= n) break;
    const e = fries.edge[k] * (1 - flip) + leafy.edge[k] * flip;
    slab(i, e);
    const fx = fries.xy[k * 2] * SIDE_SCALE;
    const fy = fries.xy[k * 2 + 1] * SIDE_SCALE;
    const lx = leafy.xy[k * 2] * SIDE_SCALE;
    const ly = leafy.xy[k * 2 + 1] * SIDE_SCALE;
    pos[i * 3] = (fx + (lx - fx) * flip) * sl.scale + 0.46;
    pos[i * 3 + 1] = (fy + (ly - fy) * flip) * sl.scale + 0.34 + arc * 0.2;
    pos[i * 3 + 2] = sl.z + arc * 0.26;
    /* unlit as fries, lit as a leaf: the accent is the thing you turned on */
    lit[i] = sl.lit * flip;
    size[i] = sl.size * (1 + 0.35 * arc);
  }
};

/* ── 02 FRICTION ─ the filter, and what comes out of it ──────────────────
   The funnel holds while the claim beside it is being read, and in the second
   half of the chapter the stream below the throat gathers into the number the
   product actually publishes. Ten thousand in, a hundred and fifty out: the
   shape states the mechanic and then states the result, which is more than
   either of them could do on its own. */
/** WHICH POINTS ARE THE CONTENTS AND NOT THE VESSEL, worked out once.
 *
 *  Two rules, and the second one is the lesson. Interior rather than outline,
 *  so what leaves is the stuff inside the funnel and the funnel is still
 *  drawn after it has gone. And above the throat only: the first version took
 *  the whole interior including the spout's, and a funnel whose spout has
 *  emptied is a bowl.
 *
 *  They also go to a CONTIGUOUS run of the numeral's points. Mapping each one
 *  to the numeral point of the same index spread a fifth of them across the
 *  whole of "150" at a fifth of the density, and it never resolved into
 *  anything you could read. */
let streamOf: number[] | null = null;
function stream(n: number, edge: Float32Array, xy: Float32Array): number[] {
  if (streamOf) return streamOf;
  const out: number[] = [];
  for (let i = 0; i < n; i++) if (edge[i] < 0.5 && xy[i * 2 + 1] > -0.06) out.push(i);
  streamOf = out;
  return out;
}

/** how far the funnel pulls back to make room for its own answer */
const SIFT_LIFT = 0.42;

export const friction: ShapeWriter = (pos, lit, size, n, _time, p) => {
  const phase = authored(p);
  const { xy, edge } = iconPoints("friction", ICONS.friction, n);
  const u = clamp01((phase - 0.46) / 0.4);
  const ease = u * u * (3 - 2 * u);

  /* the funnel first, whole, drawing back and up as the answer arrives */
  const s = ICON_SCALE * (1 - 0.28 * ease);
  const lift = SIFT_LIFT * ease;
  for (let i = 0; i < n; i++) {
    slab(i, edge[i]);
    pos[i * 3] = xy[i * 2] * s * sl.scale;
    pos[i * 3 + 1] = xy[i * 2 + 1] * s * sl.scale + lift;
    pos[i * 3 + 2] = sl.z;
    lit[i] = sl.lit;
    size[i] = sl.size;
  }
  if (ease <= 0) return;

  /* then what came through it gathers below the spout into the number the
     product actually publishes. Ten thousand in, a hundred and fifty out. */
  const run = stream(n, edge, xy);
  const num = iconPoints("num150", ICONS.num150, run.length);
  for (let k = 0; k < run.length; k++) {
    const i = run[k];
    const nx = num.xy[k * 2] * 1.1;
    const ny = num.xy[k * 2 + 1] * 1.1 - 0.62;
    pos[i * 3] += (nx - pos[i * 3]) * ease;
    pos[i * 3 + 1] += (ny - pos[i * 3 + 1]) * ease;
    /* flat, so the number is read rather than inspected */
    pos[i * 3 + 2] *= 1 - ease * 0.72;
    lit[i] = Math.max(lit[i], ease);
    size[i] = size[i] * (1 - ease) + 2.6 * ease;
  }
};

/* ── 03 HEADROOM ─ the money, and how much of it is spoken for ───────────
   A dial. The ring is the month, the arc filling clockwise is what is already
   committed, and the gap left at the end of it is the answer to the question
   the product exists to answer. */
const RING_SHARE = 0.24;
/* THE ONE FORMATION WIDER THAN THE ICONS, so it is the one that decides
   whether anything clips. At 0.99 the dial touched both gutters on a 390
   phone and would have run off a 360 one; this leaves a tenth of the frame
   either side and still reads as a dial filling the width. */
const RING_R = 0.92;
export const headroom: ShapeWriter = (pos, lit, size, n, _time, p) => {
  const phase = authored(p);
  const ringN = Math.round(n * RING_SHARE);
  writeIcon("headroom", pos, lit, size, n, ringN, n - ringN, ICON_SCALE * 0.64, 0, 0);

  const filledTo = 0.76 * clamp01(phase);
  for (let j = 0; j < ringN; j++) {
    const frac = j / ringN;
    /* clockwise from the top, because that is the direction a dial reads */
    const a = Math.PI / 2 - frac * Math.PI * 2;
    const filled = frac <= filledTo;
    pos[j * 3] = Math.cos(a) * RING_R;
    pos[j * 3 + 1] = Math.sin(a) * RING_R;
    pos[j * 3 + 2] = (rand(j * 3.1) - 0.5) * 0.1;
    lit[j] = filled ? 1 : 0;
    /* the unfilled part is a track, not an absence: you have to be able to
       see how much of the ring is left */
    size[j] = filled ? 3.1 : 1.05;
  }
};

/* ── 04 SIGNAL ─ the map, and what is on tonight ─────────────────────────
   The Beltway, the District inside it, the Potomac through both. Twelve
   brighter points are the events, and the pin is a small thing that lands on
   one of them rather than standing in for the whole idea. */
const EVENTS = 12;
const PIN_N = 440;
/** roughly where things happen, in the same box the map is drawn in */
const WHERE: Array<[number, number]> = [
  [-0.08, 0.02],
  [0.14, -0.06],
  [-0.26, -0.18],
  [0.3, 0.18],
  [-0.34, 0.26],
  [0.08, 0.34],
  [0.4, -0.24],
  [-0.44, -0.06],
  [0.2, -0.4],
  [-0.14, -0.44],
  [0.48, 0.06],
  [-0.02, 0.5],
];
/** which one the pin lands on */
const LANDS = 5;
export const signal: ShapeWriter = (pos, lit, size, n, time, p) => {
  const phase = authored(p);
  const head = EVENTS + PIN_N;
  writeIcon("signal", pos, lit, size, n, head, n - head, ICON_SCALE, 0, 0);

  for (let j = 0; j < EVENTS; j++) {
    const x = WHERE[j][0] * ICON_SCALE;
    const y = WHERE[j][1] * ICON_SCALE;
    pos[j * 3] = x;
    pos[j * 3 + 1] = y;
    pos[j * 3 + 2] = 0.14;
    lit[j] = 1;
    /* out of step with each other, because a dozen things happening in time
       with each other is one thing happening */
    size[j] = 4.6 + 1.9 * Math.sin(time * 1.5 + j * 1.9);
  }

  /* the pin falls in the last third and lands on one of them */
  const drop = clamp01((phase - 0.62) / 0.3);
  const land = drop * drop * (3 - 2 * drop);
  const lx = WHERE[LANDS][0] * ICON_SCALE;
  const ly = WHERE[LANDS][1] * ICON_SCALE;
  const pin = iconPoints("pin", ICONS.pin, PIN_N);
  for (let k = 0; k < PIN_N; k++) {
    const i = EVENTS + k;
    pos[i * 3] = pin.xy[k * 2] * 0.26 + lx;
    /* the pin's own point sits on the event, so the shape hangs above it */
    pos[i * 3 + 1] = (pin.xy[k * 2 + 1] + 1) * 0.26 + ly + (1 - land) * 1.1;
    pos[i * 3 + 2] = 0.32;
    lit[i] = land;
    size[i] = 1.7 + 1.9 * land;
  }
};

/* ── 05 BUMPER ─ the cart, and the thing in its way ──────────────────────
   It rolls in from the left along a line of its own points, meets the bump,
   and settles. The spring does the settling: it is already under-damped, so
   the overshoot at the end is physics and not a keyframe. */
const GROUND_SHARE = 0.09;
export const bumper: ShapeWriter = (pos, lit, size, n, _time, leg) => {
  const phase = authored(leg);
  const groundN = Math.round(n * GROUND_SHARE);

  const p = clamp01(phase / 0.86);
  /* fast at first and slower as it arrives, which is what something with
     mass does when it stops being pushed */
  const travel = 1 - Math.pow(1 - p, 3);
  const cx = -2.2 + 2.2 * travel;
  const over = clamp01((p - 0.6) / 0.26);
  const hop = Math.sin(over * Math.PI) * 0.075;

  writeIcon("bumper", pos, lit, size, n, groundN, n - groundN, ICON_SCALE, cx, hop);

  for (let j = 0; j < groundN; j++) {
    const f = j / (groundN - 1);
    const x = -1.3 + f * 2.6;
    /* the bump itself: a small rise the cart has to climb */
    const lump = Math.exp(-Math.pow((x - 0.5) / 0.12, 2)) * 0.1;
    pos[j * 3] = x;
    pos[j * 3 + 1] = -0.82 + lump;
    pos[j * 3 + 2] = (rand(j * 7.7) - 0.5) * 0.03;
    lit[j] = lump > 0.02 ? 1 : 0;
    /* behind the cart the ground is still lit from it passing: speed lines,
       and they go out as it comes to rest */
    const behind = x < cx - 0.2 && x > cx - 1.3 ? 1 - travel : 0;
    size[j] = 1.1 + lump * 14 + behind * 1.7;
  }
};


/* ── 00 THE OPENING, AND THE CLOSE ───────────────────────────────────────
   A sphere, and a real one: points placed on a golden spiral so the spacing
   is even everywhere, with no poles where they crowd and no seam where they
   meet. A latitude-longitude grid is easier and gives both away immediately.

   IT HAS TO STAY A SPHERE AT EVERY ASPECT RATIO, which is the argument for
   building it in world space and letting the camera see it rather than
   drawing an ellipse that happens to look round at one window size.

   It turns at about six degrees a second, which is slow enough to be
   furniture and enough to be alive, and a long wave crosses its surface so
   it reads as something breathing rather than something machined. The page
   ends on it too: the contact section is this shape again, which is the only
   way to say that the sequence is over.  */

/** how far the sphere reaches. Wider than the icons, because it is the only
 *  state with nothing beside it to be read against. */
const SPHERE = 1.06;

export const drift: ShapeWriter = (pos, lit, size, n, time) => {
  const spin = time * 0.105;
  const cs = Math.cos(spin);
  const sn = Math.sin(spin);
  for (let i = 0; i < n; i++) {
    /* the golden spiral. acos of an even step in height is what keeps the
       spacing even: stepping the angle instead piles them at the poles. */
    const k = i + 0.5;
    const phi = Math.acos(1 - (2 * k) / n);
    const theta = Math.PI * (1 + Math.sqrt(5)) * k;
    const sp = Math.sin(phi);
    const x0 = Math.cos(theta) * sp;
    const y = Math.cos(phi);
    const z0 = Math.sin(theta) * sp;

    const x = x0 * cs - z0 * sn;
    const z = x0 * sn + z0 * cs;

    /* a long swell across the surface, two trains at different rates so it
       never repeats on a beat anyone can anticipate */
    const swell =
      1 + 0.045 * Math.sin(y * 3.4 + time * 0.5) + 0.03 * Math.cos(x * 2.6 - time * 0.37);

    pos[i * 3] = x * SPHERE * swell;
    pos[i * 3 + 1] = y * SPHERE * swell;
    pos[i * 3 + 2] = z * SPHERE * swell;

    /* the hemisphere facing you carries the weight; the far side falls away
       to almost nothing, which is what makes a cloud of dots read as a solid
       rather than as a ring */
    const face = (z + 1) * 0.5;
    lit[i] = 0;
    size[i] = 0.75 + 2.4 * face * face;
  }
};

/** Reduced motion gets the same sheet, frozen. */
export const rest: ShapeWriter = (pos, lit, size, n) => drift(pos, lit, size, n, 0, 1);


/* ── 06 REACH ─────────────────────────────────────────────────────────────
   The last state. Four screens of taking a mess and returning one clear
   thing, and then the lattice does it once more for the page itself: it
   resolves into the two ways to reach Jay.

   At rest it is a shallow dish opening toward the reader, which is as close
   as a lattice gets to an open hand. Hovering either button pulls it into
   what that button does, which is the only reason the hover is worth having:
   the field is answering the question the button asks.
   ------------------------------------------------------------------------ */

export const reach: ShapeWriter = (pos, lit, size, n, time) => {
  /* THE PAGE ENDS WHERE IT BEGAN. The contact section is the hero's sphere
     re-formed, which is the only way to say that the sequence is over without
     writing it down. It holds back to a little over a third of its weight so
     the two things you are being asked to press are unmistakably in front of
     it. */
  drift(pos, lit, size, n, time, 1);
};

/* Hovering EMAIL. Everything gathers into one stream and leaves: a message
   being sent, which is the single thing the button does. The leading edge is
   lit, because that is the part that has already gone. */

export const sent: ShapeWriter = (pos, lit, size, n) => {
  for (let i = 0; i < n; i++) {
    const { u, v, col } = cell(i);
    const along = col / (COLS() - 1);
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

export const SHAPES = { rest, drift, healthy, friction, headroom, signal, bumper, reach, sent, network } as const;
export type ShapeName = keyof typeof SHAPES;

/* ── HOW EACH SHAPE ASSEMBLES ─────────────────────────────────────────────
   A morph where every point sets off at once reads as a crossfade between
   two pictures. Staggering them turns it into a wave, and which way the wave
   runs is free meaning: the filter fills from the top because that is the
   direction things fall through it, the money fills around because that is
   how a dial moves, the map draws along its own outline like a pen, and the
   cart fills left to right because that is the way it travels.

   "index" uses the order the points were sampled in, which for the icons is
   angle around the centre, so it draws the silhouette rather than sweeping
   across it. */
export type Wave = "down" | "around" | "along" | "across";

export const WAVES: Record<ShapeName, Wave> = {
  rest: "down",
  drift: "down",
  healthy: "across",
  friction: "down",
  headroom: "around",
  signal: "along",
  bumper: "across",
  reach: "around",
  sent: "across",
  network: "around",
};
