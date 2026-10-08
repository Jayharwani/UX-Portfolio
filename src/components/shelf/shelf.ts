import { shelfPalette } from "./shelfPalette";

/* --------------------------------------------------------------------------
   THE SHELF — one place for what the scene is made of.

   Units are decimetres. A book is about one unit tall, which keeps every
   number on screen to one or two digits and keeps the light intensities
   sane.

   This scene is built, not photographed. An earlier pass stood real geometry
   in front of a photograph of a room; it worked, but a photograph cannot move,
   so every prop was frozen and the books had to be erased out of the plate
   before they could be replaced. Everything here is geometry, which means the
   camera can go anywhere and nothing has to be retouched.
   -------------------------------------------------------------------------- */

export interface Project {
  slug: string;
  title: string;
  /** the terse line, for the index under the fold */
  subtitle: string;
  /** the fuller line, for the tooltip that has two lines to spend */
  blurb: string;
  href: string;
  live: { href: string; label: string };
  year: string;
  /** the cloth of the book */
  cloth: string;
  /** the raised lettering on the spine */
  ink: string;
  /** the page block showing above and in front of the boards */
  paper: string;
  height: number;
  thickness: number;
  /** a degree or two of lean, because nothing on a shelf is plumb */
  lean: number;
}

export const PROJECTS: Project[] = [
  {
    slug: "friction",
    title: "Friction",
    subtitle: "Review mining, Astro",
    blurb: "Reads ten thousand app reviews a week and returns the 25 problems people keep running into.",
    href: "/friction",
    live: { href: "https://jayharwani.github.io/friction/", label: "Open site" },
    year: "2026",
    cloth: shelfPalette.clothFriction,
    ink: shelfPalette.foil,
    paper: shelfPalette.paper,
    height: 1.1600,
    thickness: 0.3132,
    lean: 0,
  },
  {
    slug: "headroom",
    title: "Headroom",
    subtitle: "Local-first finance, React",
    blurb: "A money app that shows what is safe to spend before payday.",
    href: "/headroom",
    live: { href: "https://headroom-opal.vercel.app", label: "Open app" },
    year: "2026",
    cloth: shelfPalette.clothHeadroom,
    ink: shelfPalette.foil,
    paper: shelfPalette.paper,
    height: 1.1020,
    thickness: 0.2726,
    lean: 0,
  },
  {
    slug: "signal",
    title: "Signal",
    subtitle: "Live event map, MapLibre",
    blurb: "A live map of tech, design and AI events across DC, Northern Virginia and Baltimore.",
    href: "/signal",
    live: { href: "https://jayharwani.github.io/dmv-map/", label: "Open map" },
    year: "2026",
    cloth: shelfPalette.clothSignal,
    ink: shelfPalette.foil,
    paper: shelfPalette.paper,
    height: 1.1368,
    thickness: 0.2552,
    lean: 1.4,
  },
  {
    slug: "bumper",
    title: "Bumper",
    subtitle: "Behavioural, Chrome extension",
    blurb: "A Chrome extension that asks one question before an impulse buy.",
    href: "/bumper",
    live: {
      href: "https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp",
      label: "Chrome Web Store",
    },
    year: "2026",
    cloth: shelfPalette.clothBumper,
    ink: shelfPalette.inkOnOchre,
    paper: shelfPalette.paper,
    height: 1.0672,
    thickness: 0.3364,
    lean: 0,
  },
];

/* ── the room ─────────────────────────────────────────────────────────────
   Colour now lives in shelfPalette.ts, locked. PALETTE maps the old prop
   names onto it so the set dressing keeps reading, and so that the places
   that wanted four shades of oak get one: a board is one colour, and what
   made the old scene look like four different woods was four albedos doing
   a job that belongs to the light. */
export const PALETTE = {
  wall: shelfPalette.wall,
  walnut: shelfPalette.walnutFlat,
  stoneware: shelfPalette.stoneware,
  brass: shelfPalette.brass,
  leaf: shelfPalette.eucalyptus,
  ivy: shelfPalette.ivy,
  /* the procedural camera is interim; Phase 4 swaps it for a model that
     brings its own textures, and these two go with it */
  bodyDark: shelfPalette.fog,
} as const;

/* ── dimensions ───────────────────────────────────────────────────────────
   The boards run well past the frame on both sides. A shelf that ends inside
   the shot reads as a prop on a table; one that runs out of frame reads as a
   wall of shelving the camera happens to be close to, which is the whole
   feeling of the reference. */
export const SHELF = {
  /** boards run from -SPAN to +SPAN in x */
  span: 7.6,
  /** front face at +depth, back against the wall */
  depth: 0.78,
  board: 0.15,
  /** y of the top surface of each board, bottom tier first.

      Spacing is 1.38 against books 1.05 to 1.16 tall, so a book clears the
      board above it by about a centimetre at this scale. That tightness is
      not an accident: at 1.78 the books sat in the middle of a half-empty
      compartment and read as four objects on a wide ledge, where the
      reference reads as books that live on a shelf they only just fit. */
  tiers: [-4.14, -2.76, -1.38, 0, 1.38] as const,
  /** which tier the books stand on */
  bookTier: 3,
  wallZ: -0.84,
  gap: 0.012,
} as const;

/** x of each book's spine centre, so the run is centred on `at` */
export function layout(projects: Project[], at = -1.15) {
  const total = projects.reduce((n, p) => n + p.thickness, 0) + SHELF.gap * (projects.length - 1);
  let x = at - total / 2;
  return projects.map((p) => {
    const mid = x + p.thickness / 2;
    x += p.thickness + SHELF.gap;
    return { ...p, x: mid };
  });
}

export type PlacedProject = ReturnType<typeof layout>[number];

/** the tallest book. Every dimension in Book.tsx is a fraction of this, so the
    whole run rescales from one number. */
export const H = 1.16;

/* ── the lamp, and what it points at ──────────────────────────────────────
   One source of truth for both the model and the light inside it.

   IT CLAMPS TO THE FRONT EDGE, which is the whole reason it works. Standing
   beside the books at spine height, the lamp lit the right-hand edge of
   Bumper and Bumper shadowed the other three -- the row is a wall when you
   light it from the end. The spines face the reader, so the light has to come
   from where the reader is: in front of the board's nose, high, reaching back
   and across. */
const BOOK_TIER = SHELF.tiers[SHELF.bookTier];

export const LAMP = {
  /** where the lamp stands, on the books' own board, to their right */
  at: [0.5, BOOK_TIER, 0.42] as [number, number, number],
  /** turned to face back across the books */
  rotY: Math.PI,
  /** the emitting disc, in the Lamp component's own coordinates */
  bulbLocal: [0.536, 0.906, 0] as [number, number, number],
} as const;

/** the bulb in world space, with LAMP.rotY applied (pi, so x and z negate) */
export const BULB: [number, number, number] = [
  LAMP.at[0] - LAMP.bulbLocal[0],
  LAMP.at[1] + LAMP.bulbLocal[1],
  LAMP.at[2] - LAMP.bulbLocal[2],
];

/** the middle of the four books: what the key is aimed at, and what the
    depth of field focuses on */
export const BOOKS_CENTER: [number, number, number] = [-1.15, BOOK_TIER + 0.55, 0];
