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

/* Screenshot paths — drop real PNGs in /public/headroom/ to auto-swap */
const SHOT = {
  todayHealthy: "/headroom/today-healthy.png",
  todayTight: "/headroom/today-tight.png",
  plan: "/headroom/plan.png",
  menu: "/headroom/menu.png",
  insights: "/headroom/insights.png",
  add: "/headroom/add-sheet.png",
  splash: "/headroom/splash.png",
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
  const count = useCountUp(885, inView, 1.4);
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
          ≈ $59/day · 15 days to payday
        </span>

        {/* progress */}
        <div className="mt-6 h-2 rounded-full overflow-hidden" style={{ backgroundColor: C.accentSoft }}>
          <motion.div className="h-full rounded-full" style={{ backgroundColor: C.accent }} initial={{ width: 0 }} animate={inView ? { width: "62%" } : {}} transition={{ duration: 1.4, delay: 0.3, ease: EASE }} />
        </div>

        {/* what's coming */}
        <div className="mt-7">
          <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>
            What's coming
          </span>
          {[
            { label: "Rent", val: "$210", days: "in 4 days" },
            { label: "Phone bill", val: "$65", days: "in 9 days" },
            { label: "Subscriptions", val: "$40", days: "in 12 days" },
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
    { label: "Balance", val: "$1,200", color: C.ink, sub: "what the bank shows" },
    { label: "− Bills coming", val: "$315", color: C.clay, sub: "before next payday" },
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
          <span className="text-[11px]" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif" }}>≈ $59/day · 15 days</span>
        </div>
        <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 40, color: C.accent, letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>$885</span>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  §2 — WEDGE / COMPETITORS                                  */
/* ══════════════════════════════════════════════════════════ */
const COMPETITORS = [
  { name: "YNAB", note: "Powerful, but a learning curve. Categories, rules, manual upkeep.", tag: "Heavy" },
  { name: "Monarch", note: "Beautiful dashboards — and bank-linking, setup, maintenance.", tag: "Heavy" },
  { name: "Copilot", note: "Slick tracking of the past. Still asks you to tend it.", tag: "Heavy" },
  { name: "Mint", note: "Shut down — leaving millions who hated re-connecting accounts.", tag: "Gone" },
];

function WedgeSection() {
  return (
    <SectionShell num="02" label="Why another money app?">
      <Reveal>
        <Display className="max-w-[20ch]">
          Every budgeting app optimizes the same thing — tracking the past. None answer the forward question simply.
        </Display>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        {COMPETITORS.map((c, i) => (
          <Reveal key={c.name} delay={i * 0.08}>
            <div className="h-full rounded-2xl p-6 flex flex-col" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}>
              <div className="flex items-center justify-between mb-3">
                <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 19, color: C.ink }}>{c.name}</span>
                <span
                  className="text-[9.5px] uppercase tracking-[0.12em] px-2 py-0.5 rounded-full"
                  style={{
                    color: c.tag === "Gone" ? C.clay : C.inkFaint,
                    backgroundColor: c.tag === "Gone" ? "rgba(181,83,46,0.08)" : C.bg,
                    border: `1px solid ${c.tag === "Gone" ? "rgba(181,83,46,0.2)" : C.hairline}`,
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                  }}
                >
                  {c.tag}
                </span>
              </div>
              <p className="text-[13.5px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.5 }}>{c.note}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 rounded-3xl p-8 sm:p-10" style={{ backgroundColor: C.accentSoft }}>
          <span className="text-[11px] uppercase tracking-[0.2em]" style={{ color: C.accentDeep, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>
            The wedge
          </span>
          <p className="mt-4" style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: "clamp(20px, 2.6vw, 30px)", lineHeight: 1.25, letterSpacing: "-0.02em", color: C.ink, maxWidth: "26ch" }}>
            In a crowded market, the opportunity wasn't more features — it was <span style={{ color: C.accent }}>radical restraint.</span>
          </p>
          <p className="mt-4 text-[14.5px]" style={{ color: C.inkSoft, fontFamily: "DM Sans, sans-serif", lineHeight: 1.6, maxWidth: "50ch" }}>
            One number. No categories. No bank login. On-device. Headroom does the one thing the others bury under dashboards.
          </p>
        </div>
      </Reveal>
    </SectionShell>
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
      <div className="mt-14 flex flex-wrap items-start justify-center gap-8 sm:gap-10">
        {[
          { src: SHOT.todayHealthy, label: "Today", alt: "Today — the safe-to-spend number and what's coming", tilt: -2 },
          { src: SHOT.plan, label: "Plan", alt: "Plan — edit your money, no graphs", tilt: 0 },
          { src: SHOT.menu, label: "Menu", alt: "Menu — spending patterns and your data", tilt: 2 },
        ].map((p) => (
          <div key={p.label} className="flex flex-col items-center gap-4">
            <Phone src={p.src} alt={p.alt} label={p.label} tilt={p.tilt} width={236} />
            <div className="text-center">
              <span className="text-[14px] font-semibold" style={{ color: C.ink, fontFamily: "DM Sans, sans-serif" }}>{p.label}</span>
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
              <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 46, color: C.ink, letterSpacing: "-0.04em", fontVariantNumeric: "tabular-nums" }}>$885</span>
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
  "Transfers / payments",
  "Bank linking",
  "Spending categories",
  "Multi-account",
  "Social features",
  "Streaks / shame mechanics",
  "Every chart but one",
];

function LeftOutSection() {
  return (
    <SectionShell num="" label="A product is defined by its no's" bg={C.surface}>
      <Reveal>
        <Display className="max-w-[18ch]">
          What I deliberately <span style={{ color: C.clay }}>left out.</span>
        </Display>
      </Reveal>
      <div className="flex flex-wrap gap-3 mt-10">
        {LEFT_OUT.map((item, i) => (
          <Reveal key={item} delay={i * 0.05}>
            <span
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-[14px]"
              style={{ color: C.inkSoft, backgroundColor: C.bg, border: `1px solid ${C.hairline}`, fontFamily: "DM Sans, sans-serif", textDecoration: "line-through", textDecorationColor: `${C.clay}99` }}
            >
              {item}
            </span>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  VOICE (sharpener)                                         */
/* ══════════════════════════════════════════════════════════ */
const VOICE = [
  { state: "Healthy", line: "You've got $885 to spend before payday.", color: C.accent },
  { state: "Tight", line: "Getting tight — about $85 until payday. Easy does it.", color: C.amber },
  { state: "Over", line: "Heads up — you'll be about $40 short. Want to adjust?", color: C.clay },
  { state: "Payday", line: "New cycle — here's your room.", color: C.accentDeep },
];

function VoiceSection() {
  return (
    <SectionShell num="" label="Tone as a craft artifact">
      <Reveal>
        <Display className="max-w-[18ch]">
          The same number, said <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 500, color: C.accent }}>four ways.</span>
        </Display>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-10">
        {VOICE.map((v, i) => (
          <Reveal key={v.state} delay={i * 0.08}>
            <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: v.color }} />
                <span className="text-[11px] uppercase tracking-[0.16em] font-semibold" style={{ color: v.color, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>{v.state}</span>
              </div>
              <p style={{ fontFamily: "DM Sans, sans-serif", fontSize: 17, lineHeight: 1.5, color: C.ink }}>{v.line}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <p className="mt-6 text-[13px]" style={{ color: C.inkFaint, fontFamily: "DM Sans, sans-serif", fontStyle: "italic" }}>
          Calm, never shaming — even when you're over.
        </p>
      </Reveal>
    </SectionShell>
  );
}

/* ══════════════════════════════════════════════════════════ */
/*  §7 — OUTCOME                                              */
/* ══════════════════════════════════════════════════════════ */
function OutcomeSection() {
  return (
    <SectionShell num="07" label="Outcome & what's next" bg={C.surface}>
      <Reveal>
        <Display className="max-w-[18ch]">
          A real, installable app — <span style={{ fontFamily: "Playfair Display, serif", fontStyle: "italic", fontWeight: 500, color: C.accent }}>not a Figma file.</span>
        </Display>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        <Reveal delay={0}>
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em]" style={{ color: C.accentDeep, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>Shipped</span>
            <Body className="mt-3">A working PWA — deployed, installable, fully on-device. Designed and built end-to-end, design → Claude Code.</Body>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em]" style={{ color: C.accentDeep, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>What I learned</span>
            <Body className="mt-3">The hardest design work was deciding what to leave out. Simplicity is a series of refusals, not a coat of paint.</Body>
          </div>
        </Reveal>
        <Reveal delay={0.16}>
          <div>
            <span className="text-[11px] uppercase tracking-[0.16em]" style={{ color: C.accentDeep, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', fontWeight: 600 }}>What I'd test next</span>
            <Body className="mt-3">Real users on the core question — and whether the "heads-up before you dip" alert actually changes behaviour.</Body>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.2}>
        <div className="mt-12 flex flex-wrap items-center gap-3">
          <span className="text-[11px] uppercase tracking-[0.16em]" style={{ color: C.inkFaint, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}>Toolstack</span>
          {["Figma", "Claude Code", "Vercel", "React + Vite + TS", "Framer Motion", "IndexedDB", "PWA"].map((t) => (
            <span key={t} className="text-[12.5px] px-3 py-1.5 rounded-full" style={{ color: C.inkSoft, backgroundColor: C.bg, border: `1px solid ${C.hairline}`, fontFamily: "DM Sans, sans-serif" }}>{t}</span>
          ))}
        </div>
      </Reveal>
    </SectionShell>
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
