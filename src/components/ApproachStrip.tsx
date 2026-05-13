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
const PHASE_DURATION = 4400; // ms per scene

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

interface PhaseDef {
  id: string;
  num: string;
  name: string;
  tagline: string;
  caption: string;
}

const PHASES: PhaseDef[] = [
  { id: "idea",   num: "01", name: "IDEA",   tagline: "the spark",     caption: '"What if AI could think with me?"' },
  { id: "design", num: "02", name: "DESIGN", tagline: "the blueprint", caption: "Wireframing the brain." },
  { id: "code",   num: "03", name: "CODE",   tagline: "the build",     caption: "Teaching JARVIS to think." },
  { id: "deploy", num: "04", name: "DEPLOY", tagline: "online",        caption: '"Good morning, sir."' },
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
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          left: "-10%",
          width: 500,
          height: 500,
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
          width: 550,
          height: 550,
          background:
            "radial-gradient(circle, rgba(180,83,9,0.08) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

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
          <JarvisOriginStory />
        </div>

        <PracticeMarquee />

        <ScrollHint />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Section header                                            */
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
          style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
        >
          Section //01
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.25em]"
          style={{ color: "#A1A1AA", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
        >
          How I built JARVIS
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
          idea · design · code · deploy
        </p>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  JarvisOriginStory — 4-scene cartoon-3D sequence           */
/* ══════════════════════════════════════════════════════════ */
function JarvisOriginStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(-1);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === -1) setPhase(0);
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [phase, run]);

  useEffect(() => {
    if (phase < 0 || phase >= 4) return;
    const t = setTimeout(() => setPhase((p) => p + 1), PHASE_DURATION);
    return () => clearTimeout(t);
  }, [phase]);

  const replay = () => {
    setPhase(-1);
    setRun((r) => r + 1);
    setTimeout(() => setPhase(0), 100);
  };

  const current = phase >= 0 && phase < 4 ? PHASES[phase] : null;

  return (
    <div
      ref={ref}
      className="relative mx-auto overflow-hidden rounded-2xl"
      style={{
        maxWidth: 980,
        backgroundColor: PANEL_BG,
        border: "1px solid rgba(220,38,38,0.25)",
        boxShadow:
          "0 40px 80px -30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(251,191,36,0.06)",
      }}
    >
      <PanelChrome phase={phase} />

      {/* Stage */}
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(360px, 50vh, 460px)" }}
      >
        <Stars />

        <AnimatePresence mode="wait">
          {phase === 0 && <IdeaScene key={`idea-${run}`} />}
          {phase === 1 && <DesignScene key={`design-${run}`} />}
          {phase === 2 && <CodeScene key={`code-${run}`} />}
          {phase === 3 && <DeployScene key={`deploy-${run}`} />}
          {phase === 4 && <FinalState key={`final-${run}`} onReplay={replay} />}
        </AnimatePresence>
      </div>

      {/* Phase caption strip */}
      <PhaseCaption current={current} phase={phase} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  PanelChrome — top window bar with phase pills              */
/* ────────────────────────────────────────────────────────── */
function PanelChrome({ phase }: { phase: number }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 relative z-10"
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
          fontSize: 10.5,
          color: SUIT_GOLD,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        Stark Industries // J.A.R.V.I.S
      </span>

      <div className="flex items-center gap-1.5">
        {PHASES.map((p, i) => {
          const active = phase === i;
          const done = phase > i;
          return (
            <div
              key={p.id}
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: done ? SUIT_GOLD : active ? SUIT_RED : "rgba(244,244,245,0.15)",
                boxShadow: active ? `0 0 6px ${SUIT_RED}` : done ? `0 0 6px ${SUIT_GOLD}` : "none",
                transition: "background-color 0.3s, box-shadow 0.3s",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Stars — subtle background twinkling                       */
/* ────────────────────────────────────────────────────────── */
function Stars() {
  const positions = [
    [12, 18], [85, 25], [42, 12], [70, 75], [22, 80], [55, 30],
    [90, 60], [8, 50], [60, 88], [35, 65], [78, 8], [48, 55],
  ];
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      {positions.map(([x, y], i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            top: `${y}%`,
            left: `${x}%`,
            width: 2,
            height: 2,
            backgroundColor: SUIT_GOLD,
          }}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.2, 0.8] }}
          transition={{
            duration: 2 + (i % 4) * 0.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  PhaseCaption — bottom of panel                             */
/* ────────────────────────────────────────────────────────── */
function PhaseCaption({ current, phase }: { current: PhaseDef | null; phase: number }) {
  return (
    <div
      className="relative h-16 px-4 sm:px-6 flex items-center justify-between"
      style={{
        borderTop: "1px solid rgba(220, 38, 38, 0.15)",
        backgroundColor: "rgba(10, 6, 6, 0.7)",
      }}
    >
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.35 }}
            className="flex items-baseline gap-3 min-w-0 flex-1"
          >
            <span
              style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 11,
                color: "#F4F4F5",
                letterSpacing: "0.12em",
              }}
            >
              {">"} {current.num} · {current.name}
            </span>
            <span
              className="hidden sm:inline-block truncate"
              style={{
                fontFamily: "Playfair Display, serif",
                fontStyle: "italic",
                fontSize: 13,
                color: "rgba(244,244,245,0.6)",
              }}
            >
              — {current.caption}
            </span>
          </motion.div>
        )}

        {phase === 4 && (
          <motion.div
            key="final-caption"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-baseline gap-3 min-w-0 flex-1"
          >
            <span
              style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 11,
                color: SUIT_GOLD_BRIGHT,
                letterSpacing: "0.12em",
                fontWeight: 600,
              }}
            >
              {">"} ALL SYSTEMS ONLINE
            </span>
            <span
              className="hidden sm:inline-block"
              style={{
                fontFamily: "Playfair Display, serif",
                fontStyle: "italic",
                fontSize: 13,
                color: "rgba(244,244,245,0.6)",
              }}
            >
              — ready to ship.
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <span
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 10,
          color: "rgba(244,244,245,0.4)",
          letterSpacing: "0.15em",
        }}
      >
        {phase >= 0 && phase < 4 ? `${phase + 1}/4` : phase === 4 ? "4/4" : "0/4"}
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  SCENE 1 — IDEA (Lightbulb pops up with sparkles)          */
/* ══════════════════════════════════════════════════════════ */
function IdeaScene() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Pulse rings */}
      {[0, 0.7, 1.4].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            border: `2px solid ${SUIT_GOLD}`,
            opacity: 0.5,
          }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{ width: 300, height: 300, opacity: [0, 0.6, 0] }}
          transition={{ duration: 2.1, delay, repeat: Infinity, ease: "easeOut" }}
        />
      ))}

      {/* Sparkles around the bulb */}
      {[0, 40, 90, 130, 180, 220, 270, 320].map((angle, i) => (
        <Sparkle key={angle} angle={angle} delay={0.6 + i * 0.08} />
      ))}

      {/* Lightbulb */}
      <motion.div
        className="relative"
        initial={{ scale: 0, y: -50, rotate: -20 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 11, delay: 0.2 }}
      >
        <motion.div
          animate={{ rotate: [-2, 2, -2], y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bulb />
        </motion.div>
      </motion.div>

      {/* "AHA!" burst text */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ top: "20%", left: "62%" }}
        initial={{ scale: 0, rotate: -8 }}
        animate={{ scale: [0, 1.2, 1], rotate: [-8, 12, 6] }}
        transition={{
          scale: { duration: 0.6, delay: 0.7, ease: [0.23, 1, 0.32, 1] },
          rotate: { duration: 0.6, delay: 0.7 },
        }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(24px, 4vw, 40px)",
            color: SUIT_GOLD_BRIGHT,
            textShadow: `0 0 12px ${SUIT_GOLD}, 0 2px 0 ${SUIT_RED_DEEP}`,
            letterSpacing: "-0.02em",
            display: "inline-block",
          }}
        >
          AHA!
        </span>
      </motion.div>
    </motion.div>
  );
}

