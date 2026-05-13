import { motion, useScroll, useTransform, MotionValue } from "motion/react";
import { useRef } from "react";
import { ArrowDown } from "lucide-react";

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

/* Phase boundaries in global scroll progress (0-1) */
const P = {
  spark: { start: 0, end: 0.25 },
  ux: { start: 0.25, end: 0.5 },
  build: { start: 0.5, end: 0.75 },
  live: { start: 0.75, end: 1 },
};

/* ══════════════════════════════════════════════════════════ */
/*  ApproachStrip                                              */
/* ══════════════════════════════════════════════════════════ */
export function ApproachStrip() {
  return (
    <section className="relative" style={{ backgroundColor: "#FAFAF7" }}>
      {/* Backdrop layer — contained so sticky positioning isn't broken */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute"
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
          className="absolute"
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
        <div className="absolute inset-0 hidden lg:flex justify-between max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-px h-full"
              style={{ backgroundColor: "rgba(15,23,42,0.04)" }}
            />
          ))}
        </div>
      </div>

      {/* Section header */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 sm:pt-32">
        <SectionHeader />
      </div>

      {/* The scroll-driven suit assembly */}
      <SuitAssemblyTimeline />

      {/* Marquee + scroll hint */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pb-24 sm:pb-32">
        <PracticeMarquee />
        <ScrollHint />
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Section header                                            */
/* ────────────────────────────────────────────────────────── */
function SectionHeader() {
  return (
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
          Scroll to assemble
        </span>

        <div className="flex items-center gap-2 mt-3">
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: SUIT_RED_DEEP }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: SUIT_RED_DEEP }}
            />
          </span>
          <span
            className="text-[10.5px] uppercase tracking-[0.2em]"
            style={{
              color: "#7F1D1D",
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            }}
          >
            Mark V · suit-up
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
/*  SuitAssemblyTimeline — scroll-driven 4-phase assembly     */
/* ══════════════════════════════════════════════════════════ */
function SuitAssemblyTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={ref} style={{ height: "320vh" }} className="relative">
      <div className="sticky top-0 h-screen flex items-center justify-center px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        <div
          className="relative w-full mx-auto overflow-hidden rounded-2xl"
          style={{
            maxWidth: "1180px",
            height: "100%",
            maxHeight: "720px",
            backgroundColor: PANEL_BG,
            border: `1px solid rgba(220,38,38,0.25)`,
            boxShadow: `0 40px 90px -30px rgba(0,0,0,0.7), inset 0 1px 0 rgba(251,191,36,0.06), 0 0 60px rgba(220,38,38,0.08)`,
          }}
        >
          <GridFloor />
          <CornerOrnaments />
          <TopBar progress={scrollYProgress} />
          <ScrubBar progress={scrollYProgress} />
          <Stage progress={scrollYProgress} />
          <BottomCaption progress={scrollYProgress} />
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Grid floor + ambient                                       */
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
            "radial-gradient(ellipse at center, transparent 0%, rgba(10,6,6,0.75) 95%)",
        }}
      />
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Iron Man helmet SVG + corner ornaments                    */
/* ────────────────────────────────────────────────────────── */
function MiniHelmet({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="20" rx="18" ry="18" fill={SUIT_RED} opacity="0.12" />
      <path
        d="M20 4 L31 9 L32 19 L32 27 L29 31 L20 33 L11 31 L8 27 L8 19 L9 9 Z"
        fill={SUIT_RED}
        stroke={SUIT_GOLD}
        strokeWidth="0.9"
        strokeLinejoin="round"
      />
      <line x1="20" y1="10" x2="20" y2="30" stroke={SUIT_GOLD} strokeWidth="0.4" opacity="0.3" />
      <path d="M11 15 Q20 13, 29 15" fill="none" stroke={SUIT_GOLD} strokeWidth="0.5" opacity="0.5" />
      <path d="M13 18 L17.5 18 L16.5 21 L13 21 Z" fill={SUIT_GOLD_BRIGHT} />
      <path d="M22.5 18 L27 18 L27 21 L23.5 21 Z" fill={SUIT_GOLD_BRIGHT} />
      <line x1="14" y1="26" x2="26" y2="26" stroke={SUIT_GOLD} strokeWidth="0.7" />
      <line x1="15" y1="27.6" x2="25" y2="27.6" stroke={SUIT_GOLD} strokeWidth="0.5" opacity="0.7" />
    </svg>
  );
}

