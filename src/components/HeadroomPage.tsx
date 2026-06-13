import { motion, useScroll, useSpring, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight, ArrowDown, Plus } from "lucide-react";
import { Footer } from "./Footer";

/* ══════════════════════════════════════════════════════════ */
/*  Tokens — Headroom editorial                               */
/* ══════════════════════════════════════════════════════════ */
const C = {
  bg: "#FAFBFA",
  surface: "#FFFFFF",
  ink: "#10160F",
  inkSoft: "#5B6560",
  inkFaint: "#97A09B",
  accent: "#0E9E6B",
  accentDeep: "#0A7A52",
  accentSoft: "#E6F5EE",
  hairline: "#E7EBE8",
  amber: "#C77A2B",
  clay: "#B5532E",
};
const EASE = [0.16, 1, 0.3, 1] as const;
const LIVE_URL = "https://headroom-opal.vercel.app/";

/* Screenshot paths — real PNGs in /public/headroom/ */
const SHOT = {
  todayHealthy: "/headroom/today-healthy.png",
  plan: "/headroom/plan.png",
  menu: "/headroom/menu.png",
  add: "/headroom/add-sheet.png",
  onboardClarity: "/headroom/onboard-clarity.png",
  onboardConfidence: "/headroom/onboard-confidence.png",
  onboardAlerts: "/headroom/onboard-alerts.png",
};

/* ══════════════════════════════════════════════════════════ */
/*  Page                                                      */
/* ══════════════════════════════════════════════════════════ */
export function HeadroomPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Headroom — Product Design Case Study";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? null;
    if (meta) {
      meta.setAttribute(
        "content",
        "Headroom — a safe-to-spend money app. A self-initiated product design case study: the wedge, six redesigns, the design system, and a live installable PWA."
      );
    }
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink }} className="relative w-full overflow-hidden">
      <StickyProgress />
      <Nav />

      <main>
        <Hero />
        <SplashMoment />
        <OnboardingFlow />
        <ProblemSection />
        <WedgeSection />
        <DesignedSection />
        <IterationsSection />
        <ConstraintsCallout />
        <AISection />
        <SystemSection />
        <LeftOutSection />
        <VoiceSection />
        <OutcomeSection />
        <FinalCTA />
      </main>

      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  Sticky scroll progress                                    */
