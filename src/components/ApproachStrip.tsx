import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";

/* ────────────────────────────────────────────────────────── */
/*  Practice areas marquee                                    */
/* ────────────────────────────────────────────────────────── */
const practiceAreas = [
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

/* Iron Man palette */
const SUIT_RED = "#DC2626";
const SUIT_GOLD = "#FBBF24";
const SUIT_GOLD_BRIGHT = "#FCD34D";
const PANEL_BG = "#0A0606";

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

        {/* ── Header ── */}
        <div className="grid grid-cols-12 gap-6 mb-12 sm:mb-16">
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

            <div className="flex items-center gap-2 mt-3">
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: SUIT_RED }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: SUIT_RED }}
                />
              </span>
              <span
                className="text-[10.5px] uppercase tracking-[0.2em]"
                style={{
                  color: "#7F1D1D",
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                }}
              >
                Mark V · Diagnostic
              </span>
            </div>
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
                  color: "#B91C1C",
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

        {/* ── The Stark boot sequence ── */}
        <StarkBootSequence />

        {/* ── Practice marquee ── */}
        <motion.div
          className="mt-20 sm:mt-28"
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
              {String(practiceAreas.length).padStart(2, "0")} domains
            </span>
          </div>

          <div className="relative overflow-hidden" style={{ height: "44px" }}>
            <div
              className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(to right, #FAFAF7, transparent)",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(to left, #FAFAF7, transparent)",
              }}
            />

            <motion.div
              className="flex items-center gap-8 absolute whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {[...practiceAreas, ...practiceAreas].map((area, i) => (
                <span
                  key={i}
                  className="flex items-center gap-8 flex-shrink-0"
                >
                  <span
                    className="text-[16px] sm:text-[18px]"
                    style={{
                      color: "#09090B",
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {area}
                  </span>
                  <span
                    style={{
                      color: "#B91C1C",
                      fontFamily: "Playfair Display, serif",
                      fontStyle: "italic",
                      fontSize: "16px",
                    }}
                  >
                    ✦
                  </span>
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Scroll hint ── */}
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
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  StarkBootSequence                                         */
/* ══════════════════════════════════════════════════════════ */

type Phase = 0 | 1 | 2 | 3 | 4 | 5;

/* All phases now 4 seconds — total 16s before settle */
const PHASE_DURATIONS: Record<number, number> = {
  1: 4000,
  2: 4000,
  3: 4000,
  4: 4000,
};

function StarkBootSequence() {
  const [phase, setPhase] = useState<Phase>(0);
  const [replayKey, setReplayKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && phase === 0) {
          setPhase(1);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [phase, replayKey]);

  useEffect(() => {
    if (phase === 0 || phase >= 5) return;
    const duration = PHASE_DURATIONS[phase] ?? 4000;
    const timer = setTimeout(
      () => setPhase((p) => (p + 1) as Phase),
      duration
    );
    return () => clearTimeout(timer);
  }, [phase]);

  const handleReplay = () => {
    setPhase(0);
    setReplayKey((k) => k + 1);
    setTimeout(() => setPhase(1), 80);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className="relative w-full overflow-hidden"
        style={{
          backgroundColor: PANEL_BG,
          borderRadius: "20px",
          border: `1px solid rgba(220, 38, 38, 0.25)`,
          boxShadow: `0 40px 90px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(251,191,36,0.06), 0 0 60px rgba(220,38,38,0.08)`,
          height: "clamp(520px, 66vh, 680px)",
        }}
      >
        {/* Workshop grid floor + vignette + grain */}
        <GridFloor />

        {/* Corner brackets + Iron Man emojis */}
        <CornerOrnaments />

        {/* Top chrome bar with module pills */}
        <ModuleStatusBar phase={phase} />

        {/* Center stage — phases play here */}
        <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-12 pt-16 pb-16">
          <AnimatePresence mode="wait">
            {phase === 1 && <SparkPhase key={`spark-${replayKey}`} />}
            {phase === 2 && <UXPhase key={`ux-${replayKey}`} />}
            {phase === 3 && <BuildPhase key={`build-${replayKey}`} />}
            {phase >= 4 && <LivePhase key={`live-${replayKey}`} dimmed={phase >= 5} />}
          </AnimatePresence>
        </div>

        {/* Center replay overlay — appears after final phase */}
        <AnimatePresence>
          {phase >= 5 && <CenterReplay onReplay={handleReplay} />}
        </AnimatePresence>

        {/* Bottom caption */}
        <BottomCaption phase={phase} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Workshop background — red-tinted grid + vignette          */
/* ────────────────────────────────────────────────────────── */
function GridFloor() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(220,38,38,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.06) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(10,6,6,0.7) 90%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          mixBlendMode: "screen",
        }}
      />
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Iron Man helmet SVG + corner ornaments                    */
/* ────────────────────────────────────────────────────────── */
function IronManHelmet({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Glow halo */}
      <ellipse cx="20" cy="20" rx="18" ry="18" fill={SUIT_RED} opacity="0.12" />
      {/* Helmet outline */}
      <path
        d="M20 4 L31 9 L32 19 L32 27 L29 31 L20 33 L11 31 L8 27 L8 19 L9 9 Z"
        fill={SUIT_RED}
        stroke={SUIT_GOLD}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      {/* Face plate sheen line */}
      <line x1="20" y1="10" x2="20" y2="30" stroke={SUIT_GOLD} strokeWidth="0.4" opacity="0.3" />
      {/* Brow line */}
      <path
        d="M11 15 Q20 13, 29 15"
        fill="none"
        stroke={SUIT_GOLD}
        strokeWidth="0.5"
        opacity="0.5"
      />
      {/* Left eye slit (triangle) */}
      <path d="M13 18 L17.5 18 L16.5 21 L13 21 Z" fill={SUIT_GOLD_BRIGHT} />
      {/* Right eye slit */}
      <path d="M22.5 18 L27 18 L27 21 L23.5 21 Z" fill={SUIT_GOLD_BRIGHT} />
      {/* Mouth vents */}
      <line x1="14" y1="26" x2="26" y2="26" stroke={SUIT_GOLD} strokeWidth="0.7" />
      <line x1="15" y1="27.6" x2="25" y2="27.6" stroke={SUIT_GOLD} strokeWidth="0.5" opacity="0.7" />
      <line x1="16" y1="29" x2="24" y2="29" stroke={SUIT_GOLD} strokeWidth="0.4" opacity="0.5" />
    </svg>
  );
}

