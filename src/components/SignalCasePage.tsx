import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { Link } from "react-router";

/* ──────────────────────────────────────────────────────────────────────────
   Signal — a short case study.
   Six small blocks: what it is (with the real product embedded), what it
   does, why it exists, the craft, how it's built, links. No abstract
   diagrams, no invented metrics, no long scroll. The live map does the
   convincing; the words stay out of its way.
   ────────────────────────────────────────────────────────────────────────── */

const LIVE = "https://jayharwani.github.io/dmv-map/";
const GITHUB = "https://github.com/Jayharwani/dmv-map";
const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

/* craft shots: try png/jpg/webp; if a file is absent, show an honest
   "see it live" card instead of a broken image */
function useResolvedShot(base: string): string | null {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
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
    <figure className="sg-fig">
      {url ? (
        <img src={url} alt={alt} loading="lazy" className="sg-shot" />
      ) : (
        <a className="sg-shot sg-shot-live" href={LIVE} target="_blank" rel="noopener noreferrer" aria-label={alt}>
          <span className="sg-dot" aria-hidden="true" />
          See this live in the map <span aria-hidden="true">↗</span>
        </a>
      )}
      <figcaption className="sg-cap">{caption}</figcaption>
    </figure>
  );
}

/* ── three feature glyphs, drawn to match ── */
const IconMap = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20V6.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M9 4v13.5M15 6.5V20" stroke="currentColor" strokeWidth="1.5" opacity=".45" />
  </svg>
);
const IconFit = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <rect x="3.5" y="5" width="17" height="15" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="m8.5 14.5 2.2 2.2 4.6-4.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconRefresh = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true">
    <path d="M20 12a8 8 0 1 1-2.6-5.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M20 4.5V10h-5.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FEATURES = [
  {
    Icon: IconMap,
    title: "One map, the whole region",
    body: "Tech, design, and AI events across DC, Northern Virginia, and Baltimore — searchable, and filterable by category.",
  },
  {
    Icon: IconFit,
    title: "Fit — what you can actually make",
    body: "Connect a calendar and every event is marked open, tight, or a conflict, weighing real travel between your commitments. It's read in your browser and never uploaded.",
  },
  {
    Icon: IconRefresh,
    title: "Always current, on its own",
    body: "A scheduled pipeline pulls from event sources every few hours and republishes the map. No dashboard to tend, no recurring cost.",
  },
];

const NOTES = [
  {
    t: "Events first, tools second",
    b: "My first build buried the list behind the calendar controls. I inverted it — events became the permanent content and setup moved behind a single button. Same feature, different hierarchy.",
  },
  {
    t: "One card, one decision",
    b: "Category, day and time, venue, organizer, and a register link — everything needed to commit, without opening anything.",
  },
  {
    t: "Freshness stated plainly",
    b: "The footer says when the data last refreshed and how many events are live, so you never wonder whether you're looking at a stale map.",
  },
];

const STACK = ["React + Vite", "MapLibre GL", "Protomaps tiles", "Scheduled ingest", "Local-first, no backend"];

