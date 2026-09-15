import { useState, useEffect } from "react";
import type { RefObject } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   "Is this on screen yet?" — with the guard that the hero taught us.

   Anything whose resting state is opacity 0 is invisible until something
   says otherwise, and an IntersectionObserver says nothing at all while the
   document is hidden. Measured at phone width: no callback, and rAF never
   ticked either. A phone opening a link from another app mounts hidden, so
   a page built on bare observers can arrive blank and stay blank.

   So `spoke` records whether the observer has said ANYTHING, which is a
   different question from whether the element is on screen — reporting "not
   intersecting" is a working observer. If it has said nothing three seconds
   in, the observer is the broken part and the content goes up without it.

   Two signals out, because they answer different questions:
     `seen`   latches. Used for arrival, so scrolling back up does not fade
              the page out behind you.
     `inView` tracks both ways. Used for anything that should replay.
   ────────────────────────────────────────────────────────────────────────── */

interface Options {
  threshold?: number;
  rootMargin?: string;
  /** false renders the finished state immediately — reduced motion */
  enabled?: boolean;
}

export function useInView(ref: RefObject<Element | null>, opts: Options = {}) {
  const { threshold = 0.2, rootMargin = "-6% 0px -6% 0px", enabled = true } = opts;
  const [seen, setSeen] = useState(!enabled);
  const [inView, setInView] = useState(!enabled);
  /* True when `seen` was set by the failsafe rather than by the observer.
     It matters: a class flip only TRIGGERS an arrival, and the transition it
     triggers still needs frames to advance. In the case this guard exists for
     there may never be one, so a caller that is told `forced` should skip the
     animation and apply the end state outright. */
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setSeen(true);
      setInView(true);
      return;
    }
    let spoke = false;
    const io = new IntersectionObserver(
      ([entry]) => {
        spoke = true;
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setSeen(true);
      },
      { threshold, rootMargin }
    );
    io.observe(el);
    const failsafe = window.setTimeout(() => {
      if (spoke) return;
      setForced(true);
      setSeen(true);
    }, 3000);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [ref, enabled, threshold, rootMargin]);

  return { seen, inView, forced };
}
