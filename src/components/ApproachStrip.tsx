import { motion } from "motion/react";
import { ArrowDown, Sparkles, ArrowRight } from "lucide-react";

/* ────────────────────────────────────────────────────────── */
/*  Practice areas marquee — keep                             */
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

        {/* ── Header: eyebrow + short claim ── */}
        <div className="grid grid-cols-12 gap-6 mb-16 sm:mb-20">
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
                Live demo, not a mockup
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

        {/* ── The 3D skill stack ── */}
        <SkillStack3D />

        {/* ── Practice marquee — kept ── */}
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
/*  SkillStack3D                                              */
/*  CSS 3D perspective scene with 4 floating layer cards,     */
/*  each demonstrating a real stage of how Jay works.         */
/*  Layers cascade from back (faded, abstract) to front       */
/*  (sharp, shipped) — making the page itself the demo.       */
/* ══════════════════════════════════════════════════════════ */
function SkillStack3D() {
  return (
    <>
      {/* ─── Desktop: full 3D perspective scene ─── */}
      <div
        className="hidden lg:block relative w-full"
        style={{
          perspective: "2000px",
          perspectiveOrigin: "50% 45%",
        }}
        aria-label="Animated stack of design skills from spark to shipped product"
      >
        <div
          className="relative mx-auto"
          style={{
            transformStyle: "preserve-3d",
            height: "clamp(480px, 58vh, 640px)",
            maxWidth: "1080px",
          }}
        >
          {/* Connecting threads (deepest layer, subtle) */}
          <ConnectingThreads />

          {/* L1 — Spark (Creativity), back, faded */}
          <FloatingCard
            x={-280}
            y={-110}
            z={-300}
            rotY={18}
            rotX={-3}
            duration={7}
            floatRange={8}
            zIndex={1}
            opacity={0.42}
          >
            <CreativityContent />
          </FloatingCard>

          {/* L2 — UX, middle-back */}
          <FloatingCard
            x={-90}
            y={80}
            z={-100}
            rotY={9}
            rotX={1}
            duration={6}
            floatRange={7}
            zIndex={2}
            opacity={0.7}
          >
            <UXContent />
          </FloatingCard>

          {/* L3 — Build (design ⇄ code), middle-front */}
          <FloatingCard
            x={110}
            y={-60}
            z={80}
            rotY={-8}
            rotX={-1.5}
            duration={5.5}
            floatRange={6}
            zIndex={3}
            opacity={0.92}
          >
            <BuildContent />
          </FloatingCard>

          {/* L4 — Live (Production AI), front, sharpest */}
          <FloatingCard
            x={290}
            y={90}
            z={210}
            rotY={-17}
            rotX={2}
            duration={5}
            floatRange={5}
            zIndex={4}
            opacity={1}
          >
            <AIContent />
          </FloatingCard>
        </div>
      </div>

      {/* ─── Mobile / Tablet: flat vertical stack ─── */}
      <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FlatLayer><CreativityContent /></FlatLayer>
        <FlatLayer><UXContent /></FlatLayer>
        <FlatLayer><BuildContent /></FlatLayer>
        <FlatLayer><AIContent /></FlatLayer>
      </div>
    </>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  FloatingCard — 3D-positioned + perpetual gentle motion    */
/* ────────────────────────────────────────────────────────── */
function FloatingCard({
  x,
  y,
  z,
  rotY,
  rotX,
  duration,
  floatRange,
  zIndex,
  opacity,
  children,
}: {
  x: number;
  y: number;
  z: number;
  rotY: number;
  rotX: number;
  duration: number;
  floatRange: number;
  zIndex: number;
  opacity: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        width: "300px",
        height: "210px",
        marginLeft: "-150px",
        marginTop: "-105px",
        transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${rotY}deg) rotateX(${rotX}deg)`,
        transformStyle: "preserve-3d",
        opacity,
        zIndex,
        willChange: "transform",
      }}
      animate={{
        y: [0, -floatRange, 0],
        rotateZ: [-0.4, 0.4, -0.4],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Mobile flat wrapper                                        */
/* ────────────────────────────────────────────────────────── */
function FlatLayer({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      style={{ width: "100%", aspectRatio: "300/210" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  Connecting threads — subtle SVG lines between depth layers */
/* ────────────────────────────────────────────────────────── */
function ConnectingThreads() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1080 600"
      preserveAspectRatio="none"
      style={{ zIndex: 0, opacity: 0.18 }}
    >
      <defs>
        <linearGradient id="thread" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0F766E" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#0F766E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path
        d="M 240 190 Q 420 280, 540 240 T 840 360"
        stroke="url(#thread)"
        strokeWidth="1.2"
        fill="none"
        strokeDasharray="2 6"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  LAYER CONTENT — each "exhibit" in the 3D scene            */
/* ══════════════════════════════════════════════════════════ */

/* ─── L1: Creativity / Spark ─── */
function CreativityContent() {
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden p-5 flex flex-col"
      style={{
        backgroundColor: "rgba(253, 230, 138, 0.22)",
        border: "1px dashed rgba(15,23,42,0.22)",
        boxShadow: "0 20px 40px -15px rgba(15,23,42,0.12)",
      }}
    >
      {/* Top: spark icon + tag */}
      <div className="flex items-start justify-between">
        <motion.div
          animate={{ rotate: [0, 14, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="w-7 h-7" style={{ color: "#92400E" }} strokeWidth={1.5} />
        </motion.div>
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9.5px",
            color: "#92400E",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          01 / Spark
        </span>
      </div>

      {/* Mid: hand-drawn squiggle */}
      <svg
        className="absolute left-5 right-5"
        style={{ top: "44%" }}
        viewBox="0 0 260 50"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 4 28 Q 40 4, 80 28 T 156 28 T 232 28"
          stroke="rgba(15, 23, 42, 0.28)"
          fill="none"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 5"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
        />
        <circle cx="232" cy="28" r="3" fill="#0F766E" />
      </svg>

      {/* Bottom-left: caption */}
      <div className="mt-auto">
        <p
          className="text-[18px] leading-tight"
          style={{
            color: "#27272A",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Creativity
        </p>
        <p
          className="text-[11.5px] mt-0.5"
          style={{
            color: "#52525B",
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
          }}
        >
          — the conductor
        </p>
      </div>
    </div>
  );
}

/* ─── L2: UX / Research → Wireframe ─── */
function UXContent() {
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden p-5 flex flex-col"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(15,23,42,0.1)",
        boxShadow: "0 20px 40px -15px rgba(15,23,42,0.12)",
      }}
    >
      {/* Top tag */}
      <div className="flex items-start justify-between mb-3">
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9.5px",
            color: "#52525B",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          02 / Research → Flow
        </span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#A1A1AA" }} />
      </div>

      {/* Wireframe mini */}
      <div className="flex-1 flex items-center justify-center my-2">
        <svg viewBox="0 0 240 90" className="w-full">
          {/* Three connected boxes */}
          <motion.g
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.1 }}
          >
            <rect x="10" y="20" width="50" height="50" rx="3" fill="none" stroke="rgba(15,23,42,0.35)" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="35" y="48" textAnchor="middle" fill="#71717A" fontSize="8" fontFamily="ui-monospace, monospace">research</text>

            <rect x="95" y="20" width="50" height="50" rx="3" fill="none" stroke="rgba(15,23,42,0.45)" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x="120" y="48" textAnchor="middle" fill="#52525B" fontSize="8" fontFamily="ui-monospace, monospace">flow</text>

            <rect x="180" y="20" width="50" height="50" rx="3" fill="none" stroke="rgba(15,23,42,0.6)" strokeWidth="1.5" />
            <text x="205" y="48" textAnchor="middle" fill="#27272A" fontSize="8" fontFamily="ui-monospace, monospace">IA</text>

            {/* arrows */}
            <motion.path
              d="M 62 45 L 92 45"
              stroke="#0F766E"
              strokeWidth="1.2"
              fill="none"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
            <motion.path
              d="M 147 45 L 177 45"
              stroke="#0F766E"
              strokeWidth="1.2"
              fill="none"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
          </motion.g>
          <defs>
            <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="4" refY="3" orient="auto">
              <polygon points="0 0, 6 3, 0 6" fill="#0F766E" />
            </marker>
          </defs>
        </svg>
      </div>

      {/* Bottom caption */}
      <div className="mt-auto">
        <p
          className="text-[18px] leading-tight"
          style={{
            color: "#09090B",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          UX
        </p>
        <p
          className="text-[11.5px] mt-0.5"
          style={{
            color: "#52525B",
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
          }}
        >
          — the unknown, mapped
        </p>
      </div>
    </div>
  );
}

/* ─── L3: Build / Design ⇄ Code ─── */
function BuildContent() {
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid rgba(15,23,42,0.1)",
        boxShadow: "0 24px 50px -18px rgba(15,23,42,0.18)",
        backgroundColor: "#FFFFFF",
      }}
    >
      {/* Top: tag bar */}
      <div className="px-5 pt-4 flex items-start justify-between">
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9.5px",
            color: "#0F766E",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          03 / Design ⇄ Code
        </span>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#0F766E" }} />
      </div>

      {/* Split panel: design tokens + code */}
      <div className="flex-1 flex items-stretch gap-0 px-5 py-4 min-h-0">
        {/* Left: tokens */}
        <div className="flex-1 flex flex-col gap-1.5 justify-center pr-3">
          <span style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            fontSize: "20px",
            color: "#09090B",
            letterSpacing: "-0.025em",
            lineHeight: 1,
          }}>
            Aa
          </span>
          <span style={{
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
            fontSize: "13px",
            color: "#0F766E",
          }}>
            Aa
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#0F766E" }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#7C3AED" }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#09090B" }} />
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FAFAF7", border: "1px solid rgba(15,23,42,0.18)" }} />
          </div>
        </div>

        {/* Bridge */}
        <div className="flex items-center justify-center px-1">
          <ArrowRight className="w-4 h-4" style={{ color: "#52525B" }} strokeWidth={1.8} />
        </div>

        {/* Right: code snippet */}
        <div
          className="flex-1 rounded-md px-2.5 py-2 flex flex-col justify-center"
          style={{
            backgroundColor: "#0F1115",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "9.5px",
            lineHeight: 1.55,
            letterSpacing: "0.01em",
          }}
        >
          <span style={{ color: "#7C3AED" }}>{"<Hero"}</span>
          <span style={{ color: "#52525B" }}>{"  title="}<span style={{ color: "#5EEAD4" }}>"AI"</span></span>
          <span style={{ color: "#52525B" }}>{"  italic"}</span>
          <span style={{ color: "#7C3AED" }}>{"/>"}</span>
        </div>
      </div>

      {/* Bottom caption */}
      <div className="px-5 pb-4">
        <p
          className="text-[18px] leading-tight"
          style={{
            color: "#09090B",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Build
        </p>
        <p
          className="text-[11.5px] mt-0.5"
          style={{
            color: "#52525B",
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
          }}
        >
          — designer-engineer
        </p>
      </div>
    </div>
  );
}

/* ─── L4: Live / Production AI ─── */
function AIContent() {
  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden flex flex-col"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid rgba(15,23,42,0.1)",
        boxShadow: "0 30px 60px -20px rgba(15,23,42,0.22), 0 0 0 1px rgba(15,118,110,0.06)",
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: "1px solid rgba(15,23,42,0.06)", backgroundColor: "#FAFAF7" }}
      >
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#28C840" }} />
        </div>
        <span
          style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: "8.5px",
            color: "#71717A",
            letterSpacing: "0.1em",
          }}
        >
          cards.lab / robot.ui
        </span>
      </div>

      {/* AI interface mini */}
      <div className="flex-1 px-4 py-3 flex flex-col justify-between min-h-0">
        <div>
          <div className="flex items-baseline justify-between mb-1.5">
            <span
              className="text-[10px] uppercase tracking-[0.15em]"
              style={{
                color: "#71717A",
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              }}
            >
              Robot confidence
            </span>
            <span
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                fontSize: "16px",
                color: "#09090B",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              92%
            </span>
          </div>

          {/* Progress bar */}
          <div
            className="relative w-full rounded-full overflow-hidden"
            style={{ backgroundColor: "rgba(15,23,42,0.06)", height: "5px" }}
          >
            <motion.div
              className="absolute top-0 left-0 h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #0F766E 0%, #14B8A6 100%)",
              }}
              initial={{ width: "0%" }}
              whileInView={{ width: "92%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.4, ease: [0.23, 1, 0.32, 1] }}
            />
          </div>

          {/* Hint */}
          <p
            className="mt-2.5 text-[10.5px]"
            style={{
              color: "#52525B",
              fontFamily: "DM Sans, sans-serif",
              lineHeight: 1.4,
            }}
          >
            <span style={{ color: "#0F766E", textDecoration: "underline", textUnderlineOffset: "2px" }}>
              Why this answer?
            </span>{" "}
            · uncertainty rising
          </p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ backgroundColor: "#28C840" }}
              />
              <span
                className="relative inline-flex rounded-full h-1.5 w-1.5"
                style={{ backgroundColor: "#28C840" }}
              />
            </span>
            <span
              className="text-[9.5px] uppercase tracking-[0.18em]"
              style={{
                color: "#134E4A",
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              }}
            >
              Live
            </span>
          </div>
          <span
            style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: "8.5px",
              color: "#A1A1AA",
            }}
          >
            04 / Production
          </span>
        </div>
      </div>

      {/* Bottom caption */}
      <div
        className="px-4 py-3"
        style={{ borderTop: "1px solid rgba(15,23,42,0.06)" }}
      >
        <p
          className="text-[18px] leading-tight"
          style={{
            color: "#09090B",
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            letterSpacing: "-0.02em",
          }}
        >
          Production AI
        </p>
        <p
          className="text-[11.5px] mt-0.5"
          style={{
            color: "#0F766E",
            fontFamily: "Playfair Display, serif",
            fontStyle: "italic",
          }}
        >
          — shipped, not slideware
        </p>
      </div>
    </div>
  );
}
