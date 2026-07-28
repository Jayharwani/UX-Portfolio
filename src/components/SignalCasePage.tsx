import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Link } from "react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ──────────────────────────────────────────────────────────────────────────
   Signal — case study, motion-rich direction (CASESTUDY-MOTION.md).
   The content and 10-second hook from CASESTUDY.md hold; the delivery is now
   choreographed. The spectacle is Signal itself: the real live map in the
   hero, and — the signature moment — the Fit re-sort scrubbed to the reader's
   own scroll, pins resolving into open / tight / conflict as a counter reads
   up to "24 of 40 fit your week."

   Robustness: every animated element renders in its FINAL, correct, rich
   state by default. GSAP then sets the intro state and animates to that
   final. So a JS failure, a reduced-motion visitor, or a no-scroll founder
   all still get a complete, readable, premium page — the hook never hides
   behind an animation.
   ────────────────────────────────────────────────────────────────────────── */

const LIVE = "https://jayharwani.github.io/dmv-map/";
const GITHUB = "https://github.com/Jayharwani/dmv-map";
const EASE = [0.16, 1, 0.3, 1] as const;

const HAS_CRAFT_SHOTS = true;

/* ── the Fit demo: 40 real-feeling pins, honestly 24 open / 10 tight / 6 conflict.
      Positions + states are deterministic so the scene is stable every load.
      The "24" the counter reads is literally the number of green pins on screen —
      a demonstration of the mechanic, not a claimed outcome metric. ── */
type FitState = "open" | "tight" | "conflict";
interface Pin {
  x: number; // % across the stage
  y: number; // % down the stage
  state: FitState;
  day: number; // date badge
  jx: number; // intro scatter offset (px)
  jy: number;
}
const PIN_COUNT = 40;
const PINS: Pin[] = Array.from({ length: PIN_COUNT }, (_, i) => {
  const gx = (i * 0.6180339887) % 1;
  const gy = (i * 0.3542) % 1;
  const rank = (i * 13 + 7) % PIN_COUNT; // scatter the states across the map
  const state: FitState = rank < 24 ? "open" : rank < 34 ? "tight" : "conflict";
  const s = Math.sin(i * 12.9898) * 43758.5453;
  const r = s - Math.floor(s); // deterministic pseudo-random 0..1
  return {
    x: 7 + gx * 86,
    y: 15 + gy * 74,
    state,
    day: 3 + ((i * 4) % 25),
    jx: (r - 0.5) * 120,
    jy: (((i * 0.7548) % 1) - 0.5) * 120,
  };
});
const OPEN_TOTAL = PINS.filter((p) => p.state === "open").length; // 24

/* ghost calendar commitments that fade in before the sort */
const GHOSTS = [
  { x: 20, y: 26, w: 15, label: "Standup" },
  { x: 62, y: 20, w: 18, label: "1:1" },
  { x: 44, y: 58, w: 20, label: "Deep work" },
  { x: 73, y: 66, w: 16, label: "Gym" },
  { x: 14, y: 70, w: 17, label: "Dinner" },
];

const CITIES = [
  { name: "San Francisco", note: "has a startup map", has: true },
  { name: "New York", note: "has one too", has: true },
  { name: "The DMV", note: "had none — now live", has: false },
];

const STEPS = [
  { n: "01", lead: "Connect your calendar", sub: "Read on your device. Never uploaded." },
  { n: "02", lead: "It weighs real travel", sub: "Between your existing commitments." },
  { n: "03", lead: "Every event gets a verdict", sub: "Open, tight, or a conflict." },
];

const DECISIONS = [
  { lead: "Commute reality, not calendar math.", body: "Graying out overlaps is easy. Fit estimates the real travel that actually decides whether you make it." },
  { lead: "Privacy as a property, not a promise.", body: "Your calendar is read in the browser and never uploaded. No account, no server, nothing stored." },
  { lead: "Events first, tools second.", body: "My first build buried events behind the calendar controls. I inverted it — same feature, different hierarchy." },
  { lead: "Live, and free to run.", body: "A scheduled pipeline refreshes the data every few hours by itself, at zero recurring cost." },
];

