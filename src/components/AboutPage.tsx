import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Linkedin,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router";
import userPhoto from "../assets/hero-portrait.jpeg";

/* ────────────────────────────────────────────────────────── */
/*  CUSTOM SVG ICONS — brand-quality, hand-built, animated    */
/* ────────────────────────────────────────────────────────── */

/* Creativity — animated multi-layer starburst with orbiting sparkles */
function CreativityIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="cr-grad" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
        <radialGradient id="cr-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A78BFA" stopOpacity="0.5" />
          <stop offset="70%" stopColor="#A78BFA" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Soft glow */}
      <motion.circle
        cx="50" cy="50" r="42"
        fill="url(#cr-glow)"
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      />

      {/* Outer rotating 4-pt cross */}
      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        <path
          d="M50 10 L53 47 L90 50 L53 53 L50 90 L47 53 L10 50 L47 47 Z"
          fill="url(#cr-grad)"
          opacity="0.55"
        />
      </motion.g>

      {/* Inner counter-rotating 4-pt diamond */}
      <motion.g
        animate={{ rotate: -360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        <path
          d="M50 24 L57 50 L50 76 L43 50 Z M24 50 L50 43 L76 50 L50 57 Z"
          fill="url(#cr-grad)"
        />
      </motion.g>

      {/* Floating sparkle satellites */}
      {[
        { cx: 22, cy: 28, d: 0 },
        { cx: 80, cy: 22, d: 0.7 },
        { cx: 78, cy: 78, d: 1.4 },
        { cx: 18, cy: 72, d: 2.1 },
      ].map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx} cy={s.cy} r="1.8"
          fill="#A78BFA"
          animate={{ opacity: [0, 1, 0], scale: [0.4, 1.4, 0.4] }}
          transition={{ duration: 2.8, repeat: Infinity, delay: s.d, ease: "easeInOut" }}
        />
      ))}
    </svg>
  );
}

/* Figma — the actual Figma logo (5 brand-colored shapes) with staggered fade-in */
function FigmaIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 38 57" fill="none">
      {/* TOP-LEFT: red */}
      <motion.path
        fill="#F24E1E"
        d="M3 9.5C3 5.08172 6.58172 1.5 11 1.5H19V17.5H11C6.58172 17.5 3 13.9183 3 9.5V9.5Z"
        initial={{ opacity: 0, x: -6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0 }}
      />
      {/* TOP-RIGHT: orange */}
      <motion.path
        fill="#FF7262"
        d="M19 1.5H27C31.4183 1.5 35 5.08172 35 9.5C35 13.9183 31.4183 17.5 27 17.5H19V1.5Z"
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      />
      {/* MID-RIGHT: purple */}
      <motion.circle
        cx="27" cy="28.5" r="8"
        fill="#A259FF"
        initial={{ opacity: 0, scale: 0 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
      />
      {/* MID-LEFT: pink */}
      <motion.path
        fill="#FF7262"
        d="M3 25.5C3 21.0817 6.58172 17.5 11 17.5H19V33.5H11C6.58172 33.5 3 29.9183 3 25.5V25.5Z"
        initial={{ opacity: 0, x: -6 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.15 }}
      />
      {/* BOTTOM-LEFT: blue */}
      <motion.path
        fill="#1ABCFE"
        d="M3 41.5C3 37.0817 6.58172 33.5 11 33.5H19V49.5C19 53.9183 15.4183 57.5 11 57.5C6.58172 57.5 3 53.9183 3 49.5V41.5Z"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.25 }}
      />
    </svg>
  );
}

/* Stitch — Google's color threads woven, with continuous draw-in */
function StitchIcon() {
  const colors = ["#4285F4", "#EA4335", "#FBBC04", "#34A853"];
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <defs>
        <filter id="stitch-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" />
          <feOffset dy="0.5" />
          <feComponentTransfer><feFuncA type="linear" slope="0.25" /></feComponentTransfer>
          <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Vertical threads */}
      {[20, 40, 60, 80].map((x, i) => (
        <motion.line
          key={`v-${i}`}
          x1={x} y1="15" x2={x} y2="85"
          stroke={colors[i]}
          strokeWidth="5"
          strokeLinecap="round"
          filter="url(#stitch-shadow)"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 + i * 0.08, ease: "easeOut" }}
        />
      ))}

      {/* Horizontal stitches weaving through */}
      {[28, 50, 72].map((y, i) => (
        <motion.line
          key={`h-${i}`}
          x1="14" y1={y} x2="86" y2={y}
          stroke="#09090B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray="3 6"
          opacity="0.7"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease: "easeOut" }}
        />
      ))}
    </svg>
  );
}

