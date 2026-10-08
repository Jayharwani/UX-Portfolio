import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import type { FlagshipProject } from "../../content/home";
import { useLiveCount } from "../../hooks/useLiveCount";
import { prefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { LiveFrame } from "./LiveFrame";
import { Marker } from "./Marker";
import { Preview } from "./previews";
import { Segmented, type FrameState } from "./Segmented";

/* --------------------------------------------------------------------------
   ONE PROJECT, in whichever layout is running.

   EVERY copy block sits in a mask, not only the name and the problem. In the
   pinned layout one project leaves while the next arrives in the same grid
   cell, and anything that merely fades is legible on top of the thing
   replacing it: at the handoff, Friction's "Astro" sat struck through
   Headroom's "React PWA" and "Open Friction" overlapped "Open the app". A
   line clipped by its own box leaves; a line at 50% opacity is still there.

   In the pinned layout `data-state` is deliberately absent. The engine owns
   --draw and --reveal there, and an attribute setting them too would be a
   second source of truth for the same two numbers (§8.2).
   -------------------------------------------------------------------------- */

/** a block of copy that can be clipped out of its own box */
function Mask({ children }: { children: React.ReactNode }) {
  return (
    <div className="mask">
      <span>{children}</span>
    </div>
  );
}

export function Project({
  project,
  index,
  pinned,
  shipped,
}: {
  project: FlagshipProject;
  index: number;
  pinned: boolean;
  shipped: boolean;
}) {
  const root = useRef<HTMLElement>(null);
  const [near, setNear] = useState(index === 0);
  const reduce = prefersReducedMotion();
  const [state, setState] = useState<FrameState>(() => (reduce ? "shipped" : "spec"));
  const autoShipped = useRef(reduce);

  const live = useLiveCount(project.liveDataUrl, near);

  /* The first frame mounts at once because it peeks above the fold; the rest
     wait for a viewport. In the stacked layout the same observer ships a frame
     the first time half of it is on screen (§6.3.5). */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setNear(true);
          if (e.intersectionRatio >= 0.5 && !autoShipped.current) {
            autoShipped.current = true;
            setState("shipped");
          }
        }
      },
      { rootMargin: "100% 0px", threshold: [0, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const n = live ?? project.figure?.value;
  const figure = n === undefined ? "" : n.toLocaleString("en-US");
  const asOf = live === null && project.figure?.asOf ? ` as of ${project.figure.asOf}` : "";
  /* pinned: the engine's one-shot. stacked: the frame's own state. */
  const rolling = pinned ? shipped : state === "shipped";

  return (
    <article
      className="project"
      data-index={index}
      aria-labelledby={`p-${project.slug}`}
      ref={root}
      style={{ ["--accent" as string]: project.accent }}
    >
      <div className="project-copy">
        <Mask>
          <h3 id={`p-${project.slug}`}>{project.name}</h3>
        </Mask>

        <Mask>
          <p className="project-problem">{project.problem}</p>
        </Mask>

        <Mask>
          <dl className="project-meta">
            <dt className="visually-hidden">Role</dt>
            <dd>{project.role}</dd>
            <dt className="visually-hidden">Stack</dt>
            <dd>{project.stack}</dd>
            <dt className="visually-hidden">Year</dt>
            <dd className="tnum">{project.year}</dd>
          </dl>
        </Mask>

        <Mask>
          <p className="project-outcome">
            <Marker>{project.outcome}</Marker>
            {asOf}
          </p>
        </Mask>

        <Mask>
        <p className="project-actions">
          <Link className="btn btn--primary" to={project.caseStudyHref}>
            Read case study
          </Link>
          <a className="link-ext" href={project.liveHref} target="_blank" rel="noopener noreferrer">
            {project.liveLabel}
            <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <path
                d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </p>
        </Mask>
      </div>

      <div className="project-frame">
        <a
          className="frame-link"
          data-index={index}
          {...(pinned ? null : { "data-state": state })}
          href={project.caseStudyHref}
          tabIndex={-1}
          aria-hidden="true"
        >
          <LiveFrame project={project}>
            {(wire) => (
              <Preview
                slug={project.slug}
                wire={wire}
                figure={figure}
                value={n}
                prefix={project.figure?.prefix}
                roll={rolling}
                reduce={reduce}
              />
            )}
          </LiveFrame>
        </a>

        <div className="project-switch">
          {pinned ? null : (
            <Segmented value={state} onChange={setState} label={`${project.name} preview`} />
          )}
          <p className="project-note mono-spec">
            <Marker>{project.specNote}</Marker>
          </p>
        </div>
      </div>
    </article>
  );
}
