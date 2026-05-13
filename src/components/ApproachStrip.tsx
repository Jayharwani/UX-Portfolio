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
const PHASE_DURATION = 4600;

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
          background: "radial-gradient(circle, rgba(185,28,28,0.08) 0%, transparent 65%)",
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
          background: "radial-gradient(circle, rgba(180,83,9,0.08) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      <div className="absolute inset-0 pointer-events-none hidden lg:flex justify-between max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-px h-full" style={{ backgroundColor: "rgba(15,23,42,0.04)" }} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        <Header />
        <div className="mt-12 sm:mt-16">
          <WorkshopPanel />
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
        <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
          Section //01
        </span>
        <span className="text-[10px] uppercase tracking-[0.25em]" style={{ color: "#A1A1AA", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
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
/*  WorkshopPanel — Tony's holographic workshop               */
/* ══════════════════════════════════════════════════════════ */
function WorkshopPanel() {
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
        boxShadow: "0 40px 80px -30px rgba(0,0,0,0.55), inset 0 1px 0 rgba(251,191,36,0.06)",
      }}
    >
      <PanelChrome phase={phase} />

      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(420px, 56vh, 520px)" }}
      >
        <Stars />
        <FloorGrid />

        {/* Tony — always centered, always visible */}
        <TonySilhouette phase={phase} />

        {/* Holographic objects swap per phase */}
        <AnimatePresence mode="wait">
          {phase === 0 && <IdeaPhase key={`idea-${run}`} />}
          {phase === 1 && <DesignPhase key={`design-${run}`} />}
          {phase === 2 && <CodePhase key={`code-${run}`} />}
          {phase === 3 && <DeployPhase key={`deploy-${run}`} />}
          {phase === 4 && <OnlineState key={`online-${run}`} onReplay={replay} />}
        </AnimatePresence>
      </div>

      <PhaseCaption current={current} phase={phase} />
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  PanelChrome                                                */
/* ────────────────────────────────────────────────────────── */
function PanelChrome({ phase }: { phase: number }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 relative z-30"
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
        Stark Industries // Workshop
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
                boxShadow: active
                  ? `0 0 6px ${SUIT_RED}`
                  : done
                  ? `0 0 6px ${SUIT_GOLD}`
                  : "none",
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
/*  PhaseCaption — bottom strip                                */
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
            key="final"
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
              {">"} J.A.R.V.I.S — ONLINE
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

/* ────────────────────────────────────────────────────────── */
/*  Stars + Floor                                              */
/* ────────────────────────────────────────────────────────── */
function Stars() {
  const positions = [
    [12, 18], [85, 22], [42, 12], [70, 28], [22, 30],
    [55, 16], [90, 35], [8, 40], [60, 18], [35, 38],
    [78, 10], [48, 32],
  ];
  return (
    <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
      {positions.map(([x, y], i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{ top: `${y}%`, left: `${x}%`, width: 2, height: 2, backgroundColor: SUIT_GOLD }}
          animate={{ opacity: [0.1, 0.7, 0.1], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2 + (i % 4) * 0.5, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function FloorGrid() {
  return (
    <svg
      className="absolute bottom-0 left-0 right-0 pointer-events-none z-0"
      viewBox="0 0 1000 180"
      preserveAspectRatio="none"
      style={{ height: "38%", opacity: 0.55 }}
    >
      <defs>
        <linearGradient id="floorFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={SUIT_GOLD} stopOpacity="0.0" />
          <stop offset="100%" stopColor={SUIT_GOLD} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Horizontal lines, denser toward bottom (closer) */}
      {[10, 30, 55, 85, 120, 165].map((y, i) => (
        <line
          key={y}
          x1="0" y1={y} x2="1000" y2={y}
          stroke="url(#floorFade)"
          strokeWidth={0.6 + i * 0.2}
        />
      ))}

      {/* Vertical lines converging to vanishing point at (500, 0) */}
      {[-400, -200, -50, 0, 50, 200, 400].map((offset) => (
        <line
          key={offset}
          x1={500 + offset} y1="180"
          x2={500 + offset * 0.18} y2="0"
          stroke={SUIT_GOLD}
          strokeWidth="0.8"
          opacity="0.22"
        />
      ))}
      {/* Outer wide lines */}
      {[-900, 900].map((offset) => (
        <line
          key={offset}
          x1={500 + offset} y1="180"
          x2={500 + offset * 0.18} y2="0"
          stroke={SUIT_GOLD}
          strokeWidth="0.8"
          opacity="0.18"
        />
      ))}
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  TonySilhouette — always centered                          */
/* ══════════════════════════════════════════════════════════ */
function TonySilhouette({ phase }: { phase: number }) {
  /* Subtle head tilt during phase 1 (idea moment) */
  const headTilt = phase === 0 ? [0, -4, 0, 3, 0] : 0;

  return (
    <motion.div
      className="absolute z-10 pointer-events-none"
      style={{
        left: "50%",
        bottom: "8%",
        transform: "translateX(-50%)",
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Idle breathing */}
      <motion.div
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 200 240" width="160" height="192" style={{ display: "block" }}>
          {/* Shoulders / body */}
          <path
            d="M30 230 Q30 165, 65 152 L135 152 Q170 165, 170 230 Z"
            fill="#1A0A0A"
            stroke={SUIT_RED}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />

          {/* Collar gap */}
          <path
            d="M85 152 Q100 168, 115 152"
            fill="#0A0606"
            stroke={SUIT_RED}
            strokeWidth="1.2"
            opacity="0.7"
          />

          {/* Neck */}
          <rect x="88" y="135" width="24" height="22" fill="#1A0A0A" stroke={SUIT_RED} strokeWidth="1.4" />

          {/* Head with breathing-driven tilt */}
          <motion.g
            animate={{ rotate: headTilt }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 140px" }}
          >
            {/* Head ellipse */}
            <ellipse
              cx="100" cy="90"
              rx="40" ry="50"
              fill="#1A0A0A"
              stroke={SUIT_RED}
              strokeWidth="1.6"
            />

            {/* Hair (slicked back with peak) */}
            <path
              d="M62 70 Q70 38, 100 38 Q130 38, 138 70 Q130 50, 100 50 Q70 50, 62 70 Z"
              fill="#0A0606"
            />
            {/* Hair side sweep */}
            <path
              d="M62 70 Q68 60, 75 72"
              stroke="#0A0606"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />

            {/* Eyes — small gold glints */}
            <circle cx="84" cy="88" r="2" fill={SUIT_GOLD_BRIGHT} />
            <circle cx="116" cy="88" r="2" fill={SUIT_GOLD_BRIGHT} />

            {/* Eyebrows */}
            <path d="M78 80 L90 78" stroke="#0A0606" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M110 78 L122 80" stroke="#0A0606" strokeWidth="1.6" strokeLinecap="round" />

            {/* Nose hint */}
            <path d="M100 95 L96 108 L100 110" stroke="#5A1010" strokeWidth="1" fill="none" strokeLinecap="round" />

            {/* Moustache */}
            <path
              d="M86 115 Q93 113, 100 115 Q107 113, 114 115"
              stroke="#0A0606"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />

            {/* Goatee (signature) */}
            <path
              d="M88 122 L100 125 L112 122 L106 140 L100 142 L94 140 Z"
              fill="#0A0606"
            />
          </motion.g>

          {/* Arc reactor on chest (FOCAL POINT) */}
          <g transform="translate(100, 196)">
            {/* Outer glow */}
            <motion.circle
              r="22"
              fill={SUIT_GOLD}
              opacity="0.25"
              animate={{ opacity: [0.18, 0.35, 0.18], scale: [0.92, 1.08, 0.92] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Ring */}
            <circle r="14" fill="none" stroke={SUIT_GOLD} strokeWidth="1.6" />
            {/* Inner glow */}
            <motion.circle
              r="10"
              fill={SUIT_GOLD_BRIGHT}
              animate={{ opacity: [0.85, 1, 0.85], scale: [0.95, 1.05, 0.95] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* White core */}
            <circle r="5" fill="#FFFFFF" />
            {/* Tick marks */}
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <line
                key={deg}
                x1="0" y1="-13" x2="0" y2="-10"
                stroke={SUIT_GOLD_BRIGHT}
                strokeWidth="1.3"
                opacity="0.85"
                style={{ transformOrigin: "center", transform: `rotate(${deg}deg)` }}
              />
            ))}
          </g>
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 1 — IDEA (lightbulb pops above Tony's head)         */
/* ══════════════════════════════════════════════════════════ */
function IdeaPhase() {
  return (
    <motion.div
      className="absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Pulse rings ABOVE Tony's head */}
      <div className="absolute" style={{ left: "50%", top: "12%", transform: "translateX(-50%)" }}>
        {[0, 0.7, 1.4].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              border: `2px solid ${SUIT_GOLD}`,
              opacity: 0.5,
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ width: 200, height: 200, opacity: [0, 0.55, 0] }}
            transition={{ duration: 2.1, delay, repeat: Infinity, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Sparkles around the bulb */}
      <div className="absolute" style={{ left: "50%", top: "20%", transform: "translate(-50%, -50%)" }}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <Sparkle key={angle} angle={angle} delay={0.5 + i * 0.08} radius={100} />
        ))}
      </div>

      {/* Lightbulb */}
      <motion.div
        className="absolute"
        style={{ left: "50%", top: "22%", transform: "translate(-50%, -50%)" }}
        initial={{ scale: 0, y: -40, rotate: -25 }}
        animate={{ scale: 1, y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 11, delay: 0.15 }}
      >
        <motion.div
          animate={{ rotate: [-3, 3, -3], y: [0, -4, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Bulb />
        </motion.div>
      </motion.div>

      {/* "AHA!" burst */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: "62%", top: "30%" }}
        initial={{ scale: 0, rotate: -10 }}
        animate={{ scale: [0, 1.25, 1], rotate: [-10, 12, 6] }}
        transition={{
          scale: { duration: 0.6, delay: 0.8, ease: [0.23, 1, 0.32, 1] },
          rotate: { duration: 0.6, delay: 0.8 },
        }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 800,
            fontSize: "clamp(20px, 3.5vw, 34px)",
            color: SUIT_GOLD_BRIGHT,
            textShadow: `0 0 12px ${SUIT_GOLD}, 0 2px 0 ${SUIT_RED_DEEP}`,
            letterSpacing: "-0.02em",
          }}
        >
          AHA!
        </span>
      </motion.div>
    </motion.div>
  );
}

function Sparkle({ angle, delay, radius }: { angle: number; delay: number; radius: number }) {
  const x = Math.cos((angle * Math.PI) / 180) * radius;
  const y = Math.sin((angle * Math.PI) / 180) * radius;
  return (
    <motion.div
      className="absolute"
      style={{ width: 12, height: 12, left: 0, top: 0, marginLeft: -6, marginTop: -6 }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{ x: [0, x], y: [0, y], scale: [0, 1, 0], opacity: [0, 1, 0] }}
      transition={{ duration: 1.6, delay, repeat: Infinity, repeatDelay: 0.4, ease: "easeOut" }}
    >
      <svg viewBox="0 0 12 12" width="12" height="12">
        <path d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z" fill={SUIT_GOLD_BRIGHT} />
      </svg>
    </motion.div>
  );
}

function Bulb() {
  return (
    <svg viewBox="0 0 140 180" width="100" height="128">
      <defs>
        <radialGradient id="bulbGlow" cx="50%" cy="40%">
          <stop offset="0%" stopColor={SUIT_GOLD_BRIGHT} stopOpacity="0.8" />
          <stop offset="65%" stopColor={SUIT_GOLD} stopOpacity="0.3" />
          <stop offset="100%" stopColor={SUIT_GOLD} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="70" cy="65" rx="50" ry="56" fill="url(#bulbGlow)" />
      <ellipse cx="70" cy="65" rx="50" ry="56" fill="rgba(251,191,36,0.08)" stroke={SUIT_GOLD} strokeWidth="2.5" />

      <motion.g
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          d="M52 75 Q60 60, 70 75 Q80 90, 88 75"
          fill="none"
          stroke={SUIT_GOLD_BRIGHT}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line x1="52" y1="75" x2="48" y2="90" stroke={SUIT_GOLD} strokeWidth="1.6" />
        <line x1="88" y1="75" x2="92" y2="90" stroke={SUIT_GOLD} strokeWidth="1.6" />
      </motion.g>

      <text
        x="70" y="50"
        textAnchor="middle"
        fill={SUIT_RED}
        fontSize="10"
        fontWeight="700"
        fontFamily="ui-monospace, monospace"
        letterSpacing="0.15em"
      >
        JARVIS?
      </text>

      {/* Screw threads */}
      <rect x="54" y="118" width="32" height="8" rx="2" fill="#71717A" />
      <rect x="50" y="128" width="40" height="5" rx="2" fill="#52525B" />
      <rect x="52" y="135" width="36" height="5" rx="2" fill="#71717A" />
      <rect x="54" y="142" width="32" height="6" rx="2" fill="#52525B" />
      <rect x="58" y="150" width="24" height="10" rx="2" fill="#27272A" />
      <circle cx="70" cy="165" r="5" fill="#18181B" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 2 — DESIGN (wireframe JARVIS face in front of Tony) */
/* ══════════════════════════════════════════════════════════ */
function DesignPhase() {
  return (
    <motion.div
      className="absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Scan line */}
      <motion.div
        className="absolute top-0 bottom-0 pointer-events-none"
        style={{
          width: 2,
          background: `linear-gradient(to bottom, transparent, ${SUIT_RED}, transparent)`,
          boxShadow: `0 0 24px ${SUIT_RED}`,
        }}
        initial={{ left: "0%", opacity: 0 }}
        animate={{ left: "100%", opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.6, ease: "linear", delay: 0.1 }}
      />

      {/* Hologram face — positioned above-left of Tony's head */}
      <motion.div
        className="absolute"
        style={{ left: "50%", top: "32%", transform: "translate(-50%, -50%)" }}
        initial={{ scale: 0.5, opacity: 0, rotateY: -30 }}
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

      {/* Floating UI panels at corners */}
      <FloatingPanel x="14%" y="14%" delay={1.0} label="frame.01" />
      <FloatingPanel x="86%" y="14%" delay={1.15} label="frame.02" />
      <FloatingPanel x="14%" y="58%" delay={1.3} label="frame.03" />
      <FloatingPanel x="86%" y="58%" delay={1.45} label="frame.04" />
    </motion.div>
  );
}

function JarvisFace() {
  return (
    <svg viewBox="0 0 200 200" width="160" height="160">
      <motion.path
        d="M100 18 L165 56 L165 144 L130 184 L70 184 L35 144 L35 56 Z"
        fill="rgba(220, 38, 38, 0.06)"
        stroke={SUIT_RED}
        strokeWidth="2.5"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ pathLength: { duration: 1, delay: 0.4, ease: "easeOut" }, opacity: { duration: 0.3, delay: 0.4 } }}
      />

      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.3 }}
      >
        <line x1="35" y1="80" x2="165" y2="80" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="35" y1="130" x2="165" y2="130" stroke="rgba(251, 191, 36, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <line x1="100" y1="18" x2="100" y2="184" stroke="rgba(251, 191, 36, 0.15)" strokeWidth="1" strokeDasharray="3 3" />
      </motion.g>

      <motion.circle
        cx="68" cy="94" r="11"
        fill={SUIT_GOLD}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 12, delay: 0.9 }}
      />
      <motion.circle
        cx="132" cy="94" r="11"
        fill={SUIT_GOLD}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 280, damping: 12, delay: 1.0 }}
      />

      <motion.circle
        cx="68" cy="94" r="5"
        fill={SUIT_GOLD_BRIGHT}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 1.3 }}
      />
      <motion.circle
        cx="132" cy="94" r="5"
        fill={SUIT_GOLD_BRIGHT}
        animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.1, 0.8] }}
        transition={{ duration: 1.6, repeat: Infinity, delay: 1.3 }}
      />

      <motion.g
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.4 }}
      >
        <rect x="58" y="142" width="84" height="5" rx="2" fill={SUIT_GOLD} opacity="0.45" />
        <rect x="64" y="152" width="72" height="4" rx="2" fill={SUIT_GOLD} opacity="0.32" />
        <rect x="70" y="161" width="60" height="3" rx="2" fill={SUIT_GOLD} opacity="0.22" />
      </motion.g>
    </svg>
  );
}

