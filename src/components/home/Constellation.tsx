import { useState, useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   The constellation — three facts among many points of light.

   This replaces the magician's vault. The vault was not badly built, but it
   was a magician's metaphor sitting on a page whose hero is a fibre-optic
   lattice: two unrelated expressive systems, which is the same incoherence
   the hero itself had before it was cut down to one idea. Reusing the hero's
   language here means the page argues once instead of twice.

   Deliberately DOM and SVG rather than a second WebGL canvas. The visual
   language survives the translation — glowing nodes, thin threads, real depth
   from CSS 3D — while the content stays selectable, crawlable and reachable
   by a screen reader. Three sentences about a person are exactly the wrong
   thing to bake into a texture, and a second WebGL context on a page that has
   already had performance trouble is a poor trade for a match nobody will
   check side by side.

   WHY THERE IS A STARFIELD. The first version was three labelled dots and the
   three lines between them, which is not a constellation, it is a triangle.
   What makes the hero work is density: 260 nodes reading as one structure. So
   the field now carries ~40 unlabelled points at mixed depths, linked to their
   near neighbours by very faint threads. The three facts are then the named
   points in a real network rather than the only things present — which is both
   the denser picture and the truer one.

   Three things here are less obvious than they look:

   1. THE THREADS LAND ON THE DOTS. Every point sits at its own translateZ, so
      the browser applies a perspective divide and draws it nearer the
      vanishing point than its CSS position. The SVG layer is a single flat
      plane and gets no such divide. Drawing the lines to the raw percentages
      would leave the deepest node's threads ending ~11px short of its dot,
      which reads as sloppy rather than as depth. So every endpoint is
      pre-divided by the same factor the browser will use: k = d / (d + |z|).
      The viewBox is 0–100 with preserveAspectRatio="none", and the mapping to
      pixels is linear per axis, so scaling about (50, 50) in viewBox units is
      exactly the pixel-space divide.

   2. THE DOT IS THE ANCHOR, NOT THE BOX. A node's box is the dot plus its
      label; its detail panel is absolutely positioned so opening it cannot
      move the label. The box is then shifted by half a dot and half its own
      height, and scaled about the dot's centre, so the point the threads meet
      is the point the eye reads as the node.

   3. THE PANEL IS COUNTER-SCALED. Depth shrinks a node to 0.78 of its size at
      the back of the field, and it was shrinking the open panel with it — the
      deepest fact had the smallest, least readable card, which is exactly
      backwards. Each panel now carries the reciprocal of its own node's
      depth factor, so all three render at identical size no matter how far
      back the node they belong to sits.
   ────────────────────────────────────────────────────────────────────────── */

interface Fact {
  key: string;
  kicker: string;
  title: string;
  sub: string;
  /** 0 = nearest the viewer */
  depth: number;
  /** position inside the field, percent */
  x: number;
  y: number;
  /** the same, for a narrow field where the desktop spread would push the
      right-hand node's label past the edge. Threads read the same numbers, so
      the two layouts stay in register without a second projection path. */
  xs: number;
  ys: number;
  /** which way the detail opens, so it never leaves the field */
  open: "" | "left" | "up";
  img?: string;
  logo?: string;
  film?: boolean;
}

const FACTS: Fact[] = [
  {
    key: "ahm",
    kicker: "Born in",
    title: "Ahmedabad",
    sub: "Gujarat, India",
    x: 12, y: 16, xs: 10, ys: 15, depth: 0, open: "",
    img: "/vault/ahmedabad.jpg",
  },
  {
    key: "umbc",
    kicker: "Master's at",
    title: "UMBC",
    sub: "Human-Centered Computing",
    x: 72, y: 46, xs: 58, ys: 46, depth: 1, open: "left",
    logo: "/vault/umbc.svg",
  },
  {
    key: "film",
    kicker: "Off the clock",
    title: "Movie lover",
    sub: "Give me a good third act",
    x: 22, y: 84, xs: 18, ys: 84, depth: 2, open: "up",
    film: true,
  },
];

/* every pair, so three points read as a network rather than a chain */
const THREADS: [number, number][] = [
  [0, 1],
  [1, 2],
  [0, 2],
];

/** must match the perspective on .constellation */
const PERSPECTIVE = 900;
const Z = [0, -70, -140];
/** nearer is larger and brighter — atmospheric perspective does more for the
    read here than the z offset alone does */
const SCALE = [1, 0.94, 0.88];
const DIM = [1, 0.78, 0.6];

/** the perspective divide the browser will apply at each depth */
const K = Z.map((z) => PERSPECTIVE / (PERSPECTIVE + Math.abs(z)));
/** total shrink at each depth, and the reciprocal the panels need. See note 3. */
const SHRINK = SCALE.map((s, i) => s * K[i]);
const COUNTER = SHRINK.map((s) => 1 / s);

/** where the browser will actually draw a point, in viewBox units */
const project = (v: number, depth: number) => 50 + (v - 50) * K[depth];

/* ── the starfield ──────────────────────────────────────────────────────────
   Deterministic, module-level: computed once for the life of the tab rather
   than per mount, and identical on every load so the composition is a design
   decision instead of a slot machine. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Star {
  x: number;
  y: number;
  depth: number;
  delay: number;
}

const { STARS, STAR_LINKS } = (() => {
  const rand = rng(11);
  const stars: Star[] = [];
  /* Labels are wide and run to the right of their dot, so the keep-out zone
     is asymmetric. A star sitting inside a word is not atmosphere, it is a
     rendering bug as far as a reader is concerned.

     The comparison happens in PROJECTED space. A star and a label at different
     depths are pulled toward the vanishing point by different amounts, so
     testing raw percentages clears a gap the browser then closes again — which
     is exactly how a dot ended up sitting inside "Ahmedabad" the first time.
     The margins are generous because both the label and the starfield drift a
     few pixels. They cannot be exact: a label's width in percent grows as the
     field narrows, so a keep-out wide enough for a phone would gut the middle
     of a desktop field. This thins the starfield near labels; the halo on
     .cnode__title in index.css absorbs whatever still lands behind one. */
  const box = (x: number, y: number, cx: number, cy: number) =>
    x > cx - 8 && x < cx + 38 && y > cy - 11 && y < cy + 11;
  const clears = (x: number, y: number, depth: number) =>
    FACTS.every(
      (f) =>
        !box(project(x, depth), project(y, depth), project(f.x, f.depth), project(f.y, f.depth)) &&
        !box(project(x, depth), project(y, depth), project(f.xs, f.depth), project(f.ys, f.depth))
    );

  for (let guard = 0; stars.length < 40 && guard < 2400; guard++) {
    const x = rand() * 104 - 2;
    const y = rand() * 104 - 2;
    const depth = 1 + Math.floor(rand() * 2);
    if (!clears(x, y, depth)) continue;
    stars.push({ x, y, depth, delay: rand() * -9 });
  }

  /* Link each star to its nearest neighbour inside a radius. One link per star
     rather than all pairs: a full proximity graph turns into a solid mesh at
     this density, and the point is a suggestion of structure, not a net. */
  const links: Array<[Star, Star]> = [];
  for (let i = 0; i < stars.length; i++) {
    let best = -1;
    let bestD = 20 * 20;
    for (let j = 0; j < stars.length; j++) {
      if (i === j) continue;
      const dx = stars[i].x - stars[j].x;
      const dy = stars[i].y - stars[j].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD) {
        bestD = d2;
        best = j;
      }
    }
    if (best > i) links.push([stars[i], stars[best]]);
  }
  return { STARS: stars, STAR_LINKS: links };
})();

