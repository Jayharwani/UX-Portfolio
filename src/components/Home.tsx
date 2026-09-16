import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useReducedMotion } from "motion/react";
import Hero from "./home/Hero";
import { useInView } from "./home/useInView";
import Route from "./home/Route";
import { ToolRow } from "./home/toolmarks";
import { sourceOf, Highlight, lineCount } from "./home/source";
import {
  SignalPreview,
  HeadroomPreview,
  ChronoWeavePreview,
  BumperPreview,
} from "./home/previews";

/* ──────────────────────────────────────────────────────────────────────────
   The homepage. Show the work, say almost nothing.

   The previous version borrowed s32.com's structure including its rule of
   having no imagery at all — which is the one rule that cannot transfer. s32
   is a firm selling conviction and has no craft to show. A portfolio is the
   opposite: the work IS the argument, and describing it in paragraphs is how
   a portfolio ends up reading like a corporate site.

   So the text is cut to roughly a quarter, the three paragraphs of "how I
   work" are gone entirely, and the middle of the page is now a pinned stage
   where the four live previews play at size.

   THE PREVIEWS ARE THE POINT. They are not screenshots. They are hand-built,
   animated recreations of four shipped products, which means the evidence
   for "I build the front end" is itself front-end running in the page.

   ALL FOUR AT ONCE. There was a pinned stage here that showed one project at
   a time, scrubbed by scroll — 400vh of hijacked page to see four things
   that fit on one screen, and it made the site's strongest asset take turns.
   The grid shows them together at every width, two columns above 900px and
   one below, all four running.

   NOTHING IN THIS SECTION USES AN INTERSECTION OBSERVER. Arrival, liveness
   and the header's active project all come from one scroll handler measuring
   rectangles: correct on the first frame, unambiguous when two cards are half
   on screen, and measurable — which the observer path provably was not.
   ────────────────────────────────────────────────────────────────────────── */

const EMAIL = "harwanijay9498@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/jay-harwani/";

/* The accents are the ones the old work cards used. Losing them made all four
   projects render identically, which threw away a real colour system for
   nothing — the previews already carry these hues internally, so the frame
   agreeing with them is the whole point. */
const WORK = [
  { n: "01", name: "Signal", line: "A live map of DMV tech events.", to: "/signal", accent: "#1F9D55", Preview: SignalPreview },
  { n: "02", name: "Headroom", line: "Can I spend this, right now?", to: "/headroom", accent: "#34D399", Preview: HeadroomPreview },
  { n: "03", name: "ChronoWeave", line: "Helping people with ADHD feel time pass.", to: "/chronoweave", accent: "#A78BFA", Preview: ChronoWeavePreview },
  { n: "04", name: "Bumper", line: "Catches impulse buys before you regret them.", to: "/bumper", accent: "#14B8A6", Preview: BumperPreview },
];

/* Arrival for the editorial bands.

   This used to be Motion's whileInView, which is the third thing on this page
   to put an element at opacity 0 and then wait on an observer to take it back
   — after the hero entrance and the work cards, both of which were found
   blank on a document that mounted hidden. Motion's viewport detection is the
   same machinery and inherits the same silence.

   Routing it through the guarded hook was not enough on its own, and the
   reason is worth recording: Motion animates on requestAnimationFrame and
   writes each frame as an inline style. When the ticker never runs, the hook
   correctly reports "arrived" and the element still sits at the start value
   Motion wrote, because nothing ever writes the next one. Measured exactly
   that: seen true, inline style still opacity 0.

   So this is a class and a CSS transition now, like the work cards. A class
   flip changes the computed style whether or not a frame is ever produced,
   which means the failsafe can actually take effect. Same curve, same delay,
   one less thing that can hold the page blank.
   ────────────────────────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = !!useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { seen, forced } = useInView(ref, { threshold: 0.35, rootMargin: "0px", enabled: !reduce });
  return (
    <div
      ref={ref}
      className={`rv${seen ? " is-in" : ""}${forced ? " is-instant" : ""}${className ? ` ${className}` : ""}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}

/* ── the work section ────────────────────────────────────────────────────
   One layout at every width: the grid below, two columns or one. */
function Work() {
  const reduce = !!useReducedMotion();
  /* which project the header is showing. Owned here so the head and the work
     are one statement rather than two neighbours. */
  const [active, setActive] = useState(0);
  return (
    <>
      <WorkHead active={active} />
      <WorkGrid reduce={reduce} onActive={setActive} />
    </>
  );
}

