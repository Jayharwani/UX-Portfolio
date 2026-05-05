import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Linkedin,
  FileText,
  Sparkles,
  Layers,
  Palette,
  Code,
  Rocket,
  Menu,
  X,
} from "lucide-react";
import { Link } from "react-router";
import userPhoto from "../assets/hero-portrait.jpeg";

/* ────────────────────────────────────────────────────────── */
/*  TOOLS — the 5 things that turn ideas into shipped product */
/* ────────────────────────────────────────────────────────── */
const tools = [
  {
    stage: "Idea",
    stageNum: "01",
    name: "Creativity",
    tagline: "the conductor",
    desc: "The thing that decides which tool to use, and when. Without it, the rest is just software.",
    color: "#7C3AED",
    softColor: "rgba(124,58,237,0.08)",
    Icon: Sparkles,
  },
  {
    stage: "Design",
    stageNum: "02",
    name: "Figma",
    tagline: "5+ years in production",
    desc: "Design systems, components, prototyping, handoff. The deep craft layer where ideas get tangible.",
    color: "#0F766E",
    softColor: "rgba(15,118,110,0.08)",
    Icon: Layers,
  },
  {
    stage: "Design",
    stageNum: "03",
    name: "Stitch",
    tagline: "AI-native UI",
    desc: "Google's design AI — wireframe to high-fidelity mockup in minutes. Shortens the boring middle.",
    color: "#0EA5E9",
    softColor: "rgba(14,165,233,0.08)",
    Icon: Palette,
  },
  {
    stage: "Code",
    stageNum: "04",
    name: "Claude Code",
    tagline: "designed · built · shipped",
    desc: "This entire portfolio — designed, built, and shipped end-to-end with Claude Code. No middlemen.",
    color: "#D97757",
    softColor: "rgba(217,119,87,0.08)",
    Icon: Code,
  },
  {
    stage: "Ship",
    stageNum: "05",
    name: "Antigravity",
    tagline: "idea → live deploy",
    desc: "Google's vibe-coding agent IDE. Designs, builds, and ships full applications in hours, not sprints.",
    color: "#4285F4",
    softColor: "rgba(66,133,244,0.08)",
    Icon: Rocket,
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
                {/* Floating credit chip on photo */}
                <div
                  className="absolute bottom-4 left-4 right-4 px-4 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.92)",
                    border: "1px solid rgba(255,255,255,0.6)",
                  }}
                >
                  <span className="relative flex h-2 w-2 flex-shrink-0">
                    <span
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: "#0F766E" }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ backgroundColor: "#0F766E" }}
                    />
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[12px] font-semibold leading-tight"
                      style={{ color: "#09090B", fontFamily: "DM Sans, sans-serif" }}
                    >
                      Jay Harwani — Baltimore, MD
                    </p>
                    <p
                      className="text-[11px] mt-0.5 leading-tight"
                      style={{
                        color: "#0F766E",
                        fontFamily: "Playfair Display, serif",
                        fontStyle: "italic",
                      }}
                    >
                      Open to full-time roles · No sponsorship
                    </p>
                  </div>
                </div>
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
              </span>{" "}
              — solo.
            </h2>
            <p
              className="text-[15px] md:text-[17px] mt-6 max-w-2xl"
              style={{ color: "#52525B", fontFamily: "DM Sans, sans-serif", lineHeight: 1.65 }}
            >
              Five tools, one designer-engineer. I'm not just someone who hands off mockups — I design,
              build, and deploy. Here's the stack that gets things from a half-formed idea into a live
              product.
            </p>
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
/*  ToolCard                                                   */
/* ────────────────────────────────────────────────────────── */
function ToolCard({
  tool,
  index,
  isLast,
}: {
  tool: typeof tools[number];
  index: number;
  isLast: boolean;
}) {
  const { Icon } = tool;

  return (
    <motion.div
      className="relative group"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Arrow connector — visible only on desktop, between cards */}
      {!isLast && (
        <motion.div
          className="hidden lg:flex absolute top-1/2 -right-3 z-20 items-center justify-center w-6 h-6 rounded-full"
          style={{
            backgroundColor: "#FAFAF7",
            border: "1px solid rgba(15,23,42,0.12)",
            transform: "translateY(-50%)",
          }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 + index * 0.12 }}
        >
          <ArrowUpRight
            className="w-3 h-3"
            style={{ color: "#52525B", transform: "rotate(45deg)" }}
            strokeWidth={2.5}
          />
        </motion.div>
      )}

      <div
        className="relative h-full p-6 rounded-2xl transition-all duration-500 group-hover:-translate-y-1"
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid rgba(15,23,42,0.08)",
          boxShadow: "0 1px 3px rgba(15,23,42,0.04), 0 8px 24px -8px rgba(15,23,42,0.06)",
        }}
      >
        {/* Top: stage tag + number */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="px-2.5 py-1 rounded-full"
            style={{
              backgroundColor: tool.softColor,
              border: `1px solid ${tool.color}25`,
            }}
          >
            <span
              className="text-[9px] uppercase tracking-[0.18em] font-semibold"
              style={{ color: tool.color, fontFamily: "DM Sans, sans-serif" }}
            >
              {tool.stage}
            </span>
          </div>
          <span
            className="text-[10px] uppercase tracking-[0.15em]"
            style={{
              color: "#A1A1AA",
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            }}
          >
            {tool.stageNum}
          </span>
        </div>

        {/* Icon */}
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
          style={{
            backgroundColor: tool.softColor,
            color: tool.color,
          }}
          whileHover={{ rotate: -6, scale: 1.08 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
        >
          <Icon className="w-5 h-5" strokeWidth={2} />
        </motion.div>

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

        {/* Tagline */}
        <p
          className="text-[12px] mb-3"
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

        {/* Glow on hover — accent color wash */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `0 20px 60px -16px ${tool.color}40`,
          }}
        />
      </div>
    </motion.div>
  );
}