/* Claude Code — Anthropic's signature 8-point asterisk, slowly rotating */
function ClaudeCodeIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <defs>
        <radialGradient id="cc-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#D97757" stopOpacity="0.35" />
          <stop offset="70%" stopColor="#D97757" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.circle
        cx="50" cy="50" r="44"
        fill="url(#cc-glow)"
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50px 50px" }}
      />

      <motion.g
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50px 50px" }}
      >
        {/* Anthropic-style 4-leaf signature (hand-tuned bezier petals) */}
        <path
          d="M50 8
             C 52 30, 70 48, 92 50
             C 70 52, 52 70, 50 92
             C 48 70, 30 52, 8 50
             C 30 48, 48 30, 50 8 Z"
          fill="#D97757"
        />
        <path
          d="M78.3 21.7
             C 67 33, 60 40, 50 50
             C 60 60, 67 67, 78.3 78.3
             C 67 67, 60 60, 50 50
             C 40 60, 33 67, 21.7 78.3
             C 33 67, 40 60, 50 50
             C 40 40, 33 33, 21.7 21.7
             C 33 33, 40 40, 50 50
             C 60 40, 67 33, 78.3 21.7 Z"
          fill="#D97757"
          opacity="0.7"
        />
      </motion.g>

      {/* Center dot */}
      <circle cx="50" cy="50" r="3" fill="#FAFAF7" />
    </svg>
  );
}

/* Antigravity — gradient orbs floating upward, continuous loop */
function AntigravityIcon() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none">
      <defs>
        <linearGradient id="ag-grad" x1="0" y1="100" x2="0" y2="0">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#4285F4" />
        </linearGradient>
        <linearGradient id="ag-line" x1="0" y1="0" x2="100" y2="0">
          <stop offset="0%" stopColor="rgba(15,23,42,0)" />
          <stop offset="50%" stopColor="rgba(15,23,42,0.25)" />
          <stop offset="100%" stopColor="rgba(15,23,42,0)" />
        </linearGradient>
      </defs>

      {/* Ground line */}
      <line x1="10" y1="86" x2="90" y2="86" stroke="url(#ag-line)" strokeWidth="1" strokeDasharray="2 3" />

      {/* Floating orbs going up, staggered */}
      {[
        { cx: 28, r: 5, dur: 2.8, delay: 0 },
        { cx: 50, r: 7, dur: 3.2, delay: 0.7 },
        { cx: 72, r: 5, dur: 2.6, delay: 1.4 },
      ].map((o, i) => (
        <g key={i}>
          <motion.circle
            cx={o.cx}
            r={o.r}
            fill="url(#ag-grad)"
            animate={{
              cy: [86, 14],
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.7],
            }}
            transition={{
              duration: o.dur,
              repeat: Infinity,
              delay: o.delay,
              times: [0, 0.2, 0.8, 1],
              ease: "easeOut",
            }}
          />
          {/* Orbital trail */}
          <motion.line
            x1={o.cx} x2={o.cx}
            stroke="url(#ag-grad)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
            animate={{
              y1: [86, 14],
              y2: [86, 30],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: o.dur,
              repeat: Infinity,
              delay: o.delay,
              ease: "easeOut",
            }}
          />
        </g>
      ))}
    </svg>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  TOOLS — the 5 things that turn ideas into shipped product */
/* ────────────────────────────────────────────────────────── */
type Tool = {
  stage: string;
  stageNum: string;
  name: string;
  tagline: string;
  desc: string;
  color: string;
  softColor: string;
  gradientFrom: string;
  gradientTo: string;
  Icon: () => JSX.Element;
};

