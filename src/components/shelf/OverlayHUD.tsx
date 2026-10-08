import { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router";
import { PROJECTS } from "./shelf";

/* --------------------------------------------------------------------------
   THE FLAT LAYER.

   Everything a reader has to be able to read, select, tab to or paste sits
   here in HTML, not in the scene. A canvas is a picture to a screen reader
   and to a search engine, so the four projects exist as four real links
   whether or not WebGL does.

   THE LIST IS THE KEYBOARD'S VERSION OF THE SHELF. Focusing an item pulls its
   book out of the run, and the list itself becomes visible while focus is
   inside it -- a focus ring on an element positioned a screen below the fold
   satisfies no one, least of all WCAG 2.4.7. Escape puts the book back.

   The card is aria-hidden on purpose. A pointer user sees it; a keyboard or
   screen reader user gets the same sentence from the list item they are
   standing on, and hearing it twice is worse than hearing it once.
   -------------------------------------------------------------------------- */

const EMAIL = "harwanijay9498@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/jay-harwani";

export function OverlayHUD({
  hovered,
  busy,
  onFocusBook,
}: {
  hovered: string | null;
  busy: boolean;
  onFocusBook: (slug: string | null) => void;
}) {
  const navigate = useNavigate();
  const exit = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);

  /* The card sits beside the hovered book, on whichever side has more room,
     16px clear of it and never past a 16px viewport margin. The scene works
     out where the book is and says so once per hover; this does the choosing.
     Neither of them runs per frame, which is the point: a card that follows a
     book every frame is a layout recalculation sixty times a second for an
     element that moves twice. */
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const place = (e: Event) => {
      const d = (e as CustomEvent<{ left: number; right: number; y: number; w: number; h: number } | null>).detail;
      if (!d) return;
      const box = el.getBoundingClientRect();
      const GAP = 16;
      const roomRight = d.w - d.right - GAP * 2;
      const roomLeft = d.left - GAP * 2;
      const x =
        roomRight >= box.width || roomRight >= roomLeft
          ? Math.min(d.right + GAP, d.w - box.width - GAP)
          : Math.max(GAP, d.left - GAP - box.width);
      const y = Math.min(Math.max(GAP, d.y - box.height / 2), d.h - box.height - GAP);
      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
    };
    window.addEventListener("shelf:card", place);
    return () => window.removeEventListener("shelf:card", place);
  }, []);

  /* The fade to the case study's own background, driven by the scene so the
     two stay in step. A single hard-coded colour would have been wrong for
     Headroom, whose page is nearly white while the other three are nearly
     black. */
  useEffect(() => {
    const el = exit.current;
    if (!el) return;
    const onOpen = (e: Event) => {
      const colour = (e as CustomEvent<{ exit?: string }>).detail?.exit;
      if (!colour) return;
      el.style.background = colour;
      el.style.transition = "opacity 350ms linear";
      /* a frame's delay, or the browser batches the two styles and there is
         nothing to transition from */
      requestAnimationFrame(() => {
        el.style.opacity = "1";
      });
    };
    const onBack = () => {
      el.style.transition = "opacity 220ms linear";
      el.style.opacity = "0";
    };
    window.addEventListener("shelf:opening", onOpen);
    window.addEventListener("shelf:back", onBack);
    return () => {
      window.removeEventListener("shelf:opening", onOpen);
      window.removeEventListener("shelf:back", onBack);
    };
  }, []);

  const onKey = useCallback(
    (e: React.KeyboardEvent, href: string) => {
      if (e.key === "Escape") {
        (e.currentTarget as HTMLElement).blur();
        onFocusBook(null);
        return;
      }
      /* Enter is the list's own job; this only exists so the book's exit
         sequence plays rather than the route changing underneath it */
      if (e.key === "Enter" && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
        e.preventDefault();
        navigate(href);
      }
    },
    [navigate, onFocusBook]
  );

  const i = PROJECTS.findIndex((p) => p.slug === hovered);
  const shown = i >= 0 ? PROJECTS[i] : null;

  return (
    <>
      <a className="shelf-skip" href="#index">
        Skip to the work
      </a>

      <header className="shelf-hdr">
        <div>
          <Link className="shelf-brand" to="/">
            Jay Harwani
          </Link>
          <span className="shelf-role">Product designer who writes the front end</span>
        </div>
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

      {/* The card: the name, then one line. No number, no em dash, no button.
          The hint already says what to do, and a title that reads "01 — FRICTION"
          is a filename, not a name. */}
      <div className="shelf-card" ref={card} data-on={shown && !busy ? "" : undefined} aria-hidden="true">
        {shown ? (
          <>
            <p className="shelf-card-title">{shown.title}</p>
            <p className="shelf-card-line">{shown.blurb}</p>
          </>
        ) : null}
      </div>

      <p className="shelf-hint" data-off={busy || hovered ? "" : undefined} aria-hidden="true">
        Four projects. Pick one off the shelf.
      </p>

      <section className="shelf-index" id="index" aria-label="Selected work">
        <h2 className="visually-hidden">Selected work</h2>
        <ol>
          {PROJECTS.map((p, n) => (
            <li key={p.slug}>
              <Link
                to={p.href}
                onFocus={() => onFocusBook(p.slug)}
                onBlur={() => onFocusBook(null)}
                onKeyDown={(e) => onKey(e, p.href)}
              >
                <span className="shelf-index-n">{String(n + 1).padStart(2, "0")}</span>
                <span className="shelf-index-title">{p.title}</span>
                <span className="shelf-index-sub">{p.blurb}</span>
              </Link>
              <a className="shelf-index-live" href={p.live.href} target="_blank" rel="noopener noreferrer">
                {p.live.label}
                <span className="visually-hidden"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ol>
      </section>

      <div className="shelf-exit" ref={exit} aria-hidden="true" />
    </>
  );
}