function CornerOrnaments() {
  const stroke = "rgba(220, 38, 38, 0.4)";
  return (
    <>
      {/* L-bracket crosshairs */}
      {[
        { c: "top-12 left-3", t: "0", l: "0" },
        { c: "top-12 right-3", t: "0", r: "0" },
        { c: "bottom-12 left-3", b: "0", l: "0" },
        { c: "bottom-12 right-3", b: "0", r: "0" },
      ].map((p, i) => (
        <div key={i} className={`absolute ${p.c}`} style={{ width: 14, height: 14 }}>
          <div
            className="absolute w-3 h-px"
            style={{ backgroundColor: stroke, top: p.t, bottom: p.b, left: p.l, right: p.r }}
          />
          <div
            className="absolute h-3 w-px"
            style={{ backgroundColor: stroke, top: p.t, bottom: p.b, left: p.l, right: p.r }}
          />
        </div>
      ))}

      {/* Helmets bottom-left + top-right */}
      <div
        className="absolute bottom-14 left-5 z-10"
        style={{ filter: `drop-shadow(0 0 8px rgba(220, 38, 38, 0.5))` }}
      >
        <MiniHelmet size={30} />
      </div>
      <div
        className="absolute top-14 right-5 z-10"
        style={{ filter: `drop-shadow(0 0 8px rgba(251, 191, 36, 0.45))` }}
      >
        <MiniHelmet size={26} />
      </div>

      {/* Emojis top-left + bottom-right */}
      <motion.div
        className="absolute bottom-14 right-5 z-10 text-[22px] select-none"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 6px rgba(251, 191, 36, 0.5))` }}
      >
        🦾
      </motion.div>
      <motion.div
        className="absolute top-14 left-5 z-10 text-[20px] select-none"
        animate={{ y: [0, 3, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ filter: `drop-shadow(0 0 6px rgba(220, 38, 38, 0.5))` }}
      >
        🦾
      </motion.div>
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Top chrome bar with branding + arc reactor                */
/* ────────────────────────────────────────────────────────── */
function TopBar({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 sm:px-6 py-3"
      style={{ borderBottom: `1px solid rgba(220, 38, 38, 0.15)` }}
    >
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
          // Mark V Assembly
        </span>
      </div>

      <ProgressPercent progress={progress} />
    </div>
  );
}

function ProgressPercent({ progress }: { progress: MotionValue<number> }) {
  const pct = useTransform(progress, (v) =>
    `${Math.min(100, Math.max(0, Math.round(v * 100)))}%`
  );
  return (
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
          style={{
            backgroundColor: SUIT_GOLD_BRIGHT,
            boxShadow: `0 0 6px ${SUIT_GOLD_BRIGHT}`,
          }}
        />
      </motion.div>
      <motion.span
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "10px",
          color: SUIT_GOLD,
          letterSpacing: "0.15em",
          fontVariantNumeric: "tabular-nums",
          minWidth: "32px",
          textAlign: "right",
        }}
      >
        {pct}
      </motion.span>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  ScrubBar — the timeline with 4 quarter ticks               */
/* ────────────────────────────────────────────────────────── */
function ScrubBar({ progress }: { progress: MotionValue<number> }) {
  const fillScale = useTransform(progress, [0, 1], [0, 1]);
  return (
    <div className="absolute top-12 left-0 right-0 z-20 px-4 sm:px-6 pt-3 pb-2">
      {/* Bar */}
      <div
        className="relative h-1 rounded-full overflow-visible"
        style={{ backgroundColor: "rgba(220, 38, 38, 0.18)" }}
      >
        {/* Fill */}
        <motion.div
          className="absolute top-0 left-0 h-full rounded-full origin-left"
          style={{
            width: "100%",
            scaleX: fillScale,
            background: `linear-gradient(90deg, ${SUIT_RED}, ${SUIT_GOLD})`,
            boxShadow: `0 0 10px rgba(251, 191, 36, 0.55)`,
          }}
        />
        {/* Quarter ticks at 0.25, 0.5, 0.75, 1.0 */}
        {[0.25, 0.5, 0.75, 1].map((pos) => (
          <Tick key={pos} pos={pos} progress={progress} />
        ))}
      </div>

      {/* Phase labels under the bar */}
      <div className="relative mt-3 grid grid-cols-4 gap-2">
        <PhaseLabel num="01" name="SPARK" start={0} end={0.25} progress={progress} align="start" />
        <PhaseLabel num="02" name="UX" start={0.25} end={0.5} progress={progress} align="center" />
        <PhaseLabel num="03" name="BUILD" start={0.5} end={0.75} progress={progress} align="center" />
        <PhaseLabel num="04" name="LIVE" start={0.75} end={1} progress={progress} align="end" />
      </div>
    </div>
  );
}

function Tick({ pos, progress }: { pos: number; progress: MotionValue<number> }) {
  const reached = useTransform(progress, [pos - 0.01, pos], [0, 1]);
  const scale = useTransform(reached, [0, 1], [0.9, 1.2]);
  const glow = useTransform(
    reached,
    [0, 1],
    [`0 0 0 rgba(251,191,36,0)`, `0 0 8px ${SUIT_GOLD}`]
  );
  return (
    <motion.div
      className="absolute top-1/2 rounded-full"
      style={{
        left: `${pos * 100}%`,
        width: 8,
        height: 8,
        marginLeft: -4,
        marginTop: -4,
        backgroundColor: PANEL_BG,
        border: `1.5px solid ${SUIT_GOLD}`,
        scale,
        boxShadow: glow,
      }}
    />
  );
}

function PhaseLabel({
  num,
  name,
  start,
  end,
  progress,
  align,
}: {
  num: string;
  name: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
  align: "start" | "center" | "end";
}) {
  const opacity = useTransform(
    progress,
    [start - 0.03, start, end, end + 0.03],
    [0.4, 1, 1, 0.4]
  );
  const color = useTransform(
    progress,
    [start, (start + end) / 2, end],
    ["#71717A", SUIT_GOLD_BRIGHT, "#71717A"]
  );
  const justify =
    align === "start" ? "justify-start" : align === "end" ? "justify-end" : "justify-center";
  return (
    <motion.div
      className={`flex items-center gap-1.5 ${justify}`}
      style={{ opacity }}
    >
      <motion.span
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "9px",
          letterSpacing: "0.18em",
          color,
          fontWeight: 600,
        }}
      >
        {num}
      </motion.span>
      <motion.span
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "9px",
          letterSpacing: "0.18em",
          color,
        }}
      >
        {name}
      </motion.span>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Bottom caption                                             */
/* ────────────────────────────────────────────────────────── */
function BottomCaption({ progress }: { progress: MotionValue<number> }) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-20 px-4 sm:px-6 py-3 overflow-hidden"
      style={{
        borderTop: `1px solid rgba(220, 38, 38, 0.15)`,
        backgroundColor: "rgba(10, 6, 6, 0.7)",
        backdropFilter: "blur(6px)",
        height: 44,
      }}
    >
      <CaptionLine
        progress={progress}
        ranges={[0, 0.22, 0.25]}
        opacities={[1, 1, 0]}
        module="MODULE 01 : SPARK"
        tagline="creativity — the conductor"
      />
      <CaptionLine
        progress={progress}
        ranges={[0.22, 0.25, 0.47, 0.5]}
        opacities={[0, 1, 1, 0]}
        module="MODULE 02 : UX"
        tagline="research → wireframe"
      />
      <CaptionLine
        progress={progress}
        ranges={[0.47, 0.5, 0.72, 0.75]}
        opacities={[0, 1, 1, 0]}
        module="MODULE 03 : BUILD"
        tagline="design ⇄ code"
      />
      <CaptionLine
        progress={progress}
        ranges={[0.72, 0.75, 1]}
        opacities={[0, 1, 1]}
        module="MODULE 04 : LIVE"
        tagline="production AI — shipped"
        statusGold
      />
    </div>
  );
}

function CaptionLine({
  progress,
  ranges,
  opacities,
  module: mod,
  tagline,
  statusGold,
}: {
  progress: MotionValue<number>;
  ranges: number[];
  opacities: number[];
  module: string;
  tagline: string;
  statusGold?: boolean;
}) {
  const op = useTransform(progress, ranges, opacities);
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-between gap-4 px-4 sm:px-6"
      style={{ opacity: op }}
    >
      <div className="flex items-baseline gap-3 min-w-0 flex-1">
        <span
          className="flex-shrink-0"
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "11px",
            color: "#F4F4F5",
            letterSpacing: "0.12em",
          }}
        >
          {">"} {mod}
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
          — {tagline}
        </span>
      </div>
      <span
        className="flex-shrink-0"
        style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: "11px",
          color: statusGold ? SUIT_GOLD : SUIT_RED,
          letterSpacing: "0.18em",
          fontWeight: 600,
        }}
      >
        [{statusGold ? "ONLINE" : "ASSEMBLING"}]
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  Stage — renders all 4 scenes with phase opacities         */
/* ══════════════════════════════════════════════════════════ */
function Stage({ progress }: { progress: MotionValue<number> }) {
  /* Phase opacities — one scene visible at a time */
  const sparkOp = useTransform(progress, [P.spark.start, 0.22, P.spark.end], [1, 1, 0]);
  const uxOp = useTransform(progress, [0.22, P.ux.start, 0.47, P.ux.end], [0, 1, 1, 0]);
  const buildOp = useTransform(progress, [0.47, P.build.start, 0.72, P.build.end], [0, 1, 1, 0]);
  const liveOp = useTransform(progress, [0.72, P.live.start, P.live.end], [0, 1, 1]);

  /* Local progress per phase (0-1 within each phase's range) */
  const sparkLocal = useTransform(progress, [P.spark.start, P.spark.end], [0, 1]);
  const uxLocal = useTransform(progress, [P.ux.start, P.ux.end], [0, 1]);
  const buildLocal = useTransform(progress, [P.build.start, P.build.end], [0, 1]);
  const liveLocal = useTransform(progress, [P.live.start, P.live.end], [0, 1]);

  const stageClass =
    "absolute inset-x-0 flex items-center justify-center px-6 sm:px-10";

  return (
    <div
      className="absolute left-0 right-0"
      style={{ top: 100, bottom: 48 }}
    >
      <motion.div className={stageClass} style={{ opacity: sparkOp, top: 0, bottom: 0 }}>
        <SparkScene progress={sparkLocal} />
      </motion.div>
      <motion.div className={stageClass} style={{ opacity: uxOp, top: 0, bottom: 0 }}>
        <UXScene progress={uxLocal} />
      </motion.div>
      <motion.div className={stageClass} style={{ opacity: buildOp, top: 0, bottom: 0 }}>
        <BuildScene progress={buildLocal} />
      </motion.div>
      <motion.div className={stageClass} style={{ opacity: liveOp, top: 0, bottom: 0 }}>
        <LiveScene progress={liveLocal} />
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 1 — Spark (Arc reactor charges)                      */
/* ══════════════════════════════════════════════════════════ */
function SparkScene({ progress }: { progress: MotionValue<number> }) {
  const coreScale = useTransform(progress, [0, 0.5], [0, 1]);
  const coreGlow = useTransform(
    progress,
    [0, 0.5, 1],
    [
      "0 0 0px rgba(251,191,36,0)",
      `0 0 30px ${SUIT_GOLD}, 0 0 70px rgba(251,191,36,0.6), 0 0 120px rgba(251,191,36,0.3)`,
      `0 0 40px ${SUIT_GOLD}, 0 0 90px rgba(251,191,36,0.7), 0 0 140px rgba(251,191,36,0.4)`,
    ]
  );
  const innerRingScale = useTransform(progress, [0.15, 0.55], [0, 1]);
  const innerRingOpacity = useTransform(progress, [0.15, 0.4], [0, 0.9]);
  const outerRingScale = useTransform(progress, [0.3, 0.7], [0, 1]);
  const outerRingOpacity = useTransform(progress, [0.3, 0.55], [0, 0.85]);
  const rippleOpacity = useTransform(progress, [0.4, 0.6], [0, 1]);
  const titleOpacity = useTransform(progress, [0.7, 1], [0, 1]);
  const titleY = useTransform(progress, [0.7, 1], [12, 0]);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Continuous ripples (only visible after progress 0.4) */}
      <motion.div
        className="absolute flex items-center justify-center"
        style={{ opacity: rippleOpacity }}
      >
        {[0, 0.6, 1.2].map((delay, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              border: `1px solid ${SUIT_RED}`,
              boxShadow: `0 0 24px rgba(220, 38, 38, 0.5)`,
            }}
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{
              width: 340,
              height: 340,
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 2.6,
              delay,
              ease: "easeOut",
              repeat: Infinity,
              repeatDelay: 0.6,
            }}
          />
        ))}
      </motion.div>

      {/* Outer ring with ticks (gold) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 200,
          height: 200,
          border: `1.5px solid ${SUIT_GOLD}`,
          scale: outerRingScale,
          opacity: outerRingOpacity,
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
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

      {/* Inner ring (red, counter-rotating) */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 130,
          height: 130,
          border: `1.5px solid ${SUIT_RED}`,
          boxShadow: `0 0 16px rgba(220, 38, 38, 0.4)`,
          scale: innerRingScale,
          opacity: innerRingOpacity,
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />

      {/* Glowing GOLD core */}
      <motion.div
        className="relative rounded-full"
        style={{
          width: 64,
          height: 64,
          background: `radial-gradient(circle, #FFFFFF 0%, ${SUIT_GOLD_BRIGHT} 30%, ${SUIT_GOLD} 60%, transparent 85%)`,
          scale: coreScale,
          boxShadow: coreGlow,
        }}
      >
        <motion.div
          className="absolute inset-2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.95) 0%, transparent 70%)",
          }}
          animate={{ opacity: [0.6, 1, 0.6], scale: [0.85, 1.08, 0.85] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Title */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ opacity: titleOpacity, y: titleY }}
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
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 2 — UX (Scan + wireframe assembly)                   */
/* ══════════════════════════════════════════════════════════ */
function UXScene({ progress }: { progress: MotionValue<number> }) {
  const scanLeft = useTransform(progress, [0, 0.4], ["-2%", "102%"]);
  const scanOpacity = useTransform(progress, [0, 0.05, 0.35, 0.45], [0, 1, 1, 0]);

  const heroOp = useTransform(progress, [0.15, 0.3], [0, 0.9]);
  const card1Op = useTransform(progress, [0.3, 0.42], [0, 0.85]);
  const card2Op = useTransform(progress, [0.42, 0.54], [0, 0.85]);
  const card3Op = useTransform(progress, [0.54, 0.66], [0, 0.85]);
  const ctaOp = useTransform(progress, [0.7, 0.82], [0, 1]);
  const titleOp = useTransform(progress, [0.85, 1], [0, 1]);
  const titleY = useTransform(progress, [0.85, 1], [12, 0]);

  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Scan line */}
      <motion.div
        className="absolute top-0 bottom-0 z-10 pointer-events-none"
        style={{
          width: "2px",
          background: `linear-gradient(to bottom, transparent, ${SUIT_RED} 50%, transparent)`,
          boxShadow: `0 0 24px ${SUIT_RED}, 0 0 50px rgba(220, 38, 38, 0.5)`,
          left: scanLeft,
          opacity: scanOpacity,
        }}
      />

      {/* Wireframe */}
      <svg
        viewBox="0 0 480 280"
        className="w-[90%] max-w-[600px]"
        style={{ filter: `drop-shadow(0 0 12px rgba(220, 38, 38, 0.22))` }}
      >
        <motion.rect
          x="40" y="30" width="400" height="60" rx="3"
          fill="none"
          stroke={SUIT_RED}
          strokeWidth="1.4"
          strokeDasharray="5 4"
          style={{ opacity: heroOp }}
        />
        <motion.text
          x="50" y="66"
          fill={SUIT_GOLD}
          fontSize="11"
          fontFamily="ui-monospace, monospace"
          style={{ opacity: heroOp }}
        >
          hero · headline
        </motion.text>

        <motion.rect
          x="40" y="120" width="120" height="80" rx="3"
          fill="none" stroke={SUIT_RED} strokeWidth="1.4" strokeDasharray="5 4"
          style={{ opacity: card1Op }}
        />
        <motion.text x="50" y="160" fill={SUIT_GOLD} fontSize="10" fontFamily="ui-monospace, monospace" style={{ opacity: card1Op }}>card.1</motion.text>

        <motion.rect
          x="180" y="120" width="120" height="80" rx="3"
          fill="none" stroke={SUIT_RED} strokeWidth="1.4" strokeDasharray="5 4"
          style={{ opacity: card2Op }}
        />
        <motion.text x="190" y="160" fill={SUIT_GOLD} fontSize="10" fontFamily="ui-monospace, monospace" style={{ opacity: card2Op }}>card.2</motion.text>

        <motion.rect
          x="320" y="120" width="120" height="80" rx="3"
          fill="none" stroke={SUIT_RED} strokeWidth="1.4" strokeDasharray="5 4"
          style={{ opacity: card3Op }}
        />
        <motion.text x="330" y="160" fill={SUIT_GOLD} fontSize="10" fontFamily="ui-monospace, monospace" style={{ opacity: card3Op }}>card.3</motion.text>

        <motion.rect
          x="40" y="230" width="160" height="32" rx="3"
          fill="rgba(251, 191, 36, 0.18)" stroke={SUIT_GOLD} strokeWidth="1.4"
          style={{ opacity: ctaOp }}
        />
        <motion.text
          x="120" y="250" textAnchor="middle"
          fill={SUIT_GOLD_BRIGHT} fontSize="11" fontFamily="ui-monospace, monospace" fontWeight="600"
          style={{ opacity: ctaOp }}
        >
          → CTA
        </motion.text>
      </svg>

      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ opacity: titleOp, y: titleY }}
      >
        <span
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 3vw, 30px)",
            color: "#F4F4F5",
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
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 3 — Build (Design ⇄ code modules fly in)            */
/* ══════════════════════════════════════════════════════════ */
function BuildScene({ progress }: { progress: MotionValue<number> }) {
  const leftX = useTransform(progress, [0, 0.3], [-280, 0]);
  const leftRot = useTransform(progress, [0, 0.3], [-10, 0]);
  const leftOp = useTransform(progress, [0, 0.18], [0, 1]);

  const rightX = useTransform(progress, [0.08, 0.38], [280, 0]);
  const rightRot = useTransform(progress, [0.08, 0.38], [10, 0]);
  const rightOp = useTransform(progress, [0.08, 0.26], [0, 1]);

  const bridgeScale = useTransform(progress, [0.32, 0.46], [0, 1]);
  const bridgeRot = useTransform(progress, [0.32, 0.46], [-180, 0]);
  const bridgeOp = useTransform(progress, [0.32, 0.46], [0, 1]);

  const titleOp = useTransform(progress, [0.85, 1], [0, 1]);
  const titleY = useTransform(progress, [0.85, 1], [12, 0]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative flex items-stretch gap-3 sm:gap-4 w-[90%] max-w-[640px]">
        {/* LEFT — design tokens */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden p-5"
          style={{
            backgroundColor: "rgba(220, 38, 38, 0.06)",
            border: `1px solid ${SUIT_RED}`,
            boxShadow: `0 0 30px rgba(220, 38, 38, 0.15)`,
            minHeight: 200,
            x: leftX,
            rotate: leftRot,
            opacity: leftOp,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <span style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 9,
              color: SUIT_RED,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}>
              design.tokens
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SUIT_RED, boxShadow: `0 0 6px ${SUIT_RED}` }} />
          </div>

          <div className="flex items-baseline gap-3 mb-5">
            <BuildItem progress={progress} appearAt={[0.2, 0.35]}>
              <span style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: 48,
                color: "#F4F4F5",
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}>Aa</span>
            </BuildItem>
            <BuildItem progress={progress} appearAt={[0.28, 0.42]}>
              <span style={{
                fontFamily: "Playfair Display, serif",
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: 34,
                color: SUIT_GOLD,
                lineHeight: 1,
              }}>Aa</span>
            </BuildItem>
          </div>

          <div className="flex items-center gap-2">
            {[SUIT_RED, SUIT_GOLD, "#F4F4F5", "#27272A"].map((c, i) => (
              <BuildSwatch key={i} color={c} progress={progress} appearAt={[0.4 + i * 0.04, 0.52 + i * 0.04]} hasBorder={c === "#27272A"} />
            ))}
          </div>
        </motion.div>

        {/* CENTER — bridge */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 rounded-full"
          style={{
            backgroundColor: PANEL_BG,
            border: `2px solid ${SUIT_GOLD}`,
            boxShadow: `0 0 28px ${SUIT_GOLD}, inset 0 0 12px rgba(220, 38, 38, 0.3)`,
            scale: bridgeScale,
            rotate: bridgeRot,
            opacity: bridgeOp,
          }}
        >
          <span style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 18,
            color: SUIT_GOLD_BRIGHT,
            fontWeight: 600,
          }}>⇄</span>
        </motion.div>

        {/* RIGHT — code */}
        <motion.div
          className="flex-1 rounded-lg overflow-hidden p-5"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            border: `1px solid ${SUIT_GOLD}`,
            boxShadow: `0 0 30px rgba(251, 191, 36, 0.15)`,
            minHeight: 200,
            x: rightX,
            rotate: rightRot,
            opacity: rightOp,
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <span style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 9,
              color: SUIT_GOLD,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}>
              src/hero.tsx
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: SUIT_GOLD, boxShadow: `0 0 6px ${SUIT_GOLD}` }} />
          </div>

          <div style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 11.5,
            lineHeight: 1.75,
            letterSpacing: "0.02em",
          }}>
            <CodeLine progress={progress} appearAt={[0.5, 0.6]} parts={[
              { t: "export ", c: "#F87171" },
              { t: "function ", c: SUIT_RED },
              { t: "Hero", c: SUIT_GOLD_BRIGHT },
              { t: "() {", c: "#71717A" },
            ]} />
            <CodeLine progress={progress} appearAt={[0.6, 0.7]} parts={[
              { t: "  return ", c: "#F87171" },
              { t: "<", c: "#52525B" },
              { t: "h1 ", c: SUIT_GOLD },
              { t: "italic", c: SUIT_RED },
              { t: ">", c: "#52525B" },
            ]} />
            <CodeLine progress={progress} appearAt={[0.7, 0.8]} parts={[
              { t: "    Designing AI…", c: "#F4F4F5" },
            ]} />
            <CodeLine progress={progress} appearAt={[0.8, 0.88]} parts={[
              { t: "  </", c: "#52525B" },
              { t: "h1", c: SUIT_GOLD },
              { t: ">", c: "#52525B" },
            ]} />
            <CodeLine progress={progress} appearAt={[0.88, 0.95]} parts={[
              { t: "}", c: "#71717A" },
            ]} />
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ opacity: titleOp, y: titleY }}
      >
        <span style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(22px, 3vw, 30px)",
          color: "#F4F4F5",
        }}>BUILD</span>
        <span style={{
          fontFamily: "Playfair Display, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: SUIT_GOLD,
        }}>design ⇄ code</span>
      </motion.div>
    </div>
  );
}

