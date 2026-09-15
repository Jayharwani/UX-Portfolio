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

   THE TYPE IS FLAT. THE ROOM IS NOT.

   The previous attempt built the depth into the letters — a side wall, eight
   planes of extrusion. That was the wrong thing to make three-dimensional.
   Extruded TYPE is an effect applied to a word; what makes a word look like
   it is hanging in space is the SPACE. A flat word inside a real volume
   reads as further into that volume than any amount of thickness on a word
   sitting in front of a picture.

   So the name is one colour, one plane, no thickness, and the whole budget
   goes on building a room around it. Four things do that:

   1. DEPTH THAT IS REAL, NOT LAYERED. Everything shares one perspective.
      Dust sits from 2300 units behind the name to 420 in front of it, so the
      near motes are roughly five times the apparent size of the far ones for
      free — the browser divides by distance, we never fake a scale.

   2. THE ROOM MOVES, AND EACH DEPTH MOVES AT ITS OWN SPEED. The volume
      drifts laterally, and under perspective one translation moves every
      plane by a different amount on screen: dust in front sweeps, dust at
      the back barely shifts, the name travels between them. Motion parallax
      is the cue the eye actually uses to judge distance, and it is the thing
      a stack of layers can never get right, because there the ratios are
      guessed and here they are the perspective divide.

   3. TRAVEL. Every mote is flying toward you on its own clock, fading up out
      of the dark and out again as it passes. That is a CSS animation per
      mote — transform and opacity only, so it lives on the compositor and
      costs the main thread nothing at all.

   4. THINGS IN FRONT. Some of it passes between you and the name, out of
      focus, the way a lens renders what is nearer than its focal plane.
      Occlusion is the cue layered parallax structurally cannot fake.
   ────────────────────────────────────────────────────────────────────────── */

const NAME = "Jay Harwani";

/* Deterministic, so the composition is a decision rather than a slot machine. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Mote {
  x: number;
  y: number;
  z0: number;
  z1: number;
  size: number;
  blur: number;
  op: number;
  dur: number;
  delay: number;
}

/* Two populations, because they do two different jobs.

   DUST is the volume: forty-six specks crossing the whole depth of the room,
   small and nearly sharp, which is what gives the space a size.

   BOKEH is the foreground: nine soft discs that only ever live near the
   camera and pass between you and the name. They are blurred because a lens
   holds one plane sharp, and the plane it holds is the one the name is on. */
const { DUST, BOKEH } = (() => {
  const rand = rng(21);

  /* HOW WIDE THE SPREAD CAN BE IS A GEOMETRY PROBLEM, NOT A TASTE ONE.

     A mote's screen position is measured from the perspective origin and
     multiplied by its own scale, so one placed at 100% and flown to z +420
     projects to 50 + 50 x 1.72 = 136% — off the side of the screen long
     before it reaches you. The first version spread them across -25% to
     125% and then wondered where the near field went: measured, five of
     seven foreground discs were off screen at any moment, and they are the
     ones that were supposed to pass in front of the name.

     So the spread is derived from the scale each population reaches.
     Foreground discs hit 2.3x, so they start inside 23-77% and stay on
     screen all the way past you. Dust only reaches 1.7x and is allowed to
     sail out of frame near the end, which is what dust should do. */
  const dust: Mote[] = [];
  for (let i = 0; i < 46; i++) {
    const dur = 30 + rand() * 34;
    dust.push({
      x: rand() * 116 - 8,
      y: rand() * 116 - 8,
      z0: -2300,
      z1: 420,
      size: 2.8 + rand() * 2.8,
      blur: rand() * 0.9,
      op: 0.34 + rand() * 0.46,
      dur,
      /* negative, so the field is already in flight on the first frame
         instead of every mote leaving the back wall together */
      delay: -rand() * dur,
    });
  }
  const bokeh: Mote[] = [];
  for (let i = 0; i < 9; i++) {
    const dur = 38 + rand() * 32;
    bokeh.push({
      x: 23 + rand() * 54,
      y: 23 + rand() * 54,
      z0: -260,
      z1: 780,
      size: 10 + rand() * 12,
      blur: 4 + rand() * 4,
      op: 0.13 + rand() * 0.15,
      dur,
      delay: -rand() * dur,
    });
  }
  return { DUST: dust, BOKEH: bokeh };
})();

