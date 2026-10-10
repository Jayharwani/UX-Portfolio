import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { SmoothScroll } from "./print-run/SmoothScroll";
import { ResolveField } from "./resolve/ResolveField";
import { Reach } from "./resolve/Reach";
import { ISSUES } from "../data/issues";
import { TOKENS } from "../styles/tokens";
import "../styles/v2.css";
import "../styles/v2-ported.css";
import "../styles/resolve.css";

/* --------------------------------------------------------------------------
   RESOLVE — the homepage.

   Every one of these four products does the same thing: it takes a mess and
   returns one clear thing. So the page is one lattice that is never created
   and never destroyed, only deformed, and each deformation is a product's
   actual mechanic. The thing you are reading about is the thing you are
   looking at.

   THE 3D IS NOT DECORATION AND IT IS NOT SEPARATE FROM THE CONTENT. Four
   previous attempts put a beautiful object in the hero and the work
   underneath it, and the object could have belonged to anybody. Here the
   object cannot: it is the twenty-five problems Friction publishes, the gap
   Headroom subtracts, the map Signal draws, the pause Bumper adds.

   THE COPY IS REAL DOM AND IT IS THE PROMISE. The canvas is aria-hidden and
   carries nothing a reader needs. Everything the field says, the panel beside
   it says in words, with the result first, because a hiring manager's first
   pass is a few seconds long and the outcome is what has to survive it.
   -------------------------------------------------------------------------- */

export function HomeResolve() {
  const page = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    document.title = "Jay Harwani, product designer who writes the front end";
  }, []);

  /* One accent owner. The field and the page read the same token, so they
     cannot disagree about which project is being looked at. */
  const onActive = useCallback((i: number) => {
    setActive(i);
    page.current?.style.setProperty("--accent", TOKENS[ISSUES[i].accent]);
  }, []);

  /* The opening is the lattice settling, so it is finished when the springs
     are. Nothing is gated on a timer. */
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 120);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <SmoothScroll>
      <div className="v2 rs" ref={page} data-ready={ready ? "" : undefined}>
        <ResolveField track={track} onActive={onActive} />
        <div className="rs-grain" aria-hidden="true" />

        <a className="rs-skip" href="#work">
          Skip to the work
        </a>

        <main>
          <section className="rs-hero" id="top">
            <p className="mono rs-eyebrow">Product designer who writes the front end</p>
            <h1 className="rs-display">
              <span>Designs it.</span>
              <span className="rs-outline">Then ships it.</span>
            </h1>
            <p className="rs-byline">
              Four products, all live. Each one takes something messy and gives back one clear thing.
            </p>
            <p className="mono rs-cue" aria-hidden="true">
              Scroll
            </p>
          </section>

          {/* The scroll span that drives every deformation. Each chapter is a
              screen tall, so one screen of scroll is one morph. */}
          <section className="rs-track" id="work" ref={track}>
            {ISSUES.map((issue, i) => (
              <article className="rs-chapter rs-stop" key={issue.key} data-on={active === i ? "" : undefined} data-accent={issue.accent}>
                <div className="rs-panel">
                  <span className="mono rs-no">{issue.no}</span>
                  <h2 className="rs-title">{issue.title}</h2>
                  <p className="rs-result">{issue.hook}</p>
                  <p className="rs-what">{issue.panels[1]}</p>
                  <p className="mono rs-tag">{issue.tag}</p>
                  <div className="rs-actions">
                    <Link className="rs-btn rs-btn-solid" to={issue.href}>
                      Case study
                    </Link>
                    <a className="rs-btn rs-btn-ghost mono" href={issue.live.href} target="_blank" rel="noopener noreferrer">
                      Live
                      <span className="vh-word"> {issue.title}, opens in a new tab</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </section>
        </main>

        <footer className="rs-foot">
          <Reach />
        </footer>
      </div>
    </SmoothScroll>
  );
}

export default HomeResolve;