function CornerOrnaments() {
  return (
    <>
      {/* L-bracket crosshairs in 4 corners */}
      {[
        { pos: "top-12 left-3", t: 0, l: 0 },
        { pos: "top-12 right-3", t: 0, r: 0 },
        { pos: "bottom-12 left-3", b: 0, l: 0 },
        { pos: "bottom-12 right-3", b: 0, r: 0 },
      ].map((c, i) => (
        <div key={i} className={`absolute ${c.pos}`} style={{ width: 14, height: 14 }}>
          <div
            className="absolute w-3 h-px"
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.4)",
              top: c.t !== undefined ? 0 : "auto",
              bottom: c.b !== undefined ? 0 : "auto",
              left: c.l !== undefined ? 0 : "auto",
              right: c.r !== undefined ? 0 : "auto",
            }}
          />
          <div
            className="absolute h-3 w-px"
            style={{
              backgroundColor: "rgba(220, 38, 38, 0.4)",
              top: c.t !== undefined ? 0 : "auto",
              bottom: c.b !== undefined ? 0 : "auto",
              left: c.l !== undefined ? 0 : "auto",
              right: c.r !== undefined ? 0 : "auto",
            }}
          />
        </div>
      ))}

      {/* Iron Man helmet — bottom-left corner of the panel */}
      <motion.div
        className="absolute bottom-14 left-5 z-10"
        initial={{ opacity: 0, scale: 0.5, rotate: -8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
        style={{ filter: `drop-shadow(0 0 8px rgba(220, 38, 38, 0.5))` }}
      >
        <IronManHelmet size={32} />
      </motion.div>

      {/* Iron Man helmet — top-right corner */}
      <motion.div
        className="absolute top-14 right-5 z-10"
        initial={{ opacity: 0, scale: 0.5, rotate: 8 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.55, ease: [0.23, 1, 0.32, 1] }}
        style={{ filter: `drop-shadow(0 0 8px rgba(251, 191, 36, 0.45))` }}
      >
        <IronManHelmet size={28} />
      </motion.div>

      {/* 🦾 Emojis at bottom-right and top-left as user requested */}
      <motion.div
        className="absolute bottom-14 right-5 z-10 text-[24px] select-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 0.9, y: [0, -3, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.7 },
          y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          filter: `drop-shadow(0 0 6px rgba(251, 191, 36, 0.5))`,
        }}
      >
        🦾
      </motion.div>

      <motion.div
        className="absolute top-14 left-5 z-10 text-[22px] select-none"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 0.85, y: [0, 3, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 0.85 },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{
          filter: `drop-shadow(0 0 6px rgba(220, 38, 38, 0.5))`,
        }}
      >
        🦾
      </motion.div>
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Module status bar (top chrome)                            */
/* ────────────────────────────────────────────────────────── */
function ModuleStatusBar({ phase }: { phase: Phase }) {
  const modules = [
    { num: "01", at: 1 },
    { num: "02", at: 2 },
    { num: "03", at: 3 },
    { num: "04", at: 4 },
  ];

  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3"
      style={{ borderBottom: `1px solid rgba(220, 38, 38, 0.15)` }}
    >
      {/* Left: branding */}
      <div className="flex items-center gap-2">
        <motion.span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: SUIT_GOLD }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9.5px",
            color: SUIT_GOLD,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Stark Industries
        </span>
        <span
          className="hidden sm:inline-block"
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9.5px",
            color: "rgba(244,244,245,0.4)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          // J.A.R.V.I.S
        </span>
      </div>

      {/* Center: module pills */}
      <div className="flex items-center gap-2 sm:gap-3">
        {modules.map((m) => {
          const done = phase > m.at;
          const active = phase === m.at;
          return (
            <div key={m.num} className="flex items-center gap-1.5">
              <motion.span
                className="relative flex w-1.5 h-1.5"
                animate={active ? { scale: [1, 1.5, 1], opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span
                  className="relative inline-flex rounded-full w-1.5 h-1.5"
                  style={{
                    backgroundColor: done
                      ? SUIT_GOLD
                      : active
                      ? SUIT_RED
                      : "#3F3F46",
                    boxShadow: done
                      ? `0 0 8px ${SUIT_GOLD}`
                      : active
                      ? `0 0 8px ${SUIT_RED}`
                      : "none",
                  }}
                />
              </motion.span>
              <span
                style={{
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  fontSize: "9.5px",
                  letterSpacing: "0.18em",
                  color: done ? SUIT_GOLD : active ? SUIT_RED : "#52525B",
                  fontWeight: done || active ? 600 : 400,
                }}
              >
                {m.num}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right: small armor reactor icon */}
      <div className="flex items-center gap-2">
        <motion.div
          className="relative w-3 h-3 rounded-full"
          style={{
            border: `1px solid ${SUIT_GOLD}`,
            backgroundColor: "rgba(251,191,36,0.15)",
          }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <span
            className="absolute inset-1 rounded-full"
            style={{ backgroundColor: SUIT_GOLD_BRIGHT, boxShadow: `0 0 6px ${SUIT_GOLD_BRIGHT}` }}
          />
        </motion.div>
        <span
          className="hidden sm:inline-block"
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9px",
            color: "rgba(251,191,36,0.6)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          Reactor · Stable
        </span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Bottom caption                                             */
/* ────────────────────────────────────────────────────────── */
function BottomCaption({ phase }: { phase: Phase }) {
  const lines: Record<
    number,
    { module: string; tagline: string; status: string; statusColor: string }
  > = {
    0: { module: "STAND BY", tagline: "diagnostic queued", status: "IDLE", statusColor: "#71717A" },
    1: { module: "MODULE 01 : SPARK", tagline: "creativity — the conductor", status: "INITIALIZING", statusColor: SUIT_RED },
    2: { module: "MODULE 02 : UX", tagline: "research → wireframe", status: "INITIALIZING", statusColor: SUIT_RED },
    3: { module: "MODULE 03 : BUILD", tagline: "design ⇄ code", status: "INITIALIZING", statusColor: SUIT_RED },
    4: { module: "MODULE 04 : LIVE", tagline: "production AI — shipped", status: "INITIALIZING", statusColor: SUIT_RED },
    5: { module: "ALL MODULES ONLINE", tagline: "system ready", status: "READY TO SHIP", statusColor: SUIT_GOLD },
  };

  const current = lines[phase] || lines[0];

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-4 px-4 sm:px-6 py-3"
      style={{
        borderTop: `1px solid rgba(220, 38, 38, 0.15)`,
        backgroundColor: "rgba(10, 6, 6, 0.7)",
        backdropFilter: "blur(6px)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={`caption-${phase}`}
          className="flex items-baseline gap-3 min-w-0 flex-1"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <span
            className="flex-shrink-0"
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "11px",
              color: "#F4F4F5",
              letterSpacing: "0.12em",
            }}
          >
            {">"} {current.module}
          </span>
          <span
            className="truncate"
            style={{
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              fontSize: "12.5px",
              color: "rgba(244,244,245,0.55)",
            }}
          >
            — {current.tagline}
          </span>
        </motion.div>
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.span
          key={`status-${phase}`}
          className="flex-shrink-0"
          initial={{ opacity: 0, x: 4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "11px",
            color: current.statusColor,
            letterSpacing: "0.18em",
            fontWeight: 600,
          }}
        >
          [{current.status}]
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════ */
/*  CenterReplay — appears after the diagnostic completes      */
/* ════════════════════════════════════════════════════════════ */
function CenterReplay({ onReplay }: { onReplay: () => void }) {
  return (
    <motion.div
      className="absolute inset-0 z-30 flex flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      {/* Subtle dim overlay so button stands out */}
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "rgba(10, 6, 6, 0.55)",
          backdropFilter: "blur(3px)",
        }}
      />

      {/* Outermost pulsing rings */}
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.7, ease: [0.23, 1, 0.32, 1] }}
      >
        {[0, 0.4, 0.8].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              border: `1px solid ${SUIT_GOLD}`,
              boxShadow: `0 0 16px rgba(251, 191, 36, 0.4)`,
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: [80, 200],
              height: [80, 200],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 2.4,
              delay,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 0.4,
            }}
          />
        ))}

        {/* Spinning gold ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: "140px",
            height: "140px",
            border: `1.5px dashed ${SUIT_GOLD}`,
            opacity: 0.7,
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        {/* Main button */}
        <button
          onClick={onReplay}
          className="relative group flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
          style={{
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            backgroundColor: SUIT_RED,
            border: `2.5px solid ${SUIT_GOLD}`,
            boxShadow: `
              0 0 30px rgba(220, 38, 38, 0.6),
              0 0 80px rgba(220, 38, 38, 0.3),
              inset 0 0 24px rgba(251, 191, 36, 0.25),
              inset 0 2px 0 rgba(255, 255, 255, 0.15)
            `,
            cursor: "pointer",
          }}
        >
          {/* Inner gold ring */}
          <span
            className="absolute rounded-full"
            style={{
              inset: "8px",
              border: `1px solid rgba(251, 191, 36, 0.4)`,
            }}
          />

          {/* Replay icon */}
          <motion.svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke={SUIT_GOLD_BRIGHT}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="relative z-10"
            initial={{ rotate: -90 }}
            animate={{ rotate: 0 }}
            transition={{ duration: 0.6, delay: 0.9, ease: [0.23, 1, 0.32, 1] }}
            style={{ filter: `drop-shadow(0 0 6px ${SUIT_GOLD})` }}
          >
            <path d="M21 12a9 9 0 1 1-3.13-6.84" />
            <path d="M21 3v6h-6" />
          </motion.svg>
        </button>
      </motion.div>

      {/* Label below */}
      <motion.div
        className="relative mt-7 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "16px",
            color: "#F4F4F5",
            letterSpacing: "-0.01em",
          }}
        >
          Run diagnostic again
        </span>
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "10px",
            color: SUIT_GOLD,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          Mark V · Replay sequence
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 1 — Spark (Arc Reactor in red/gold)                 */
/* ══════════════════════════════════════════════════════════ */
function SparkPhase() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Ripple rings — red */}
      {[0, 0.5, 1.0, 1.5].map((delay, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            border: `1px solid ${SUIT_RED}`,
            boxShadow: `0 0 24px rgba(220, 38, 38, 0.5)`,
          }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width: 320,
            height: 320,
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2.4,
            delay: 0.3 + delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.8,
          }}
        />
      ))}

      {/* Static outer ring with tick marks — gold */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "200px",
          height: "200px",
          border: `1.5px solid ${SUIT_GOLD}`,
          opacity: 0.7,
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.85, rotate: 360 }}
        transition={{
          scale: { duration: 1.2, delay: 0.4, ease: [0.23, 1, 0.32, 1] },
          opacity: { duration: 0.6, delay: 0.4 },
          rotate: { duration: 24, repeat: Infinity, ease: "linear" },
        }}
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <div
            key={deg}
            className="absolute top-1/2 left-1/2"
            style={{
              width: "10px",
              height: "1.5px",
              backgroundColor: SUIT_GOLD,
              transformOrigin: "0 50%",
              transform: `translate(100px, 0) rotate(${deg}deg)`,
            }}
          />
        ))}
      </motion.div>

      {/* Mid ring — red, counter-rotating */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "140px",
          height: "140px",
          border: `1.5px solid ${SUIT_RED}`,
          boxShadow: `0 0 20px rgba(220, 38, 38, 0.3)`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: -360 }}
        transition={{
          scale: { duration: 1.2, delay: 0.7, ease: [0.23, 1, 0.32, 1] },
          rotate: { duration: 16, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Inner ring — gold */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "92px",
          height: "92px",
          border: `2px solid ${SUIT_GOLD}`,
          boxShadow: `0 0 14px rgba(251, 191, 36, 0.5)`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: 360 }}
        transition={{
          scale: { duration: 1.2, delay: 0.9, ease: [0.23, 1, 0.32, 1] },
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Glowing GOLD core */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: "62px",
          height: "62px",
          background: `radial-gradient(circle, #FFFFFF 0%, ${SUIT_GOLD_BRIGHT} 30%, ${SUIT_GOLD} 60%, transparent 85%)`,
          boxShadow: `0 0 30px ${SUIT_GOLD}, 0 0 70px rgba(251, 191, 36, 0.7), 0 0 120px rgba(251, 191, 36, 0.4)`,
        }}
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.4, 1] }}
        transition={{ duration: 1.2, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(255,255,255,0.95) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.85, 1.08, 0.85] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Title */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.0, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 30px)",
            color: "#F4F4F5",
            letterSpacing: "-0.01em",
          }}
        >
          SPARK
        </span>
        <span
          style={{
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: SUIT_GOLD,
          }}
        >
          creativity — the conductor
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 2 — UX (Scan + Wireframe in red/gold)                */
/* ══════════════════════════════════════════════════════════ */
function UXPhase() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {/* Scan line sweep — red */}
      <motion.div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: "2px",
          background: `linear-gradient(to bottom, transparent, ${SUIT_RED} 50%, transparent)`,
          boxShadow: `0 0 24px ${SUIT_RED}, 0 0 50px rgba(220, 38, 38, 0.5)`,
        }}
        initial={{ left: "-2%" }}
        animate={{ left: "102%" }}
        transition={{ duration: 2.2, ease: "linear", delay: 0.2 }}
      />

      {/* Wireframe SVG */}
      <svg
        viewBox="0 0 480 280"
        className="w-[90%] max-w-[600px]"
        style={{ filter: `drop-shadow(0 0 12px rgba(220, 38, 38, 0.25))` }}
      >
        {/* Hero block */}
        <motion.rect
          x="40" y="30" width="400" height="60" rx="3"
          fill="none"
          stroke={SUIT_RED}
          strokeWidth="1.4"
          strokeDasharray="5 4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.9, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.8, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
        <motion.text
          x="50" y="66"
          fill={SUIT_GOLD}
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.85 }}
          transition={{ duration: 0.4, delay: 1.3 }}
        >
          hero · headline
        </motion.text>

        {/* Three cards */}
        {[0, 1, 2].map((i) => (
          <g key={i}>
            <motion.rect
              x={40 + i * 140}
              y="120"
              width="120"
              height="80"
              rx="3"
              fill="none"
              stroke={SUIT_RED}
              strokeWidth="1.4"
              strokeDasharray="5 4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.75, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: 1.2 + i * 0.25,
                ease: [0.23, 1, 0.32, 1],
              }}
              style={{ transformOrigin: "center", transformBox: "fill-box" }}
            />
            <motion.text
              x={50 + i * 140}
              y="160"
              fill={SUIT_GOLD}
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ duration: 0.4, delay: 1.5 + i * 0.25 }}
            >
              card.{i + 1}
            </motion.text>
          </g>
        ))}

        {/* Bottom CTA — filled gold */}
        <motion.rect
          x="40" y="230" width="160" height="32" rx="3"
          fill="rgba(251, 191, 36, 0.18)"
          stroke={SUIT_GOLD}
          strokeWidth="1.4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 2.1, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
        <motion.text
          x="120" y="250"
          textAnchor="middle"
          fill={SUIT_GOLD_BRIGHT}
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          fontWeight="600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 2.4 }}
        >
          → CTA
        </motion.text>

        {/* Connector arrows */}
        <motion.line
          x1="100" y1="200" x2="100" y2="225"
          stroke={SUIT_GOLD}
          strokeWidth="1.2"
          strokeDasharray="3 3"
          opacity="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 2.15 }}
        />
      </svg>

      {/* Corner annotation */}
      <motion.div
        className="absolute top-2 left-4 sm:left-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 2.4 }}
      >
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9.5px",
            color: SUIT_GOLD,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          scan: complete
        </span>
      </motion.div>

      {/* Title */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.6, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 30px)",
            color: "#F4F4F5",
            letterSpacing: "-0.01em",
          }}
        >
          UX
        </span>
        <span
          style={{
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: SUIT_GOLD,
          }}
        >
          research → wireframe
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 3 — Build (Design ⇄ Code in red/gold)                */
/* ══════════════════════════════════════════════════════════ */
function BuildPhase() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative flex items-stretch gap-3 sm:gap-4 w-[90%] max-w-[640px]">

        {/* LEFT — Design panel */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden p-5"
          style={{
            backgroundColor: "rgba(220, 38, 38, 0.06)",
            border: `1px solid ${SUIT_RED}`,
            boxShadow: `0 0 30px rgba(220, 38, 38, 0.15)`,
            minHeight: "200px",
          }}
          initial={{ x: -260, opacity: 0, rotate: -10 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-start justify-between mb-4">
            <span
              style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: "9px",
                color: SUIT_RED,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              design.tokens
            </span>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: SUIT_RED, boxShadow: `0 0 6px ${SUIT_RED}` }}
            />
          </div>

          {/* Typography sample */}
          <div className="flex items-baseline gap-3 mb-5">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "48px",
                color: "#F4F4F5",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Aa
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              style={{
                fontFamily: "Playfair Display, serif",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "34px",
                color: SUIT_GOLD,
                lineHeight: 1,
              }}
            >
              Aa
            </motion.span>
          </div>

          {/* Swatches — Iron Man palette */}
          <div className="flex items-center gap-2">
            {[
              { color: SUIT_RED },
              { color: SUIT_GOLD },
              { color: "#F4F4F5" },
              { color: "#27272A", border: `1px solid ${SUIT_GOLD}` },
            ].map((sw, i) => (
              <motion.div
                key={i}
                className="w-7 h-7 rounded-full"
                style={{
                  backgroundColor: sw.color,
                  border: sw.border || "none",
                  boxShadow: `0 0 12px ${sw.color}55`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.4,
                  delay: 1.5 + i * 0.1,
                  ease: [0.23, 1, 0.32, 1],
                }}
              />
            ))}
          </div>

          {/* Spacing rulers */}
          <motion.div
            className="flex items-end gap-1 mt-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.0 }}
          >
            {[4, 8, 12, 16, 24].map((h, i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: `${h}px`,
                  backgroundColor: "rgba(220, 38, 38, 0.4)",
                  borderTop: `1px solid ${SUIT_RED}`,
                }}
              />
            ))}
            <span
              className="ml-2"
              style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: "9px",
                color: "rgba(244, 244, 245, 0.4)",
              }}
            >
              4 · 8 · 12 · 16 · 24
            </span>
          </motion.div>
        </motion.div>

        {/* CENTER — bridge */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            backgroundColor: PANEL_BG,
            border: `2px solid ${SUIT_GOLD}`,
            boxShadow: `0 0 28px ${SUIT_GOLD}, inset 0 0 12px rgba(220, 38, 38, 0.3)`,
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 1.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <span
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "18px",
              color: SUIT_GOLD_BRIGHT,
              fontWeight: 600,
            }}
          >
            ⇄
          </span>
        </motion.div>

        {/* RIGHT — Code panel */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden p-5"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            border: `1px solid ${SUIT_GOLD}`,
            boxShadow: `0 0 30px rgba(251, 191, 36, 0.15)`,
            minHeight: "200px",
          }}
          initial={{ x: 260, opacity: 0, rotate: 10 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.55, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-start justify-between mb-4">
            <span
              style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: "9px",
                color: SUIT_GOLD,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 600,
              }}
            >
              src/hero.tsx
            </span>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: SUIT_GOLD, boxShadow: `0 0 6px ${SUIT_GOLD}` }}
            />
          </div>

          <div
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "11.5px",
              lineHeight: 1.75,
              letterSpacing: "0.02em",
            }}
          >
            <CodeLine
              delay={1.2}
              parts={[
                { text: "export ", color: "#F87171" },
                { text: "function ", color: SUIT_RED },
                { text: "Hero", color: SUIT_GOLD_BRIGHT },
                { text: "() {", color: "#71717A" },
              ]}
            />
            <CodeLine
              delay={1.7}
              parts={[
                { text: "  return ", color: "#F87171" },
                { text: "<", color: "#52525B" },
                { text: "h1 ", color: SUIT_GOLD },
                { text: "italic", color: SUIT_RED },
                { text: ">", color: "#52525B" },
              ]}
            />
            <CodeLine
              delay={2.2}
              parts={[{ text: "    Designing AI…", color: "#F4F4F5" }]}
            />
            <CodeLine
              delay={2.65}
              parts={[
                { text: "  </", color: "#52525B" },
                { text: "h1", color: SUIT_GOLD },
                { text: ">", color: "#52525B" },
              ]}
            />
            <CodeLine delay={2.95} parts={[{ text: "}", color: "#71717A" }]} />
          </div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 3.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 30px)",
            color: "#F4F4F5",
            letterSpacing: "-0.01em",
          }}
        >
          BUILD
        </span>
        <span
          style={{
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: SUIT_GOLD,
          }}
        >
          design ⇄ code
        </span>
      </motion.div>
    </motion.div>
  );
}

