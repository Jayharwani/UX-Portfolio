import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Issue } from "../../data/issues";

/* --------------------------------------------------------------------------
   ONE CHAPTER.

   Split out of HomeResolve so the page root stays a page root. The rhythm
   between these lines is fixed in the stylesheet, not here: 16 under the
   number, 20 under the title, 12 under the result, 24 above the stack line
   and 24 above the buttons, so four chapters have one cadence rather than
   four near misses.

   THE ODD AND EVEN CHAPTERS MIRROR. That is a stylesheet decision too, via
   :nth-of-type, because it is composition and not content: nothing about
   Headroom makes it a right-hand page except that Friction was a left one.
   -------------------------------------------------------------------------- */

export function Chapter({ issue, on }: { issue: Issue; on: boolean }) {
  return (
    <article className="rs-chapter rs-stop rs-shell" data-on={on ? "" : undefined} data-accent={issue.accent}>
      <div className="rs-panel">
        <span className="mono rs-no">{issue.no}</span>
        <h2 className="rs-title">{issue.title}</h2>
        <p className="rs-result">{issue.hook}</p>
        <p className="rs-what">{issue.panels[1]}</p>
        <p className="mono rs-tag">{issue.tag}</p>
        <div className="rs-actions">
          <Link className="rs-btn rs-btn-solid" to={issue.href}>
            <span className="rs-btn-text">Case study</span>
            <ArrowRight className="rs-btn-arrow" aria-hidden="true" strokeWidth={2.2} />
          </Link>
          <a className="rs-btn rs-btn-ghost mono" href={issue.live.href} target="_blank" rel="noopener noreferrer">
            {/* the pulse is the word "live" meaning it */}
            <span className="rs-dot" aria-hidden="true" />
            <span className="rs-btn-text">Live</span>
            <ArrowUpRight className="rs-btn-arrow" aria-hidden="true" strokeWidth={2} />
            <span className="vh-word"> {issue.title}, opens in a new tab</span>
          </a>
        </div>
      </div>
    </article>
  );
}
