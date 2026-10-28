import { gsap } from "gsap";
import { springEase } from "../../../lib/spring";

/* --------------------------------------------------------------------------
   THE CARD REBUILDS ITSELF.

   Nine hundred milliseconds, and the only thing that happens in them is DOM:
   the old interface leaves bottom-up, the accent crosses, the new one lands
   top-down and the number counts. The particle field is not involved — the
   card is opaque and above it, so there is nothing to see there.

   THE STAGGER REVERSES. Leaving is bottom-up and arriving is top-down, which
   is what makes it read as one screen being rebuilt rather than as two
   screens crossfading: a rebuild starts where you were looking last and
   finishes where you will look first.
   -------------------------------------------------------------------------- */

const LEAVE_MS = 260;

const els = (root: HTMLElement): HTMLElement[] =>
  Array.from(root.querySelectorAll<HTMLElement>("[data-hc-el]"));

/** The old interface goes. Resolves when the DOM may be swapped. */
export function leave(ui: HTMLElement | null, overlay: HTMLElement | null, reduced: boolean): Promise<void> {
  if (!ui) return Promise.resolve();
  if (reduced) {
    gsap.to([ui, overlay].filter(Boolean), { opacity: 0, duration: 0.1 });
    return new Promise((r) => setTimeout(r, 100));
  }
  const rows = els(ui).reverse();
  gsap.to(overlay, { opacity: 0, duration: 0.16, ease: "none" });
  gsap.to(rows, {
    opacity: 0,
    y: -8,
    filter: "blur(6px)",
    duration: LEAVE_MS / 1000,
    ease: "power2.in",
    stagger: 0.025,
  });
  return new Promise((r) => setTimeout(r, LEAVE_MS));
}

/** The new one lands, and its number counts up from nothing. */
export function enter(ui: HTMLElement | null, overlay: HTMLElement | null, value: number, reduced: boolean): void {
  if (!ui) return;
  const rows = els(ui);
  if (reduced) {
    gsap.set(rows, { clearProps: "all" });
    gsap.fromTo([ui, overlay].filter(Boolean), { opacity: 0 }, { opacity: 1, duration: 0.2 });
    return;
  }
  const spatial = springEase("spatial-default");
  gsap.fromTo(
    rows,
    { opacity: 0, y: 10, filter: "blur(4px)" },
    {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: spatial.duration,
      ease: spatial.ease,
      stagger: 0.045,
      clearProps: "filter",
    },
  );
  gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, delay: 0.43, ease: "none" });

  /* THE NUMBER IS THE CLAIM, so it is the one thing that animates its value
     rather than its opacity. Tabular figures, so the width never jitters. */
  const node = ui.querySelector<HTMLElement>("[data-hc-count]");
  if (node) {
    const n = { v: 0 };
    gsap.to(n, {
      v: value,
      duration: 0.6,
      ease: "expo.out",
      onUpdate: () => {
        node.textContent = Math.round(n.v).toLocaleString("en-US");
      },
      onComplete: () => {
        node.textContent = value.toLocaleString("en-US");
      },
    });
  }
}

/** Wipe anything a half-finished switch left behind. */
export function settle(ui: HTMLElement | null, overlay: HTMLElement | null): void {
  if (ui) gsap.set(els(ui), { clearProps: "all" });
  if (overlay) gsap.set(overlay, { clearProps: "all" });
}