export function SignalCasePage() {
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
    const id = window.setTimeout(() => setFramed(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="sg">
      <style>{CSS}</style>

      <header className="sg-top">
        <Link to="/" className="sg-back">
          <span aria-hidden="true">←</span> Work
        </Link>
        <a className="sg-top-live" href={LIVE} target="_blank" rel="noopener noreferrer">
          <span className="sg-dot" aria-hidden="true" /> Live
        </a>
      </header>

      <main>
        {/* ── 1 · what it is + the real product ── */}
        <section className="sg-hero">
          <div className="sg-glow" aria-hidden="true" />
          <div className="sg-wrap">
            <p className="sg-eyebrow">Case study · Design &amp; build · 2026</p>
            <h1 className="sg-title">Signal</h1>
            <p className="sg-sub">
              A live map of tech, design, and AI events across the DMV — with a layer that shows which ones you can{" "}
              <em>actually make</em>.
            </p>
            <div className="sg-cta">
              <a className="sg-btn" href={LIVE} target="_blank" rel="noopener noreferrer">
                View live <span aria-hidden="true">↗</span>
              </a>
              <a className="sg-btn sg-btn-ghost sg-btn-dark" href={GITHUB} target="_blank" rel="noopener noreferrer">
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </div>

            <div className="sg-stage-wrap">
              <div className="sg-stage">
                <div className="sg-stage-bar">
                  <span className="sg-dot" aria-hidden="true" />
                  <span className="sg-stage-url">jayharwani.github.io/dmv-map</span>
                </div>
                <div className="sg-stage-view">
                  {framed && (
                    <iframe
                      className="sg-iframe"
                      src={LIVE}
                      title="Signal — the live product, embedded"
                      loading="lazy"
                      onLoad={() => setLoaded(true)}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                      style={{ opacity: loaded ? 1 : 0 }}
                    />
                  )}
                  {!loaded && (
                    <div className="sg-skeleton" aria-hidden="true">
                      <span>loading the live map…</span>
                    </div>
                  )}
                </div>
              </div>
              <p className="sg-note">The running product, embedded. Pan it, filter it, load a calendar.</p>
            </div>
          </div>
        </section>

        {/* ── 2 · what it does ── */}
        <section className="sg-sec">
          <div className="sg-wrap">
            <Reveal>
              <p className="sg-kicker">What it does</p>
            </Reveal>
            <div className="sg-features">
              {FEATURES.map((f, i) => (
                <Reveal key={f.title} delay={0.06 * i}>
                  <div className="sg-feature">
                    <span className="sg-feature-ic">
                      <f.Icon />
                    </span>
                    <h2 className="sg-feature-t">{f.title}</h2>
                    <p className="sg-feature-b">{f.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3 · why (two sentences, no more) ── */}
        <section className="sg-sec sg-why">
          <div className="sg-wrap">
            <Reveal>
              <p className="sg-kicker">Why I built it</p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="sg-big">
                SF and NYC have their startup maps. The DMV had none — and Baltimore gets quietly dropped from almost
                every regional list.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="sg-body">
                So the harder question became the interesting one: a directory tells you where events are; it never tells
                you which ones fit the week you already have. That's the layer I wanted to build.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 4 · the interface: one real screenshot + the decisions behind it ── */}
        <section className="sg-sec">
          <div className="sg-wrap">
            <Reveal>
              <p className="sg-kicker">The interface</p>
            </Reveal>
            <div className="sg-shotrow">
              <Reveal delay={0.05} className="sg-shotcol">
                <Figure
                  base="/signal/panel"
                  alt="Signal's panel: upcoming events grouped by week, each showing category, day and time, venue, organizer, and a register link, with a footer reading updated 1 hour ago and 174 events"
                  caption="The panel, as it ships."
                />
              </Reveal>
              <div className="sg-notes">
                {NOTES.map((n, i) => (
                  <Reveal key={n.t} delay={0.1 + i * 0.06}>
                    <div className="sg-note-item">
                      <h3 className="sg-note-t">{n.t}</h3>
                      <p className="sg-note-b">{n.b}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5 · how it's built ── */}
        <section className="sg-sec">
          <div className="sg-wrap">
            <Reveal>
              <p className="sg-kicker">Built with</p>
            </Reveal>
            <Reveal delay={0.05}>
              <ul className="sg-stack">
                {STACK.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="sg-body sg-body-tight">
                Designed and built solo. Claude Code did much of the typing; the product decisions were the real work.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 6 · close ── */}
        <section className="sg-sec sg-close">
          <div className="sg-wrap">
            <Reveal>
              <div className="sg-links">
                <a className="sg-btn" href={LIVE} target="_blank" rel="noopener noreferrer">
                  View live <span aria-hidden="true">↗</span>
                </a>
                <a className="sg-btn sg-btn-ghost" href={GITHUB} target="_blank" rel="noopener noreferrer">
                  GitHub <span aria-hidden="true">↗</span>
                </a>
                <Link className="sg-btn sg-btn-ghost" to="/">
                  Back to work
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="sg-foot">
        <div className="sg-wrap">Jay Harwani · 2026</div>
      </footer>
    </div>
  );
}

const CSS = `
.sg {
  --paper: #FBFAF6; --ink: #16181C; --ink-deep: #0E1013; --soft: #4A4E55; --faint: #8A8F97;
  --line: #E7E3DA; --accent: #1F9D55; --card: #FFF;
  --max: 980px; --r: 16px;
  background: var(--paper); color: var(--ink);
  font-family: 'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased; overflow-x: hidden; min-height: 100vh;
}
.sg *, .sg *::before, .sg *::after { box-sizing: border-box; }
.sg a { color: inherit; text-decoration: none; }
.sg ::selection { background: color-mix(in srgb, var(--accent) 24%, transparent); }
.sg-wrap { max-width: var(--max); margin: 0 auto; padding: 0 clamp(20px, 5vw, 40px); }

/* top bar */
.sg-top {
  position: sticky; top: 0; z-index: 30; display: flex; align-items: center; justify-content: space-between;
  padding: 13px clamp(20px, 5vw, 40px);
  background: color-mix(in srgb, var(--ink-deep) 82%, transparent); backdrop-filter: blur(12px);
  border-bottom: 1px solid rgb(255 255 255 / 0.07); color: #EDEBE4;
}
.sg-back { font-size: 14px; font-weight: 600; color: #C7C4BC; display: inline-flex; gap: 7px; align-items: center; }
.sg-back:hover { color: #fff; }
.sg-top-live { font-size: 13px; font-weight: 600; color: #fff; display: inline-flex; gap: 8px; align-items: center; }
.sg-dot { width: 8px; height: 8px; border-radius: 999px; background: var(--accent); flex-shrink: 0; animation: sg-pulse 2.6s ease-in-out infinite; }
@keyframes sg-pulse { 0%,100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--accent) 55%, transparent); } 50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--accent) 0%, transparent); } }

/* hero */
.sg-hero { position: relative; background: var(--ink-deep); color: #F3F1EA; overflow: hidden; padding: clamp(52px, 9vw, 96px) 0 clamp(56px, 8vw, 92px); }
.sg-glow {
  position: absolute; inset: -30% -10% auto -10%; height: 80%; pointer-events: none; opacity: .5;
  background: radial-gradient(42% 55% at 20% 20%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 70%),
              radial-gradient(46% 56% at 80% 6%, rgba(122,150,168,0.26), transparent 72%);
  filter: blur(24px);
}
.sg-hero .sg-wrap { position: relative; z-index: 1; }
.sg-eyebrow { font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: #9A968C; margin: 0; }
.sg-title {
  font-family: 'Archivo Expanded','Archivo',sans-serif; font-weight: 600; color: #fff;
  font-size: clamp(3.4rem, 10vw, 6rem); line-height: .92; letter-spacing: -.03em; margin: 14px 0 0;
}
.sg-sub { font-size: clamp(1.15rem, 2.4vw, 1.5rem); line-height: 1.45; font-weight: 500; color: #D7D4CB; margin: 22px 0 0; max-width: 30ch; }
.sg-sub em { font-style: normal; color: #fff; box-shadow: inset 0 -.5em 0 color-mix(in srgb, var(--accent) 38%, transparent); }
.sg-cta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

.sg-btn {
  display: inline-flex; align-items: center; gap: 7px; font-size: 14.5px; font-weight: 600;
  background: var(--accent); color: #06130B; padding: 12px 19px; border-radius: 11px;
  box-shadow: 0 8px 26px -8px color-mix(in srgb, var(--accent) 72%, transparent);
  transition: transform .18s ease, box-shadow .22s ease;
}
.sg-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -10px color-mix(in srgb, var(--accent) 72%, transparent); }
.sg-btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line); box-shadow: none; }
.sg-btn-ghost:hover { border-color: var(--faint); }
.sg-btn-dark { color: #EDEBE4; border-color: rgb(255 255 255 / 0.18); }
.sg-btn-dark:hover { border-color: rgb(255 255 255 / 0.4); }

/* the embedded product */
.sg-stage-wrap { margin-top: clamp(34px, 5vw, 52px); }
.sg-stage { border-radius: var(--r); overflow: hidden; background: #14161b; border: 1px solid rgb(255 255 255 / 0.09); box-shadow: 0 40px 90px -44px rgba(0,0,0,.75); }
.sg-stage-bar { display: flex; align-items: center; gap: 9px; padding: 11px 15px; background: #0f1116; border-bottom: 1px solid rgb(255 255 255 / 0.07); }
.sg-stage-url { font-size: 12px; color: #8C8880; font-variant-numeric: tabular-nums; }
.sg-stage-view { position: relative; height: clamp(400px, 60vh, 580px); background: #eceae3; }
.sg-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; transition: opacity .5s ease; }
.sg-skeleton { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(180deg,#14161b,#0f1116); }
.sg-skeleton span { font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: #6E6A61; }
.sg-note { font-size: 13px; color: #8C8880; margin: 14px 2px 0; }

/* sections */
.sg-sec { padding: clamp(56px, 8vw, 96px) 0; }
.sg-kicker { font-size: 12px; font-weight: 600; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); margin: 0 0 26px; }
.sg-big { font-size: clamp(1.5rem, 3.4vw, 2.2rem); line-height: 1.25; font-weight: 600; letter-spacing: -.02em; color: var(--ink); margin: 0; max-width: 30ch; }
.sg-body { font-size: 16.5px; line-height: 1.6; color: var(--soft); margin: 20px 0 0; max-width: 58ch; }
.sg-body-tight { margin-top: 22px; font-size: 15.5px; }
.sg-why { background: var(--card); border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); }

/* features */
.sg-features { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; }
.sg-feature { height: 100%; background: var(--card); border: 1px solid var(--line); border-radius: var(--r); padding: 24px 22px; box-shadow: 0 6px 24px rgb(22 24 28 / .04); }
.sg-feature-ic { display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 42px; border-radius: 12px; background: #EEF4F0; color: var(--accent); }
.sg-feature-t { font-size: 17.5px; font-weight: 600; line-height: 1.3; color: var(--ink); margin: 16px 0 0; }
.sg-feature-b { font-size: 15px; line-height: 1.58; color: var(--soft); margin: 9px 0 0; }

/* the interface: tall real screenshot beside the decisions behind it */
.sg-shotrow { display: grid; grid-template-columns: minmax(0, 300px) minmax(0, 1fr); gap: clamp(24px, 5vw, 56px); align-items: start; }
.sg-notes { display: flex; flex-direction: column; gap: 26px; padding-top: 4px; }
.sg-note-t { font-size: 17px; font-weight: 600; line-height: 1.3; color: var(--ink); margin: 0; }
.sg-note-b { font-size: 15.5px; line-height: 1.6; color: var(--soft); margin: 8px 0 0; max-width: 46ch; }
.sg-fig { margin: 0; }
.sg-shot { display: block; width: 100%; height: auto; border-radius: var(--r); border: 1px solid var(--line); background: var(--card); box-shadow: 0 10px 40px rgb(22 24 28 / .08); }
.sg-shot-live { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 260px; font-size: 15px; font-weight: 600; color: var(--soft); border-style: dashed; }
.sg-shot-live:hover { color: var(--ink); border-color: var(--faint); }
.sg-cap { font-size: 13.5px; line-height: 1.5; color: var(--faint); margin: 13px 2px 0; }

/* stack */
.sg-stack { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; margin: 0; }
.sg-stack li {
  font-size: 13.5px; font-weight: 500; color: var(--soft);
  background: var(--card); border: 1px solid var(--line); border-radius: 999px; padding: 9px 15px;
}

.sg-close { padding-top: clamp(20px, 3vw, 30px); }
.sg-links { display: flex; flex-wrap: wrap; gap: 12px; }
.sg-foot { border-top: 1px solid var(--line); padding: 26px 0 40px; font-size: 13px; color: var(--faint); }

@media (max-width: 800px) {
  .sg-features { grid-template-columns: 1fr; }
  .sg-shotrow { grid-template-columns: 1fr; }
  .sg-shotcol { max-width: 300px; margin: 0 auto; }
  .sg-sub { max-width: none; }
}
@media (prefers-reduced-motion: reduce) {
  .sg-dot { animation: none; }
  .sg * { transition: none !important; }
}
`;
