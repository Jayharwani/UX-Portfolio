import { useRef, useEffect, useState, lazy, Suspense } from "react";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { usePerfTier, useTierReady } from "./perfTier";

/* Tier-gated and lazy. three plus fiber is 216 KB gzipped, and the watchdog
   persists its verdict for thirty days — a machine that cannot hold 60fps
   never downloads it, on this visit or any later one. */
const HeroScene = lazy(() => import("./scene/HeroScene"));

/* ──────────────────────────────────────────────────────────────────────────
   The entrance.

   A name and a welcome and nothing else. That single decision is what makes
   the 3D affordable here: the objection was never the lattice, it was a
   lattice competing with content. With nothing to compete with, it can just
   be the room you walk into.

   THE NAME IS IN THE ROOM, NOT ON A PICTURE OF IT. The previous version put
   the type on a flat plate and slid it against the scene — layered parallax,
   which reads as "kind of 3D" because that is exactly what it is. Everything
   here now lives in ONE CSS 3D volume under a single perspective, so the
   browser does the projection rather than us approximating it:

   1. THICKNESS. The name is drawn several times at decreasing translateZ, so
      the letters have a side wall that tapers toward the vanishing point. A
      flat glyph cannot foreshorten; one with depth does, and that is the cue
      that separates real volume from a drop shadow.

   2. OCCLUSION. Motes sit at positive Z — in front of the name — and cross
      over the letters as the volume turns. Nothing sells "inside a space"
      like something passing in front of the subject, and it is the one cue
      layered parallax structurally cannot fake.

   3. ROTATION, NOT TRANSLATION. The volume turns on two axes. Under
      perspective that makes the near end of the name larger than the far end,
      which is the difference between a thing in space and a thing sliding
      across one.

   4. IT NEVER STOPS. A slow float on incommensurate rates, so the pose never
      repeats and the depth stays legible on a phone, where there is no
      pointer to reveal it. The pointer, where there is one, leans the volume
      further and eases back.

   One rAF loop, one transform write per frame, on one element. Everything
   inside is positioned once and reprojected by the browser, so the depth
   costs nothing per frame.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = "Jay Harwani";

/* The side wall: the name again at each depth, in the colour the light falls
   off to. Eight planes, spaced tightly at the front and further apart as they
   darken: close enough that the perspective taper does not open visible gaps
   between them at the ends of a wide word, deep enough that the edge reads as
   thickness rather than as a drop shadow. Fifty-two units of depth against a
   1150 perspective is a 4.3% taper, so the far end of the name is genuinely
   smaller than the near end — which is the whole point. */
const WALL = [
  { z: -3, c: "#98A4B8" },
  { z: -7, c: "#6C798E" },
  { z: -12, c: "#505B6D" },
  { z: -18, c: "#3D4757" },
  { z: -25, c: "#2E3745" },
  { z: -33, c: "#232B37" },
  { z: -42, c: "#1A212B" },
  { z: -52, c: "#131922" },
];

/* Motes, deterministic so the composition is a decision rather than a slot
   machine.

   The ones at POSITIVE z sit in front of the name, and they are the point.
   Occlusion is the one depth cue layered parallax cannot fake, and a thing
   crossing in front of the subject is what tells you there is space between
   you and it.

   They are also out of focus, and that is not decoration either: a real lens
   holds one plane sharp and blurs everything nearer and further. Blurring the
   near motes is what makes the name read as the focal plane of a camera
   inside the scene rather than as the top layer of a stack. The far ones take
   a lighter blur for the same reason from the other side. */
const MOTES = (() => {
  let a = 9;
  const rand = () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return Array.from({ length: 26 }, () => {
    const front = rand() > 0.55;
    const k = rand();
    return front
      ? {
          x: rand() * 118 - 9,
          y: rand() * 118 - 9,
          z: 110 + k * 190,
          /* nearer reads bigger and softer, the way out-of-focus light does */
          s: 7 + k * 11,
          b: 3.5 + k * 4,
          o: 0.34 - k * 0.14,
        }
      : {
          x: rand() * 118 - 9,
          y: rand() * 118 - 9,
          z: -540 + k * 430,
          s: 1.8 + rand() * 2.6,
          b: (1 - k) * 1.4,
          o: 0.18 + rand() * 0.34,
        };
  });
})();