function Sparkle({ angle, delay }: { angle: number; delay: number }) {
  const radius = 130;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;
  return (
    <motion.div
      className="absolute"
      style={{ width: 12, height: 12, top: "50%", left: "50%", marginTop: -6, marginLeft: -6 }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{
        x: [0, x],
        y: [0, y],
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
      }}
      transition={{
        duration: 1.6,
        delay,
        repeat: Infinity,
        repeatDelay: 0.4,
        ease: "easeOut",
      }}
    >
      <svg viewBox="0 0 12 12" width="12" height="12">
        <path
          d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z"
          fill={SUIT_GOLD_BRIGHT}
        />
      </svg>
    </motion.div>
  );
}

function Bulb() {
  return (
    <svg viewBox="0 0 160 220" width="140" height="192">
      {/* Outer glow */}
      <defs>
        <radialGradient id="bulbGlow" cx="50%" cy="40%">
          <stop offset="0%" stopColor={SUIT_GOLD_BRIGHT} stopOpacity="0.8" />
          <stop offset="60%" stopColor={SUIT_GOLD} stopOpacity="0.3" />
          <stop offset="100%" stopColor={SUIT_GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Glass bulb */}
      <ellipse cx="80" cy="80" rx="60" ry="68" fill="url(#bulbGlow)" />
      <ellipse cx="80" cy="80" rx="60" ry="68" fill="rgba(251, 191, 36, 0.08)" stroke={SUIT_GOLD} strokeWidth="3" />

      {/* Filament */}
      <motion.g
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M60 85 Q70 70, 80 85 Q90 100, 100 85"
          fill="none"
          stroke={SUIT_GOLD_BRIGHT}
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line x1="60" y1="85" x2="56" y2="105" stroke={SUIT_GOLD} strokeWidth="2" />
        <line x1="100" y1="85" x2="104" y2="105" stroke={SUIT_GOLD} strokeWidth="2" />
      </motion.g>

      {/* "JARVIS?" label inside bulb */}
      <text
        x="80"
        y="60"
        textAnchor="middle"
        fill={SUIT_RED}
        fontSize="13"
        fontWeight="700"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.15em"
      >
        JARVIS?
      </text>

      {/* Screw threads (cartoon style) */}
      <rect x="62" y="138" width="36" height="10" rx="2" fill="#71717A" />
      <rect x="58" y="150" width="44" height="6" rx="2" fill="#52525B" />
      <rect x="60" y="158" width="40" height="6" rx="2" fill="#71717A" />
      <rect x="62" y="166" width="36" height="6" rx="2" fill="#52525B" />
      <rect x="64" y="174" width="32" height="8" rx="2" fill="#71717A" />
      <rect x="70" y="184" width="20" height="12" rx="2" fill="#27272A" />
      <circle cx="80" cy="200" r="6" fill="#18181B" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  SCENE 2 — DESIGN (Wireframe JARVIS face materializes)     */
/* ══════════════════════════════════════════════════════════ */
function DesignScene() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Scan line */}
      <motion.div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: 2,
          background: `linear-gradient(to bottom, transparent, ${SUIT_RED}, transparent)`,
          boxShadow: `0 0 24px ${SUIT_RED}`,
        }}
        initial={{ left: "0%", opacity: 0 }}
        animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, ease: "linear", delay: 0.1 }}
      />

      {/* JARVIS face */}
      <motion.div
        className="relative"
        initial={{ scale: 0.7, opacity: 0, rotateY: -25 }}
        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.4 }}
      >
        <motion.div
          animate={{ rotateY: [-5, 5, -5] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          style={{ perspective: "800px" }}
        >
          <JarvisFace />
        </motion.div>
      </motion.div>

      {/* Floating UI panels */}
      <FloatingPanel x={-180} y={-90} delay={1.0} label="frame.01" />
      <FloatingPanel x={180}  y={-90} delay={1.15} label="frame.02" />
      <FloatingPanel x={-180} y={90}  delay={1.3} label="frame.03" />
      <FloatingPanel x={180}  y={90}  delay={1.45} label="frame.04" />
    </motion.div>
  );
}

