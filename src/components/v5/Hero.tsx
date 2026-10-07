import { hero, site } from "../../content/home";

/* --------------------------------------------------------------------------
   THE HERO — the thesis, acted out rather than stated.

   "Designs it." is the spec: an outline, drawn and not yet filled. "Then
   ships it." is the thing shipped: solid ink. Phase 3 fills the second line
   from the left once per session; this is the state it rests in, and the state
   a reader with reduced motion only ever sees.

   NOTHING HERE STARTS AT OPACITY 0. The H1 is the largest paint on the page,
   so anything that faded it in would be deferring the LCP by exactly the
   length of its own animation (§6.2).

   THE SPACE BETWEEN THE SPANS IS LOAD BEARING. The accessible name has to read
   "Designs it. Then ships it." as one sentence, and JSX drops whitespace that
   spans a newline, so it is written as an explicit {" "}. Without it a screen
   reader says "Designs it.Then ships it."
   -------------------------------------------------------------------------- */

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <h1 className="hero-title" id="hero-title">
        <span className="hero-line hero-line--design">
          <span className="hero-ink">{hero.line1}</span>
        </span>{" "}
        <span className="hero-line hero-line--ship">
          <span className="hero-ink">{hero.line2}</span>
        </span>
      </h1>

      <p className="hero-sub">{hero.subline}</p>

      <div className="hero-actions">
        <a className="btn btn--primary" href={hero.primary.href}>
          {hero.primary.label}
        </a>
        <a className="btn btn--secondary" href={`mailto:${site.email}`}>
          {hero.secondary.label}
        </a>
      </div>

      <p className="status">
        <span className="status-open">
          <i className="dot" aria-hidden="true" />
          {site.status}
        </span>
        <span className="status-where">{site.location}</span>
      </p>
    </section>
  );
}
