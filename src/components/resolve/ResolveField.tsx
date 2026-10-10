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

/** rest, then one state per project, then the contact section. Six stops,
 *  five morphs, one lattice. */
const STATES: ShapeName[] = ["rest", "friction", "headroom", "signal", "bumper", "reach"];

/* WHAT THE LAST STOP'S TARGET IS, when a contact button has the pointer.
   Module level rather than a prop, for the same reason getLenis is: the
   buttons are three components away and this changes on pointerenter, which
   is not a thing worth re-rendering a tree for. The scroll still owns HOW FAR
   through the morph the field is; this only swaps WHERE it is heading, so a
   hover halfway up the contact section does the right thing instead of
   snapping. */
let override: ShapeName | null = null;
let overrideAccent: string | null = null;
let onOverride: (() => void) | null = null;

export function setFieldTarget(shape: ShapeName | null, accent?: string): void {
  if (override === shape) return;
  override = shape;
  overrideAccent = accent ?? null;
  onOverride?.();
}

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
      /* every stop on the page, not only the project chapters: the contact
         section is the sixth state and has to be measured with the rest */
      const chapters = Array.from(document.querySelectorAll<HTMLElement>(".rs-stop"));
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

      const to = STATES[Math.min(from + 1, STATES.length - 1)];
      /* the override only applies on the final leg, where "reach" lives */
      const onLast = to === "reach";
      const target = override && onLast ? override : to;
      handle.morph(STATES[from], target, t);

      /* QUIET UNTIL ASKED. Through the contact section the field holds back
         so the two buttons are unmistakably the foreground, and a hover
         brings it all the way up. That is what makes the hover feel like the
         page answering rather than like a hover state: the whole object wakes
         up, it does not just change shape. */
      handle.setOpacity(onLast && t > 0.35 ? (override ? 1 : 0.4) : 1);
      if (override && overrideAccent) handle.setAccent(overrideAccent);

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
        /* the contact stop has no project, so it keeps the last one's colour
           until a button asks for its own */
        if (nearest < ISSUES.length) handle.setAccent(TOKENS[ISSUES[nearest].accent]);
        onActive(Math.min(nearest, ISSUES.length - 1));
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

    /* a hover has to redraw even when the page has not moved */
    onOverride = () => {
      lastY = Number.NaN;
      apply(getLenis()?.animatedScroll ?? window.scrollY);
    };

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
      onOverride = null;
      override = null;
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