const tools: Tool[] = [
  {
    stage: "Idea",
    stageNum: "01",
    name: "Creativity",
    tagline: "the conductor",
    desc: "The thing that decides which tool to use, and when. Without it, the rest is just software.",
    color: "#7C3AED",
    softColor: "rgba(124,58,237,0.08)",
    gradientFrom: "rgba(167,139,250,0.18)",
    gradientTo: "rgba(124,58,237,0.06)",
    Icon: CreativityIcon,
  },
  {
    stage: "Design",
    stageNum: "02",
    name: "Figma",
    tagline: "5+ years in production",
    desc: "Design systems, components, prototyping, handoff. The deep craft layer where ideas get tangible.",
    color: "#A259FF",
    softColor: "rgba(162,89,255,0.08)",
    gradientFrom: "rgba(255,114,98,0.15)",
    gradientTo: "rgba(26,188,254,0.10)",
    Icon: FigmaIcon,
  },
  {
    stage: "Design",
    stageNum: "03",
    name: "Stitch",
    tagline: "AI-native UI",
    desc: "Google's design AI — wireframe to high-fidelity mockup in minutes. Shortens the boring middle.",
    color: "#4285F4",
    softColor: "rgba(66,133,244,0.08)",
    gradientFrom: "rgba(66,133,244,0.15)",
    gradientTo: "rgba(234,67,53,0.08)",
    Icon: StitchIcon,
  },
  {
    stage: "Code",
    stageNum: "04",
    name: "Claude Code",
    tagline: "designed · built · shipped",
    desc: "This entire portfolio — designed, built, and shipped end-to-end with Claude Code. No middlemen.",
    color: "#D97757",
    softColor: "rgba(217,119,87,0.08)",
    gradientFrom: "rgba(217,119,87,0.20)",
    gradientTo: "rgba(217,119,87,0.04)",
    Icon: ClaudeCodeIcon,
  },
  {
    stage: "Ship",
    stageNum: "05",
    name: "Antigravity",
    tagline: "idea → live deploy",
    desc: "Google's vibe-coding agent IDE. Designs, builds, and ships full applications in hours, not sprints.",
    color: "#4285F4",
    softColor: "rgba(66,133,244,0.08)",
    gradientFrom: "rgba(124,58,237,0.18)",
    gradientTo: "rgba(66,133,244,0.10)",
    Icon: AntigravityIcon,
  },
];