const moteStyle = (m: Mote): React.CSSProperties =>
  ({
    left: `${m.x}%`,
    top: `${m.y}%`,
    width: `${m.size.toFixed(2)}px`,
    height: `${m.size.toFixed(2)}px`,
    animationDuration: `${m.dur.toFixed(2)}s`,
    animationDelay: `${m.delay.toFixed(2)}s`,
    /* through custom properties rather than the declarations themselves, so
       one media query can strip every blur pass on a phone */
    "--z0": `${m.z0}px`,
    "--z1": `${m.z1}px`,
    "--o": m.op.toFixed(3),
    "--b": `${m.blur.toFixed(2)}px`,
  }) as React.CSSProperties;

export default function Hero() {
  const reduce = !!useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const world = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);
  const lite = usePerfTier() === "lite";
  const tierReady = useTierReady();
  const depth = !reduce && !lite && tierReady;

  /* Neither the drift nor the WebGL scene has anything to say once the hero
     is off screen, and both were running for the life of the page — competing
     for frames with the work list's scroll and its four live previews. Both
     stop at the fold now and pick up on the way back.

     The state is OFFSCREEN rather than in-view, and it defaults to false, and
     that is deliberate. An observer that never speaks is a case this page has
     already been bitten by three times; phrased as "run unless told to stop",
     a silent one leaves the hero animating exactly as it did before this
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
      /* The field fades up as a whole rather than mote by mote: each mote is
         already running its own opacity keyframes, and animating them
         individually would put two things on the same property. */
      tl.from(".entry__field", { opacity: 0, duration: 1.6 }, 0)
        .from(".entry__welcome", { opacity: 0, y: 10, duration: 0.8 }, 0.25)
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

  /* ── the camera ──
     A LATERAL drift, not a rotation. Rotating the volume tips the name with
     it, which is the extruded-type read this pass exists to get rid of. A
     translation leaves every plane square to you and still produces depth,
     because under perspective one translation moves each depth by a
     different amount on screen: the near dust travels about 1.7x what the
     name does, the far dust about a third of it. That spread is the depth
     cue — and unlike parallax layers driven by hand-picked multipliers, here
     the ratios are not guessed, they are the perspective divide.

     Rates are incommensurate, so the room never returns to a position you
     have already seen. One transform write per frame, on one element; the
     motes' own travel is pure CSS and never touches the main thread. */
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
      /* the pointer trails hard, so the room drifts rather than snapping */
      ex += (px - ex) * 0.04;
      ey += (py - ey) * 0.04;
      const x = Math.sin(t * 0.11) * 15 + ex * 44;
      const y = Math.sin(t * 0.083 + 1.2) * 9 + ey * 26;
      const z = Math.sin(t * 0.067 + 0.4) * 34;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px)`;
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
              than sitting flat on the glass */}
          <div className="entry__halo" aria-hidden="true" />

          {/* the far half of the room */}
          <div className="entry__field" aria-hidden="true">
            {DUST.map((m, i) => (
              <span key={i} className="entry__mote" style={moteStyle(m)} />
            ))}
          </div>

          <div className="entry__plate">
            <p className="micro entry__welcome">Welcome to my portfolio</p>

            {/* one clip per glyph, so the name rises out of nothing rather
                than fading in. Flat: one colour, one plane, no thickness. */}
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

          {/* and the near half, which passes in front of it */}
          <div className="entry__field" aria-hidden="true">
            {BOKEH.map((m, i) => (
              <span key={i} className="entry__mote entry__mote--soft" style={moteStyle(m)} />
            ))}
          </div>
        </div>
      </div>

      <div className="entry__cue">
        <span className="micro">Scroll</span>
        <span className="entry__arrow" aria-hidden="true" />
      </div>
    </section>
  );
}
