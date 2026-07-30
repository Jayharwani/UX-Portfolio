import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import {
  motion,
  useInView,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { Link } from "react-router";

/* ──────────────────────────────────────────────────────────────────────────
   Signal — case study.

   Same six blocks, same length. The delivery is cinematic: a dark
   atmospheric stage, glass surfaces with specular edges, and a real 3D
   centerpiece — an exploded layer diorama (basemap → events → fit) built in
   CSS 3D, tilting with the cursor. It is the product's core idea made
   literal: a directory tells you WHERE, the Fit layer tells you WHAT YOU
   CAN MAKE.

   Every animated element is legible at rest: reveals only add opacity/offset
   on top of a correct final state, so reduced-motion and any JS hiccup still
   render a complete page. One easing curve throughout. Reveals fire once.
   ────────────────────────────────────────────────────────────────────────── */

const LIVE = "https://jayharwani.github.io/dmv-map/";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── shared: cursor tilt in 3D ── */
function useTilt(maxX = 6, maxY = 8) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const srx = useSpring(rx, { stiffness: 120, damping: 18, mass: 0.6 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18, mass: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      ry.set(nx * maxY);
      rx.set(-ny * maxX);
      gx.set(((e.clientX - r.left) / r.width) * 100);
      gy.set(((e.clientY - r.top) / r.height) * 100);
    };
    const onLeave = () => {
      rx.set(0);
      ry.set(0);
      gx.set(50);
      gy.set(50);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [reduce, maxX, maxY, rx, ry, gx, gy]);

  return { ref, srx, sry, gx, gy };
}

/* ── reveals ── */
function Reveal({ children, delay = 0, y = 20, className, style }: { children: ReactNode; delay?: number; y?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : delay }}
    >
      {children}
    </motion.div>
  );
}

function Chars({ text, className }: { text: string; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <h1 className={className} aria-label={text}>
      {text.split("").map((c, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{ display: "inline-block" }}
          initial={reduce ? false : { opacity: 0, y: 44, rotateX: -60 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : 0.12 + i * 0.06 }}
        >
          {c}
        </motion.span>
      ))}
    </h1>
  );
}

