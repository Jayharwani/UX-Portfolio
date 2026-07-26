import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Link } from "react-router";

/* ──────────────────────────────────────────────────────────────────────────
   Signal — case study (per CASESTUDY.md, tightened).
   Warm-paper, editorial, fast. The hero embeds the REAL live product. Prose
   is cut to the bone; the heavy paragraphs became scannable blocks with
   dimensional SVG/CSS illustrations and restrained motion. No WebGL — the
   page stays instant, the way the product feels.
   ────────────────────────────────────────────────────────────────────────── */

const LIVE = "https://jayharwani.github.io/dmv-map/";
const GITHUB = "https://github.com/Jayharwani/dmv-map";
const EASE = [0.16, 1, 0.3, 1] as const;

/* Real 2× exports live in /public/signal/. If a file is missing (or a SPA host
   returns index.html for it), the figure falls back to an honest "see it live"
   card — never a broken image, never a fake mockup. */
const HAS_CRAFT_SHOTS = true;

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

function Figure({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  /* Show the honest fallback by default; upgrade to the real screenshot only
     once it truly decodes (naturalWidth > 0). A missing file — whether the
     host 404s, hangs, or returns index.html — simply never upgrades, so the
     figure is never a broken box. Drop the real .webp in and it appears. */
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!HAS_CRAFT_SHOTS) return;
    let alive = true;
    const img = new Image();
    img.onload = () => {
      if (alive && img.naturalWidth > 0) setReady(true);
    };
    img.src = src;
    return () => {
      alive = false;
    };
  }, [src]);

  return (
    <figure className="sig-fig">
      {ready ? (
        <img src={src} alt={alt} loading="lazy" className="sig-shot" />
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

/* ── small dimensional illustrations (inline SVG + CSS depth) ── */
function IlloCalendar() {
  return (
    <div className="sig-illo" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="46" height="46">
        <rect x="12" y="16" width="40" height="36" rx="6" fill="#fff" stroke="#DAD6CC" />
        <rect x="12" y="16" width="40" height="10" rx="6" fill="#EDE9DF" />
        <line x1="24" y1="12" x2="24" y2="20" stroke="#B7B2A6" strokeWidth="2.4" strokeLinecap="round" />
        <line x1="40" y1="12" x2="40" y2="20" stroke="#B7B2A6" strokeWidth="2.4" strokeLinecap="round" />
        <rect x="19" y="31" width="9" height="7" rx="1.6" fill="#E3EDE7" />
        <rect x="31" y="31" width="9" height="7" rx="1.6" fill="#1F9D55" />
        <rect x="43" y="31" width="4" height="7" rx="1.6" fill="#E3EDE7" />
        <rect x="19" y="41" width="9" height="7" rx="1.6" fill="#E3EDE7" />
        <rect x="31" y="41" width="16" height="7" rx="1.6" fill="#E3EDE7" />
        {/* lock badge */}
        <g transform="translate(40 40)">
          <circle cx="8" cy="8" r="10" fill="#16181C" />
          <rect x="4" y="7.5" width="8" height="6.5" rx="1.5" fill="#FBFAF6" />
          <path d="M5.5 7.5V6a2.5 2.5 0 0 1 5 0v1.5" stroke="#FBFAF6" strokeWidth="1.4" fill="none" />
        </g>
      </svg>
    </div>
  );
}
function IlloRoute() {
  return (
    <div className="sig-illo" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="46" height="46">
        <path className="sig-route" d="M16 44 C 26 44 24 24 34 24 S 46 40 50 20" fill="none" stroke="#1F9D55" strokeWidth="2.4" strokeLinecap="round" strokeDasharray="4 5" />
        <circle cx="16" cy="44" r="5" fill="#16181C" />
        <circle cx="16" cy="44" r="2" fill="#fff" />
        <g transform="translate(44 12)">
          <path d="M6 0C2.7 0 0 2.7 0 6c0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6Z" fill="#1F9D55" />
          <circle cx="6" cy="6" r="2.3" fill="#fff" />
        </g>
      </svg>
    </div>
  );
}
function IlloVerdict() {
  return (
    <div className="sig-illo" aria-hidden="true">
      <svg viewBox="0 0 64 64" width="46" height="46">
        <rect className="sig-verdict" x="20" y="16" width="24" height="24" rx="7" fill="#16181C" />
        <circle cx="32" cy="28" r="4.5" fill="#fff" className="sig-verdict-dot" />
        <rect x="31" y="40" width="2" height="8" rx="1" fill="#16181C" />
      </svg>
    </div>
  );
}

const STEPS = [
  { Illo: IlloCalendar, lead: "Connect your calendar", sub: "Read on your device. Never uploaded." },
  { Illo: IlloRoute, lead: "It weighs real travel", sub: "Between your existing commitments." },
  { Illo: IlloVerdict, lead: "Every event gets a verdict", sub: "Open, tight, or a conflict." },
];

const LEGEND = [
  { l: "Open", c: "#1F9D55", d: "you can make it" },
  { l: "Tight", c: "#E0A100", d: "cutting it close" },
  { l: "Conflict", c: "#C8102E", d: "you can't" },
];

const CITIES = [
  { name: "San Francisco", note: "has a startup map", has: true },
  { name: "New York", note: "has one too", has: true },
  { name: "The DMV", note: "had none — now live", has: false },
];

const DECISIONS = [
  { lead: "Commute reality, not calendar math.", body: "Graying out overlaps is easy. Fit estimates the real travel that actually decides whether you make it." },
  { lead: "Privacy as a property, not a promise.", body: "Your calendar is read in the browser and never uploaded. No account, no server, nothing stored." },
  { lead: "Events first, tools second.", body: "My first build buried events behind the calendar controls. I inverted it — same feature, different hierarchy." },
  { lead: "Live, and free to run.", body: "A scheduled pipeline refreshes the data every few hours by itself, at zero recurring cost." },
];

export function SignalCasePage() {
  const [framed, setFramed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const prev = document.title;
    document.title = "Signal — Product design case study";
    return () => {
      document.title = prev;
    };
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => setFramed(true), 350);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="sig">
      <style>{CSS}</style>

      <header className="sig-top">
        <Link to="/" className="sig-back">
          <span aria-hidden="true">←</span> Work
        </Link>
        <a className="sig-top-live" href={LIVE} target="_blank" rel="noopener noreferrer">
          View live <span aria-hidden="true">↗</span>
        </a>
      </header>

      <main>
        {/* ── A · Hero ── */}
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
            <p className="sig-stage-note">Real, running product — pan it, filter it, load a calendar.</p>
          </Reveal>
        </section>

        {/* ── B · The gap ── */}
        <section className="sig-block sig-wide">
          <Reveal>
            <p className="sig-kicker sig-kicker-ink">The gap</p>
          </Reveal>
          <Reveal delay={0.04}>
            <h2 className="sig-h2">SF and NYC have their startup maps. The DMV had none.</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="sig-lead">Baltimore especially — almost every regional list quietly drops it. I wanted one map for all of it that keeps itself current.</p>
          </Reveal>
          <div className="sig-cities">
            {CITIES.map((c, i) => (
              <Reveal key={c.name} delay={0.08 + i * 0.06}>
                <div className={`sig-city${c.has ? "" : " sig-city-live"}`}>
                  <span className="sig-city-mark" aria-hidden="true">{c.has ? "✓" : "◆"}</span>
                  <span className="sig-city-name">{c.name}</span>
                  <span className="sig-city-note">{c.note}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── C · The insight (money block) ── */}
        <section className="sig-block sig-wide sig-insight">
          <Reveal>
            <p className="sig-kicker">The insight</p>
          </Reveal>
          <Reveal delay={0.04}>
            <h2 className="sig-h2 sig-h2-big">Every event map answers "where." None answer "what can I make."</h2>
          </Reveal>
          <Reveal delay={0.06}>
            <p className="sig-lead">A map of pins is a directory. <strong>Fit</strong> turns it into a decision.</p>
          </Reveal>

          <div className="sig-steps">
            {STEPS.map((s, i) => (
              <Reveal key={s.lead} delay={0.08 + i * 0.06}>
                <div className="sig-step">
                  <span className="sig-step-n">{i + 1}</span>
                  <s.Illo />
                  <p className="sig-step-lead">{s.lead}</p>
                  <p className="sig-step-sub">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.12} className="sig-legend-wrap">
            <div className="sig-legend">
              {LEGEND.map((v, i) => (
                <span key={v.l} className="sig-chip" style={{ ["--c" as string]: v.c, animationDelay: `${i * 0.6}s` }}>
                  <span className="sig-chip-dot" />
                  <b>{v.l}</b>
                  <em>{v.d}</em>
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="sig-fig-wide">
            <Figure
              src="/signal/fit.webp"
              alt="Signal's Fit sheet: connect a calendar that stays on your device, or add busy time by hand, and pick how you get around"
              caption="Connect a calendar — it stays on your device — and Fit re-sorts the map around your real week."
            />
          </Reveal>
        </section>

        {/* ── D · Decisions ── */}
        <section className="sig-block sig-wide">
          <Reveal>
            <h2 className="sig-h2">A few decisions I stand behind</h2>
          </Reveal>
          <div className="sig-decisions">
            {DECISIONS.map((d, i) => (
              <Reveal key={d.lead} delay={0.05 + i * 0.05}>
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

        {/* ── E · The craft ── */}
        <section className="sig-block sig-wide">
          <Reveal>
            <p className="sig-kicker">The craft</p>
          </Reveal>
          <div className="sig-craft">
            <Reveal delay={0.04}>
              <Figure
                src="/signal/panel.webp"
                alt="The redesigned panel: upcoming events grouped by week with a calm, category-coded hierarchy"
                caption="The redesigned panel — events first, calm hierarchy."
              />
            </Reveal>
            <Reveal delay={0.08}>
              <Figure
                src="/signal/event-card.webp"
                alt="An event selected on the map: its card shows what, when, where, and how to register at a glance"
                caption="The event card — what, when, where, and how to register, at a glance."
              />
            </Reveal>
          </div>
        </section>

        {/* ── F · Close ── */}
        <section className="sig-block sig-close">
          <Reveal>
            <p className="sig-lead sig-lead-close">
              Signal is live and still improving. Built solo — Claude Code did much of the typing, but the idea, the
              decisions, and the choice of which problem was worth solving were the real work.
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

const CSS = `
.sig {
  --paper: #FBFAF6; --ink: #16181C; --ink-soft: #4A4E55; --ink-faint: #8A8F97;
  --hairline: #E7E3DA; --accent: #1F9D55; --card: #FFFFFF;
  --measure: 68ch; --page-max: 1080px; --r: 14px; --shadow: 0 10px 40px rgb(22 24 28 / 0.08);
  background: var(--paper); color: var(--ink);
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh; min-height: 100dvh;
  -webkit-font-smoothing: antialiased; overflow-x: hidden;
}
.sig *, .sig *::before, .sig *::after { box-sizing: border-box; }
.sig a { color: inherit; text-decoration: none; }
.sig ::selection { background: color-mix(in srgb, var(--accent) 22%, transparent); }

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

.sig-hero { max-width: var(--page-max); margin: 0 auto; padding: clamp(48px, 9vw, 96px) clamp(20px, 5vw, 44px) clamp(56px, 8vw, 88px); }
.sig-block { max-width: var(--measure); margin: 0 auto; padding: clamp(60px, 9vw, 104px) clamp(20px, 5vw, 44px) 0; }
.sig-wide { max-width: var(--page-max); }
.sig-close { padding-bottom: clamp(72px, 12vw, 120px); }

.sig-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-faint); margin: 0; }
.sig-kicker { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--accent); margin: 0 0 16px; }
.sig-kicker-ink { color: var(--ink-faint); }
.sig-title {
  font-family: 'Archivo Expanded', 'Archivo', sans-serif; font-weight: 600;
  font-size: clamp(3.6rem, 9vw, 5.5rem); line-height: 0.98; letter-spacing: -0.02em;
  margin: 14px 0 0; color: var(--ink);
}
.sig-subhead { font-size: clamp(1.15rem, 2.4vw, 1.5rem); line-height: 1.5; font-weight: 500; color: var(--ink-soft); margin: 22px 0 0; max-width: 40ch; }
.sig-h2 { font-size: clamp(1.5rem, 3.2vw, 2.1rem); line-height: 1.2; font-weight: 600; letter-spacing: -0.015em; margin: 0; color: var(--ink); max-width: 20ch; }
.sig-h2-big { max-width: 24ch; }
.sig-lead { font-size: clamp(1.05rem, 2.1vw, 1.28rem); line-height: 1.55; color: var(--ink-soft); margin: 16px 0 0; max-width: 46ch; font-weight: 450; }
.sig-lead strong { color: var(--accent); font-weight: 700; }
.sig-lead-close { max-width: 54ch; }

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
.sig-btn-ghost:hover { border-color: var(--ink-faint); }

.sig-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--accent); animation: sig-pulse 2.6s ease-in-out infinite; flex-shrink: 0; }
@keyframes sig-pulse { 0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent); } 50% { box-shadow: 0 0 0 5px color-mix(in srgb, var(--accent) 0%, transparent); } }

.sig-stage-wrap { margin-top: clamp(34px, 6vw, 54px); }
.sig-stage { border-radius: var(--r); overflow: hidden; background: var(--card); border: 1px solid var(--hairline); box-shadow: var(--shadow); }
.sig-stage-bar { display: flex; align-items: center; gap: 9px; padding: 11px 16px; border-bottom: 1px solid var(--hairline); background: color-mix(in srgb, var(--paper) 60%, var(--card)); }
.sig-stage-url { font-size: 12px; font-weight: 500; color: var(--ink-faint); font-variant-numeric: tabular-nums; }
.sig-stage-view { position: relative; height: clamp(440px, 66vh, 640px); background: #eceae3; }
.sig-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; transition: opacity .5s ease; }
.sig-skeleton { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(180deg, #f1efe8, #e9e6dd); }
.sig-skeleton span { font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-faint); }
.sig-stage-note { font-size: 13px; color: var(--ink-faint); margin: 14px 2px 0; }

/* cities strip (Block B) */
.sig-cities { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-top: 30px; }
.sig-city { background: var(--card); border: 1px solid var(--hairline); border-radius: var(--r); padding: 20px 18px; box-shadow: 0 4px 20px rgb(22 24 28 / 0.04); transition: transform .25s ease, box-shadow .25s ease; }
.sig-city:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
.sig-city-mark { display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: #EEF4F0; color: var(--accent); font-size: 13px; font-weight: 700; }
.sig-city-name { display: block; margin-top: 14px; font-size: 17px; font-weight: 600; color: var(--ink); }
.sig-city-note { display: block; margin-top: 3px; font-size: 13.5px; color: var(--ink-faint); }
.sig-city-live { border-color: color-mix(in srgb, var(--accent) 40%, var(--hairline)); }
.sig-city-live .sig-city-mark { background: var(--accent); color: #fff; }
.sig-city-live .sig-city-note { color: var(--accent); font-weight: 600; }

/* how-Fit-works steps (Block C) */
.sig-steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 34px; }
.sig-step { position: relative; background: var(--card); border: 1px solid var(--hairline); border-radius: var(--r); padding: 22px 20px; box-shadow: 0 4px 20px rgb(22 24 28 / 0.04); }
.sig-step-n { position: absolute; top: 16px; right: 18px; font-size: 13px; font-weight: 700; color: var(--ink-faint); font-variant-numeric: tabular-nums; }
.sig-step-lead { font-size: 16.5px; font-weight: 600; color: var(--ink); margin: 12px 0 0; }
.sig-step-sub { font-size: 14px; line-height: 1.5; color: var(--ink-soft); margin: 5px 0 0; }
.sig-illo { width: 58px; height: 58px; border-radius: 12px; background: #F3F0E8; display: grid; place-items: center; animation: sig-float 5.5s ease-in-out infinite; }
.sig-step:nth-child(2) .sig-illo { animation-delay: -1.8s; }
.sig-step:nth-child(3) .sig-illo { animation-delay: -3.4s; }
@keyframes sig-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
.sig-route { stroke-dasharray: 4 5; animation: sig-dash 1.6s linear infinite; }
@keyframes sig-dash { to { stroke-dashoffset: -18; } }
.sig-verdict { animation: sig-verdict 3.6s ease-in-out infinite; }
@keyframes sig-verdict { 0%, 100% { fill: #16181C; } 33% { fill: #1F9D55; } 66% { fill: #E0A100; } 83% { fill: #C8102E; } }

/* the Fit legend */
.sig-legend-wrap { margin-top: 22px; }
.sig-legend { display: flex; flex-wrap: wrap; gap: 10px; }
.sig-chip { display: inline-flex; align-items: center; gap: 8px; padding: 10px 15px; border-radius: 999px; background: var(--card); border: 1px solid var(--hairline); box-shadow: 0 4px 14px rgb(22 24 28 / 0.05); }
.sig-chip-dot { width: 9px; height: 9px; border-radius: 999px; background: var(--c); animation: sig-chip 1.8s ease-in-out infinite; }
@keyframes sig-chip { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 color-mix(in srgb, var(--c) 60%, transparent); } 50% { transform: scale(1.15); box-shadow: 0 0 0 5px color-mix(in srgb, var(--c) 0%, transparent); } }
.sig-chip b { font-size: 14px; font-weight: 600; color: var(--ink); }
.sig-chip em { font-size: 13px; font-style: normal; color: var(--ink-faint); }

.sig-fig { margin: 0; }
.sig-fig-wide { margin-top: clamp(28px, 4vw, 44px); }
.sig-shot { display: block; width: 100%; height: auto; border-radius: var(--r); border: 1px solid var(--hairline); box-shadow: var(--shadow); background: var(--card); }
.sig-shot-live { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 260px; font-size: 15px; font-weight: 600; color: var(--ink-soft); border-style: dashed; }
.sig-shot-live:hover { color: var(--ink); border-color: var(--ink-faint); }
.sig-cap { font-size: 14px; color: var(--ink-faint); margin: 12px 2px 0; line-height: 1.5; }
.sig-craft { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(18px, 3vw, 28px); margin-top: 22px; }

/* decisions */
.sig-decisions { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 30px; }
.sig-decision { display: flex; gap: 16px; background: var(--card); border: 1px solid var(--hairline); border-radius: var(--r); padding: 22px 22px; box-shadow: 0 4px 20px rgb(22 24 28 / 0.04); transition: transform .25s ease, box-shadow .25s ease; }
.sig-decision:hover { transform: translateY(-3px); box-shadow: var(--shadow); }
.sig-decision-n { font-family: 'Archivo Expanded', 'Archivo', sans-serif; font-size: 15px; font-weight: 600; color: var(--accent); font-variant-numeric: tabular-nums; flex-shrink: 0; padding-top: 2px; }
.sig-decision-lead { font-size: 16.5px; font-weight: 600; color: var(--ink); margin: 0; line-height: 1.35; }
.sig-decision-body { font-size: 15px; line-height: 1.55; color: var(--ink-soft); margin: 7px 0 0; }

.sig-links { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.sig-foot { max-width: var(--page-max); margin: 0 auto; padding: 28px clamp(20px, 5vw, 44px) 40px; border-top: 1px solid var(--hairline); font-size: 13px; color: var(--ink-faint); font-variant-numeric: tabular-nums; }

@media (max-width: 760px) {
  .sig-cities, .sig-steps, .sig-decisions { grid-template-columns: 1fr; }
  .sig-craft { grid-template-columns: 1fr; }
  .sig-subhead { max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  .sig-dot, .sig-illo, .sig-route, .sig-verdict, .sig-chip-dot { animation: none; }
  .sig * { transition: none !important; }
}
`;
