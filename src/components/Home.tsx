import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Hero from "./home/Hero";
import { useNarrow } from "./home/useNarrow";
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

   THE SCROLL. One pinned stage, scrubbed, that advances through four
   projects. Per the ScrollTrigger guidance: the trigger is pinned and the
   animation is a single top-level timeline, nothing animates the pinned
   element itself, instances are killed through a gsap.context() on unmount,
   and a refresh is issued once fonts settle because their metrics move the
   start and end positions.

   Progress drives React state only when the INDEX changes, not on every
   scroll frame — four renders across the whole stage rather than several
   hundred. That distinction is the difference between this being smooth and
   it being the jank this site spent weeks removing.

   THE PIN IS NOT UNIVERSAL. A phone, and anyone who asked for reduced
   motion, gets a vertical list instead — a second real layout, not a
   degraded one. A pinned stage needs room for the copy beside the work and
   a pointer that can hover it; on a phone it is 400vh of scrubbed scroll
   showing one project at a time with no way back to the last one.
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

/* ── the work section picks its structure ────────────────────────────────
   Two layouts, not one layout with mobile CSS on top. The pinned stage is a
   good use of scroll on a wide screen and a bad one on a phone, where it
   becomes 400vh of scrubbed scroll showing one project at a time with no way
   to look back at the one you just passed. See useNarrow.ts. */
function Work() {
  const reduce = !!useReducedMotion();
  const narrow = useNarrow();
  return reduce || narrow ? <WorkList reduce={reduce} /> : <WorkStage />;
}

/* ── phone: a vertical list you can just read ─────────────────────────────
   Every project is on the page at once, in order, and scrolling past one
   does not take it away. Nothing is pinned and nothing is scrubbed, so the
   page scrolls at the speed the thumb moved it — which is most of what
   "satisfying" means on a phone.

   What is left to design, then, is arrival. Each card rises and settles on a
   long exponential curve, its rule draws out under the accent, and the
   preview inside the frame drifts against the frame as the card crosses the
   screen, so the work has a plane of its own behind the border. The preview
   also PLAYS when it arrives and resets when it leaves, which is the same
   contract the stage used — so scrolling back up runs the animation again
   rather than showing you a finished still.

   This is also the shorter page: four full-height pinned screens came to
   3248px on a 390 phone, and the list comes to about 2100px with all four
   projects actually visible in it. */
