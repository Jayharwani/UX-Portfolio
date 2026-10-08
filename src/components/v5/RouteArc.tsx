import { useEffect, useRef } from "react";
import { about } from "../../content/home";
import { prefersReducedMotion } from "../../hooks/usePrefersReducedMotion";

/* --------------------------------------------------------------------------
   AHMEDABAD TO BALTIMORE.

   One arc, drawn once, with a dot riding it and the distance counting up in
   step. 12,382 km is the great circle distance verified in v4; the DOM holds
   that number from the first frame and the ticking copy beside it is
   aria-hidden, so the figure is never wrong for anyone reading the text
   rather than watching it (§6.5).

   pathLength="1" normalises the path, so the dash offset is a fraction and
   the same two numbers work whatever the viewBox becomes.
   -------------------------------------------------------------------------- */

const PATH = "M 40 160 C 220 40, 540 40, 720 160";
const DURATION = 1200;
/* --ease-in-out, cubic-bezier(0.65, 0, 0.35, 1), sampled */
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function RouteArc() {
  const root = useRef<SVGSVGElement>(null);
  const line = useRef<SVGPathElement>(null);
  const dot = useRef<SVGCircleElement>(null);
  const km = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const svg = root.current;
    const path = line.current;
    const rider = dot.current;
    const out = km.current;
    if (!svg || !path || !rider || !out) return;

    const total = about.route.km;
    const fmt = (n: number) => `${Math.round(n).toLocaleString("en-US")} km`;

    if (prefersReducedMotion()) {
      path.style.strokeDashoffset = "0";
      rider.style.opacity = "0";
      out.textContent = fmt(total);
      return;
    }

    let raf = 0;
    let t0: number | null = null;
    const len = path.getTotalLength();

    const step = (t: number) => {
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / DURATION, 1);
      const e = ease(p);
      path.style.strokeDashoffset = String(1 - e);
      const at = path.getPointAtLength(len * e);
      rider.setAttribute("cx", String(at.x));
      rider.setAttribute("cy", String(at.y));
      out.textContent = fmt(total * e);
      if (p < 1) raf = requestAnimationFrame(step);
      else rider.style.opacity = "0";
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        rider.style.opacity = "1";
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(svg);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <figure className="route">
      <svg
        viewBox="0 0 760 200"
        className="route-svg"
        ref={root}
        aria-hidden="true"
        focusable="false"
      >
        <path className="route-line" d={PATH} pathLength="1" ref={line} />
        <circle className="route-end" cx="40" cy="160" r="3.5" />
        <circle className="route-end" cx="720" cy="160" r="3.5" />
        <circle className="route-rider" r="3" ref={dot} cx="40" cy="160" />
      </svg>

      <figcaption className="route-caption">
        <span className="route-from">{about.route.from}</span>
        <span className="route-km tnum">
          {/* the real number, always; the ticking copy beside it is decoration */}
          <span className="visually-hidden">
            {about.route.km.toLocaleString("en-US")} km
          </span>
          <span aria-hidden="true" ref={km}>
            {about.route.km.toLocaleString("en-US")} km
          </span>
        </span>
        <span className="route-to">{about.route.to}</span>
      </figcaption>
    </figure>
  );
}
