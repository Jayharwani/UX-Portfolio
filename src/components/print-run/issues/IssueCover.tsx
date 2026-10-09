import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { MOCKUPS } from "../../../data/mockups";
import type { Issue } from "../../../data/issues";
import { playMockup } from "./playMockup";
import { turnTo } from "./turnTo";
import friction from "../../../assets/emblems/friction.svg?raw";
import headroom from "../../../assets/emblems/headroom.svg?raw";
import signal from "../../../assets/emblems/signal.svg?raw";
import bumper from "../../../assets/emblems/bumper.svg?raw";

/* --------------------------------------------------------------------------
   ONE COVER.

   THE ART WINDOW SCALES ITS MOCKUP, IT DOES NOT RESIZE IT. Every mockup is
   laid out at a fixed natural size (a 252px card, a 300px map, a 340px
   browser) and its animations are keyframes tuned to that layout. Letting it
   reflow into whatever width the cover happens to be would re-break those
   animations at every breakpoint. One transform scale keeps the internal
   layout exactly as it was authored and exactly as it was checked.

   THE MOCKUP REMOUNTS ON `beat`. Its animations are CSS keyframes tied to an
   `.on` class, so replaying one means re-creating its nodes. In React that is
   a key change. "They only play once" is what a stale key looks like, and
   this codebase has shipped that bug before.

   The emblem carries a registration offset: a copy of the mark in the accent,
   sitting a few pixels off, exactly as a plate that has not been pulled into
   register yet. On hover it snaps home.
   -------------------------------------------------------------------------- */

const EMBLEMS: Record<Issue["key"], string> = { friction, headroom, signal, bumper };

/** leave this much of the art window as margin around the mockup */
const INSET = 0.88;

export function IssueCover({
  issue,
  beat,
  veil,
}: {
  issue: Issue;
  /** bumped whenever this issue is activated, to replay the mockup */
  beat: number;
  veil: React.RefObject<HTMLDivElement>;
}) {
  const navigate = useNavigate();
  const card = useRef<HTMLElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const fit = useRef<HTMLDivElement>(null);
  const shot = useRef<HTMLDivElement>(null);

  /* Measure unscaled, then scale. Reading offsetWidth forces a reflow, so this
     runs on mount and on resize only, never per frame. */
  const refit = useCallback(() => {
    const box = art.current;
    const inner = fit.current;
    if (!box || !inner) return;
    inner.style.transform = "none";
    const nw = inner.offsetWidth;
    const nh = inner.offsetHeight;
    if (!nw || !nh) return;
    const k = Math.min(box.clientWidth / nw, box.clientHeight / nh) * INSET;
    inner.style.transform = `scale(${k.toFixed(4)})`;
  }, []);

  useLayoutEffect(() => {
    refit();
    const box = art.current;
    if (!box) return;
    const ro = new ResizeObserver(refit);
    ro.observe(box);
    return () => ro.disconnect();
  }, [refit, beat]);

  useEffect(() => playMockup(shot.current), [beat]);

  return (
    <article className="pr-cover-card" ref={card} data-accent={issue.accent}>
      <div className="pr-cover-head">
        <span className="mono">No. {issue.no}</span>
        <span className="mono">{issue.year}</span>
      </div>

      <h3 className="pr-issue-title">{issue.title}</h3>
      <p className="pr-hook">{issue.hook}</p>

      <div className="pr-art" ref={art} aria-hidden="true">
        <div className="pr-art-fit" ref={fit}>
          <div key={beat} ref={shot} className="shot on" dangerouslySetInnerHTML={{ __html: MOCKUPS[issue.key] }} />
        </div>
        <span className="pr-art-screen" aria-hidden="true" />
      </div>

      <div className="pr-cover-foot">
        <span
          className="pr-cover-emblem"
          aria-hidden="true"
          dangerouslySetInnerHTML={{ __html: EMBLEMS[issue.key] }}
        />
        <span className="mono pr-tag">{issue.tag}</span>
      </div>

      <span className="pr-stamp" aria-hidden="true">
        Shipped
      </span>

      <div className="pr-actions">
        <Link
          className="pr-btn pr-btn-primary"
          to={issue.href}
          onClick={(e) => void turnTo(e, issue.href, card.current, veil.current, navigate)}
        >
          Read the case study
        </Link>
        <a className="pr-btn pr-btn-ghost mono" href={issue.live.href} target="_blank" rel="noopener noreferrer">
          {issue.live.label}
          <span className="vh-word"> (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
