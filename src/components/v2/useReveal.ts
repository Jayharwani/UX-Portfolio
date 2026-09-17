import { useEffect, useRef, useState } from "react";

/* --------------------------------------------------------------------------
   SECTION REVEAL.

   The reference ships every section with class `rv` in the markup, strips it
   on load and puts it back on intersection. That inversion exists so the page
   still reads with JavaScript off; in React the markup is the render, so the
   honest translation is state.

   IT IS STATE, NOT classList. A section's className is a rendered value here.
   Reaching past React to add a class works right up until something else in
   that component re-renders, at which point React writes the className prop
   back over it and the reveal silently un-reveals. That is not hypothetical:
   it is the bug this hook was written to kill.

   The observer is backed by a timer, as everything in this file's neighbours
   is. A section whose eyebrow never arrives is a section with a blank line
   above it, and the observer not speaking is a failure mode this codebase has
   met more than once.
   -------------------------------------------------------------------------- */

export function useReveal<T extends HTMLElement>(threshold = 0.1, failsafeMs = 2500) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          setSeen(true);
        }
      },
      { threshold }
    );
    io.observe(el);

    const failsafe = window.setTimeout(() => {
      io.disconnect();
      setSeen(true);
    }, failsafeMs);

    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [threshold, failsafeMs, seen]);

  return [ref, seen] as const;
}
