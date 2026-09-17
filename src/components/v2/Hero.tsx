import { useEffect, useRef, useState } from "react";
import type { FieldHandle } from "../../lib/field";

/* --------------------------------------------------------------------------
   HERO — the plotter headline. HERO.md.

   The headline acts out the sentence. Both lines are drafted as outlines by a
   travelling nib; then ink floods only the first one and an extruded body
   builds behind it. "Designs it." becomes a solid object. "Then ships it."
   stays on the drawing board. The outline is not a style choice — it is the
   unbuilt half.

   THE TYPE IS REAL SVG TEXT, rendered two or three times per line and revealed
   by clip rectangles. Paint order inside the SVG is far → extrude → near, and
   it is load-bearing: the extruded body has to sit behind the front face and
   in front of line two.

   THE EXTRUSION IS NOT IN THE JSX. Sixteen duplicated <text> nodes would make
   this component unreadable and React would diff them on every render for
   nothing. They are built once in an effect, and the effect clears the group
   first so a re-render cannot stack a second set.

   THE OPENING WAITS FOR THE FONTS. SVG text does not reflow gracefully when a
   font swaps late — the wipes would run against fallback metrics and stop
   matching the glyphs they are supposed to be drawing. So the timeline hangs
   off a class this adds on document.fonts.ready, with a timer behind it: a
   headline that never draws because a promise never settled is a blank page,
   and this codebase has been caught by that shape of bug more than once.

   THE EXIT READS THE FIELD'S SMOOTHED SCROLL, not window.scrollY. The field
   already lerps it for the camera; using the raw value would put the headline
   and the background on two different curves, and the whole point is that they
   are in the same shot.
   -------------------------------------------------------------------------- */

