import { useEffect, useRef } from "react";
import { createField, type FieldHandle } from "../../lib/pointField";
import { onFrame } from "../../lib/clock";
import { getLenis } from "../print-run/SmoothScroll";
import type { ShapeName } from "../../lib/shapes";
import { TOKENS } from "../../styles/tokens";
import { ISSUES } from "../../data/issues";

/* --------------------------------------------------------------------------
   THE FIELD.

   One lattice, fixed behind the whole page, deformed by scroll position. It
   is the only 3D on the site and it is never decoration: each state is a
   product's actual mechanic, and the thing you are reading about is the thing
   you are looking at.

   ONE OBJECT ALL THE WAY DOWN. The alternative was four separate scenes, one
   per project, and that is four things to look at rather than one thing
   changing. Conservation is the argument: the points that were ten thousand
   reviews become the twenty-five that repeat, and you watch them do it,
   because they are the same points.

   THE MORPH IS SCRUBBED, THE MOTION IS SPRUNG. Scroll sets the target; the
   springs decide how the lattice gets there. That split is what lets someone
   stop halfway, reverse, and have the field turn around with them instead of
   snapping to a new frame of an animation.

   IT IS KEYED TO WHERE THE CHAPTERS ACTUALLY ARE, NOT TO A SCROLL FRACTION.
   Mapping four equal spans onto one trigger looked right and was not: the
   trigger's range is a viewport shorter than the track it covers, so the
   chapter centres landed at 0.25, 1.42, 2.58 and 3.75 of the way through the
   sequence instead of 0.5, 1.5, 2.5 and 3.5. Friction was never more than
   half formed while its own copy was on screen. Measuring each chapter's
   centre and interpolating between those makes the alignment true by
   construction and survives any change to the layout.
   -------------------------------------------------------------------------- */

/** rest, then one state per project, in the order they are read */
const STATES: ShapeName[] = ["rest", "friction", "headroom", "signal", "bumper"];

const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

export function ResolveField({
  track,
  onActive,
}: {
  /** the element whose chapters drive the sequence */
  track: React.RefObject<HTMLElement>;
  onActive: (index: number) => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const field = useRef<FieldHandle | null>(null);

  useEffect(() => {
    const el = canvas.current;
    const host = track.current;
    if (!el || !host) return;

    const handle = createField(el, TOKENS.paper, TOKENS[ISSUES[0].accent]);
    field.current = handle;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let active = -1;

    /** the scroll position at which each chapter sits in the middle of the
     *  viewport, which is where its shape must be exactly formed */
    let centres: number[] = [];
    const measure = () => {
      lastY = Number.NaN;
      const chapters = Array.from(host.querySelectorAll<HTMLElement>(".rs-chapter"));
      const top = window.scrollY;
      centres = chapters.map((c) => {
        const r = c.getBoundingClientRect();
        return r.top + top + r.height / 2 - window.innerHeight / 2;
      });
    };

    let lastY = Number.NaN;

    const apply = (y: number) => {
      if (centres.length < 2) return;
      /* the interpolation walks every point, so it is not worth redoing when
         the reader has not actually moved */
      if (Math.abs(y - lastY) < 0.4) return;
      lastY = y;

      const last = centres.length - 1;
      let from: number;
      let t: number;

      if (y <= centres[0]) {
        /* leaving the hero: the lattice is at rest and gathers into the first
           shape as the first chapter arrives */
        const start = centres[0] - window.innerHeight;
        from = 0;
        t = clamp01((y - start) / Math.max(1, centres[0] - start));
      } else if (y >= centres[last]) {
        from = last;
        t = 1;
      } else {
        let k = 0;
        while (k < last && y >= centres[k + 1]) k++;
        from = k + 1;
        t = clamp01((y - centres[k]) / Math.max(1, centres[k + 1] - centres[k]));
      }

      handle.morph(STATES[from], STATES[Math.min(from + 1, STATES.length - 1)], t);

      /* whichever chapter is nearest the middle owns the page's colour */
      let nearest = 0;
      let best = Infinity;
      for (let k = 0; k < centres.length; k++) {
        const d = Math.abs(y - centres[k]);
        if (d < best) {
          best = d;
          nearest = k;
        }
      }
      if (nearest !== active) {
        active = nearest;
        handle.setAccent(TOKENS[ISSUES[nearest].accent]);
        onActive(nearest);
      }
    };

    /* On a wide screen the copy owns the left third and the lattice sits to
       the right of it. Narrow, there is no room to sit beside anything, so it
       returns to centre and the copy takes a scrim instead. */
    const place = () => {
      handle.resize();
      handle.setOffset(window.innerWidth >= 1024 ? 0.86 : 0);
      measure();
    };
    place();

    /* The opening. Displacing the lattice and letting the springs pull it
       home means the intro is made of the same physics as every later morph,
       so the page has one motion language rather than an overture. Reduced
       motion skips straight to the settled state. */
    if (!reduce.matches) handle.scatter();

    const stopFrame = onFrame((_t, deltaMs) => {
      /* the smoothed value, so the field and the page agree about where the
         reader is within a single frame */
      apply(getLenis()?.animatedScroll ?? window.scrollY);
      handle.tick(deltaMs / 1000);
    });

    const onPointer = (e: PointerEvent) => {
      if (reduce.matches) return;
      handle.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    const onResize = () => place();

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", onResize);
    /* fonts land after first paint and move the chapters, so the centres have
       to be taken again once the page has stopped changing size */
    document.fonts?.ready.then(measure);
    const settle = window.setTimeout(measure, 1200);

    return () => {
      stopFrame();
      window.clearTimeout(settle);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      handle.destroy();
      field.current = null;
    };
  }, [track, onActive]);

  return <canvas className="rs-field" ref={canvas} aria-hidden="true" />;
}
