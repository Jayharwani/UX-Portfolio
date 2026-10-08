import { Link } from "react-router";
import { PROJECTS } from "./shelf";

/* --------------------------------------------------------------------------
   THE FLAT LAYER.

   Everything a reader has to be able to read, select, tab to or paste sits
   here in HTML, not in the scene. A canvas is a picture to a screen reader
   and to a search engine, so the four projects exist as four real links
   whether or not WebGL does.
   -------------------------------------------------------------------------- */

export function OverlayHUD({
  hovered,
  busy,
  onBack,
}: {
  hovered: string | null;
  busy: boolean;
  onBack: () => void;
}) {
  const i = PROJECTS.findIndex((p) => p.slug === hovered);
  const project = i >= 0 ? PROJECTS[i] : null;

  return (
    <>
      <a className="shelf-skip" href="#index">
        Skip to the work
      </a>

      <header className="shelf-hdr">
        <Link className="shelf-brand" to="/">
          Jay Harwani
        </Link>
        <nav aria-label="Primary">
          <a href="#index">Work</a>
          <a href="/about">About</a>
          <a href="mailto:harwanijay9498@gmail.com">Contact</a>
        </nav>
      </header>

      {/* the card the reference puts beside the shelf, driven by the hover */}
      <div className="shelf-card" data-on={project && !busy ? "" : undefined} aria-hidden="true">
        {project ? (
          <>
            <p className="shelf-card-n">
              {String(i + 1).padStart(2, "0")} <span>&mdash;</span> {project.title.toUpperCase()}
            </p>
            <p className="shelf-card-sub">{project.subtitle}</p>
          </>
        ) : null}
      </div>

      <button className="shelf-back" data-on={busy ? "" : undefined} type="button" onClick={onBack}>
        Back to shelf
      </button>

      <p className="shelf-hint" data-off={busy || hovered ? "" : undefined} aria-hidden="true">
        Four projects. Pick one off the shelf.
      </p>

      {/* The real index. Visually quiet under the shelf, but it is what a
          screen reader, a crawler and a keyboard actually use, and it is the
          whole site if WebGL never starts. */}
      <section className="shelf-index" id="index" aria-label="Selected work">
        <ol>
          {PROJECTS.map((p, n) => (
            <li key={p.slug}>
              <Link to={p.href}>
                <span className="shelf-index-n">{String(n + 1).padStart(2, "0")}</span>
                <span className="shelf-index-title">{p.title}</span>
                <span className="shelf-index-sub">{p.subtitle}</span>
              </Link>
              <a className="shelf-index-live" href={p.live.href} target="_blank" rel="noopener noreferrer">
                {p.live.label}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
