import { useState, useRef, useEffect } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";

/* ──────────────────────────────────────────────────────────────────────────
   THE PLATE — the homepage as a broadsheet that is alive.

   Three answers shaped this and they are an unusual combination: editorial
   structure, tactile interaction, cinematic atmosphere. Most sites commit to
   one. Editorial sites are quiet and static; cinematic sites are loud and
   thin. Doing all three at once is the whole proposition, and it is why this
   should not read as any template the visitor has seen.

   STRUCTURE is a printed plate: masthead, hairline rules, an asymmetric
   column grid, an index rather than cards, and a figure with a caption. A
   broadsheet earns interest through density and hierarchy, never through
   decoration — which is what PRODUCT.md asked for in the first place
   ("information density, asymmetry and typographic command, never effects").

   THE INTERACTION is the part worth building. The index and the figure are
   bound in both directions: hovering a row lights its star and draws a leader
   to it; hovering a star lights its row. That is exactly the map-and-list
   binding in the Signal project, turned on the portfolio itself, so the page
   demonstrates the skill it is claiming instead of asserting it. It is also
   the reason a visitor touches anything at all.

   ATMOSPHERE is depth, not effects: the figure sits in a real perspective
   with parallax on the cursor, and one slow clock drives everything. There
   are no particles, no physics and no second canvas. The previous homepage
   ran five independent motion systems, which is what made it read as
   gimmicky; this runs one.

   Cards are deliberately absent. PRODUCT.md rejects "feature cards" by name,
   and an index is both denser and more confident: it trusts the names and the
   lines to do the work.
   ────────────────────────────────────────────────────────────────────────── */

interface Star {
  slug: string;
  no: string;
  name: string;
  line: string;
  meta: string;
  to: string;
  /** position inside the figure, percent */
  x: number;
  y: number;
  /** 0 nearest the viewer */
  depth: number;
}

const WORK: Star[] = [
  {
    slug: "signal",
    no: "01",
    name: "Signal",
    line: "A live map of DMV tech events that reads your calendar and shows which ones you can actually make.",
    meta: "Live product · Maps · Front-end",
    to: "/signal",
    x: 66, y: 16, depth: 0,
  },
  {
    slug: "headroom",
    no: "02",
    name: "Headroom",
    line: "A money app that answers one question. Can I spend this, right now. Local-first, no bank login.",
    meta: "PWA · On-device · 2025",
    to: "/headroom",
    x: 28, y: 37, depth: 1,
  },
  {
    slug: "chronoweave",
    no: "03",
    name: "ChronoWeave",
    line: "Multi-sensory nudges that help people with ADHD feel time pass. Haptics, audio, light.",
    meta: "Mobile · Haptics · Research",
    to: "/chronoweave",
    x: 78, y: 62, depth: 2,
  },
  {
    slug: "bumper",
    no: "04",
    name: "Bumper",
    line: "An agentic Chrome extension that catches impulse buys before you regret them.",
    meta: "Extension · Agentic AI · 2025",
    to: "/bumper",
    x: 40, y: 84, depth: 1,
  },
];

/* the asterism: a shape, not a mesh. Four points and four lines read as a
   figure; every pair would read as a net. */
const LINKS: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
];

const PERSPECTIVE = 1000;
const Z = [0, -80, -160];
const K = Z.map((z) => PERSPECTIVE / (PERSPECTIVE + Math.abs(z)));
const project = (v: number, d: number) => 50 + (v - 50) * K[d];