function JarvisFace() {
  return (
    <svg viewBox="0 0 240 280" width="220" height="256">
      {/* Outer hexagonal head shape */}
      <motion.path
        d="M120 24 L200 70 L200 188 L160 246 L80 246 L40 188 L40 70 Z"
        fill="rgba(220, 38, 38, 0.06)"
        stroke={SUIT_RED}
        strokeWidth="2.5"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { duration: 1, delay: 0.5, ease: "easeOut" }, opacity: { duration: 0.3, delay: 0.5 } }}
      />

      {/* Internal grid lines */}
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.4 }}
      >
        <line x1="40" y1="105" x2="200" y2="105" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="40" y1="170" x2="200" y2="170" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="120" y1="24" x2="120" y2="246" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
      </motion.g>

      {/* Eyes */}
      <motion.circle
        cx="80" cy="125" r="14"
        fill={SUIT_GOLD}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 12, delay: 1.0 }}
      />
      <motion.circle
        cx="160" cy="125" r="14"
        fill={SUIT_GOLD}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 12, delay: 1.1 }}
      />

      {/* Pulsing inner pupils */}
      <motion.circle
        cx="80" cy="125" r="6"
        fill={SUIT_GOLD_BRIGHT}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 1.4 }}
      />
      <motion.circle
        cx="160" cy="125" r="6"
        fill={SUIT_GOLD_BRIGHT}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 1.4 }}
      />

      {/* Mouth bars */}
      <motion.g
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.5 }}
      >
        <rect x="70" y="190" width="100" height="6" rx="2" fill={SUIT_GOLD} opacity="0.45" />
        <rect x="76" y="202" width="88" height="5" rx="2" fill={SUIT_GOLD} opacity="0.35" />
        <rect x="82" y="213" width="76" height="4" rx="2" fill={SUIT_GOLD} opacity="0.25" />
      </motion.g>

      {/* Corner brackets */}
      {[
        { x1: 30, y1: 30, x2: 50, y2: 30 },
        { x1: 30, y1: 30, x2: 30, y2: 50 },
        { x1: 190, y1: 30, x2: 210, y2: 30 },
        { x1: 210, y1: 30, x2: 210, y2: 50 },
        { x1: 30, y1: 230, x2: 30, y2: 250 },
        { x1: 30, y1: 250, x2: 50, y2: 250 },
        { x1: 210, y1: 230, x2: 210, y2: 250 },
        { x1: 190, y1: 250, x2: 210, y2: 250 },
      ].map((b, i) => (
        <motion.line
          key={i}
          x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}
          stroke={SUIT_GOLD}
          strokeWidth="2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.3, delay: 1.55 + i * 0.03 }}
        />
      ))}
    </svg>
  );
}

