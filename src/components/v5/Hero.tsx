import { useEffect, useRef, useState } from "react";
import { hero, site } from "../../content/home";
import { prefersReducedMotion } from "../../hooks/usePrefersReducedMotion";
import { measure, paint, playIntro, resetGuides } from "../../lib/heroSpec";

/* --------------------------------------------------------------------------
   THE HERO — the thesis, acted out rather than stated.

   "Designs it." is the spec: an outline, drawn and not yet filled. "Then
   ships it." fills with ink from the left, once, over 760ms. The page does
   the thing it claims instead of claiming it.

   NOTHING STARTS AT OPACITY 0 except the spec layer. The H1 and the subline
   are the two largest paints on the page, and fading either in would defer
   the LCP by exactly the length of its own animation (§6.2).

   THE SPACE BETWEEN THE SPANS IS LOAD BEARING. The accessible name has to
   read "Designs it. Then ships it." as one sentence, and JSX drops whitespace
   that spans a newline, so it is an explicit {" "}.

   WHY .is-intro IS DECIDED IN A STATE INITIALISER and not an effect: the ink
   fill is a CSS animation, so the class has to be on the element in the very
   first render. Set it in an effect and line 2 paints solid, then turns back
   into an outline, then fills, which is a worse thing to watch than no intro.
   -------------------------------------------------------------------------- */

const SESSION_KEY = "v5-hero-intro";

/** §6.2: once per session, and storage being unavailable is not a reason to skip */
function firstVisitThisSession() {
  try {
    if (sessionStorage.getItem(SESSION_KEY)) return false;
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* private mode, blocked storage: run it */
  }
  return true;
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const layer = useRef<HTMLDivElement>(null);
  const ink1 = useRef<HTMLSpanElement>(null);
  const ink2 = useRef<HTMLSpanElement>(null);

  /* decided before first paint, so the class is in the first render */
  const [intro, setIntro] = useState(() => !prefersReducedMotion() && firstVisitThisSession());

  useEffect(() => {
    const hero = root.current;
    const lay = layer.current;
    const a = ink1.current;
    const b = ink2.current;
    if (!hero || !lay || !a || !b) return;

    let dead = false;
    let placed = false;
    let anims: Animation[] = [];
    let resize: number | undefined;

    const place = () => {
      if (dead) return;
      resetGuides(lay);
      paint(lay, measure(hero, a, b));
      placed = true;
    };

    const stop = () => {
      anims.forEach((x) => x.cancel());
      anims = [];
      hero.removeAttribute("data-spec");
      setIntro(false);
    };

    if (intro) {
      /* The fill is CSS and needs no font to be correct, but the guides are
         pure measurement and would be drawn against the fallback's metrics.
         So the race gates the LAYER, not the intro: §6.2 says never hold back
         text, and skipping the whole thing here would instead mean line 2
         snapping from outline to ink mid-flight. */
      const ready = document.fonts
        ? Promise.race([
            document.fonts.load('600 1em "Geist Display"'),
            new Promise((r) => setTimeout(r, 300)).then(() => null),
          ])
        : Promise.resolve(null);

      ready
        .then(async () => {
          if (dead) return;
          /* Anchor to when the hero painted, which is when the CSS fill began.
             `ready` matters: a CSS animation has no startTime until it has
             been committed, and reading it too early fell through to
             timeline.currentTime, which put every measured mark 48ms behind
             the fill it is supposed to ride. */
          const ink = b.closest(".hero-line")?.getAnimations()[0];
          if (ink) await ink.ready.catch(() => {});
          if (dead) return;
          place();
          hero.dataset.spec = "intro";
          const t0 = Number(ink?.startTime ?? document.timeline.currentTime);
          anims = playIntro(lay, measure(hero, a, b), t0);
        })
        .catch(() => {});

      /* §6.2: any input jumps to the final state within one frame */
      const events = ["keydown", "wheel", "touchstart", "pointerdown"] as const;
      events.forEach((e) => window.addEventListener(e, stop, { once: true, passive: true }));
      const done = window.setTimeout(stop, 1400);

      return () => {
        dead = true;
        window.clearTimeout(done);
        events.forEach((e) => window.removeEventListener(e, stop));
        anims.forEach((x) => x.cancel());
      };
    }

    /* After the intro, and on every later visit in the session, line 1 shows
       its spec on request. Fine pointers only: there is no hover on a touch
       screen, and a reader who asked for less motion is not asked again. */
    if (prefersReducedMotion() || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return () => {
        dead = true;
      };
    }

    const enter = () => {
      if (!placed) place();
      hero.dataset.spec = "hover";
    };
    const leave = () => hero.removeAttribute("data-spec");
    const onResize = () => {
      window.clearTimeout(resize);
      resize = window.setTimeout(() => placed && place(), 150);
    };

    a.addEventListener("pointerenter", enter);
    a.addEventListener("pointerleave", leave);
    window.addEventListener("resize", onResize);

    return () => {
      dead = true;
      window.clearTimeout(resize);
      a.removeEventListener("pointerenter", enter);
      a.removeEventListener("pointerleave", leave);
      window.removeEventListener("resize", onResize);
    };
  }, [intro]);

  return (
    <section
      className={`hero${intro ? " is-intro" : ""}`}
      id="top"
      ref={root}
      aria-labelledby="hero-title"
    >
      <h1 className="hero-title" id="hero-title">
        <span className="hero-line hero-line--design">
          <span className="hero-ink" ref={ink1}>
            {hero.line1}
          </span>
        </span>{" "}
        <span className="hero-line hero-line--ship">
          <span className="hero-ink" ref={ink2}>
            {hero.line2}
          </span>
        </span>
      </h1>

      <div className="spec-layer" ref={layer} aria-hidden="true">
        <i className="sl-guide sl-guide--cap" />
        <i className="sl-guide sl-guide--x" />
        <i className="sl-guide sl-guide--base" />
        <i className="sl-box">
          <i className="sl-h" />
          <i className="sl-h" />
          <i className="sl-h" />
          <i className="sl-h" />
        </i>
        <i className="sl-dim" />
        <span className="sl-chip sl-chip--a" />
        <span className="sl-chip sl-chip--w" />
        <span className="sl-chip sl-chip--b" />
        <i className="sl-scan" />
      </div>

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
