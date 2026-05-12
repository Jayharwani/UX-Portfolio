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

/* ══════════════════════════════════════════════════════════ */
/*  ApproachStrip — Section header + Stark boot sequence      */
/* ══════════════════════════════════════════════════════════ */
export function ApproachStrip() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#FAFAF7" }}
    >
      {/* Static ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(15,118,110,0.06) 0%, transparent 65%)",
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
            "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)",
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
                  style={{ backgroundColor: "#0F766E" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: "#0F766E" }}
                />
              </span>
              <span
                className="text-[10.5px] uppercase tracking-[0.2em]"
                style={{
                  color: "#134E4A",
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                }}
              >
                Diagnostic running
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
                  color: "#0F766E",
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
                      color: "#0F766E",
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
/*  StarkBootSequence — JARVIS-style 4-phase boot sequence    */
/*  Spark → UX → Build → Live, then settles into ambient HUD  */
/* ══════════════════════════════════════════════════════════ */

type Phase = 0 | 1 | 2 | 3 | 4 | 5; // 0 idle, 1-4 active phase, 5 ambient (Live persists)

// Phase durations in ms — total ~9.5s
const PHASE_DURATIONS: Record<number, number> = {
  1: 2400, // Spark — arc reactor charge
  2: 2600, // UX — scan + wireframe assemble
  3: 2600, // Build — modules fly in + code types
  4: 2200, // Live — HUD chrome materializes
};

function StarkBootSequence() {
  const [phase, setPhase] = useState<Phase>(0);
  const [replayKey, setReplayKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-trigger on scroll into view
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

  // Auto-advance phases
  useEffect(() => {
    if (phase === 0 || phase >= 5) return;
    const duration = PHASE_DURATIONS[phase] ?? 2000;
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
          backgroundColor: "#0A1018",
          borderRadius: "20px",
          border: "1px solid rgba(0, 212, 255, 0.15)",
          boxShadow:
            "0 40px 90px -30px rgba(8,12,20,0.5), inset 0 1px 0 rgba(255,255,255,0.04), 0 0 60px rgba(0,212,255,0.05)",
          height: "clamp(480px, 64vh, 640px)",
        }}
      >
        {/* Workshop grid floor + vignette */}
        <GridFloor />
        <CornerCrosshairs />

        {/* Top chrome bar */}
        <ModuleStatusBar phase={phase} onReplay={handleReplay} />

        {/* Center stage */}
        <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-12 pt-16 pb-16">
          <AnimatePresence mode="wait">
            {phase === 1 && <SparkPhase key={`spark-${replayKey}`} />}
            {phase === 2 && <UXPhase key={`ux-${replayKey}`} />}
            {phase === 3 && <BuildPhase key={`build-${replayKey}`} />}
            {phase >= 4 && <LivePhase key={`live-${replayKey}`} />}
          </AnimatePresence>
        </div>

        {/* Bottom caption */}
        <BottomCaption phase={phase} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Workshop background — grid + vignette                     */
/* ────────────────────────────────────────────────────────── */
function GridFloor() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(0,212,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 0%, rgba(10,16,24,0.7) 90%)",
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

/* Subtle L-shaped brackets in the four corners */
function CornerCrosshairs() {
  const stroke = "rgba(0, 212, 255, 0.25)";
  return (
    <>
      {/* TL */}
      <div className="absolute top-12 left-3" style={{ width: 14, height: 14 }}>
        <div className="absolute top-0 left-0 w-3 h-px" style={{ backgroundColor: stroke }} />
        <div className="absolute top-0 left-0 h-3 w-px" style={{ backgroundColor: stroke }} />
      </div>
      {/* TR */}
      <div className="absolute top-12 right-3" style={{ width: 14, height: 14 }}>
        <div className="absolute top-0 right-0 w-3 h-px" style={{ backgroundColor: stroke }} />
        <div className="absolute top-0 right-0 h-3 w-px" style={{ backgroundColor: stroke }} />
      </div>
      {/* BL */}
      <div className="absolute bottom-12 left-3" style={{ width: 14, height: 14 }}>
        <div className="absolute bottom-0 left-0 w-3 h-px" style={{ backgroundColor: stroke }} />
        <div className="absolute bottom-0 left-0 h-3 w-px" style={{ backgroundColor: stroke }} />
      </div>
      {/* BR */}
      <div className="absolute bottom-12 right-3" style={{ width: 14, height: 14 }}>
        <div className="absolute bottom-0 right-0 w-3 h-px" style={{ backgroundColor: stroke }} />
        <div className="absolute bottom-0 right-0 h-3 w-px" style={{ backgroundColor: stroke }} />
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  ModuleStatusBar — top chrome with JARVIS + module pills   */
/* ────────────────────────────────────────────────────────── */
function ModuleStatusBar({
  phase,
  onReplay,
}: {
  phase: Phase;
  onReplay: () => void;
}) {
  const modules = [
    { num: "01", name: "SPARK", at: 1 },
    { num: "02", name: "UX", at: 2 },
    { num: "03", name: "BUILD", at: 3 },
    { num: "04", name: "LIVE", at: 4 },
  ];

  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3"
      style={{ borderBottom: "1px solid rgba(0, 212, 255, 0.1)" }}
    >
      {/* Left: JARVIS branding */}
      <div className="flex items-center gap-2">
        <motion.span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: "#00D4FF" }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9.5px",
            color: "#00D4FF",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          J.A.R.V.I.S
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
          // Designer Protocol
        </span>
      </div>

      {/* Center: module status pills */}
      <div className="flex items-center gap-2 sm:gap-3">
        {modules.map((m) => {
          const done = phase > m.at;
          const active = phase === m.at;
          const pending = phase < m.at;
          return (
            <div key={m.num} className="flex items-center gap-1.5">
              <motion.span
                className="relative flex w-1.5 h-1.5"
                animate={active ? { scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] } : {}}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              >
                <span
                  className="relative inline-flex rounded-full w-1.5 h-1.5"
                  style={{
                    backgroundColor: done
                      ? "#10B981"
                      : active
                      ? "#00D4FF"
                      : "#3F3F46",
                  }}
                />
              </motion.span>
              <span
                style={{
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  fontSize: "9.5px",
                  letterSpacing: "0.18em",
                  color: done
                    ? "#10B981"
                    : active
                    ? "#00D4FF"
                    : pending
                    ? "#52525B"
                    : "#71717A",
                }}
              >
                {m.num}
              </span>
            </div>
          );
        })}
      </div>

      {/* Right: replay */}
      <button
        onClick={onReplay}
        className="group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-colors hover:bg-cyan-500/10 active:scale-[0.97]"
        style={{
          border: "1px solid rgba(0, 212, 255, 0.2)",
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "9px",
          color: "rgba(0, 212, 255, 0.8)",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        ↻ Replay
      </button>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  BottomCaption                                              */
/* ────────────────────────────────────────────────────────── */
function BottomCaption({ phase }: { phase: Phase }) {
  const lines: Record<
    number,
    { module: string; tagline: string; status: string; statusColor: string }
  > = {
    0: { module: "STAND BY", tagline: "diagnostic queued", status: "IDLE", statusColor: "#71717A" },
    1: { module: "MODULE 01 : SPARK", tagline: "creativity — the conductor", status: "INITIALIZING", statusColor: "#00D4FF" },
    2: { module: "MODULE 02 : UX", tagline: "research → wireframe", status: "INITIALIZING", statusColor: "#00D4FF" },
    3: { module: "MODULE 03 : BUILD", tagline: "design ⇄ code", status: "INITIALIZING", statusColor: "#00D4FF" },
    4: { module: "MODULE 04 : LIVE", tagline: "production AI", status: "INITIALIZING", statusColor: "#00D4FF" },
    5: { module: "ALL MODULES ONLINE", tagline: "system ready", status: "READY TO SHIP", statusColor: "#10B981" },
  };

  const current = lines[phase] || lines[0];

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-4 px-4 sm:px-6 py-3"
      style={{
        borderTop: "1px solid rgba(0, 212, 255, 0.1)",
        backgroundColor: "rgba(10, 16, 24, 0.6)",
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
          transition={{ duration: 0.25 }}
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
          transition={{ duration: 0.25 }}
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "11px",
            color: current.statusColor,
            letterSpacing: "0.18em",
          }}
        >
          [{current.status}]
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 1 — Spark (Arc Reactor)                              */
/* ══════════════════════════════════════════════════════════ */
function SparkPhase() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Ripple rings */}
      {[0, 0.3, 0.6, 0.9].map((delay) => (
        <motion.div
          key={delay}
          className="absolute rounded-full"
          style={{
            border: "1px solid rgba(0, 212, 255, 0.6)",
            boxShadow: "0 0 20px rgba(0, 212, 255, 0.4)",
          }}
          initial={{ width: 0, height: 0, opacity: 0 }}
          animate={{
            width: 320,
            height: 320,
            opacity: [0, 0.7, 0],
          }}
          transition={{
            duration: 1.8,
            delay: 0.2 + delay,
            ease: "easeOut",
            repeat: Infinity,
            repeatDelay: 0.6,
          }}
        />
      ))}

      {/* Static outer ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "190px",
          height: "190px",
          border: "1.5px solid rgba(0, 212, 255, 0.35)",
        }}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, rotate: 360 }}
        transition={{
          scale: { duration: 0.8, delay: 0.3, ease: [0.23, 1, 0.32, 1] },
          opacity: { duration: 0.5, delay: 0.3 },
          rotate: { duration: 22, repeat: Infinity, ease: "linear" },
        }}
      >
        {/* Tick marks on the ring */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <div
            key={deg}
            className="absolute top-1/2 left-1/2"
            style={{
              width: "8px",
              height: "1.5px",
              backgroundColor: "rgba(0, 212, 255, 0.5)",
              transformOrigin: "0 50%",
              transform: `translate(95px, 0) rotate(${deg}deg)`,
            }}
          />
        ))}
      </motion.div>

      {/* Mid ring */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: "130px",
          height: "130px",
          border: "1.5px solid rgba(0, 212, 255, 0.6)",
        }}
        initial={{ scale: 0 }}
        animate={{ scale: 1, rotate: -360 }}
        transition={{
          scale: { duration: 0.8, delay: 0.5, ease: [0.23, 1, 0.32, 1] },
          rotate: { duration: 14, repeat: Infinity, ease: "linear" },
        }}
      />

      {/* Glowing core */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: "62px",
          height: "62px",
          background:
            "radial-gradient(circle, #FFFFFF 0%, #5EEAD4 30%, #00D4FF 60%, transparent 85%)",
          boxShadow:
            "0 0 30px #00D4FF, 0 0 70px rgba(0, 212, 255, 0.7), 0 0 120px rgba(0, 212, 255, 0.4)",
        }}
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.4, 1],
        }}
        transition={{
          duration: 1,
          delay: 0.1,
          ease: [0.23, 1, 0.32, 1],
        }}
      >
        {/* Inner pulse */}
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.9) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Title */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(20px, 3vw, 28px)",
            color: "#F4F4F5",
            letterSpacing: "-0.01em",
          }}
        >
          SPARK
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 2 — UX (Scan + Wireframe Assembly)                   */
/* ══════════════════════════════════════════════════════════ */
function UXPhase() {
  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      {/* Scan line sweep */}
      <motion.div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: "2px",
          background:
            "linear-gradient(to bottom, transparent, #00D4FF 50%, transparent)",
          boxShadow: "0 0 24px #00D4FF, 0 0 50px rgba(0,212,255,0.5)",
        }}
        initial={{ left: "-2%" }}
        animate={{ left: "102%" }}
        transition={{ duration: 1.5, ease: "linear", delay: 0.1 }}
      />

      {/* Wireframe SVG */}
      <svg
        viewBox="0 0 480 280"
        className="w-[90%] max-w-[560px]"
        style={{ filter: "drop-shadow(0 0 12px rgba(0,212,255,0.18))" }}
      >
        {/* Hero block */}
        <motion.rect
          x="40" y="30" width="400" height="60" rx="3"
          fill="none"
          stroke="#00D4FF"
          strokeWidth="1.2"
          strokeDasharray="4 4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
        <motion.text
          x="50" y="65"
          fill="rgba(0, 212, 255, 0.6)"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.85 }}
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
              stroke="#00D4FF"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.7, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.8 + i * 0.18,
                ease: [0.23, 1, 0.32, 1],
              }}
              style={{ transformOrigin: "center", transformBox: "fill-box" }}
            />
            <motion.text
              x={50 + i * 140}
              y="160"
              fill="rgba(0, 212, 255, 0.5)"
              fontSize="10"
              fontFamily="ui-monospace, monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 1.1 + i * 0.18 }}
            >
              card.{i + 1}
            </motion.text>
          </g>
        ))}

        {/* Bottom CTA */}
        <motion.rect
          x="40" y="230" width="160" height="30" rx="3"
          fill="rgba(0, 212, 255, 0.08)"
          stroke="#00D4FF"
          strokeWidth="1.2"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.5, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: "center", transformBox: "fill-box" }}
        />
        <motion.text
          x="120" y="250"
          textAnchor="middle"
          fill="#00D4FF"
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.7 }}
        >
          → CTA
        </motion.text>

        {/* Flow arrows */}
        <motion.line
          x1="100" y1="200" x2="100" y2="225"
          stroke="rgba(0, 212, 255, 0.6)"
          strokeWidth="1.2"
          strokeDasharray="3 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.4, delay: 1.55 }}
        />

        {/* Annotation: arrows showing flow research → IA */}
        <motion.line
          x1="105" y1="105" x2="105" y2="115"
          stroke="rgba(0, 212, 255, 0.5)"
          strokeWidth="1"
          strokeDasharray="2 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 0.95 }}
        />
        <motion.line
          x1="245" y1="105" x2="245" y2="115"
          stroke="rgba(0, 212, 255, 0.5)"
          strokeWidth="1"
          strokeDasharray="2 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.1 }}
        />
        <motion.line
          x1="385" y1="105" x2="385" y2="115"
          stroke="rgba(0, 212, 255, 0.5)"
          strokeWidth="1"
          strokeDasharray="2 3"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3, delay: 1.25 }}
        />
      </svg>

      {/* Corner annotations */}
      <motion.div
        className="absolute top-2 left-4 sm:left-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.7 }}
      >
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9.5px",
            color: "rgba(0, 212, 255, 0.7)",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          scan: complete
        </span>
      </motion.div>

      {/* Title */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.7, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(20px, 3vw, 28px)",
            color: "#F4F4F5",
            letterSpacing: "-0.01em",
          }}
        >
          UX
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 3 — Build (Design ⇄ Code, modules fly in)            */
/* ══════════════════════════════════════════════════════════ */
function BuildPhase() {
  const codeLines = [
    { token: "const", val: "hero", color: "#7C3AED" },
    { val: "=", color: "#52525B" },
    { val: "(", color: "#71717A" },
    { val: ") => ", color: "#71717A" },
  ];

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="relative flex items-stretch gap-3 sm:gap-4 w-[90%] max-w-[600px]">

        {/* LEFT — Design panel flies in from left */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden p-5"
          style={{
            backgroundColor: "rgba(0, 212, 255, 0.04)",
            border: "1px solid rgba(0, 212, 255, 0.25)",
            boxShadow: "0 0 30px rgba(0, 212, 255, 0.1)",
            minHeight: "180px",
          }}
          initial={{ x: -240, opacity: 0, rotate: -8 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-start justify-between mb-4">
            <span
              style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: "9px",
                color: "#00D4FF",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              design.tokens
            </span>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#00D4FF" }}
            />
          </div>

          {/* Typography sample */}
          <div className="flex items-baseline gap-3 mb-4">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.7 }}
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "44px",
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
              transition={{ duration: 0.4, delay: 0.85 }}
              style={{
                fontFamily: "Playfair Display, serif",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "32px",
                color: "#00D4FF",
                lineHeight: 1,
              }}
            >
              Aa
            </motion.span>
          </div>

          {/* Color swatches */}
          <div className="flex items-center gap-2">
            {[
              { color: "#00D4FF", label: "primary" },
              { color: "#F59E0B", label: "accent" },
              { color: "#F4F4F5", label: "fg" },
              { color: "#27272A", label: "bg" },
            ].map((sw, i) => (
              <motion.div
                key={sw.label}
                className="w-6 h-6 rounded-full"
                style={{
                  backgroundColor: sw.color,
                  border:
                    sw.color === "#27272A"
                      ? "1px solid rgba(0, 212, 255, 0.3)"
                      : "none",
                  boxShadow: `0 0 10px ${sw.color}40`,
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  duration: 0.3,
                  delay: 1 + i * 0.08,
                  ease: [0.23, 1, 0.32, 1],
                }}
              />
            ))}
          </div>

          {/* Spacing scale */}
          <motion.div
            className="flex items-end gap-1 mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.4 }}
          >
            {[4, 8, 12, 16, 24].map((h, i) => (
              <div
                key={i}
                style={{
                  width: "8px",
                  height: `${h}px`,
                  backgroundColor: "rgba(0, 212, 255, 0.3)",
                  borderTop: "1px solid rgba(0, 212, 255, 0.6)",
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

        {/* CENTER — Bridge symbol */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-9 h-9 rounded-full"
          style={{
            backgroundColor: "#0A1018",
            border: "1.5px solid #00D4FF",
            boxShadow: "0 0 24px rgba(0,212,255,0.6)",
          }}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.95, ease: [0.23, 1, 0.32, 1] }}
        >
          <span
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "16px",
              color: "#00D4FF",
            }}
          >
            ⇄
          </span>
        </motion.div>

        {/* RIGHT — Code panel flies in from right */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden p-5"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.45)",
            border: "1px solid rgba(0, 212, 255, 0.25)",
            boxShadow: "0 0 30px rgba(0, 212, 255, 0.1)",
            minHeight: "180px",
          }}
          initial={{ x: 240, opacity: 0, rotate: 8 }}
          animate={{ x: 0, opacity: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
        >
          <div className="flex items-start justify-between mb-4">
            <span
              style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: "9px",
                color: "#00D4FF",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
              }}
            >
              src/hero.tsx
            </span>
            <span
              className="inline-block w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: "#10B981" }}
            />
          </div>

          {/* Typewriter code */}
          <div
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "11.5px",
              lineHeight: 1.7,
              letterSpacing: "0.02em",
            }}
          >
            <CodeLine
              delay={0.8}
              parts={[
                { text: "export ", color: "#7C3AED" },
                { text: "function ", color: "#7C3AED" },
                { text: "Hero", color: "#5EEAD4" },
                { text: "() {", color: "#71717A" },
              ]}
            />
            <CodeLine
              delay={1.15}
              parts={[
                { text: "  return ", color: "#7C3AED" },
                { text: "<", color: "#52525B" },
                { text: "h1 ", color: "#F59E0B" },
                { text: "italic", color: "#00D4FF" },
                { text: ">", color: "#52525B" },
              ]}
            />
            <CodeLine
              delay={1.5}
              parts={[
                { text: "    Designing AI…", color: "#F4F4F5" },
              ]}
            />
            <CodeLine
              delay={1.85}
              parts={[
                { text: "  </", color: "#52525B" },
                { text: "h1", color: "#F59E0B" },
                { text: ">", color: "#52525B" },
              ]}
            />
            <CodeLine
              delay={2.1}
              parts={[{ text: "}", color: "#71717A" }]}
            />
          </div>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.1, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(20px, 3vw, 28px)",
            color: "#F4F4F5",
            letterSpacing: "-0.01em",
          }}
        >
          BUILD
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
      transition={{ duration: 0.4, delay, ease: [0.23, 1, 0.32, 1] }}
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
/*  PHASE 4 — Live (HUD activates)                             */
/* ══════════════════════════════════════════════════════════ */
function LivePhase() {
  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Center reticle */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <ReticleSVG />
      </motion.div>

      {/* TL data: SUIT ONLINE */}
      <HUDPanel
        position="top-left"
        delay={0.6}
        label="ROBOT.UI / CARDS.LAB"
        rows={[
          { k: "build", v: "v4.0" },
          { k: "uptime", v: "99.94%" },
          { k: "lat", v: "42ms" },
        ]}
      />

      {/* TR data: CONFIDENCE */}
      <HUDPanel
        position="top-right"
        delay={0.75}
        label="MODEL CONFIDENCE"
        rows={[
          { k: "score", v: "92%" },
          { k: "trend", v: "↑ 4.1%" },
          { k: "calib", v: "OK" },
        ]}
      />

      {/* BL data: TELEMETRY */}
      <HUDPanel
        position="bottom-left"
        delay={0.9}
        label="TELEMETRY"
        rows={[
          { k: "users", v: "2,341" },
          { k: "sessions", v: "18.2k" },
          { k: "crash", v: "0.04%" },
        ]}
      />

      {/* BR badge: PRODUCTION ONLINE */}
      <motion.div
        className="absolute bottom-6 right-4 sm:right-6"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 1.2, ease: [0.23, 1, 0.32, 1] }}
      >
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.25)",
          }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: "#10B981" }}
            />
            <span
              className="relative inline-flex rounded-full h-1.5 w-1.5"
              style={{ backgroundColor: "#10B981" }}
            />
          </span>
          <span
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "10px",
              color: "#10B981",
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 mt-[110px] flex flex-col items-center gap-1"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3, ease: [0.23, 1, 0.32, 1] }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(20px, 3vw, 28px)",
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
            fontSize: "12px",
            color: "rgba(0, 212, 255, 0.85)",
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
    <svg width="180" height="180" viewBox="0 0 180 180">
      {/* Outer ring with rotation */}
      <motion.circle
        cx="90"
        cy="90"
        r="78"
        fill="none"
        stroke="#00D4FF"
        strokeWidth="0.8"
        strokeDasharray="4 3"
        opacity="0.5"
        style={{ transformOrigin: "90px 90px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      />
      {/* Inner ring */}
      <motion.circle
        cx="90"
        cy="90"
        r="50"
        fill="none"
        stroke="#00D4FF"
        strokeWidth="1"
        opacity="0.7"
        style={{ transformOrigin: "90px 90px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />
      {/* Crosshair lines */}
      <line x1="20" y1="90" x2="50" y2="90" stroke="#00D4FF" strokeWidth="1" opacity="0.7" />
      <line x1="130" y1="90" x2="160" y2="90" stroke="#00D4FF" strokeWidth="1" opacity="0.7" />
      <line x1="90" y1="20" x2="90" y2="50" stroke="#00D4FF" strokeWidth="1" opacity="0.7" />
      <line x1="90" y1="130" x2="90" y2="160" stroke="#00D4FF" strokeWidth="1" opacity="0.7" />
      {/* Center dot pulse */}
      <motion.circle
        cx="90"
        cy="90"
        r="4"
        fill="#00D4FF"
        animate={{ opacity: [0.4, 1, 0.4], r: [3, 5, 3] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Ticks at cardinal points */}
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="90"
          y1="14"
          x2="90"
          y2="20"
          stroke="#00D4FF"
          strokeWidth="1.2"
          opacity="0.8"
          style={{
            transformOrigin: "90px 90px",
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
  rows,
}: {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  delay: number;
  label: string;
  rows: { k: string; v: string }[];
}) {
  const posClass = {
    "top-left": "top-16 left-4 sm:left-6 items-start text-left",
    "top-right": "top-16 right-4 sm:right-6 items-end text-right",
    "bottom-left": "bottom-16 left-4 sm:left-6 items-start text-left",
    "bottom-right": "bottom-16 right-4 sm:right-6 items-end text-right",
  }[position];

  const xOffset =
    position.includes("left") ? -16 : 16;

  return (
    <motion.div
      className={`absolute ${posClass} flex flex-col gap-1.5`}
      initial={{ opacity: 0, x: xOffset }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      <span
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "9px",
          color: "rgba(0, 212, 255, 0.85)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
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