function FloatingPanel({ x, y, delay, label }: { x: number; y: number; delay: number; label: string }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: "50%", top: "50%" }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{ x, y, scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 14, delay }}
    >
      <motion.div
        className="rounded-md px-2 py-1"
        style={{
          backgroundColor: "rgba(220, 38, 38, 0.08)",
          border: `1px solid ${SUIT_RED}`,
          transform: "translate(-50%, -50%)",
          minWidth: 70,
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay }}
      >
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 9,
            color: SUIT_GOLD,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  SCENE 3 — CODE (Orbiting code blocks + neural core)       */
/* ══════════════════════════════════════════════════════════ */
function CodeScene() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Neural core */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.2 }}
      >
        {/* Outer glow */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 180,
            height: 180,
            background: `radial-gradient(circle, ${SUIT_RED} 0%, transparent 65%)`,
            opacity: 0.4,
          }}
          animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Rotating outer ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 130, height: 130,
            border: `2px dashed ${SUIT_GOLD}`,
            opacity: 0.65,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        {/* Core */}
        <motion.div
          className="relative rounded-full flex items-center justify-center"
          style={{
            width: 80,
            height: 80,
            background: `radial-gradient(circle, ${SUIT_GOLD_BRIGHT} 0%, ${SUIT_GOLD} 50%, ${SUIT_RED} 100%)`,
            boxShadow: `0 0 30px ${SUIT_GOLD}`,
          }}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 14,
              color: "#0A0606",
              letterSpacing: "0.05em",
            }}
          >
            AI
          </span>
        </motion.div>
      </motion.div>

      {/* Orbiting code blocks */}
      {[
        { file: "JARVIS.tsx", angle: 0,   delay: 0.5 },
        { file: "brain.ts",   angle: 90,  delay: 0.65 },
        { file: "memory.ts",  angle: 180, delay: 0.8 },
        { file: "protocol.js", angle: 270, delay: 0.95 },
      ].map((b) => (
        <OrbitBlock key={b.file} {...b} />
      ))}

      {/* Stream lines */}
      <CodeStream />
    </motion.div>
  );
}

