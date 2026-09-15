import { useRef, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";

/* ──────────────────────────────────────────────────────────────────────────
   The hero as a title sequence.

   What was wrong with the version before this was not the typography, it was
   the composition: everything sat in the upper half and roughly four hundred
   pixels of the frame were empty. PRODUCT.md names that exact failure — "no
   dead space without intent... reads as unfinished rather than airy" — so the
   lower half now carries the work index, and the frame is composed rather
   than merely uncluttered.

   THE GRAPHIC IS A DESIGN GRID, and that choice is the whole argument. A
   particle field or a glow would have been the genre default, and both were
   already tried and rejected on this site. A twelve-column grid with
   baselines drawing itself into place is the one piece of visual language
   that actually means something here: it is what the work is built on, every
   designer reads it instantly, and the headline is set ON it rather than
   floating over it. Cinematic, and about the subject.

   THE SEQUENCE is deliberately ordered like a title card: the grid builds,
   the rules draw, the headline rises out of a mask line by line, then the
   index arrives. Roughly 2.2 seconds, and it plays once.

   COST. Everything animated is a transform or an opacity, all of it on a
   single GSAP timeline that runs once and then stops. After the intro the
   only moving thing is one scan line on a long CSS loop — a single
   compositor-friendly element, not a per-frame simulation. This page spent
   weeks having jank removed from it and none of that is being reintroduced.

   Reduced motion gets the finished frame immediately: no timeline is built
   at all, and the grid, type and index are simply there.
   ────────────────────────────────────────────────────────────────────────── */

const COLS = 12;
const ROWS = 6;

const INDEX = [
  { n: "01", name: "Signal", accent: "#1F9D55" },
  { n: "02", name: "Headroom", accent: "#34D399" },
  { n: "03", name: "ChronoWeave", accent: "#A78BFA" },
  { n: "04", name: "Bumper", accent: "#14B8A6" },
];

export default function Hero() {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (reduce) return;
    const el = root.current;
    if (!el) return;

    /* Scoped so every tween is reverted together on unmount; a client-side
       route change must not leave the headline masked at yPercent 110. */
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      /* Dev-only handle, same reason as the work stage: GSAP runs on rAF and
         rAF does not tick in a backgrounded tab, so an automated check sees
         the from() start state and never the finish. Exposing the timeline
         lets a test drive progress(1) and confirm the type actually lands. */
      if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__introTl = tl;

      tl.from(".hgrid__v", { scaleY: 0, duration: 0.95, stagger: 0.03, transformOrigin: "top center" }, 0)
        .from(".hgrid__h", { scaleX: 0, duration: 0.95, stagger: 0.055, transformOrigin: "left center" }, 0.08)
        .from(".hero2__rule", { scaleX: 0, duration: 1.05, transformOrigin: "left center" }, 0.22)
        .from(".hero2__micro", { opacity: 0, y: 8, duration: 0.65, stagger: 0.08 }, 0.3)
        /* the masked reveal: each line rides up out of its own clip */
        .from(".hline__in", { yPercent: 115, duration: 1.1, stagger: 0.085 }, 0.46)
        .from(".hero2__sub", { opacity: 0, y: 14, duration: 0.85 }, 1.05)
        .from(".hero2__ix", { opacity: 0, y: 12, duration: 0.7, stagger: 0.06 }, 1.22)
        /* the grid recedes once the type has landed, so it reads as structure
           behind the words rather than as a pattern competing with them */
        .to(".hgrid", { opacity: 0.4, duration: 1.2 }, 1.1);
    }, el);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section ref={root} className="band band--ink hero2" aria-label="Introduction">
      {/* the grid: structure, drawn */}
      <div className="hgrid" aria-hidden="true">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none">
          {Array.from({ length: COLS - 1 }, (_, i) => (
            <line
              key={`v${i}`}
              className="hgrid__v"
              x1={((i + 1) * 100) / COLS}
              y1="0"
              x2={((i + 1) * 100) / COLS}
              y2="100"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {Array.from({ length: ROWS - 1 }, (_, i) => (
            <line
              key={`h${i}`}
              className="hgrid__h"
              x1="0"
              y1={((i + 1) * 100) / ROWS}
              x2="100"
              y2={((i + 1) * 100) / ROWS}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>

      <div className="hero2__in">
        <div className="hero2__top">
          <span className="micro hero2__micro">Jay Harwani</span>
          <span className="micro hero2__micro">Baltimore, MD</span>
        </div>
        <div className="hero2__rule" />

        <div className="hero2__mid">
          <h1 className="display hero2__head">
            <span className="hline">
              <span className="hline__in">I design interfaces</span>
            </span>
            <span className="hline">
              <span className="hline__in">that get out of the way.</span>
            </span>
          </h1>
          <p className="lead hero2__sub">Designer who ships the front end. Four products, all live.</p>
        </div>

        <div className="hero2__bottom">
          <div className="hero2__rule" />
          <ul className="hero2__index">
            {INDEX.map((p) => (
              <li className="hero2__ix" key={p.n} style={{ ["--ac" as string]: p.accent }}>
                <span className="hero2__ixn">{p.n}</span>
                <span className="hero2__ixname">{p.name}</span>
              </li>
            ))}
          </ul>
          <div className="hero2__foot">
            <span className="micro hero2__micro">Selected work ↓</span>
            <span className="micro hero2__micro">Open to full-time</span>
          </div>
        </div>
      </div>
    </section>
  );
}
