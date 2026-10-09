import { gsap } from "gsap";

/* --------------------------------------------------------------------------
   STARTING WHAT A MOCKUP ASKED FOR.

   The mockup markup declares its own behaviour (data-count="412", data-clock)
   rather than being a program, so this reads those attributes after the nodes
   land and animates them.

   ON GSAP, NOT ON requestAnimationFrame. The old version in Work.tsx ran two
   private rAF loops per visible mockup. They were cheap individually and they
   were still two more schedulers than this page is allowed: perf/BASELINE.md
   is about exactly that sum. Tweening through GSAP puts them on the one clock
   with everything else.

   THE CLOCK STOPS AFTER FIVE SECONDS. WCAG 2.2.2 requires a mechanism to stop
   any auto-updating information that starts automatically and lasts more than
   five seconds. Nothing on a cover is worth a conformance failure, and a
   countdown that has made its point and then settles reads as deliberate
   anyway.
   -------------------------------------------------------------------------- */

const COUNT_MS = 1600;
const CLOCK_LIMIT_S = 5;

export function playMockup(root: HTMLElement | null): () => void {
  if (!root) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    /* Final values, immediately: the number is information, not decoration. */
    root.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
      n.textContent = Number(n.dataset.count).toLocaleString();
    });
    const still = root.querySelector<HTMLElement>("[data-clock]");
    if (still) still.textContent = "24:00";
    return () => {};
  }

  const tweens: gsap.core.Tween[] = [];

  root.querySelectorAll<HTMLElement>("[data-count]").forEach((node) => {
    const to = Number(node.dataset.count);
    if (!Number.isFinite(to)) return;
    const box = { v: 0 };
    tweens.push(
      gsap.to(box, {
        v: to,
        duration: COUNT_MS / 1000,
        ease: "power4.out",
        onUpdate: () => {
          node.textContent = Math.round(box.v).toLocaleString();
        },
      }),
    );
  });

  const clock = root.querySelector<HTMLElement>("[data-clock]");
  if (clock) {
    const box = { s: 1440 };
    tweens.push(
      gsap.to(box, {
        s: 1440 - CLOCK_LIMIT_S,
        duration: CLOCK_LIMIT_S,
        ease: "none",
        onUpdate: () => {
          const v = Math.max(Math.floor(box.s), 0);
          clock.textContent = `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
        },
      }),
    );
  }

  return () => tweens.forEach((t) => t.kill());
}
