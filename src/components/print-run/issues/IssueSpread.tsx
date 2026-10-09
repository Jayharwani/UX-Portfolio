import type { Issue } from "../../../data/issues";

/* --------------------------------------------------------------------------
   THE SPREAD.

   Three panels beside the cover: the problem, what was built, where it
   landed. Every sentence is quoted from the case study it opens, which is the
   only reason a cover is allowed to make a claim at all.

   Square corners and a 2px rule, because a comic panel is a ruled box and a
   rounded card is a SaaS feature grid. The difference is the whole direction.
   -------------------------------------------------------------------------- */

const LABELS = ["The problem", "What I built", "Where it landed"] as const;

export function IssueSpread({ issue }: { issue: Issue }) {
  return (
    <div className="pr-spread">
      {issue.panels.map((line, i) => (
        <div className="pr-panel" key={LABELS[i]}>
          <span className="mono pr-panel-label">{LABELS[i]}</span>
          <p>{line}</p>
        </div>
      ))}
    </div>
  );
}
