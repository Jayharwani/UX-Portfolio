import { ISSUES } from "../../../data/issues";

/* --------------------------------------------------------------------------
   CHAPTER TABS.

   Nobody should be able to feel trapped in a pinned section. Four tabs say
   how long the run is, which part of it you are in, and let you jump. Between
   these and the skip link above the run, there is always a way out that is
   not "keep scrolling and hope".

   Real buttons, not decoration: they are reachable by keyboard and they carry
   aria-current so the active one is announced rather than only coloured.
   -------------------------------------------------------------------------- */

export function ChapterTabs({ active, onPick }: { active: number; onPick: (i: number) => void }) {
  return (
    <div className="pr-tabs" role="group" aria-label="Issues">
      {ISSUES.map((issue, i) => (
        <button
          key={issue.key}
          type="button"
          className="pr-tab mono"
          data-accent={issue.accent}
          data-on={i === active ? "" : undefined}
          aria-current={i === active ? "true" : undefined}
          onClick={() => onPick(i)}
        >
          {issue.no}
          <span className="vh-word"> {issue.title}</span>
        </button>
      ))}
    </div>
  );
}