export default function Hero() {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const lite = usePerfTier() === "lite";
  const tierReady = useTierReady();
  const depth = !reduce && !lite && tierReady;
  /* Neither the float nor the WebGL scene has anything to say once the hero
     is off screen, and both were running for the life of the page — competing
     for frames with the work list's scroll and its four live previews. Both
     stop at the fold now and pick up on the way back.

     The state is OFFSCREEN rather than in-view, and the default is false, and
     that is deliberate. An observer that never speaks is a case this page has
     already been bitten by three times; phrased as "run unless told to stop",
     a silent observer leaves the hero animating exactly as it did before this
     optimisation existed. Phrased the other way it would leave it frozen. An
     optimisation should be able to fail to save work, never to break it. */
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
     comes first: the document is already visible; it becomes visible later,
     so a link opened from another app still gets its entrance instead of
     arriving pre-finished; or three and a half seconds pass and the ticker
     has not moved, in which case the text goes up regardless. setTimeout is
     not rAF-driven, so that last guard fires in precisely the case that
     breaks the other two. */
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
        /* the side wall arrives after the face, so the reveal stays a clean
           rise rather than a rise that already has its own edge standing
           behind it */
        .from(".entry__wall", { opacity: 0, duration: 1.1 }, 1.0)
        .from(".entry__rule", { scaleX: 0, duration: 1.1, transformOrigin: "center" }, 0.9)
        .from(".entry__mote", { opacity: 0, duration: 1.4, stagger: 0.012 }, 0.8)
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

  /* ── the float ──
     The rates are incommensurate (0.21 / 0.13 / 0.17 / 0.11), which is what
     keeps the volume from returning to a pose you have already seen. A single
     sine reads as a loop inside about ten seconds. */
  useEffect(() => {
    if (reduce || offscreen) return;
    const el = world.current;
    if (!el) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    let ex = 0;
    let ey = 0;
    let lx = -9999;
    let ly = -9999;
    const t0 = performance.now();

    const frame = (now: number) => {
      const t = (now - t0) / 1000;
      /* the pointer trails hard, so the volume leans rather than snapping */
      ex += (px - ex) * 0.045;
      ey += (py - ey) * 0.045;
      const rx = Math.sin(t * 0.21) * 2.6 - ey * 7;
      const ry = Math.sin(t * 0.13 + 1.1) * 4.6 + ex * 9;
      const tz = Math.sin(t * 0.17) * 24;
      const ty = Math.sin(t * 0.11 + 0.6) * 9;
      el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, ${tz.toFixed(2)}px) rotateX(${rx.toFixed(3)}deg) rotateY(${ry.toFixed(3)}deg)`;
      if (light.current && lx > -9000) {
        light.current.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onMove = (e: PointerEvent) => {
      lx = e.clientX;
      ly = e.clientY;
      px = e.clientX / window.innerWidth - 0.5;
      py = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [reduce, offscreen]);

  /* One row of glyphs. The side wall reuses it verbatim rather than rendering
     plain text, because identical markup is the only way to guarantee
     identical layout: a plain span sits on the baseline while the clipped
     face aligns to the bottom of its line box, and the wall would be a few
     pixels out at every depth. */
  const row = (inner: string) =>
    NAME.split("").map((ch, k) =>
      ch === " " ? (
        <span key={k} className="entry__sp">
          &nbsp;
        </span>
      ) : (
        <span key={k} className="entry__clip">
          <span className={inner}>{ch}</span>
        </span>
      )
    );

  return (
    <section ref={root} className="band band--ink entry" aria-label="Welcome">
      {/* the ground: a dot lattice that needs no WebGL, so it is there on
          every tier, plus a pointer light and a grain that keeps a large dark
          field from reading as a void */}
      <div className="entry__ground" aria-hidden="true" />
      {!reduce && <div className="entry__light" ref={light} aria-hidden="true" />}
      <div className="entry__grain" aria-hidden="true" />

      {depth && (
        <Suspense fallback={null}>
          <HeroScene interactive running={!offscreen} />
        </Suspense>
      )}

      <div className="entry__stage">
        <div className="entry__world" ref={world}>
          {/* atmosphere, at depth, so it recedes with everything else rather
              than sitting on the glass */}
          <div className="entry__halo" aria-hidden="true" />

          <div className="entry__plate">
            <p className="micro entry__welcome">Welcome to my portfolio</p>

            <h1 className="entry__name" aria-label={NAME}>
              {WALL.map((layer, i) => (
                <span
                  key={i}
                  className="entry__wall"
                  style={{ transform: `translateZ(${layer.z}px)`, color: layer.c }}
                  aria-hidden="true"
                >
                  {row("entry__dg")}
                </span>
              ))}
              <span className="entry__face" aria-hidden="true">
                {row("entry__g")}
              </span>
            </h1>

            <div className="entry__rule" aria-hidden="true" />
          </div>

          {MOTES.map((m, i) => (
            <span
              key={i}
              className="entry__mote"
              aria-hidden="true"
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                width: `${m.s}px`,
                height: `${m.s}px`,
                opacity: m.o,
                /* through a custom property rather than the filter itself, so
                   a phone can drop every blur pass in one CSS rule */
                ["--b" as string]: `${m.b.toFixed(2)}px`,
                transform: `translateZ(${m.z}px)`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="entry__cue">
        <span className="micro">Scroll</span>
        <span className="entry__arrow" aria-hidden="true" />
      </div>
    </section>
  );
}
