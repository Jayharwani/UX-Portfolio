/* --------------------------------------------------------------------------
   THE EMBLEMS, AS CODE.

   There is no drawing tool in this build, and these files are never edited by
   hand. Change a spec here, run build.mjs, and the SVGs under
   src/assets/emblems/ are rewritten. Each one becomes real extruded geometry
   at runtime, so the constraints are a modeller's, not an illustrator's:

     - primitives only: rectangles, rings, arc bands, and paths of lines
       and arcs. No strokes, no gradients, no text;
     - shapes never overlap. Where two parts would cross they are drawn as one
       path instead, so the extruder gets clean separate solids and no boolean
       union step is needed;
     - a hollow form is one path with a hole, resolved by fill-rule evenodd;
     - every feature and every gap is at least 2 units wide, so nothing
       disappears at 48px or fuses under a bevel.

   ARC FLAGS ARE DERIVED, NOT TYPED. The large-arc and sweep flags are the
   easiest thing in SVG to get backwards, and backwards here does not throw,
   it silently extrudes an inside-out solid. So every arc goes through arcTo(),
   which works out both flags from the angles it was given.

   Angles are degrees, y grows downward (SVG's convention), 0 is east and 90 is
   south. Increasing an angle therefore travels clockwise on screen, which is
   sweep 1.
   -------------------------------------------------------------------------- */

const n = (v) => Number(v.toFixed(3));
const RAD = Math.PI / 180;

/** a point on a circle */
const at = (cx, cy, r, deg) => [n(cx + r * Math.cos(deg * RAD)), n(cy + r * Math.sin(deg * RAD))];

/** an arc command to the point at `deg`, with both flags worked out from the sweep */
function arcTo(cx, cy, r, from, to) {
  const [x, y] = at(cx, cy, r, to);
  const large = Math.abs(to - from) > 180 ? 1 : 0;
  const sweep = to > from ? 1 : 0;
  return `A${r} ${r} 0 ${large} ${sweep} ${x} ${y}`;
}

const move = ([x, y]) => `M${x} ${y}`;
const line = ([x, y]) => `L${x} ${y}`;

/** an axis-aligned rectangle */
const rect = (x, y, w, h) => `M${n(x)} ${n(y)}h${n(w)}v${n(h)}h${n(-w)}Z`;

/** an annular sector: outer arc out, inner arc back */
function band(cx, cy, ri, ro, from, to) {
  return [
    move(at(cx, cy, ro, from)),
    arcTo(cx, cy, ro, from, to),
    line(at(cx, cy, ri, to)),
    arcTo(cx, cy, ri, to, from),
    "Z",
  ].join("");
}

/** a map pin: a disc of radius r with two flanks running to a tip below it.
 *
 *  The flanks meet the disc at its TANGENT points, worked out here rather than
 *  chosen. A guessed shoulder angle leaves a corner where the straight meets
 *  the curve, and a corner at that scale survives the bevel and reads as a
 *  modelling mistake on a 160px render. */
function pin(cx, cy, r, tipY) {
  const d = tipY - cy;
  if (d <= r) throw new Error("pin: the tip is inside the disc");
  /* angle at the centre between "straight down to the tip" and a tangent point */
  const spread = Math.acos(r / d) / RAD;
  const left = 90 + spread;
  return [
    move([n(cx), n(tipY)]),
    line(at(cx, cy, r, left)),
    /* the long way round, over the top, to the mirrored tangent point */
    arcTo(cx, cy, r, left, 450 - spread),
    "Z",
  ].join("");
}

/* --------------------------------------------------------------------------
   Each emblem is a named variant holding an array of subpaths. PICKS says
   which variant ships; docs/decisions.md records why. Adding a variant b is
   a key and an array, and the design lab picks it up with no other change.
   -------------------------------------------------------------------------- */

export const EMBLEMS = {
  /* The house mark. J solid and H outlined: the built half and the unbuilt
     half, which is the same device the headline and the case studies use. */
  jh: {
    w: 32,
    h: 24,
    a: [
      /* J: a 4-wide stem, then a hook of outer radius 6 and inner radius 2 */
      "M7 3H11V15A6 6 0 0 1 5 21H2V17H5A2 2 0 0 0 7 15Z",
      /* H, outer edge: two 6-wide stems bridged by a 6-tall crossbar */
      "M14 3H20V9H24V3H30V21H24V15H20V21H14Z",
      /* H, hole: the same outline inset by 2 on every side, so the letter
         reads as drawn rather than filled */
      "M16 5H18V11H26V5H28V19H26V13H18V19H16Z",
    ],
  },

  /* A sieve. Many rows go in and two come out at full length: the shape of
     the product, which reads ten thousand reviews and returns the handful of
     complaints that repeat. */
  friction: {
    w: 24,
    h: 24,
    a: [
      rect(2, 1, 6, 2),
      rect(2, 5, 20, 2),
      rect(2, 9, 9, 2),
      rect(2, 13, 5, 2),
      rect(2, 17, 20, 2),
      rect(2, 21, 11, 2),
    ],
  },

  /* One column on a baseline, where a spending chart would have seven: the
     product answers one question with one number, so the mark refuses the
     categories. The column is split because that is the whole idea. Your
     balance lies, and the top of it is already committed, so that part is
     drawn hollow and only the part you can actually spend is solid. It is the
     same outline-as-the-unbuilt-half device the headline and the J use. */
  headroom: {
    w: 24,
    h: 24,
    a: [
      /* committed: an outline, walls 2 units all round */
      rect(7, 3, 10, 7),
      rect(9, 5, 6, 3),
      /* safe to spend: solid */
      rect(7, 12, 10, 6),
      /* the baseline it stands on */
      rect(2, 20, 20, 2),
    ],
  },

  /* A pin, broadcasting. The map is live: a scheduled pipeline republishes it
     every few hours, so the mark is a location that is still transmitting. */
  signal: {
    w: 24,
    h: 24,
    /* Radii step 3.5 / 5.5-7.5 / 9.5-11.5, so every ring and the gap between
       them is 2 units. One unit of clearance and the bevels would meet. */
    a: [pin(12, 17, 3.5, 22.5), band(12, 17, 5.5, 7.5, 210, 330), band(12, 17, 9.5, 11.5, 210, 330)],
  },

  /* A pause across a path. The flow is interrupted, not blocked: the track
     continues on the far side, because Bumper always lets you through. */
  bumper: {
    w: 24,
    h: 24,
    a: [rect(1, 11, 6, 2), rect(9, 4, 3, 16), rect(14, 4, 3, 16), rect(19, 11, 4, 2)],
  },
};

/** Which variant ships. Jay's pick, mirrored in docs/decisions.md. */
export const PICKS = { jh: "a", friction: "a", headroom: "a", signal: "a", bumper: "a" };

export const KEYS = Object.keys(EMBLEMS);
