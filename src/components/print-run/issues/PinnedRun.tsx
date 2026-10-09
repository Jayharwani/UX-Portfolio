import { useEffect, useRef, useState, type RefObject } from "react";
import { gsap } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import { ISSUES } from "../../../data/issues";
import { getLenis } from "../SmoothScroll";
import { buildRun, issueScrollTarget } from "./run";
import { preload } from "./turnTo";
import { IssueCover } from "./IssueCover";
import { IssueSpread } from "./IssueSpread";
import { ChapterTabs } from "./ChapterTabs";
import { IssuesHead } from "./IssuesHead";

/* --------------------------------------------------------------------------
   THE PINNED RUN.

   Desktop, fine pointer, motion allowed. Everything else gets StackedRun.

   KEYBOARD FOCUS MOVES THE RUN. All four covers stay in the tab order, which
   means Tab can land on a link inside a cover that is currently scrolled past
   or not yet arrived. A focusin handler scrolls the run to that issue, so the
   keyboard path and the pointer path end up looking at the same thing. The
   alternative, taking hidden covers out of the tab order, silently drops
   three of the four projects for anyone not using a mouse.

   `beat` exists to replay a mockup. Its animations are CSS keyframes tied to
   a class, so a replay is a remount, and a remount is a key change.
   -------------------------------------------------------------------------- */

export function PinnedRun({
  section,
  veil,
  onActive,
}: {
  section: RefObject<HTMLElement>;
  veil: RefObject<HTMLDivElement>;
  onActive: (i: number) => void;
}) {
  const stage = useRef<HTMLDivElement>(null);
  const trigger = useRef<ScrollTriggerType | null>(null);
  const [active, setActive] = useState(0);
  const [beats, setBeats] = useState<number[]>(() => ISSUES.map(() => 0));

  useEffect(() => {
    const host = section.current;
    const pin = stage.current;
    if (!host || !pin) return;

    const issues = Array.from(host.querySelectorAll<HTMLElement>(".pr-issue"));
    if (issues.length !== ISSUES.length) return;

    const st = buildRun({
      section: host,
      stage: pin,
      issues,
      onActive: (i) => {
        setActive(i);
        /* Replay this issue's mockup from the top, the way arriving at it for
           the first time did. */
        setBeats((prev) => prev.map((b, k) => (k === i ? b + 1 : b)));
        onActive(i);
        void preload(ISSUES[i].href);
      },
    });
    trigger.current = st;

    return () => {
      st.kill();
      trigger.current = null;
    };
  }, [section, onActive]);

  /* An explicit duration, because Lenis's default scrollTo eases by distance:
     jumping from issue 01 to issue 04 is 2000px and took over two and a half
     seconds, which does not read as a jump, it reads as the page ignoring the
     tab and then drifting. A tab is a destination, so it takes the same
     deliberate moment whichever one you pick. */
  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = issueScrollTarget(st, i, ISSUES.length);
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(y, { duration: 0.9 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <div className="pr-stage" ref={stage}>
      <IssuesHead />

      <div
        className="pr-run"
        onFocus={(e) => {
          const issue = (e.target as HTMLElement).closest<HTMLElement>(".pr-issue");
          if (!issue) return;
          const i = Number(issue.dataset.index);
          if (!Number.isFinite(i) || i === active) return;
          /* One tick late, on purpose. The browser scrolls a newly focused
             element into view by itself, and it does that AFTER this handler
             returns, so starting the run moving here just got overwritten and
             Tab left the reader looking at the wrong cover. Letting the native
             scroll happen first and then taking over is the only ordering that
             survives it. gsap.delayedCall rides the clock the page already
             has, rather than opening a timer of its own. */
          gsap.delayedCall(0.06, () => goTo(i));
        }}
      >
        {ISSUES.map((issue, i) => (
          <div className="pr-issue" key={issue.key} id={`issue-${issue.key}`} data-index={i}>
            <IssueCover issue={issue} beat={beats[i]} veil={veil} />
            <IssueSpread issue={issue} />
          </div>
        ))}
      </div>

      <ChapterTabs active={active} onPick={goTo} />
    </div>
  );
}
