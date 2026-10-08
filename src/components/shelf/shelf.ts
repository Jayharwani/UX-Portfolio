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
    blurb: "Designing intentional resistance for better user decisions",
    href: "/friction",
    live: { href: "https://jayharwani.github.io/friction/", label: "Open site" },
    year: "2026",
    cloth: "#C2694A",
    ink: "#F6E4D2",
    paper: "#F2EADC",
    height: 1.12,
    thickness: 0.255,
    lean: 0,
  },
  {
    slug: "headroom",
    title: "Headroom",
    subtitle: "Local-first finance, React",
    blurb: "Local-first personal finance that keeps working offline",
    href: "/headroom",
    live: { href: "https://headroom-opal.vercel.app", label: "Open app" },
    year: "2026",
    cloth: "#A8BA9B",
    ink: "#FBF7EE",
    paper: "#F2EADC",
    height: 1.05,
    thickness: 0.225,
    lean: 0,
  },
  {
    slug: "signal",
    title: "Signal",
    subtitle: "Live event map, MapLibre",
    blurb: "A live map of what is happening across the DMV tonight",
    href: "/signal",
    live: { href: "https://jayharwani.github.io/dmv-map/", label: "Open map" },
    year: "2026",
    cloth: "#4B5A8E",
    ink: "#FBFAF6",
    paper: "#EFE7D8",
    height: 1.09,
    thickness: 0.2,
    lean: 1.4,
  },
  {
    slug: "bumper",
    title: "Bumper",
    subtitle: "Behavioural, Chrome extension",
    blurb: "A Chrome extension that puts a speed bump in the scroll",
    href: "/bumper",
    live: {
      href: "https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp",
      label: "Chrome Web Store",
    },
    year: "2026",
    cloth: "#E2B23F",
    ink: "#4A3310",
    paper: "#F2EADC",
    height: 1.16,
    thickness: 0.235,
    lean: 0,
  },
];

/* ── the room ─────────────────────────────────────────────────────────────
   Everything is matte. The look in the reference is a miniature: objects that
   would be glossy at real scale read as clay at doll scale, because the
   highlight on a 4cm mug is a dot rather than a sweep. Roughness stays high
   and metalness stays at zero except on the two things that are actually
   metal, and even those are brushed rather than polished. */
export const PALETTE = {
  wall: "#EDE7DE",
  oak: "#DDB683",
  oakDark: "#C79C68",
  oakEdge: "#E7C796",
  clay: "#D2BBA4",
  clayDeep: "#B9815F",
  stone: "#CFC8BC",
  cream: "#EFE7DA",
  leaf: "#8FA886",
  leafDeep: "#6E8C6B",
  brass: "#C9A356",
  steel: "#8E9094",
  graphite: "#3B3B3F",
  ink: "#4A4036",
} as const;

export const LIGHT = {
  sun: "#FFF4E2",
  sky: "#E8EEF5",
  ground: "#C9A880",
  lamp: "#FFB65E",
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
