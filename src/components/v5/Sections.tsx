import { useEffect, useState } from "react";
import { about, footer, moreWork, site, type IndexItem } from "../../content/home";
import { now, nowIsFresh } from "../../content/now";
import { subscribe } from "../../lib/announce";
import { Marker } from "./Marker";
import { RouteArc } from "./RouteArc";

/* --------------------------------------------------------------------------
   MORE WORK, ABOUT, NOW, FOOTER, and the page's one live region.
   HOMEPAGE_REDESIGN.md §6.4 to §6.7, §10.3.
   -------------------------------------------------------------------------- */

/** §10.3: exactly one on the page, fed by lib/announce */
export function LiveRegion() {
  const [message, setMessage] = useState("");
  useEffect(() => subscribe(setMessage), []);
  return (
    <p className="visually-hidden" role="status" aria-live="polite">
      {message}
    </p>
  );
}

function Row({ item }: { item: IndexItem }) {
  const body = (
    <>
      <span className="row-name">{item.name}</span>
      <span className="row-desc">
        <Marker>{item.description}</Marker>
        {item.note ? <span className="row-note"> {item.note}</span> : null}
      </span>
      <span className="row-kind">
        <Marker>{item.kind}</Marker>
      </span>
      <span className="row-year tnum">
        <Marker>{String(item.year)}</Marker>
      </span>
    </>
  );

  /* The whole row is the link, or none of it is. A row with a link inside a
     row that is also a link is the thing §6.4 avoids by making the row itself
     the anchor. */
  return item.href ? (
    <a className="row" href={item.href}>
      {body}
    </a>
  ) : (
    <div className="row">{body}</div>
  );
}

export function MoreWork() {
  return (
    <section id="more-work" className="more" aria-labelledby="more-title">
      <h2 id="more-title">More work</h2>
      <div className="more-rows">
        {moreWork.map((item) => (
          <Row key={item.name} item={item} />
        ))}
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" className="about" aria-labelledby="about-title">
      <div className="about-text">
        <h2 id="about-title">{about.heading}</h2>
        <RouteArc />
        {about.paragraphs.map((text, i) => (
          <p className="about-p" key={i}>
            <Marker>{text}</Marker>
          </p>
        ))}
        <dl className="facts">
          {about.facts.map((f) => (
            <div key={f.term}>
              <dt>{f.term}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

const rel = (iso: string) => {
  const days = Math.round((Date.now() - new Date(iso).getTime()) / 86_400_000);
  const f = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (days < 30) return f.format(-days, "day");
  return f.format(-Math.round(days / 30), "month");
};

export function Now() {
  /* §6.6: no empty state and no "coming soon". Stale content costs more than
     no content, so the section does not render rather than apologise. */
  if (!site.nowEnabled || !nowIsFresh(now)) return null;

  return (
    <section id="now" className="now" aria-labelledby="now-title">
      <div className="now-head">
        <h2 id="now-title">Now</h2>
        <p className="now-updated">Updated {rel(now[0].date)}</p>
      </div>
      <ul className="now-list">
        {now.map((e) => (
          <li key={e.date + e.text}>
            <span className="now-date tnum">{e.date}</span>
            <span className="now-text">
              {e.text}
              {e.href ? (
                <>
                  {" "}
                  <a className="link-ext" href={e.href} target="_blank" rel="noopener noreferrer">
                    {e.linkLabel ?? "Read it"}
                    <span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </>
              ) : null}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="foot shell">
      <p>{footer.owner}</p>
      {/* frozen at build time by vite.config.ts: a date computed in the
          browser would read "today" forever and mean nothing */}
      <p className="foot-updated">Last updated {__BUILD_MONTH__}</p>
    </footer>
  );
}
