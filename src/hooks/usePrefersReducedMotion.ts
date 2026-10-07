import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/** read it without a hook, for decisions that have to be made before first paint */
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia(QUERY).matches;

/* --------------------------------------------------------------------------
   §7.6 asks for this in JS as well as CSS, because some of the contract is a
   decision rather than a duration: whether a frame starts shipped or spec,
   whether the hero runs its intro at all. CSS can only slow a thing down.

   It listens, because the setting can change while the page is open.
   -------------------------------------------------------------------------- */
export function usePrefersReducedMotion(): boolean {
  const [reduce, setReduce] = useState(prefersReducedMotion);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduce;
}