function WorkList({ reduce }: { reduce: boolean }) {
  const listRef = useRef<HTMLOListElement>(null);

  /* The drift. The FRAME moves, not the art inside it, and that distinction
     was worth a rebuild: drifting the art meant rendering it taller than its
     frame and clipping the overhang, which quietly ate the bottom of every
     preview — Signal's "12 you can make" card was cut in half by it. The
     frame carries its contents with it and nothing is cropped at all.

     What you see instead is the frame moving against the caption under it,
     which is the same parallax read: two layers of one card at two depths.

     One passive listener for the whole list, throttled to a frame, writing a
     transform on at most four elements and only on the ones near the
     viewport. A transform rather than a custom property — a custom property
     on this page measured 12.9ms to invalidate, a transform stays on the
     compositor. */
  useEffect(() => {
    if (reduce) return;
    const list = listRef.current;
    if (!list) return;
    const frames = Array.from(list.querySelectorAll<HTMLElement>(".wcard__frame"));
    if (!frames.length) return;
    let queued = false;
    const write = () => {
      queued = false;
      const vh = window.innerHeight;
      for (const frame of frames) {
        const b = frame.getBoundingClientRect();
        if (b.bottom < -120 || b.top > vh + 120) continue;
        /* -1 when the frame's middle is at the top of the screen, +1 at the
           bottom, 0 as it passes the centre — so a card settles exactly where
           it is read and leans on the way in and the way out. */
        const t = (b.top + b.height / 2 - vh / 2) / (vh / 2);
        frame.style.transform = `translate3d(0, ${(t * 10).toFixed(2)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  return (
    <ol className="wlist" ref={listRef}>
      {WORK.map((w) => (
        <WorkCard key={w.name} w={w} reduce={reduce} />
      ))}
    </ol>
  );
}

function WorkCard({ w, reduce }: { w: (typeof WORK)[number]; reduce: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  /* Two signals, not one. `seen` latches, so scrolling back up does not fade
     the page out behind you; `inView` tracks both ways, so the preview resets
     when it leaves and runs again when you come back to it. The guard against
     a silent observer lives in the hook — see useInView.ts. */
  const { seen, inView, forced } = useInView(ref, { enabled: !reduce });
  const [flipped, setFlipped] = useState(false);
  const code = sourceOf(w.Preview.name);

  return (
    <li
      ref={ref}
      className={`wcard${seen ? " is-in" : ""}${forced ? " is-instant" : ""}`}
      style={{ ["--ac" as string]: w.accent }}
    >
      <div className="wcard__frame">
        <div className={`flip${flipped ? " is-flipped" : ""}`}>
          <div className="flip__face flip__face--front">
            <div className="wcard__art">
              <w.Preview active={inView} />
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
        <Link className="stage__go" to={w.to}>
          View case ↗
        </Link>
      </div>
    </li>
  );
}

/* ── the pinned stage ───────────────────────────────────────────────────── */
function WorkStage() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const iRef = useRef(0);
  /* Hover replays the preview's own animation — the counters, the bars, the
     ring. That was the best thing about the old work cards and the rebuild
     lost it: scroll fires each preview once when it arrives and then never
     again, so there was nothing to poke.

     A plain remount does NOT work, and the reason is specific: ChronoWeave
     and Bumper declare no `initial` prop, only animate={active ? A : B}.
     Framer Motion treats the current animate value as the starting state
     when initial is absent, so a component mounted with active already true
     has nothing to animate FROM and renders the finished state statically.
     Signal and Headroom survived it only because they animate from a
     useEffect that re-runs on mount.

     The root cause is fixed where it lived: ChronoWeave and Bumper now
     declare initial props, so a fresh mount animates from the inactive state
     like anything else. With that in place a plain remount replays all four
     — the two effect-driven ones re-run their effects, the two Motion-driven
     ones animate from initial — and no arming dance is needed here.

     Every slide carries the same key, so changing project does not remount
     anything — that path was already correct and only needed leaving alone. */
  const [replay, setReplay] = useState(0);
  const replayNow = () => setReplay((r) => r + 1);
  /* The flip is the point of the whole section: the previews are live React
     and nothing said so. Reset on project change, so arriving at a project
     always shows the running thing first and the code is a choice. */
  const [flipped, setFlipped] = useState(false);
  const faceRef = useRef<HTMLDivElement>(null);
  useEffect(() => setFlipped(false), [i]);
  const code = sourceOf(WORK[i].Preview.name);

  useEffect(() => {
    if (reduce) return;
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    /* Dev-only handle. ScrollTrigger updates through gsap.ticker, which is
       requestAnimationFrame-driven, and rAF does not run in a backgrounded
       tab — so automated checks can create the trigger but never see it
       advance. Exposing it in DEV lets a test drive update() by hand and
       verify the pin and the index for real instead of assuming. Stripped
       from production by import.meta.env.DEV. */
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;

    /* gsap.context() scopes every instance created inside it, so one revert()
       on unmount kills the pin, the spacer and the trigger together. Without
       it a client-side route change leaves a pinned spacer behind. */
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: false, // the wrapper already reserves the scroll distance
        scrub: true,
        onUpdate: (self) => {
          /* Index only. Writing state on every scroll frame would be a few
             hundred React renders across this section; this is four. */
          const next = Math.min(WORK.length - 1, Math.floor(self.progress * WORK.length));
          if (next !== iRef.current) {
            iRef.current = next;
            setI(next);
          }
        },
      });
    }, wrap);

    /* Font metrics move the start and end positions, and the page loads three
       families. Refresh once they have settled. */
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [reduce]);

  /* Reduced motion and phone widths never reach here — Work() sends both to
     the list, which is a real layout rather than a degraded stage. */
  return (
    <div ref={wrapRef} className="workwrap" style={{ height: `${WORK.length * 100}vh` }}>
      <div ref={stageRef} className="stage" style={{ ["--ac" as string]: WORK[i].accent }}>
        <div className="stage__in">
          <div className="stage__copy">
            {WORK.map((w, k) => (
              <div key={w.name} className={`stage__text${k === i ? " is-on" : ""}`} aria-hidden={k !== i}>
                <h3 className="stage__name">{w.name}</h3>
                <p className="stage__line">{w.line}</p>
                <Link className="stage__go" to={w.to} tabIndex={k === i ? 0 : -1}>
                  View case ↗
                </Link>
              </div>
            ))}
          </div>

          <div
            className="stage__screen"
            onMouseEnter={replayNow}
          >
            <div className={`flip${flipped ? " is-flipped" : ""}`}>
              <div className="flip__face flip__face--front" ref={faceRef}>
                {WORK.map((w, k) => (
                  <div key={w.name} className={`stage__slide${k === i ? " is-on" : ""}`} aria-hidden={k !== i}>
                    <w.Preview key={`${w.name}-${replay}`} active={k === i} />
                  </div>
                ))}
              </div>
              <div className="flip__face flip__face--back" aria-hidden={!flipped}>
                <pre className="src">
                  <Highlight code={code} />
                </pre>
                <div className="src__foot">
                  <span className="micro">src/components/home/previews.tsx</span>
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
        </div>

        <div className="stage__bar" aria-hidden="true">
          {WORK.map((w, k) => (
            <span key={w.name} className={`stage__tick${k === i ? " is-on" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Home() {
  return (
    <main className="s32">
      <Hero />

      {/* ── work: the whole point ── */}
      <section id="work" aria-label="Selected work">
        {/* The claim moved here when the hero became a pure entrance. It had
            no other home, and this band had no head — so it gains the
            sentence the site is actually arguing. */}
        <div className="band band--ink workhead">
          <div className="band__in">
            <Reveal>
              <span className="micro">Selected work</span>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="head" style={{ marginTop: 16, maxWidth: "18ch" }}>
                I design interfaces that get out of the way.
              </h2>
            </Reveal>
          </div>
        </div>
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

