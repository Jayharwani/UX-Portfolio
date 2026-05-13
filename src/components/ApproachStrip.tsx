import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, RefreshCw } from "lucide-react";

/* ────────────────────────────────────────────────────────── */
/*  Constants                                                 */
/* ────────────────────────────────────────────────────────── */
const SUIT_RED = "#DC2626";
const SUIT_RED_DEEP = "#B91C1C";
const SUIT_GOLD = "#FBBF24";
const SUIT_GOLD_BRIGHT = "#FCD34D";
const PANEL_BG = "#0A0606";

const PRACTICE_AREAS = [
  "Behavior design",
  "AI explainability",
  "Accessibility-first patterns",
  "Design systems",
  "Human–robot collaboration",
  "Trust calibration",
  "Production handoff",
  "Research → prototype",
  "Component libraries",
  "Enterprise UX",
  "Prototyping in code",
];

interface ModuleDef {
  num: string;
  name: string;
  tagline: string;
  fill: number; /* of 8 */
  pct: number;
}

const MODULES: ModuleDef[] = [
  { num: "01", name: "SPARK", tagline: "creativity — the conductor", fill: 2, pct: 25 },
  { num: "02", name: "UX", tagline: "research → wireframe", fill: 4, pct: 50 },
  { num: "03", name: "BUILD", tagline: "design ⇄ code", fill: 6, pct: 75 },
  { num: "04", name: "LIVE", tagline: "production AI — shipped", fill: 8, pct: 100 },
];

