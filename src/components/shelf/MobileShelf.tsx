import { Link } from "react-router";
import type { Project } from "./shelf";

/* --------------------------------------------------------------------------
   THE PHONE.

   A 1.6cm-wide spine rendered 40cm from a face is a gesture at a book, not a
   book, and raycasting a WebGL scene through a thumb is a worse way to pick
   one than a swipe. So below 860px the shelf becomes what it would be if you
   carried it: four books standing up, one at a time, dragged past.

   Native scroll-snap does the whole thing. No library, no gesture handler,
   and momentum, overscroll and accessibility all behave because nothing here
   has taken them over.
   -------------------------------------------------------------------------- */

export function MobileShelf({ projects }: { projects: Project[] }) {
  return (
    <ol className="mshelf" aria-label="Selected work">
      {projects.map((p, i) => (
        <li key={p.slug} className="mshelf-item">
          <Link className="mbook" to={p.href} style={{ ["--cloth" as string]: p.cloth, ["--foil" as string]: p.foil }}>
            <span className="mbook-spine">
              <span className="mbook-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="mbook-title">{p.title}</span>
            </span>
            <span className="mbook-face">
              <span className="mbook-face-title">{p.title}</span>
              <span className="mbook-face-sub">{p.subtitle}</span>
              <span className="mbook-face-year">{p.year}</span>
            </span>
          </Link>
          <a className="mbook-live" href={p.live.href} target="_blank" rel="noopener noreferrer">
            {p.live.label}
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ol>
  );
}