function CodeLine({
  delay,
  parts,
}: {
  delay: number;
  parts: { text: string; color: string }[];
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.color }}>
          {p.text}
        </span>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 4 — Live (Iron Man HUD)                              */
/* ══════════════════════════════════════════════════════════ */
function LivePhase({ dimmed = false }: { dimmed?: boolean }) {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: dimmed ? 0.5 : 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Center reticle */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
      >
        <ReticleSVG />
      </motion.div>

      {/* TL data */}
      <HUDPanel
        position="top-left"
        delay={1.0}
        label="ROBOT.UI / CARDS.LAB"
        accent={SUIT_RED}
        rows={[
          { k: "build", v: "v4.0" },
          { k: "uptime", v: "99.94%" },
          { k: "lat", v: "42ms" },
        ]}
      />

      {/* TR data */}
      <HUDPanel
        position="top-right"
        delay={1.3}
        label="MODEL CONFIDENCE"
        accent={SUIT_GOLD}
        rows={[
          { k: "score", v: "92%" },
          { k: "trend", v: "↑ 4.1%" },
          { k: "calib", v: "OK" },
        ]}
      />

      {/* BL data */}
      <HUDPanel
        position="bottom-left"
        delay={1.6}
        label="TELEMETRY"
        accent={SUIT_RED}
        rows={[
          { k: "users", v: "2,341" },
          { k: "sessions", v: "18.2k" },
          { k: "crash", v: "0.04%" },
        ]}
      />

      {/* BR badge */}
      <motion.div
        className="absolute bottom-6 right-4 sm:right-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 2.0, ease: [0.23, 1, 0.32, 1] }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: "rgba(251, 191, 36, 0.15)",
            border: `1px solid ${SUIT_GOLD}`,
            boxShadow: `0 0 24px rgba(251, 191, 36, 0.4)`,
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: SUIT_GOLD_BRIGHT }}
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ backgroundColor: SUIT_GOLD_BRIGHT }}
            />
          </span>
          <span
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "10px",
              color: SUIT_GOLD_BRIGHT,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Production · Online
          </span>
        </div>
      </motion.div>

      {/* Center title */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-[120px] flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 2.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 30px)",
            color: "#F4F4F5",
            letterSpacing: "-0.01em",
          }}
        >
          LIVE
        </span>
        <span
          style={{
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: SUIT_GOLD,
          }}
        >
          shipped, not slideware
        </span>
      </motion.div>
    </motion.div>
  );
}

