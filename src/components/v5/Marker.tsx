import { Fragment, type ReactNode } from "react";

/* --------------------------------------------------------------------------
   CONTENT GAPS, MADE VISIBLE.

   Any [FILL: ...] or [VERIFY: ...] still in src/content renders as a dashed
   blue chip instead of disappearing into the layout, so a gap is something you
   see on the page rather than something you find in a build log.

   scripts/check-content.mjs stops a production build while any marker remains,
   so this can never reach a deploy. It exists for the development pass between
   writing the content model and filling it in.
   -------------------------------------------------------------------------- */

/** [FILL: ...] or [VERIFY: ...], non-greedy so two in one string stay separate */
const MARKER = /\[(?:FILL|VERIFY)\b[^\]]*\]/g;

export function Marker({ children }: { children: string }): ReactNode {
  const parts = children.split(MARKER);
  const found = children.match(MARKER);
  if (!found) return children;

  return parts.map((text, i) => (
    <Fragment key={i}>
      {text}
      {found[i] ? <mark className="todo">{found[i]}</mark> : null}
    </Fragment>
  ));
}

/** true when a string still carries a gap, for callers that hide rather than mark */
export const hasMarker = (s: string) => /\[(?:FILL|VERIFY)\b/.test(s);
