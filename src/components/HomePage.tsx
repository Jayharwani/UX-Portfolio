import { motion, useInView, useReducedMotion, useScroll, useTransform, useSpring } from "motion/react";
import { useState, useEffect, useRef, lazy, Suspense, type ReactNode } from "react";
import { Link } from "react-router";
import Lenis from "lenis";
import {
  PenNib,
  Flask,
  Code,
  ArrowRight,
  ArrowUpRight,
  FileText,
  List,
  X,
  HandGrabbing,
  TerminalWindow,
  Cursor as CursorIcon,
  MagicWand,
  FigmaLogo,
} from "@phosphor-icons/react";
import userPhoto from "../assets/hero-portrait.jpeg";
import { ContactSection } from "./home/ContactLab";
import { useDiorama, Ambience } from "./home/motionKit";
import MemoryParticles from "./home/MemoryParticles";

const IconPlayground = lazy(() => import("./home/IconPlayground"));
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
    <span className="inline-flex items-center gap-3">
      <motion.span
        aria-hidden="true"
        style={{ width: 22, height: 2, background: "var(--accent)", transformOrigin: "left", borderRadius: 2 }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      />
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

/* one Lenis instance for the page; anchors route through it so easing matches */
let lenisRef: Lenis | null = null;

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenisRef) lenisRef.scrollTo(el, { offset: -64, duration: 0.9 });
  else el.scrollIntoView({ behavior: "smooth", block: "start" });
};

/* light, flicky wheel scrolling: instant response, short ease-out tail */
function useSmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || !window.matchMedia("(pointer: fine)").matches) return;
    const lenis = new Lenis({
      duration: 0.72,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.18,
    });
    lenisRef = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef = null;
    };
  }, [reduce]);
}

/* accent hairline that fills with scroll progress */
function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60]"
      style={{
        height: 2,
        transformOrigin: "left",
        scaleX,
        background: "linear-gradient(90deg, rgba(91,140,255,0.9), rgba(91,140,255,0.4))",
        boxShadow: "0 0 10px rgba(91,140,255,0.5)",
      }}
    />
  );
}