function Words({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  return (
    <p ref={ref} className={className}>
      {text.split(" ").map((w, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", whiteSpace: "pre" }}
          initial={reduce ? false : { opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
          transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : delay + i * 0.038 }}
        >
          {w}{" "}
        </motion.span>
      ))}
    </p>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   The 3D diorama — three map layers exploded on Z, tilting with the cursor.
   Bottom: the basemap grid. Middle: every event as a pin. Top: the Fit
   verdicts. This is the product's thesis as an object you can look around.
   ══════════════════════════════════════════════════════════════════════════ */
const DIO_PINS = [
  { x: 22, y: 30 }, { x: 47, y: 20 }, { x: 70, y: 33 }, { x: 33, y: 48 },
  { x: 58, y: 44 }, { x: 80, y: 55 }, { x: 18, y: 62 }, { x: 43, y: 68 },
  { x: 64, y: 74 }, { x: 30, y: 80 }, { x: 76, y: 22 }, { x: 52, y: 58 },
];
/* honest to the mechanic: most fit, a few are tight, a couple conflict */
const DIO_FIT: ("open" | "tight" | "conflict")[] = [
  "open", "open", "tight", "open", "open", "conflict",
  "open", "tight", "open", "open", "open", "conflict",
];

function Diorama() {
  const reduce = useReducedMotion();
  const { ref, srx, sry } = useTilt(7, 9);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-15% 0px" });

  const LAYERS = [
    { label: "Basemap", z: 0 },
    { label: "Every event", z: 62 },
    { label: "Fit", z: 124 },
  ];

  return (
    <div className="sg-dio-wrap" ref={wrapRef}>
      {/* NOTE: nothing here starts at opacity 0. The diorama is the centerpiece,
          so its resting state is already a legible stacked map — motion only
          explodes it apart on Z. A stalled script degrades to flat, not blank. */}
      <motion.div
        ref={ref}
        className="sg-dio"
        style={{ rotateX: srx, rotateY: sry }}
        initial={reduce ? false : { y: 30 }}
        animate={inView ? { y: 0 } : undefined}
        transition={{ duration: 1, ease: EASE }}
      >
        <div className="sg-dio-inner">
          {LAYERS.map((L, li) => (
            <motion.div
              key={L.label}
              className={`sg-plane sg-plane-${li}`}
              initial={reduce ? false : { z: 0 }}
              animate={inView ? { z: L.z } : undefined}
              transition={{ duration: 1.1, ease: EASE, delay: reduce ? 0 : 0.15 + li * 0.16 }}
            >
              {/* the plane surface */}
              <div className="sg-plane-face">
                {li === 0 && (
                  <svg className="sg-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 20H100M0 40H100M0 60H100M0 80H100M20 0V100M40 0V100M60 0V100M80 0V100" />
                    <path className="sg-river" d="M-2 62C18 55 32 76 52 68S86 48 102 58" />
                  </svg>
                )}
                {li === 1 &&
                  DIO_PINS.map((p, i) => (
                    <motion.span
                      key={i}
                      className="sg-dpin"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      initial={reduce ? false : { scale: 0.45 }}
                      animate={inView ? { scale: 1 } : undefined}
                      transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.5 + i * 0.035 }}
                    />
                  ))}
                {li === 2 &&
                  DIO_PINS.map((p, i) => (
                    <motion.span
                      key={i}
                      className="sg-dfit"
                      data-fit={DIO_FIT[i]}
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      initial={reduce ? false : { scale: 0.35, y: 8 }}
                      animate={inView ? { scale: 1, y: 0 } : undefined}
                      transition={{ duration: 0.6, ease: EASE, delay: reduce ? 0 : 0.85 + i * 0.045 }}
                    />
                  ))}
              </div>
              <span className="sg-plane-label">{L.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <Reveal delay={0.3}>
        <div className="sg-dio-key">
          <span className="sg-k" data-fit="open"><i />Open</span>
          <span className="sg-k" data-fit="tight"><i />Tight</span>
          <span className="sg-k" data-fit="conflict"><i />Conflict</span>
        </div>
      </Reveal>
    </div>
  );
}

/* ── the live product in a glass frame ── */
function LiveStage({ progress }: { progress: MotionValue<number> }) {
  const reduce = useReducedMotion();
  const [framed, setFramed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { ref, srx, sry } = useTilt(4, 6);
  const y = useTransform(progress, [0, 1], [0, -60]);

  useEffect(() => {
    const id = window.setTimeout(() => setFramed(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className="sg-stage-wrap">
      <motion.div
        ref={ref}
        className="sg-stage"
        style={reduce ? undefined : { rotateX: srx, rotateY: sry, y }}
        initial={reduce ? false : { opacity: 0, y: 50, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: EASE, delay: reduce ? 0 : 0.55 }}
      >
        <span className="sg-stage-shine" aria-hidden="true" />
        <div className="sg-stage-bar">
          <span className="sg-dot" aria-hidden="true" />
          <span className="sg-stage-url">jayharwani.github.io/dmv-map</span>
          <span className="sg-stage-tag">live</span>
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
      </motion.div>
      <Reveal delay={0.75}>
        <p className="sg-note">The running product, embedded — pan it, filter it, load a calendar.</p>
      </Reveal>
    </div>
  );
}

/* ── craft shot ── */
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

function Shot({ base, alt, caption }: { base: string; alt: string; caption: string }) {
  const reduce = useReducedMotion();
  const url = useResolvedShot(base);
  const { ref, srx, sry } = useTilt(6, 8);
  const holder = useRef<HTMLElement>(null);
  const inView = useInView(holder, { once: true, margin: "-8% 0px" });
  return (
    <figure className="sg-fig" ref={holder}>
      <motion.div
        ref={ref}
        className="sg-shot-3d"
        style={reduce ? undefined : { rotateX: srx, rotateY: sry }}
        initial={reduce ? false : { opacity: 0, y: 34, rotateZ: -1.5 }}
        animate={inView ? { opacity: 1, y: 0, rotateZ: 0 } : undefined}
        transition={{ duration: 1, ease: EASE }}
      >
        <span className="sg-shot-glow" aria-hidden="true" />
        {url ? (
          <img src={url} alt={alt} loading="lazy" className="sg-shot" />
        ) : (
          <a className="sg-shot sg-shot-live" href={LIVE} target="_blank" rel="noopener noreferrer" aria-label={alt}>
            <span className="sg-dot" aria-hidden="true" />
            See this live <span aria-hidden="true">↗</span>
          </a>
        )}
      </motion.div>
      <Reveal delay={0.2}>
        <figcaption className="sg-cap">{caption}</figcaption>
      </Reveal>
    </figure>
  );
}

/* ── live micro-visuals, one per capability.
      Pure CSS animation (no JS gate), so they run regardless of the motion
      layer, sit still under reduced-motion, and are legible at rest. ── */
function VisMap() {
  return (
    <svg viewBox="0 0 132 88" className="sg-vis" aria-hidden="true">
      <rect x=".5" y=".5" width="131" height="87" rx="11" className="sg-vis-bd" />
      <g className="sg-vis-grid">
        <path d="M0 30H132M0 59H132M33 0V88M66 0V88M99 0V88" />
      </g>
      <path className="sg-vis-river" d="M-2 64C18 57 30 74 52 66S94 46 134 57" />
      <g className="sg-vis-pins">
        <circle cx="37" cy="32" r="4.5" />
        <circle cx="76" cy="49" r="4.5" />
        <circle cx="103" cy="25" r="4.5" />
      </g>
    </svg>
  );
}
const FIT_SEQ: ("open" | "tight" | "conflict")[] = ["open", "open", "tight", "open", "conflict", "open"];
function VisFit() {
  return (
    <div className="sg-vis sg-vis-fit" aria-hidden="true">
      {FIT_SEQ.map((s, i) => (
        <span key={i} data-fit={s} style={{ animationDelay: `${i * 0.22}s` }} />
      ))}
    </div>
  );
}
function VisRefresh() {
  return (
    <div className="sg-vis sg-vis-ref" aria-hidden="true">
      <svg viewBox="0 0 64 64">
        <circle cx="32" cy="32" r="23" className="sg-ref-track" />
        <circle cx="32" cy="32" r="23" className="sg-ref-arc" />
      </svg>
      <span className="sg-ref-dot" />
    </div>
  );
}

const FEATURES = [
  { Vis: VisMap, n: "01", title: "One map, the whole region", body: "Tech, design, and AI events across DC, Northern Virginia, and Baltimore — searchable and filterable by category." },
  { Vis: VisFit, n: "02", title: "Fit — what you can actually make", body: "Connect a calendar and every event is marked open, tight, or a conflict, weighing real travel between your commitments. Read in your browser, never uploaded." },
  { Vis: VisRefresh, n: "03", title: "Always current, on its own", body: "A scheduled pipeline pulls from event sources every few hours and republishes the map. No dashboard to tend, no recurring cost." },
];

/* editorial row — each sizes to its own content, so there is no dead space */
function FeatureRow({ f, i }: { f: (typeof FEATURES)[number]; i: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  return (
    <div className="sg-row" ref={ref}>
      <motion.span
        className="sg-row-line"
        aria-hidden="true"
        initial={reduce ? false : { scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.9, ease: EASE, delay: reduce ? 0 : i * 0.1 }}
      />
      <motion.div
        className="sg-row-in"
        initial={reduce ? false : { y: 24 }}
        animate={inView ? { y: 0 } : undefined}
        transition={{ duration: 0.75, ease: EASE, delay: reduce ? 0 : 0.08 + i * 0.1 }}
      >
        <span className="sg-row-n">{f.n}</span>
        <div className="sg-row-txt">
          <h2 className="sg-row-t">{f.title}</h2>
          <p className="sg-row-b">{f.body}</p>
        </div>
        <div className="sg-row-vis">
          <f.Vis />
        </div>
      </motion.div>
    </div>
  );
}

const NOTES = [
  { t: "Events first, tools second", b: "My first build buried the list behind the calendar controls. I inverted it — events became the permanent content and setup moved behind a single button. Same feature, different hierarchy." },
  { t: "One card, one decision", b: "Category, day and time, venue, organizer, and a register link — everything needed to commit, without opening anything." },
  { t: "Freshness stated plainly", b: "The footer says when the data last refreshed and how many events are live, so you never wonder whether the map is stale." },
];

const STACK = ["React + Vite", "MapLibre GL", "Protomaps tiles", "Scheduled ingest", "Local-first, no backend"];

export function SignalCasePage() {
  const reduce = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProg } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const barX = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 });

  useEffect(() => {
    const prev = document.title;
    document.title = "Signal — Product design case study";
    window.scrollTo(0, 0);
    return () => {
      document.title = prev;
    };
  }, []);

  return (
    <div className="sg">
      <style>{CSS}</style>
      <div className="sg-grain" aria-hidden="true" />
      {!reduce && <motion.div className="sg-progress" style={{ scaleX: barX }} aria-hidden="true" />}

      <header className="sg-top">
        <Link to="/" className="sg-back">
          <span aria-hidden="true">←</span> Work
        </Link>
        <a className="sg-top-live" href={LIVE} target="_blank" rel="noopener noreferrer">
          <span className="sg-dot" aria-hidden="true" /> Live
        </a>
      </header>

      <main>
        {/* ── 1 · what it is ── */}
        <section className="sg-hero" ref={heroRef}>
          <div className="sg-aurora" aria-hidden="true" />
          <div className="sg-wrap sg-hero-in">
            <motion.p
              className="sg-eyebrow"
              initial={reduce ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              Case study · Design &amp; build · 2026
            </motion.p>

            <Chars text="Signal" className="sg-title" />

            <motion.p
              className="sg-sub"
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.38 }}
            >
              A live map of tech, design, and AI events across the DMV — with a layer that shows which ones you can{" "}
              <span className="sg-mark">
                <motion.i
                  aria-hidden="true"
                  initial={reduce ? false : { scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: reduce ? 0 : 0.85 }}
                />
                <span className="sg-mark-t">actually make</span>
              </span>
              .
            </motion.p>

            <motion.div
              className="sg-cta"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: reduce ? 0 : 0.48 }}
            >
              <a className="sg-btn" href={LIVE} target="_blank" rel="noopener noreferrer">
                <span className="sg-btn-shine" aria-hidden="true" />
                View live <span aria-hidden="true">↗</span>
              </a>
              <span className="sg-facts">3 metros · 6 categories · refreshed every few hours</span>
            </motion.div>

            <LiveStage progress={heroProg} />
          </div>
        </section>

        {/* ── 2 · what it does ── */}
        <section className="sg-sec">
          <div className="sg-wrap">
            <Reveal>
              <p className="sg-kicker"><i />What it does</p>
            </Reveal>
            <div className="sg-rows">
              {FEATURES.map((f, i) => (
                <FeatureRow key={f.title} f={f} i={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 3 · why — the 3D diorama ── */}
        <section className="sg-sec sg-why">
          <div className="sg-wrap">
            <Reveal>
              <p className="sg-kicker"><i />Why I built it</p>
            </Reveal>
            <div className="sg-why-grid">
              <div>
                <Words
                  className="sg-big"
                  text="SF and NYC have their startup maps. The DMV had none — and Baltimore gets quietly dropped from almost every regional list."
                />
                <Reveal delay={0.15}>
                  <p className="sg-body">
                    So the harder question became the interesting one. A directory tells you <em>where</em> events are.
                    It never tells you which ones fit the week you already have. That's the layer I wanted to build.
                  </p>
                </Reveal>
              </div>
              <Diorama />
            </div>
          </div>
        </section>

        {/* ── 4 · the interface ── */}
        <section className="sg-sec">
          <div className="sg-wrap">
            <Reveal>
              <p className="sg-kicker"><i />The interface</p>
            </Reveal>
            <div className="sg-shotrow">
              <div className="sg-shotcol">
                <Shot
                  base="/signal/panel"
                  alt="Signal's panel: upcoming events grouped by week, each showing category, day and time, venue, organizer, and a register link, with a footer showing when the data last updated"
                  caption="The panel, as it ships."
                />
              </div>
              <div className="sg-notes">
                {NOTES.map((n, i) => (
                  <Reveal key={n.t} delay={0.08 + i * 0.1}>
                    <div className="sg-note-item">
                      <span className="sg-note-bar" aria-hidden="true" />
                      <h3 className="sg-note-t">{n.t}</h3>
                      <p className="sg-note-b">{n.b}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5 · built with ── */}
        <section className="sg-sec">
          <div className="sg-wrap">
            <Reveal>
              <p className="sg-kicker"><i />Built with</p>
            </Reveal>
            <ul className="sg-stack">
              {STACK.map((s, i) => (
                <motion.li
                  key={s}
                  initial={reduce ? false : { opacity: 0, y: 14, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-8% 0px" }}
                  transition={{ duration: 0.55, ease: EASE, delay: reduce ? 0 : i * 0.07 }}
                >
                  {s}
                </motion.li>
              ))}
            </ul>
            <Reveal delay={0.12}>
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
                  <span className="sg-btn-shine" aria-hidden="true" />
                  View live <span aria-hidden="true">↗</span>
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
  --bg: #0B0D11; --bg2: #10131A; --ink: #F4F2ED; --soft: #A8ACB6; --faint: #767B86;
  --line: rgba(255,255,255,.09); --line2: rgba(255,255,255,.14);
  --accent: #2FBE6B; --accent-dim: #1F9D55; --amber: #E0A100; --dim: #5A6068;
  --max: 1080px; --r: 18px;
  /* Editorial serif display over a neutral UI sans — legible, and a clear
     step away from the condensed grotesk that read as cramped. */
  --display: 'Instrument Serif', 'Playfair Display', Georgia, serif;
  --text: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --mono: 'Geist Mono', ui-monospace, monospace;
  background: var(--bg); color: var(--ink); font-family: var(--text);
  -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility;
  overflow-x: hidden; min-height: 100vh; position: relative;
}
.sg *, .sg *::before, .sg *::after { box-sizing: border-box; }
.sg a { color: inherit; text-decoration: none; }
.sg ::selection { background: rgba(47,190,107,.28); }
.sg-wrap { max-width: var(--max); margin: 0 auto; padding: 0 clamp(20px, 5vw, 40px); }

.sg-grain {
  position: fixed; inset: 0; z-index: 60; pointer-events: none; opacity: .045; mix-blend-mode: overlay;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}
.sg-progress { position: fixed; top: 0; left: 0; right: 0; height: 2px; z-index: 70; transform-origin: 0 50%; background: linear-gradient(90deg, var(--accent-dim), var(--accent)); box-shadow: 0 0 14px rgba(47,190,107,.6); }

.sg-top {
  position: sticky; top: 0; z-index: 50; display: flex; align-items: center; justify-content: space-between;
  padding: 13px clamp(20px, 5vw, 40px);
  background: rgba(11,13,17,.72); backdrop-filter: blur(14px); border-bottom: 1px solid var(--line);
}
.sg-back { font-size: 14.5px; font-weight: 500; color: var(--soft); display: inline-flex; gap: 8px; align-items: center; transition: color .2s; }
.sg-back:hover { color: var(--ink); }
.sg-top-live { font-family: var(--mono); font-size: 11.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--ink); display: inline-flex; gap: 8px; align-items: center; }
.sg-dot { width: 7px; height: 7px; border-radius: 999px; background: var(--accent); flex-shrink: 0; box-shadow: 0 0 10px var(--accent); animation: sg-pulse 2.4s ease-in-out infinite; }
@keyframes sg-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(47,190,107,.5), 0 0 10px var(--accent); } 50% { box-shadow: 0 0 0 6px rgba(47,190,107,0), 0 0 14px var(--accent); } }

/* ── hero ── */
.sg-hero { position: relative; overflow: hidden; padding: clamp(56px, 9vw, 104px) 0 clamp(60px, 9vw, 104px); }
.sg-aurora {
  position: absolute; inset: -25% -12% auto -12%; height: 92%; pointer-events: none; opacity: .75;
  background:
    radial-gradient(38% 48% at 18% 16%, rgba(47,190,107,.30), transparent 70%),
    radial-gradient(42% 52% at 78% 4%, rgba(90,132,168,.28), transparent 72%),
    radial-gradient(36% 44% at 52% 40%, rgba(47,190,107,.10), transparent 70%);
  filter: blur(30px); animation: sg-drift 26s ease-in-out infinite alternate;
}
@keyframes sg-drift { from { transform: translate3d(-2%,-1%,0) scale(1); } to { transform: translate3d(3%,2%,0) scale(1.1); } }
.sg-hero-in { position: relative; z-index: 1; }

.sg-eyebrow { font-family: var(--mono); font-size: 11.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); margin: 0; }
.sg-title {
  /* Instrument Serif ships one weight — never request 600 or the browser
     synthesises a smeared fake bold. */
  font-family: var(--display); font-weight: 400; color: #fff; perspective: 800px;
  font-size: clamp(3.1rem, 12.5vw, 6.8rem); line-height: 1; letter-spacing: -.02em; margin: 18px 0 0;
  text-shadow: 0 0 60px rgba(47,190,107,.18);
}
.sg-sub { font-size: clamp(1.2rem, 2.5vw, 1.6rem); line-height: 1.48; color: #D2D6DD; margin: 26px 0 0; max-width: 33ch; font-weight: 400; }
.sg-mark { position: relative; display: inline-block; color: #fff; font-weight: 600; white-space: nowrap; }
.sg-mark i { position: absolute; left: -.1em; right: -.1em; bottom: .02em; height: .46em; background: linear-gradient(90deg, rgba(47,190,107,.5), rgba(47,190,107,.22)); transform-origin: left center; border-radius: 3px; }
.sg-mark-t { position: relative; }
.sg-cta { display: flex; flex-wrap: wrap; align-items: center; gap: 18px; margin-top: 34px; }
.sg-facts { font-family: var(--mono); font-size: 11.5px; letter-spacing: .06em; color: var(--faint); }

.sg-btn {
  position: relative; overflow: hidden; display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--text); font-size: 15px; font-weight: 600;
  background: linear-gradient(180deg, var(--accent), var(--accent-dim)); color: #04140A;
  padding: 14px 22px; border-radius: 12px;
  box-shadow: 0 10px 30px -8px rgba(47,190,107,.5), inset 0 1px 0 rgba(255,255,255,.35);
  transition: transform .22s cubic-bezier(.16,1,.3,1), box-shadow .25s ease;
}
.sg-btn:hover { transform: translateY(-2px); box-shadow: 0 18px 40px -10px rgba(47,190,107,.6), inset 0 1px 0 rgba(255,255,255,.4); }
.sg-btn-shine { position: absolute; top: 0; bottom: 0; width: 40%; left: -60%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.45), transparent); animation: sg-shine 4.5s ease-in-out infinite; }
@keyframes sg-shine { 0%, 62% { left: -60%; } 88%, 100% { left: 120%; } }
.sg-btn-ghost { background: transparent; color: var(--ink); border: 1px solid var(--line2); box-shadow: none; }
.sg-btn-ghost:hover { border-color: var(--soft); box-shadow: none; }

/* the embedded product */
.sg-stage-wrap { margin-top: clamp(38px, 6vw, 60px); perspective: 1600px; }
.sg-stage {
  position: relative; border-radius: var(--r); overflow: hidden; background: #14161b;
  border: 1px solid var(--line2); transform-style: preserve-3d; will-change: transform;
  box-shadow: 0 50px 100px -40px rgba(0,0,0,.85), 0 0 0 1px rgba(255,255,255,.03), 0 0 90px -30px rgba(47,190,107,.35);
}
.sg-stage-shine { position: absolute; inset: 0; pointer-events: none; z-index: 3; background: linear-gradient(180deg, rgba(255,255,255,.08), transparent 22%); }
.sg-stage-bar { display: flex; align-items: center; gap: 10px; padding: 12px 16px; background: #0f1116; border-bottom: 1px solid var(--line); }
.sg-stage-url { font-family: var(--mono); font-size: 12px; color: var(--faint); }
.sg-stage-tag { margin-left: auto; font-family: var(--mono); font-size: 10px; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); border: 1px solid rgba(47,190,107,.35); border-radius: 999px; padding: 3px 9px; }
.sg-stage-view { position: relative; height: clamp(400px, 60vh, 580px); background: #eceae3; }
.sg-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; transition: opacity .5s ease; }
.sg-skeleton { position: absolute; inset: 0; display: grid; place-items: center; background: linear-gradient(180deg,#14161b,#0f1116); }
.sg-skeleton span { font-family: var(--mono); font-size: 11.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint); }
.sg-note { font-size: 14px; color: var(--faint); margin: 18px 2px 0; }

/* ── sections ── */
.sg-sec { padding: clamp(64px, 9vw, 112px) 0; position: relative; }
.sg-why { background: linear-gradient(180deg, transparent, rgba(255,255,255,.022) 15%, rgba(255,255,255,.022) 85%, transparent); }
.sg-kicker { display: inline-flex; align-items: center; gap: 12px; font-family: var(--mono); font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; color: var(--accent); margin: 0 0 36px; }
.sg-kicker i { width: 28px; height: 1px; background: var(--accent); display: inline-block; box-shadow: 0 0 8px var(--accent); }
.sg-big { font-family: var(--display); font-size: clamp(1.7rem, 3.6vw, 2.6rem); line-height: 1.22; font-weight: 400; letter-spacing: -.01em; color: #fff; margin: 0; max-width: 26ch; }
.sg-body { font-size: 16.5px; line-height: 1.7; color: var(--soft); margin: 24px 0 0; max-width: 52ch; }
.sg-body em { font-style: italic; color: var(--ink); }
.sg-body-tight { margin-top: 26px; font-size: 15.5px; }

/* what it does — editorial rows. Each sizes to its own content, so there is
   no stretched-to-match dead space, and the eye reads down a clean column. */
.sg-rows { display: flex; flex-direction: column; }
.sg-row { position: relative; }
.sg-row-line { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,.22), rgba(255,255,255,.05) 60%, transparent); transform-origin: left center; display: block; }
.sg-row-in {
  display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center;
  gap: clamp(20px, 4vw, 52px); padding: clamp(28px, 3.4vw, 40px) 6px;
  transition: background .3s ease;
}
.sg-row:hover .sg-row-in { background: linear-gradient(90deg, rgba(47,190,107,.05), transparent 55%); }
.sg-row-n { font-family: var(--mono); font-size: 12px; letter-spacing: .12em; color: var(--faint); transition: color .3s ease; align-self: start; padding-top: 6px; }
.sg-row:hover .sg-row-n { color: var(--accent); }
.sg-row-t { font-family: var(--display); font-weight: 400; font-size: clamp(1.4rem, 2.6vw, 1.95rem); line-height: 1.2; letter-spacing: -.005em; color: #fff; margin: 0; }
.sg-row-b { font-size: 15.5px; line-height: 1.7; color: var(--soft); margin: 10px 0 0; max-width: 54ch; }
.sg-row-vis { flex-shrink: 0; }

/* the micro-visuals */
.sg-vis { display: block; width: 132px; height: 88px; }
.sg-vis-bd { fill: rgba(255,255,255,.03); stroke: var(--line); }
.sg-vis-grid path { stroke: rgba(255,255,255,.08); stroke-width: 1; fill: none; }
.sg-vis-river { stroke: rgba(122,160,190,.3); stroke-width: 2.5; fill: none; }
.sg-vis-pins circle { fill: var(--accent); filter: drop-shadow(0 0 6px rgba(47,190,107,.9)); animation: sg-pin 3.6s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
.sg-vis-pins circle:nth-child(2) { animation-delay: .5s; }
.sg-vis-pins circle:nth-child(3) { animation-delay: 1s; }
@keyframes sg-pin { 0%, 62%, 100% { transform: scale(1); opacity: .82; } 22% { transform: scale(1.5); opacity: 1; } }

.sg-vis-fit { display: grid; grid-template-columns: repeat(3, 1fr); gap: 7px; width: 132px; height: 88px; }
.sg-vis-fit span { border-radius: 6px; background: #2A2F37; animation: sg-verdict 5.4s ease-in-out infinite; }
.sg-vis-fit span[data-fit="open"] { --vc: var(--accent); }
.sg-vis-fit span[data-fit="tight"] { --vc: var(--amber); }
.sg-vis-fit span[data-fit="conflict"] { --vc: #3C424B; }
@keyframes sg-verdict {
  0%, 12% { background: #2A2F37; box-shadow: none; }
  30%, 72% { background: var(--vc); box-shadow: 0 0 14px -2px var(--vc); }
  92%, 100% { background: #2A2F37; box-shadow: none; }
}

.sg-vis-ref { position: relative; display: grid; place-items: center; width: 132px; height: 88px; }
.sg-vis-ref svg { width: 64px; height: 64px; transform: rotate(-90deg); }
.sg-ref-track { fill: none; stroke: rgba(255,255,255,.1); stroke-width: 3; }
.sg-ref-arc { fill: none; stroke: var(--accent); stroke-width: 3; stroke-linecap: round; stroke-dasharray: 40 105; filter: drop-shadow(0 0 5px rgba(47,190,107,.8)); animation: sg-arc 3.4s cubic-bezier(.5,0,.5,1) infinite; transform-origin: center; }
@keyframes sg-arc { to { transform: rotate(360deg); } }
.sg-ref-dot { position: absolute; width: 7px; height: 7px; border-radius: 999px; background: var(--accent); box-shadow: 0 0 12px var(--accent); animation: sg-pulse 2.4s ease-in-out infinite; }

/* ── the 3D diorama ── */
.sg-why-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr); gap: clamp(30px, 5vw, 64px); align-items: center; }
.sg-dio-wrap { perspective: 1400px; }
.sg-dio { position: relative; width: 100%; aspect-ratio: 1 / 0.92; transform-style: preserve-3d; will-change: transform; }
.sg-dio-inner { position: absolute; inset: 0; transform-style: preserve-3d; transform: rotateX(58deg) rotateZ(-30deg) translateZ(-40px); }
.sg-plane { position: absolute; inset: 12% 14%; transform-style: preserve-3d; }
.sg-plane-face {
  position: absolute; inset: 0; border-radius: 10px; border: 1px solid var(--line2);
  background: linear-gradient(145deg, rgba(255,255,255,.05), rgba(255,255,255,.015));
  box-shadow: 0 30px 50px -30px rgba(0,0,0,.9), inset 0 1px 0 rgba(255,255,255,.1);
  backdrop-filter: blur(2px);
}
.sg-plane-0 .sg-plane-face { background: linear-gradient(145deg, rgba(120,140,170,.14), rgba(255,255,255,.02)); }
.sg-plane-2 .sg-plane-face { border-color: rgba(47,190,107,.3); background: linear-gradient(145deg, rgba(47,190,107,.09), rgba(255,255,255,.015)); }
.sg-plane-label {
  position: absolute; left: 100%; top: 50%; transform: translate(14px, -50%) rotateZ(30deg) rotateX(-58deg);
  transform-origin: left center; white-space: nowrap;
  font-family: var(--mono); font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase; color: var(--faint);
}
.sg-plane-2 .sg-plane-label { color: var(--accent); }
.sg-grid { position: absolute; inset: 0; width: 100%; height: 100%; border-radius: 10px; }
.sg-grid path { stroke: rgba(255,255,255,.09); stroke-width: .5; fill: none; }
.sg-grid .sg-river { stroke: rgba(122,160,190,.3); stroke-width: 2; }
.sg-dpin { position: absolute; width: 9px; height: 9px; margin: -4.5px 0 0 -4.5px; border-radius: 3px; background: #98A0AE; box-shadow: 0 2px 6px rgba(0,0,0,.6); }
.sg-dfit { position: absolute; width: 12px; height: 12px; margin: -6px 0 0 -6px; border-radius: 4px; }
.sg-dfit[data-fit="open"] { background: var(--accent); box-shadow: 0 0 14px rgba(47,190,107,.9), 0 3px 8px rgba(0,0,0,.5); }
.sg-dfit[data-fit="tight"] { background: var(--amber); box-shadow: 0 0 12px rgba(224,161,0,.75), 0 3px 8px rgba(0,0,0,.5); }
.sg-dfit[data-fit="conflict"] { background: #3C424B; box-shadow: 0 2px 6px rgba(0,0,0,.5); }
.sg-dio-key { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; margin-top: 6px; }
.sg-k { display: inline-flex; align-items: center; gap: 7px; font-family: var(--mono); font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase; color: var(--faint); }
.sg-k i { width: 9px; height: 9px; border-radius: 3px; display: inline-block; }
.sg-k[data-fit="open"] i { background: var(--accent); box-shadow: 0 0 10px rgba(47,190,107,.8); }
.sg-k[data-fit="tight"] i { background: var(--amber); box-shadow: 0 0 10px rgba(224,161,0,.7); }
.sg-k[data-fit="conflict"] i { background: #3C424B; }

/* ── the interface ── */
.sg-shotrow { display: grid; grid-template-columns: minmax(0, 320px) minmax(0, 1fr); gap: clamp(28px, 5vw, 64px); align-items: start; }
.sg-fig { margin: 0; perspective: 1200px; }
.sg-shot-3d { position: relative; transform-style: preserve-3d; will-change: transform; border-radius: var(--r); }
.sg-shot-glow { position: absolute; inset: 6% 8% -4%; border-radius: 40px; background: radial-gradient(60% 60% at 50% 60%, rgba(47,190,107,.4), transparent 70%); filter: blur(34px); z-index: -1; }
.sg-shot { display: block; width: 100%; height: auto; border-radius: var(--r); border: 1px solid var(--line2); box-shadow: 0 40px 80px -34px rgba(0,0,0,.9); }
.sg-shot-live { display: flex; align-items: center; justify-content: center; gap: 10px; min-height: 280px; font-size: 15px; font-weight: 600; color: var(--soft); border-style: dashed; }
.sg-cap { font-size: 13.5px; color: var(--faint); margin: 18px 2px 0; }
.sg-notes { display: flex; flex-direction: column; gap: 26px; }
.sg-note-item { position: relative; padding-left: 20px; }
.sg-note-bar { position: absolute; left: 0; top: 6px; bottom: 6px; width: 2px; border-radius: 2px; background: linear-gradient(180deg, var(--accent), transparent); }
.sg-note-t { font-family: var(--display); font-size: 19px; font-weight: 400; line-height: 1.3; color: #fff; margin: 0; }
.sg-note-b { font-size: 15.5px; line-height: 1.68; color: var(--soft); margin: 9px 0 0; max-width: 46ch; }

/* stack */
.sg-stack { display: flex; flex-wrap: wrap; gap: 10px; list-style: none; padding: 0; margin: 0; }
.sg-stack li {
  font-family: var(--mono); font-size: 12.5px; letter-spacing: .03em; color: var(--soft);
  background: rgba(255,255,255,.04); border: 1px solid var(--line); border-radius: 999px; padding: 10px 16px;
  transition: border-color .22s, color .22s, transform .22s cubic-bezier(.16,1,.3,1);
}
.sg-stack li:hover { border-color: rgba(47,190,107,.45); color: var(--ink); transform: translateY(-2px); }

.sg-close { padding-top: clamp(24px, 3vw, 36px); }
.sg-links { display: flex; flex-wrap: wrap; gap: 12px; }
.sg-foot { border-top: 1px solid var(--line); padding: 30px 0 46px; font-family: var(--mono); font-size: 12px; color: var(--faint); }

@media (max-width: 900px) {
  .sg-why-grid { grid-template-columns: 1fr; }
  .sg-dio-wrap { max-width: 420px; margin: 8px auto 0; }
  .sg-shotrow { grid-template-columns: 1fr; }
  .sg-shotcol { max-width: 320px; margin: 0 auto; }
  .sg-sub { max-width: none; }
  .sg-big { max-width: none; }
}
@media (max-width: 700px) {
  /* rows stack: number + title, then copy, then the visual */
  .sg-row-in { grid-template-columns: auto minmax(0, 1fr); gap: 14px 16px; }
  .sg-row-vis { grid-column: 1 / -1; }
  .sg-vis, .sg-vis-fit, .sg-vis-ref { width: 118px; height: 78px; }
}
@media (prefers-reduced-motion: reduce) {
  .sg-dot, .sg-aurora, .sg-btn-shine,
  .sg-vis-pins circle, .sg-vis-fit span, .sg-ref-arc, .sg-ref-dot { animation: none; }
  .sg-btn-shine { display: none; }
  /* verdicts still read correctly with motion off */
  .sg-vis-fit span { background: var(--vc); }
  .sg * { transition: none !important; }
}
`;