function BuildItem({ progress, appearAt, children }: {
  progress: MotionValue<number>;
  appearAt: [number, number];
  children: React.ReactNode;
}) {
  const op = useTransform(progress, appearAt, [0, 1]);
  const y = useTransform(progress, appearAt, [8, 0]);
  return <motion.div style={{ opacity: op, y }}>{children}</motion.div>;
}

function BuildSwatch({ color, progress, appearAt, hasBorder }: {
  color: string;
  progress: MotionValue<number>;
  appearAt: [number, number];
  hasBorder?: boolean;
}) {
  const scale = useTransform(progress, appearAt, [0, 1]);
  return (
    <motion.div
      className="w-7 h-7 rounded-full"
      style={{
        backgroundColor: color,
        border: hasBorder ? `1px solid ${SUIT_GOLD}` : "none",
        boxShadow: `0 0 12px ${color}55`,
        scale,
      }}
    />
  );
}

function CodeLine({ progress, appearAt, parts }: {
  progress: MotionValue<number>;
  appearAt: [number, number];
  parts: { t: string; c: string }[];
}) {
  const op = useTransform(progress, appearAt, [0, 1]);
  const x = useTransform(progress, appearAt, [-8, 0]);
  return (
    <motion.div style={{ opacity: op, x }}>
      {parts.map((p, i) => (
        <span key={i} style={{ color: p.c }}>{p.t}</span>
      ))}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  PHASE 4 — Live (Helmet snaps shut → HUD activates)        */
/* ══════════════════════════════════════════════════════════ */
function LiveScene({ progress }: { progress: MotionValue<number> }) {
  const helmetOp = useTransform(progress, [0, 0.15], [0, 1]);
  const helmetScale = useTransform(progress, [0, 0.15], [0.9, 1]);

  /* Faceplate slides DOWN from -55 (open/raised) to 0 (snapped shut) */
  const faceplateY = useTransform(progress, [0.15, 0.45], [-55, 0]);
  const faceplateTransform = useTransform(faceplateY, (y) => `translate(0, ${y})`);

  /* Eye glow intensifies after visor closes */
  const eyeGlow = useTransform(progress, [0.4, 0.55], [0, 1]);

  /* HUD overlays */
  const reticleScale = useTransform(progress, [0.5, 0.65], [0.6, 1]);
  const reticleOp = useTransform(progress, [0.5, 0.65], [0, 0.65]);

  const hud1Op = useTransform(progress, [0.6, 0.72], [0, 1]);
  const hud1X = useTransform(progress, [0.6, 0.72], [-18, 0]);
  const hud2Op = useTransform(progress, [0.65, 0.77], [0, 1]);
  const hud2X = useTransform(progress, [0.65, 0.77], [18, 0]);
  const hud3Op = useTransform(progress, [0.7, 0.82], [0, 1]);
  const hud3X = useTransform(progress, [0.7, 0.82], [-18, 0]);

  const badgeOp = useTransform(progress, [0.85, 1], [0, 1]);
  const badgeScale = useTransform(progress, [0.85, 1], [0.85, 1]);

  const titleOp = useTransform(progress, [0.9, 1], [0, 1]);
  const titleY = useTransform(progress, [0.9, 1], [12, 0]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Helmet */}
      <motion.svg
        viewBox="0 0 240 280"
        style={{ height: "78%", opacity: helmetOp, scale: helmetScale }}
        className="absolute"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Helmet outer shell */}
        <path
          d="M120 20 Q165 18, 178 50 Q190 80, 188 110 L185 142 Q180 178, 165 208 Q150 233, 120 245 Q90 233, 75 208 Q60 178, 55 142 L52 110 Q50 80, 62 50 Q75 18, 120 20 Z"
          fill={SUIT_RED}
          stroke={SUIT_GOLD}
          strokeWidth="2.4"
          strokeLinejoin="round"
        />

        {/* Dark interior (visible when faceplate is raised) */}
        <ellipse cx="120" cy="138" rx="56" ry="64" fill="#000000" opacity="0.95" />

        {/* Inner glow points (eye sockets in shadow) */}
        <ellipse cx="100" cy="128" rx="10" ry="5" fill={SUIT_GOLD} opacity="0.18" />
        <ellipse cx="140" cy="128" rx="10" ry="5" fill={SUIT_GOLD} opacity="0.18" />

        {/* Faceplate — animates Y from -55 (open) to 0 (snapped) */}
        <motion.g transform={faceplateTransform}>
          <path
            d="M62 78 Q66 70, 78 70 L162 70 Q174 70, 178 78 L185 130 Q182 178, 168 208 Q150 232, 120 244 Q90 232, 72 208 Q58 178, 55 130 Z"
            fill={SUIT_RED}
            stroke={SUIT_GOLD}
            strokeWidth="2.4"
            strokeLinejoin="round"
          />
          {/* Center face plate line */}
          <line x1="120" y1="78" x2="120" y2="242" stroke={SUIT_GOLD} strokeWidth="0.7" opacity="0.4" />
          {/* Brow */}
          <path d="M70 116 Q120 108, 170 116" fill="none" stroke={SUIT_GOLD} strokeWidth="1" opacity="0.55" />
          {/* Cheek lines */}
          <path d="M62 155 Q75 165, 80 178" fill="none" stroke={SUIT_GOLD} strokeWidth="0.8" opacity="0.45" />
          <path d="M178 155 Q165 165, 160 178" fill="none" stroke={SUIT_GOLD} strokeWidth="0.8" opacity="0.45" />
          {/* Eye slits */}
          <path d="M73 132 L106 132 L98 148 L73 148 Z" fill={SUIT_GOLD_BRIGHT} />
          <path d="M134 132 L167 132 L167 148 L142 148 Z" fill={SUIT_GOLD_BRIGHT} />
          {/* Mouth vents */}
          <line x1="86" y1="200" x2="154" y2="200" stroke={SUIT_GOLD} strokeWidth="1.8" />
          <line x1="89" y1="206" x2="151" y2="206" stroke={SUIT_GOLD} strokeWidth="1.3" opacity="0.75" />
          <line x1="93" y1="212" x2="147" y2="212" stroke={SUIT_GOLD} strokeWidth="0.9" opacity="0.5" />
        </motion.g>

        {/* Eye glow overlay (intensifies after visor closes) */}
        <motion.g style={{ opacity: eyeGlow }}>
          <ellipse cx="89" cy="140" rx="22" ry="12" fill={SUIT_GOLD_BRIGHT} opacity="0.5" filter="url(#softblur)" />
          <ellipse cx="151" cy="140" rx="22" ry="12" fill={SUIT_GOLD_BRIGHT} opacity="0.5" filter="url(#softblur)" />
        </motion.g>

        <defs>
          <filter id="softblur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>
      </motion.svg>

      {/* HUD reticle behind/over helmet */}
      <motion.div
        className="absolute"
        style={{ scale: reticleScale, opacity: reticleOp }}
      >
        <ReticleSVG />
      </motion.div>

      {/* HUD panels */}
      <motion.div
        className="absolute top-2 left-2 sm:top-4 sm:left-4"
        style={{ opacity: hud1Op, x: hud1X }}
      >
        <HUDPanel align="left" label="ROBOT.UI / CARDS.LAB" accent={SUIT_RED} rows={[
          { k: "build", v: "v4.0" },
          { k: "uptime", v: "99.94%" },
          { k: "lat", v: "42ms" },
        ]} />
      </motion.div>

      <motion.div
        className="absolute top-2 right-2 sm:top-4 sm:right-4"
        style={{ opacity: hud2Op, x: hud2X }}
      >
        <HUDPanel align="right" label="MODEL CONFIDENCE" accent={SUIT_GOLD} rows={[
          { k: "score", v: "92%" },
          { k: "trend", v: "↑ 4.1%" },
          { k: "calib", v: "OK" },
        ]} />
      </motion.div>

      <motion.div
        className="absolute bottom-12 left-2 sm:bottom-14 sm:left-4"
        style={{ opacity: hud3Op, x: hud3X }}
      >
        <HUDPanel align="left" label="TELEMETRY" accent={SUIT_RED} rows={[
          { k: "users", v: "2,341" },
          { k: "sessions", v: "18.2k" },
          { k: "crash", v: "0.04%" },
        ]} />
      </motion.div>

      {/* Production badge */}
      <motion.div
        className="absolute bottom-12 right-2 sm:bottom-14 sm:right-4"
        style={{ opacity: badgeOp, scale: badgeScale }}
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
          <span style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 10,
            color: SUIT_GOLD_BRIGHT,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}>Production · Online</span>
        </div>
      </motion.div>

      {/* Title at bottom */}
      <motion.div
        className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ opacity: titleOp, y: titleY }}
      >
        <span style={{
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          fontSize: "clamp(22px, 3vw, 30px)",
          color: "#F4F4F5",
        }}>LIVE</span>
        <span style={{
          fontFamily: "Playfair Display, serif",
          fontStyle: "italic",
          fontSize: 13,
          color: SUIT_GOLD,
        }}>shipped, not slideware</span>
      </motion.div>
    </div>
  );
}