/* ────────────────────────────────────────────────────────── */
/*  Page                                                      */
/* ────────────────────────────────────────────────────────── */
export function AboutPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: "#FAFAF7" }}
    >
      {/* ── Ambient background ── */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(at 15% 100%, rgba(15,118,110,0.06) 0%, transparent 50%), radial-gradient(at 90% 10%, rgba(124,58,237,0.05) 0%, transparent 45%)`,
        }}
      />

      {/* Paper grain */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.05,
          mixBlendMode: "multiply",
        }}
      />

      {/* ── Navigation (matches Hero) ── */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: scrolled ? "rgba(250,250,247,0.88)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(15,23,42,0.06)" : "1px solid transparent",
          transition: "background-color 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <ArrowLeft
              className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
              style={{ color: "#09090B" }}
              strokeWidth={2.5}
            />
            <span
              className="text-[14.5px] font-semibold transition-opacity group-hover:opacity-70"
              style={{ color: "#09090B", fontFamily: "DM Sans, sans-serif", letterSpacing: "-0.01em" }}
            >
              Jay Harwani
            </span>
            <span
              className="hidden sm:inline-block text-[10px] tracking-[0.15em] ml-2"
              style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
            >
              ©2026 / about
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:bg-black/[0.04]"
              style={{ color: "#52525B", fontFamily: "DM Sans, sans-serif" }}
            >
              Work
            </Link>
            <a
              href="https://www.linkedin.com/in/jay-harwani/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:bg-black/[0.04]"
              style={{ color: "#52525B", fontFamily: "DM Sans, sans-serif" }}
            >
              LinkedIn
            </a>
            <a
              href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] px-4 py-2 rounded-full transition-all hover:scale-[1.03]"
              style={{ backgroundColor: "#09090B", color: "#FFFFFF", fontFamily: "DM Sans, sans-serif" }}
            >
              CV
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>
          </nav>

          <div className="md:hidden">
            <button
              className="p-2 -mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" style={{ color: "#09090B" }} />
              ) : (
                <Menu className="w-5 h-5" style={{ color: "#09090B" }} />
              )}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[68px] z-50 md:hidden mx-5"
          >
            <nav
              className="flex flex-col gap-1 rounded-2xl p-4 shadow-2xl"
              style={{
                backgroundColor: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(15,23,42,0.08)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/[0.04]"
                style={{ color: "#09090B" }}
              >
                Work
              </Link>
              <a
                href="https://www.linkedin.com/in/jay-harwani/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/[0.04]"
                style={{ color: "#09090B" }}
              >
                LinkedIn
              </a>
              <a
                href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-2 mt-2 mb-1 text-center text-[13px] font-semibold rounded-full py-3"
                style={{ backgroundColor: "#09090B", color: "#FFFFFF" }}
              >
                Curriculum Vitae
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────── */}
      {/*  SECTION 1 — Hero (photo + buttons)             */}
      {/* ─────────────────────────────────────────────── */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Eyebrow row */}
          <div className="flex items-start justify-between mb-12 sm:mb-16">
            <motion.span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              initial={{ opacity: 0, y: 10 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Section //01 — About
            </motion.span>
            <motion.span
              className="hidden sm:inline-block text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "#A1A1AA", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              initial={{ opacity: 0, y: 10 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Edition N°. 04 — Spring / 2026
            </motion.span>
          </div>

          {/* Photo + Intro grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">

            {/* Photo */}
            <motion.div
              className="md:col-span-5 relative mx-auto md:mx-0 w-full max-w-[420px]"
              initial={{ opacity: 0, y: 30, scale: 0.96 }}
              animate={loaded ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <div
                className="relative overflow-hidden rounded-[28px]"
                style={{
                  boxShadow:
                    "0 40px 90px -20px rgba(15,23,42,0.25), 0 0 0 1px rgba(15,23,42,0.06)",
                  aspectRatio: "4/5",
                }}
              >
                <img
                  src={userPhoto}
                  alt="Jay Harwani"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: "center 22%" }}
                />
              </div>

              {/* Decorative tag — top right of photo */}
              <motion.div
                className="absolute -top-4 -right-4 hidden sm:block"
                initial={{ opacity: 0, rotate: -12, scale: 0.8 }}
                animate={loaded ? { opacity: 1, rotate: 6, scale: 1 } : {}}
                transition={{ duration: 0.7, delay: 0.9 }}
              >
                <div
                  className="px-4 py-2 rounded-full"
                  style={{
                    backgroundColor: "#09090B",
                    color: "#FFFFFF",
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                    fontSize: "10px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  Designer × Builder
                </div>
              </motion.div>
            </motion.div>

            {/* Right: name + buttons */}
            <div className="md:col-span-7 flex flex-col">
              <motion.h1
                className="leading-[0.95] tracking-[-0.04em] mb-6"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  color: "#09090B",
                  fontSize: "clamp(44px, 8vw, 96px)",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
              >
                Hi, I'm{" "}
                <span
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: "#0F766E",
                  }}
                >
                  Jay.
                </span>
              </motion.h1>

              <motion.p
                className="text-[16px] sm:text-[18px] max-w-[520px] mb-10"
                style={{
                  color: "#52525B",
                  fontFamily: "DM Sans, sans-serif",
                  lineHeight: 1.65,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.65 }}
              >
                Product designer with{" "}
                <span style={{ color: "#09090B", fontWeight: 600 }}>MS in HCI from UMBC</span>{" "}
                and{" "}
                <span style={{ color: "#09090B", fontWeight: 600 }}>5+ years</span>{" "}
                shipping interfaces across enterprise, healthcare, and AI. Currently designing AI &amp;
                robotics tools at the{" "}
                <span style={{ color: "#0F766E", fontFamily: "Playfair Display, serif", fontStyle: "italic" }}>
                  UMBC CARDS Lab
                </span>
                .
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.8 }}
              >
                <a
                  href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: "#09090B",
                    color: "#FFFFFF",
                    fontFamily: "DM Sans, sans-serif",
                    boxShadow: "0 12px 24px -10px rgba(9,9,11,0.4)",
                  }}
                >
                  <FileText className="w-4 h-4" strokeWidth={2.5} />
                  <span>Resume</span>
                  <ArrowUpRight
                    className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    strokeWidth={2.5}
                  />
                </a>

                <a
                  href="https://www.linkedin.com/in/jay-harwani/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full transition-all hover:bg-black/[0.04]"
                  style={{
                    fontFamily: "DM Sans, sans-serif",
                    color: "#09090B",
                    border: "1px solid rgba(15,23,42,0.18)",
                    backgroundColor: "rgba(255,255,255,0.6)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Linkedin className="w-4 h-4" strokeWidth={2.5} />
                  <span>LinkedIn</span>
                  <ArrowUpRight
                    className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                    strokeWidth={2.5}
                  />
                </a>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────── */}
      {/*  SECTION 2 — Process diagram                    */}
      {/*  "From Idea to Design to Code to Ship"          */}
      {/* ─────────────────────────────────────────────── */}
      <ProcessSection />

    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  ProcessSection — 5 tools, animated horizontal flow chart  */
/* ────────────────────────────────────────────────────────── */
function ProcessSection() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">

      {/* Soft section background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, transparent 0%, rgba(244,243,238,0.7) 30%, rgba(244,243,238,0.7) 70%, transparent 100%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Header */}
        <div className="grid grid-cols-12 gap-6 mb-16 sm:mb-20">
          <motion.div
            className="col-span-12 md:col-span-3 flex flex-col gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
            >
              Section //02
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "#A1A1AA", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
            >
              How I build
            </span>
          </motion.div>

          <motion.div
            className="col-span-12 md:col-span-9"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2
              className="leading-[1.0] tracking-[-0.035em]"
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                color: "#09090B",
                fontSize: "clamp(36px, 6.5vw, 76px)",
              }}
            >
              From{" "}
              <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 500, color: "#0F766E" }}>
                idea
              </span>{" "}
              to{" "}
              <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 500, color: "#7C3AED" }}>
                ship
              </span>
              .
            </h2>
          </motion.div>
        </div>

        {/* Stage pipeline — Idea → Design → Code → Ship */}
        <StagePipeline />

        {/* The 5 tool cards */}
        <div className="relative mt-12 sm:mt-16">
          {/* Horizontal connector line — desktop only, behind cards */}
          <div className="absolute hidden lg:block top-[50%] left-0 right-0 h-px pointer-events-none" style={{ zIndex: 0 }}>
            <motion.div
              className="h-full origin-left"
              style={{
                background:
                  "linear-gradient(90deg, #7C3AED 0%, #0F766E 25%, #0EA5E9 50%, #D97757 75%, #4285F4 100%)",
                opacity: 0.25,
              }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 relative" style={{ zIndex: 1 }}>
            {tools.map((tool, i) => (
              <ToolCard key={tool.name} tool={tool} index={i} isLast={i === tools.length - 1} />
            ))}
          </div>
        </div>

        {/* Closing note */}
        <motion.div
          className="mt-20 sm:mt-28 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: "rgba(15,118,110,0.08)",
              border: "1px solid rgba(15,118,110,0.18)",
            }}
          >
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
              className="text-[12px] font-medium"
              style={{ color: "#134E4A", fontFamily: "DM Sans, sans-serif" }}
            >
              I don't just design. I ship.
            </span>
          </div>

          <p
            className="text-[15px] sm:text-[17px] max-w-xl"
            style={{ color: "#52525B", fontFamily: "DM Sans, sans-serif", lineHeight: 1.65 }}
          >
            Want to see what we could build together?{" "}
            <a
              href="mailto:harwanijay9498@gmail.com"
              className="font-semibold underline decoration-from-font underline-offset-4"
              style={{ color: "#09090B" }}
            >
              Let's talk →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  StagePipeline — top horizontal stages: Idea→Design→Code→Ship */
/* ────────────────────────────────────────────────────────── */
function StagePipeline() {
  const stages = ["Idea", "Design", "Code", "Ship"];
  return (
    <motion.div
      className="relative py-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8 }}
    >
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-3xl mx-auto">
        {stages.map((stage, i) => (
          <motion.div
            key={stage}
            className="flex flex-col items-center gap-3 relative"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
          >
            <div className="relative flex items-center justify-center w-full">
              {/* Connecting line to next */}
              {i < stages.length - 1 && (
                <motion.div
                  className="absolute top-1/2 left-1/2 h-px origin-left"
                  style={{
                    width: "100%",
                    backgroundColor: "rgba(15,23,42,0.15)",
                    transform: "translate(8px, -50%)",
                  }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.12 }}
                />
              )}
              <div
                className="w-3 h-3 rounded-full relative z-10"
                style={{
                  backgroundColor: "#FAFAF7",
                  border: "2px solid #09090B",
                }}
              />
            </div>
            <span
              className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-semibold"
              style={{ color: "#09090B", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
            >
              {stage}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  ToolCard — 3D-tilt, animated halo, branded SVG icon        */
/* ────────────────────────────────────────────────────────── */
function ToolCard({
  tool,
  index,
  isLast,
}: {
  tool: Tool;
  index: number;
  isLast: boolean;
}) {
  const { Icon } = tool;
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({ rx: (py - 0.5) * -8, ry: (px - 0.5) * 8 });
    setGlow({ x: px * 100, y: py * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
    setHovered(false);
  };

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
    >
      {/* Connector arrow between cards (desktop) */}
      {!isLast && (
        <motion.div
          className="hidden lg:flex absolute top-1/2 -right-3 z-20 items-center justify-center w-7 h-7 rounded-full"
          style={{
            backgroundColor: "#FAFAF7",
            border: "1px solid rgba(15,23,42,0.12)",
            transform: "translateY(-50%)",
            boxShadow: "0 2px 8px rgba(15,23,42,0.06)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.12 }}
        >
          <ArrowUpRight
            className="w-3.5 h-3.5"
            style={{ color: "#52525B", transform: "rotate(45deg)" }}
            strokeWidth={2.5}
          />
        </motion.div>
      )}

      {/* Animated outer glow — appears on hover */}
      <div
        className="absolute -inset-0.5 rounded-[20px] pointer-events-none transition-opacity duration-500"
        style={{
          opacity: hovered ? 1 : 0,
          background: `linear-gradient(135deg, ${tool.color}55, transparent 60%)`,
          filter: "blur(14px)",
          zIndex: -1,
        }}
      />

      {/* CARD */}
      <div
        ref={cardRef}
        onMouseEnter={() => setHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative h-full overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: hovered
            ? `0 30px 60px -20px ${tool.color}40, 0 6px 18px -6px rgba(15,23,42,0.08)`
            : "0 1px 3px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.06)",
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transformStyle: "preserve-3d",
          transition: "box-shadow 0.4s ease, transform 0.25s ease-out",
        }}
      >
        {/* Mouse-tracked spotlight glow inside card */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(420px circle at ${glow.x}% ${glow.y}%, ${tool.color}14, transparent 50%)`,
          }}
        />

        {/* ICON HERO PANEL — large gradient slab */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            aspectRatio: "1.4 / 1",
            background: `linear-gradient(135deg, ${tool.gradientFrom} 0%, ${tool.gradientTo} 100%)`,
            borderBottom: "1px solid rgba(15,23,42,0.06)",
          }}
        >
          {/* Subtle grid overlay in the icon panel */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(15,23,42,1) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,1) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />

          {/* Number badge (top-left of icon panel) */}
          <div
            className="absolute top-3 left-3 px-2 py-1 rounded-md backdrop-blur-md"
            style={{
              backgroundColor: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(15,23,42,0.06)",
            }}
          >
            <span
              className="text-[9px] uppercase tracking-[0.18em] font-semibold"
              style={{ color: "#52525B", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
            >
              {tool.stageNum} / {tool.stage}
            </span>
          </div>

          {/* The animated branded icon */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center p-7"
            style={{ transform: "translateZ(40px)" }}
            animate={hovered ? { scale: 1.06 } : { scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
          >
            <div className="w-full h-full max-w-[88px] max-h-[88px]">
              <Icon />
            </div>
          </motion.div>
        </div>

        {/* TEXT BLOCK */}
        <div className="relative p-5 sm:p-6" style={{ transform: "translateZ(20px)" }}>
          {/* Tool name */}
          <h3
            className="text-[20px] sm:text-[22px] mb-1.5 leading-tight"
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 700,
              color: "#09090B",
              letterSpacing: "-0.02em",
            }}
          >
            {tool.name}
          </h3>

          {/* Italic tagline */}
          <p
            className="text-[12.5px] mb-3.5"
            style={{
              color: tool.color,
              fontFamily: "Playfair Display, serif",
              fontStyle: "italic",
              fontWeight: 500,
            }}
          >
            — {tool.tagline}
          </p>

          {/* Description */}
          <p
            className="text-[13.5px]"
            style={{
              color: "#52525B",
              fontFamily: "DM Sans, sans-serif",
              lineHeight: 1.55,
            }}
          >
            {tool.desc}
          </p>

          {/* Bottom accent bar — animates on hover */}
          <div
            className="mt-5 h-px overflow-hidden rounded-full"
            style={{ backgroundColor: "rgba(15,23,42,0.06)" }}
          >
            <motion.div
              className="h-full origin-left"
              style={{ backgroundColor: tool.color }}
              animate={hovered ? { scaleX: 1 } : { scaleX: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