/** matches the breakpoint in index.css; the two must move together */
const NARROW = "(max-width: 900px)";

export default function Constellation({ reduce, fine }: { reduce: boolean; fine: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const [live, setLive] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const fieldRef = useRef<HTMLDivElement>(null);
  const shown = useRef(false);

  /* One observer, two jobs.

     `live` gates the signal pulses. They animate stroke-dashoffset, which is
     the one thing here that repaints rather than compositing, and an offscreen
     section has no business repainting anything.

     The second job is for touch: a phone has no hover, so without a nudge the
     panels are knowledge nobody can reach. The first time the field is
     properly on screen it opens one node, holds it long enough to read, and
     closes. The timer only closes the node it opened, so a tap on a different
     node mid-demo wins — someone who has already found the affordance is not
     interrupted by the lesson. */
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    let close = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        setLive(e.isIntersecting);
        if (!e.isIntersecting || shown.current || fine || reduce) return;
        shown.current = true;
        setActive(FACTS[0].key);
        close = window.setTimeout(
          () => setActive((cur) => (cur === FACTS[0].key ? null : cur)),
          2600
        );
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(close);
    };
  }, [fine, reduce]);

  useEffect(() => {
    const mq = window.matchMedia(NARROW);
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  const pulsing = live && !reduce;
  /* one accessor for both the nodes and the thread endpoints, so a layout
     switch can never leave the lines pointing at where a node used to be */
  const at = (f: Fact) => (narrow ? { x: f.xs, y: f.ys } : { x: f.x, y: f.y });

  return (
    <div ref={fieldRef} className={`constellation${active ? " constellation--focus" : ""}`}>
      <div className="constellation__stars" aria-hidden="true">
        {STARS.map((s, i) => (
          <span
            key={i}
            className="star"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate(-50%, -50%) translateZ(${Z[s.depth]}px)`,
              /* animationName, not the `animation` shorthand: setting the
                 shorthand alongside animationDelay makes React warn, and the
                 warning is right — the shorthand resets the delay. */
              animationName: reduce ? "none" : undefined,
              animationDelay: `${s.delay}s`,
              ["--d" as string]: s.depth,
            }}
          />
        ))}
      </div>

      <svg className="constellation__threads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {/* the faint web between the unnamed points */}
        {STAR_LINKS.map(([a, b], i) => (
          <line
            key={`s${i}`}
            x1={project(a.x, a.depth)}
            y1={project(a.y, a.depth)}
            x2={project(b.x, b.depth)}
            y2={project(b.y, b.depth)}
            vectorEffect="non-scaling-stroke"
            className="thread thread--faint"
          />
        ))}

        {THREADS.map(([a, b], i) => {
          const on = active === FACTS[a].key || active === FACTS[b].key;
          const pa = at(FACTS[a]);
          const pb = at(FACTS[b]);
          const coords = {
            x1: project(pa.x, FACTS[a].depth),
            y1: project(pa.y, FACTS[a].depth),
            x2: project(pb.x, FACTS[b].depth),
            y2: project(pb.y, FACTS[b].depth),
          };
          return (
            <g key={i}>
              <line {...coords} vectorEffect="non-scaling-stroke" className={on ? "thread thread--on" : "thread"} />
              {/* The signal. pathLength normalises the line to 100 units so one
                  dasharray gives every thread the same pulse length regardless
                  of how long it actually is — without it the short thread's
                  pulse would be a third the size of the long one's. */}
              {pulsing && (
                <line
                  {...coords}
                  pathLength={100}
                  vectorEffect="non-scaling-stroke"
                  className="thread__pulse"
                  style={{ animationDelay: `${i * -2.1}s` }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {FACTS.map((f, i) => {
        const on = active === f.key;
        const p = at(f);
        return (
          <button
            key={f.key}
            type="button"
            className={`cnode${on ? " cnode--on" : ""}`}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              /* half a dot left, half a box up: the dot lands on the point */
              transform: `translate(-6px, -50%) translateZ(${Z[f.depth]}px) scale(${SCALE[f.depth]})`,
              ["--dim" as string]: DIM[f.depth],
              /* drift is on `translate`, not `transform`, so it composes with
                 the depth placement above instead of fighting it */
              animationName: reduce ? "none" : undefined,
              animationDelay: `${i * -2.9}s`,
            }}
            onMouseEnter={() => fine && setActive(f.key)}
            onMouseLeave={() => fine && setActive(null)}
            onFocus={() => setActive(f.key)}
            onBlur={() => setActive(null)}
            onClick={() => setActive((cur) => (cur === f.key ? null : f.key))}
            aria-expanded={on}
            aria-label={`${f.kicker} ${f.title}. ${f.sub}`}
          >
            <span className="cnode__dot" aria-hidden="true" />
            <span className="cnode__label">
              <span className="cnode__kicker">{f.kicker}</span>
              <span className="cnode__title">{f.title}</span>
            </span>

            {/* Always in the DOM — the aria-label above already carries the
                whole fact, so this layer is decoration for sighted users and
                is hidden from the tree rather than duplicated into it. */}
            <span
              className={`cnode__detail${f.open ? ` cnode__detail--${f.open}` : ""}`}
              aria-hidden="true"
              /* the reciprocal of this node's depth shrink, so every panel
                 renders at the same size. See note 3 at the top. */
              style={{ scale: String(COUNTER[f.depth]) }}
            >
              <span className="cnode__detailInner">
                {f.img && <span className="cnode__media" style={{ backgroundImage: `url(${f.img})` }} />}
                {f.logo && (
                  <span className="cnode__media cnode__media--logo" style={{ backgroundImage: `url(${f.logo})` }} />
                )}
                {f.film && (
                  <span className="cnode__media cnode__media--film">
                    <svg viewBox="0 0 40 28" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
                      <rect x=".6" y=".6" width="38.8" height="26.8" rx="3" fill="none" stroke="currentColor" strokeWidth="1.1" />
                      {[0, 1, 2, 3].map((n) => (
                        <rect key={`t${n}`} x={4 + n * 9} y="3.4" width="5" height="3.4" rx="1" fill="currentColor" opacity=".5" />
                      ))}
                      {[0, 1, 2, 3].map((n) => (
                        <rect key={`b${n}`} x={4 + n * 9} y="21.2" width="5" height="3.4" rx="1" fill="currentColor" opacity=".5" />
                      ))}
                    </svg>
                  </span>
                )}
                <span className="cnode__sub">{f.sub}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
