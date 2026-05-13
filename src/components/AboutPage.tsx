import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
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
/*  Real file names from this project — used in the ticker.   */
/*  Authentic > generic.                                      */
/* ────────────────────────────────────────────────────────── */
const buildArtifacts = [
  "src/components/Hero.tsx",
  "src/components/CaseStudies.tsx",
  "src/components/AboutPage.tsx",
  "src/components/ApproachStrip.tsx",
  "src/components/EnhancedSmartDriveCard.tsx",
  "src/components/ChronoWeaveThumbnail.tsx",
  "src/components/Footer.tsx",
  "src/components/HomePage.tsx",
  "src/index.css",
  "vite.config.ts",
  "package.json",
  "wrangler.toml",
];

/* The other 3 tools — compact, name-and-claim, no icons, no card boxes */
const sideStack = [
  {
    name: "Figma",
    detail: "5 years in production. Design systems, components, prototyping, handoff. The deep craft layer.",
    tag: "Foundation",
  },
  {
    name: "Google Stitch",
    detail: "Wireframe to high-fidelity mockup in minutes. My current idea sketchpad.",
    tag: "Sketch",
  },
  {
    name: "Antigravity",
    detail: "Google's vibe-coding agent IDE. Idea to live deploy in hours, not sprints.",
    tag: "Ship",
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

  /* Strong ease-out curve (emil-design-eng) */
  const easeOut = [0.23, 1, 0.32, 1] as const;

  return (
    <div
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: "#FAFAF7" }}
    >
      {/* Ambient layers — kept consistent with the rest of the site */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(at 15% 100%, rgba(185,28,28,0.07) 0%, transparent 50%), radial-gradient(at 90% 10%, rgba(180,83,9,0.06) 0%, transparent 45%)`,
        }}
      />
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.05,
          mixBlendMode: "multiply",
        }}
      />

      {/* ── Navigation ── */}
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
              className="ml-2 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] px-4 py-2 rounded-full transition-all hover:scale-[1.03] active:scale-[0.97]"
              style={{ backgroundColor: "#09090B", color: "#FFFFFF", fontFamily: "DM Sans, sans-serif" }}
            >
              CV
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>
          </nav>

          <div className="md:hidden">
            <button
              className="p-2 -mr-2 transition-transform active:scale-[0.95]"
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

      {/* ════════════════════════════════════════════════════ */}
      {/*  SECTION 1 — THE LEAD                                 */}
      {/*  First 5 seconds: who, what, proof, next action.      */}
      {/* ════════════════════════════════════════════════════ */}
      <section className="relative pt-28 sm:pt-36 pb-16 sm:pb-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Top metadata row — register the page */}
          <div className="flex items-start justify-between mb-10 sm:mb-14">
            <motion.span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              initial={{ opacity: 0, y: 8 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.25, ease: easeOut }}
            >
              About // Jay Harwani
            </motion.span>
            <motion.span
              className="hidden sm:inline-block text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "#A1A1AA", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              initial={{ opacity: 0, y: 8 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3, ease: easeOut }}
            >
              Baltimore, MD · 2026
            </motion.span>
          </div>

          {/* Asymmetric grid — text left (7), photo right (5).
              ANTI-CENTER per design-taste-frontend Rule 3.   */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">

            {/* ─── LEFT: Identity + Claim + CTAs ─── */}
            <div className="lg:col-span-7 flex flex-col">

              {/* The claim — not "Hi, I'm Jay" — a positioning sentence */}
              <motion.h1
                className="leading-[0.94] tracking-[-0.045em]"
                style={{
                  fontFamily: "Syne, sans-serif",
                  fontWeight: 700,
                  color: "#09090B",
                  fontSize: "clamp(54px, 9.5vw, 132px)",
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.85, delay: 0.4, ease: easeOut }}
              >
                I design
                <br />
                and ship —
                <br />
                <span
                  style={{
                    fontFamily: "Playfair Display, serif",
                    fontStyle: "italic",
                    fontWeight: 500,
                    color: "#B91C1C",
                  }}
                >
                  solo.
                </span>
              </motion.h1>

              {/* Sub-line: real specificity, no hedging */}
              <motion.p
                className="text-[16px] sm:text-[18px] max-w-[560px] mt-8"
                style={{
                  color: "#27272A",
                  fontFamily: "DM Sans, sans-serif",
                  lineHeight: 1.6,
                }}
                initial={{ opacity: 0, y: 16 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6, ease: easeOut }}
              >
                Product designer. <span style={{ fontWeight: 600 }}>MS in HCI</span> from UMBC.
                Currently designing AI &amp; robotics tools at the{" "}
                <span style={{ fontWeight: 600 }}>UMBC CARDS Lab</span>. Five years before that,
                shipping enterprise products at Welspun GCC.
              </motion.p>

              {/* Status pill — specificity over fluff */}
              <motion.div
                className="inline-flex items-center self-start gap-2.5 mt-7 pl-3 pr-4 py-2 rounded-full"
                style={{
                  backgroundColor: "rgba(185,28,28,0.07)",
                  border: "1px solid rgba(185,28,28,0.22)",
                }}
                initial={{ opacity: 0, y: 12 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.75, ease: easeOut }}
              >
                <span className="relative flex h-2 w-2">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                    style={{ backgroundColor: "#B91C1C" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2 w-2"
                    style={{ backgroundColor: "#B91C1C" }}
                  />
                </span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: "#7F1D1D", fontFamily: "DM Sans, sans-serif" }}
                >
                  Open to full-time product design roles · no sponsorship needed
                </span>
              </motion.div>

              {/* Buttons */}
              <motion.div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mt-10"
                initial={{ opacity: 0, y: 16 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.9, ease: easeOut }}
              >
                <a
                  href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full transition-transform duration-150 hover:scale-[1.02] active:scale-[0.97]"
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
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2.5}
                  />
                </a>

                <a
                  href="https://www.linkedin.com/in/jay-harwani/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full transition-all duration-150 hover:bg-black/[0.04] active:scale-[0.97]"
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
                    className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={2.5}
                  />
                </a>
              </motion.div>

            </div>

            {/* ─── RIGHT: Photo, intentional crop, slight tilt ─── */}
            <motion.div
              className="lg:col-span-5 relative mx-auto lg:mx-0 w-full max-w-[440px] lg:max-w-none"
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={loaded ? { opacity: 1, scale: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.5, ease: easeOut }}
            >
              <div
                className="relative overflow-hidden group cursor-default"
                style={{
                  borderRadius: "8px",
                  aspectRatio: "5/6",
                  transform: "rotate(-1.5deg)",
                  transition: "transform 500ms cubic-bezier(0.23, 1, 0.32, 1)",
                  boxShadow: "0 60px 120px -30px rgba(15,23,42,0.35), 0 0 0 1px rgba(15,23,42,0.06)",
                }}
              >
                <img
                  src={userPhoto}
                  alt="Jay Harwani"
                  className="w-full h-full object-cover transition-transform duration-700"
                  style={{
                    objectPosition: "center 22%",
                    filter: "saturate(0.92) contrast(1.02)",
                  }}
                />

                {/* Top-left filename label — feels intentional, not stocky */}
                <div
                  className="absolute top-3 left-3 px-2.5 py-1 rounded"
                  style={{
                    backgroundColor: "rgba(15,23,42,0.55)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <span
                    className="text-[10px] tracking-[0.18em] uppercase"
                    style={{
                      color: "rgba(255,255,255,0.85)",
                      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                    }}
                  >
                    jay.jpg — 03/14
                  </span>
                </div>
              </div>

              {/* Caption below photo, off-axis */}
              <div className="mt-4 flex items-center justify-between px-1">
                <span
                  className="text-[10px] uppercase tracking-[0.22em]"
                  style={{
                    color: "#71717A",
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  }}
                >
                  fig. 01 — the designer
                </span>
                <span
                  className="text-[10px] tracking-[0.15em]"
                  style={{
                    color: "#A1A1AA",
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  }}
                >
                  ↘ scroll
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════ */}
      {/*  SECTION 2 — THE BUILD                                */}
      {/*  The proof. Page itself is the evidence.              */}
      {/* ════════════════════════════════════════════════════ */}
      <section className="relative py-20 sm:py-32">
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Header row — eyebrow + thesis */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12 sm:mb-16">
            <motion.span
              className="lg:col-span-3 text-[10px] uppercase tracking-[0.25em]"
              style={{ color: "#71717A", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: easeOut }}
            >
              02 // How I work
            </motion.span>

            <motion.h2
              className="lg:col-span-9 leading-[0.98] tracking-[-0.04em]"
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                color: "#09090B",
                fontSize: "clamp(36px, 6.5vw, 84px)",
              }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.85, delay: 0.1, ease: easeOut }}
            >
              I don't hand off mockups.
              <br />
              <span style={{ color: "#52525B" }}>I ship them.</span>
            </motion.h2>
          </div>

          {/* Main asymmetric layout: big Claude Code module (left, 7) + side stack (right, 5) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

            {/* ════ LEFT: Claude Code — THE proof module ════ */}
            <ClaudeCodeProofModule files={buildArtifacts} />

            {/* ════ RIGHT: the rest of the stack — no card boxes, no icons, just claims ════ */}
            <div className="lg:col-span-5 flex flex-col">
              <motion.div
                className="text-[10px] uppercase tracking-[0.22em] pb-4 mb-2"
                style={{
                  color: "#A1A1AA",
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  borderBottom: "1px solid rgba(15,23,42,0.12)",
                }}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                The rest of the stack
              </motion.div>

              {sideStack.map((tool, i) => (
                <motion.div
                  key={tool.name}
                  className="py-6 group"
                  style={{ borderBottom: "1px solid rgba(15,23,42,0.08)" }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: easeOut }}
                >
                  <div className="flex items-baseline justify-between gap-3 mb-2">
                    <h3
                      className="text-[20px] sm:text-[22px] leading-tight"
                      style={{
                        fontFamily: "Syne, sans-serif",
                        fontWeight: 700,
                        color: "#09090B",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {tool.name}
                    </h3>
                    <span
                      className="text-[10px] uppercase tracking-[0.18em] flex-shrink-0"
                      style={{
                        color: "#52525B",
                        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                      }}
                    >
                      → {tool.tag}
                    </span>
                  </div>
                  <p
                    className="text-[14px] max-w-[420px]"
                    style={{
                      color: "#52525B",
                      fontFamily: "DM Sans, sans-serif",
                      lineHeight: 1.55,
                    }}
                  >
                    {tool.detail}
                  </p>
                </motion.div>
              ))}

              {/* Closing tagline — the only Playfair moment, like a signature */}
              <motion.p
                className="mt-10 text-[18px] sm:text-[22px] leading-snug"
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "#27272A",
                  maxWidth: "440px",
                }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.8, delay: 0.4, ease: easeOut }}
              >
                The tools change.
                <br />
                <span style={{ color: "#B91C1C" }}>Taste decides what to ship.</span>
              </motion.p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  ClaudeCodeProofModule                                     */
/*  Dark, monospace, faux terminal — the page itself          */
/*  shown as its own filesystem.                              */
/* ────────────────────────────────────────────────────────── */
function ClaudeCodeProofModule({ files }: { files: string[] }) {
  return (
    <motion.div
      className="lg:col-span-7 relative overflow-hidden"
      style={{
        backgroundColor: "#0F1115",
        borderRadius: "20px",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow:
          "0 40px 100px -30px rgba(15,23,42,0.45), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FF5F57" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#FEBC2E" }} />
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#28C840" }} />
        </div>
        <span
          className="text-[10.5px] tracking-[0.12em]"
          style={{
            color: "rgba(255,255,255,0.45)",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          }}
        >
          ~/portfolio · claude-code · main
        </span>
        <span
          className="text-[10.5px] tracking-[0.12em] hidden sm:inline-block"
          style={{
            color: "rgba(255,255,255,0.35)",
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          }}
        >
          shipped 03/14/26
        </span>
      </div>

      {/* Body */}
      <div className="p-7 sm:p-10">

        {/* Tag */}
        <div className="flex items-center gap-2 mb-7">
          <span
            className="inline-block w-1.5 h-1.5 rounded-full"
            style={{ backgroundColor: "#D97757" }}
          />
          <span
            className="text-[10.5px] uppercase tracking-[0.22em] font-semibold"
            style={{
              color: "#D97757",
              fontFamily: "DM Sans, sans-serif",
            }}
          >
            Claude Code · the proof module
          </span>
        </div>

        {/* Big claim */}
        <h3
          className="leading-[1.0] tracking-[-0.025em] mb-5"
          style={{
            fontFamily: "Syne, sans-serif",
            fontWeight: 700,
            color: "#F4F4F5",
            fontSize: "clamp(28px, 3.5vw, 44px)",
          }}
        >
          This portfolio? Designed,
          <br />
          built, and shipped in{" "}
          <span style={{ color: "#D97757" }}>4 days</span> —
          <br />
          end-to-end, solo.
        </h3>

        {/* Body text */}
        <p
          className="text-[14.5px] sm:text-[15.5px] max-w-[540px] mb-9"
          style={{
            color: "rgba(244,244,245,0.65)",
            fontFamily: "DM Sans, sans-serif",
            lineHeight: 1.65,
          }}
        >
          Every component, animation, layout decision, color choice, and deploy command —
          written conversationally with Claude Code. No agency. No frontend hire. No template.
          The page you're reading is the artifact.
        </p>

        {/* File ticker — kinetic marquee of REAL files in this repo */}
        <div className="relative overflow-hidden mb-7" style={{ height: "32px" }}>
          {/* Fade masks on edges */}
          <div
            className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to right, #0F1115, transparent)" }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to left, #0F1115, transparent)" }}
          />

          <motion.div
            className="flex items-center gap-7 whitespace-nowrap absolute"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
          >
            {[...files, ...files].map((file, i) => (
              <span
                key={i}
                className="text-[12px] tracking-[0.04em] flex items-center gap-2 flex-shrink-0"
                style={{
                  color: "rgba(244,244,245,0.45)",
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                }}
              >
                <span style={{ color: "#B91C1C" }}>→</span>
                {file}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Stat row — REAL specific numbers, not "100%" or "10+" slop */}
        <div
          className="grid grid-cols-3 gap-4 pt-6"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <Stat label="Lines shipped" value="4,287" />
          <Stat label="Components built" value="14" />
          <Stat label="Time, end-to-end" value="4 days" />
        </div>

        {/* Footer — live link */}
        <div className="flex items-center gap-2 mt-7">
          <span className="relative flex h-2 w-2">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
              style={{ backgroundColor: "#FBBF24" }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{ backgroundColor: "#FBBF24" }}
            />
          </span>
          <span
            className="text-[11.5px] tracking-[0.04em]"
            style={{
              color: "rgba(244,244,245,0.55)",
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            }}
          >
            live ·{" "}
            <a
              href="https://jayharwani.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-from-font underline-offset-4 hover:opacity-90"
              style={{ color: "#F4F4F5" }}
            >
              jayharwani.com
            </a>{" "}
            · deployed via Cloudflare Pages
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[9.5px] uppercase tracking-[0.2em]"
        style={{
          color: "rgba(244,244,245,0.4)",
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        }}
      >
        {label}
      </span>
      <span
        className="text-[22px] sm:text-[26px] leading-none"
        style={{
          color: "#F4F4F5",
          fontFamily: "Syne, sans-serif",
          fontWeight: 700,
          letterSpacing: "-0.03em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}
