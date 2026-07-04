import { motion, useInView, useReducedMotion } from "motion/react";
import { useState, useEffect, useRef, lazy, Suspense, type ReactNode } from "react";
import { Link } from "react-router";
import {
  PenNib,
  Flask,
  Code,
  ArrowRight,
  ArrowUpRight,
  EnvelopeSimple,
  LinkedinLogo,
  FileText,
} from "@phosphor-icons/react";
import userPhoto from "../assets/hero-portrait.jpeg";

const Hero3D = lazy(() => import("./home/Hero3D"));
const FlyerGame = lazy(() => import("./home/FlyerGame"));

/* ──────────────────────────────────────────────────────────────────────────
   Homepage. Cool slate, techy, calm, rich. Motion is the personality.
   Tokens live in index.css as CSS variables.
   ────────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const V = {
  bg: "var(--bg)",
  bg2: "var(--bg-2)",
  surface: "var(--surface)",
  surface2: "var(--surface-2)",
  border: "var(--border)",
  borderStrong: "var(--border-strong)",
  text: "var(--text)",
  text2: "var(--text-2)",
  text3: "var(--text-3)",
  accent: "var(--accent)",
  accentSoft: "var(--accent-soft)",
  display: "var(--font-display)",
  body: "var(--font-body)",
  mono: "var(--font-mono)",
  serifIt: "var(--font-serif-it)",
};

const LINKS = {
  email: "harwanijay9498@gmail.com",
  linkedin: "https://www.linkedin.com/in/jay-harwani/",
  cv: "https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing",
};

/* ── shared bits ─────────────────────────────────────────────────────────── */

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: V.mono,
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: V.text3,
      }}
    >
      {children}
    </span>
  );
}

