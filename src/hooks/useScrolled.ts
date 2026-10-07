import { useEffect, useRef, useState } from "react";

/* --------------------------------------------------------------------------
   HAS THE PAGE MOVED OFF THE TOP?

   The header goes from transparent to frosted past 8px (§6.1). Reading
   scrollY would mean a scroll listener, and the budget is one for the whole
   site, reserved for the showcase engine (CLAUDE.md rule 3).

   So instead a sentinel: an 8px block pinned at the document origin. While it
   intersects the viewport the page is at the top; the moment it leaves, it is
   not. One observer, no per-frame work, and the browser does the comparing.

   The sentinel is absolutely positioned, so it takes no space in the flow and
   cannot shift the first paint.
   -------------------------------------------------------------------------- */

export function useScrolled() {
  const sentinel = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { sentinel, scrolled };
}