function ReticleSVG() {
  return (
    <svg width="200" height="200" viewBox="0 0 200 200">
      {/* Outer rotating ring — red */}
      <motion.circle
        cx="100"
        cy="100"
        r="86"
        fill="none"
        stroke={SUIT_RED}
        strokeWidth="0.9"
        strokeDasharray="5 3"
        opacity="0.6"
        style={{ transformOrigin: "100px 100px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner rotating ring — gold */}
      <motion.circle
        cx="100"
        cy="100"
        r="56"
        fill="none"
        stroke={SUIT_GOLD}
        strokeWidth="1.1"
        opacity="0.8"
        style={{ transformOrigin: "100px 100px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />
      {/* Crosshair lines */}
      <line x1="20" y1="100" x2="56" y2="100" stroke={SUIT_RED} strokeWidth="1" opacity="0.8" />
      <line x1="144" y1="100" x2="180" y2="100" stroke={SUIT_RED} strokeWidth="1" opacity="0.8" />
      <line x1="100" y1="20" x2="100" y2="56" stroke={SUIT_RED} strokeWidth="1" opacity="0.8" />
      <line x1="100" y1="144" x2="100" y2="180" stroke={SUIT_RED} strokeWidth="1" opacity="0.8" />
      {/* Center gold dot pulsing */}
      <motion.circle
        cx="100"
        cy="100"
        r="5"
        fill={SUIT_GOLD_BRIGHT}
        animate={{ opacity: [0.4, 1, 0.4], r: [4, 6, 4] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Cardinal tick marks */}
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="100" y1="14" x2="100" y2="22"
          stroke={SUIT_GOLD}
          strokeWidth="1.4"
          opacity="0.85"
          style={{
            transformOrigin: "100px 100px",
            transform: `rotate(${deg}deg)`,
          }}
        />
      ))}
    </svg>
  );
}

function HUDPanel({
  position,
  delay,
  label,
  accent,
  rows,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay: number;
  label: string;
  accent: string;
  rows: { k: string; v: string }[];
}) {
  const posClass = {
    "top-left": "top-16 left-4 sm:left-6 items-start text-left",
    "top-right": "top-16 right-4 sm:right-6 items-end text-right",
    "bottom-left": "bottom-16 left-4 sm:left-6 items-start text-left",
    "bottom-right": "bottom-16 right-4 sm:right-6 items-end text-right",
  }[position];

  const xOffset = position.includes("left") ? -16 : 16;

  return (
    <motion.div
      className={`absolute ${posClass} flex flex-col gap-1.5`}
      initial={{ opacity: 0, x: xOffset }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      <span
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "9px",
          color: accent,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {label}
      </span>
      {rows.map((r) => (
        <div key={r.k} className="flex items-baseline gap-2">
          <span
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "9.5px",
              color: "rgba(244, 244, 245, 0.45)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {r.k}
          </span>
          <span
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "12px",
              color: "#F4F4F5",
              letterSpacing: "0.05em",
              fontVariantNumeric: "tabular-nums",
              fontWeight: 600,
            }}
          >
            {r.v}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