function FloatingPanel({ x, y, delay, label }: { x: string; y: string; delay: number; label: string }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 14, delay }}
    >
      <motion.div
        className="rounded-md px-2 py-1"
        style={{
          backgroundColor: "rgba(220, 38, 38, 0.08)",
          border: `1px solid ${SUIT_RED}`,
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
/*  PHASE 3 — CODE (code blocks orbit around Tony)            */
/* ══════════════════════════════════════════════════════════ */
function CodePhase() {
  return (
    <motion.div
      className="absolute inset-0 z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Code blocks positioned around Tony */}
      <OrbitBlock file="// JARVIS.tsx" x="22%" y="22%" delay={0.3} />
      <OrbitBlock file="// brain.ts" x="78%" y="22%" delay={0.45} />
      <OrbitBlock file="// memory.ts" x="14%" y="55%" delay={0.6} />
      <OrbitBlock file="// protocol.js" x="86%" y="55%" delay={0.75} />

      {/* Glow halo around Tony */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          bottom: "12%",
          width: 200,
          height: 200,
          marginLeft: -100,
          background: `radial-gradient(circle, ${SUIT_RED} 0%, transparent 60%)`,
          opacity: 0.25,
          borderRadius: "50%",
        }}
        animate={{ opacity: [0.18, 0.32, 0.18], scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
      />

      {/* Background code stream */}
      <CodeStream />
    </motion.div>
  );
}

function OrbitBlock({ file, x, y, delay }: { file: string; x: string; y: string; delay: number }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y }}
      initial={{ scale: 0, opacity: 0, rotate: -8 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 14, delay }}
    >
      <motion.div
        className="rounded-md px-3 py-1.5"
        style={{
          backgroundColor: PANEL_BG,
          border: `1px solid ${SUIT_GOLD}`,
          boxShadow: `0 0 12px rgba(251, 191, 36, 0.3)`,
          whiteSpace: "nowrap",
        }}
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 2.2 + delay, repeat: Infinity, ease: "easeInOut" }}
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
    <div className="absolute bottom-3 left-3 pointer-events-none flex flex-col gap-0.5">
      {lines.map((line, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 0.4, x: 0 }}
          transition={{ duration: 0.4, delay: 1.2 + i * 0.15 }}
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 9.5,
            color: "rgba(244, 244, 245, 0.35)",
          }}
        >
          {line}
        </motion.span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 4 — DEPLOY (helmet drops, HUD activates)            */