const NS = "http://www.w3.org/2000/svg";
const LINE1 = "Designs it.";
const LINE2 = "Then ships it.";
const STEPS = 16;
const MASKS = [1, 2, 3] as const;
/** if the font promise never settles, draw anyway rather than show nothing */
const FONT_FAILSAFE_MS = 1200;

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export function Hero({ field }: { field: React.RefObject<FieldHandle | null> }) {
  const wrap = useRef<HTMLElement>(null);
  const type = useRef<HTMLHeadingElement>(null);
  const near = useRef<SVGGElement>(null);
  const far = useRef<SVGGElement>(null);
  const xtrude = useRef<SVGGElement>(null);
  const [go, setGo] = useState(false);

  /* ── the extruded body, and the 3D it lives in ── */
  useEffect(() => {
    const ex = xtrude.current;
    const blk = type.current;
    const nr = near.current;
    const fr = far.current;
    if (!ex || !blk || !nr || !fr) return;

    /* far layer first, so the nearest ends up on top. Each copy is
       fractionally lighter than the one behind it, which gives the body a
       graded side face rather than a flat slab. */
    ex.innerHTML = "";
    const layers: Array<{ el: SVGTextElement; d: number }> = [];
    for (let i = STEPS; i >= 1; i--) {
      const t = document.createElementNS(NS, "text");
      t.setAttribute("x", "0");
      t.setAttribute("y", "134");
      t.style.fill = `rgb(${(10 + i * 1.1) | 0},${(16 + i * 1.4) | 0},${(23 + i * 1.8) | 0})`;
      t.textContent = LINE1;
      ex.appendChild(t);
      layers.push({ el: t, d: i });
    }

    /* Amplitudes are about two-thirds of HERO.md's. The larger figures read as
       a thing being waved at the cursor; this reads as a solid that happens to
       have a near side. Same geometry, quieter register. */
    const place = (ax: number, ay: number) => {
      blk.style.transform = `rotateY(${(ax * 6).toFixed(3)}deg) rotateX(${(-ay * 4).toFixed(3)}deg)`;
      /* far moves AGAINST the rotation while near moves with it. That
         opposition is the parallax; matching their signs flattens the whole
         thing even though the code still runs. */
      nr.setAttribute("transform", `translate(${ax * 19},${ay * 12})`);
      fr.setAttribute("transform", `translate(${-ax * 15},${-ay * 9})`);
      /* the body always throws away from the light, and the direction tracks
         the pointer — as though you were walking around a lit solid */
      const dx = -ax * 2 - 1;
      const dy = ay * 1.7 + 1.35;
      for (const k of layers) {
        k.el.setAttribute("transform", `translate(${ax * 19 + k.d * dx},${ay * 12 + k.d * dy})`);
      }
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      /* still built, still offset — just never animated */
      place(0, 0);
      return;
    }

    let tx = 0;
    let ty = 0;
    let ax = 0;
    let ay = 0;
    const onMove = (e: PointerEvent) => {
      tx = e.clientX / window.innerWidth - 0.5;
      ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tilt = () => {
      ax = lerp(ax, tx, 0.035);
      ay = lerp(ay, ty, 0.035);
      place(ax, ay);
      raf = requestAnimationFrame(tilt);
    };
    raf = requestAnimationFrame(tilt);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  /* ── start the opening once the real glyphs are in ── */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let done = false;
    const start = () => {
      if (done) return;
      done = true;
      setGo(true);
    };
    document.fonts?.ready.then(start).catch(start);
    const failsafe = window.setTimeout(start, FONT_FAILSAFE_MS);
    return () => window.clearTimeout(failsafe);
  }, []);

  /* ── the exit ── */
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const h = field.current;
      if (!h) return;
      const vh = window.innerHeight || 1;
      const p = Math.min(1, Math.max(0, h.getScroll() / vh));
      el.style.transform = `translate3d(0, ${(p * vh * 0.2).toFixed(1)}px, 0) scale(${(
        1 - p * 0.06
      ).toFixed(3)})`;
      el.style.opacity = `${(1 - p * 0.85).toFixed(3)}`;
      el.style.filter = p > 0.001 ? `blur(${(p * 7).toFixed(2)}px)` : "none";
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [field]);

  return (
    <section className={`hero${go ? " go" : ""}`} id="hero" ref={wrap}>
      <h1 className="type" ref={type}>
        <span className="plate" aria-hidden="true" />
        <span className="bloom" aria-hidden="true" />

        {/* one accessible name for the whole sentence, so a screen reader
            hears it once rather than reading five duplicated <text> nodes */}
        <svg viewBox="0 0 1180 350" role="img" aria-label={`${LINE1} ${LINE2}`}>
          <defs>
            {/* A soft leading edge instead of a hard clip. The rect is twice
                the viewBox wide and slides right; the white-to-black ramp sits
                at its midpoint, so what crosses the glyphs is a gradient, not
                a knife. This is the difference between type being wiped on and
                type developing. */}
            <linearGradient id="v2edge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" />
              <stop offset="0.488" stopColor="#fff" />
              <stop offset="0.5" stopColor="#000" />
              <stop offset="1" stopColor="#000" />
            </linearGradient>
            {MASKS.map((m) => (
              <mask key={m} id={`v2m${m}`} maskUnits="userSpaceOnUse" x="-1220" y="-40" width="2400" height="430">
                <rect
                  className={`sweep s${m}`}
                  x="-1220"
                  y="-40"
                  width="2400"
                  height="430"
                  fill="url(#v2edge)"
                />
              </mask>
            ))}
          </defs>

          {/* line 2 sits furthest back */}
          <g ref={far}>
            <text className="outGlow" mask="url(#v2m3)" x="0" y="300">{LINE2}</text>
            <text className="out2" mask="url(#v2m3)" x="0" y="300">{LINE2}</text>
          </g>

          {/* the extruded body, filled in by the effect above */}
          <g className="xtrude" ref={xtrude} mask="url(#v2m2)" />

          {/* line 1 front face */}
          <g className="near" ref={near}>
            <text className="outGlow" mask="url(#v2m1)" x="0" y="134">{LINE1}</text>
            <text className="out" mask="url(#v2m1)" x="0" y="134">{LINE1}</text>
            <text className="ink" mask="url(#v2m2)" x="0" y="134">{LINE1}</text>
          </g>
        </svg>

        <span className="pen" aria-hidden="true" />
        <span className="glint" aria-hidden="true" />
      </h1>

      <p className="byline">Jay Harwani, product designer who writes the front end.</p>
      <div className="hemline">
        <span className="live">
          <i />
          OPEN TO PRODUCT DESIGN ROLES
        </span>
        <span className="cue">
          <i />
          SCROLL
        </span>
      </div>
    </section>
  );
}