function rand(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* Background stars, placed once. They keep the figure from reading as four
   lonely dots without competing with them: none is brighter than the dimmest
   named star, and none lands within the keep-out of a label. */
const DUST = (() => {
  const r = rand(19);
  const out: { x: number; y: number; s: number; o: number; d: number }[] = [];
  const clear = (x: number, y: number) =>
    WORK.every((w) => Math.hypot(x - w.x, y - w.y) > 11);
  for (let g = 0; out.length < 54 && g < 900; g++) {
    const x = r() * 100;
    const y = r() * 100;
    if (!clear(x, y)) continue;
    out.push({ x, y, s: 0.8 + r() * 1.5, o: 0.14 + r() * 0.26, d: r() * -12 });
  }
  return out;
})();

export default function Plate() {
  const reduce = !!useReducedMotion();
  const [active, setActive] = useState<string | null>(null);
  const figRef = useRef<HTMLDivElement>(null);
  const [par, setPar] = useState({ x: 0, y: 0 });

  /* Cursor parallax on the figure only. Reading the pointer on the whole
     window and moving one element is cheaper than it looks: a single rAF,
     one transform write, nothing measured per frame. */
  useEffect(() => {
    if (reduce) return;
    const el = figRef.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    let queued = false;
    const apply = () => {
      queued = false;
      setPar({ x: px, y: py });
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      px = (e.clientX - (r.left + r.width / 2)) / Math.max(1, r.width);
      py = (e.clientY - (r.top + r.height / 2)) / Math.max(1, r.height);
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(apply);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  const activeIdx = WORK.findIndex((w) => w.slug === active);

  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3, delay: 0 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  /* a rule that draws itself in, which is the entrance a printed page would
     have if it had one */
  const drawRule = (delay: number) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { scaleX: 0 },
          animate: { scaleX: 1 },
          transition: { duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="plate" aria-label="Introduction and selected work">
      {/* ── masthead ── */}
      <motion.div className="plate__rule" {...drawRule(0.05)} aria-hidden="true" />
      <motion.header className="plate__masthead" {...rise(0.12)}>
        <span className="plate__name">Jay Harwani</span>
        <span className="plate__role">Product Designer · Design Engineer</span>
        <span className="plate__place">Baltimore, MD</span>
      </motion.header>
      <motion.div className="plate__rule" {...drawRule(0.18)} aria-hidden="true" />

      <div className="plate__body">
        {/* ── left: the argument, then the index ── */}
        <div className="plate__col plate__col--main">
          <motion.h1 className="plate__head" {...rise(0.3)}>
            I design interfaces that get <em>out of the way.</em>
          </motion.h1>

          <motion.p className="plate__standfirst" {...rise(0.42)}>
            Because the ultimate user experience is closing the laptop. I take products from raw
            research into shipped, front-end reality — not a handoff, the actual thing.
          </motion.p>

          <motion.div className="plate__rule plate__rule--soft" {...drawRule(0.55)} aria-hidden="true" />

          <motion.div className="plate__indexhead" {...rise(0.6)}>
            <span>Selected work</span>
            <span className="plate__indexhint" aria-hidden="true">Hover to locate</span>
          </motion.div>

          <ul className="plate__index">
            {WORK.map((w, i) => {
              const on = active === w.slug;
              return (
                <motion.li key={w.slug} {...rise(0.66 + i * 0.07)}>
                  <Link
                    to={w.to}
                    className={`idx${on ? " idx--on" : ""}`}
                    onMouseEnter={() => setActive(w.slug)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(w.slug)}
                    onBlur={() => setActive(null)}
                  >
                    <span className="idx__no">{w.no}</span>
                    <span className="idx__text">
                      <span className="idx__name">{w.name}</span>
                      <span className="idx__line">{w.line}</span>
                      <span className="idx__meta">{w.meta}</span>
                    </span>
                    <span className="idx__go" aria-hidden="true">↗</span>
                  </Link>
                </motion.li>
              );
            })}
          </ul>
        </div>

        {/* ── right: the figure ── */}
        <div className="plate__col plate__col--fig">
          <motion.div className="plate__figwrap" {...rise(0.45)}>
            <div
              ref={figRef}
              className={`fig${active ? " fig--focus" : ""}`}
              style={
                reduce
                  ? undefined
                  : { transform: `rotateY(${par.x * 5}deg) rotateX(${-par.y * 4}deg)` }
              }
            >
              <svg className="fig__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {LINKS.map(([a, b], i) => {
                  const on = activeIdx === a || activeIdx === b;
                  return (
                    <line
                      key={i}
                      x1={project(WORK[a].x, WORK[a].depth)}
                      y1={project(WORK[a].y, WORK[a].depth)}
                      x2={project(WORK[b].x, WORK[b].depth)}
                      y2={project(WORK[b].y, WORK[b].depth)}
                      vectorEffect="non-scaling-stroke"
                      className={on ? "fig__line fig__line--on" : "fig__line"}
                    />
                  );
                })}
              </svg>

              {DUST.map((d, i) => (
                <span
                  key={i}
                  className="fig__dust"
                  aria-hidden="true"
                  style={{
                    left: `${project(d.x, 2)}%`,
                    top: `${project(d.y, 2)}%`,
                    width: d.s,
                    height: d.s,
                    opacity: d.o,
                    animationDelay: `${d.d}s`,
                    animation: reduce ? "none" : undefined,
                  }}
                />
              ))}

              {WORK.map((w) => {
                const on = active === w.slug;
                return (
                  <span
                    key={w.slug}
                    className={`fig__star${on ? " fig__star--on" : ""}`}
                    aria-hidden="true"
                    style={{
                      left: `${w.x}%`,
                      top: `${w.y}%`,
                      transform: `translate(-50%, -50%) translateZ(${Z[w.depth]}px)`,
                    }}
                    onMouseEnter={() => setActive(w.slug)}
                    onMouseLeave={() => setActive(null)}
                  >
                    <span className="fig__dot" />
                    <span className="fig__tag">{w.name}</span>
                  </span>
                );
              })}
            </div>

            <div className="plate__caption">
              <span className="plate__figno">Fig. 1</span>
              <span>
                Four shipped products, plotted. {active ? WORK[activeIdx].name : "Hover the index to locate one."}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div className="plate__rule" {...drawRule(0.9)} aria-hidden="true" />
      <motion.footer className="plate__foot" {...rise(0.95)}>
        <span>Master&rsquo;s in Human-Centered Computing, UMBC</span>
        <span>Open to full-time · No sponsorship required</span>
        <span className="plate__scroll" aria-hidden="true">Scroll ↓</span>
      </motion.footer>
    </section>
  );
}
