import { useCallback } from "react";
import { getLenis } from "./SmoothScroll";
import { ISSUES } from "../../data/issues";

/* --------------------------------------------------------------------------
   WHERE YOU ARE IN THE WORK.

   Four ticks and a count, in the lane the grid keeps clear on the right. It
   is the only piece of fixed interface on the page, which is why it is four
   hairlines and twelve point five pixels of mono rather than a component with
   a background: anything heavier would be a second thing to look at, and this
   page only has room for one.

   THE TICKS ARE BUTTONS, NOT DECORATION. Each one scrolls to its chapter and
   says which project it is, so the rail is a way to move as well as a way to
   know. The hit area is 44px even though the mark is 24 by 1, because the
   mark is what you see and the target is what you press.

   THE COUNTER ROLLS RATHER THAN SWAPS. A digit that cuts to the next one is
   a value changing; a digit that travels is the same object moving, which is
   what a position in a sequence actually is.
   -------------------------------------------------------------------------- */

export function Rail({ active }: { active: number }) {
  const go = useCallback((i: number) => {
    const el = document.querySelectorAll<HTMLElement>(".rs-chapter")[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    const y = r.top + window.scrollY + r.height / 2 - window.innerHeight / 2;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  }, []);

  return (
    <nav className="rs-rail" aria-label="Work">
      <p className="mono rs-rail-count" aria-hidden="true">
        <span className="rs-rail-roll">
          {/* ONE DIGIT PER STEP, in em and not per cent: a percentage on the
              stack is a percentage of the whole stack, so translating it by
              100% scrolled all four out of the window at once. */}
          <span style={{ transform: `translateY(calc(${active} * -1em))` }}>
            {ISSUES.map((p) => (
              <span key={p.key}>{p.no}</span>
            ))}
          </span>
        </span>
        <span className="rs-rail-total">/ {String(ISSUES.length).padStart(2, "0")}</span>
      </p>

      <ul className="rs-rail-ticks">
        {ISSUES.map((issue, i) => (
          <li key={issue.key}>
            <button type="button" data-on={active === i ? "" : undefined} onClick={() => go(i)}>
              <span className="rs-rail-name" aria-hidden="true">
                {issue.title}
              </span>
              <span className="rs-rail-mark" aria-hidden="true" />
              <span className="vh-word">{issue.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
