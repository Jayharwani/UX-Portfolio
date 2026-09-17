import { useState, useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import Hero from "./home/Hero";
import Intro from "./home/Intro";
import { useInView } from "./home/useInView";
import Route from "./home/Route";
import { ToolRow } from "./home/toolmarks";
import { useMagnetic } from "./home/magnetic";
import { useHeartbeat } from "./home/useHeartbeat";
import WorkField from "./home/WorkField";
import { ProjectCard3D, Depth } from "./projects/ProjectCard";
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

/* `beat` is how often that preview replays its own story, in ms. Four
   different periods on purpose: equal ones would sync into a single pulse
   across the whole grid, which reads as a page-wide glitch rather than as
   four products running. Nothing here divides evenly into anything else, so
   they drift apart and stay apart.

   `fn` is the literal name of each preview's component, and it is literal on
   purpose. The source panel used to look its code up with w.Preview.name,
   which minification renames — so on the live site every panel found nothing
   and reported "0 lines". It worked in dev and had never worked in
   production. A string in the data cannot be minified away.

   The accents are the ones the old work cards used. Losing them made all four
   projects render identically, which threw away a real colour system for
   nothing — the previews already carry these hues internally, so the frame
   agreeing with them is the whole point. */
const WORK = [
  { n: "01", name: "Signal", line: "A live map of DMV tech events.", to: "/signal", accent: "#1F9D55", Preview: SignalPreview, fn: "SignalPreview", beat: 6200 },
  { n: "02", name: "Headroom", line: "Can I spend this, right now?", to: "/headroom", accent: "#34D399", Preview: HeadroomPreview, fn: "HeadroomPreview", beat: 7100 },
  { n: "03", name: "ChronoWeave", line: "Helping people with ADHD feel time pass.", to: "/chronoweave", accent: "#A78BFA", Preview: ChronoWeavePreview, fn: "ChronoWeavePreview", beat: 8000 },
  { n: "04", name: "Bumper", line: "Catches impulse buys before you regret them.", to: "/bumper", accent: "#14B8A6", Preview: BumperPreview, fn: "BumperPreview", beat: 8900 },
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

/* Words on their own line-clip, so a headline rises into place a word at a
   time instead of fading as a block.

   Masks, not opacity, and the distinction is the whole effect: a fade says
   "this is appearing", a mask says "this was always here and you are now
   seeing it", which is what makes the gesture read as typesetting rather
   than as an animation. Word level rather than character level, because
   characters look like a typewriter and destroy the line breaks the browser
   would otherwise choose.

   The visible words are aria-hidden with one readable copy alongside, so
   nobody hears a sentence delivered one word at a time. */
function Words({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <span className={className}>
      <span className="vh">{text}</span>
      {words.map((word, i) => (
        /* Two wrappers, and the outer one is not optional. The space between
           words has to live OUTSIDE the clip, because .wm clips its overflow
           and a trailing space inside it is overflow — which is exactly how
           this first rendered: "Idesigninterfacesthatgetoutoftheway." The
           normal space between these outer spans is also what lets the line
           wrap where the browser would have wrapped it anyway. */
        <span key={i} aria-hidden="true">
          <span className="wm">
            <span className="wm__w" style={{ ["--i" as string]: i }}>
              {word}
            </span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </span>
  );
}

/* ── the work section ────────────────────────────────────────────────────
   One layout at every width: the grid below, two columns or one. */
function Work() {
  const reduce = !!useReducedMotion();
  /* which project the header is showing. Owned here so the head, the field
     and the work are one statement rather than three neighbours. */
  const [active, setActive] = useState(0);
  return (
    /* The field sits behind both the head and the grid, so the depth belongs
       to the whole section rather than to the cards alone. */
    <div className="workzone">
      <WorkField active={active} accent={WORK[active]?.accent ?? ""} reduce={reduce} />
      <WorkHead active={active} />
      <WorkGrid reduce={reduce} onActive={setActive} />
    </div>
  );
}

function WorkHead({ active }: { active: number }) {
  const list = useRef<HTMLOListElement>(null);
  const mark = useRef<HTMLSpanElement>(null);

  /* ── the travelling mark ──
     The index used to say which project you were looking at by recolouring
     one of four things. Four states with nothing between them is a readout;
     one mark that MOVES is a mechanism, and the movement is the part that
     tells you the index and the grid are the same object seen twice.

     Its position is read off the active item's own box rather than computed
     from an assumed width, so it stays correct when the items wrap at narrow
     widths or the clamp changes their size. */
  useEffect(() => {
    const ol = list.current;
    const m = mark.current;
    if (!ol || !m) return;
    const place = () => {
      const item = ol.children[active] as HTMLElement | undefined;
      const frame = item?.querySelector<HTMLElement>(".wix__frame");
      if (!frame) return;
      m.style.setProperty("--ac", WORK[active]?.accent ?? "");
      m.style.width = `${frame.offsetWidth}px`;
      m.style.transform = `translate3d(${item!.offsetLeft}px, ${
        frame.offsetTop + frame.offsetHeight
      }px, 0)`;
      m.style.opacity = "1";
    };
    place();
    window.addEventListener("resize", place, { passive: true });
    return () => window.removeEventListener("resize", place);
  }, [active]);

  return (
    <div className="band band--ink workhead">
      <div className="band__in">
        <Reveal>
          <span className="micro">Selected work</span>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="head workhead__claim">
            <Words text="I design interfaces that get out of the way." />
          </h2>
        </Reveal>
        <Reveal delay={0.14}>
          {/* wordless on purpose, so it is a legend rather than a second
              contents list — the names are right below it */}
          <div className="wixwrap">
            <ol className="wix" ref={list} aria-hidden="true">
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
              <span className="wix__mark" ref={mark} aria-hidden="true" />
            </ol>
          </div>
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
    const tags = cards.map((c) => c.querySelector<HTMLElement>(".wcard__tag"));
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

        /* ── the intent tag ──
           Inside the frame, a label follows the cursor and says what a click
           will do. The frame is one large link with no visible affordance,
           and "these previews are live" and "this preview is a door" are two
           different claims — the second one needed saying.

           It trails rather than sticking to the cursor, and that lag is a CSS
           transition on the transform rather than a lerp in this loop:
           continuous writes into a short transition give weight for free, and
           land correctly rather than stalling if frames run out. */
        const tag = tags[k];
        if (!tag) continue;
        const inside =
          px >= b.left && px <= b.right && py >= b.top && py <= b.bottom;
        tag.classList.toggle("is-on", inside);
        if (inside) {
          /* Clamped to the frame. The tag sits down-right of the cursor, so
             near the bottom or right edge it would otherwise hang outside a
             frame whose whole character is a clean hairline rectangle. */
          const tw = tag.offsetWidth;
          const th = tag.offsetHeight;
          const x = Math.min(px - b.left, b.width - tw - 26);
          const y = Math.min(py - b.top, b.height - th - 24);
          tag.style.transform = `translate3d(${Math.max(0, x).toFixed(1)}px, ${Math.max(
            0,
            y
          ).toFixed(1)}px, 0)`;
        }
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

    /* A pointer that leaves the window stops sending moves, so without this
       the last tag stays lit over a card nobody is pointing at. */
    const onLeave = () => {
      for (const t of tags) t?.classList.remove("is-on");
    };
    if (!reduce && fine) document.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, onActive]);

  return (
    /* ONE perspective for all four cards, on the list rather than on each
       card. Per-card perspective gives every card its own vanishing point at
       its own centre, so they all lean toward their own middles and the grid
       reads as four unrelated skews. Shared, they lean like objects on a desk
       seen from one place. */
    <ol className="wgrid" ref={listRef} style={{ perspective: "1200px" }}>
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
  const [open, setOpen] = useState(false);
  const code = sourceOf(w.fn);
  const beat = useHeartbeat(live && !open, w.beat);

  return (
    <li className={`wcard${seen ? " is-in" : ""}`} style={{ ["--ac" as string]: w.accent }}>
      <ProjectCard3D
        number={w.n}
        title={w.name}
        description={w.line}
        href={w.to}
        accent={w.accent}
        overlay={
          /* Above the card's own link, so it stays pressable. Everything else
             in the frame is picture; this is a control. */
          <button
            type="button"
            className="srcbtn"
            onClick={() => setOpen((v) => !v)}
            aria-pressed={open}
          >
            {open ? "Live" : "Source"}
          </button>
        }
      >
        {/* The ground: a plane that stays ON the card, so the preview floating
            above it has something to be parallax AGAINST. Two planes is the
            minimum for depth to exist at all. */}
        <div className="absolute inset-0 bg-[#070A0E]" aria-hidden="true" />

        {/* The live preview, held 30px off the card. It is a real animated
            recreation of the product rather than a picture of one, and it
            replays on its own clock — which is why it is worth floating. */}
        <Depth z={30} className="absolute inset-0">
          <div className="wcard__art absolute inset-0">
            <w.Preview key={beat} active={live && !open} />
          </div>
        </Depth>

        {/* the source, nearer still, so opening it reads as something arriving
            in front of the preview rather than replacing it */}
        <Depth z={46} className="absolute inset-0">
          <div
            className={`wcard__src${open ? " is-open" : ""}`}
            aria-hidden={!open}
            {...(open ? {} : { inert: "" })}
          >
            <pre className="src">
              <Highlight code={code} />
            </pre>
            <div className="src__foot">
              <span className="micro">
                {w.fn}.tsx &middot; {lineCount(code)} lines &middot; running on the other side
              </span>
            </div>
          </div>
        </Depth>
      </ProjectCard3D>
    </li>
  );
}

export function Home() {
  const reduce = !!useReducedMotion();
  useMagnetic(!reduce);
  return (
    <main className="s32">
      <Intro />
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
              <a className="big-link link-wipe" href={`mailto:${EMAIL}`} data-mag>
                Email
              </a>
              <a
                className="big-link link-wipe"
                href={LINKEDIN}
                target="_blank"
                rel="noopener noreferrer"
                data-mag
              >
                LinkedIn ↗
              </a>
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

