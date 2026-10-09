import { gsap } from "gsap";

/* --------------------------------------------------------------------------
   THE SHIPPED STAMP.

   SPEC.md says nothing overshoots. This is the one place that is allowed to,
   and the exception is narrow and deliberate: a stamp that eases politely to
   rest is not a stamp, it is a label fading in. An impact needs a hit, so
   back.out(2.6) and a 3px shake for 140ms.

   ONE SHOT, NOT SCRUBBED. Everything else in the Issue Run is tied to scroll
   position, which means scrolling back up plays it in reverse. A stamp coming
   off the page backwards every time someone scrolls up is comedy. The caller
   keeps a set of issues already stamped and this fires once per issue per
   visit.

   Under reduced motion it still lands, with no travel and no shake. The word
   SHIPPED is information about the product, not decoration, so it may not be
   something only people who tolerate motion get to read.
   -------------------------------------------------------------------------- */

export function impact(stamp: HTMLElement | null, cover: HTMLElement | null): void {
  if (!stamp) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.set(stamp, { autoAlpha: 1, scale: 1, rotate: -8 });
    return;
  }
  const tl = gsap.timeline();
  tl.fromTo(
    stamp,
    { autoAlpha: 0, scale: 1.6, rotate: -16 },
    { autoAlpha: 1, scale: 1, rotate: -8, duration: 0.26, ease: "back.out(2.6)" },
  );
  if (cover) {
    /* 3px, which is inside every photosensitivity guideline going, and enough
       to feel like the page took the hit. */
    tl.to(cover, { keyframes: { x: [0, -3, 3, -2, 0] }, duration: 0.14, ease: "none" }, 0.18);
  }
}