function ReticleSVG() {
  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      <motion.circle
        cx="110" cy="110" r="96"
        fill="none"
        stroke={SUIT_RED}
        strokeWidth="0.9"
        strokeDasharray="5 3"
        opacity="0.55"
        style={{ transformOrigin: "110px 110px" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      />
      <motion.circle
        cx="110" cy="110" r="62"
        fill="none"
        stroke={SUIT_GOLD}
        strokeWidth="1.1"
        opacity="0.7"
        style={{ transformOrigin: "110px 110px" }}
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      {[0, 90, 180, 270].map((deg) => (
        <line
          key={deg}
          x1="110" y1="14" x2="110" y2="22"
          stroke={SUIT_GOLD}
          strokeWidth="1.4"
          opacity="0.85"
          style={{ transformOrigin: "110px 110px", transform: `rotate(${deg}deg)` }}
        />
      ))}
    </svg>
  );
}

function HUDPanel({
  align,
  label,
  accent,
  rows,
}: {
  align: "left" | "right";
  label: string;
  accent: string;
  rows: { k: string; v: string }[];
}) {
  return (
    <div className={`flex flex-col gap-1.5 ${align === "right" ? "items-end text-right" : "items-start text-left"}`}>
      <span style={{
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 9,
        color: accent,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        fontWeight: 600,
      }}>
        {label}
      </span>
      {rows.map((r) => (
        <div key={r.k} className="flex items-baseline gap-2">
          <span style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 9.5,
            color: "rgba(244, 244, 245, 0.45)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}>{r.k}</span>
          <span style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 12,
            color: "#F4F4F5",
            letterSpacing: "0.05em",
            fontVariantNumeric: "tabular-nums",
            fontWeight: 600,
          }}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Practice marquee + scroll hint                            */
/* ────────────────────────────────────────────────────────── */
function PracticeMarquee() {
  return (
    <motion.div
      className="mt-12 sm:mt-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
    >
      <div
        className="flex items-baseline justify-between mb-5 pb-3"
        style={{ borderBottom: "1px solid rgba(15,23,42,0.1)" }}
      >
        <span className="text-[10px] uppercase tracking-[0.22em]" style={{
          color: "#71717A",
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        }}>
          Practice areas
        </span>
        <span className="text-[10px] uppercase tracking-[0.22em]" style={{
          color: "#A1A1AA",
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        }}>
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
              <span style={{
                color: "#09090B",
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                fontSize: "clamp(15px, 1.5vw, 18px)",
              }}>
                {area}
              </span>
              <span style={{
                color: SUIT_RED_DEEP,
                fontFamily: "Playfair Display, serif",
                fontStyle: "italic",
                fontSize: 16,
              }}>✦</span>
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
      <span className="text-[10px] uppercase tracking-[0.25em] mb-4" style={{
        color: "#71717A",
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
      }}>
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
