import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { useReducedMotion } from "motion/react";
import { usePerfTier } from "./perfTier";

/* ──────────────────────────────────────────────────────────────────────────
   THE HERO — a name inside a real 3D space.

   TUNABLE CONSTANTS live in scene/Anatomy.tsx, at the top, in C and
   ACCENTS. The three to reach for first:

     C.COUNT    how many frames. Density is the whole mood
     ACCENTS    the four project colours — the only colour in the section
     C.BLOOM    bloom strength. Past ~0.4 it reads as a mistake, not light

   The scene itself is lazy-loaded. three.js is 216 KB gzipped and this site
   has spent real effort keeping it out of the main bundle; a component that
   imports it directly is "self-contained" in the file sense and a regression
   in every sense that matters to someone on a phone. The Suspense boundary
   costs one line and keeps the split.

   THE CANVASES ARE ABSOLUTE, NOT FIXED. A fixed canvas would stay on screen
   behind the work section and the About band all the way down the page. They
   are pinned to this section instead, which is full-height anyway, so the
   effect is identical inside the hero and correct outside it.

   THE NAME LEANS AGAINST THE CAMERA. The camera orbits toward the pointer
   and the name drifts slightly the other way. Small — about fourteen pixels
   — but two things moving oppositely cannot be read as one plane.

   AND ONE FRAME SITS IN FRONT OF IT. A single hairline rectangle in CSS,
   parallaxing harder than the name because it is nearer, so the name is
   INSIDE the stack of frames rather than pasted over it. Occlusion is the
   one depth cue a background can never provide, and this is the cheapest
   honest way to get it without a second WebGL context.

   THE TYPE IS KINETIC, which is the other thing 2026 is actually doing.
   Geist is loaded variable (wght 400..600), so the name settles in WEIGHT
   and TRACKING as the frames land rather than just fading up. It is one
   gesture with the scene, and it stays real selectable text throughout.
   ────────────────────────────────────────────────────────────────────────── */

const Anatomy = lazy(() => import("./scene/Anatomy"));

const NAME = "Jay Harwani";
/** how far the name drifts against the camera, in px at full deflection */
const NAME_PARALLAX = 14;
/** the frame in front travels further, because it is nearer */
const NEAR_PARALLAX = 46;

export default function Hero() {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const near = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const lite = usePerfTier() === "lite";

  /* A phone, or a machine the frame-time watchdog has already downgraded,
     gets three noise octaves instead of four and a smaller buffer. Not an
     on/off gate: the shader IS the hero now, and one that renders nothing on
     a slow laptop is worse than one that renders a simpler surface. */
  const [small, setSmall] = useState(false);
  useEffect(() => {
    const narrow = window.matchMedia("(max-width: 760px)");
    const apply = () => setSmall(narrow.matches || lite);
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

  /* ── the departure ──────────────────────────────────────────────────────
     Scrolling out of the hero takes the type with the frames behind it.

     THIS IS A SCROLL LISTENER, NOT A FRAME LOOP, and the distinction is the
     point. A value that depends on scroll position should be computed when
     the scroll position changes; putting it in a render loop makes it depend
     on frames being produced, which is a thing this codebase has now been
     bitten by four separate times. The browser already coalesces scroll
     events to about one per frame, so there is nothing to throttle.

     It writes the STAGE, while the pointer loop writes the plate inside it.
     Two elements, two owners, no transform being fought over. */
  const departRef = useRef(0);
  useEffect(() => {
    if (reduce) return;
    const host = root.current;
    const st = stage.current;
    if (!host || !st) return;
    const onScroll = () => {
      const box = host.getBoundingClientRect();
      const past = Math.min(1, Math.max(0, -box.top / Math.max(box.height, 1)));
      /* the same window the scene uses, so the type and the composition it
         sits in let go together rather than one holding while the other goes */
      const t = Math.min(1, Math.max(0, (past - 0.25) / 0.6));
      const d = t * t * (3 - 2 * t);
      departRef.current = d;
      st.style.opacity = `${(1 - d).toFixed(3)}`;
      st.style.transform = `translate3d(0, ${(d * -46).toFixed(2)}px, 0)`;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  /* ── the name's counter-parallax ──
     The pointer gate sits on the listener, not on the effect: a touch device
     has no pointer and needs no loop, but it still scrolls, and the
     departure above runs regardless. */
  useEffect(() => {
    if (reduce || offscreen) return;
    const fine = !window.matchMedia("(pointer: coarse)").matches;
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
      /* the near frame travels further than the name, because it is nearer.
         Same eased input, one multiplier — that ratio IS the depth. */
      if (near.current) {
        /* the nearest frame leaves fastest, because it is nearest — the
           departure term comes from the scroll handler through a ref rather
           than being recomputed here */
        near.current.style.transform = `translate3d(${(-ex * NEAR_PARALLAX).toFixed(2)}px, ${(-ey * NEAR_PARALLAX * 0.66 + departRef.current * -110).toFixed(2)}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const onMove = (e: PointerEvent) => {
      px = (e.clientX / window.innerWidth) * 2 - 1;
      py = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (fine) window.addEventListener("pointermove", onMove, { passive: true });
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
        <Anatomy running={!offscreen} reduce={reduce} small={small} />
      </Suspense>


      <div className="entry__stage" ref={stage}>
        <div className="entry__plate" ref={plate}>
          <p className="micro entry__welcome">Welcome to my portfolio</p>
          <h1 className="entry__name">{NAME}</h1>
        </div>
        {/* the nearest frame in the stack — in front of the name, so the
            name is inside the architecture rather than on top of it */}
        <div className="entry__near" ref={near} aria-hidden="true" />
      </div>

      <div className="entry__cue">
        <span className="micro">Scroll</span>
        <span className="entry__arrow" aria-hidden="true" />
      </div>
    </section>
  );
}
