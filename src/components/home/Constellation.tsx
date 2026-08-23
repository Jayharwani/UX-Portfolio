import { useState, useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   The constellation — three facts as a small network.

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

   Two things here are less obvious than they look:

   1. THE THREADS LAND ON THE DOTS. Each node sits at its own translateZ, so
      the browser applies a perspective divide and draws it nearer the
      vanishing point than its CSS position. The SVG thread layer is a single
      flat plane and gets no such divide. Drawing the lines to the raw
      percentages would leave the deepest node's threads ending ~11px short of
      its dot, which reads as sloppy rather than as depth. So the endpoints are
      pre-divided by the same factor the browser will use: k = d / (d + |z|).
      The viewBox is 0–100 with preserveAspectRatio="none", and the mapping to
      pixels is linear per axis, so scaling about (50, 50) in viewBox units is
      exactly the pixel-space divide.

   2. THE DOT IS THE ANCHOR, NOT THE BOX. A node's box is the dot plus its
      label; its detail panel is absolutely positioned so opening it cannot
      move the label. The box is then shifted by half a dot and half its own
      height, and scaled about the dot's centre, so the point the threads meet
      is the point the eye reads as the node.

   Titles are always visible, so the section can be scanned without hovering
   anything. Hover, focus and tap all open the same detail — a keyboard user
   and a phone user are not second-class here. Opening one node dims the other
   two, which is what makes overlap between an open panel and a distant label
   read as focus rather than as collision.
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
    x: 20, y: 22, depth: 0, open: "",
    img: "/vault/ahmedabad.jpg",
  },
  {
    key: "umbc",
    kicker: "Master's at",
    title: "UMBC",
    sub: "Human-Centered Computing",
    x: 68, y: 47, depth: 1, open: "left",
    logo: "/vault/umbc.svg",
  },
  {
    key: "film",
    kicker: "Off the clock",
    title: "Movie lover",
    sub: "Give me a good third act",
    x: 30, y: 75, depth: 2, open: "up",
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
const Z = [0, -60, -120];
/** nearer is larger and brighter — atmospheric perspective does more for the
    read here than the z offset alone does */
const SCALE = [1, 0.94, 0.88];
const DIM = [1, 0.8, 0.62];

/** where the browser will actually draw a node, as a fraction of its offset
    from the perspective origin. See note 1 above. */
const project = (v: number, depth: number) =>
  50 + (v - 50) * (PERSPECTIVE / (PERSPECTIVE + Math.abs(Z[depth])));

export default function Constellation({ reduce, fine }: { reduce: boolean; fine: boolean }) {
  const [active, setActive] = useState<string | null>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const shown = useRef(false);

  /* A phone has no hover, so without this the panels are knowledge nobody can
     reach. The first time the field is properly on screen it opens one node,
     holds it long enough to read, and closes: the interaction demonstrates
     itself once and then hands control back. The timer only closes the node it
     opened, so a tap on a different node mid-demo wins: someone who has
     already found the affordance is not interrupted by the lesson. */
  useEffect(() => {
    const el = fieldRef.current;
    if (!el || fine || reduce) return;
    let close = 0;
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting || shown.current) return;
        shown.current = true;
        io.disconnect();
        setActive(FACTS[0].key);
        close = window.setTimeout(() => setActive((cur) => (cur === FACTS[0].key ? null : cur)), 2400);
      },
      { threshold: 0.55 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(close);
    };
  }, [fine, reduce]);

  return (
    <div ref={fieldRef} className={`constellation${active ? " constellation--focus" : ""}`}>
      <svg className="constellation__threads" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        {THREADS.map(([a, b], i) => {
          const on = active === FACTS[a].key || active === FACTS[b].key;
          return (
            <line
              key={i}
              x1={project(FACTS[a].x, FACTS[a].depth)}
              y1={project(FACTS[a].y, FACTS[a].depth)}
              x2={project(FACTS[b].x, FACTS[b].depth)}
              y2={project(FACTS[b].y, FACTS[b].depth)}
              vectorEffect="non-scaling-stroke"
              className={on ? "thread thread--on" : "thread"}
            />
          );
        })}
      </svg>

      {FACTS.map((f, i) => {
        const on = active === f.key;
        return (
          <button
            key={f.key}
            type="button"
            className={`cnode${on ? " cnode--on" : ""}`}
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              /* half a dot left, half a box up: the dot lands on the point */
              transform: `translate(-5.5px, -50%) translateZ(${Z[f.depth]}px) scale(${SCALE[f.depth]})`,
              ["--dim" as string]: DIM[f.depth],
              /* drift is on `translate`, not `transform`, so it composes with
                 the depth placement above instead of fighting it */
              animation: reduce ? "none" : undefined,
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
