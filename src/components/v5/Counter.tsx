import { useEffect, useRef } from "react";

/* --------------------------------------------------------------------------
   A FIGURE THAT COUNTS UP WITHOUT EVER LYING ABOUT ITS VALUE.

   v4's counters rendered "$0" and "0 this week" and animated upward, so the
   served text, every scraper and every screen reader got the zero. §6.3.6 says
   the DOM always holds the final value, so it does: the accessible text is a
   visually hidden span that is only ever the real number, and the roll is an
   aria-hidden duplicate beside it.

   It starts at 60% of the final value rather than zero. A number that climbs
   from nothing reads as a loading bar; one that climbs the last stretch reads
   as a number settling.
   -------------------------------------------------------------------------- */

const EASE_OUT = (t: number) => 1 - Math.pow(1 - t, 4);
const DURATION = 700;

export function Counter({
  value,
  prefix,
  run,
  reduce,
}: {
  /** the final value, already the one in the DOM */
  value: number;
  prefix?: string;
  /** the one-shot: flips true when the frame ships on screen */
  run: boolean;
  reduce: boolean;
}) {
  const roll = useRef<HTMLSpanElement>(null);
  const played = useRef(false);
  const fmt = (n: number) => `${prefix ?? ""}${Math.round(n).toLocaleString("en-US")}`;

  useEffect(() => {
    const el = roll.current;
    if (!el) return;
    if (reduce || !run || played.current) {
      el.textContent = fmt(value);
      return;
    }
    played.current = true;

    const from = value * 0.6;
    let raf = 0;
    let t0: number | null = null;
    const step = (t: number) => {
      /* a tab hidden mid-count comes back to the final value, not to a frozen
         partial one: rAF does not fire while hidden, so the next frame after
         it returns is already past the end */
      if (document.hidden) {
        el.textContent = fmt(value);
        return;
      }
      if (t0 === null) t0 = t;
      const p = Math.min((t - t0) / DURATION, 1);
      el.textContent = fmt(from + (value - from) * EASE_OUT(p));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [run, reduce, value, prefix]);

  return (
    <>
      <span className="visually-hidden">{fmt(value)}</span>
      <span className="pv-roll" aria-hidden="true" ref={roll}>
        {fmt(value)}
      </span>
    </>
  );
}
