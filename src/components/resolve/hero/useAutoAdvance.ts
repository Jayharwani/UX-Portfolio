import { useEffect, type RefObject } from "react";
import { HERO_CARDS, type ProductKey } from "../../../data/heroCards";
import { onFrame } from "../../../lib/clock";

/* --------------------------------------------------------------------------
   THE CARD TURNS ITSELF OVER.

   Every six and a half seconds, with a line that fills so the change is
   announced rather than sprung. It stops for anything that suggests somebody
   is reading, and the list of those is the whole of this module.
   -------------------------------------------------------------------------- */

const EVERY_MS = 6500;

export function useAutoAdvance(opts: {
  stage: RefObject<HTMLElement | null>;
  /** the live product, by ref: the timer must not restart on every change */
  product: RefObject<ProductKey>;
  /** how far the hand-off has gone, 0 to 1 */
  handoff: RefObject<number>;
  /** false while the fit is unknown or the reader asked for less motion */
  on: boolean;
  /** the code panel is open, so the reader is plainly reading */
  paused: boolean;
  choose: (next: ProductKey) => void;
}): void {
  const { stage, product, handoff, on, paused, choose } = opts;
  useEffect(() => {
    if (!on) return;
    const st = stage.current;
    if (!st) return;

    let t0 = performance.now();
    let held = paused;
    /* IT STOPS THE MOMENT THE HAND-OFF DOES ANYTHING, not merely once the
       hero has left. A timer rebuilding a card nobody can see is a GSAP
       timeline every six seconds for the life of the session, and worse: its
       own enter() tween writes the overlay's opacity, which is a property the
       hand-off is scrubbing — so the annotations came back two fifths of the
       way down, over a card that had already become dust. Two writers on one
       property, and the one on the timer wins. */
    let seen = true;
    const io = new IntersectionObserver(
      ([e]) => {
        seen = e.isIntersecting;
        t0 = performance.now();
      },
      { threshold: 0 },
    );
    const top = document.querySelector("#top");
    if (top) io.observe(top);
    const order: ProductKey[] = HERO_CARDS.map((c) => c.key);

    const stop = onFrame(() => {
      if (document.hidden || held || !seen || (handoff.current ?? 0) > 0.01) {
        t0 = performance.now();
        st.style.setProperty("--hc-advance", "0");
        return;
      }
      const p = (performance.now() - t0) / EVERY_MS;
      st.style.setProperty("--hc-advance", `${Math.min(p, 1)}`);
      if (p >= 1) {
        t0 = performance.now();
        const i = order.indexOf(product.current);
        choose(order[(i + 1) % order.length]);
      }
    });

    const over = () => {
      held = true;
    };
    const out = () => {
      held = false;
      t0 = performance.now();
    };
    st.addEventListener("pointerenter", over);
    st.addEventListener("pointerleave", out);
    st.addEventListener("focusin", over);
    st.addEventListener("focusout", out);
    return () => {
      stop();
      io.disconnect();
      st.removeEventListener("pointerenter", over);
      st.removeEventListener("pointerleave", out);
      st.removeEventListener("focusin", over);
      st.removeEventListener("focusout", out);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [on, paused, choose]);
}
