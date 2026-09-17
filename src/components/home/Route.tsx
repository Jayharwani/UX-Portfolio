import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { useInView } from "./useInView";

/* ──────────────────────────────────────────────────────────────────────────
   The route. Ahmedabad to Baltimore, drawn instead of described.

   The band this replaces was a four-line sentence and nine tool names set as
   running text — twenty-two words where the whole point is one fact about a
   person. A sentence that long has to be read; a line between two points is
   understood before you have decided to look at it.

   IT SPEAKS THE PAGE'S OWN LANGUAGE. Nodes, threads and a dot lattice, the
   same vocabulary as the hero's ground and the constellation. Reusing it
   here means the site argues once instead of inventing a second visual
   system for its one biographical moment.

   THE DISTANCE IS REAL. 12,400 km is the great-circle distance between
   23.02N 72.57E and 39.29N 76.61W, computed rather than estimated
   (haversine gives 12,386 km; the label rounds). A number on a diagram is a
   claim, and a wrong one is worse than no number.

   THE ARC DRAWS, IT DOES NOT FADE. pathLength="1" normalises the curve so
   the dash offset is 0 to 1 regardless of its real length — no measuring in
   JS, no magic number to go stale if the geometry is nudged.

   AND IT DRAWS AT THE SPEED YOU SCROLL. It used to fire once on entering the
   viewport and play out on its own timer, which meant the one graphic on the
   page about travelling a distance was something you watched rather than
   something you did. Now the line is tied to scroll position: the journey
   advances because the reader advances, the kilometre count rises with it,
   and the Baltimore node lands only when the line actually reaches it.

   THE SCRUB IS A SCROLL LISTENER WRITING A STYLE, not a frame loop reading
   one. It is correct on its first call, which an observer is not, and the
   browser already coalesces scroll events to about one per frame.
   ────────────────────────────────────────────────────────────────────────── */

/* viewBox units. The wrapper carries the same ratio in CSS, so the SVG
   scales uniformly and percentage positions map linearly onto it — which is
   what lets the labels be real HTML instead of <text> that shrinks to 8px on
   a phone. */
const W = 520;
const H = 240;
const FROM = { x: 84, y: 176 };
const TO = { x: 436, y: 96 };
const ARC = `M${FROM.x} ${FROM.y} Q260 8 ${TO.x} ${TO.y}`;

const pct = (v: number, total: number) => `${((v / total) * 100).toFixed(3)}%`;

/** great-circle Ahmedabad to Baltimore, rounded. The label counts to this. */
const KM = 12400;

export default function Route() {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const arc = useRef<SVGPathElement>(null);
  const dist = useRef<HTMLParagraphElement>(null);
  const { seen, forced } = useInView(ref, { threshold: 0.3, enabled: !reduce });

  useEffect(() => {
    const host = ref.current;
    const path = arc.current;
    const label = dist.current;
    if (!host || !path || !label) return;

    const fmt = (n: number) => `${n.toLocaleString("en-US")} km`;

    /* Reduced motion gets the finished drawing and the real number. The
       graphic is information, so it is never withheld — only the drawing of
       it is. */
    if (reduce) {
      path.style.strokeDashoffset = "0";
      label.textContent = fmt(KM);
      return;
    }

    const onScroll = () => {
      const b = host.getBoundingClientRect();
      const vh = window.innerHeight;
      /* Starts when the top of the drawing has risen a fifth into view and
         completes as its middle reaches the middle of the screen, so the line
         finishes while the graphic is still centred rather than on its way
         out of frame. */
      const span = b.height * 0.9 + vh * 0.3;
      const t = Math.min(1, Math.max(0, (vh * 0.8 - b.top) / Math.max(span, 1)));
      const eased = t * t * (3 - 2 * t);
      path.style.strokeDashoffset = (1 - eased).toFixed(4);
      label.textContent = fmt(Math.round(eased * KM));
      host.classList.toggle("is-arrived", eased > 0.985);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  return (
    <div ref={ref} className={`route${seen ? " is-in" : ""}${forced ? " is-instant" : ""}`}>
      <svg
        className="route__svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          {/* the lattice, as a pattern rather than 400 circles */}
          <pattern id="rt-dots" width="20" height="20" patternUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="1.1" fill="currentColor" />
          </pattern>
          {/* faded to the edges so it reads as a field catching light in the
              middle of the frame rather than as wallpaper running to the corners */}
          <radialGradient id="rt-fade" cx="50%" cy="50%" r="64%">
            <stop offset="0%" stopColor="#fff" stopOpacity="1" />
            <stop offset="58%" stopColor="#fff" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </radialGradient>
          <mask id="rt-mask">
            <rect width={W} height={H} fill="url(#rt-fade)" />
          </mask>
        </defs>

        <rect
          className="route__field"
          width={W}
          height={H}
          fill="url(#rt-dots)"
          mask="url(#rt-mask)"
        />

        <path ref={arc} className="route__arc" d={ARC} pathLength="1" fill="none" />

        <g className="route__node route__node--from">
          <circle cx={FROM.x} cy={FROM.y} r="11" className="route__ring" fill="none" />
          <circle cx={FROM.x} cy={FROM.y} r="4.5" className="route__dot" />
        </g>
        <g className="route__node route__node--to">
          <circle cx={TO.x} cy={TO.y} r="11" className="route__ring" fill="none" />
          <circle cx={TO.x} cy={TO.y} r="4.5" className="route__dot" />
        </g>
      </svg>

      {/* Labels are HTML, not <text>. An SVG that scales to 346px on a phone
          would render a 14px label at 9px; these stay at their own size and
          stay selectable. */}
      <p
        className="route__label route__label--from"
        style={{ left: pct(FROM.x, W), top: pct(FROM.y, H) }}
      >
        Ahmedabad
      </p>
      <p
        className="route__label route__label--to"
        style={{ left: pct(TO.x, W), top: pct(TO.y, H) }}
      >
        Baltimore
      </p>
      {/* The number is written by the scrub, so the markup carries the
          zero state rather than a value that would be wrong for most of
          the scroll. */}
      <p ref={dist} className="route__dist micro">0 km</p>
    </div>
  );
}
