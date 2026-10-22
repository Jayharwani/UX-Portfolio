import { useLayoutEffect, useRef } from "react";

/* --------------------------------------------------------------------------
   CHAPTER LIGHT.

   The page used to hold one near-black ground all the way down, and only the
   particles changed key. Now each chapter has its own light: a soft glow in
   that chapter's accent, sitting behind the object as if the object were
   lighting the room. Scroll on and the light travels across to where the next
   object forms and changes colour on the way, in one move that lands with the
   formation.

   IT REPLACES THE OLD GLOW RATHER THAN JOINING IT. There was already a single
   radial gradient on .v2.rs::before, driven by --glow-x and --chapter-accent.
   Two lights in the same slot would have been twice the brightness on two
   different clocks — 600ms for the old one against 900 and 1300 here — so the
   old one is gone and --glow-x, --glow-y and --side went with it.

   SEVEN LAYERS, ALL MOUNTED, NONE RE-RENDERED. A crossfade needs both states
   present at once, and a layer that mounts on the frame it is needed has no
   previous opacity to travel from. React only ever touches these when the
   active key changes, which is once a chapter; the transition itself is CSS.

   The table below is measured, not derived: where each formation actually
   settles on screen. It alternates because the chapters do, but the numbers
   are not a parity rule and should not be rewritten as one.
   -------------------------------------------------------------------------- */

export type AtmosKey = "hero" | "healthy" | "friction" | "headroom" | "signal" | "bumper" | "end";

const KEYS: AtmosKey[] = ["hero", "healthy", "friction", "headroom", "signal", "bumper", "end"];

/** the horizontal centre of each light, in vw. Only the differences are used:
 *  how far a light has to travel to stand where the next one does. */
const X: Record<AtmosKey, number> = {
  hero: 64,
  healthy: 61,
  friction: 37,
  headroom: 64,
  signal: 35,
  bumper: 66,
  end: 50,
};

/** the hero and the contact section have no project to be in, so they take no
 *  room wash; everything between them tints the whole viewport 3%. */
const CHAPTER = new Set<AtmosKey>(["healthy", "friction", "headroom", "signal", "bumper"]);

const STACKED = "(max-width: 1023.98px), (max-aspect-ratio: 5/4)";

export function Atmos({ active }: { active: AtmosKey }) {
  const root = useRef<HTMLDivElement>(null);
  const was = useRef<AtmosKey | null>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const from = was.current;
    if (from === active) return;
    was.current = active;

    const layer = (k: AtmosKey) => el.querySelector<HTMLElement>(`[data-k="${k}"]`);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    /* no horizontal travel when there is only one column to be in, when one
       end of the move is the contact section's five-colour bar, or when the
       reader has asked for less movement */
    const travel =
      !!from && from !== "end" && active !== "end" && !reduce && !window.matchMedia(STACKED).matches;

    if (from) {
      const out = layer(from);
      if (out) {
        out.classList.remove("on");
        /* it leaves toward where the new object is, so the two lights read as
           one light handing over rather than as a dissolve between two */
        out.style.transform = reduce ? "" : travel ? `translate3d(${X[active] - X[from]}vw,0,0) scale(.9)` : "scale(.9)";
      }
    }

    const inc = layer(active);
    if (inc) {
      if (!reduce && parseFloat(getComputedStyle(inc).opacity) < 0.05) {
        /* IT STARTS WHERE THE OLD ONE WAS, but only if it is actually out of
           sight. On a fast scroll back a light can still be fading, and
           snapping that one to the far side is the jump this guard exists to
           prevent: it simply carries on from wherever it is. */
        inc.style.transition = "none";
        inc.style.transform = travel && from ? `translate3d(${X[from] - X[active]}vw,0,0) scale(.9)` : "scale(.9)";
        /* read, to commit the start state before the transition comes back */
        void inc.offsetWidth;
        inc.style.transition = "";
      }
      inc.style.transform = reduce ? "" : "none";
      inc.classList.add("on");
    }

    /* the wash is a colour, so the stylesheet owns it: a data attribute here
       and one rule per key there, rather than a color-mix built in script */
    if (CHAPTER.has(active)) el.dataset.wash = active;
    else delete el.dataset.wash;
  }, [active]);

  return (
    <div className="rs-atmos" aria-hidden="true" ref={root}>
      {/* the slow drift is on its own element so the keys can be transformed
          for the hand-over without the two transforms fighting over one box */}
      <div className="atm-drift">
        {KEYS.map((k) => (
          <div key={k} className={k === "end" ? "atm-k atm-end" : "atm-k"} data-k={k} />
        ))}
      </div>
    </div>
  );
}