/* ── the head ──────────────────────────────────────────────────────────────
   It was a label and a sentence in a large empty band, and it was the most
   boring rectangle on the page. The sentence stays — it is the thing the
   site is arguing — and it now sits above an INDEX.

   The index is four small frames, one per project, in the page's own
   hairline language, and it is deliberately wordless. Listing the four names
   here would only repeat what is two hundred pixels below; four frames carry
   the same information as a shape — how many, in what order, in which
   colour — and add none of the text this page has spent months cutting.

   It is also LIVE. The frame for the project you are looking at takes its
   accent and opens its header bar, on desktop from the pinned stage's index
   and on a phone from whichever card is on screen. A header that knows where
   you are is a header doing work rather than introducing. */
function WorkHead({ active }: { active: number }) {
  return (
    <div className="band band--ink workhead">
      <div className="band__in">
        <Reveal>
          <span className="micro">Selected work</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="head workhead__claim">
            I design interfaces that get out of the way.
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          {/* wordless on purpose, so it is a legend rather than a second
              contents list — the names are right below it */}
          <ol className="wix" aria-hidden="true">
            {WORK.map((w, k) => (
              <li
                key={w.name}
                className={`wix__item${k === active ? " is-on" : ""}`}
                style={{ ["--ac" as string]: w.accent }}
              >
                <span className="wix__frame" />
                <span className="wix__n">{w.n}</span>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </div>
  );
}

/* ── ALL FOUR AT ONCE ────────────────────────────────────────
   The pinned stage is gone. It showed one project at a time, scrubbed by
   scroll, and it was 400vh of hijacked page to see four things that fit on
   one screen. Worse, it made the site's strongest asset take turns: four
   hand-built, animated recreations of shipped products, and you could only
   ever look at one.

   They all run at once now, in a grid, on every width — two columns above
   900px and one below. The argument the page is making is "these are not
   screenshots", and four of them moving simultaneously makes that argument
   four times over without a word.

   NOTHING HERE USES AN INTERSECTION OBSERVER. Arrival, liveness and the
   header's active project all come from one scroll handler measuring
   rectangles. Three reasons, in order of how much they matter: it is correct
   on the first frame because the handler runs on mount, where an observer has
   to be told and can stay silent; "nearest the middle" is unambiguous when
   two cards are half on screen and "intersecting" is not; and it is
   measurable, which the observer path provably was not.
   ──────────────────────────────────────────────────────────────────────── */

/** how far a frame leans toward the pointer, in degrees */
const TILT = 4.2;
/** and how far it drifts against its own caption as it crosses the screen */
const DRIFT = 10;

function WorkGrid({
  reduce,
  onActive,
}: {
  reduce: boolean;
  onActive: (i: number) => void;
}) {
  const listRef = useRef<HTMLOListElement>(null);
  /* seen latches (a card that has arrived stays arrived); live tracks both
     ways, so a preview replays when you come back to it */
  const [seen, setSeen] = useState<boolean[]>(() => WORK.map(() => reduce));
  const [live, setLive] = useState<boolean[]>(() => WORK.map(() => reduce));

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.querySelectorAll<HTMLElement>(".wcard"));
    const frames = cards.map((c) => c.querySelector<HTMLElement>(".wcard__frame"));
    if (!cards.length) return;

    /* every frame's transform is composed from two independent inputs, so
       each one owns its own number and neither can clobber the other */
    const drift = cards.map(() => 0);
    const tilt = cards.map(() => [0, 0]);
    const apply = (k: number) => {
      const f = frames[k];
      if (!f) return;
      const [rx, ry] = tilt[k];
      f.style.transform =
        `translate3d(0, ${drift[k].toFixed(2)}px, 0)` +
        ` rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    };

    let lastActive = -1;
    const measure = () => {
      const vh = window.innerHeight;
      const mid = vh * 0.5;
      let best = 0;
      let bestD = Infinity;
      const nextSeen: boolean[] = [];
      const nextLive: boolean[] = [];

      for (let k = 0; k < cards.length; k++) {
        const b = cards[k].getBoundingClientRect();
        const centre = b.top + b.height / 2;

        /* nearest the middle of the screen wins the header */
        const d = Math.abs(centre - mid);
        if (d < bestD) {
          bestD = d;
          best = k;
        }

        const onScreen = b.bottom > vh * 0.06 && b.top < vh * 0.94;
        nextSeen[k] = onScreen;
        nextLive[k] = onScreen;

        if (!reduce) {
          /* -1 at the top of the screen, +1 at the bottom, 0 as it passes the
             middle — so a card settles exactly where it is read */
          const t = (centre - mid) / mid;
          drift[k] = Math.max(-1, Math.min(1, t)) * DRIFT;
          apply(k);
        }
      }

      setSeen((prev) => (prev.some((v, k) => !v && nextSeen[k]) ? prev.map((v, k) => v || nextSeen[k]) : prev));
      setLive((prev) => (prev.some((v, k) => v !== nextLive[k]) ? nextLive : prev));
      if (best !== lastActive) {
        lastActive = best;
        onActive(best);
      }
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure, { passive: true });

    /* the tilt. One window handler rather than eight per-card ones, throttled
       to a frame, and the lean falls off with distance so only the card you
       are actually near responds. */
    let queued = false;
    let px = 0;
    let py = 0;
    const write = () => {
      queued = false;
      for (let k = 0; k < cards.length; k++) {
        const b = frames[k]?.getBoundingClientRect();
        if (!b) continue;
        const nx = (px - (b.left + b.width / 2)) / (b.width / 2);
        const ny = (py - (b.top + b.height / 2)) / (b.height / 2);
        const near = Math.max(0, 1 - Math.hypot(nx, ny) / 1.9);
        tilt[k] = [-ny * TILT * near, nx * TILT * near];
        apply(k);
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (queued) return;
      queued = true;
      requestAnimationFrame(write);
    };
    const fine = !window.matchMedia("(pointer: coarse)").matches;
    if (!reduce && fine) window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduce, onActive]);

  return (
    <ol className="wgrid" ref={listRef}>
      {WORK.map((w, k) => (
        <WorkCard key={w.name} w={w} seen={seen[k]} live={live[k]} />
      ))}
    </ol>
  );
}

function WorkCard({
  w,
  seen,
  live,
}: {
  w: (typeof WORK)[number];
  seen: boolean;
  live: boolean;
}) {
  const [flipped, setFlipped] = useState(false);
  const code = sourceOf(w.Preview.name);

  return (
    <li className={`wcard${seen ? " is-in" : ""}`} style={{ ["--ac" as string]: w.accent }}>
      <div className="wcard__frame">
        <div className={`flip${flipped ? " is-flipped" : ""}`}>
          <div className="flip__face flip__face--front">
            <div className="wcard__art">
              <w.Preview active={live} />
            </div>
          </div>
          <div className="flip__face flip__face--back" aria-hidden={!flipped}>
            <pre className="src">
              <Highlight code={code} />
            </pre>
            <div className="src__foot">
              <span className="micro">{lineCount(code)} lines · running on the other side</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="flipbtn"
          onClick={() => setFlipped((v) => !v)}
          aria-pressed={flipped}
        >
          {flipped ? "Live" : "Source"}
        </button>
      </div>

      <div className="wcard__meta">
        <span className="micro wcard__n">{w.n}</span>
        <h3 className="wcard__name">{w.name}</h3>
        <div className="wcard__rule" aria-hidden="true" />
        <p className="wcard__line">{w.line}</p>
        <Link className="wcard__go" to={w.to}>
          View case ↗
        </Link>
      </div>
    </li>
  );
}

export function Home() {
  return (
    <main className="s32">
      <Hero />

      {/* ── work: the whole point ── */}
      <section id="work" aria-label="Selected work">
        <Work />
      </section>

      {/* ── stone: the one biographical fact, drawn rather than written ──
          This band used to be a four-line sentence over nine tool names set
          as running text: twenty-two words for one fact about a person. The
          sentence is now a line between two points, and the tool names are
          marks, so the band says the same thing at a glance. */}
      <section className="band band--ink entry-seam" aria-label="About">
        <div className="band__in">
          <Reveal>
            <span className="micro">The route</span>
          </Reveal>
          <div className="origin">
            {/* Route runs its own arrival — wrapping it in Reveal would fade
                the frame in over a graphic that is already drawing itself. */}
            <div className="origin__art">
              <Route />
            </div>
            <div className="origin__say">
              <Reveal delay={0.1}>
                <p className="origin__line">
                  Master&rsquo;s in Human-Centered Computing, UMBC.
                </p>
              </Reveal>
              <Reveal delay={0.18}>
                <ToolRow />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── contact ── */}
      <section className="band band--ink" id="contact">
        <div className="band__in">
          <Reveal>
            <h2 className="display" style={{ maxWidth: "12ch" }}>Let&rsquo;s build something.</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="contact__row">
              <a className="big-link" href={`mailto:${EMAIL}`}>Email</a>
              <a className="big-link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="foot">
              <span className="micro">No sponsorship required</span>
              <span className="micro">© 2026</span>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}

