/* --------------------------------------------------------------------------
   MAGNETIC BUTTONS.

   A button that leans toward the pointer before you reach it tells you it is
   reachable, which is most of what a hover state is for. The lean is small,
   six pixels, because the point is that the button noticed you, not that it
   is trying to escape.

   WHY DELEGATION AND WHY CACHED RECTS. The obvious version listens on the
   window and measures every button on every pointer move, which is eight
   getBoundingClientRect calls at pointer rate, each one able to force layout.
   This arms on entering the row instead: the two rects in that row are
   measured once, the moves that follow are pure arithmetic, and leaving the
   row disarms it. The panels are sticky, so a cached rect stays true for as
   long as the pointer is inside one.

   The offset is written straight onto the button rather than onto a custom
   property on a parent, because a variable on the container recalculates
   styles for every child on every move.
   -------------------------------------------------------------------------- */

/** how far the tile leans, in pixels */
const PULL = 6;
/** the label leans this much further, which is what makes it read as depth */
const LABEL_EXTRA = 1.3;
/** the catchment, as a multiple of the button's own size */
const REACH = 1.4;

type Armed = { el: HTMLElement; label: HTMLElement | null; r: DOMRect };

export function magnetic(root: HTMLElement): () => void {
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  let armed: Armed[] = [];

  const clear = () => {
    for (const a of armed) {
      a.el.style.setProperty("--bx", "0px");
      a.el.style.setProperty("--by", "0px");
      a.label?.style.setProperty("transform", "");
    }
    armed = [];
  };

  const over = (e: PointerEvent) => {
    if (!fine.matches || reduce.matches) return;
    const row = (e.target as HTMLElement | null)?.closest?.(".rs-actions");
    if (!row) {
      if (armed.length) clear();
      return;
    }
    if (armed.length && armed[0].el.closest(".rs-actions") === row) return;
    clear();
    armed = Array.from(row.querySelectorAll<HTMLElement>(".rs-btn")).map((el) => ({
      el,
      label: el.querySelector<HTMLElement>(".rs-btn-text"),
      r: el.getBoundingClientRect(),
    }));
  };

  const move = (e: PointerEvent) => {
    if (!armed.length) return;
    for (const a of armed) {
      const cx = a.r.left + a.r.width / 2;
      const cy = a.r.top + a.r.height / 2;
      const nx = (e.clientX - cx) / ((a.r.width * REACH) / 2);
      const ny = (e.clientY - cy) / ((a.r.height * REACH) / 2);
      /* outside the catchment it simply does not pull, rather than pulling
         less and less forever */
      const inside = Math.abs(nx) <= 1 && Math.abs(ny) <= 1;
      const x = inside ? nx * PULL : 0;
      const y = inside ? ny * PULL : 0;
      a.el.style.setProperty("--bx", `${x.toFixed(2)}px`);
      a.el.style.setProperty("--by", `${y.toFixed(2)}px`);
      if (a.label) {
        a.label.style.transform = inside
          ? `translate(${(x * (LABEL_EXTRA - 1)).toFixed(2)}px, ${(y * (LABEL_EXTRA - 1)).toFixed(2)}px)`
          : "";
      }
    }
  };

  root.addEventListener("pointerover", over);
  root.addEventListener("pointermove", move, { passive: true });
  root.addEventListener("pointerleave", clear);

  return () => {
    clear();
    root.removeEventListener("pointerover", over);
    root.removeEventListener("pointermove", move);
    root.removeEventListener("pointerleave", clear);
  };
}
