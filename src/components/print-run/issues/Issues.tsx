import { useEffect, useState, type RefObject } from "react";
import { PinnedRun } from "./PinnedRun";
import { StackedRun } from "./StackedRun";
import { IssuesHead } from "./IssuesHead";

/* --------------------------------------------------------------------------
   THE ISSUES.

   Chooses between the pinned run and the stacked list, and owns nothing else.

   THE CHOICE IS MADE FROM THE ENVIRONMENT, NOT FROM A USER AGENT STRING. A
   wide viewport, a fine pointer and no reduced-motion preference. A touch
   laptop gets the stacked version, which is correct: a pinned run is driven
   by scroll momentum a touchscreen does not produce in the same way.

   The query is live. Someone who turns on reduced motion, or drags the window
   narrow, gets the other layout without reloading.
   -------------------------------------------------------------------------- */

const PINNED = "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

export function Issues({
  section,
  veil,
  onActive,
}: {
  section: RefObject<HTMLElement>;
  veil: RefObject<HTMLDivElement>;
  onActive: (i: number) => void;
}) {
  const [pinned, setPinned] = useState(() => typeof window !== "undefined" && window.matchMedia(PINNED).matches);

  useEffect(() => {
    const mq = window.matchMedia(PINNED);
    const sync = () => setPinned(mq.matches);
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return (
    <section className="pr-issues" id="work" ref={section}>
      {pinned ? (
        <PinnedRun section={section} veil={veil} onActive={onActive} />
      ) : (
        <>
          <IssuesHead />
          <StackedRun veil={veil} />
        </>
      )}
    </section>
  );
}
