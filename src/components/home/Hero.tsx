import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useReducedMotion } from "motion/react";
import { usePerfTier } from "./perfTier";

/* ──────────────────────────────────────────────────────────────────────────
   THE HERO — a name inside a real 3D space.

   TUNABLE CONSTANTS live in scene/Constellation.tsx, at the top, in TUNE.
   The three to reach for first if the depth ever stops reading:

     TUNE.Z_FAR / Z_NEAR   the depth of the room — widen this before anything
     TUNE.PARALLAX_X / _Y  how far the camera travels with the pointer
     TUNE.SIZE / FRONT_Z   how big and how close the nearest particles get

   The scene itself is lazy-loaded. three.js is 216 KB gzipped and this site
   has spent real effort keeping it out of the main bundle; a component that
   imports it directly is "self-contained" in the file sense and a regression
   in every sense that matters to someone on a phone. The Suspense boundary
   costs one line and keeps the split.

   THE CANVASES ARE ABSOLUTE, NOT FIXED. A fixed canvas would stay on screen
   behind the work section and the About band all the way down the page. They
   are pinned to this section instead, which is full-height anyway, so the
   effect is identical inside the hero and correct outside it.

   THE NAME LEANS AGAINST THE SPACE. The camera goes toward the pointer and
   the name goes slightly the other way. Small — about eighteen pixels — but
   it is the difference between type sitting on the scene and type sitting in
   it, because two things moving oppositely cannot be read as one plane.
   ────────────────────────────────────────────────────────────────────────── */

const Constellation = lazy(() => import("./scene/Constellation"));

const NAME = "Jay Harwani";
/** how far the name drifts against the camera, in px at full deflection */
const NAME_PARALLAX = 18;

export default function Hero() {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const lite = usePerfTier() === "lite";

  /* Fewer particles on a phone and on a machine the frame-time watchdog has
     already downgraded. Not an on/off gate: the scene IS the hero now, and a
     hero that renders nothing on a slow laptop is worse than one that renders
     a thinner field. */
  const [density, setDensity] = useState(1);
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 760px)");
    const apply = () => setDensity(narrow.matches ? 0.52 : lite ? 0.65 : 1);
    apply();
    narrow.addEventListener("change", apply);
    return () => narrow.removeEventListener("change", apply);
  }, [lite]);

  /* The loop stops at the fold. OFFSCREEN rather than in-view, defaulting to
     false: an observer that never speaks then leaves the scene running as it
     would have anyway. An optimisation should be able to fail to save work,
     never to break the thing it is optimising. */
  const [offscreen, setOffscreen] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setOffscreen(!entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* ── the text entrance ──
     One coordinated moment, not a fade on every element.

     `instant` exists because a CSS transition needs frames, and a document
     that mounts hidden — a link opened from another app, a restored tab, a
     page out of the back-forward cache — produces none. This hero was once
     found completely blank for exactly that reason: the name was parked
     below its own clip with nothing left to advance it. So if two and a half
     seconds pass without the transition having run, the text lands on its
     end state with no transition at all. setTimeout is not rAF-driven, which
     is the whole point — it fires in the case that breaks everything else. */
  const [entered, setEntered] = useState(reduce);
  const [instant, setInstant] = useState(reduce);
  useEffect(() => {
    if (reduce) return;
    const r = requestAnimationFrame(() => setEntered(true));
    const t = window.setTimeout(() => {
      setInstant(true);
      setEntered(true);
    }, 2500);
    return () => {
      cancelAnimationFrame(r);
      window.clearTimeout(t);
    };
  }, [reduce]);

  /* ── the name's counter-parallax ── */
  useEffect(() => {
    if (reduce || offscreen) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = plate.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    let ex = 0;
    let ey = 0;
    const frame = () => {
      ex += (px - ex) * 0.05;
      ey += (py - ey) * 0.05;
      el.style.transform = `translate3d(${(-ex * NAME_PARALLAX).toFixed(2)}px, ${(-ey * NAME_PARALLAX * 0.66).toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce, offscreen]);

  return (
    <section
      ref={root}
      className={`band band--ink entry${entered ? " is-in" : ""}${instant ? " is-instant" : ""}`}
      aria-label="Welcome"
    >
      <Suspense fallback={null}>
        <Constellation running={!offscreen} reduce={reduce} density={density} />
      </Suspense>

      {/* a faint lift under the name, so it never has to fight a bright
          particle for legibility */}
      <div className="entry__glow" aria-hidden="true" />

      <div className="entry__stage">
        <div className="entry__plate" ref={plate}>
          <p className="micro entry__welcome">Welcome to my portfolio</p>
          <h1 className="entry__name">{NAME}</h1>
        </div>
      </div>

      <div className="entry__cue">
        <span className="micro">Scroll</span>
        <span className="entry__arrow" aria-hidden="true" />
      </div>
    </section>
  );
}
