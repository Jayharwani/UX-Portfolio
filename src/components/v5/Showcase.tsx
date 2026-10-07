import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { flagship, type FlagshipProject } from "../../content/home";
import { useLiveCount } from "../../hooks/useLiveCount";
import { prefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { LiveFrame } from "./LiveFrame";
import { Marker } from "./Marker";
import { Preview } from "./previews";
import { Segmented, type FrameState } from "./Segmented";
import "../../styles/showcase.css";

/* --------------------------------------------------------------------------
   SELECTED WORK — four products, each as a spec and then as itself.

   Phase 4 builds both states and the controls that move between them. The
   scroll choreography that drives them on a wide screen is Phase 5, so every
   frame here rests in whichever state its own toggle says, at every width.

   The frame link duplicates the case study button for anyone who clicks the
   picture. It is aria-hidden with tabindex -1, because a screen reader
   meeting the same destination twice in a row learns nothing the second time,
   and it is still a real <a>, so middle click and open-in-new-tab work.
   -------------------------------------------------------------------------- */

function figureFor(p: FlagshipProject, live: number | null): string {
  const n = live ?? p.figure?.value;
  if (n === undefined) return "";
  return n.toLocaleString("en-US");
}

function Project({ project, index }: { project: FlagshipProject; index: number }) {
  const article = useRef<HTMLElement>(null);
  const [near, setNear] = useState(index === 0);
  /* §6.3.5: motion allowed starts in spec and ships once when it is seen;
     reduced motion starts shipped and never moves on its own */
  const [state, setState] = useState<FrameState>(() =>
    prefersReducedMotion() ? "shipped" : "spec"
  );
  const shipped = useRef(prefersReducedMotion());

  const live = useLiveCount(project.liveDataUrl, near);

  /* The first frame mounts immediately because it peeks above the fold; the
     rest wait until they are within a viewport. The same observer ships a
     frame once, the first time half of it is on screen. */
  useEffect(() => {
    const el = article.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setNear(true);
          if (e.intersectionRatio >= 0.5 && !shipped.current) {
            shipped.current = true;
            setState("shipped");
          }
        }
      },
      { rootMargin: "100% 0px", threshold: [0, 0.5] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const asOf = live === null && project.figure?.asOf ? ` as of ${project.figure.asOf}` : "";
  const fig = figureFor(project, live);

  return (
    <article
      className="project"
      data-index={index}
      aria-labelledby={`p-${project.slug}`}
      ref={article}
      style={{ ["--accent" as string]: project.accent }}
    >
      <div className="project-copy">
        <h3 id={`p-${project.slug}`}>{project.name}</h3>
        <p className="project-problem">{project.problem}</p>

        <dl className="project-meta">
          <dt className="visually-hidden">Role</dt>
          <dd>{project.role}</dd>
          <dt className="visually-hidden">Stack</dt>
          <dd>{project.stack}</dd>
          <dt className="visually-hidden">Year</dt>
          <dd className="tnum">{project.year}</dd>
        </dl>

        <p className="project-outcome">
          <Marker>{project.outcome}</Marker>
          {asOf}
        </p>

        <p className="project-actions">
          <Link className="btn btn--primary" to={project.caseStudyHref}>
            Read case study
          </Link>
          <a
            className="link-ext"
            href={project.liveHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {project.liveLabel}
            <svg viewBox="0 0 12 12" aria-hidden="true" focusable="false">
              <path d="M3.5 8.5 8.5 3.5M4.5 3.5h4v4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </p>
      </div>

      <div className="project-frame">
        <a
          className="frame-link"
          data-index={index}
          data-state={state}
          href={project.caseStudyHref}
          tabIndex={-1}
          aria-hidden="true"
        >
          <LiveFrame project={project}>
            {(wire) => <Preview slug={project.slug} wire={wire} figure={fig} />}
          </LiveFrame>
        </a>

        <div className="project-switch">
          <Segmented value={state} onChange={setState} label={`${project.name} preview`} />
          <p className="project-note mono-spec">
            <Marker>{project.specNote}</Marker>
          </p>
        </div>
      </div>
    </article>
  );
}

export function Showcase() {
  return (
    <section
      id="work"
      className="showcase"
      aria-labelledby="work-title"
      style={{ ["--n" as string]: flagship.length }}
    >
      <a className="skip-inline" href="#more-work">
        Skip past selected work
      </a>

      <div className="stage">
        <h2 id="work-title" className="stage-label">
          Selected work
        </h2>

        <div className="stage-copy">
          {flagship.map((p, i) => (
            <Project key={p.slug} project={p} index={i} />
          ))}
        </div>

        <nav className="progress" aria-label="Selected work progress">
          {flagship.map((p, i) => (
            <button key={p.slug} type="button" data-index={i}>
              {p.name}
              <i className="track" aria-hidden="true">
                <i className="fill" />
              </i>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