/* ── nav ─────────────────────────────────────────────────────────────────── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = (id: string) => {
    setMenuOpen(false);
    scrollToId(id);
  };

  const navLink: React.CSSProperties = {
    fontFamily: V.body,
    fontSize: 14,
    fontWeight: 500,
    color: V.text2,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "13px 12px", // >=44px tap target
    display: "inline-flex",
    alignItems: "center",
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
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-4 flex items-center justify-between">
        <div className="flex items-baseline gap-3">
          <span style={{ fontFamily: V.display, fontSize: 16, fontWeight: 600, color: V.text }}>Jay Harwani</span>
          <span className="hidden sm:inline" style={{ fontFamily: V.mono, fontSize: 11, color: V.text3, letterSpacing: "0.08em" }}>
            2026 / v4.0
          </span>
        </div>
        <nav className="flex items-center gap-1">
          <button className="hidden md:block" style={navLink} onClick={() => go("work")}>
            Work
          </button>
          <button className="hidden md:block" style={navLink} onClick={() => go("about")}>
            About
          </button>
          <button className="hidden md:block" style={navLink} onClick={() => go("contact")}>
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
              padding: "13px 16px", // >=44px tap target
              borderRadius: 8,
              border: `1px solid ${V.borderStrong}`,
              background: V.accentSoft,
            }}
          >
            CV <ArrowUpRight size={14} weight="bold" />
          </a>
          {/* mobile menu toggle */}
          <button
            className="md:hidden ml-1 flex items-center justify-center"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            style={{ width: 44, height: 44, borderRadius: 8, background: "none", border: `1px solid ${menuOpen ? "var(--border-strong)" : "transparent"}`, color: V.text, cursor: "pointer" }}
          >
            {menuOpen ? <X size={19} /> : <List size={19} />}
          </button>
        </nav>
      </div>

      {/* mobile menu panel */}
      {menuOpen && (
        <motion.nav
          className="md:hidden mx-4 mb-3"
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{
            background: "rgba(17,23,37,0.96)",
            backdropFilter: "blur(14px)",
            border: `1px solid ${V.border}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
          {[
            { label: "Work", id: "work" },
            { label: "About", id: "about" },
            { label: "Contact", id: "contact" },
          ].map((item, i) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className="block w-full text-left"
              style={{
                fontFamily: V.body,
                fontSize: 15,
                fontWeight: 500,
                color: V.text,
                padding: "14px 18px",
                background: "none",
                border: "none",
                borderTop: i === 0 ? "none" : `1px solid ${V.border}`,
                cursor: "pointer",
              }}
            >
              {item.label}
            </button>
          ))}
        </motion.nav>
      )}
    </motion.header>
  );
}

/* ── hero ────────────────────────────────────────────────────────────────── */
function Hero() {
  const reduce = useReducedMotion();
  const [showPlay, setShowPlay] = useState(false);
  const [hintGone, setHintGone] = useState(false);
  /* memory-particles choreography: the DOM headline stays invisible until
     the particles have assembled it, then crossfades in (crisp text wins) */
  const [assembled, setAssembled] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const wordRef = useRef<HTMLElement>(null);
  const particles = !reduce;

  /* gentle exit parallax: text drifts up faster than the page, playground lags */
  const { scrollY } = useScroll();
  const textY = useTransform(scrollY, [0, 640], [0, -84]);
  const playY = useTransform(scrollY, [0, 640], [0, -30]);
  const heroFade = useTransform(scrollY, [0, 560], [1, 0.28]);

  useEffect(() => {
    // load the physics chunk after first paint — every breakpoint now;
    // touch devices get tap-to-bounce instead of drag (scroll stays free)
    const t = setTimeout(() => setShowPlay(true), 250);
    return () => clearTimeout(t);
  }, []);

  /* coarse pointer = tap mode for the blocks (no drag, page scroll wins) */
  const [coarse] = useState(() => typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches);

  const lines: ReactNode[] = [
    "Designing AI",
    "for the people",
    <>
      it{" "}
      <em ref={wordRef} style={{ fontFamily: V.serifIt, fontStyle: "italic", fontWeight: 400, color: V.text }}>
        forgets.
      </em>
    </>,
  ];

  return (
    <section ref={heroRef} className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden" style={{ background: V.bg }}>
      {/* the memory-particles layer: assembles the headline, then owns the
          "forgets." dissolve loop. Skipped entirely under reduced motion. */}
      {particles && (
        <MemoryParticles
          heroRef={heroRef}
          h1Ref={h1Ref}
          wordRef={wordRef}
          onAssembled={() => {
            setAssembled(true);
            if (import.meta.env.DEV) (window as any).__heroAssembled = true;
          }}
        />
      )}
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

      <motion.div className="relative z-10 w-full mx-auto max-w-6xl px-6 md:px-10 lg:px-16 pt-24 pb-8 md:pb-6" style={reduce ? undefined : { y: textY, opacity: heroFade }}>
        {/* copy centered on every breakpoint */}
        <div className="max-w-[820px] mx-auto text-center flex flex-col items-center">
          {/* H1: in particle mode the crisp text lands AFTER the particles
              assemble it — a blur-to-sharp crossfade with one glow pulse,
              like a memory clicking into focus. Reduced motion: plain reveal. */}
          <motion.h1
            ref={h1Ref}
            initial={{ opacity: 0, filter: particles ? "blur(12px)" : "blur(0px)" }}
            animate={
              !particles
                ? { opacity: 1, filter: "blur(0px)" }
                : assembled
                ? {
                    opacity: 1,
                    filter: "blur(0px)",
                    textShadow: [
                      "0 0 0px rgba(143,176,255,0)",
                      "0 0 48px rgba(143,176,255,0.5)",
                      "0 0 0px rgba(143,176,255,0)",
                    ],
                  }
                : { opacity: 0, filter: "blur(12px)" }
            }
            transition={
              assembled
                ? { duration: 1.1, ease: EASE, textShadow: { duration: 2.0, times: [0, 0.32, 1], ease: "easeOut" } }
                : { duration: 0.8, ease: EASE }
            }
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
              <span key={i} data-line className="block">
                {line}
              </span>
            ))}
          </motion.h1>

          {/* sub + CTA are gated on the assembly moment, not fixed clocks,
              so they always land right after the headline does */}
          <motion.p
            className="md:mx-auto"
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: particles ? (assembled ? 1 : 0) : 1, y: particles ? (assembled ? 0 : 14) : 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: particles ? 0.35 : 0.52 }}
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
            animate={{ opacity: particles ? (assembled ? 1 : 0) : 1, y: particles ? (assembled ? 0 : 14) : 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: particles ? 0.6 : 0.64 }}
            className="flex flex-wrap items-center gap-4 md:justify-center"
            style={{ marginTop: 30 }}
          >
            <MagneticButton onClick={() => scrollToId("work")}>
              See the work <ArrowRight size={16} weight="bold" />
            </MagneticButton>
          </motion.div>
        </div>
      </motion.div>

      {/* the blocks playground: a full-width band tucked right under the CTA,
          on EVERY breakpoint — drag on desktop, tap-to-bounce on touch */}
      <motion.div
        className="relative w-full h-[30vh] md:h-[36vh]"
        style={reduce ? undefined : { y: playY, opacity: heroFade }}
        onPointerDownCapture={() => setHintGone(true)}
      >
        <motion.div
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: showPlay ? 1 : 0 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.25 }}
        >
          {showPlay && (
            <Suspense fallback={null}>
              <IconPlayground interactive={!reduce} tapOnly={coarse} />
            </Suspense>
          )}
        </motion.div>

        {/* how-to hint: appears after the blocks settle, leaves on first grab */}
        <motion.div
          className="absolute flex items-center gap-2"
          style={{
            right: 28,
            bottom: 26,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(22,29,46,0.85)",
            border: `1px solid ${V.borderStrong}`,
            backdropFilter: "blur(8px)",
            pointerEvents: "none",
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: hintGone ? 0 : 1, y: hintGone ? 6 : 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: hintGone ? 0 : 2.4 }}
        >
          <motion.span
            animate={reduce ? {} : { x: [0, 5, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-flex" }}
          >
            <HandGrabbing size={16} weight="duotone" color="#5B8CFF" />
          </motion.span>
          <span style={{ fontFamily: V.mono, fontSize: 11, letterSpacing: "0.08em", color: V.text2 }}>
            {coarse ? "Tap the blocks." : "Drag the blocks. Give them a toss."}
          </span>
        </motion.div>
      </motion.div>
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
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-14 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
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
      aria-hidden="true"
      className="relative w-full h-full flex items-center justify-center"
      style={{ background: "radial-gradient(120% 120% at 70% 20%, #0D2A1F 0%, #081A12 60%, #06130D 100%)", minHeight: "inherit" }}
    >
      <div style={{ width: 168, borderRadius: 26, padding: 6, background: "#0B0D12", border: "1px solid #1E2A24", boxShadow: "0 24px 50px -18px rgba(0,0,0,0.6)", margin: "28px 0" }}>
        <div style={{ borderRadius: 21, background: "#FFFFFF", overflow: "hidden", padding: "16px 14px 12px" }}>
          <p style={{ fontFamily: V.mono, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5B6560" }}>
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
      aria-hidden="true"
      className="relative w-full h-full flex items-center justify-center"
      style={{ background: "radial-gradient(120% 120% at 30% 20%, #1A1430 0%, #110D20 60%, #0C0916 100%)", minHeight: "inherit" }}
    >
      <div style={{ width: 168, borderRadius: 26, padding: 6, background: "#0B0D12", border: "1px solid #241E38", boxShadow: "0 24px 50px -18px rgba(0,0,0,0.6)", margin: "28px 0" }}>
        <div style={{ borderRadius: 21, background: "#120E22", overflow: "hidden", padding: "16px 14px 44px", position: "relative" }}>
          <p style={{ fontFamily: V.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A79FC9" }}>
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
              <span style={{ fontFamily: V.mono, fontSize: 9, color: "#A79FC9", letterSpacing: "0.1em" }}>REMAINING</span>
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
              background: "#2A2247",
              border: "1px solid rgba(167,139,250,0.5)",
            }}
            animate={{ y: active ? 0 : 40, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <p style={{ fontFamily: V.body, fontSize: 10, fontWeight: 600, color: "#E4DEFA" }}>Gentle nudge</p>
            <p style={{ fontFamily: V.body, fontSize: 9.5, color: "#B7ACE4", marginTop: 1 }}>Halfway through. Feel the pulse.</p>
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
      aria-hidden="true"
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
          <span style={{ fontFamily: V.mono, fontSize: 9, color: "#8AA39D", flex: 1, textAlign: "center" }}>
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
          <div style={{ marginTop: 12, height: 26, borderRadius: 7, background: "#10231F", border: "1px solid #1C453E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: V.body, fontSize: 10, fontWeight: 600, color: "#63D8CA" }}>Buy now</span>
          </div>

          {/* intercept panel */}
          <motion.div
            className="absolute left-2 right-2"
            style={{
              bottom: 8,
              borderRadius: 10,
              padding: "10px 12px",
              background: "#0D1A18",
              border: "1px solid rgba(20,184,166,0.5)",
              boxShadow: "0 -8px 26px rgba(0,0,0,0.45)",
            }}
            animate={{ y: active ? 0 : 110, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center gap-1.5">
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "#14B8A6" }} />
              <span style={{ fontFamily: V.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6FD3C6" }}>
                Bumper
              </span>
            </div>
            <p style={{ fontFamily: V.body, fontSize: 10.5, fontWeight: 600, color: "#DCEBE8", marginTop: 4 }}>
              Wait. Do you need this, or do you want it?
            </p>
            <div className="flex gap-1.5" style={{ marginTop: 7 }}>
              <span style={{ fontFamily: V.body, fontSize: 9, fontWeight: 600, color: "#06120F", background: "#3FCFBE", borderRadius: 5, padding: "4px 9px" }}>
                Sleep on it
              </span>
              <span style={{ fontFamily: V.body, fontSize: 9, fontWeight: 500, color: "#9CB8B2", border: "1px solid #24463F", borderRadius: 5, padding: "4px 9px" }}>
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
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-35% 0px -35% 0px" });
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    setCoarse(window.matchMedia("(pointer: coarse)").matches);
  }, []);
  const active = hovered || (coarse && inView);
  const { Preview } = project;

  /* the card art drifts gently against the scroll (px only, overscanned so no edges show) */
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], [20, -20]);

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
        <div className={`relative overflow-hidden ${featured ? "lg:order-2 lg:w-[55%]" : ""}`} style={{ minHeight: featured ? 360 : 300 }}>
          <motion.div className="absolute left-0 right-0" style={reduce ? { top: 0, bottom: 0 } : { top: -24, bottom: -24, y: artY }}>
            <Preview active={active} />
          </motion.div>
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
            <h2
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
            </h2>
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
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-24 md:py-32">
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
/* the toolchain terminal: 3D pointer tilt, shine sweep, live rows, typing prompt */
function ToolchainCard() {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [shine, setShine] = useState({ x: 50, y: 50, on: false });
  const [hoverRow, setHoverRow] = useState(-1);
  const [typed, setTyped] = useState("");

  const tools = [
    { icon: TerminalWindow, name: "Claude Code", role: "Ships production React from my terminal" },
    { icon: CursorIcon, name: "Cursor", role: "Pairing editor for fast iteration" },
    { icon: MagicWand, name: "v0", role: "First-pass UI generation" },
    { icon: FigmaLogo, name: "Figma Make", role: "Design exploration and systems" },
  ];

  /* typing loop on the prompt line */
  useEffect(() => {
    const lines = ["design in figma", "ship with claude code", "deploy. live by friday."];
    if (reduce) {
      setTyped(lines[2]);
      return;
    }
    let li = 0;
    let ci = 0;
    let deleting = false;
    let t: number;
    const step = () => {
      const line = lines[li];
      if (!deleting) {
        ci++;
        setTyped(line.slice(0, ci));
        if (ci === line.length) {
          deleting = true;
          t = window.setTimeout(step, 2200);
          return;
        }
        t = window.setTimeout(step, 55 + Math.random() * 60);
      } else {
        ci--;
        setTyped(line.slice(0, ci));
        if (ci === 0) {
          deleting = false;
          li = (li + 1) % lines.length;
        }
        t = window.setTimeout(step, 26);
      }
    };
    t = window.setTimeout(step, 1200);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <div style={{ perspective: 1100 }}>
      <motion.div
        ref={cardRef}
        animate={{ rotateX: tilt.x, rotateY: tilt.y }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        onMouseMove={(e) => {
          if (reduce || !cardRef.current) return;
          const r = cardRef.current.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          setTilt({ x: (py - 0.5) * -7, y: (px - 0.5) * 9 });
          setShine({ x: px * 100, y: py * 100, on: true });
        }}
        onMouseLeave={() => {
          setTilt({ x: 0, y: 0 });
          setShine((s) => ({ ...s, on: false }));
          setHoverRow(-1);
        }}
        className="relative"
        style={{
          border: `1px solid ${V.borderStrong}`,
          borderRadius: 14,
          background: V.surface,
          overflow: "hidden",
          transformStyle: "preserve-3d",
          boxShadow: "0 30px 70px -30px rgba(0,0,0,0.6)",
        }}
      >
        {/* pointer shine sweep */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(340px circle at ${shine.x}% ${shine.y}%, rgba(91,140,255,0.09), transparent 65%)`,
            opacity: shine.on ? 1 : 0,
            transition: "opacity 0.35s",
            zIndex: 1,
          }}
        />

        {/* terminal chrome */}
        <div
          className="relative flex items-center gap-2"
          style={{ padding: "12px 16px", borderBottom: `1px solid ${V.border}`, background: V.surface2, zIndex: 2 }}
        >
          {["#2E3950", "#2E3950", "#5B8CFF"].map((c, i) => (
            <span key={i} style={{ width: 9, height: 9, borderRadius: 999, background: c, opacity: i === 2 ? 0.8 : 1 }} />
          ))}
          <span style={{ fontFamily: V.mono, fontSize: 11, letterSpacing: "0.08em", color: V.text3, marginLeft: 8 }}>
            jay@portfolio — toolchain
          </span>
        </div>

        {/* tool rows */}
        <div className="relative" style={{ zIndex: 2 }}>
          {tools.map((t, i) => {
            const Icon = t.icon;
            const hot = hoverRow === i;
            return (
              <motion.div
                key={t.name}
                className="relative flex items-center gap-3"
                onMouseEnter={() => setHoverRow(i)}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.08 }}
                style={{
                  padding: "16px 20px",
                  borderBottom: `1px solid ${V.border}`,
                  background: hot ? "rgba(91,140,255,0.05)" : "transparent",
                  transition: "background 0.2s",
                  cursor: "default",
                }}
              >
                {/* accent rail on hover */}
                <motion.span
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0"
                  style={{ width: 2, background: V.accent, transformOrigin: "top" }}
                  animate={{ scaleY: hot ? 1 : 0 }}
                  transition={{ duration: 0.25, ease: EASE }}
                />
                <motion.span animate={{ x: hot ? 3 : 0 }} transition={{ duration: 0.2 }} style={{ display: "inline-flex" }}>
                  <Icon size={19} weight="duotone" color={hot ? "#5B8CFF" : "#6A7488"} style={{ transition: "color 0.2s" }} />
                </motion.span>
                <motion.span
                  animate={{ x: hot ? 3 : 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ fontFamily: V.mono, fontSize: 13.5, fontWeight: 500, color: hot ? V.text : V.text2, transition: "color 0.2s", whiteSpace: "nowrap" }}
                >
                  {t.name}
                </motion.span>
                <span
                  className="ml-auto"
                  style={{ fontFamily: V.body, fontSize: 13, color: hot ? V.text2 : V.text3, textAlign: "right", transition: "color 0.2s" }}
                >
                  {t.role}
                </span>
              </motion.div>
            );
          })}

          {/* research row, always lit */}
          <div
            className="flex items-center gap-3"
            style={{ padding: "16px 20px", borderBottom: `1px solid ${V.border}`, background: V.accentSoft }}
          >
            <Flask size={19} weight="duotone" color="#5B8CFF" />
            <span style={{ fontFamily: V.mono, fontSize: 13.5, fontWeight: 500, color: V.accent, whiteSpace: "nowrap" }}>Research</span>
            <span className="ml-auto" style={{ fontFamily: V.body, fontSize: 13, color: V.text2, textAlign: "right" }}>
              UMBC CARDS Lab. Human-centered computing.
            </span>
          </div>

          {/* live prompt */}
          <div className="flex items-center gap-2" style={{ padding: "14px 20px", background: V.surface2 }}>
            <span style={{ fontFamily: V.mono, fontSize: 13, color: V.accent }}>$</span>
            <span style={{ fontFamily: V.mono, fontSize: 13, color: V.text2, minHeight: 18 }}>{typed}</span>
            <motion.span
              aria-hidden="true"
              style={{ width: 7, height: 15, background: V.accent, display: "inline-block" }}
              animate={reduce ? {} : { opacity: [1, 0, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const d = useDiorama(sectionRef, { maxX: 3.5, maxY: 5 });
  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: V.bg2, borderTop: `1px solid ${V.border}`, borderBottom: `1px solid ${V.border}`, perspective: 1200 }}
    >
      {/* shared cursor-lit dot grid (matches Contact) */}
      <Ambience d={d} />

      <motion.div
        className="relative mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-24 md:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        style={{ rotateX: d.tiltOn ? d.srx : 0, rotateY: d.tiltOn ? d.sry : 0, transformStyle: "preserve-3d" }}
      >
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

        <Reveal delay={0.12} className="min-w-0">
          <ToolchainCard />
        </Reveal>
      </motion.div>
    </section>
  );
}

