/* --------------------------------------------------------------------------
   THE SHELF — one place for what the scene is made of.

   Dimensions are in decimetres, which keeps every number on screen a readable
   one or two digits and keeps the lights at sane intensities. The shelf
   interior is 3 units wide and 1.6 tall; the camera sits 3.4 back.
   -------------------------------------------------------------------------- */

export interface Project {
  slug: string;
  title: string;
  /** the one line a hover has room for */
  subtitle: string;
  href: string;
  live: { href: string; label: string };
  year: string;
  /** the project's own colour, as the cloth of its book */
  cloth: string;
  /** foil stamping on the spine and the cover */
  foil: string;
  /** books on a real shelf are not milled to one size */
  height: number;
  thickness: number;
  /** a lean, in degrees, because nothing on a shelf is plumb */
  lean: number;
  /** Turned out of the shelf plane, in degrees. The two end books are angled
      like bookends, which is what makes the run wide enough to cover the
      painted block behind it: a turned book is as wide on screen as
      t*cos(a) + depth*sin(a), so fifteen degrees buys almost as much width
      again as the spine itself.

      Sign matters. Positive turns the front board away from the reader and
      shows the plain back one; the first pass used +34 and -27 and the two
      end books presented a blank board and a full cover instead of spines. */
  turn: number;
}

/* Read off the plate rather than invented: the four books in the photograph
   are terracotta, sage, navy and amber, and the lettering on each is debossed
   into the cloth rather than foiled onto it, so the "foil" here is a darker
   or lighter tone of the same cloth and not a metal.

   Sampling these by pixel did not work. The front book is pulled out and
   throws a hard diagonal shadow across the two behind it, so a centre sample
   read sage as dark olive and navy as near black; and the lettering is cut
   into the cloth, so any sample near a title averages the groove. They are
   matched by eye, which is what they are for.  */
export const PROJECTS: Project[] = [
  {
    slug: "friction",
    title: "Friction",
    subtitle: "Review mining, Astro",
    href: "/friction",
    live: { href: "https://jayharwani.github.io/friction/", label: "Open site" },
    year: "2026",
    cloth: "#b06a4e",
    foil: "#8a4a34",
    height: 1.2,
    thickness: 0.265,
    lean: 0,
    turn: -15,
  },
  {
    slug: "headroom",
    title: "Headroom",
    subtitle: "Local-first finance, React",
    href: "/headroom",
    live: { href: "https://headroom-opal.vercel.app", label: "Open app" },
    year: "2026",
    cloth: "#8a978a",
    foil: "#5f6c5f",
    height: 1.1,
    thickness: 0.278,
    lean: 0,
    turn: 0,
  },
  {
    slug: "signal",
    title: "Signal",
    subtitle: "Live event map, MapLibre",
    href: "/signal",
    live: { href: "https://jayharwani.github.io/dmv-map/", label: "Open map" },
    year: "2026",
    cloth: "#2b3150",
    foil: "#b9c0d6",
    height: 1.12,
    thickness: 0.205,
    lean: 1.6,
    turn: 0,
  },
  {
    slug: "bumper",
    title: "Bumper",
    subtitle: "Behavioural, Chrome extension",
    href: "/bumper",
    live: {
      href: "https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp",
      label: "Chrome Web Store",
    },
    year: "2026",
    cloth: "#c3883f",
    foil: "#8a5a23",
    height: 1.17,
    thickness: 0.238,
    lean: 0,
    turn: 13,
  },
];

/* THE PLATE, AND WHERE THE BOOKS SIT IN IT.

   public/shelf/room.webp is the photograph with its baked-in interface
   retouched out: the nav row, the hover card, two icon clusters, a wordmark
   and a mouse cursor. scratchpad/ref/retouch.html is how, if it ever needs
   rebuilding from the original.

   The rect is the block of painted books the 3D ones stand in front of and
   hide, measured off the plate: x 500 to 1000, y 195 to 665. Everything is
   expressed as a fraction of the plate so the scene survives any viewport. */
export const PLATE = {
  src: "/shelf/room.webp",
  w: 1530,
  h: 858,
  books: { x: 500, y: 195, w: 500, h: 470 },
} as const;

export const SHELF = {
  /** the run of books, in scene units */
  width: 0.9,
  gap: 0.006,
} as const;

export const LIGHT = {
  sun: "#FFFDF8",
  fill: "#F4EFEB",
  lamp: "#FFB366",
} as const;

/** x of each book's spine centre, so the run is centred on the origin */
export function layout(projects: Project[]) {
  const total = projects.reduce((n, p) => n + p.thickness, 0) + SHELF.gap * (projects.length - 1);
  let x = -total / 2;
  return projects.map((p) => {
    const at = x + p.thickness / 2;
    x += p.thickness + SHELF.gap;
    return { ...p, x: at };
  });
}

export type PlacedProject = ReturnType<typeof layout>[number];
