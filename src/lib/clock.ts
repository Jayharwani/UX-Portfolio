import { gsap } from "gsap";

/* --------------------------------------------------------------------------
   ONE FRAME CLOCK.

   perf/BASELINE.md records the measurement that produced this file: four
   independent animation loops on one page, each individually well behaved,
   summing to desktop jank. Nothing was leaking and nothing was slow. 16.7ms
   simply does not stretch to cover four schedulers that do not know about
   each other.

   So the homepage has exactly one. Lenis, the background field, the WebGL
   emblem and every scroll-linked read subscribe here, and there is no
   requestAnimationFrame anywhere else on the page.

   LAG SMOOTHING IS ON, AND TIGHTER THAN THE DEFAULT. The obvious choice here
   is lagSmoothing(0), so the field's warp and the emblem's damping get the
   real elapsed time instead of a compressed one. It was the first thing
   tried, and it broke the intro outright: parsing the three.js chunk and
   compiling the emblem's shaders blocks for a few hundred milliseconds during
   boot, and with smoothing off that entire gap is handed to the timeline on
   the next tick. The intro fast-forwarded through its own opening and the
   first frame anyone saw was already past the swap at 1230ms. On a slower
   machine it would skip more, not less.

   So: any frame longer than 200ms is treated as 20ms. Normal frames still
   carry their real delta, and both integrators clamp their own input anyway
   (field.ts caps at 50ms, stage.ts at 100ms), so nothing downstream depends
   on this being off.

   gsap.ticker parks itself when the tab hides, so nothing here needs a
   visibilitychange handler.
   -------------------------------------------------------------------------- */

type Tick = (timeSec: number, deltaMs: number) => void;

const subs = new Set<Tick>();
let started = false;

function frame(timeSec: number, deltaMs: number) {
  /* Iterating a copy: a subscriber that unsubscribes itself mid-frame (the
     emblem does, when its stage is disposed) would otherwise mutate the set
     being walked. */
  for (const fn of [...subs]) fn(timeSec, deltaMs);
}

/** Subscribe to the page's only frame loop. Returns its unsubscribe. */
export function onFrame(fn: Tick): () => void {
  if (!started) {
    gsap.ticker.lagSmoothing(200, 20);
    gsap.ticker.add(frame);
    started = true;
  }
  subs.add(fn);
  return () => {
    subs.delete(fn);
  };
}

/** How many callbacks the clock is driving. Used only by the dev overlay. */
export const frameSubscribers = () => subs.size;
