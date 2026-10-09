import { useEffect, useRef, useState, type RefObject } from "react";
import { ISSUES } from "../../../data/issues";
import { useReveal } from "../../v2/useReveal";
import { impact } from "./impact";
import { preload } from "./turnTo";
import { IssueCover } from "./IssueCover";
import { IssueSpread } from "./IssueSpread";

/* --------------------------------------------------------------------------
   THE STACKED RUN.

   Tablet, phone, coarse pointer, and anyone who asked for reduced motion.
   Same four covers, same copy, same links, no pin and no page turns.

   THIS IS NOT THE DEGRADED VERSION. A pinned run on a phone would mean four
   screens of scroll before the first project is readable, which is the
   opposite of what a recruiter on a phone needs. Stacking is the better
   layout here and the pin is the special case.

   Each cover reveals once on intersection, with the usual failsafe timer
   behind it, and takes its stamp the first time it is seen.
   -------------------------------------------------------------------------- */

function StackedIssue({ index, veil }: { index: number; veil: RefObject<HTMLDivElement> }) {
  const issue = ISSUES[index];
  const [host, revealed] = useReveal<HTMLDivElement>(0.18);
  const [beat, setBeat] = useState(0);
  const fired = useRef(false);

  useEffect(() => {
    if (!revealed || fired.current) return;
    fired.current = true;
    setBeat((b) => b + 1);
    void preload(issue.href);
    impact(host.current?.querySelector(".pr-stamp") ?? null, host.current?.querySelector(".pr-cover-card") ?? null);
  }, [revealed, issue.href, host]);

  return (
    <div
      className={`pr-issue${revealed ? " pr-in" : ""}`}
      id={`issue-${issue.key}`}
      data-index={index}
      data-active=""
      ref={host}
    >
      <IssueCover issue={issue} beat={beat} veil={veil} />
      <IssueSpread issue={issue} />
    </div>
  );
}

export function StackedRun({ veil }: { veil: RefObject<HTMLDivElement> }) {
  return (
    <div className="pr-stacked">
      {ISSUES.map((issue, i) => (
        <StackedIssue key={issue.key} index={i} veil={veil} />
      ))}
    </div>
  );
}
