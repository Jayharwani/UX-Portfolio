import { useEffect, useRef } from "react";
import { createField, type FieldHandle } from "../../lib/pointField";
import { gsap } from "gsap";
import { onFrame } from "../../lib/clock";
import { getLenis } from "../print-run/SmoothScroll";
import { ANIMATED, type ShapeName } from "../../lib/shapes";
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
const STATES: ShapeName[] = ["drift", "friction", "headroom", "signal", "bumper", "reach"];

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

/* WHERE EACH STATE IS READ FROM. Every shape has an angle that explains it
   and angles that hide it: the funnel wants to be seen slightly from above so
   the narrowing is a narrowing and not a triangle, the queue wants to be
   looked along so the compression has length, the map wants height. The
   camera travels between these as the lattice morphs, so the two moves are
   one move, and the point cloud is somewhere you are rather than something
   you are shown. */
const POSE: Record<ShapeName, [az: number, el: number, dist: number]> = {
  drift: [0.08, 0.05, 5.4],
  /* the icons are upright objects, so the camera stays near their eye line
     and only changes which side it reads them from. Tilting up at a dollar
     sign the way you would tilt over a map makes it illegible, which is the
     whole thing these are here to avoid. */
  friction: [-0.3, 0.1, 4.5],
  headroom: [0.32, 0.04, 4.4],
  signal: [-0.24, 0.08, 4.5],
  bumper: [0.38, 0.06, 4.5],
  reach: [-0.12, 0.08, 5.6],
  rest: [0, 0.05, 5.4],
  sent: [0.3, 0.2, 5.3],
  network: [-0.46, 0.14, 5.0],
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** which part of the page is being read. The hero and the contact section
 *  have no project to be in, so they take the neutral key and the glow with
 *  it; everything between them is a chapter. */
export type Zone = "hero" | "work" | "end";

/** how far right of centre the object sits on a wide screen, in world units.
 *  Enough to clear the copy column completely; not so far that it crowds the
 *  right edge. */
const SIDE = 0.55;

export function ResolveField({
  track,
  onActive,
}: {
  /** the element whose chapters drive the sequence */
  track: React.RefObject<HTMLElement>;
  onActive: (index: number, zone: Zone) => void;
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
    let zone: Zone | null = null;

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
    let clock = 0;
    let animating = true;
    /** two columns or stacked. place() owns it and runs before the loop. */
    let wide = false;

    const apply = (y: number) => {
      if (centres.length < 2) return;
      /* The interpolation walks every point, so it is not worth redoing when
         the reader has not moved. The exception is a state that is alive: the
         hero sheet is a travelling wave, so while any of it is on screen the
         targets have to be rewritten every frame or it freezes. */
      if (!animating && Math.abs(y - lastY) < 0.4) return;
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
      animating = ANIMATED.has(STATES[from]) || ANIMATED.has(to);
      /* the override only applies on the final leg, where "reach" lives */
      const onLast = to === "reach";
      const target = override && onLast ? override : to;
      handle.morph(STATES[from], target, t, clock);

      /* the camera travels on the same t as the shape, so the angle and the
         form arrive together */
      const a = POSE[STATES[from]];
      const b = POSE[target];
      handle.setCamera(mix(a[0], b[0], t), mix(a[1], b[1], t), mix(a[2], b[2], t));

      /* THE LAST SECTION IS CENTRED, SO THE FIELD RETURNS TO THE MIDDLE FOR
         IT. Every chapter above it is two columns and the object belongs in
         the right one; the contact section is one centred column of type with
         two buttons under it, and an object sitting off to one side of that
         reads as a layout that slipped rather than as composition. */
      if (wide) handle.setOffset(mix(SIDE, 0, to === "reach" ? t : 0), 0);

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
      /* the hero reaches until the first chapter is within a screen of the
         middle, which is the same point the lattice starts gathering */
      const here: Zone = y < centres[0] - window.innerHeight * 0.5 ? "hero" : nearest >= ISSUES.length ? "end" : "work";
      if (nearest !== active || here !== zone) {
        active = nearest;
        zone = here;
        /* THE CANVAS AND THE PAGE CHANGE KEY TOGETHER. Both are driven from
           this one line, so there is no scroll position where the chapter
           number is one colour and the object another. */
        if (!override) handle.setAccent(here === "work" ? TOKENS[ISSUES[nearest].accent] : TOKENS.paper);
        onActive(Math.min(nearest, ISSUES.length - 1), here);
      }
    };

    const place = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      /* SIDE BY SIDE IS ABOUT SHAPE, NOT WIDTH. A 1024 pixel tablet held
         upright is wide enough by the old test and far too narrow in fact:
         the camera's field of view is vertical, so a tall viewport does not
         shrink the picture, it crops the sides off it, and the object would
         have run off the right edge. The same test has to hold in the
         stylesheet, which is why STACKED is written there too. */
      wide = w >= 1024 && w / h > 1.25;
      /* stacked, the object still has to clear the copy below it */
      handle.setFit(wide ? 1 : Math.min(0.78, w / h / 0.74));
      handle.resize();
      /* THE FIELD HAS ITS OWN HALF AND MAY NOT LEAVE IT. Wide, that half is
         to the right of the copy column. Narrow, there is no second column,
         so the object takes the top of the screen and the copy takes the
         bottom: a phone has height to spare and no width at all. */
      handle.setOffset(wide ? SIDE : 0, wide ? 0 : 0.6);
      measure();
    };
    place();

    /* THE OPENING, AND IT IS THE PAGE'S OWN CLAIM ACTED OUT.
       The headline says this takes something messy and gives back one clear
       thing, so the first four seconds do exactly that: the lattice arrives
       scattered and churning, and the churn decays until what is left is one
       calm surface. Nothing is choreographed frame by frame; the springs that
       run every later morph are simply chasing a target that has not settled
       yet, which is why the opening and the rest of the page feel like the
       same piece of software.

       3.4 seconds, eased out, so most of the resolving happens early and the
       last of it is a long quiet settle rather than a snap. Reduced motion
       goes straight to the calm state. */
    let intro: gsap.core.Tween | null = null;
    if (!reduce.matches) {
      handle.scatter(4.2);
      const churn = { v: 1 };
      handle.setTurbulence(1);
      intro = gsap.to(churn, {
        v: 0,
        duration: 3.4,
        ease: "power2.out",
        onUpdate: () => handle.setTurbulence(churn.v),
      });
    }

    const stopFrame = onFrame((_t, deltaMs) => {
      clock += deltaMs / 1000;
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
      intro?.kill();
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
