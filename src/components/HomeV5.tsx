import { useEffect } from "react";
import { Link } from "react-router";
import { about, contact, flagship, footer, head, hero, moreWork, site } from "../content/home";
import { NOW_STALE_DAYS, now } from "../content/now";
import { Marker } from "./v5/Marker";

/* --------------------------------------------------------------------------
   THE HOMEPAGE, PHASE 1.

   A content skeleton, not a design. Every section the page will have is here
   as semantic markup on the v5 tokens, and nothing more: the header, the hero,
   the Spec to Ship showcase, the index, the route arc and the contact block
   are Phases 2 to 6, and each one replaces the stand-in below.

   What this phase is actually proving: the tokens load, the type is
   self-hosted, the content model renders, and the gaps in it are visible on
   the page. A skeleton that renders real content is a better foundation than a
   finished section built before the system under it is settled.

   What left with it: the canvas field and its render loop, the side rail, the
   letterbox title sequence, and the 16-layer extruded hero whose 21 SVG copies
   were the whole of the H1's accessible name.
   -------------------------------------------------------------------------- */

const DAY = 86_400_000;

/** §6.6: the section hides when its newest entry has gone stale */
const nowIsFresh =
  site.nowEnabled &&
  now.length > 0 &&
  Date.now() - new Date(now[0].date).getTime() < NOW_STALE_DAYS * DAY;

export function HomeV5() {
  useEffect(() => {
    document.title = head.title;
  }, []);

  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <main id="content" className="shell">
        {/* ── hero ─────────────────────────────────────────── Phase 2 and 3 */}
        <section aria-labelledby="hero-title">
          <h1 id="hero-title">
            <span>{hero.line1}</span> <span>{hero.line2}</span>
          </h1>
          <p>{hero.subline}</p>
          <p>
            <a href={hero.primary.href}>{hero.primary.label}</a>{" "}
            <a href={`mailto:${site.email}`}>{hero.secondary.label}</a>
          </p>
          <p>
            <span>{site.status}</span> <span>{site.location}</span>
          </p>
        </section>

        {/* ── selected work ───────────────────────────────────── Phase 4 and 5 */}
        <section id="work" aria-labelledby="work-title">
          <h2 id="work-title">Selected work</h2>
          {flagship.map((p) => (
            <article key={p.slug} aria-labelledby={`p-${p.slug}`}>
              <h3 id={`p-${p.slug}`}>{p.name}</h3>
              <p>{p.problem}</p>
              <dl>
                <dt className="visually-hidden">Role</dt>
                <dd>{p.role}</dd>
                <dt className="visually-hidden">Stack</dt>
                <dd>{p.stack}</dd>
                <dt className="visually-hidden">Year</dt>
                <dd className="tnum">{p.year}</dd>
              </dl>
              <p>
                <Marker>{p.outcome}</Marker>
              </p>
              <p className="mono-spec">
                <Marker>{p.specNote}</Marker>
              </p>
              <p>
                <Link to={p.caseStudyHref}>Read case study</Link>{" "}
                <a href={p.liveHref} target="_blank" rel="noopener noreferrer">
                  {p.liveLabel}
                  <span className="visually-hidden"> (opens in a new tab)</span>
                </a>
              </p>
            </article>
          ))}
        </section>

        {/* ── more work ───────────────────────────────────────────── Phase 6 */}
        <section id="more-work" aria-labelledby="more-title">
          <h2 id="more-title">More work</h2>
          <ul>
            {moreWork.map((item) => (
              <li key={item.name}>
                <b>{item.name}</b>{" "}
                <span>
                  <Marker>{item.description}</Marker>
                </span>{" "}
                <span>
                  <Marker>{item.kind}</Marker>
                </span>{" "}
                <span className="tnum">
                  <Marker>{String(item.year)}</Marker>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ── about ───────────────────────────────────────────────── Phase 6 */}
        <section id="about" aria-labelledby="about-title">
          <h2 id="about-title">{about.heading}</h2>
          <p className="tnum">
            {about.route.from} to {about.route.to}, {about.route.km.toLocaleString("en-US")} km
          </p>
          {about.paragraphs.map((text, i) => (
            <p key={i}>
              <Marker>{text}</Marker>
            </p>
          ))}
          <dl>
            {about.facts.map((f) => (
              <div key={f.term}>
                <dt>{f.term}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── now ─────────────────────────────────────────────────── Phase 6 */}
        {nowIsFresh ? (
          <section id="now" aria-labelledby="now-title">
            <h2 id="now-title">Now</h2>
            <ul>
              {now.map((e) => (
                <li key={e.date}>
                  <span className="tnum">{e.date}</span> <span>{e.text}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* ── contact ─────────────────────────────────────────────── Phase 6 */}
        <section id="contact" aria-labelledby="contact-title">
          <h2 id="contact-title">{contact.heading}</h2>
          <p>
            <Marker>{contact.reply}</Marker>
          </p>
          <p>
            <a href={`mailto:${site.email}`}>{site.email}</a>
          </p>
          <p>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
              <span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </p>
          <p>
            <Marker>{site.resumeNote}</Marker>
          </p>
        </section>
      </main>

      <footer className="shell">
        <p>{footer.owner}</p>
      </footer>
    </>
  );
}

export default HomeV5;