/* ══════════════════════════════════════════════════════════ */
function DeployPhase() {
  return (
    <motion.div
      className="absolute inset-0 z-20"
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
          width: 140,
          height: "75%",
          background: `linear-gradient(to bottom, ${SUIT_GOLD}, transparent)`,
          opacity: 0.18,
          transform: "translateX(-50%)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.25, 0.18] }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />

      {/* Helmet — drops from above, lands just above Tony's chest area */}
      <motion.div
        className="absolute"
        style={{ left: "50%", top: "30%", transform: "translate(-50%, -50%)" }}
        initial={{ y: -200, rotate: -6, opacity: 0 }}
        animate={{ y: 0, rotate: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 160, damping: 12, delay: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -4, 0], rotate: [-1, 1, -1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Helmet />
        </motion.div>
      </motion.div>

      {/* Impact ripple around helmet landing */}
      <motion.div
        className="absolute rounded-full pointer-events-none"
        style={{
          left: "50%",
          top: "30%",
          transform: "translate(-50%, -50%)",
          border: `2px solid ${SUIT_GOLD}`,
        }}
        initial={{ width: 0, height: 0, opacity: 0 }}
        animate={{ width: 260, height: 260, opacity: [0, 0.65, 0] }}
        transition={{ duration: 1.2, delay: 1.0, ease: "easeOut" }}
      />

      {/* HUD corner brackets */}
      <HUDBracket pos="tl" delay={1.4} />
      <HUDBracket pos="tr" delay={1.5} />
      <HUDBracket pos="bl" delay={1.6} />
      <HUDBracket pos="br" delay={1.7} />

      {/* JARVIS · ONLINE pill */}
      <motion.div
        className="absolute bottom-6 left-1/2"
        style={{ transform: "translateX(-50%)" }}
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
            J.A.R.V.I.S · Online
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Helmet() {
  return (
    <svg viewBox="0 0 200 232" width="140" height="162">
      <path
        d="M100 16 Q142 16, 152 46 Q162 74, 158 100 L156 128 Q150 162, 134 188 Q120 206, 100 214 Q80 206, 66 188 Q50 162, 44 128 L42 100 Q40 74, 50 46 Q60 16, 100 16 Z"
        fill={SUIT_RED}
        stroke={SUIT_GOLD}
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
      <line x1="100" y1="50" x2="100" y2="206" stroke={SUIT_GOLD} strokeWidth="0.8" opacity="0.4" />
      <path d="M58 92 Q100 84, 142 92" fill="none" stroke={SUIT_GOLD} strokeWidth="1" opacity="0.5" />
      <motion.path
        d="M62 112 L92 112 L86 128 L62 128 Z"
        fill={SUIT_GOLD_BRIGHT}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
      />
      <motion.path
        d="M108 112 L138 112 L138 128 L116 128 Z"
        fill={SUIT_GOLD_BRIGHT}
        animate={{ opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }}
      />
      <line x1="72" y1="168" x2="128" y2="168" stroke={SUIT_GOLD} strokeWidth="1.8" />
      <line x1="76" y1="174" x2="124" y2="174" stroke={SUIT_GOLD} strokeWidth="1.2" opacity="0.7" />
      <line x1="80" y1="180" x2="120" y2="180" stroke={SUIT_GOLD} strokeWidth="0.8" opacity="0.5" />
    </svg>
  );
}

function HUDBracket({ pos, delay }: { pos: "tl" | "tr" | "bl" | "br"; delay: number }) {
  const flipH = pos.endsWith("r");
  const flipV = pos.startsWith("b");
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        top: flipV ? "auto" : 16,
        bottom: flipV ? 70 : "auto",
        left: flipH ? "auto" : 16,
        right: flipH ? 16 : "auto",
        width: 26,
        height: 26,
      }}
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
/*  OnlineState — final state with replay button              */
/* ══════════════════════════════════════════════════════════ */
function OnlineState({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(10, 6, 6, 0.55)",
          backdropFilter: "blur(2px)",
        }}
      />

      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
      >
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 180,
            height: 180,
            border: `2px solid ${SUIT_GOLD}`,
            opacity: 0.4,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 130,
            height: 130,
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
            boxShadow: `0 0 36px ${SUIT_GOLD}, inset 0 0 16px rgba(255,255,255,0.25)`,
          }}
        >
          <span
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: 15,
              color: "#0A0606",
              letterSpacing: "0.08em",
            }}
          >
            J.A.R.V.I.S
          </span>
        </div>
      </motion.div>

      <motion.button
        onClick={onReplay}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="relative inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:bg-yellow-500/10 active:scale-[0.96]"
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
        <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
          Practice areas
        </span>
        <span className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "#A1A1AA", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
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
