import { Link } from "react-router";
import { PROJECTS } from "./shelf";

/* --------------------------------------------------------------------------
   THE FLAT LAYER.

   Everything a reader has to be able to read, select, tab to or paste sits
   here in HTML, not in the scene. A canvas is a picture to a screen reader
   and to a search engine, so the four projects exist as four real links
   whether or not WebGL does.

   The header carries two ways to reach a person and nothing else. Work, About
   and Contact came off: the work is the four books and the index below them,
   so a link called Work pointed at what was already on screen, and Contact
   was a mailto wearing a different word.
   -------------------------------------------------------------------------- */

const EMAIL = "harwanijay9498@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/jay-harwani";

export function OverlayHUD({
  hovered,
  busy,
  onBack,
}: {
  hovered: string | null;
  busy: boolean;
  onBack: () => void;
}) {
  return (
    <>
      <a className="shelf-skip" href="#index">
        Skip to the work
      </a>

      <header className="shelf-hdr">
        <Link className="shelf-brand" to="/">
          Jay Harwani
        </Link>
        <nav className="shelf-links" aria-label="Contact">
          <a href={`mailto:${EMAIL}`}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5v-9Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path d="m4 7.8 8 5.2 8-5.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            Email
          </a>
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M4.5 9h2.8v10H4.5zM5.9 4.6a1.7 1.7 0 1 1 0 3.4 1.7 1.7 0 0 1 0-3.4ZM10 9h2.7v1.4A3 3 0 0 1 15.4 9c2.2 0 3.6 1.4 3.6 4V19h-2.8v-5.2c0-1.4-.6-2.2-1.8-2.2s-1.9.8-1.9 2.2V19H10Z"
                fill="currentColor"
              />
            </svg>
            LinkedIn
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </nav>
      </header>

      <button className="shelf-back" data-on={busy ? "" : undefined} type="button" onClick={onBack}>
        Back to the shelf
      </button>

      <p className="shelf-hint" data-off={busy || hovered ? "" : undefined} aria-hidden="true">
        Four projects. Pick one off the shelf.
      </p>

      {/* The real index. Visually quiet under the room, but it is what a
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
