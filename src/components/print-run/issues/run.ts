import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { impact } from "./impact";

gsap.registerPlugin(ScrollTrigger);

/* --------------------------------------------------------------------------
   THE ISSUE RUN.

   Four covers rise out of a stack, hold while their three panels pop in, take
   a SHIPPED stamp, and turn away like a page. One timeline unit per issue,
   mapped to 80vh of scroll each.

   SCROLL DRIVES THE TIMELINE. GSAP NEVER DRIVES SCROLL. That distinction is
   the difference between a pinned section and scroll-jacking: the reader
   keeps their own scroll speed, their own momentum and their own scrollbar,
   and the covers are simply a function of where they are. Nothing is ever
   taken over.

   OPACITY, NOT autoAlpha. autoAlpha sets visibility:hidden at zero, which
   takes the hidden covers out of the tab order entirely, and then "Tab
   reaches every project" quietly stops being true. The covers stay focusable
   and a focusin handler scrolls the run to whichever one just received focus,
   so the keyboard path and the pointer path land in the same place. Pointer
   events are handled in CSS off the data-active attribute instead, which does
   not affect focus.

   THE STAMP IS NOT SCRUBBED. Everything else here reverses when you scroll
   back up, which is correct for a cover and absurd for a stamp.
   -------------------------------------------------------------------------- */

type RunOptions = {
  section: HTMLElement;
  stage: HTMLElement;
  issues: HTMLElement[];
  onActive: (index: number) => void;
};

/** share of the viewport height each issue occupies in scroll */
const PER_ISSUE = 0.8;

export function buildRun({ section, stage, issues, onActive }: RunOptions): ScrollTrigger {
  const n = issues.length;
  const tl = gsap.timeline({ defaults: { ease: "none" } });
  const stamped = new Set<number>();
  let active = -1;

  issues.forEach((issue, i) => {
    const cover = issue.querySelector<HTMLElement>(".pr-cover-card");
    const panels = issue.querySelectorAll<HTMLElement>(".pr-panel");
    if (!cover) return;
    const tilt = i % 2 ? 4 : -4;

    tl.fromTo(
      cover,
      { z: -300, rotateX: 18, rotateZ: tilt, yPercent: 12, opacity: i === 0 ? 1 : 0 },
      { z: 0, rotateX: 0, rotateZ: 0, yPercent: 0, opacity: 1, duration: 0.25, ease: "power2.out" },
      i,
    );

    tl.fromTo(
      panels,
      { opacity: 0, scale: 0.92, rotateZ: (k: number) => [-3, 2, -2][k] ?? 0 },
      { opacity: 1, scale: 1, rotateZ: 0, duration: 0.2, stagger: 0.04, ease: "power2.out" },
      i + 0.2,
    );

    /* The last cover does not turn away. The pin releases into Contact from
       here, and a cover flipping off the screen as the section ends looks
       like the page broke rather than like it finished. */
    if (i < n - 1) {
      tl.to(cover, { rotateY: -105, xPercent: -18, opacity: 0, duration: 0.25, ease: "power2.in" }, i + 0.75);
      tl.to(panels, { opacity: 0, x: 40, duration: 0.15, ease: "power1.in" }, i + 0.75);
    }
  });

  /* Pad to exactly n units, so self.progress * n maps cleanly onto issues. */
  tl.set({}, {}, n);

  return ScrollTrigger.create({
    trigger: section,
    pin: stage,
    start: "top top",
    end: () => `+=${Math.round(n * window.innerHeight * PER_ISSUE)}`,
    scrub: 0.6,
    animation: tl,
    invalidateOnRefresh: true,
    onUpdate(self) {
      const pos = self.progress * n;
      const i = Math.min(n - 1, Math.max(0, Math.floor(pos)));

      if (i !== active) {
        active = i;
        issues.forEach((el, k) => {
          if (k === i) el.setAttribute("data-active", "");
          else el.removeAttribute("data-active");
        });
        onActive(i);
      }

      const local = pos - i;
      /* The plate settling: a few pixels of drift on the cover's emblem, read
         straight off scroll position rather than a timer. */
      issues[i].style.setProperty("--local", local.toFixed(3));

      if (local > 0.35 && !stamped.has(i)) {
        stamped.add(i);
        impact(issues[i].querySelector(".pr-stamp"), issues[i].querySelector(".pr-cover-card"));
      }
    },
  });
}

/** Where to scroll so issue `i` sits at the middle of its hold. */
export function issueScrollTarget(trigger: ScrollTrigger, i: number, n: number): number {
  const span = trigger.end - trigger.start;
  return trigger.start + (span * (i + 0.45)) / n;
}