function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.65, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* magnetic primary button */
function MagneticButton({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={(e) => {
        if (reduce || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        setPos({ x: (e.clientX - r.left - r.width / 2) * 0.12, y: (e.clientY - r.top - r.height / 2) * 0.18 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 120, damping: 18 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-2.5"
      style={{
        padding: "14px 26px",
        borderRadius: 8,
        background: V.accent,
        color: "#0A0E16",
        fontFamily: V.body,
        fontSize: 15,
        fontWeight: 600,
        border: "none",
        cursor: "pointer",
        boxShadow: "0 8px 30px -8px rgba(91,140,255,0.45)",
      }}
    >
      {children}
    </motion.button>
  );
}

const scrollToId = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* ── nav ─────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLink: React.CSSProperties = {
    fontFamily: V.body,
    fontSize: 14,
    fontWeight: 500,
    color: V.text2,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "8px 12px",
  };

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      style={{
        background: scrolled ? "rgba(10,14,22,0.82)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
        transition: "background 0.3s, border-color 0.3s",
      }}
    >
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span style={{ fontFamily: V.display, fontSize: 16, fontWeight: 600, color: V.text }}>Jay Harwani</span>
          <span className="hidden sm:inline" style={{ fontFamily: V.mono, fontSize: 11, color: V.text3, letterSpacing: "0.08em" }}>
            2026 / v4.0
          </span>
        </div>
        <nav className="flex items-center gap-1">
          <button className="hidden md:block" style={navLink} onClick={() => scrollToId("work")}>
            Work
          </button>
          <button className="hidden md:block" style={navLink} onClick={() => scrollToId("about")}>
            About
          </button>
          <button className="hidden md:block" style={navLink} onClick={() => scrollToId("contact")}>
            Contact
          </button>
          <a
            href={LINKS.cv}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 ml-2"
            style={{
              fontFamily: V.body,
              fontSize: 13.5,
              fontWeight: 600,
              color: V.text,
              padding: "8px 16px",
              borderRadius: 8,
              border: `1px solid ${V.borderStrong}`,
              background: V.accentSoft,
            }}
          >
            CV <ArrowUpRight size={14} weight="bold" />
          </a>
        </nav>
      </div>
    </motion.header>
  );
}

/* ── hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  const reduce = useReducedMotion();
  const [show3D, setShow3D] = useState(false);

  useEffect(() => {
    // load the 3D chunk after first paint, desktop only
    if (window.matchMedia("(min-width: 768px)").matches) {
      const t = setTimeout(() => setShow3D(true), 250);
      return () => clearTimeout(t);
    }
  }, []);

  const lines: ReactNode[] = [
    "Designing AI",
    "for the people",
    <>
      it{" "}
      <em style={{ fontFamily: V.serifIt, fontStyle: "italic", fontWeight: 400, color: V.text }}>forgets.</em>
    </>,
  ];

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden" style={{ background: V.bg }}>
      {/* soft accent glows */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "-12%",
          right: "-6%",
          width: 720,
          height: 720,
          background: "radial-gradient(circle, rgba(91,140,255,0.09) 0%, transparent 62%)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "-18%",
          left: "-10%",
          width: 640,
          height: 640,
          background: "radial-gradient(circle, rgba(91,140,255,0.06) 0%, transparent 60%)",
        }}
      />

      {/* 3D signature, right side */}
      <div className="absolute inset-y-0 right-0 hidden md:block" style={{ width: "52%" }} aria-hidden="true">
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: show3D ? 1 : 0 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.3 }}
        >
          {show3D && (
            <Suspense fallback={null}>
              <Hero3D frozen={!!reduce} />
            </Suspense>
          )}
        </motion.div>
      </div>

      {/* mobile: static orb, no 3D payload */}
      <div
        className="absolute md:hidden pointer-events-none"
        aria-hidden="true"
        style={{
          top: "8%",
          right: "-22%",
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle at 34% 30%, #2E3950 0%, #161D2E 46%, #0D1220 78%)",
          boxShadow: "inset -18px -14px 50px rgba(0,0,0,0.5), -14px 10px 60px rgba(91,140,255,0.12)",
          opacity: 0.85,
        }}
      />

      <div className="relative z-10 w-full mx-auto max-w-6xl px-6 pt-28 pb-16">
        <div className="max-w-[640px]">
          {/* H1 with per-line clip reveal */}
          <h1
            style={{
              fontFamily: V.display,
              fontWeight: 600,
              fontSize: "clamp(3rem, 8.4vw, 6.6rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              color: V.text,
              margin: 0,
            }}
          >
            {lines.map((line, i) => (
              <span key={i} className="block overflow-hidden">
                <motion.span
                  className="block"
                  initial={reduce ? { opacity: 0 } : { y: "108%" }}
                  animate={reduce ? { opacity: 1 } : { y: 0 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.15 + i * 0.09 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.52 }}
            style={{
              fontFamily: V.body,
              fontSize: "clamp(1rem, 1.6vw, 1.15rem)",
              lineHeight: 1.6,
              color: V.text2,
              marginTop: 28,
              maxWidth: 460,
            }}
          >
            I'm Jay. I design AI products and ship them as working code. HCI research at UMBC.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE, delay: 0.64 }}
            className="flex flex-wrap items-center gap-4"
            style={{ marginTop: 30 }}
          >
            <MagneticButton onClick={() => scrollToId("work")}>
              See the work <ArrowRight size={16} weight="bold" />
            </MagneticButton>

            {/* status chip */}
            <span
              className="inline-flex items-center gap-2"
              style={{
                fontFamily: V.mono,
                fontSize: 12,
                color: V.text2,
                padding: "9px 14px",
                borderRadius: 999,
                border: `1px solid ${V.border}`,
                background: V.surface,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: 999,
                  background: V.accent,
                  boxShadow: "0 0 8px rgba(91,140,255,0.8)",
                }}
              />
              Open to product design roles. NYC. July 2026.
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ── what I do band ──────────────────────────────────────────────────────── */
function WhatIDo() {
  const markers = [
    { icon: PenNib, label: "Design" },
    { icon: Flask, label: "Research" },
    { icon: Code, label: "Ship in code" },
  ];
  return (
    <section style={{ background: V.bg2, borderTop: `1px solid ${V.border}`, borderBottom: `1px solid ${V.border}` }}>
      <div className="mx-auto max-w-6xl px-6 py-14 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
        <Reveal style={{ flex: 1 }}>
          <p
            style={{
              fontFamily: V.display,
              fontSize: "clamp(1.3rem, 2.4vw, 1.8rem)",
              fontWeight: 500,
              lineHeight: 1.3,
              color: V.text,
              maxWidth: 520,
            }}
          >
            I take products from research to shipped, working code. I do not stop at Figma.
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
            {markers.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="flex items-center gap-2.5">
                  <Icon size={22} weight="duotone" color="#5B8CFF" />
                  <span style={{ fontFamily: V.body, fontSize: 14.5, fontWeight: 500, color: V.text2, whiteSpace: "nowrap" }}>
                    {m.label}
                  </span>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── work cards: live-feeling previews ───────────────────────────────────── */

/* Headroom preview: safe-to-spend counts up, bar fills */
function HeadroomPreview({ active }: { active: boolean }) {
  const [n, setN] = useState(1730);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / 750, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 1730));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ background: "radial-gradient(120% 120% at 70% 20%, #0D2A1F 0%, #081A12 60%, #06130D 100%)", minHeight: "inherit" }}
    >
      <div style={{ width: 168, borderRadius: 26, padding: 6, background: "#0B0D12", border: "1px solid #1E2A24", boxShadow: "0 24px 50px -18px rgba(0,0,0,0.6)", margin: "28px 0" }}>
        <div style={{ borderRadius: 21, background: "#FFFFFF", overflow: "hidden", padding: "16px 14px 12px" }}>
          <p style={{ fontFamily: V.mono, fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "#97A09B" }}>
            Safe to spend
          </p>
          <p style={{ fontFamily: V.display, fontSize: 30, fontWeight: 600, color: "#10160F", lineHeight: 1.1, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>
            ${n.toLocaleString()}
          </p>
          <p style={{ fontFamily: V.body, fontSize: 9.5, fontWeight: 500, color: "#0A7A52", marginTop: 3 }}>≈ $87/day · 20 days</p>
          <div style={{ marginTop: 10, height: 5, borderRadius: 999, background: "#E6F5EE", overflow: "hidden" }}>
            <motion.div
              style={{ height: "100%", borderRadius: 999, background: "#34D399" }}
              animate={{ width: active ? "69%" : "12%" }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
          {[
            { l: "Rent", v: "$650" },
            { l: "Wifi", v: "$120" },
          ].map((r) => (
            <div key={r.l} className="flex items-center justify-between" style={{ padding: "7px 0", borderBottom: "1px solid #EDF1EE" }}>
              <span style={{ fontFamily: V.body, fontSize: 9.5, fontWeight: 600, color: "#10160F" }}>{r.l}</span>
              <span style={{ fontFamily: V.body, fontSize: 9.5, color: "#5B6560", fontVariantNumeric: "tabular-nums" }}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ChronoWeave preview: nudge slides in, haptic dots pulse */
function ChronoWeavePreview({ active }: { active: boolean }) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{ background: "radial-gradient(120% 120% at 30% 20%, #1A1430 0%, #110D20 60%, #0C0916 100%)", minHeight: "inherit" }}
    >
      <div style={{ width: 168, borderRadius: 26, padding: 6, background: "#0B0D12", border: "1px solid #241E38", boxShadow: "0 24px 50px -18px rgba(0,0,0,0.6)", margin: "28px 0" }}>
        <div style={{ borderRadius: 21, background: "#120E22", overflow: "hidden", padding: "16px 14px 44px", position: "relative" }}>
          <p style={{ fontFamily: V.mono, fontSize: 8, letterSpacing: "0.14em", textTransform: "uppercase", color: "#7E76A3" }}>
            Focus block
          </p>
          {/* time ring */}
          <div className="relative mx-auto" style={{ width: 92, height: 92, marginTop: 10 }}>
            <svg width="92" height="92" viewBox="0 0 92 92">
              <circle cx="46" cy="46" r="38" fill="none" stroke="#241E38" strokeWidth="6" />
              <motion.circle
                cx="46"
                cy="46"
                r="38"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 38}
                animate={{ strokeDashoffset: active ? 2 * Math.PI * 38 * 0.35 : 2 * Math.PI * 38 * 0.78 }}
                transition={{ duration: 0.9, ease: EASE }}
                transform="rotate(-90 46 46)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ fontFamily: V.display, fontSize: 20, fontWeight: 600, color: "#EDEAF7", fontVariantNumeric: "tabular-nums" }}>
                24:00
              </span>
              <span style={{ fontFamily: V.mono, fontSize: 7.5, color: "#7E76A3", letterSpacing: "0.1em" }}>REMAINING</span>
            </div>
          </div>
          {/* haptic dots */}
          <div className="flex items-center justify-center gap-2" style={{ marginTop: 10 }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={{ width: 5, height: 5, borderRadius: 999, background: "#A78BFA" }}
                animate={active ? { opacity: [0.3, 1, 0.3], scale: [1, 1.35, 1] } : { opacity: 0.3, scale: 1 }}
                transition={{ duration: 0.9, repeat: active ? Infinity : 0, delay: i * 0.14 }}
              />
            ))}
          </div>
          {/* nudge toast */}
          <motion.div
            className="absolute left-2.5 right-2.5"
            style={{
              bottom: 10,
              borderRadius: 10,
              padding: "8px 10px",
              background: "rgba(167,139,250,0.14)",
              border: "1px solid rgba(167,139,250,0.4)",
              backdropFilter: "blur(6px)",
            }}
            animate={{ y: active ? 0 : 40, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <p style={{ fontFamily: V.body, fontSize: 9, fontWeight: 600, color: "#D6CCF7" }}>Gentle nudge</p>
            <p style={{ fontFamily: V.body, fontSize: 8.5, color: "#9C8FD0", marginTop: 1 }}>Halfway through. Feel the pulse.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* Bumper preview: intercept card slides up over a checkout */
function BumperPreview({ active }: { active: boolean }) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center px-6"
      style={{ background: "radial-gradient(120% 120% at 70% 25%, #0A2422 0%, #071A18 55%, #061211 100%)", minHeight: "inherit" }}
    >
      {/* browser frame */}
      <div style={{ width: "100%", maxWidth: 300, borderRadius: 12, overflow: "hidden", border: "1px solid #16302D", background: "#0D1512", boxShadow: "0 24px 50px -18px rgba(0,0,0,0.6)", margin: "28px 0" }}>
        {/* chrome bar */}
        <div className="flex items-center gap-2" style={{ padding: "7px 10px", background: "#101B18", borderBottom: "1px solid #16302D" }}>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: "#1F332F" }} />
            ))}
          </div>
          <span style={{ fontFamily: V.mono, fontSize: 8, color: "#5F7A74", flex: 1, textAlign: "center" }}>
            checkout.store/cart
          </span>
        </div>
        {/* page + intercept */}
        <div className="relative" style={{ height: 150, padding: 12, overflow: "hidden" }}>
          <div className="flex items-center gap-2.5">
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#14211E" }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 7, width: "72%", borderRadius: 3, background: "#1A2A26" }} />
              <div style={{ height: 6, width: "42%", borderRadius: 3, background: "#152220", marginTop: 5 }} />
            </div>
            <span style={{ fontFamily: V.mono, fontSize: 10, color: "#B9C9C4", fontVariantNumeric: "tabular-nums" }}>$89</span>
          </div>
          <div style={{ marginTop: 12, height: 26, borderRadius: 7, background: "rgba(20,184,166,0.12)", border: "1px solid rgba(20,184,166,0.24)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: V.body, fontSize: 9.5, fontWeight: 600, color: "#5ED3C5" }}>Buy now</span>
          </div>

          {/* intercept panel */}
          <motion.div
            className="absolute left-2 right-2"
            style={{
              bottom: 8,
              borderRadius: 10,
              padding: "10px 12px",
              background: "rgba(13,26,24,0.96)",
              border: "1px solid rgba(20,184,166,0.45)",
              boxShadow: "0 -8px 26px rgba(0,0,0,0.45)",
            }}
            animate={{ y: active ? 0 : 110, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center gap-1.5">
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "#14B8A6" }} />
              <span style={{ fontFamily: V.mono, fontSize: 7.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#4FB8AB" }}>
                Bumper
              </span>
            </div>
            <p style={{ fontFamily: V.body, fontSize: 10.5, fontWeight: 600, color: "#DCEBE8", marginTop: 4 }}>
              Wait. Do you need this, or do you want it?
            </p>
            <div className="flex gap-1.5" style={{ marginTop: 7 }}>
              <span style={{ fontFamily: V.body, fontSize: 8.5, fontWeight: 600, color: "#0A1512", background: "#14B8A6", borderRadius: 5, padding: "4px 9px" }}>
                Sleep on it
              </span>
              <span style={{ fontFamily: V.body, fontSize: 8.5, fontWeight: 500, color: "#7E9A94", border: "1px solid #1F3833", borderRadius: 5, padding: "4px 9px" }}>
                Buy anyway
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* generic editorial card */
interface Project {
  slug: string;
  to: string;
  name: string;
  line: string;
  tags: string[];
  accent: string;
  Preview: (p: { active: boolean }) => JSX.Element;
}

const PROJECTS: Project[] = [
  {
    slug: "headroom",
    to: "/headroom",
    name: "Headroom",
    line: "A money app that answers one question. Can I spend this, right now. Local-first. No bank login.",
    tags: ["PWA", "On-Device", "No Bank Login"],
    accent: "#34D399",
    Preview: HeadroomPreview,
  },
  {
    slug: "chronoweave",
    to: "/chronoweave",
    name: "ChronoWeave",
    line: "Multi-sensory nudges that help people with ADHD feel time pass. Haptics, audio, light.",
    tags: ["Mobile App", "Haptics", "Multi-Sensory"],
    accent: "#A78BFA",
    Preview: ChronoWeavePreview,
  },
  {
    slug: "bumper",
    to: "/bumper",
    name: "Bumper",
    line: "An agentic Chrome extension that catches impulse buys before you regret them.",
    tags: ["Chrome Extension", "Agentic AI", "Conversational"],
    accent: "#14B8A6",
    Preview: BumperPreview,
  },
];

function WorkCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-35% 0px -35% 0px" });
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  const active = hovered || (coarse && inView);
  const { Preview } = project;

  return (
    <Link to={project.to} className="block h-full" style={{ textDecoration: "none" }}>
      <motion.article
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className={`flex h-full ${featured ? "flex-col lg:flex-row" : "flex-col"}`}
        style={{
          background: V.surface,
          border: `1px solid ${hovered ? project.accent + "66" : "var(--border)"}`,
          borderRadius: 12,
          overflow: "hidden",
          transition: "border-color 0.25s",
        }}
      >
        {/* art */}
        <div className={featured ? "lg:order-2 lg:w-[55%]" : ""} style={{ minHeight: featured ? 360 : 300 }}>
          <Preview active={active} />
        </div>

        {/* text */}
        <div
          className={`flex flex-col justify-between gap-6 ${featured ? "lg:order-1 lg:w-[45%]" : ""}`}
          style={{ padding: featured ? "34px 32px" : "26px 26px", flex: 1 }}
        >
          <div>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  style={{
                    fontFamily: V.mono,
                    fontSize: 10.5,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: V.text3,
                    border: `1px solid ${V.border}`,
                    borderRadius: 999,
                    padding: "4px 10px",
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
            <h3
              style={{
                fontFamily: V.display,
                fontSize: featured ? "clamp(1.9rem, 3.4vw, 2.6rem)" : "1.65rem",
                fontWeight: 600,
                color: V.text,
                marginTop: 16,
                letterSpacing: "-0.01em",
              }}
            >
              {project.name}
            </h3>
            <p style={{ fontFamily: V.body, fontSize: 15.5, lineHeight: 1.6, color: V.text2, marginTop: 10, maxWidth: 420 }}>
              {project.line}
            </p>
          </div>

          <motion.span
            className="inline-flex items-center gap-2"
            animate={{ opacity: hovered ? 1 : 0.45, x: hovered ? 4 : 0 }}
            transition={{ duration: 0.22 }}
            style={{ fontFamily: V.body, fontSize: 14, fontWeight: 600, color: hovered ? project.accent : V.text2 }}
          >
            Read case study <ArrowRight size={15} weight="bold" />
          </motion.span>
        </div>
      </motion.article>
    </Link>
  );
}

function SelectedWork() {
  return (
    <section id="work" style={{ background: V.bg, scrollMarginTop: 70 }}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <Eyebrow>Selected work</Eyebrow>
        </Reveal>
        <div className="flex flex-col gap-6" style={{ marginTop: 26 }}>
          <Reveal delay={0.05}>
            <WorkCard project={PROJECTS[0]} featured />
          </Reveal>
          <div className="grid md:grid-cols-2 gap-6 items-stretch">
            <Reveal delay={0.08} className="h-full">
              <WorkCard project={PROJECTS[1]} />
            </Reveal>
            <Reveal delay={0.14} className="h-full">
              <WorkCard project={PROJECTS[2]} />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── how I work ──────────────────────────────────────────────────────────── */
function HowIWork() {
  const tools = [
    { name: "Claude Code", role: "Ships production React from my terminal" },
    { name: "Cursor", role: "Pairing editor for fast iteration" },
    { name: "v0", role: "First-pass UI generation" },
    { name: "Figma Make", role: "Design exploration and systems" },
  ];
  return (
    <section style={{ background: V.bg2, borderTop: `1px solid ${V.border}`, borderBottom: `1px solid ${V.border}` }}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow>How I work</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2
              style={{
                fontFamily: V.display,
                fontSize: "clamp(1.8rem, 3.6vw, 2.8rem)",
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: "-0.01em",
                color: V.text,
                marginTop: 16,
              }}
            >
              Design in Figma. Ship in code. Same week.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: V.body, fontSize: 16.5, lineHeight: 1.65, color: V.text2, marginTop: 18, maxWidth: 460 }}>
              My workflow is AI-native. I go from a research insight to a deployed product without waiting on a handoff,
              because I am the handoff.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ fontFamily: V.body, fontSize: 16.5, lineHeight: 1.65, color: V.text2, marginTop: 14, maxWidth: 460 }}>
              Alongside that I do HCI research at the UMBC CARDS Lab. The research keeps the design honest. The code
              keeps it real.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.12}>
          <div style={{ border: `1px solid ${V.border}`, borderRadius: 12, background: V.surface, overflow: "hidden" }}>
            {tools.map((t, i) => (
              <div
                key={t.name}
                className="flex items-baseline justify-between gap-4"
                style={{ padding: "18px 22px", borderBottom: i === tools.length - 1 ? "none" : `1px solid ${V.border}` }}
              >
                <span style={{ fontFamily: V.mono, fontSize: 13.5, fontWeight: 500, color: V.text }}>{t.name}</span>
                <span style={{ fontFamily: V.body, fontSize: 13.5, color: V.text3, textAlign: "right" }}>{t.role}</span>
              </div>
            ))}
            <div
              className="flex items-baseline justify-between gap-4"
              style={{ padding: "18px 22px", borderTop: `1px solid ${V.borderStrong}`, background: V.accentSoft }}
            >
              <span style={{ fontFamily: V.mono, fontSize: 13.5, fontWeight: 500, color: V.accent }}>Research</span>
              <span style={{ fontFamily: V.body, fontSize: 13.5, color: V.text2, textAlign: "right" }}>
                UMBC CARDS Lab. Human-centered computing.
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── about ───────────────────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" style={{ background: V.bg, scrollMarginTop: 70 }}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 grid md:grid-cols-[0.9fr_1.1fr] gap-12 md:gap-16 items-center">
        <Reveal>
          <div
            className="relative mx-auto md:mx-0"
            style={{ maxWidth: 380, borderRadius: 12, overflow: "hidden", border: `1px solid ${V.border}` }}
          >
            <img
              src={userPhoto}
              alt="Jay Harwani"
              className="block w-full"
              style={{ filter: "grayscale(1) contrast(1.06) brightness(0.88)", display: "block" }}
            />
            {/* cool tint */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(180deg, rgba(91,140,255,0.10), rgba(10,14,22,0.28))", mixBlendMode: "multiply" }}
            />
            <div
              className="absolute left-0 right-0 bottom-0 flex items-center justify-between"
              style={{ padding: "10px 14px", background: "rgba(10,14,22,0.72)", backdropFilter: "blur(8px)", borderTop: `1px solid ${V.border}` }}
            >
              <span style={{ fontFamily: V.mono, fontSize: 11, color: V.text2, letterSpacing: "0.08em" }}>JAY HARWANI</span>
              <span style={{ fontFamily: V.mono, fontSize: 11, color: V.text3 }}>PRODUCT DESIGNER</span>
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <Eyebrow>About</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <p
              style={{
                fontFamily: V.body,
                fontSize: "clamp(1.1rem, 2vw, 1.3rem)",
                lineHeight: 1.65,
                color: V.text,
                marginTop: 18,
                maxWidth: 520,
              }}
            >
              I'm a product designer. I design and build AI products end to end. Right now I'm doing AI and robotics
              research at the UMBC CARDS Lab and finishing an MS in Human-Centered Computing. Before that I shipped
              enterprise products at Welspun.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p style={{ fontFamily: V.body, fontSize: 16.5, lineHeight: 1.65, color: V.text2, marginTop: 16, maxWidth: 520 }}>
              I like tight scope, real constraints, and getting the thing live.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ── contact ─────────────────────────────────────────────────────────────── */
function Contact() {
  return (
    <section id="contact" style={{ background: V.bg2, borderTop: `1px solid ${V.border}`, scrollMarginTop: 70 }}>
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Reveal>
          <Eyebrow>Contact</Eyebrow>
        </Reveal>
        <Reveal delay={0.06}>
          <h2
            style={{
              fontFamily: V.display,
              fontSize: "clamp(2.4rem, 6vw, 4.4rem)",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: V.text,
              marginTop: 18,
            }}
          >
            Say <em style={{ fontFamily: V.serifIt, fontStyle: "italic", fontWeight: 400 }}>hi.</em>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="flex flex-wrap items-center gap-5" style={{ marginTop: 26 }}>
            <a
              href={`mailto:${LINKS.email}`}
              className="inline-flex items-center gap-2.5"
              style={{
                padding: "14px 24px",
                borderRadius: 8,
                background: V.accent,
                color: "#0A0E16",
                fontFamily: V.body,
                fontSize: 15,
                fontWeight: 600,
                boxShadow: "0 8px 30px -8px rgba(91,140,255,0.45)",
                textDecoration: "none",
              }}
            >
              <EnvelopeSimple size={17} weight="bold" /> Email me
            </a>
            <a href={`mailto:${LINKS.email}`} className="link-draw" style={{ fontFamily: V.mono, fontSize: 14.5, color: V.text2 }}>
              {LINKS.email}
            </a>
            <a
              href={LINKS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 link-draw"
              style={{ fontFamily: V.body, fontSize: 14.5, fontWeight: 500, color: V.text2 }}
            >
              <LinkedinLogo size={16} weight="duotone" color="#5B8CFF" /> LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ── footer ──────────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer style={{ background: V.bg, borderTop: `1px solid ${V.border}` }}>
      <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span style={{ fontFamily: V.body, fontSize: 13.5, color: V.text3 }}>Jay Harwani</span>
        <div className="flex items-center gap-5">
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="link-draw" style={{ fontFamily: V.mono, fontSize: 11.5, color: V.text3 }}>
            LINKEDIN
          </a>
          <a href={`mailto:${LINKS.email}`} className="link-draw" style={{ fontFamily: V.mono, fontSize: 11.5, color: V.text3 }}>
            EMAIL
          </a>
          <a href={LINKS.cv} target="_blank" rel="noopener noreferrer" className="link-draw inline-flex items-center gap-1" style={{ fontFamily: V.mono, fontSize: 11.5, color: V.text3 }}>
            <FileText size={12} weight="duotone" color="#6A7488" /> CV
          </a>
        </div>
        <span style={{ fontFamily: V.mono, fontSize: 11.5, color: V.text3, letterSpacing: "0.08em" }}>2026 / v4.0</span>
      </div>
    </footer>
  );
}

/* ── flyer trigger + overlay (controlled mount, repo motion gotcha) ──────── */
function FlyerTrigger() {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (!mounted) return;
    const t = setTimeout(() => setMounted(false), 200);
    return () => clearTimeout(t);
  }, [open, mounted]);

  return (
    <>
      <div className="fixed z-[120]" style={{ right: 22, bottom: 22 }}>
        {/* tooltip */}
        <span
          className="absolute whitespace-nowrap"
          style={{
            right: 62,
            top: "50%",
            transform: "translateY(-50%)",
            fontFamily: V.mono,
            fontSize: 11,
            color: V.text2,
            background: V.surface2,
            border: `1px solid ${V.border}`,
            borderRadius: 6,
            padding: "6px 10px",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.2s",
            pointerEvents: "none",
          }}
        >
          Need a break?
        </span>
        <motion.button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          aria-label="Open the hidden mini game"
          className="relative flex items-center justify-center"
          animate={reduce ? {} : { y: [0, -3, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: V.surface2,
            border: `1px solid ${V.borderStrong}`,
            cursor: "pointer",
            boxShadow: "0 12px 30px -10px rgba(0,0,0,0.55)",
          }}
        >
          {/* original stylized flyer mark: slate helmet, gold visor, core */}
          <svg width="26" height="30" viewBox="0 0 26 30" fill="none" aria-hidden="true">
            <rect x="5" y="1.5" width="16" height="13" rx="5" fill="#2E3950" stroke="#3D4A66" strokeWidth="1" />
            <rect x="8" y="6.5" width="10" height="2.6" rx="1.3" fill="#D9A441" />
            <rect x="6.5" y="16" width="13" height="12" rx="4.5" fill="#232C3D" stroke="#2E3950" strokeWidth="1" />
            <circle cx="13" cy="21" r="2.6" fill="#D9A441" />
            <circle cx="13" cy="21" r="4.4" fill="rgba(217,164,65,0.25)" />
          </svg>
        </motion.button>
      </div>

      {mounted && (
        <Suspense fallback={null}>
          <div style={{ opacity: open ? 1 : 0, transition: "opacity 0.2s" }}>
            <FlyerGame onClose={() => setOpen(false)} />
          </div>
        </Suspense>
      )}
    </>
  );
}

/* ── page ────────────────────────────────────────────────────────────────── */
export function HomePage() {
  return (
    <div style={{ background: V.bg, minHeight: "100vh" }}>
      {/* grain overlay, whole page */}
      <div
        className="fixed inset-0 pointer-events-none z-[5]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
        }}
      />
      <Nav />
      <main className="relative z-10">
        <Hero />
        <WhatIDo />
        <SelectedWork />
        <HowIWork />
        <About />
        <Contact />
      </main>
      <SiteFooter />
      <FlyerTrigger />
    </div>
  );
}