/* ══════════════════════════════════════════════════════════ */
/*  ApproachStrip                                              */
/* ══════════════════════════════════════════════════════════ */
export function ApproachStrip() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#FAFAF7" }}
    >
      {/* Ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(185,28,28,0.08) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "10%",
          right: "-10%",
          width: "550px",
          height: "550px",
          background:
            "radial-gradient(circle, rgba(180,83,9,0.08) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Editorial column lines */}
      <div className="absolute inset-0 pointer-events-none hidden lg:flex justify-between max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-px h-full"
            style={{ backgroundColor: "rgba(15,23,42,0.04)" }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">

        <Header />

        <div className="mt-12 sm:mt-16">
          <JarvisPanel />
        </div>

        <PracticeMarquee />

        <ScrollHint />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Header                                                    */
/* ────────────────────────────────────────────────────────── */
function Header() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <motion.div
        className="col-span-12 md:col-span-3 flex flex-col gap-3"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{
            color: "#71717A",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          }}
        >
          Section //01
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{
            color: "#A1A1AA",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          }}
        >
          How I work
        </span>
      </motion.div>

      <motion.div
        className="col-span-12 md:col-span-9"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.85, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <h2
          className="leading-[1.0] tracking-[-0.035em]"
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            color: "#09090B",
            fontSize: "clamp(38px, 6.5vw, 84px)",
          }}
        >
          From{" "}
          <span
            style={{
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              fontWeight: 500,
              color: SUIT_RED_DEEP,
            }}
          >
            spark
          </span>{" "}
          to ship.
        </h2>
        <p
          className="mt-4 text-[12px] sm:text-[13px]"
          style={{
            color: "#52525B",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          end-to-end · solo · production-ready
        </p>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  JarvisPanel — terminal-style diagnostic                   */
/* ══════════════════════════════════════════════════════════ */
type ModuleState = "hidden" | "loading" | "online";

/* Phase advancement timings (ms) */
const DELAYS: Record<number, number> = {
  1: 800,    /* init → spark loading */
  2: 1300,   /* spark loading → online */
  3: 600,    /* spark online → ux loading */
  4: 1300,
  5: 600,
  6: 1300,
  7: 600,
  8: 1300,
  9: 900,    /* live online → final */
};

function JarvisPanel() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);
  const [run, setRun] = useState(0);

  /* Trigger boot on scroll into view */
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === 0) setPhase(1);
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [phase, run]);

  /* Auto-advance through phases */
  useEffect(() => {
    if (phase === 0 || phase >= 10) return;
    const delay = DELAYS[phase] ?? 1000;
    const timer = setTimeout(() => setPhase((p) => p + 1), delay);
    return () => clearTimeout(timer);
  }, [phase]);

  const handleReplay = () => {
    setPhase(0);
    setRun((r) => r + 1);
    /* Allow effects to settle, then start again */
    setTimeout(() => setPhase(1), 80);
  };

  const moduleState = (idx: number): ModuleState => {
    const loadingPhase = 2 + idx * 2;
    if (phase < loadingPhase) return "hidden";
    if (phase === loadingPhase) return "loading";
    return "online";
  };

  return (
    <div
      ref={ref}
      className="relative mx-auto overflow-hidden rounded-xl"
      style={{
        maxWidth: "900px",
        backgroundColor: PANEL_BG,
        border: "1px solid rgba(220,38,38,0.25)",
        boxShadow: "0 30px 70px -25px rgba(0,0,0,0.5), inset 0 1px 0 rgba(251,191,36,0.06)",
      }}
    >
      <TerminalChrome />

      <div
        className="px-4 sm:px-7 py-6 sm:py-8 pb-16"
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "clamp(11.5px, 1.4vw, 13.5px)",
          lineHeight: 1.85,
        }}
      >
        {/* INIT line */}
        {phase >= 1 && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            style={{ color: "rgba(244,244,245,0.7)" }}
          >
            <span style={{ color: SUIT_GOLD }}>{">"}</span> INITIALIZING DESIGNER PROTOCOL
            <BlinkingCursor show={phase < 10} />
          </motion.div>
        )}

        {phase >= 2 && <div className="h-3" />}

        {/* Module lines */}
        {MODULES.map((mod, idx) => (
          <ModuleLine key={`${mod.num}-${run}`} mod={mod} state={moduleState(idx)} />
        ))}

        {phase >= 10 && (
          <>
            <div className="h-3" />
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{ color: SUIT_GOLD_BRIGHT, fontWeight: 600 }}
            >
              <span style={{ color: SUIT_GOLD }}>{">"}</span> ALL SYSTEMS GO. READY TO SHIP.
            </motion.div>
          </>
        )}
      </div>

      {/* Replay button */}
      <AnimatePresence>
        {phase >= 10 && (
          <motion.button
            onClick={handleReplay}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="absolute bottom-4 right-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors hover:bg-yellow-500/10 active:scale-[0.96]"
            style={{
              border: `1px solid ${SUIT_GOLD}`,
              color: SUIT_GOLD,
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "10.5px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              backgroundColor: "rgba(251,191,36,0.03)",
            }}
          >
            <RefreshCw className="w-3 h-3" strokeWidth={2} />
            <span>Replay</span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  TerminalChrome — top window bar                            */
/* ────────────────────────────────────────────────────────── */
function TerminalChrome() {
  return (
    <div
      className="flex items-center justify-between px-4 py-3"
      style={{
        borderBottom: "1px solid rgba(220, 38, 38, 0.15)",
        backgroundColor: "rgba(10, 6, 6, 0.6)",
      }}
    >
      <div className="flex items-center gap-1.5">
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28C840" }} />
      </div>
      <span
        className="hidden sm:inline-block"
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "10.5px",
          color: SUIT_GOLD,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Stark Industries // J.A.R.V.I.S
      </span>
      <span
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "10.5px",
          color: "rgba(244,244,245,0.4)",
          letterSpacing: "0.12em",
        }}
      >
        v4.0
      </span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  ModuleLine — one diagnostic readout row                    */
/* ────────────────────────────────────────────────────────── */
function ModuleLine({ mod, state }: { mod: ModuleDef; state: ModuleState }) {
  if (state === "hidden") return null;

  const filled = state === "online" ? mod.fill : 0;
  const empty = 8 - filled;
  const bar = "█".repeat(filled) + "░".repeat(empty);
  const isOnline = state === "online";

  return (
    <motion.div
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="flex items-center gap-2 sm:gap-3 whitespace-nowrap"
    >
      {/* Bar */}
      <span
        style={{
          color: isOnline ? SUIT_GOLD : "rgba(220, 38, 38, 0.45)",
          letterSpacing: "0.05em",
        }}
      >
        [{bar}]
      </span>

      {/* Percent */}
      <span
        style={{
          color: isOnline ? SUIT_GOLD : "rgba(244,244,245,0.4)",
          fontVariantNumeric: "tabular-nums",
          minWidth: "34px",
          textAlign: "right",
        }}
      >
        {isOnline ? mod.pct : 0}%
      </span>

      {/* Module label */}
      <span style={{ color: "rgba(244,244,245,0.7)" }}>
        MODULE {mod.num}:
      </span>
      <span style={{ color: "#F4F4F5", fontWeight: 600 }}>{mod.name}</span>

      {/* Dot filler */}
      <span
        className="flex-1 overflow-hidden"
        style={{ color: "rgba(244,244,245,0.18)", letterSpacing: "0.05em" }}
      >
        ........................................
      </span>

      {/* Status */}
      <motion.span
        key={state}
        initial={{ scale: 0.85, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        style={{
          color: isOnline ? SUIT_GOLD : SUIT_RED,
          fontWeight: 600,
          letterSpacing: "0.08em",
        }}
      >
        {isOnline ? "ONLINE" : "LOADING"}
      </motion.span>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  BlinkingCursor — terminal cursor (block character)         */
/* ────────────────────────────────────────────────────────── */
function BlinkingCursor({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <motion.span
      animate={{ opacity: [1, 0, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      style={{
        display: "inline-block",
        marginLeft: "3px",
        width: "0.55em",
        color: SUIT_GOLD,
      }}
    >
      ▌
    </motion.span>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Practice marquee                                          */
/* ────────────────────────────────────────────────────────── */
function PracticeMarquee() {
  return (
    <motion.div
      className="mt-16 sm:mt-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className="flex items-baseline justify-between mb-5 pb-3"
        style={{ borderBottom: "1px solid rgba(15,23,42,0.1)" }}
      >
        <span
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{
            color: "#71717A",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          }}
        >
          Practice areas
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{
            color: "#A1A1AA",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          }}
        >
          {String(PRACTICE_AREAS.length).padStart(2, "0")} domains
        </span>
      </div>

      <div className="relative overflow-hidden" style={{ height: 44 }}>
        <div
          className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, #FAFAF7, transparent)" }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, #FAFAF7, transparent)" }}
        />

        <motion.div
          className="flex items-center gap-8 absolute whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        >
          {[...PRACTICE_AREAS, ...PRACTICE_AREAS].map((area, i) => (
            <span key={i} className="flex items-center gap-8 flex-shrink-0">
              <span
                style={{
                  color: "#09090B",
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  fontSize: "clamp(15px, 1.5vw, 18px)",
                }}
              >
                {area}
              </span>
              <span
                style={{
                  color: SUIT_RED_DEEP,
                  fontFamily: "Playfair Display, serif",
                  fontStyle: "italic",
                  fontSize: 16,
                }}
              >
                ✦
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Scroll hint                                                */
/* ────────────────────────────────────────────────────────── */
function ScrollHint() {
  return (
    <motion.div
      className="mt-20 sm:mt-24 flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
    >
      <span
        className="text-[10px] uppercase tracking-[0.25em] mb-4"
        style={{
          color: "#71717A",
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        }}
      >
        Selected work
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown
          className="w-5 h-5"
          style={{ color: "#09090B" }}
          strokeWidth={2}
        />
      </motion.div>
    </motion.div>
  );
}
