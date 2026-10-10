import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { Issue } from "../../data/issues";

/** which project was opened last, so coming back plays the move in reverse */
const CAME_FROM = "rs-came-from";

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
  const title = useRef<HTMLHeadingElement>(null);

  /* THE NAME HAS TO BE UNIQUE IN THE DOCUMENT, so only one title ever wears
     it: the one being opened, or on the way back, the one that was. Naming
     all four would make the transition ambiguous and the browser would
     silently drop it. */
  useEffect(() => {
    if (sessionStorage.getItem(CAME_FROM) !== issue.key) return;
    sessionStorage.removeItem(CAME_FROM);
    const el = title.current;
    if (!el) return;
    el.style.viewTransitionName = "project-title";
    const done = () => el.style.removeProperty("view-transition-name");
    const t = window.setTimeout(done, 1200);
    return () => {
      window.clearTimeout(t);
      done();
    };
  }, [issue.key]);

  return (
    <article className="rs-chapter rs-stop rs-shell" data-on={on ? "" : undefined} data-accent={issue.accent}>
      <div className="rs-panel">
        <span className="mono rs-no">{issue.no}</span>
        <h2 className="rs-title" ref={title}>
          {issue.title}
        </h2>
        <p className="rs-result">{issue.hook}</p>
        <p className="rs-what">{issue.panels[1]}</p>
        <p className="mono rs-tag">{issue.tag}</p>
        <div className="rs-actions">
          <Link
            className="rs-btn rs-btn-solid"
            to={issue.href}
            viewTransition
            onClick={() => {
              sessionStorage.setItem(CAME_FROM, issue.key);
              if (title.current) title.current.style.viewTransitionName = "project-title";
            }}
          >
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
