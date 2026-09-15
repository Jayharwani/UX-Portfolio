import { useState, useEffect } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Is this a phone-width screen?

   The work section needs two genuinely different structures, not one
   structure with mobile CSS bolted on. On a wide screen a pinned stage that
   advances through four projects is a good use of scroll: there is room for
   the copy beside the work, and the eye has a fixed place to read.

   On a phone the same stage is 400vh of scrubbed scroll that shows exactly
   one project at a time, in a column, with no way to look back at the one
   you just passed. That is the thing that was hard to follow, and no amount
   of media query fixes it — the layout is wrong, not its measurements.

   So the choice is made in JS and the two layouts are separate components.
   matchMedia rather than a resize listener: it fires only when the answer
   actually changes, which is a handful of times in a session rather than
   once per resize frame. The breakpoint matches the CSS one.
   ────────────────────────────────────────────────────────────────────────── */

const QUERY = "(max-width: 900px)";

export function useNarrow(): boolean {
  /* read synchronously on first render so the correct layout mounts once,
     rather than mounting the pinned stage and swapping it out a frame later */
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.matchMedia(QUERY).matches
  );

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setNarrow(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return narrow;
}
