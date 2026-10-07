import { useEffect, useState } from "react";

/* --------------------------------------------------------------------------
   WHICH SECTION THE READER IS IN.

   One IntersectionObserver over every section, never a scroll listener
   (CLAUDE.md rule 3). The band is the middle 5% of the viewport: a section
   counts as current only once it reaches the middle of the screen and stops
   counting once it leaves, so the header never flickers between two names
   while one scrolls past the other.

   `ids` must be a stable reference. Passing a fresh array each render would
   tear down and rebuild the observer on every render, which is the quiet
   version of a leak.
   -------------------------------------------------------------------------- */

export function useCurrentSection(ids: readonly string[]): string | null {
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        /* resolve in document order, so when a long section and the top of the
           next one are both in the band the earlier one wins */
        setCurrent(ids.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return current;
}
