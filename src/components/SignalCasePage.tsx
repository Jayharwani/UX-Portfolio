import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Link } from "react-router";

/* ──────────────────────────────────────────────────────────────────────────
   Signal — case study (per CASESTUDY.md).
   A small, editorial, warm-paper page. The hero embeds the REAL live product
   in an iframe — no mockup, no fabrication. Six blocks, restrained motion,
   one accent used almost never. The page is meant to feel like the product:
   fast, clear, considered.
   ────────────────────────────────────────────────────────────────────────── */

const LIVE = "https://jayharwani.github.io/dmv-map/";
const GITHUB = "https://github.com/Jayharwani/dmv-map";
const EASE = [0.16, 1, 0.3, 1] as const;

/* Flip to true the moment the three real exports land in /public/signal/
   (fit.webp, panel.webp, event-card.webp). Until then the craft figures show
   an honest "see it live" card — never a broken image or a fake mockup.
   Deterministic on purpose: SPA hosts return 200 for missing files, so an
   onError fallback can't be relied on. */
const HAS_CRAFT_SHOTS = false;

/* single subtle fade-and-rise on enter, once. Reduced motion: appears at once. */
function Reveal({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.25, ease: EASE, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/* a curated craft shot. If the real export isn't in /public/signal yet, we
   never show a broken box or a fake mockup — we fall back to an honest card
   that points at the live product (which the hero already proves is real). */
function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  const [ok, setOk] = useState(true);
  return (
    <figure className="sig-fig">
      {HAS_CRAFT_SHOTS && ok ? (
        <img src={src} alt={alt} loading="lazy" className="sig-shot" onError={() => setOk(false)} />
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

export function SignalCasePage() {
  const reduce = useReducedMotion();
  const [framed, setFramed] = useState(false); // mount the heavy iframe just after paint
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Signal — Product design case study";
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    // defer the heavy live embed briefly so the page paints instantly first,
    // then mount reliably (a plain timer fires even in a backgrounded tab,
    // unlike requestIdleCallback which a hidden tab can starve indefinitely)
    const id = window.setTimeout(() => setFramed(true), 350);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="sig">
      <style>{CSS}</style>

      {/* slim top bar — warm, quiet, always a way back and a way in */}
      <header className="sig-top">
        <Link to="/" className="sig-back">
          <span aria-hidden="true">←</span> Work
        </Link>
        <a className="sig-top-live" href={LIVE} target="_blank" rel="noopener noreferrer">
          View live <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        {/* ── Block A · Hero (the 10-second zone) ── */}
        <section className="sig-hero">
          <Reveal>
            <p className="sig-eyebrow">Case study · Product design + front-end · 2026</p>
          </Reveal>
          <Reveal delay={0.04}>
            <h1 className="sig-title">Signal</h1>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="sig-subhead">
              A live map of tech, design, and AI events across DC, Northern Virginia, and Baltimore — that reads your
              calendar and shows which ones you can actually make.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="sig-meta">
              <span>Solo project</span>
              <span className="sig-dotsep" aria-hidden="true">·</span>
              <span>Design and build</span>
              <span className="sig-dotsep" aria-hidden="true">·</span>
              <a className="sig-btn" href={LIVE} target="_blank" rel="noopener noreferrer">
                View live <span aria-hidden="true">↗</span>
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.16} className="sig-stage-wrap">
            <div className="sig-stage">
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
                    onLoad={() => setLoaded(true)}
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
            <p className="sig-stage-note">Real, running product. Pan it, filter it, load a calendar — it's the actual app.</p>
          </Reveal>
        </section>

        {/* ── Block B · The gap ── */}
        <section className="sig-block">
          <Reveal>
            <h2 className="sig-h2">SF and NYC have their startup maps. The DMV had none.</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="sig-body">
              San Francisco has a startup map. New York has one too. The DMV — DC, Northern Virginia, and Baltimore —
              had nothing like it, despite how much tech, design, and AI happens here. Baltimore especially: almost
              every regional event list quietly leaves it out. I wanted one map that covered all of it and kept itself
              current, on its own.
            </p>
          </Reveal>
        </section>

        {/* ── Block C · The insight (the money block) ── */}
        <section className="sig-block sig-block-insight">
          <Reveal>
            <p className="sig-kicker">The insight</p>
          </Reveal>
          <Reveal delay={0.04}>
            <h2 className="sig-h2">Every event map answers "where." None answer "what can I make."</h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="sig-body">
              A map of pins is a directory. The real question a busy person has is not where events are — it is which
              ones they can realistically attend. So I built Fit. You connect your own calendar, it never leaves your
              device, and the map re-sorts around your real life. It accounts for the actual travel time between your
              existing commitments and each event, then marks each one open, tight, or a conflict. The map stops being
              a list and becomes a decision.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="sig-fig-wide">
            <Figure
              src="/signal/fit.webp"
              alt="Signal's map with Fit turned on: each event marked open, tight, or a conflict against the visitor's real calendar"
              caption="Fit re-sorts the map around your calendar — open, tight, or conflict."
            />
          </Reveal>
        </section>

        {/* ── Block D · Decisions ── */}
        <section className="sig-block">
          <Reveal>
            <h2 className="sig-h2">A few decisions I stand behind</h2>
          </Reveal>
          <div className="sig-decisions">
            {DECISIONS.map((d, i) => (
              <Reveal key={d.lead} delay={0.05 + i * 0.04}>
                <div className="sig-decision">
                  <p className="sig-decision-lead">{d.lead}</p>
                  <p className="sig-decision-body">{d.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Block E · The craft ── */}
        <section className="sig-block">
          <Reveal>
            <p className="sig-kicker">The craft</p>
          </Reveal>
          <div className="sig-craft">
            <Reveal delay={0.04}>
              <Figure
                src="/signal/panel.webp"
                alt="The redesigned panel: upcoming events grouped by time, calm hierarchy, setup tucked behind one button"
                caption="The redesigned panel — events first, calm hierarchy."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <Figure
                src="/signal/event-card.webp"
                alt="An event card showing what, when, where, and how to register at a glance"
                caption="The event card — what, when, where, and how to register, at a glance."
              />
            </Reveal>
          </div>
        </section>

        {/* ── Block F · Close and links ── */}
        <section className="sig-block sig-close">
          <Reveal>
            <p className="sig-body">
              Signal is live and still improving. I designed and built it solo, using Claude Code for much of the
              implementation — but the idea, the design decisions, and the choice of which problem was worth solving
              were the real work.
            </p>
          </Reveal>
          <Reveal delay={0.06}>
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

      <footer className="sig-foot">
        <span>Jay Harwani · 2026</span>
      </footer>
    </div>
  );
}

const DECISIONS = [
  {
    lead: "Commute reality, not calendar math.",
    body: "Graying out overlapping events is easy. The harder and more honest question is whether you can physically get there in time. Fit estimates real travel between your commitments — the thing that actually decides whether you make it.",
  },
  {
    lead: "Privacy as a property, not a promise.",
    body: "Your calendar is read in your browser and never uploaded. No account, no server, nothing stored. I built it so that is literally true, then said so plainly in the interface.",
  },
  {
    lead: "Events first, tools second.",
    body: "My first build buried the events behind the calendar controls. I inverted it — events became the permanent content, the setup moved behind one button. The feature did not change; the hierarchy did.",
  },
  {
    lead: "Live, and free to run.",
    body: "A scheduled pipeline refreshes the data every few hours by itself, at zero recurring cost.",
  },
];

const CSS = `
.sig {
  --paper: #FBFAF6; --ink: #16181C; --ink-soft: #4A4E55; --ink-faint: #8A8F97;
  --hairline: #E7E3DA; --accent: #1F9D55; --card: #FFFFFF;
  --measure: 68ch; --page-max: 1080px; --r: 14px; --shadow: 0 10px 40px rgb(22 24 28 / 0.08);
  background: var(--paper); color: var(--ink);
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh; min-height: 100dvh;
  -webkit-font-smoothing: antialiased; font-feature-settings: "tnum" 0;
  overflow-x: hidden;
}
.sig *, .sig *::before, .sig *::after { box-sizing: border-box; }
.sig a { color: inherit; text-decoration: none; }
.sig ::selection { background: color-mix(in srgb, var(--accent) 22%, transparent); }

/* top bar */
.sig-top {
  position: sticky; top: 0; z-index: 20;
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px clamp(20px, 5vw, 44px);
  background: color-mix(in srgb, var(--paper) 86%, transparent);
  backdrop-filter: blur(10px); border-bottom: 1px solid var(--hairline);
}
.sig-back { font-size: 14px; font-weight: 600; color: var(--ink-soft); display: inline-flex; gap: 7px; align-items: center; }
.sig-back:hover { color: var(--ink); }
.sig-top-live { font-size: 13px; font-weight: 600; color: var(--accent); }

/* layout rhythm */
.sig main { display: block; }
.sig-hero { max-width: var(--page-max); margin: 0 auto; padding: clamp(48px, 9vw, 96px) clamp(20px, 5vw, 44px) clamp(56px, 8vw, 88px); }
.sig-block { max-width: var(--measure); margin: 0 auto; padding: clamp(56px, 9vw, 96px) clamp(20px, 5vw, 44px) 0; }
.sig-block-insight { max-width: var(--page-max); }
.sig-close { padding-bottom: clamp(72px, 12vw, 120px); }

/* type */
.sig-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); margin: 0; }
.sig-kicker { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin: 0 0 14px; }
.sig-title {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif; font-weight: 600;
  font-size: clamp(3.6rem, 9vw, 5.5rem); line-height: 0.98; letter-spacing: -0.02em;
  margin: 14px 0 0; color: var(--ink);
}
.sig-subhead { font-size: clamp(1.15rem, 2.4vw, 1.5rem); line-height: 1.5; font-weight: 500; color: var(--ink-soft); margin: 22px 0 0; max-width: 40ch; }
.sig-h2 { font-size: clamp(1.4rem, 3vw, 1.9rem); line-height: 1.24; font-weight: 600; letter-spacing: -0.01em; margin: 0; color: var(--ink); max-width: 22ch; }
.sig-body { font-size: 18px; line-height: 1.65; color: var(--ink-soft); margin: 18px 0 0; }
.sig-block-insight .sig-h2 { max-width: 26ch; }
.sig-block-insight .sig-body { max-width: var(--measure); }

/* meta row */
.sig-meta { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; margin: 30px 0 0; font-size: 14px; font-weight: 500; color: var(--ink-soft); font-variant-numeric: tabular-nums; }
.sig-dotsep { color: var(--ink-faint); }
.sig-btn {
  display: inline-flex; align-items: center; gap: 7px; font-size: 14px; font-weight: 600;
  background: var(--accent); color: #fff; padding: 11px 18px; border-radius: 10px;
  border: 1px solid color-mix(in srgb, var(--accent) 70%, #000 8%);
  box-shadow: 0 6px 18px -8px color-mix(in srgb, var(--accent) 70%, transparent);
  transition: transform .16s ease, box-shadow .2s ease;
}
.sig-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 24px -10px color-mix(in srgb, var(--accent) 70%, transparent); }
.sig-btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--hairline); box-shadow: none; }
.sig-btn-ghost:hover { border-color: var(--ink-faint); box-shadow: none; }

/* live dot */
.sig-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--accent); box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 60%, transparent); animation: sig-pulse 2.6s ease-in-out infinite; flex-shrink: 0; }
@keyframes sig-pulse { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent); } 50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent) 0%, transparent); } }

/* the live product stage */
.sig-stage-wrap { margin-top: clamp(34px, 6vw, 54px); }
.sig-stage {
  border-radius: var(--r); overflow: hidden; background: var(--card);
  border: 1px solid var(--hairline); box-shadow: var(--shadow);
}
.sig-stage-bar { display: flex; align-items: center; gap: 9px; padding: 11px 16px; border-bottom: 1px solid var(--hairline); background: color-mix(in srgb, var(--paper) 60%, var(--card)); }
.sig-stage-url { font-size: 12px; font-weight: 500; color: var(--ink-faint); font-variant-numeric: tabular-nums; }
.sig-stage-view { position: relative; height: clamp(440px, 66vh, 640px); background: #eceae3; }
.sig-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; transition: opacity .5s ease; }
.sig-skeleton { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(180deg, #f1efe8, #e9e6dd); }
.sig-skeleton span { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); }
.sig-stage-note { font-size: 13px; color: var(--ink-faint); margin: 14px 2px 0; }

/* figures / craft shots */
.sig-fig { margin: 0; }
.sig-fig-wide { margin-top: clamp(26px, 4vw, 40px); }
.sig-shot { display: block; width: 100%; height: auto; border-radius: var(--r); border: 1px solid var(--hairline); box-shadow: var(--shadow); background: var(--card); }
.sig-shot-live {
  display: flex; align-items: center; justify-content: center; gap: 10px;
  min-height: 260px; font-size: 15px; font-weight: 600; color: var(--ink-soft);
  border-style: dashed;
}
.sig-shot-live:hover { color: var(--ink); border-color: var(--ink-faint); }
.sig-cap { font-size: 14px; color: var(--ink-faint); margin: 12px 2px 0; line-height: 1.5; }
.sig-craft { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(18px, 3vw, 28px); margin-top: 22px; }

/* decisions */
.sig-decisions { display: flex; flex-direction: column; gap: 26px; margin-top: 28px; }
.sig-decision { padding-top: 24px; border-top: 1px solid var(--hairline); }
.sig-decision:first-child { border-top: 0; padding-top: 0; }
.sig-decision-lead { font-size: 18px; font-weight: 600; color: var(--ink); margin: 0; }
.sig-decision-body { font-size: 16.5px; line-height: 1.62; color: var(--ink-soft); margin: 8px 0 0; }

/* close + footer */
.sig-links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.sig-foot { max-width: var(--page-max); margin: 0 auto; padding: 28px clamp(20px, 5vw, 44px) 40px; border-top: 1px solid var(--hairline); font-size: 13px; color: var(--ink-faint); font-variant-numeric: tabular-nums; }

@media (max-width: 640px) {
  .sig-craft { grid-template-columns: 1fr; }
  .sig-subhead { max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  .sig-dot { animation: none; }
  .sig * { transition: none !important; }
}
`;