function OrbitBlock({ file, angle, delay }: { file: string; angle: number; delay: number }) {
  const radius = 170;
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;

  return (
    <motion.div
      className="absolute"
      style={{ top: "50%", left: "50%" }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{ x, y, scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 16, delay }}
    >
      <motion.div
        className="rounded-md px-3 py-1.5"
        style={{
          backgroundColor: PANEL_BG,
          border: `1px solid ${SUIT_GOLD}`,
          boxShadow: `0 0 12px rgba(251, 191, 36, 0.3)`,
          transform: "translate(-50%, -50%)",
          whiteSpace: "nowrap",
        }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 2 + (angle / 90) * 0.4, repeat: Infinity, ease: "easeInOut" }}
      >
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 11,
            color: SUIT_GOLD_BRIGHT,
            letterSpacing: "0.04em",
          }}
        >
          {file}
        </span>
      </motion.div>
    </motion.div>
  );
}

function CodeStream() {
  const lines = [
    "function think() {",
    "  await learn(...);",
    "  return wisdom;",
    "}",
  ];
  return (
    <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex flex-col gap-1">
      {lines.map((line, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.5, x: 0 }}
          transition={{ duration: 0.4, delay: 1.5 + i * 0.18 }}
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 10,
            color: "rgba(244, 244, 245, 0.4)",
          }}
        >
          {line}
        </motion.span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  SCENE 4 — DEPLOY (Helmet drops, HUD activates)            */
/* ══════════════════════════════════════════════════════════ */
function DeployScene() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Light beam from above */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: 0,
          left: "50%",
          width: 160,
          height: "100%",
          background: `linear-gradient(to bottom, ${SUIT_GOLD}, transparent)`,
          opacity: 0.18,
          transform: "translateX(-50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.25, 0.18] }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />

      {/* Helmet drops in */}
      <motion.div
        className="relative"
        initial={{ y: -240, rotate: -6, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -6, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Helmet />
        </motion.div>
      </motion.div>

      {/* Impact ripple */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{ border: `2px solid ${SUIT_GOLD}` }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: 320, height: 320, opacity: [0, 0.7, 0] }}
        transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
      />

      {/* HUD corner brackets */}
      <HUDBracket pos="tl" delay={1.4} />
      <HUDBracket pos="tr" delay={1.5} />
      <HUDBracket pos="bl" delay={1.6} />
      <HUDBracket pos="br" delay={1.7} />

      {/* "JARVIS ONLINE" text */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.8 }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: "rgba(251, 191, 36, 0.15)",
            border: `1px solid ${SUIT_GOLD}`,
            boxShadow: `0 0 18px rgba(251, 191, 36, 0.4)`,
          }}
        >
          <motion.span
            className="w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: SUIT_GOLD_BRIGHT }}
            animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          />
          <span
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 11,
              color: SUIT_GOLD_BRIGHT,
              letterSpacing: "0.22em",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            JARVIS · Online
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Helmet() {
  return (
    <svg viewBox="0 0 240 280" width="200" height="234">
      {/* Helmet shell */}
      <path
        d="M120 22 Q170 22, 182 56 Q192 88, 188 118 L186 152 Q180 192, 162 220 Q148 240, 120 248 Q92 240, 78 220 Q60 192, 54 152 L52 118 Q48 88, 58 56 Q70 22, 120 22 Z"
        fill={SUIT_RED}
        stroke={SUIT_GOLD}
        strokeWidth="3"
        strokeLinejoin="round"
      />

      {/* Center face plate seam */}
      <line x1="120" y1="60" x2="120" y2="240" stroke={SUIT_GOLD} strokeWidth="1" opacity="0.4" />

      {/* Brow */}
      <path d="M68 110 Q120 100, 172 110" fill="none" stroke={SUIT_GOLD} strokeWidth="1.2" opacity="0.55" />

      {/* Eye slits */}
      <motion.path
        d="M72 130 L108 130 L100 148 L72 148 Z"
        fill={SUIT_GOLD_BRIGHT}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 0.8 }}
      />
      <motion.path
        d="M132 130 L168 130 L168 148 L140 148 Z"
        fill={SUIT_GOLD_BRIGHT}
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.4, repeat: Infinity, delay: 0.8 }}
      />

      {/* Cheek plates */}
      <path d="M58 156 Q75 168, 82 184" fill="none" stroke={SUIT_GOLD} strokeWidth="1" opacity="0.4" />
      <path d="M182 156 Q165 168, 158 184" fill="none" stroke={SUIT_GOLD} strokeWidth="1" opacity="0.4" />

      {/* Mouth vents */}
      <line x1="86" y1="200" x2="154" y2="200" stroke={SUIT_GOLD} strokeWidth="2" />
      <line x1="90" y1="206" x2="150" y2="206" stroke={SUIT_GOLD} strokeWidth="1.4" opacity="0.75" />
      <line x1="94" y1="212" x2="146" y2="212" stroke={SUIT_GOLD} strokeWidth="1" opacity="0.5" />
    </svg>
  );
}

