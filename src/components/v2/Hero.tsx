import { useEffect, useRef } from "react";
import type { FieldHandle } from "../../lib/field";

/* --------------------------------------------------------------------------
   HERO — SPEC §7, BUILD step 3.

   Two lines. "Designs it." is filled; "Then ships it." is outlined, so the
   headline separates design from build typographically rather than saying so.

   IT EXITS RATHER THAN SCROLLING AWAY: drifts at 0.2x the page, scales to
   0.94, fades to 0.15 and blurs to 7px across one viewport height.

   THE EXIT READS THE FIELD'S SMOOTHED SCROLL, NOT window.scrollY. The field
   already lerps it for the camera; using the raw value here would make the
   headline and the background travel on two different curves, and the whole
   point is that they are in the same shot. It is also why this takes the
   handle rather than adding a second scroll listener — SPEC §6 allows exactly
   one on the page, and the field owns it.
   -------------------------------------------------------------------------- */

export function Hero({ field }: { field: React.RefObject<FieldHandle | null> }) {
  const wrap = useRef<HTMLElement>(null);

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
    <section className="hero" id="hero" ref={wrap}>
      <h1>
        <span className="ln">
          <span>Designs it.</span>
        </span>
        <span className="ln">
          <span>
            <em>Then ships it.</em>
          </span>
        </span>
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
