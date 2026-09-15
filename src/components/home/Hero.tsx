import { useRef, useEffect, lazy, Suspense } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { usePerfTier, useTierReady } from "./perfTier";

/* Tier-gated and lazy. three plus fiber is 216 KB gzipped, and the watchdog
   persists its verdict for thirty days — a machine that cannot hold 60fps
   never downloads it, on this visit or any later one. */
const HeroScene = lazy(() => import("./scene/HeroScene"));

/* ──────────────────────────────────────────────────────────────────────────
   The entrance.

   Every previous hero tried to do a job the page below already does. The last
   one carried a project index sitting directly above the work section, which
   is why it read as cluttered — it was not too busy, it was REDUNDANT.

   So this one carries a name and a welcome and nothing else. That single
   decision is what finally makes the 3D affordable here: the objection was
   never the lattice, it was a lattice competing with content. With nothing to
   compete with, it can just be the room you walk into.

   A DOOR, NOT A SECTION. This is the one part of the site that does not need
   the editorial anatomy of the bands below, because it holds no content to
   organise. It is allowed its own register, and the page proper begins the
   moment you scroll.

   DEPTH IS THE INTERACTION. The lattice parallaxes toward the pointer and the
   name parallaxes AWAY from it, so moving the mouse separates the two planes
   and the name sits in real space rather than on a picture of it. One
   rAF-throttled handler, one transform write, nothing measured per frame.

   The name arrives glyph by glyph out of a clip — eleven characters, so the
   stagger reads as one gesture rather than a crawl.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = "Jay Harwani";

export default function Hero() {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const plate = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const lite = usePerfTier() === "lite";
  const tierReady = useTierReady();
  const depth = !reduce && !lite && tierReady;

  /* ── entrance ──────────────────────────────────────────────────────────
     THE RESTING STATE OF THIS DOM HAS TO BE VISIBLE.

     A gsap .from() writes its start state inline the moment the timeline is
     built, and only takes it away again as the tween advances — and the tween
     advances on requestAnimationFrame, which does not run while a document is
     hidden. Measured on a phone-width load: visibilityState "hidden",
     progress 0, and the glyphs sitting at translate(0%, 118%) inside their
     own overflow:hidden clips. The name was not small or dim. It was parked
     below the bottom of its own box, and the hero was an empty screen.

     That is not an exotic case on a phone. Opening a link from another app,
     restoring a tab, a page brought back from the back-forward cache: all of
     them mount the document hidden and leave it hidden until you look.

     So the timeline is built paused, and it starts on whichever of these
     comes first:

       the document is already visible — play now;
       it becomes visible later — play then, so a link opened from another
       app still gets its entrance instead of arriving pre-finished;
       three and a half seconds pass and the ticker has not moved — put the
       text on screen regardless. setTimeout is not rAF-driven, so this one
       fires in precisely the case that breaks the other two.

     The animation can now only ever ADD something. It can no longer be the
     reason the page is blank. */
  useEffect(() => {
    if (reduce) return;
    const el = root.current;
    if (!el) return;
    let failsafe = 0;
    let stopWatching: (() => void) | undefined;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, paused: true });
      if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__introTl = tl;
      tl.from(".entry__welcome", { opacity: 0, y: 10, duration: 0.8 }, 0.25)
        .from(
          ".entry__g",
          { yPercent: 118, duration: 1.15, stagger: 0.045, ease: "power4.out" },
          0.45
        )
        .from(".entry__rule", { scaleX: 0, duration: 1.1, transformOrigin: "center" }, 0.9)
        .from(".entry__cue", { opacity: 0, y: 12, duration: 0.8 }, 1.15);

      const run = () => {
        tl.play(0);
        failsafe = window.setTimeout(() => {
          if (tl.progress() < 1) tl.progress(1);
        }, 3400);
      };

      if (document.visibilityState === "visible") {
        run();
      } else {
        const onVisible = () => {
          if (document.visibilityState !== "visible") return;
          stopWatching?.();
          run();
        };
        document.addEventListener("visibilitychange", onVisible);
        stopWatching = () => {
          document.removeEventListener("visibilitychange", onVisible);
          stopWatching = undefined;
        };
      }
    }, el);
    return () => {
      window.clearTimeout(failsafe);
      stopWatching?.();
      ctx.revert();
    };
  }, [reduce]);

  /* ── the parallax: name away from the pointer, lattice toward it ── */
  useEffect(() => {
    if (reduce) return;
    const el = plate.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    let queued = false;
    let lx = 0;
    let ly = 0;
    const write = () => {
      queued = false;
      /* the name leans AGAINST the scene's lean, which is what separates the
         two planes rather than sliding them together */
      el.style.transform = `rotateY(${px * -4}deg) rotateX(${py * 3}deg) translate3d(${px * -16}px, ${py * -11}px, 0)`;
      /* the light rides the same handler and the same frame — a transform
         write, not a custom property, so it stays on the compositor and never
         invalidates a subtree */
      if (light.current) light.current.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
    };
    const onMove = (e: PointerEvent) => {
      lx = e.clientX;
      ly = e.clientY;
      px = (e.clientX / window.innerWidth - 0.5) * 2;
      py = (e.clientY / window.innerHeight - 0.5) * 2;
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(write);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  return (
    <section ref={root} className="band band--ink entry" aria-label="Welcome">
      {/* The ground. A dot lattice that does not need WebGL, so it is there
          on every tier — including the lite tier, where the 3D scene never
          loads and the background would otherwise be flat ink. The light
          follows the pointer and brightens the dots it passes over; the grain
          keeps a large dark field from reading as a void. Both are cheap: one
          transform write per frame and one static texture. */}
      <div className="entry__ground" aria-hidden="true" />
      {!reduce && <div className="entry__light" ref={light} aria-hidden="true" />}
      <div className="entry__grain" aria-hidden="true" />

      {depth && (
        <Suspense fallback={null}>
          <HeroScene interactive />
        </Suspense>
      )}

      <div className="entry__stage">
        <div className="entry__plate" ref={plate}>
          <p className="micro entry__welcome">Welcome to my portfolio</p>

          {/* one span per glyph, each in its own clip, so the name rises out
              of nothing rather than fading in. aria-label carries the whole
              name so a screen reader never hears it spelled out. */}
          <h1 className="entry__name" aria-label={NAME}>
            {NAME.split("").map((ch, k) =>
              ch === " " ? (
                <span key={k} className="entry__sp" aria-hidden="true">
                  &nbsp;
                </span>
              ) : (
                <span key={k} className="entry__clip" aria-hidden="true">
                  <span className="entry__g">{ch}</span>
                </span>
              )
            )}
          </h1>

          <div className="entry__rule" aria-hidden="true" />
        </div>
      </div>

      <div className="entry__cue">
        <span className="micro">Scroll</span>
        <span className="entry__arrow" aria-hidden="true" />
      </div>
    </section>
  );
}