function HUDBracket({ pos, delay }: { pos: "tl" | "tr" | "bl" | "br"; delay: number }) {
  const map: Record<string, { top?: string; bottom?: string; left?: string; right?: string }> = {
    tl: { top: "16px", left: "16px" },
    tr: { top: "16px", right: "16px" },
    bl: { bottom: "60px", left: "16px" },
    br: { bottom: "60px", right: "16px" },
  };
  const flipH = pos.endsWith("r");
  const flipV = pos.startsWith("b");

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ ...map[pos], width: 26, height: 26 }}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className="absolute"
        style={{
          [flipH ? "right" : "left"]: 0,
          [flipV ? "bottom" : "top"]: 0,
          width: 16,
          height: 2,
          backgroundColor: SUIT_GOLD,
        }}
      />
      <div
        className="absolute"
        style={{
          [flipH ? "right" : "left"]: 0,
          [flipV ? "bottom" : "top"]: 0,
          width: 2,
          height: 16,
          backgroundColor: SUIT_GOLD,
        }}
      />
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  FinalState — replay UI                                    */
/* ══════════════════════════════════════════════════════════ */
function FinalState({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 flex flex-col items-center justify-center gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Big core badge */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 200,
            height: 200,
            border: `2px solid ${SUIT_GOLD}`,
            opacity: 0.4,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 140,
            height: 140,
            border: `1.5px dashed ${SUIT_GOLD}`,
            opacity: 0.5,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        />
        <div
          className="relative w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: `radial-gradient(circle, ${SUIT_GOLD_BRIGHT} 0%, ${SUIT_GOLD} 50%, ${SUIT_RED} 100%)`,
            boxShadow: `0 0 40px ${SUIT_GOLD}, inset 0 0 16px rgba(255,255,255,0.25)`,
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 16,
              color: "#0A0606",
              letterSpacing: "0.08em",
            }}
          >
            J.A.R.V.I.S
          </span>
        </div>
      </motion.div>

      {/* Replay button */}
      <motion.button
        onClick={onReplay}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-yellow-500/10 active:scale-[0.96]"
        style={{
          border: `1.5px solid ${SUIT_GOLD}`,
          color: SUIT_GOLD,
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          backgroundColor: "rgba(251, 191, 36, 0.05)",
        }}
      >
        <RefreshCw className="w-3.5 h-3.5" strokeWidth={2.2} />
        <span>Replay origin</span>
      </motion.button>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Practice marquee + scroll hint                            */
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
          style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
        >
          Practice areas
        </span>
        <span
          className="text-[10px] uppercase tracking-[0.22em]"
          style={{ color: "#A1A1AA", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
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
        style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
      >
        Selected work
      </span>
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <ArrowDown className="w-5 h-5" style={{ color: "#09090B" }} strokeWidth={2} />
      </motion.div>
    </motion.div>
  );
}
