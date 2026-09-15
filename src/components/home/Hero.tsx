import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import MemoryParticles from "./MemoryParticles";
import { usePerfTier, useTierReady } from "./perfTier";

/* The 3D layer, lazily loaded and tier-gated. three plus fiber is 216 KB
   gzipped and it is the largest asset on the site — but the watchdog built
   for exactly this now PERSISTS its verdict, so a machine that cannot hold
   60fps never downloads the chunk on this visit or any later one. That
   system was built and then not used; this is what it was for. */
const HeroScene = lazy(() => import("./scene/HeroScene"));

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

const INDEX = [
  { n: "01", name: "Signal", accent: "#1F9D55" },
  { n: "02", name: "Headroom", accent: "#34D399" },
  { n: "03", name: "ChronoWeave", accent: "#A78BFA" },
  { n: "04", name: "Bumper", accent: "#14B8A6" },
];

export default function Hero() {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const wordRef = useRef<HTMLElement>(null);
  /* The headline is not revealed by the timeline any more — the particles
     assemble it and hand over. Everything downstream waits on that, so the
     sub and the index land on the beat the words land rather than on a clock
     that might disagree with them. */
  const [assembled, setAssembled] = useState(reduce);
  const lite = usePerfTier() === "lite";
  /* Waits for the VERDICT, not a timer: mounting on a clock and unmounting
     when the watchdog disagrees means a slow machine pays the whole download
     and keeps none of it. */
  const tierReady = useTierReady();
  const scene3d = !reduce && !lite && tierReady;

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

      tl.from(".hero2__rule", { scaleX: 0, duration: 1.05, transformOrigin: "left center" }, 0.22)
        .from(".hero2__micro", { opacity: 0, y: 8, duration: 0.65, stagger: 0.08 }, 0.3);
    }, el);

    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={root}
      className={`band band--ink hero2${assembled ? " is-assembled" : ""}`}
      aria-label="Introduction"
    >
      {/* The field. Canvas 2D, no WebGL: it measured 0.31ms a frame on the
          lite tier and 0.80 on full, against the 216 KB three.js chunk this
          page deliberately does not load. It samples the headline from the
          DOM, flies the particles onto the glyphs, hands over to real text,
          and then keeps a sparse remainder alive that pushes away from the
          cursor — which is where the hero's interactivity comes from. */}
      {!reduce && (
        <MemoryParticles
          heroRef={root}
          h1Ref={h1Ref}
          wordRef={wordRef}
          onAssembled={() => setAssembled(true)}
        />
      )}
      {/* The lattice. This is the one thing in the whole rebuild that was
          called the best, and it had been sitting unimported on performance
          grounds that the tier system already solved. It replaces the flat
          SVG grid rather than joining it: two background systems plus the
          particles is exactly the pile-up that kept reading as cluttered. */}
      {scene3d && (
        <Suspense fallback={null}>
          <HeroScene interactive />
        </Suspense>
      )}

      <div className="hero2__in">
        <div className="hero2__top">
          <span className="micro hero2__micro">Jay Harwani</span>
          <span className="micro hero2__micro">Baltimore, MD</span>
        </div>
        <div className="hero2__rule" />

        <div className="hero2__mid">
          {/* data-line is what the sampler measures: each span is one text
              run, so the breaks are AUTHORED rather than left to wrapping —
              a reflowed line would resample at a different width and land the
              assembly crooked. */}
          <h1 className="display hero2__head" ref={h1Ref}>
            <span className="hline">
              <span className="hline__in" data-line>
                I design interfaces{" "}
              </span>
            </span>
            <span className="hline">
              <span className="hline__in" data-line>
                that get out of <em ref={wordRef}>the way.</em>
              </span>
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