/* ══════════════════════════════════════════════════════════ */
function StickyProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9999] origin-left"
      style={{ scaleX, height: 3, background: C.accent }}
    />
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  Navigation                                                */
/* ══════════════════════════════════════════════════════════ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        backgroundColor: scrolled ? "rgba(250,251,250,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(180%)" : "none",
        borderBottom: scrolled ? `1px solid ${C.hairline}` : "1px solid transparent",
        transition: "background-color .3s, border-color .3s, backdrop-filter .3s",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" style={{ color: C.ink }} strokeWidth={2.5} />
          <span className="text-[14px] font-semibold" style={{ color: C.ink, fontFamily: "DM Sans, sans-serif" }}>
            Back to work
          </span>
        </Link>

        <a
          href={LIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-4 py-2 rounded-full transition-transform hover:scale-[1.03] active:scale-[0.97]"
          style={{ backgroundColor: C.accent, color: "#FFFFFF", fontFamily: "DM Sans, sans-serif" }}
        >
          Try the live app
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </a>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  Shared primitives                                         */
/* ══════════════════════════════════════════════════════════ */
function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function SectionShell({
  num,
  label,
  children,
  bg,
}: {
  num: string;
  label: string;
  children: React.ReactNode;
  bg?: string;
}) {
  return (
    <section className="relative py-24 sm:py-32" style={{ backgroundColor: bg }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-3 mb-10 sm:mb-14">
            <span
              className="text-[13px]"
              style={{ color: C.accent, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}
            >
              {num}
            </span>
            <span className="w-10 h-px" style={{ backgroundColor: C.hairline }} />
            <span
              className="text-[11px] uppercase tracking-[0.22em]"
              style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
            >
              {label}
            </span>
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}

function Display({
  children,
  size = "clamp(34px, 5vw, 60px)",
  className,
}: {
  children: React.ReactNode;
  size?: string;
  className?: string;
}) {
  return (
    <h2
      className={className}
      style={{
        fontFamily: "Syne, sans-serif",
        fontWeight: 700,
        letterSpacing: "-0.03em",
        lineHeight: 1.04,
        color: C.ink,
        fontSize: size,
      }}
    >
      {children}
    </h2>
  );
}

function Body({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={className}
      style={{
        fontFamily: "DM Sans, sans-serif",
        fontSize: "clamp(16px, 1.4vw, 18.5px)",
        lineHeight: 1.68,
        color: C.inkSoft,
        maxWidth: "62ch",
      }}
    >
      {children}
    </p>
  );
}

/* Phone mockup with graceful placeholder fallback */
function Phone({
  src,
  alt,
  label,
  tilt = 0,
  width = 260,
}: {
  src: string;
  alt: string;
  label: string;
  tilt?: number;
  width?: number;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduce = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      style={{ width, maxWidth: "100%" }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, rotate: tilt * 1.4 }}
      animate={inView ? { opacity: 1, y: 0, rotate: tilt } : {}}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <div
        className="relative rounded-[2.4rem] p-2"
        style={{
          backgroundColor: "#0C120E",
          boxShadow: "0 30px 60px -24px rgba(16,40,30,.35), 0 0 0 1px rgba(16,40,30,.05)",
        }}
      >
        {/* notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-20 h-5 rounded-b-2xl" style={{ backgroundColor: "#0C120E" }} />
        <div
          className="relative overflow-hidden rounded-[1.9rem]"
          style={{ aspectRatio: "393 / 852", backgroundColor: C.accentSoft }}
        >
          {!failed ? (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              onError={() => setFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <PhonePlaceholder label={label} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

function PhonePlaceholder({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center" style={{ backgroundColor: C.accentSoft }}>
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
      >
        <div className="w-5 h-5 rounded-full" style={{ backgroundColor: C.accent }} />
      </div>
      <span className="text-[13px] font-semibold" style={{ color: C.accentDeep, fontFamily: "DM Sans, sans-serif" }}>
        {label}
      </span>
      <span className="text-[10.5px]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
        screenshot pending
      </span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  HERO                                                      */
/* ══════════════════════════════════════════════════════════ */
function Hero() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-24">
      {/* ambient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(at 80% 0%, ${C.accentSoft} 0%, transparent 45%)` }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left — copy */}
        <div className="lg:col-span-7">
          <Reveal>
            <span
              className="inline-block text-[11px] uppercase tracking-[0.25em] mb-6"
              style={{ color: C.accentDeep, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}
            >
              Product Design · Self-Initiated
            </span>
          </Reveal>

          <Reveal delay={0.08}>
            <h1
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 0.98,
                color: C.ink,
                fontSize: "clamp(38px, 6.2vw, 76px)",
              }}
            >
              The world doesn't need another budgeting app.{" "}
              <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 500, color: C.accent }}>
                So I didn't build one.
              </span>
            </h1>
          </Reveal>

          <Reveal delay={0.16}>
            <p
              className="mt-7"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "clamp(17px, 1.6vw, 20px)", lineHeight: 1.6, color: C.inkSoft, maxWidth: "54ch" }}
            >
              Headroom answers the one question budgeting apps ignore —{" "}
              <span style={{ color: C.ink, fontWeight: 600 }}>can I spend this, right now?</span>
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <a
                href={LIVE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 text-[14.5px] font-semibold px-7 py-4 rounded-full transition-transform hover:scale-[1.02] active:scale-[0.98]"
                style={{ backgroundColor: C.accent, color: "#FFFFFF", fontFamily: "DM Sans, sans-serif", boxShadow: "0 14px 28px -12px rgba(14,158,107,.6)" }}
              >
                Try the live app
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
              </a>
              <button
                onClick={() => document.getElementById("problem")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center justify-center gap-2 text-[14.5px] font-semibold px-7 py-4 rounded-full transition-colors"
                style={{ color: C.ink, border: `1px solid ${C.hairline}`, backgroundColor: C.surface, fontFamily: "DM Sans, sans-serif" }}
              >
                See how I built it
                <ArrowDown className="w-4 h-4 transition-transform group-hover:translate-y-0.5" strokeWidth={2.5} />
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.32}>
            <p className="mt-6 text-[12.5px]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', letterSpacing: "0.04em" }}>
              Self-initiated · shipped &amp; installable · seeking first users
            </p>
          </Reveal>
        </div>

        {/* Right — phone with the safe-to-spend hero number */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <HeroPhone />
        </div>
      </div>

      {/* By the numbers strip */}
      <Reveal delay={0.2}>
        <div className="relative mx-auto max-w-6xl px-5 sm:px-8 mt-16 sm:mt-20">
          <div
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-5 px-6 rounded-2xl"
            style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}
          >
            {[
              "1 number",
              "3 tabs",
              "0 categories",
              "0 bank logins",
              "~5-sec answer",
              "100% on-device",
              "installable PWA",
              "Lighthouse 92/100/95",
            ].map((stat, i) => (
              <div key={stat} className="flex items-center gap-6">
                {i > 0 && <span className="hidden sm:block w-px h-3" style={{ backgroundColor: C.hairline }} />}
                <span className="text-[12.5px] font-medium" style={{ color: C.inkSoft, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
                  {stat}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function HeroPhone() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);

  return (
    <motion.div
      ref={ref}
      style={{ width: 280, maxWidth: "100%" }}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1, ease: EASE }}
    >
      <div
        className="relative rounded-[2.6rem] p-2.5"
        style={{ backgroundColor: "#0C120E", boxShadow: "0 40px 80px -28px rgba(16,40,30,.4), 0 0 0 1px rgba(16,40,30,.06)" }}
      >
        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-10 w-24 h-6 rounded-b-2xl" style={{ backgroundColor: "#0C120E" }} />
        <div className="relative overflow-hidden rounded-[2.1rem]" style={{ aspectRatio: "393 / 852" }}>
          {!failed ? (
            <img
              src={SHOT.todayHealthy}
              alt="Headroom Today screen showing safe-to-spend amount"
              onError={() => setFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <SafeToSpendMock inView={inView} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* Recreated 'Today' screen used as hero fallback until real PNG is dropped */
function SafeToSpendMock({ inView }: { inView: boolean }) {
  const count = useCountUp(1730, inView, 1.4);
  return (
    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: C.surface }}>
      {/* status bar */}
      <div className="flex items-center justify-between px-6 pt-5 pb-2">
        <span className="text-[11px] font-semibold" style={{ color: C.ink, fontFamily: "DM Sans, sans-serif" }}>9:41</span>
        <span className="text-[10px]" style={{ color: C.inkFaint }}>●●● ▮</span>
      </div>
      {/* header */}
      <div className="px-6 pt-6">
        <span className="text-[12px] uppercase tracking-[0.16em]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
          Safe to spend
        </span>
      </div>
      {/* big number */}
      <div className="px-6 pt-2 flex-1 flex flex-col justify-start">
        <div className="flex items-start">
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 28, color: C.ink, marginTop: 8 }}>$</span>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 72, lineHeight: 1, color: C.ink, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>
            {count}
          </span>
        </div>
        <span className="mt-2 text-[13px]" style={{ color: C.accentDeep, fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
          ≈ $87/day · 20 days to payday
        </span>

        {/* progress */}
        <div className="mt-6 h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.accentSoft }}>
          <motion.div className="h-full rounded-full" style={{ backgroundColor: C.accent }} initial={{ width: 0 }} animate={inView ? { width: "69%" } : {}} transition={{ duration: 1.4, delay: 0.3, ease: EASE }} />
        </div>

        {/* what's coming */}
        <div className="mt-7">
          <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
            What's coming
          </span>
          {[
            { label: "Rent", val: "$650", days: "Jun 28" },
            { label: "Wifi", val: "$120", days: "Jun 28" },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between py-2.5" style={{ borderBottom: `1px solid ${C.hairline}` }}>
              <div className="flex flex-col">
                <span className="text-[13px] font-semibold" style={{ color: C.ink, fontFamily: "DM Sans, sans-serif" }}>{row.label}</span>
                <span className="text-[10.5px]" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif" }}>{row.days}</span>
              </div>
              <span className="text-[13px] font-semibold" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", fontVariantNumeric: "tabular-nums" }}>{row.val}</span>
            </div>
          ))}
        </div>
      </div>
      {/* bottom tab bar */}
      <div className="flex items-center justify-around px-6 py-4" style={{ borderTop: `1px solid ${C.hairline}` }}>
        {["Today", "Plan", "Menu"].map((t, i) => (
          <span key={t} className="text-[11px] font-semibold" style={{ color: i === 0 ? C.accent : C.inkFaint, fontFamily: "DM Sans, sans-serif" }}>
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

function useCountUp(target: number, active: boolean, duration = 1.4) {
  const [val, setVal] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!active) return;
    if (reduce) { setVal(target); return; }
    let raf = 0;
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, reduce]);
  return val.toLocaleString();
}

/* ══════════════════════════════════════════════════════════ */
/*  SPLASH MOMENT — the thesis, in one motion                 */
/*  Coins drain toward "empty"; a glowing emerald line        */
/*  catches what's safe, leaving headroom above zero.         */
/* ══════════════════════════════════════════════════════════ */
function SplashMoment() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  // Stage geometry (viewBox-free, px within a fixed-height stage)
  const STAGE_H = 300;
  const LINE_Y = 150; // emerald "headroom" catch line
  const EMPTY_Y = 262; // $0 baseline

  // Coins: spread across x, each loops fall → caught → fade
  const coins = [
    { x: "12%", delay: 0.0, kind: "gold" },
    { x: "26%", delay: 0.55, kind: "emerald" },
    { x: "40%", delay: 1.1, kind: "gold" },
    { x: "54%", delay: 0.3, kind: "gold" },
    { x: "68%", delay: 0.85, kind: "emerald" },
    { x: "82%", delay: 1.4, kind: "gold" },
    { x: "19%", delay: 1.7, kind: "emerald" },
    { x: "61%", delay: 2.0, kind: "gold" },
  ];

  return (
    <section ref={ref} className="relative py-20 sm:py-28 overflow-hidden" style={{ backgroundColor: C.ink }}>
      {/* ambient emerald glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(at 70% 60%, rgba(14,158,107,0.18) 0%, transparent 55%)` }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Caption */}
        <div className="lg:col-span-5">
          <Reveal>
            <span className="text-[11px] uppercase tracking-[0.22em]" style={{ color: C.accent, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>
              The thesis, in one motion
            </span>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-5" style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(22px, 3vw, 36px)", lineHeight: 1.25, letterSpacing: "-0.025em", color: "#FFFFFF", maxWidth: "20ch" }}>
              Money drains before payday. Headroom catches what's{" "}
              <span style={{ color: C.accent }}>safe</span> — above empty.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <p className="mt-4 text-[14.5px]" style={{ color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans, sans-serif", lineHeight: 1.6, maxWidth: "44ch" }}>
              The gap between the line and zero is the only number that matters.
            </p>
          </Reveal>
        </div>

        {/* Animation stage */}
        <div className="lg:col-span-7">
          <div
            className="relative w-full rounded-3xl overflow-hidden"
            style={{ height: STAGE_H, backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {/* empty baseline */}
            <div className="absolute left-0 right-0 flex items-center gap-3 px-5" style={{ top: EMPTY_Y }}>
              <div className="flex-1 h-px" style={{ backgroundColor: "rgba(255,255,255,0.18)", borderTop: "1px dashed rgba(255,255,255,0.25)" }} />
              <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
                $0 · empty
              </span>
            </div>

            {/* headroom catch line */}
            <motion.div
              className="absolute left-0 right-0"
              style={{ top: LINE_Y }}
              initial={reduce ? { opacity: 1 } : { opacity: 0, scaleX: 0 }}
              animate={inView ? { opacity: 1, scaleX: 1 } : {}}
              transition={{ duration: 0.9, ease: EASE }}
            >
              <div className="relative h-[3px] mx-5" style={{ backgroundColor: C.accent, boxShadow: `0 0 16px ${C.accent}, 0 0 40px rgba(14,158,107,0.5)`, borderRadius: 3 }}>
                {/* shimmer */}
                {!reduce && (
                  <motion.div
                    className="absolute top-0 h-full w-16 rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)" }}
                    animate={{ x: ["-64px", "640px"] }}
                    transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8 }}
                  />
                )}
              </div>
              {/* headroom label + gap bracket */}
              <div className="absolute right-5 flex flex-col items-end" style={{ top: 10 }}>
                <span className="text-[11px] font-semibold" style={{ color: C.accent, fontFamily: "DM Sans, sans-serif" }}>
                  ↑ headroom
                </span>
                <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: "#FFFFFF", letterSpacing: "-0.03em" }}>$1,730</span>
              </div>
            </motion.div>

            {/* coins */}
            {coins.map((coin, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{ left: coin.x, top: 0 }}
                initial={{ y: -30, opacity: 0 }}
                animate={
                  reduce
                    ? { y: LINE_Y - 20, opacity: 1 }
                    : inView
                    ? { y: [-30, LINE_Y - 14, LINE_Y - 20, LINE_Y - 20], opacity: [0, 1, 1, 0] }
                    : {}
                }
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 3.4, times: [0, 0.5, 0.62, 1], repeat: Infinity, delay: coin.delay, ease: "easeIn" }
                }
              >
                <Coin kind={coin.kind} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Coin({ kind }: { kind: string }) {
  const gold = kind === "gold";
  return (
    <div
      className="rounded-full flex items-center justify-center"
      style={{
        width: 26,
        height: 26,
        background: gold
          ? "radial-gradient(circle at 35% 30%, #FDE68A, #FBBF24 60%, #D97706)"
          : "radial-gradient(circle at 35% 30%, #6EE7B7, #0E9E6B 60%, #0A7A52)",
        boxShadow: gold ? "0 4px 12px rgba(251,191,36,0.4)" : "0 4px 12px rgba(14,158,107,0.4)",
        border: gold ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.3)",
      }}
    >
      <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 12, color: gold ? "#92400E" : "#053D2A" }}>$</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  ONBOARDING FLOW — the promise in three taps               */
/* ══════════════════════════════════════════════════════════ */
function OnboardingFlow() {
  const screens = [
    { src: SHOT.onboardClarity, label: "Clarity", caption: "See what's actually yours", alt: "Onboarding — Clarity: see what's actually yours" },
    { src: SHOT.onboardConfidence, label: "Confidence", caption: "Never get caught short", alt: "Onboarding — Confidence: never get caught short" },
    { src: SHOT.onboardAlerts, label: "Heads-up", caption: "Only pinged before you dip", alt: "Onboarding — notifications: a heads-up before you dip" },
  ];
  return (
    <section className="relative py-20 sm:py-28" style={{ backgroundColor: C.bg }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-10 h-px" style={{ backgroundColor: C.hairline }} />
            <span className="text-[11px] uppercase tracking-[0.22em]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
              The first 30 seconds
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <Display size="clamp(26px, 3.6vw, 44px)" className="max-w-[20ch]">
            Onboarding states the promise — <span style={{ color: C.accent }}>in three taps.</span>
          </Display>
        </Reveal>

        <div className="mt-12 flex flex-wrap items-start justify-center gap-7 sm:gap-10">
          {screens.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <Phone src={s.src} alt={s.alt} label={s.label} tilt={i === 0 ? -2 : i === 2 ? 2 : 0} width={206} />
              <div className="text-center">
                <span className="text-[14px] font-semibold block" style={{ color: C.ink, fontFamily: "DM Sans, sans-serif" }}>{s.label}</span>
                <span className="text-[11.5px]" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif" }}>{s.caption}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  §1 — PROBLEM                                              */
/* ══════════════════════════════════════════════════════════ */
function ProblemSection() {
  return (
    <div id="problem">
      <SectionShell num="01" label="The problem worth solving" bg={C.surface}>
        <Reveal>
          <Display size="clamp(28px, 4vw, 50px)" className="max-w-[18ch]">
            70% of people who start a budget quit within two months — not because they're bad with money, but because the apps turn it into a{" "}
            <span style={{ color: C.accent }}>part-time job.</span>
          </Display>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-12 items-center">
          <Reveal delay={0.1}>
            <div className="space-y-5">
              <Body>
                Your bank balance lies. It shows a number that feels spendable, so you spend it — then rent and bills land and you're short.
              </Body>
              <Body>
                The real problem isn't math, it's <span style={{ color: C.ink, fontWeight: 600 }}>timing</span>: money vanishing between payday and the end of the month. People don't need another ledger of the past. They need to know what's safe to spend before the next paycheck.
              </Body>
            </div>
          </Reveal>

          <Reveal delay={0.18}>
            <EquationDiagram />
          </Reveal>
        </div>
      </SectionShell>
    </div>
  );
}

function EquationDiagram() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const rows = [
    { label: "Balance", val: "$2,500", color: C.ink, sub: "what the bank shows" },
    { label: "− Bills coming", val: "$770", color: C.clay, sub: "before next payday" },
  ];
  return (
    <div ref={ref} className="rounded-3xl p-7 sm:p-9" style={{ backgroundColor: C.bg, border: `1px solid ${C.hairline}` }}>
      {rows.map((r, i) => (
        <motion.div
          key={r.label}
          className="flex items-end justify-between py-4"
          style={{ borderBottom: i === rows.length - 1 ? "none" : `1px solid ${C.hairline}` }}
          initial={{ opacity: 0, x: -12 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 + i * 0.15, ease: EASE }}
        >
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold" style={{ color: C.ink, fontFamily: "DM Sans, sans-serif" }}>{r.label}</span>
            <span className="text-[11px]" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif" }}>{r.sub}</span>
          </div>
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 26, color: r.color, fontVariantNumeric: "tabular-nums" }}>{r.val}</span>
        </motion.div>
      ))}

      <motion.div
        className="mt-3 pt-5 flex items-end justify-between"
        style={{ borderTop: `2px solid ${C.ink}` }}
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
      >
        <div className="flex flex-col">
          <span className="text-[12px] uppercase tracking-[0.14em]" style={{ color: C.accentDeep, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>
            Safe to spend
          </span>
          <span className="text-[11px]" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif" }}>≈ $87/day · 20 days</span>
        </div>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 40, color: C.accent, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>$1,730</span>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  §2 — WEDGE / COMPETITORS                                  */
/* ══════════════════════════════════════════════════════════ */
const RIVALS = [
  { name: "YNAB", tag: "Heavy", note: "Powerful — categories, rules, upkeep." },
  { name: "Monarch", tag: "Heavy", note: "Beautiful dashboards, bank-linking." },
  { name: "Copilot", tag: "Heavy", note: "Slick tracking of the past." },
  { name: "Mint", tag: "Gone", note: "Shut down. Millions left stranded." },
];
const CAPABILITIES = [
  { label: 'Answers "can I spend this?"', rivals: [false, false, false, false] },
  { label: "No categories to manage", rivals: [false, false, false, false] },
  { label: "No bank login required", rivals: [false, false, false, false] },
  { label: "Private & fully on-device", rivals: [false, false, false, false] },
  { label: "Zero ongoing upkeep", rivals: [false, false, false, false] },
];

function WedgeSection() {
  return (
    <SectionShell num="02" label="Why another money app?">
      <Reveal>
        <Display className="max-w-[20ch]">
          Every budgeting app optimizes the same thing — tracking the past.{" "}
          <span style={{ color: C.accent }}>None answer the forward question simply.</span>
        </Display>
      </Reveal>

      {/* Comparison matrix */}
      <Reveal delay={0.1}>
        <div className="mt-12 -mx-5 sm:mx-0 px-5 sm:px-0 overflow-x-auto">
          <div
            className="rounded-3xl overflow-hidden"
            style={{ minWidth: 680, border: `1px solid ${C.hairline}`, backgroundColor: C.surface }}
          >
            {/* Header row */}
            <div className="grid" style={{ gridTemplateColumns: "minmax(180px,1.6fr) repeat(4, 1fr) 1.15fr" }}>
              <div className="p-4" />
              {RIVALS.map((r) => (
                <div key={r.name} className="p-4 text-center" style={{ borderLeft: `1px solid ${C.hairline}` }}>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: C.ink }}>{r.name}</div>
                  <span
                    className="inline-block mt-1.5 text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
                    style={{
                      color: r.tag === "Gone" ? C.clay : C.inkFaint,
                      backgroundColor: r.tag === "Gone" ? "rgba(181,83,46,0.08)" : C.bg,
                      border: `1px solid ${r.tag === "Gone" ? "rgba(181,83,46,0.22)" : C.hairline}`,
                      fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                    }}
                  >
                    {r.tag}
                  </span>
                </div>
              ))}
              {/* Headroom column header — highlighted */}
              <div className="p-4 text-center relative" style={{ backgroundColor: C.accent }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 16, color: "#FFFFFF" }}>Headroom</div>
                <span className="inline-block mt-1.5 text-[9px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full" style={{ color: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.18)", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
                  The wedge
                </span>
              </div>
            </div>

            {/* Capability rows */}
            {CAPABILITIES.map((cap, ri) => (
              <div
                key={cap.label}
                className="grid items-center"
                style={{ gridTemplateColumns: "minmax(180px,1.6fr) repeat(4, 1fr) 1.15fr", borderTop: `1px solid ${C.hairline}` }}
              >
                <div className="p-4 text-[13.5px] font-medium" style={{ color: C.ink, fontFamily: "DM Sans, sans-serif" }}>
                  {cap.label}
                </div>
                {cap.rivals.map((has, ci) => (
                  <div key={ci} className="p-4 flex items-center justify-center" style={{ borderLeft: `1px solid ${C.hairline}` }}>
                    {has ? <Tick on /> : <Cross />}
                  </div>
                ))}
                <div className="p-4 flex items-center justify-center h-full" style={{ backgroundColor: ri % 2 === 0 ? "rgba(14,158,107,0.10)" : "rgba(14,158,107,0.06)" }}>
                  <Tick on />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Wedge callout */}
      <Reveal delay={0.1}>
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center rounded-3xl p-8 sm:p-10" style={{ backgroundColor: C.accentSoft }}>
          <div className="lg:col-span-8">
            <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.accentDeep, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>
              The wedge
            </span>
            <p className="mt-4" style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(20px, 2.6vw, 32px)", lineHeight: 1.22, letterSpacing: "-0.02em", color: C.ink, maxWidth: "24ch" }}>
              The opportunity wasn't more features — it was <span style={{ color: C.accent }}>radical restraint.</span>
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap gap-2">
            {["One number", "No categories", "No bank login", "On-device"].map((chip) => (
              <span key={chip} className="text-[12px] font-medium px-3 py-1.5 rounded-full" style={{ color: C.accentDeep, backgroundColor: C.surface, border: `1px solid ${C.accent}33`, fontFamily: "DM Sans, sans-serif" }}>
                {chip}
              </span>
            ))}
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}

function Tick({ on }: { on?: boolean }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full"
      style={{ width: 24, height: 24, backgroundColor: on ? C.accent : C.accentSoft }}
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={on ? "#FFFFFF" : C.accent} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12l5 5L20 6" />
      </svg>
    </span>
  );
}
function Cross() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C9CFCB" strokeWidth="2.6" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  §3 — WHAT I DESIGNED                                      */
/* ══════════════════════════════════════════════════════════ */
const PILLARS: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "Answers the real question in 5 seconds",
    body: "Open the app, see one number. No setup ritual to get value.",
    icon: <IconClock />,
  },
  {
    title: "No chore — enter bills once",
    body: "Set your money once. It does the forward math for you, every day.",
    icon: <IconRepeat />,
  },
  {
    title: "Private & on-device",
    body: "No accounts, no bank login. Your data never leaves your phone.",
    icon: <IconShield />,
  },
  {
    title: "Calm, never shaming",
    body: "No streaks, no red alarms, no guilt. Just a heads-up before you dip.",
    icon: <IconLeaf />,
  },
];

function DesignedSection() {
  return (
    <SectionShell num="03" label="What I designed" bg={C.surface}>
      <Reveal>
        <Display className="max-w-[20ch]">
          One screen that answers the question. Two more that{" "}
          <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 500, color: C.accent }}>stay out of the way.</span>
        </Display>
      </Reveal>

      {/* Phone tour */}
      <div className="mt-14 flex flex-wrap items-start justify-center gap-7 sm:gap-9">
        {[
          { src: SHOT.todayHealthy, label: "Today", caption: "the number + what's coming", alt: "Today — the safe-to-spend number and what's coming", tilt: -2 },
          { src: SHOT.plan, label: "Plan", caption: "edit your money, no graphs", alt: "Plan — edit your money, no graphs", tilt: 0 },
          { src: SHOT.menu, label: "Menu", caption: "patterns, alerts, your data", alt: "Menu — spending patterns and your data", tilt: 0 },
          { src: SHOT.add, label: "Add", caption: "log a spend in seconds", alt: "Add sheet — log a spend, bill, or income", tilt: 2 },
        ].map((p) => (
          <div key={p.label} className="flex flex-col items-center gap-3">
            <Phone src={p.src} alt={p.alt} label={p.label} tilt={p.tilt} width={210} />
            <div className="text-center">
              <span className="text-[14px] font-semibold block" style={{ color: C.ink, fontFamily: "DM Sans, sans-serif" }}>{p.label}</span>
              <span className="text-[11.5px]" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif" }}>{p.caption}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Benefit pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-16">
        {PILLARS.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.08}>
            <div className="flex gap-4 p-6 rounded-2xl h-full" style={{ backgroundColor: C.bg, border: `1px solid ${C.hairline}` }}>
              <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.accentSoft, color: C.accentDeep }}>
                {p.icon}
              </div>
              <div>
                <h3 className="text-[15.5px] font-bold mb-1" style={{ color: C.ink, fontFamily: "Syne, sans-serif", letterSpacing: "-0.01em" }}>{p.title}</h3>
                <p className="text-[13.5px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>{p.body}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ── custom line icons (single weight) ── */
function IconClock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
    </svg>
  );
}
function IconRepeat() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l3 3-3 3" /><path d="M3 11V9a4 4 0 0 1 4-4h13" /><path d="M7 22l-3-3 3-3" /><path d="M21 13v2a4 4 0 0 1-4 4H4" />
    </svg>
  );
}
function IconShield() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function IconLeaf() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 9-4 13-9 13z" /><path d="M8 17c2-4 5-6 9-7" />
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  §4 — SIX REDESIGNS                                        */
/* ══════════════════════════════════════════════════════════ */
const ITERATIONS = [
  { n: "01", title: "Glassmorphic neon", lesson: "Premium isn't decoration. Restraint reads as expensive.", swatch: "glass" },
  { n: "02", title: "Candy-purple mesh + 3D orbs", lesson: "The default \"AI app\" purple looked unserious. Commit to one meaningful accent.", swatch: "purple" },
  { n: "03", title: "Quiet-capital ink + jade", lesson: "Colour discipline: one accent + exactly two state colours.", swatch: "ink" },
  { n: "04", title: "Forecast graphs everywhere", lesson: "If users can't read it, cut it. Removed every chart except one simple view.", swatch: "charts" },
  { n: "05", title: "Felt like a website", lesson: "Native feel is structure, not skin: mobile shell, tab bar, sheets, gestures.", swatch: "web" },
  { n: "06", title: "White + emerald, locked", lesson: "The last 20% — what you remove and make robust — is the design.", swatch: "final" },
];

function IterationsSection() {
  return (
    <SectionShell num="04" label="The part most case studies hide">
      <Reveal>
        <Display className="max-w-[20ch]">
          I redesigned it{" "}
          <span style={{ color: C.accent }}>six times.</span>
        </Display>
      </Reveal>
      <Reveal delay={0.08}>
        <Body className="mt-5">Getting to "simple" took six rebuilds. Each one taught me what to remove.</Body>
      </Reveal>

      {/* horizontal scroll-snap timeline */}
      <div className="mt-12 -mx-5 sm:-mx-8 px-5 sm:px-8">
        <div
          className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin" }}
        >
          {ITERATIONS.map((it, i) => (
            <motion.div
              key={it.n}
              className="snap-start flex-shrink-0"
              style={{ width: 260 }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: EASE }}
            >
              <div className="rounded-2xl overflow-hidden h-full" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}>
                <IterationVisual kind={it.swatch} isFinal={it.swatch === "final"} />
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[12px]" style={{ color: it.swatch === "final" ? C.accent : C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>{it.n}</span>
                    <span className="text-[14px] font-bold" style={{ color: C.ink, fontFamily: "Syne, sans-serif", letterSpacing: "-0.01em" }}>{it.title}</span>
                  </div>
                  <p className="text-[13px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>
                    <span style={{ color: C.accentDeep, fontWeight: 600 }}>→ </span>{it.lesson}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-[11px] mt-1" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
          ← scroll the rebuilds →
        </p>
      </div>
    </SectionShell>
  );
}

/* Stylized recreations of each rejected direction */
function IterationVisual({ kind, isFinal }: { kind: string; isFinal: boolean }) {
  const base = "relative w-full overflow-hidden flex items-center justify-center";
  const h = { height: 150 };

  if (kind === "glass") {
    return (
      <div className={base} style={{ ...h, background: "radial-gradient(circle at 30% 30%, #0c2a24, #050c0a)" }}>
        <div className="absolute w-20 h-20 rounded-full" style={{ background: "radial-gradient(circle, rgba(52,255,200,0.5), transparent 70%)", filter: "blur(8px)", top: 20, left: 30 }} />
        <div className="absolute w-16 h-16 rounded-full" style={{ background: "radial-gradient(circle, rgba(52,255,200,0.4), transparent 70%)", filter: "blur(10px)", bottom: 16, right: 36 }} />
        <div className="rounded-2xl px-5 py-3" style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(6px)" }}>
          <span style={{ color: "#5FFFD0", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, textShadow: "0 0 16px #34ffc8" }}>$885</span>
        </div>
        <span className="absolute top-2 right-3 text-[14px]">✦</span>
        <span className="absolute bottom-3 left-4 text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>✦ ✦</span>
      </div>
    );
  }
  if (kind === "purple") {
    return (
      <div className={base} style={{ ...h, background: "linear-gradient(135deg, #4f1d96, #c026d3 60%, #f0abfc)" }}>
        <div className="w-16 h-16 rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #fff, #a855f7 60%, #6d28d9)", boxShadow: "0 8px 24px rgba(168,85,247,0.6)" }} />
        <div className="absolute w-8 h-8 rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #fff, #e879f9)", top: 24, right: 40 }} />
        <span className="absolute bottom-3 text-[11px] font-bold" style={{ color: "#fff", fontFamily: "Syne, sans-serif", textShadow: "0 1px 8px rgba(0,0,0,0.3)" }}>candy gradient</span>
      </div>
    );
  }
  if (kind === "ink") {
    return (
      <div className={base} style={{ ...h, backgroundColor: "#0d1f1a" }}>
        <div className="text-center">
          <span style={{ color: "#34d399", fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 28, letterSpacing: "-0.03em" }}>$885</span>
          <div className="mt-2 flex gap-1.5 justify-center">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#34d399" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ef4444" }} />
          </div>
        </div>
      </div>
    );
  }
  if (kind === "charts") {
    return (
      <div className={base} style={{ ...h, backgroundColor: "#11161A" }}>
        <svg width="180" height="110" viewBox="0 0 180 110">
          {/* messy overlapping broken charts */}
          <polyline points="10,90 40,40 70,70 100,20 130,80 170,30" fill="none" stroke="#ef4444" strokeWidth="2" opacity="0.8" />
          <polyline points="10,60 40,75 70,30 100,85 130,45 170,70" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
          {[20, 50, 80, 110, 140].map((x) => (
            <rect key={x} x={x} y={Math.random() > 0 ? 50 : 40} width="14" height={50} fill="#a855f7" opacity="0.4" />
          ))}
          <line x1="0" y1="100" x2="180" y2="100" stroke="#334155" strokeWidth="1" />
        </svg>
        <span className="absolute top-2 left-3 text-[9px]" style={{ color: "#ef4444", fontFamily: 'ui-monospace, monospace' }}>unreadable</span>
      </div>
    );
  }
  if (kind === "web") {
    return (
      <div className={base} style={{ ...h, backgroundColor: "#F1F0EC" }}>
        {/* centered web layout look */}
        <div className="w-full px-6">
          <div className="mx-auto rounded-md" style={{ width: "70%", height: 12, backgroundColor: "#d4d4d8", marginBottom: 8 }} />
          <div className="mx-auto rounded-md" style={{ width: "50%", height: 8, backgroundColor: "#e4e4e7", marginBottom: 14 }} />
          <div className="mx-auto rounded-lg" style={{ width: "60%", height: 40, backgroundColor: "#fff", border: "1px solid #e4e4e7" }} />
        </div>
        <span className="absolute bottom-2 text-[9px]" style={{ color: "#a1a1aa", fontFamily: 'ui-monospace, monospace' }}>feels like a webpage</span>
      </div>
    );
  }
  // final
  return (
    <div className={base} style={{ ...h, backgroundColor: C.surface }}>
      <div className="text-center">
        <span className="text-[10px] uppercase tracking-[0.14em]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, monospace' }}>Safe to spend</span>
        <div style={{ color: C.ink, fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 34, letterSpacing: "-0.04em", marginTop: 2 }}>$885</div>
        <div className="mt-2 mx-auto h-1.5 w-24 rounded-full overflow-hidden" style={{ backgroundColor: C.accentSoft }}>
          <div className="h-full rounded-full" style={{ width: "62%", backgroundColor: C.accent }} />
        </div>
      </div>
      <span className="absolute top-2 right-3 text-[9px] px-1.5 py-0.5 rounded" style={{ color: C.accentDeep, backgroundColor: C.accentSoft, fontFamily: 'ui-monospace, monospace' }}>shipped</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  CONSTRAINTS AS STRATEGY (sharpener)                       */
/* ══════════════════════════════════════════════════════════ */
function ConstraintsCallout() {
  return (
    <section className="relative py-20 sm:py-28" style={{ backgroundColor: C.ink }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <span className="text-[11px] uppercase tracking-[0.22em]" style={{ color: C.accent, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>
            Constraints as strategy
          </span>
        </Reveal>
        <Reveal delay={0.08}>
          <p
            className="mt-6"
            style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(24px, 3.4vw, 42px)", lineHeight: 1.2, letterSpacing: "-0.025em", color: "#FFFFFF", maxWidth: "24ch" }}
          >
            No bank linking, no backend — <span style={{ color: C.accent }}>on purpose.</span>
          </p>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 text-[16px] sm:text-[18px]" style={{ color: "rgba(255,255,255,0.66)", fontFamily: "DM Sans, sans-serif", lineHeight: 1.65, maxWidth: "58ch" }}>
            It sidesteps money-transmitter licensing, KYC/AML and PCI compliance, makes the app instantly buildable, and turns{" "}
            <span style={{ color: "#FFFFFF", fontWeight: 600 }}>"your data never leaves your device"</span> into a feature instead of a footnote.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  §5 — AI AS PARTNER (collapsible)                          */
/* ══════════════════════════════════════════════════════════ */
const AI_DECISIONS = [
  "Rejected adding a database / backend → chose local-first for privacy and buildability.",
  "Killed the forecast graphs after they tested as confusing.",
  "Overruled the cartoonish neon / 3D and candy-purple directions toward restraint.",
  "Caught a real bug AI introduced — a \"due day\" field that clamped every keystroke, so typing 25 became 31 — and specified the fix.",
  "Repeatedly cut features to protect the one-number simplicity.",
];

function AISection() {
  const [open, setOpen] = useState(false);
  return (
    <SectionShell num="05" label="Designing with AI as a partner" bg={C.surface}>
      <Reveal>
        <Display className="max-w-[22ch]">
          I used AI as a fast, opinionated collaborator —{" "}
          <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 500, color: C.accent }}>but the decisions were mine.</span>
        </Display>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 rounded-2xl p-6 sm:p-8" style={{ backgroundColor: C.bg, border: `1px solid ${C.hairline}` }}>
          <p style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontSize: "clamp(18px, 2.2vw, 24px)", lineHeight: 1.45, color: C.ink, maxWidth: "44ch" }}>
            "AI generated options at speed; the product judgment — what to remove, what to refuse, when it was done — was mine."
          </p>
        </div>
      </Reveal>

      {/* collapsible decisions list */}
      <Reveal delay={0.16}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-8 inline-flex items-center gap-2 text-[13px] font-semibold px-5 py-3 rounded-full transition-colors"
          style={{ color: C.accentDeep, backgroundColor: C.accentSoft, border: `1px solid ${C.accent}33`, fontFamily: "DM Sans, sans-serif" }}
          aria-expanded={open}
        >
          {open ? "Hide" : "Show"} the decisions where I said "no"
          <ArrowDown className="w-4 h-4 transition-transform" style={{ transform: open ? "rotate(180deg)" : "none" }} strokeWidth={2.5} />
        </button>

        <motion.div
          initial={false}
          animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          style={{ overflow: "hidden" }}
        >
          <ul className="mt-6 space-y-3 max-w-[60ch]">
            {AI_DECISIONS.map((d, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: C.accent }} />
                <span className="text-[14.5px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.55 }}>{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[12px]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
            * curated chat snippets to be added here
          </p>
        </motion.div>
      </Reveal>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  §6 — DESIGN SYSTEM                                        */
/* ══════════════════════════════════════════════════════════ */
function SystemSection() {
  return (
    <SectionShell num="06" label="The design system at a glance">
      <Reveal>
        <Display className="max-w-[20ch]">
          A fixed identity so every screen feels like <span style={{ color: C.accent }}>one app.</span>
        </Display>
      </Reveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12">
        {/* Colour */}
        <Reveal delay={0}>
          <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}>
            <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>Colour</span>
            <div className="flex gap-2 mt-4">
              {[
                { c: C.bg, label: "canvas", border: true },
                { c: C.accent, label: "accent" },
                { c: C.amber, label: "tight" },
                { c: C.clay, label: "over" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1.5">
                  <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: s.c, border: s.border ? `1px solid ${C.hairline}` : "none" }} />
                  <span className="text-[9.5px]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, monospace' }}>{s.label}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-[13px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>
              One accent, used with discipline. Plus exactly two state colours.
            </p>
          </div>
        </Reveal>

        {/* Type */}
        <Reveal delay={0.08}>
          <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}>
            <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>Type</span>
            <div className="mt-3">
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 46, color: C.ink, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>$1,730</span>
            </div>
            <p className="mt-3 text-[13px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>
              System / SF Pro. The safe-to-spend number is the hero — big, tabular, unmistakable. A clear hierarchy under it.
            </p>
          </div>
        </Reveal>

        {/* Motion */}
        <Reveal delay={0.16}>
          <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}>
            <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>Motion</span>
            <div className="mt-4 h-12 flex items-center">
              <motion.div
                className="h-2 rounded-full"
                style={{ backgroundColor: C.accent }}
                initial={{ width: 8 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.68, ease: EASE }}
              />
            </div>
            <p className="mt-3 text-[13px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>
              Calm 200–680ms, soft ease-out. Count-up and self-drawing reveals. Reduced-motion fully respected.
            </p>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  WHAT I LEFT OUT (sharpener)                               */
/* ══════════════════════════════════════════════════════════ */
const LEFT_OUT = [
  { item: "Transfers / payments", why: "That's a bank's job — and a licensing nightmare." },
  { item: "Bank linking", why: "The #1 reason people quit budgeting apps." },
  { item: "Spending categories", why: "Tagging every coffee is the chore. Cut." },
  { item: "Multi-account juggling", why: "One honest number can't come from five places." },
  { item: "Social / sharing", why: "Money isn't a leaderboard." },
  { item: "Streaks & shame mechanics", why: "Calm, never shaming. No guilt loops." },
  { item: "Every chart but one", why: "If you can't read it in a glance, it's gone." },
];

function LeftOutSection() {
  return (
    <SectionShell num="" label="A product is defined by its no's" bg={C.surface}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">
        {/* Left — heading + count */}
        <div className="lg:col-span-4">
          <Reveal>
            <Display className="max-w-[12ch]">
              What I deliberately <span style={{ color: C.clay }}>left out.</span>
            </Display>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="mt-7 inline-flex items-baseline gap-2">
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 52, color: C.clay, letterSpacing: "-0.04em" }}>7</span>
              <span className="text-[14px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif" }}>features said no to —<br/>so one could be said yes to.</span>
            </div>
          </Reveal>
        </div>

        {/* Right — the no's, as a struck list with reasons */}
        <div className="lg:col-span-8">
          <div className="rounded-3xl overflow-hidden" style={{ border: `1px solid ${C.hairline}`, backgroundColor: C.bg }}>
            {LEFT_OUT.map((row, i) => (
              <Reveal key={row.item} delay={i * 0.05}>
                <div
                  className="group flex items-center gap-4 px-5 sm:px-7 py-4"
                  style={{ borderTop: i === 0 ? "none" : `1px solid ${C.hairline}` }}
                >
                  {/* cross badge */}
                  <span className="flex-shrink-0 inline-flex items-center justify-center rounded-full" style={{ width: 30, height: 30, backgroundColor: "rgba(181,83,46,0.10)" }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={C.clay} strokeWidth="2.6" strokeLinecap="round">
                      <path d="M6 6l12 12M18 6L6 18" />
                    </svg>
                  </span>
                  {/* name */}
                  <span
                    className="flex-shrink-0 text-[16px] sm:text-[19px]"
                    style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, color: C.inkSoft, letterSpacing: "-0.01em", textDecoration: "line-through", textDecorationColor: `${C.clay}80`, textDecorationThickness: "2px" }}
                  >
                    {row.item}
                  </span>
                  {/* reason — pushed right, fades up on row */}
                  <span className="ml-auto text-right text-[12.5px] sm:text-[13.5px] hidden sm:block" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif", maxWidth: "32ch" }}>
                    {row.why}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  VOICE (sharpener)                                         */
/* ══════════════════════════════════════════════════════════ */
const VOICE = [
  { state: "Healthy", line: "You've got $1,730 to spend before payday.", color: C.accent, when: "now", emoji: "check" },
  { state: "Tight", line: "Getting tight — about $85 until payday. Easy does it.", color: C.amber, when: "9:02", emoji: "wave" },
  { state: "Over", line: "Heads up — you'll be about $40 short. Want to adjust?", color: C.clay, when: "8:15", emoji: "alert" },
  { state: "Payday", line: "New cycle — here's your room.", color: C.accentDeep, when: "Jul 1", emoji: "spark" },
];

function VoiceSection() {
  return (
    <SectionShell num="" label="Tone as a craft artifact" bg={C.bg}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-28">
          <Reveal>
            <Display className="max-w-[14ch]">
              The same number, said <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 500, color: C.accent }}>four ways.</span>
            </Display>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-[15px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.6, maxWidth: "38ch" }}>
              These are the real notification strings. Same forecast, four emotional states — and not one of them shames you.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <div className="mt-6 inline-flex items-center gap-2 px-3.5 py-2 rounded-full" style={{ backgroundColor: C.accentSoft, border: `1px solid ${C.accent}33` }}>
              <IconLeaf />
              <span className="text-[12.5px] font-medium" style={{ color: C.accentDeep, fontFamily: "DM Sans, sans-serif" }}>Calm, never shaming</span>
            </div>
          </Reveal>
        </div>

        {/* Notification stack */}
        <div className="lg:col-span-8 space-y-3.5">
          {VOICE.map((v, i) => (
            <Reveal key={v.state} delay={i * 0.08}>
              <div
                className="flex items-start gap-3.5 rounded-2xl p-4 sm:p-5"
                style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, boxShadow: "0 10px 30px -18px rgba(16,40,30,.18)" }}
              >
                {/* app icon */}
                <div className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${v.color}, ${v.color}cc)` }}>
                  <VoiceGlyph kind={v.emoji} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[13px] font-bold" style={{ color: C.ink, fontFamily: "DM Sans, sans-serif" }}>Headroom</span>
                    <span className="text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded" style={{ color: v.color, backgroundColor: `${v.color}14`, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>{v.state}</span>
                    <span className="ml-auto text-[11px]" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif" }}>{v.when}</span>
                  </div>
                  <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 15.5, lineHeight: 1.45, color: C.inkSoft }}>{v.line}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function VoiceGlyph({ kind }: { kind: string }) {
  const common = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "#FFFFFF", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "check") return <svg {...common}><path d="M5 12l5 5L20 6" /></svg>;
  if (kind === "wave") return <svg {...common}><path d="M3 12c3 0 3-4 6-4s3 8 6 8 3-4 6-4" /></svg>;
  if (kind === "alert") return <svg {...common}><path d="M12 8v5" /><path d="M12 17h.01" /><path d="M10.3 3.6 2.5 18a2 2 0 0 0 1.7 3h15.6a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0z" /></svg>;
  return <svg {...common}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" /></svg>;
}

/* ══════════════════════════════════════════════════════════ */
/*  §7 — OUTCOME                                              */
/* ══════════════════════════════════════════════════════════ */
const OUTCOMES = [
  { tag: "Shipped", icon: "rocket", body: "A working PWA — deployed, installable, fully on-device. Designed and built end-to-end, design → Claude Code." },
  { tag: "What I learned", icon: "bulb", body: "The hardest design work was deciding what to leave out. Simplicity is a series of refusals, not a coat of paint." },
  { tag: "What I'd test next", icon: "flask", body: 'Real users on the core question — and whether the "heads-up before you dip" alert actually changes behaviour.' },
];
const LIGHTHOUSE = [
  { label: "Performance", score: 92 },
  { label: "Best Practices", score: 100 },
  { label: "Accessibility", score: 95 },
];

function OutcomeSection() {
  return (
    <SectionShell num="07" label="Outcome & what's next" bg={C.surface}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
        <div className="lg:col-span-8">
          <Reveal>
            <Display className="max-w-[16ch]">
              A real, installable app — <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 500, color: C.accent }}>not a Figma file.</span>
            </Display>
          </Reveal>
        </div>
        <div className="lg:col-span-4 lg:text-right">
          <Reveal delay={0.1}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: C.accentSoft, border: `1px solid ${C.accent}33` }}>
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: C.accent }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: C.accent }} />
              </span>
              <span className="text-[12px] font-medium" style={{ color: C.accentDeep, fontFamily: "DM Sans, sans-serif" }}>
                Shipped &amp; installable · seeking first users
              </span>
            </span>
          </Reveal>
        </div>
      </div>

      {/* Outcome cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-12">
        {OUTCOMES.map((o, i) => (
          <Reveal key={o.tag} delay={i * 0.08}>
            <div className="h-full rounded-2xl p-6" style={{ backgroundColor: C.bg, border: `1px solid ${C.hairline}` }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: C.accentSoft, color: C.accentDeep }}>
                <OutcomeIcon kind={o.icon} />
              </div>
              <span className="text-[11px] uppercase tracking-[0.16em]" style={{ color: C.accentDeep, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>{o.tag}</span>
              <p className="mt-2.5 text-[14.5px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.6 }}>{o.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Lighthouse + toolstack panel */}
      <Reveal delay={0.15}>
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 rounded-3xl p-7 sm:p-9" style={{ backgroundColor: C.ink }}>
          {/* Lighthouse gauges */}
          <div className="lg:col-span-7">
            <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
              Lighthouse · clean run
            </span>
            <div className="flex flex-wrap gap-8 mt-5">
              {LIGHTHOUSE.map((g, i) => (
                <Gauge key={g.label} label={g.label} score={g.score} delay={i * 0.15} />
              ))}
            </div>
            <p className="mt-5 text-[12px]" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Sans, sans-serif" }}>
              AA contrast · reduced-motion fallbacks · honest numbers, not rounded up.
            </p>
          </div>

          {/* Toolstack */}
          <div className="lg:col-span-5 lg:border-l lg:pl-8" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
            <span className="text-[11px] uppercase tracking-[0.18em]" style={{ color: "rgba(255,255,255,0.5)", fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
              Toolstack
            </span>
            <div className="flex flex-wrap gap-2 mt-5">
              {["Figma", "Claude Code", "Vercel", "React + Vite + TS", "Framer Motion", "IndexedDB", "PWA"].map((t) => (
                <span key={t} className="text-[12px] px-3 py-1.5 rounded-full" style={{ color: "rgba(255,255,255,0.8)", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "DM Sans, sans-serif" }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </SectionShell>
  );
}

function OutcomeIcon({ kind }: { kind: string }) {
  const c = { width: 20, height: 20, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (kind === "rocket") return <svg {...c}><path d="M4.5 16.5c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2 0-2.8a2 2 0 0 0-3 0z" /><path d="M12 15l-3-3a22 22 0 0 1 8-10c2.5 0 5 .5 5 .5s.5 2.5.5 5a22 22 0 0 1-10 8z" /><path d="M9 12H4s.5-3 2-4 5-1 5-1" /><path d="M12 15v5s3-.5 4-2 1-5 1-5" /></svg>;
  if (kind === "bulb") return <svg {...c}><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1h6c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z" /></svg>;
  return <svg {...c}><path d="M9 3h6" /><path d="M10 3v6.5L5 18a2 2 0 0 0 1.7 3h10.6A2 2 0 0 0 19 18l-5-8.5V3" /><path d="M7.5 14h9" /></svg>;
}

function Gauge({ label, score, delay }: { label: string; score: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const R = 26;
  const CIRC = 2 * Math.PI * R;
  const display = useCountUp(score, inView, 1.2);
  const ratio = score / 100;
  return (
    <div ref={ref} className="flex flex-col items-center gap-2.5">
      <div className="relative" style={{ width: 68, height: 68 }}>
        <svg width="68" height="68" viewBox="0 0 68 68">
          <circle cx="34" cy="34" r={R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="5" />
          <motion.circle
            cx="34" cy="34" r={R} fill="none" stroke={C.accent} strokeWidth="5" strokeLinecap="round"
            transform="rotate(-90 34 34)"
            strokeDasharray={CIRC}
            initial={{ strokeDashoffset: reduce ? CIRC * (1 - ratio) : CIRC }}
            animate={inView ? { strokeDashoffset: CIRC * (1 - ratio) } : {}}
            transition={{ duration: 1.2, delay, ease: EASE }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "#FFFFFF", fontVariantNumeric: "tabular-nums" }}>{display}</span>
        </div>
      </div>
      <span className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "DM Sans, sans-serif" }}>{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  FINAL CTA                                                 */
/* ══════════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-36" style={{ backgroundColor: C.bg }}>
      <div className="mx-auto max-w-4xl px-5 sm:px-8 text-center">
        <Reveal>
          <Display size="clamp(30px, 5vw, 58px)" className="mx-auto">
            Don't take my word for it —{" "}
            <span style={{ color: C.accent }}>spend 30 seconds in it.</span>
          </Display>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 flex flex-col items-center gap-4">
            <a
              href={LIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2.5 text-[15px] font-semibold px-9 py-5 rounded-full transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ backgroundColor: C.accent, color: "#FFFFFF", fontFamily: "DM Sans, sans-serif", boxShadow: "0 18px 36px -14px rgba(14,158,107,.65)" }}
            >
              Try the live app
              <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2.5} />
            </a>
            <span className="inline-flex items-center gap-1.5 text-[12.5px]" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif" }}>
              <Plus className="w-3.5 h-3.5" strokeWidth={2.5} />
              Tip: open on your phone and "Add to Home Screen" — it installs like a native app.
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.2}>
          <Link to="/" className="inline-block mt-12 text-[13px] font-medium transition-opacity hover:opacity-70" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif" }}>
            ← Back to work
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