/* ── reliable, reduced-motion-aware reveal for the reading blocks ── */
function Reveal({ children, delay = 0, y = 20, className, style }: { children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/* ── craft-shot resolver: tries png/jpg/webp, falls back to a live-map card ── */
function useResolvedShot(base: string): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!HAS_CRAFT_SHOTS) return;
    let alive = true;
    let timer = 0;
    const exts = ["png", "jpg", "jpeg", "webp"];
    let i = 0;
    const attempt = () => {
      if (!alive || i >= exts.length) return;
      const candidate = `${base}.${exts[i]}`;
      const img = new Image();
      const advance = () => {
        window.clearTimeout(timer);
        i++;
        attempt();
      };
      img.onload = () => {
        if (!alive) return;
        window.clearTimeout(timer);
        if (img.naturalWidth > 0) setUrl(candidate);
        else advance();
      };
      img.onerror = advance;
      timer = window.setTimeout(advance, 4000);
      img.src = candidate;
    };
    attempt();
    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [base]);
  return url;
}

function Figure({ base, alt, caption }: { base: string; alt: string; caption: string }) {
  const url = useResolvedShot(base);
  return (
    <figure className="sig-fig">
      {url ? (
        <img src={url} alt={alt} loading="lazy" className="sig-shot" />
      ) : (
        <a className="sig-shot sig-shot-live" href={LIVE} target="_blank" rel="noopener noreferrer" aria-label={alt}>
          <span className="sig-dot" aria-hidden="true" />
          <span>See this live in the map</span>
          <span aria-hidden="true">↗</span>
        </a>
      )}
      <figcaption className="sig-cap">{caption}</figcaption>
    </figure>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   The signature moment — the Fit re-sort.
   Renders in FINAL sorted state by default. GSAP (desktop) sets the scattered
   neutral intro and scrubs to final over the section's scroll; the stage is
   CSS-sticky so it holds while the pins resolve. Mobile plays it once on
   enter (no scrub). Reduced-motion / no-JS: the final state simply shows.
   ══════════════════════════════════════════════════════════════════════════ */
function FitReSort() {
  return (
    <div className="sig-map" aria-hidden="true">
      {/* abstract street grid backdrop */}
      <svg className="sig-map-grid" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0 22 H100 M0 44 H100 M0 66 H100 M0 84 H100 M16 0 V100 M38 0 V100 M58 0 V100 M78 0 V100" />
        <path className="sig-map-river" d="M-2 58 C 20 52 34 74 52 68 S 86 50 102 60" />
      </svg>

      {/* ghost commitments */}
      {GHOSTS.map((g, i) => (
        <div key={i} className="sig-ghost" data-ghost style={{ left: `${g.x}%`, top: `${g.y}%`, width: `${g.w}%` }}>
          {g.label}
        </div>
      ))}

      {/* the pins */}
      {PINS.map((p, i) => (
        <div
          key={i}
          className="sig-pin"
          data-pin
          data-state={p.state}
          style={{ left: `${p.x}%`, top: `${p.y}%`, ["--jx" as string]: `${p.jx}px`, ["--jy" as string]: `${p.jy}px` }}
        >
          <span className="sig-pin-glow" />
          <span className="sig-pin-tile">
            <span className="sig-pin-day">{p.day}</span>
          </span>
          <span className="sig-pin-stem" />
        </div>
      ))}

      {/* the counter */}
      <div className="sig-counter" data-counter>
        <span className="sig-counter-num" data-counter-num>
          {OPEN_TOTAL}
        </span>
        <span className="sig-counter-label">
          of {PIN_COUNT} fit your week
        </span>
      </div>
    </div>
  );
}

export function SignalCasePage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [framed, setFramed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Signal — Product design case study";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setFramed(true), 300);
    return () => window.clearTimeout(id);
  }, []);

  /* ── all GSAP lives in one context, reverted on unmount (kills every
        ScrollTrigger + SplitText this page created, so navigation is clean) ── */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return; // reduced-motion: the static final state is the whole experience

    const ctx = gsap.context(() => {
      let titleFailsafe = 0;
      /* hero title — SplitText rise, once */
      const titleEl = root.querySelector<HTMLElement>("[data-hero-title]");
      let split: SplitText | null = null;
      if (titleEl) {
        split = new SplitText(titleEl, { type: "chars" });
        gsap.from(split.chars, { yPercent: 120, opacity: 0, stagger: 0.045, duration: 0.9, ease: "power3.out", delay: 0.15 });
        /* hook failsafe: the word "Signal" must never stay hidden. gsap.set is
           synchronous (no rAF needed), so this rescues a stalled/hidden-tab
           load; on a healthy browser the tween has long since finished and
           this is a harmless no-op. */
        titleFailsafe = window.setTimeout(() => {
          if (split) gsap.set(split.chars, { opacity: 1, yPercent: 0, y: 0 });
        }, 1800);
      }
      /* block C kinetic statement */
      const kinetic = root.querySelector<HTMLElement>("[data-kinetic]");
      let split2: SplitText | null = null;
      if (kinetic) {
        split2 = new SplitText(kinetic, { type: "words,chars" });
        gsap.from(split2.chars, {
          opacity: 0,
          yPercent: 90,
          stagger: 0.012,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: kinetic, start: "top 80%", once: true },
        });
      }

      /* hero live-map: subtle cursor parallax tilt (damped) */
      const tiltEl = root.querySelector<HTMLElement>("[data-tilt]");
      if (tiltEl && window.matchMedia("(pointer: fine)").matches) {
        const rot = { x: 6, y: 0 };
        gsap.set(tiltEl, { transformPerspective: 1200 });
        const qx = gsap.quickTo(tiltEl, "rotationX", { duration: 0.6, ease: "power3" });
        const qy = gsap.quickTo(tiltEl, "rotationY", { duration: 0.6, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const r = tiltEl.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          qy(nx * 7);
          qx(6 - ny * 6);
        };
        const onLeave = () => {
          qx(6);
          qy(0);
        };
        gsap.set(tiltEl, { rotationX: rot.x });
        tiltEl.addEventListener("pointermove", onMove);
        tiltEl.addEventListener("pointerleave", onLeave);
        // stored on the element so context revert doesn't need to know them
        (tiltEl as any)._cw = { onMove, onLeave };
      }

      /* the Fit re-sort — matchMedia so desktop scrubs, mobile plays once */
      const mm = gsap.matchMedia();

      const buildTimeline = (stage: HTMLElement) => {
        const pins = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll("[data-pin]"));
        const ghosts = gsap.utils.toArray<HTMLElement>(stage.querySelectorAll("[data-ghost]"));
        const numEl = stage.querySelector<HTMLElement>("[data-counter-num]");
        const counter = { v: 0 };

        const tl = gsap.timeline();
        // intro state: neutral, scattered, no glow
        tl.set(pins, {
          x: (i) => PINS[i].jx,
          y: (i) => PINS[i].jy,
          opacity: 0.5,
          scale: 0.9,
          "--tone": 0,
        } as any, 0);
        tl.set(ghosts, { opacity: 0, scale: 0.94 }, 0);
        if (numEl) numEl.textContent = "0";

        // 1) commitments fade in
        tl.to(ghosts, { opacity: 1, scale: 1, stagger: 0.06, duration: 0.5, ease: "power2.out" }, 0.05);

        // 2) pins settle to their map position + resolve to fit state
        tl.to(
          pins,
          {
            x: 0,
            y: (i) => (PINS[i].state === "open" ? -8 : PINS[i].state === "conflict" ? 10 : 0),
            opacity: (i) => (PINS[i].state === "conflict" ? 0.4 : 1),
            scale: (i) => (PINS[i].state === "open" ? 1.06 : PINS[i].state === "conflict" ? 0.82 : 1),
            "--tone": 1,
            stagger: { each: 0.03, from: "random" },
            duration: 0.7,
            ease: "power3.out",
          } as any,
          0.2
        );

        // 3) counter reads up to the number of open pins, in time with the sort
        tl.to(
          counter,
          {
            v: OPEN_TOTAL,
            duration: 0.9,
            ease: "none",
            onUpdate: () => {
              if (numEl) numEl.textContent = String(Math.round(counter.v));
            },
          },
          0.35
        );
        return tl;
      };

      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const section = root.querySelector<HTMLElement>("[data-resort]");
        const stage = root.querySelector<HTMLElement>("[data-resort] .sig-map");
        if (!section || !stage) return;
        const tl = buildTimeline(stage);
        ScrollTrigger.create({
          animation: tl,
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.8,
        });
      });

      mm.add("(max-width: 767.98px) and (prefers-reduced-motion: no-preference)", () => {
        const stage = root.querySelector<HTMLElement>("[data-resort] .sig-map");
        if (!stage) return;
        const tl = buildTimeline(stage);
        tl.pause(0);
        ScrollTrigger.create({
          trigger: stage,
          start: "top 72%",
          once: true,
          onEnter: () => tl.play(),
        });
        // tap-to-replay
        const onTap = () => {
          tl.restart();
        };
        stage.addEventListener("click", onTap);
      });

      /* measurements settle after fonts + layout — refresh so the sticky
         re-sort and scrubs start from correct positions */
      ScrollTrigger.refresh();

      /* cleanup */
      return () => {
        window.clearTimeout(titleFailsafe);
        if (tiltEl && (tiltEl as any)._cw) {
          tiltEl.removeEventListener("pointermove", (tiltEl as any)._cw.onMove);
          tiltEl.removeEventListener("pointerleave", (tiltEl as any)._cw.onLeave);
        }
        split?.revert();
        split2?.revert();
      };
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="sig" ref={rootRef}>
      <style>{CSS}</style>
      <div className="sig-grain" aria-hidden="true" />

      <header className="sig-top">
        <Link to="/" className="sig-back">
          <span aria-hidden="true">←</span> Work
        </Link>
        <a className="sig-top-live" href={LIVE} target="_blank" rel="noopener noreferrer">
          <span className="sig-dot" aria-hidden="true" /> View live <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        {/* ── A · Hero (deep ink, the live product) ── */}
        <section className="sig-hero sig-ink">
          <div className="sig-aurora" aria-hidden="true" />
          <div className="sig-hero-inner">
            <p className="sig-eyebrow">Case study · Product design + front-end · 2026</p>
            <h1 className="sig-title" data-hero-title>Signal</h1>
            <p className="sig-subhead">
              A live map of tech, design, and AI events across DC, Northern Virginia, and Baltimore — that reads your
              calendar and shows which ones you can <em>actually make</em>.
            </p>
            <div className="sig-meta">
              <span>Solo project</span>
              <span className="sig-dotsep" aria-hidden="true">·</span>
              <span>Design and build</span>
              <a className="sig-btn" href={LIVE} target="_blank" rel="noopener noreferrer">
                View live <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="sig-stage-wrap">
              <div className="sig-stage" data-tilt>
                <div className="sig-stage-bar">
                  <span className="sig-dot" aria-hidden="true" />
                  <span className="sig-stage-url">jayharwani.github.io/dmv-map · live product</span>
                </div>
                <div className="sig-stage-view">
                  {framed && (
                    <iframe
                      className="sig-iframe"
                      src={LIVE}
                      title="Signal — the live product, embedded"
                      loading="lazy"
                      onLoad={() => {
                        setLoaded(true);
                        ScrollTrigger.refresh();
                      }}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                      style={{ opacity: loaded ? 1 : 0 }}
                    />
                  )}
                  {!loaded && (
                    <div className="sig-skeleton" aria-hidden="true">
                      <span>loading the live map…</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="sig-stage-note">Real, running product — pan it, filter it, load a calendar.</p>
            </div>
          </div>
        </section>

        {/* ── B · The gap (paper) ── */}
        <section className="sig-block sig-paper">
          <Reveal><p className="sig-kicker sig-kicker-ink">The gap</p></Reveal>
          <Reveal>
            <h2 className="sig-h2">SF and NYC have their startup maps. The DMV had none.</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="sig-lead">
              Baltimore especially — almost every regional list quietly drops it. I wanted one map for all of it that
              keeps itself current, on its own.
            </p>
          </Reveal>
          <div className="sig-cities">
            {CITIES.map((c, i) => (
              <Reveal key={c.name} delay={0.08 + i * 0.08}>
                <div className={`sig-city${c.has ? "" : " sig-city-live"}`}>
                  <span className="sig-city-mark" aria-hidden="true">{c.has ? "✓" : "◆"}</span>
                  <span className="sig-city-name">{c.name}</span>
                  <span className="sig-city-note">{c.note}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── C · The insight — THE signature moment (deep ink) ── */}
        <section className="sig-resort sig-ink" data-resort>
          <div className="sig-resort-sticky">
            <div className="sig-resort-head">
              <p className="sig-kicker">The insight</p>
              <h2 className="sig-kinetic" data-kinetic>
                Every map answers where. None answer what you can make.
              </h2>
              <p className="sig-resort-sub">
                A directory of pins becomes a decision. <strong>Fit</strong> reads your real week — travel and all — and
                marks each event open, tight, or a conflict. Scroll to watch it sort.
              </p>
              <div className="sig-legend">
                <span className="sig-lg" data-lg="open"><i /> Open</span>
                <span className="sig-lg" data-lg="tight"><i /> Tight</span>
                <span className="sig-lg" data-lg="conflict"><i /> Conflict</span>
              </div>
            </div>
            <FitReSort />
          </div>
        </section>

        {/* ── C.5 · how Fit works (paper, quick) ── */}
        <section className="sig-block sig-paper">
          <div className="sig-steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={0.05 + i * 0.08}>
                <div className="sig-step">
                  <span className="sig-step-n">{s.n}</span>
                  <p className="sig-step-lead">{s.lead}</p>
                  <p className="sig-step-sub">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── D · Decisions (paper) ── */}
        <section className="sig-block sig-paper">
          <Reveal>
            <h2 className="sig-h2">A few decisions I stand behind</h2>
          </Reveal>
          <div className="sig-decisions">
            {DECISIONS.map((d, i) => (
              <Reveal key={d.lead} delay={0.05 + i * 0.06} y={26}>
                <div className="sig-decision">
                  <span className="sig-decision-n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="sig-decision-lead">{d.lead}</p>
                    <p className="sig-decision-body">{d.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── E · The craft (paper) ── */}
        <section className="sig-block sig-paper">
          <Reveal><p className="sig-kicker">The craft</p></Reveal>
          <div className="sig-craft">
            <Reveal delay={0.04}>
              <Figure
                base="/signal/panel"
                alt="The redesigned panel: upcoming events grouped by week with a calm, category-coded hierarchy"
                caption="The redesigned panel — events first, calm hierarchy."
              />
            </Reveal>
            <Reveal delay={0.1}>
              <Figure
                base="/signal/event-card"
                alt="An event selected on the map: its card shows what, when, where, and how to register at a glance"
                caption="The event card — what, when, where, and how to register, at a glance."
              />
            </Reveal>
          </div>
        </section>

        {/* ── F · Close (paper, still) ── */}
        <section className="sig-block sig-close sig-paper">
          <Reveal>
            <p className="sig-lead sig-lead-close">
              Signal is live and still improving. Built solo — Claude Code did much of the typing, but the idea, the
              decisions, and the choice of which problem was worth solving were the real work.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="sig-links">
              <a className="sig-btn" href={LIVE} target="_blank" rel="noopener noreferrer">
                View live <span aria-hidden="true">↗</span>
              </a>
              <a className="sig-btn sig-btn-ghost" href={GITHUB} target="_blank" rel="noopener noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <Link className="sig-btn sig-btn-ghost" to="/">
                Back to work <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="sig-foot sig-paper">
        <span>Jay Harwani · 2026</span>
      </footer>
    </div>
  );
}

const CSS = `
.sig {
  --paper: #FBFAF6; --ink: #16181C; --ink-deep: #0E1013; --ink-soft: #4A4E55; --ink-faint: #8A8F97;
  --hairline: #E7E3DA; --accent: #1F9D55; --glow: #1F9D55; --amber: #E07B00; --conflict: #C8102E;
  --card: #FFFFFF; --measure: 68ch; --page-max: 1120px; --r: 16px;
  --shadow: 0 10px 40px rgb(22 24 28 / 0.08);
  background: var(--ink-deep); color: var(--ink);
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh; -webkit-font-smoothing: antialiased; overflow-x: hidden; position: relative;
}
.sig *, .sig *::before, .sig *::after { box-sizing: border-box; }
.sig a { color: inherit; text-decoration: none; }
.sig ::selection { background: color-mix(in srgb, var(--accent) 26%, transparent); }

/* film grain over the whole page */
.sig-grain {
  position: fixed; inset: 0; z-index: 100; pointer-events: none; opacity: 0.05; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

/* surfaces */
.sig-ink { background: var(--ink-deep); color: #F3F1EA; }
.sig-paper { background: var(--paper); color: var(--ink); }

.sig-top {
  position: sticky; top: 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between;
  padding: 13px clamp(18px, 5vw, 44px);
  background: color-mix(in srgb, var(--ink-deep) 78%, transparent);
  backdrop-filter: blur(12px); border-bottom: 1px solid rgb(255 255 255 / 0.06);
  color: #EDEBE4;
}
.sig-back { font-size: 14px; font-weight: 600; color: #C7C4BC; display: inline-flex; gap: 7px; align-items: center; }
.sig-back:hover { color: #fff; }
.sig-top-live { font-size: 13px; font-weight: 600; color: #fff; display: inline-flex; gap: 8px; align-items: center; }

/* ── hero ── */
.sig-hero { position: relative; overflow: hidden; }
.sig-hero-inner { position: relative; z-index: 2; max-width: var(--page-max); margin: 0 auto; padding: clamp(56px, 11vw, 128px) clamp(18px, 5vw, 44px) clamp(64px, 9vw, 104px); }
.sig-aurora {
  position: absolute; inset: -20% -10% auto -10%; height: 90%; z-index: 1; pointer-events: none; opacity: 0.55;
  background:
    radial-gradient(45% 55% at 22% 18%, color-mix(in srgb, var(--accent) 26%, transparent), transparent 70%),
    radial-gradient(50% 60% at 82% 8%, rgba(122,150,168,0.28), transparent 72%),
    radial-gradient(40% 50% at 60% 40%, rgba(200,190,170,0.12), transparent 70%);
  filter: blur(20px); animation: sig-aurora 22s ease-in-out infinite alternate;
}
@keyframes sig-aurora { from { transform: translate3d(-2%, -1%, 0) scale(1); } to { transform: translate3d(3%, 2%, 0) scale(1.08); } }

.sig-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #9A968C; margin: 0; }
.sig-title {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif; font-weight: 600;
  font-size: clamp(4.2rem, 13vw, 8rem); line-height: 0.9; letter-spacing: -0.03em;
  margin: 16px 0 0; color: #fff; overflow: hidden;
}
.sig-subhead {
  font-size: clamp(1.2rem, 2.6vw, 1.7rem); line-height: 1.42; font-weight: 500; color: #D7D4CB;
  margin: 26px 0 0; max-width: 26ch;
}
.sig-subhead em { font-style: normal; color: #fff; box-shadow: inset 0 -0.5em 0 color-mix(in srgb, var(--accent) 40%, transparent); }
.sig-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 14px; margin: 30px 0 0; font-size: 14px; font-weight: 500; color: #ADA99F; font-variant-numeric: tabular-nums; }
.sig-dotsep { color: #6E6A61; }

.sig-btn {
  display: inline-flex; align-items: center; gap: 7px; font-size: 14px; font-weight: 600;
  background: var(--accent); color: #06130B; padding: 11px 18px; border-radius: 11px;
  box-shadow: 0 8px 28px -8px color-mix(in srgb, var(--accent) 75%, transparent);
  transition: transform .18s ease, box-shadow .22s ease;
}
.sig-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -10px color-mix(in srgb, var(--accent) 75%, transparent); }
.sig-btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--hairline); box-shadow: none; }
.sig-btn-ghost:hover { border-color: var(--ink-faint); }

.sig-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--accent); flex-shrink: 0; box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent); animation: sig-pulse 2.6s ease-in-out infinite; }
@keyframes sig-pulse { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent); } 50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 0%, transparent); } }

.sig-stage-wrap { margin-top: clamp(36px, 6vw, 60px); }
.sig-stage {
  border-radius: var(--r); overflow: hidden; background: #14161b;
  border: 1px solid rgb(255 255 255 / 0.08); transform-style: preserve-3d; will-change: transform;
  box-shadow: 0 40px 90px -40px rgba(0,0,0,0.7), 0 0 0 1px rgb(255 255 255 / 0.02);
}
.sig-stage-bar { display: flex; align-items: center; gap: 9px; padding: 11px 16px; border-bottom: 1px solid rgb(255 255 255 / 0.07); background: #0f1116; }
.sig-stage-url { font-size: 12px; font-weight: 500; color: #8C8880; font-variant-numeric: tabular-nums; }
.sig-stage-view { position: relative; height: clamp(420px, 62vh, 620px); background: #eceae3; }
.sig-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; transition: opacity .5s ease; }
.sig-skeleton { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(180deg, #14161b, #0f1116); }
.sig-skeleton span { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #6E6A61; }
.sig-stage-note { font-size: 13px; color: #8C8880; margin: 15px 2px 0; }

/* ── generic blocks ── */
.sig-block { max-width: var(--page-max); margin: 0 auto; padding: clamp(64px, 10vw, 120px) clamp(18px, 5vw, 44px); }
.sig-close { padding-bottom: clamp(80px, 12vw, 128px); }
.sig-kicker { font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); margin: 0 0 18px; }
.sig-kicker-ink { color: var(--ink-faint); }
.sig-h2 { font-size: clamp(1.7rem, 3.6vw, 2.5rem); line-height: 1.15; font-weight: 600; letter-spacing: -0.02em; margin: 0; color: inherit; max-width: 22ch; }
.sig-lead { font-size: clamp(1.08rem, 2.1vw, 1.3rem); line-height: 1.55; color: var(--ink-soft); margin: 18px 0 0; max-width: 52ch; }
.sig-lead strong { color: var(--accent); font-weight: 700; }
.sig-lead-close { max-width: 56ch; font-size: clamp(1.15rem, 2.2vw, 1.4rem); color: var(--ink); }

/* cities */
.sig-cities { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 40px; }
.sig-city { background: var(--card); border: 1px solid var(--hairline); border-radius: var(--r); padding: 22px 20px; box-shadow: 0 6px 24px rgb(22 24 28 / 0.05); }
.sig-city-mark { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 9px; background: #EEF4F0; color: var(--accent); font-size: 14px; font-weight: 700; }
.sig-city-name { display: block; margin-top: 16px; font-size: 18px; font-weight: 600; color: var(--ink); }
.sig-city-note { display: block; margin-top: 4px; font-size: 14px; color: var(--ink-faint); }
.sig-city-live { border-color: color-mix(in srgb, var(--accent) 45%, var(--hairline)); background: linear-gradient(180deg, #fff, #F4FAF6); }
.sig-city-live .sig-city-mark { background: var(--accent); color: #fff; }
.sig-city-live .sig-city-note { color: var(--accent); font-weight: 600; }

/* ══ the re-sort ══ */
.sig-resort { position: relative; }
/* the section is tall; the stage sticks while pins resolve */
@media (min-width: 768px) { .sig-resort { height: 320vh; } }
.sig-resort-sticky {
  position: sticky; top: 0; min-height: 100vh; display: flex; flex-direction: column; justify-content: center;
  gap: clamp(20px, 3vw, 34px); padding: clamp(56px, 8vh, 96px) clamp(18px, 5vw, 44px);
  max-width: var(--page-max); margin: 0 auto; overflow: hidden;
}
.sig-resort-head { max-width: 30ch; z-index: 3; }
.sig-kinetic {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif; font-weight: 600;
  font-size: clamp(2.1rem, 5.4vw, 4rem); line-height: 1.02; letter-spacing: -0.025em; color: #fff; margin: 14px 0 0;
}
.sig-resort-sub { font-size: clamp(1rem, 1.9vw, 1.18rem); line-height: 1.55; color: #C3C0B7; margin: 18px 0 0; max-width: 44ch; }
.sig-resort-sub strong { color: var(--accent); font-weight: 700; }
.sig-legend { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 18px; font-size: 13px; font-weight: 600; color: #B7B4AB; }
.sig-lg { display: inline-flex; align-items: center; gap: 7px; }
.sig-lg i { width: 10px; height: 10px; border-radius: 3px; display: inline-block; }
.sig-lg[data-lg="open"] i { background: var(--glow); box-shadow: 0 0 10px var(--glow); }
.sig-lg[data-lg="tight"] i { background: var(--amber); box-shadow: 0 0 10px color-mix(in srgb, var(--amber) 70%, transparent); }
.sig-lg[data-lg="conflict"] i { background: #6b6f76; }

/* the map stage */
.sig-map {
  position: relative; width: 100%; flex: 1; min-height: min(56vh, 520px); border-radius: 20px;
  background: radial-gradient(120% 90% at 50% 0%, #191c22, #0b0d10 80%);
  border: 1px solid rgb(255 255 255 / 0.07); overflow: hidden; z-index: 2;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 0.05), 0 40px 90px -50px rgba(0,0,0,0.8);
}
.sig-map-grid { position: absolute; inset: 0; width: 100%; height: 100%; }
.sig-map-grid path { stroke: rgb(255 255 255 / 0.05); stroke-width: 0.4; fill: none; }
.sig-map-grid .sig-map-river { stroke: rgb(122 150 168 / 0.18); stroke-width: 2.2; }

.sig-ghost {
  position: absolute; transform: translate(-50%, -50%); height: 26px; border-radius: 7px;
  background: rgb(255 255 255 / 0.06); border: 1px solid rgb(255 255 255 / 0.1);
  display: flex; align-items: center; justify-content: center;
  font-size: 10px; font-weight: 600; letter-spacing: 0.02em; color: #9A968C; white-space: nowrap;
}

/* pins — default render is the FINAL fit state (tone = 1) */
.sig-pin { position: absolute; transform: translate(-50%, -50%); --tone: 1; }
.sig-pin-tile {
  position: relative; z-index: 2; display: grid; place-items: center; width: 30px; height: 30px; border-radius: 9px;
  background: #262a30; border: 1px solid rgb(255 255 255 / 0.14); color: #EDEBE4;
  box-shadow: 0 6px 14px -6px rgba(0,0,0,0.7);
}
.sig-pin-day { font-size: 12px; font-weight: 700; font-variant-numeric: tabular-nums; }
.sig-pin-stem { position: absolute; left: 50%; top: 100%; width: 2px; height: 10px; transform: translateX(-50%); background: rgb(255 255 255 / 0.22); }
.sig-pin-glow {
  position: absolute; left: 50%; top: 50%; width: 54px; height: 54px; transform: translate(-50%, -50%);
  border-radius: 50%; opacity: calc(var(--tone) * 1); transition: opacity .2s linear; pointer-events: none;
}
.sig-pin[data-state="open"] .sig-pin-glow { background: radial-gradient(closest-side, color-mix(in srgb, var(--glow) 70%, transparent), transparent); opacity: calc(var(--tone) * 0.9); }
.sig-pin[data-state="open"] .sig-pin-tile { border-color: color-mix(in srgb, var(--glow) 55%, rgb(255 255 255 / 0.14)); box-shadow: 0 8px 20px -6px color-mix(in srgb, var(--glow) 50%, transparent); }
.sig-pin[data-state="tight"] .sig-pin-glow { background: radial-gradient(closest-side, color-mix(in srgb, var(--amber) 60%, transparent), transparent); opacity: calc(var(--tone) * 0.75); }
.sig-pin[data-state="conflict"] .sig-pin-glow { opacity: 0; }
.sig-pin[data-state="conflict"] .sig-pin-tile { background: #191c20; color: #6E6A61; }
.sig-pin[data-state="conflict"] { z-index: 0; }
.sig-pin[data-state="open"] { z-index: 5; }

.sig-counter {
  position: absolute; right: clamp(16px, 3vw, 34px); bottom: clamp(16px, 3vw, 30px); z-index: 6; text-align: right;
  background: color-mix(in srgb, var(--ink-deep) 55%, transparent); backdrop-filter: blur(6px);
  border: 1px solid rgb(255 255 255 / 0.08); border-radius: 14px; padding: 12px 18px;
}
.sig-counter-num { display: block; font-family: 'Archivo Expanded','Archivo',sans-serif; font-weight: 600; font-size: clamp(2.6rem, 6vw, 4.2rem); line-height: 0.9; color: #fff; font-variant-numeric: tabular-nums; }
.sig-counter-label { display: block; margin-top: 6px; font-size: 12px; font-weight: 600; letter-spacing: 0.04em; color: var(--glow); text-transform: uppercase; }

/* steps */
.sig-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.sig-step { position: relative; background: var(--card); border: 1px solid var(--hairline); border-radius: var(--r); padding: 24px 22px; box-shadow: 0 6px 24px rgb(22 24 28 / 0.04); }
.sig-step-n { font-family: 'Archivo Expanded','Archivo',sans-serif; font-size: 14px; font-weight: 600; color: var(--accent); font-variant-numeric: tabular-nums; }
.sig-step-lead { font-size: 17px; font-weight: 600; color: var(--ink); margin: 14px 0 0; }
.sig-step-sub { font-size: 14.5px; line-height: 1.5; color: var(--ink-soft); margin: 6px 0 0; }

/* decisions */
.sig-decisions { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-top: 40px; }
.sig-decision { display: flex; gap: 18px; background: var(--card); border: 1px solid var(--hairline); border-radius: var(--r); padding: 24px; box-shadow: 0 6px 24px rgb(22 24 28 / 0.04); }
.sig-decision-n { font-family: 'Archivo Expanded','Archivo',sans-serif; font-size: 16px; font-weight: 600; color: var(--accent); font-variant-numeric: tabular-nums; flex-shrink: 0; padding-top: 2px; }
.sig-decision-lead { font-size: 17px; font-weight: 600; color: var(--ink); margin: 0; line-height: 1.35; }
.sig-decision-body { font-size: 15px; line-height: 1.55; color: var(--ink-soft); margin: 8px 0 0; }

/* craft */
.sig-fig { margin: 0; }
.sig-shot { display: block; width: 100%; height: auto; border-radius: var(--r); border: 1px solid var(--hairline); box-shadow: var(--shadow); background: var(--card); }
.sig-shot-live { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 280px; font-size: 15px; font-weight: 600; color: var(--ink-soft); border-style: dashed; }
.sig-shot-live:hover { color: var(--ink); border-color: var(--ink-faint); }
.sig-cap { font-size: 14px; color: var(--ink-faint); margin: 14px 2px 0; line-height: 1.5; }
.sig-craft { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(18px, 3vw, 30px); margin-top: 30px; align-items: start; }

.sig-links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }
.sig-foot { padding: 30px clamp(18px, 5vw, 44px) 44px; border-top: 1px solid var(--hairline); font-size: 13px; color: var(--ink-faint); font-variant-numeric: tabular-nums; }
.sig-foot span { max-width: var(--page-max); margin: 0 auto; display: block; }

@media (max-width: 767.98px) {
  .sig-cities, .sig-steps, .sig-decisions, .sig-craft { grid-template-columns: 1fr; }
  .sig-resort-sticky { position: relative; top: auto; min-height: 0; padding-top: clamp(56px, 10vw, 90px); padding-bottom: clamp(40px, 8vw, 70px); }
  .sig-map { min-height: 78vh; margin-top: 22px; cursor: pointer; }
  .sig-subhead { max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  .sig-dot, .sig-aurora { animation: none; }
  .sig * { transition: none !important; }
}
`;