/* ── about ───────────────────────────────────────────────────────────────── */

/* accent wipe behind a key phrase, sweeps in on scroll */
function Highlight({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  return (
    <span ref={ref} style={{ position: "relative", whiteSpace: "nowrap" }}>
      <motion.span
        aria-hidden="true"
        style={{
          position: "absolute",
          left: -3,
          right: -3,
          top: "8%",
          bottom: "2%",
          background: "linear-gradient(90deg, rgba(91,140,255,0.22), rgba(91,140,255,0.1))",
          borderRadius: 4,
          transformOrigin: "left",
          zIndex: 0,
        }}
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.7, ease: EASE, delay }}
      />
      <span style={{ position: "relative", zIndex: 1 }}>{children}</span>
    </span>
  );
}

/* HUD corner brackets that draw in around the photo */
function Corners({ show }: { show: boolean }) {
  const pos: React.CSSProperties[] = [
    { top: -7, left: -7, borderTop: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" },
    { top: -7, right: -7, borderTop: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" },
    { bottom: -7, left: -7, borderBottom: "2px solid var(--accent)", borderLeft: "2px solid var(--accent)" },
    { bottom: -7, right: -7, borderBottom: "2px solid var(--accent)", borderRight: "2px solid var(--accent)" },
  ];
  return (
    <>
      {pos.map((p, i) => (
        <motion.span
          key={i}
          aria-hidden="true"
          style={{ position: "absolute", width: 24, height: 24, ...p }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={show ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 0.45, ease: EASE, delay: 0.25 + i * 0.08 }}
        />
      ))}
    </>
  );
}

function About() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const d = useDiorama(sectionRef, { maxX: 3.5, maxY: 4.5 });
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { once: true, margin: "-15% 0px" });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const chips = [
    { label: "UMBC CARDS LAB", style: { top: 18, right: -14 }, bob: 5.2 },
    { label: "MS · HUMAN-CENTERED COMPUTING", style: { top: "44%", left: -22 }, bob: 6.4 },
    { label: "PREV · WELSPUN", style: { bottom: 74, right: -18 }, bob: 5.8 },
  ];

  return (
    <section id="about" ref={sectionRef} className="relative overflow-hidden" style={{ background: V.bg, scrollMarginTop: 70, perspective: 1200 }}>
      {/* shared cursor-lit dot grid (matches Contact) */}
      <Ambience d={d} />

      <motion.div
        className="relative mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-24 md:py-32 grid md:grid-cols-[0.9fr_1.1fr] gap-14 md:gap-16 items-center"
        style={{ rotateX: d.tiltOn ? d.srx : 0, rotateY: d.tiltOn ? d.sry : 0, transformStyle: "preserve-3d" }}
      >
        {/* photo: tilt, glow, HUD corners, floating chips */}
        <Reveal>
          <div className="relative mx-auto md:mx-0" style={{ maxWidth: 380, perspective: 900 }}>
            {/* glow behind */}
            <motion.div
              aria-hidden="true"
              className="absolute pointer-events-none"
              style={{ inset: -34, background: "radial-gradient(60% 60% at 50% 50%, rgba(91,140,255,0.16), transparent 70%)", filter: "blur(6px)" }}
              animate={reduce ? {} : { opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              ref={frameRef}
              className="relative"
              style={{ borderRadius: 12, transformStyle: "preserve-3d" }}
              animate={{ rotateX: tilt.x, rotateY: tilt.y }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
              onMouseMove={(e) => {
                if (reduce || !frameRef.current) return;
                const r = frameRef.current.getBoundingClientRect();
                setTilt({
                  x: ((e.clientY - r.top - r.height / 2) / r.height) * -7,
                  y: ((e.clientX - r.left - r.width / 2) / r.width) * 9,
                });
              }}
              onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
              <Corners show={inView} />
              <div className="relative group" style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${V.border}` }}>
                <img
                  src={userPhoto}
                  alt="Jay Harwani"
                  className="block w-full"
                  style={{ filter: "grayscale(1) contrast(1.06) brightness(0.88)", display: "block", transition: "filter 0.45s, transform 0.6s" }}
                  onMouseEnter={(e) => {
                    if (!reduce) (e.currentTarget as HTMLImageElement).style.filter = "grayscale(0.55) contrast(1.05) brightness(0.94)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLImageElement).style.filter = "grayscale(1) contrast(1.06) brightness(0.88)";
                  }}
                />
                {/* cool tint */}
                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(91,140,255,0.10), rgba(10,14,22,0.28))", mixBlendMode: "multiply" }} />
                {/* scanline sweep on reveal */}
                {!reduce && (
                  <motion.div
                    aria-hidden="true"
                    className="absolute left-0 right-0 pointer-events-none"
                    style={{ height: 90, background: "linear-gradient(180deg, transparent, rgba(91,140,255,0.16), transparent)" }}
                    initial={{ top: "-24%" }}
                    animate={inView ? { top: "120%" } : undefined}
                    transition={{ duration: 1.4, ease: EASE, delay: 0.4 }}
                  />
                )}
                <div
                  className="absolute left-0 right-0 bottom-0 flex items-center justify-between"
                  style={{ padding: "10px 14px", background: "rgba(10,14,22,0.72)", backdropFilter: "blur(8px)", borderTop: `1px solid ${V.border}` }}
                >
                  <span className="inline-flex items-center gap-2" style={{ fontFamily: V.mono, fontSize: 11, color: V.text2, letterSpacing: "0.08em" }}>
                    <motion.span
                      style={{ width: 5, height: 5, borderRadius: 999, background: V.accent, boxShadow: "0 0 7px rgba(91,140,255,0.9)" }}
                      animate={reduce ? {} : { opacity: [1, 0.35, 1] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                    JAY HARWANI
                  </span>
                  <span style={{ fontFamily: V.mono, fontSize: 11, color: V.text3 }}>PRODUCT DESIGNER</span>
                </div>
              </div>
            </motion.div>

            {/* floating mono chips */}
            {chips.map((c, i) => (
              <motion.span
                key={c.label}
                className="absolute hidden sm:inline-flex"
                style={{
                  ...(c.style as React.CSSProperties),
                  fontFamily: V.mono,
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: V.text2,
                  background: "rgba(22,29,46,0.9)",
                  border: `1px solid ${V.borderStrong}`,
                  borderRadius: 999,
                  padding: "6px 11px",
                  backdropFilter: "blur(6px)",
                  boxShadow: "0 10px 26px -10px rgba(0,0,0,0.6)",
                  whiteSpace: "nowrap",
                  zIndex: 2,
                }}
                initial={{ opacity: 0, y: 14 }}
                animate={inView ? { opacity: 1, y: 0 } : undefined}
                transition={{ duration: 0.55, ease: EASE, delay: 0.5 + i * 0.12 }}
              >
                <motion.span
                  className="inline-block"
                  animate={reduce ? {} : { y: [0, -4, 0] }}
                  transition={{ duration: c.bob, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
                >
                  {c.label}
                </motion.span>
              </motion.span>
            ))}
          </div>
        </Reveal>

        {/* copy with accent wipes */}
        <div>
          <Reveal>
            <Eyebrow>About</Eyebrow>
          </Reveal>
          <Reveal delay={0.06}>
            <p
              style={{
                fontFamily: V.body,
                fontSize: "clamp(1.15rem, 2vw, 1.35rem)",
                lineHeight: 1.7,
                color: V.text,
                marginTop: 18,
                maxWidth: 540,
              }}
            >
              I'm a product designer. I design and build <Highlight delay={0.3}>AI products end to end</Highlight>. Right
              now I'm doing AI and robotics research at the <Highlight delay={0.5}>UMBC CARDS Lab</Highlight> and
              finishing an MS in Human-Centered Computing. Before that I shipped enterprise products at{" "}
              <Highlight delay={0.7}>Welspun</Highlight>.
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <p
              style={{
                fontFamily: V.display,
                fontSize: "clamp(1.25rem, 2.4vw, 1.7rem)",
                fontWeight: 500,
                lineHeight: 1.35,
                color: V.text2,
                marginTop: 26,
                maxWidth: 520,
              }}
            >
              I like tight scope, real constraints, and{" "}
              <em style={{ fontFamily: V.serifIt, fontStyle: "italic", fontWeight: 400, color: V.text }}>getting the thing live.</em>
            </p>
          </Reveal>
        </div>
      </motion.div>
    </section>
  );
}

/* ── footer ──────────────────────────────────────────────────────────────── */
function SiteFooter() {
  return (
    <footer style={{ background: V.bg, borderTop: `1px solid ${V.border}` }}>
      <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span style={{ fontFamily: V.body, fontSize: 13.5, color: V.text3 }}>Jay Harwani</span>
        <div className="flex items-center gap-5">
          <a href={LINKS.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center" style={{ fontFamily: V.mono, fontSize: 11.5, color: V.text3, padding: "13px 6px" }}>
            <span className="link-draw">LINKEDIN</span>
          </a>
          <a href={`mailto:${LINKS.email}`} className="inline-flex items-center" style={{ fontFamily: V.mono, fontSize: 11.5, color: V.text3, padding: "13px 6px" }}>
            <span className="link-draw">EMAIL</span>
          </a>
          <a href={LINKS.cv} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1" style={{ fontFamily: V.mono, fontSize: 11.5, color: V.text3, padding: "13px 6px" }}>
            <FileText size={12} weight="duotone" color="#7D89A0" /> <span className="link-draw">CV</span>
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
      lenisRef?.stop();
      return;
    }
    lenisRef?.start();
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
          aria-label="Open the Iron Man mini game"
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
          {/* Iron Man helmet */}
          <svg width="26" height="28" viewBox="0 0 24 26" fill="none" aria-hidden="true">
            <path
              d="M12 1C6.6 1 3.8 4.6 3.8 9.4c0 3.3.7 6.1 1.6 8.5l1.4 3.6c.5 1.4 1.5 2.4 2.8 2.8 1.5.5 3.3.5 4.8 0 1.3-.4 2.3-1.4 2.8-2.8l1.4-3.6c.9-2.4 1.6-5.2 1.6-8.5C20.2 4.6 17.4 1 12 1z"
              fill="#C13530"
              stroke="#8E2723"
              strokeWidth="1"
            />
            <path
              d="M12 6c-3 0-4.7 1.5-4.7 4.2 0 2.3.5 4.5 1.2 6.4.6 1.6 1.9 2.5 3.5 2.5s2.9-.9 3.5-2.5c.7-1.9 1.2-4.1 1.2-6.4C16.7 7.5 15 6 12 6z"
              fill="#E3A857"
            />
            <rect x="7.9" y="11.2" width="3" height="1.8" rx="0.9" fill="#F4FAFF" />
            <rect x="13.1" y="11.2" width="3" height="1.8" rx="0.9" fill="#F4FAFF" />
            <rect x="10.6" y="16.4" width="2.8" height="1" rx="0.5" fill="#8E2723" />
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
  useSmoothScroll();
  return (
    <div style={{ background: V.bg, minHeight: "100vh" }}>
      <ScrollProgress />
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
        <ContactSection />
      </main>
      <SiteFooter />
      <FlyerTrigger />
    </div>
  );
}
