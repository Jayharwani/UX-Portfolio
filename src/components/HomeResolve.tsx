import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { SmoothScroll } from "./print-run/SmoothScroll";
import { ResolveField } from "./resolve/ResolveField";
import { Chapter } from "./resolve/Chapter";
import { Reach } from "./resolve/Reach";
import { Rail } from "./resolve/Rail";
import { magnetic } from "../lib/magnetic";
import { installSprings } from "../lib/spring";
import { heroScroll } from "./resolve/heroScroll";
import { chapters, intro } from "./resolve/choreography";
import { ISSUES } from "../data/issues";
import { TOKENS } from "../styles/tokens";
import type { Zone } from "./resolve/ResolveField";
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
  const hero = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    document.title = "Jay Harwani, product designer who writes the front end";
  }, []);

  /* ONE ACCENT OWNER, AND IT IS A REGISTERED PROPERTY SO IT CROSSFADES.
     Every surface that carries the key reads --chapter-accent: the chapter
     number, the buttons, the focus ring, the selection, the glow behind the
     object and the object itself. Writing it here is the only place the key
     changes, so the canvas and the interface cannot be in two colours at
     once the way they were when each chapter coloured itself.

     The hero and the contact section have no project to be in, so they take
     the neutral ink and the glow drops with them. */
  const onActive = useCallback((i: number, zone: Zone) => {
    setActive(i);
    const el = page.current;
    if (!el) return;
    el.dataset.zone = zone;
    /* the chapters alternate sides and the background light goes with them */
    el.dataset.side = zone === "work" && i % 2 === 1 ? "left" : "right";
    el.style.setProperty("--chapter-accent", zone === "work" ? TOKENS[ISSUES[i].accent] : TOKENS.paper);
  }, []);

  /* What the page root owns because it spans the page: the spring curves
     every transition reads, the pointer magnet on every button, the hero's
     own scroll behaviour, and the order the chapters arrive in.

     THE SPRINGS GO IN FIRST AND SYNCHRONOUSLY. Everything after this reads
     them back off the element, so they have to exist before anything is
     built against them. */
  useLayoutEffect(() => {
    const el = page.current;
    const h = hero.current;
    const t = track.current;
    if (!el || !h || !t) return;
    /* on the document root as well as the page: the view transition's own
       pseudo-elements are children of the root and cannot see a variable
       declared further down */
    installSprings(el);
    installSprings(document.documentElement);
    const off = [magnetic(el), heroScroll(h), intro(h), chapters(el, t)];
    return () => off.forEach((f) => f());
  }, []);

  return (
    <SmoothScroll>
      <div className="v2 rs" ref={page}>
        <ResolveField track={track} onActive={onActive} />
        <div className="rs-grain" aria-hidden="true" />

        <a className="rs-skip" href="#work">
          Skip to the work
        </a>

        <Rail active={active} />

        <main>
          <section className="rs-hero rs-shell" id="top" ref={hero}>
            <div className="rs-hero-copy">
              <p className="mono rs-eyebrow">Product designer who writes the front end</p>
              <h1 className="rs-display">
                {/* each line rides up out of its own clip, which is why the
                    wrapper exists: a mask per line, not one for the pair */}
                <span className="rs-line">
                  <span>Designs it.</span>
                </span>
                {/* THE SENTENCE FINISHES AS THE WORK ARRIVES. The outline is the
                    half that is not built yet, so it inks in from the left across
                    the first stretch of scroll and is solid by the time the first
                    project is on screen. The filled copy is a duplicate stacked on
                    the original and hidden from the reader, because the sentence
                    must exist exactly once in the document. */}
                <span className="rs-line">
                  <span className="rs-outline">
                    Then ships it.
                    <span className="rs-ink" aria-hidden="true">
                      Then ships it.
                    </span>
                  </span>
                </span>
              </h1>
              <p className="rs-byline">
                Four products, all live. Each one takes something messy and gives back one clear thing.
              </p>
            </div>
            <p className="mono rs-cue" aria-hidden="true">
              Scroll
              <span className="rs-cue-line" />
            </p>
          </section>

          {/* The scroll span that drives every deformation. Each chapter is a
              screen tall, so one screen of scroll is one morph. */}
          <section className="rs-track" id="work" ref={track}>
            {ISSUES.map((issue, i) => (
              <Chapter key={issue.key} issue={issue} on={active === i} />
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
