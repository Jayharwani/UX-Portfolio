import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useInView,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, ArrowUpRight, ArrowDown } from "lucide-react";
import { Footer } from "./Footer";

/* ══════════════════════════════════════════════════════════════════════════
   HEADROOM — case study, 60-second cut.

   This page used to run fifteen sections. The argument was sound but it was
   made repeatedly: "the problem" and "why another money app" both said that
   rivals track the past and nobody answers the forward question, and the
   restraint thesis ("what I left out", "constraints", iteration 04, "what I
   learned") appeared four separate times in four different layouts. Three
   phone showcases ran before the study even started.

   It is six sections now, and the strongest material — six redesigns, told
   honestly — is promoted from a static list at position four into the
   centrepiece: a pinned sequence you scrub through.

   MOTION BUDGET. This site has had three rounds of performance work, so the
   rule here is that everything animates transform and opacity only. No
   animated gradients, no animated mask-image, no animated filters — those
   repaint instead of composite, which is exactly what was making the rest of
   the site heavy. Scroll-linked values come from useScroll/useTransform
   (one scroll listener, no per-frame layout reads), will-change is set on the
   two phones that genuinely move continuously and nowhere else, and every
   effect collapses under prefers-reduced-motion.
   ══════════════════════════════════════════════════════════════════════════ */

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
const DISPLAY = "Syne, sans-serif";
const BODY = "DM Sans, sans-serif";
const MONO = 'ui-monospace, "SF Mono", Menlo, monospace';

const SHOT = {
  todayHealthy: "/headroom/today-healthy.png",
  plan: "/headroom/plan.png",
  menu: "/headroom/menu.png",
  add: "/headroom/add-sheet.png",
  onboardClarity: "/headroom/onboard-clarity.png",
};

/* ══════════════════════════════════════════════════════════════════════════
   Page
   ══════════════════════════════════════════════════════════════════════════ */
export function HeadroomPage() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Headroom — Product Design Case Study";
    const meta = document.querySelector('meta[name="description"]');
    const prevDesc = meta?.getAttribute("content") ?? null;
    if (meta) {
      meta.setAttribute(
        "content",
        "Headroom — a safe-to-spend money app. Self-initiated product design: the wedge, six redesigns, and a live installable PWA."
      );
    }
    return () => {
      document.title = prevTitle;
      if (meta && prevDesc !== null) meta.setAttribute("content", prevDesc);
    };
  }, []);

  return (
    <div style={{ backgroundColor: C.bg, color: C.ink }} className="relative w-full overflow-x-clip">
      <StickyProgress />
      <Nav />
      <main>
        <Hero />
        <ProblemSection />
        <ProductSection />
        <VersionsSection />
        <OutcomeSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Chrome
   ══════════════════════════════════════════════════════════════════════════ */
function StickyProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[9999] origin-left"
      style={{ scaleX, height: 3, background: C.accent }}
    />
  );
}

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
        /* no backdrop-filter: a full-width fixed bar re-blurs on every scroll frame */
        backgroundColor: scrolled ? "rgba(250,251,250,0.96)" : "transparent",
        borderBottom: `1px solid ${scrolled ? C.hairline : "transparent"}`,
        transition: "background-color .3s, border-color .3s",
      }}
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="group inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" style={{ color: C.ink }} strokeWidth={2.5} />
          <span className="text-[14px] font-semibold" style={{ color: C.ink, fontFamily: BODY }}>
            Back to work
          </span>
        </Link>
        <a
          href={LIVE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-semibold px-4 py-2 rounded-full transition-transform hover:scale-[1.03] active:scale-[0.97]"
          style={{ backgroundColor: C.accent, color: "#FFFFFF", fontFamily: BODY }}
        >
          Try the live app
          <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </a>
      </div>
    </header>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Primitives
   ══════════════════════════════════════════════════════════════════════════ */
function Reveal({
  children,
  className,
  delay = 0,
  y = 22,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ num, children }: { num?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-7">
      {num && (
        <span
          className="inline-flex items-center justify-center rounded-full text-[11px] font-bold"
          style={{ width: 26, height: 26, backgroundColor: C.accentSoft, color: C.accentDeep, fontFamily: MONO }}
        >
          {num}
        </span>
      )}
      <span className="text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: C.accentDeep, fontFamily: MONO }}>
        {children}
      </span>
      <span className="h-px flex-1 max-w-[90px]" style={{ backgroundColor: C.hairline }} />
    </div>
  );
}

function Display({
  children,
  size = "clamp(28px, 4.2vw, 52px)",
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
        fontFamily: DISPLAY,
        fontWeight: 700,
        fontSize: size,
        lineHeight: 1.08,
        letterSpacing: "-0.032em",
        color: C.ink,
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
      style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.25vw, 17.5px)", lineHeight: 1.62, color: C.inkSoft }}
    >
      {children}
    </p>
  );
}

/* The phone shell. `depth` drives a real 3D rotation from a scroll-linked
   MotionValue when one is supplied; without it the phone is simply static. */
function PhoneShell({
  src,
  alt,
  width = 260,
  rotateY,
  rotateX,
  y,
  className,
  live = false,
}: {
  src?: string;
  alt: string;
  width?: number;
  rotateY?: MotionValue<number> | number;
  rotateX?: MotionValue<number> | number;
  y?: MotionValue<number> | number;
  className?: string;
  live?: boolean;
  children?: React.ReactNode;
}) {
  const [failed, setFailed] = useState(false);
  const moving = rotateY !== undefined || rotateX !== undefined || y !== undefined;
  return (
    <motion.div
      className={className}
      style={{
        width,
        maxWidth: "100%",
        rotateY,
        rotateX,
        y,
        transformStyle: "preserve-3d",
        ...(moving ? { willChange: "transform" } : null),
      }}
    >
      <div
        className="relative rounded-[2.4rem] p-2"
        style={{
          backgroundColor: "#0C120E",
          boxShadow: "0 40px 80px -30px rgba(16,40,30,.45), 0 0 0 1px rgba(16,40,30,.06)",
        }}
      >
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-20 h-5 rounded-b-2xl" style={{ backgroundColor: "#0C120E" }} />
        <div className="relative overflow-hidden rounded-[1.9rem]" style={{ aspectRatio: "393 / 852", backgroundColor: C.accentSoft }}>
          {src && !failed ? (
            <img
              src={src}
              alt={alt}
              loading="lazy"
              decoding="async"
              onError={() => setFailed(true)}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: C.accentSoft }}>
              <span className="text-[12px] font-semibold" style={{ color: C.accentDeep, fontFamily: BODY }}>
                {alt}
              </span>
            </div>
          )}
        </div>
        {live && (
          <span
            className="absolute -top-2 -right-2 z-20 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9.5px] font-bold uppercase tracking-[0.14em]"
            style={{ backgroundColor: C.accent, color: "#fff", fontFamily: MONO }}
          >
            <span style={{ width: 5, height: 5, borderRadius: 999, backgroundColor: "#fff", display: "inline-block" }} />
            Live
          </span>
        )}
      </div>
    </motion.div>
  );
}

/* Count a number up once, when it first comes into view. */
function useCountUp(target: number, active: boolean, duration = 1500) {
  const [val, setVal] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (!active) return;
    if (reduce) {
      setVal(target);
      return;
    }
    let raf = 0;
    let start = 0;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / duration);
      /* out-expo, same curve as the page easing */
      setVal(Math.round(target * (p === 1 ? 1 : 1 - Math.pow(2, -10 * p))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration, reduce]);
  return val;
}

/* ══════════════════════════════════════════════════════════════════════════
   01 — HERO
   Absorbs the old Hero, HeroPhone and SplashMoment. One claim, one number,
   one phone. The phone is genuinely in 3D and its rotation is tied to scroll.
   ══════════════════════════════════════════════════════════════════════════ */
function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const phoneRotY = useTransform(scrollYProgress, [0, 1], [-19, 6]);
  const phoneRotX = useTransform(scrollYProgress, [0, 1], [7, -3]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -70]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 58]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const inView = useInView(ref, { once: true });
  const amount = useCountUp(1730, inView);

  return (
    <section ref={ref} className="relative pt-32 sm:pt-40 pb-16 sm:pb-24" style={{ perspective: 1400 }}>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: `radial-gradient(at 78% 4%, ${C.accentSoft} 0%, transparent 46%)` }}
      />

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-6 items-center">
        <motion.div className="lg:col-span-7" style={reduce ? undefined : { y: copyY, opacity: fade }}>
          <Reveal>
            <span className="inline-block text-[11px] uppercase tracking-[0.25em] mb-6 font-semibold" style={{ color: C.accentDeep, fontFamily: MONO }}>
              Product design · Self-initiated · Shipped
            </span>
          </Reveal>

          <Reveal delay={0.06}>
            <h1
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                letterSpacing: "-0.038em",
                lineHeight: 0.97,
                color: C.ink,
                fontSize: "clamp(40px, 6.4vw, 78px)",
              }}
            >
              Your bank balance
              <br />
              is <span style={{ color: C.clay }}>lying</span> to you.
            </h1>
          </Reveal>

          <Reveal delay={0.14}>
            <p className="mt-7 max-w-[46ch]" style={{ fontFamily: BODY, fontSize: "clamp(16px, 1.4vw, 19px)", lineHeight: 1.6, color: C.inkSoft }}>
              It shows a number that feels spendable — then rent lands and you're short.{" "}
              <strong style={{ color: C.ink, fontWeight: 600 }}>Headroom</strong> answers the only question that
              matters: what can I actually spend today?
            </p>
          </Reveal>

          {/* the product's whole idea, as a number */}
          <Reveal delay={0.2}>
            <div
              className="mt-9 inline-flex items-baseline gap-3 rounded-2xl px-6 py-4"
              style={{ backgroundColor: C.surface, border: `1px solid ${C.hairline}`, boxShadow: "0 18px 40px -28px rgba(16,40,30,.4)" }}
            >
              <span className="text-[11px] uppercase tracking-[0.16em] font-semibold" style={{ color: C.inkFaint, fontFamily: MONO }}>
                Safe to spend
              </span>
              <span
                style={{
                  fontFamily: DISPLAY,
                  fontWeight: 800,
                  fontSize: "clamp(30px, 3.6vw, 44px)",
                  letterSpacing: "-0.04em",
                  color: C.accent,
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1,
                }}
              >
                ${amount.toLocaleString()}
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.26}>
            <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                ["Role", "Sole designer + builder"],
                ["Scope", "0 → shipped PWA"],
                ["Stack", "Design → Claude Code"],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10.5px] uppercase tracking-[0.15em] font-semibold" style={{ color: C.inkFaint, fontFamily: MONO }}>
                    {k}
                  </div>
                  <div className="text-[14px] font-medium mt-1" style={{ color: C.ink, fontFamily: BODY }}>
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </motion.div>

        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <PhoneShell
            src={SHOT.todayHealthy}
            alt="Headroom — today"
            width={278}
            live
            rotateY={reduce ? undefined : phoneRotY}
            rotateX={reduce ? undefined : phoneRotX}
            y={reduce ? undefined : phoneY}
          />
        </div>
      </div>

      <Reveal delay={0.4} className="relative mx-auto max-w-6xl px-5 sm:px-8 mt-16">
        <span className="inline-flex items-center gap-2 text-[12px]" style={{ color: C.inkFaint, fontFamily: MONO }}>
          <ArrowDown className="w-3.5 h-3.5" strokeWidth={2.5} />
          60-second read
        </span>
      </Reveal>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   02 — THE PROBLEM
   The old page argued this twice: once as prose ("the problem worth solving")
   and again as a comparison table ("why another money app"). Same claim, two
   layouts. Merged into one: the stat, the maths, and the gap — where the
   competitive point is a single line rather than a five-row matrix.
   ══════════════════════════════════════════════════════════════════════════ */
const EQUATION = [
  { label: "Bank balance", val: 2500, note: "what the app shows you", tone: C.ink },
  { label: "Bills before payday", val: -770, note: "rent, phone, subscriptions", tone: C.clay },
];

function ProblemSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-90px" });
  const safe = useCountUp(1730, inView, 1200);

  return (
    <section className="relative py-24 sm:py-32" style={{ backgroundColor: C.surface }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow num="01">The problem</Eyebrow>
        </Reveal>

        <Reveal delay={0.05}>
          <Display className="max-w-[19ch]" size="clamp(30px, 4.6vw, 58px)">
            70% quit budgeting within two months. Not bad with money —{" "}
            <span style={{ color: C.accent }}>badly served by software.</span>
          </Display>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-14 items-center">
          <Reveal delay={0.1}>
            <div className="space-y-5">
              <Body>
                The problem was never arithmetic. It's <strong style={{ color: C.ink, fontWeight: 600 }}>timing</strong> —
                money disappearing between payday and the end of the month.
              </Body>
              <Body>
                Every rival optimises the same thing: a beautiful ledger of the past. YNAB, Monarch and Copilot all
                ask for categories, rules and upkeep first. Mint simply shut down.{" "}
                <strong style={{ color: C.ink, fontWeight: 600 }}>
                  None of them lead with a single forward number.
                </strong>
              </Body>
              <div className="flex flex-wrap gap-2 pt-2">
                {["Categories to maintain", "Bank linking required", "Backward-looking"].map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] font-medium"
                    style={{ backgroundColor: C.bg, border: `1px solid ${C.hairline}`, color: C.inkSoft, fontFamily: BODY }}
                  >
                    <span style={{ color: C.clay, fontWeight: 700 }}>✕</span>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          {/* the maths, as the product states it */}
          <Reveal delay={0.16}>
            <div
              ref={ref}
              className="rounded-3xl p-7 sm:p-9"
              style={{ backgroundColor: C.bg, border: `1px solid ${C.hairline}` }}
            >
              {EQUATION.map((row, i) => (
                <motion.div
                  key={row.label}
                  className="flex items-baseline justify-between py-4"
                  style={{ borderBottom: `1px solid ${C.hairline}` }}
                  initial={{ opacity: 0, x: -14 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: 0.1 + i * 0.12, ease: EASE }}
                >
                  <div>
                    <div className="text-[14px] font-semibold" style={{ color: C.ink, fontFamily: BODY }}>
                      {row.label}
                    </div>
                    <div className="text-[11.5px] mt-0.5" style={{ color: C.inkFaint, fontFamily: BODY }}>
                      {row.note}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: DISPLAY,
                      fontWeight: 700,
                      fontSize: 24,
                      color: row.tone,
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {row.val < 0 ? "−" : ""}${Math.abs(row.val).toLocaleString()}
                  </div>
                </motion.div>
              ))}

              <motion.div
                className="flex items-baseline justify-between pt-6"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.42, ease: EASE }}
              >
                <div>
                  <div className="text-[14px] font-bold" style={{ color: C.accentDeep, fontFamily: BODY }}>
                    Actually yours
                  </div>
                  <div className="text-[11.5px] mt-0.5" style={{ color: C.inkFaint, fontFamily: BODY }}>
                    the only number Headroom shows
                  </div>
                </div>
                <div
                  style={{
                    fontFamily: DISPLAY,
                    fontWeight: 800,
                    fontSize: 40,
                    color: C.accent,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.04em",
                    lineHeight: 1,
                  }}
                >
                  ${safe.toLocaleString()}
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   03 — WHAT IT DOES
   Was three sections (what I designed / onboarding / design system). The
   pillars are now captions under the actual product rather than a prose grid,
   because a screen argues the point faster than a paragraph about the screen.
   ══════════════════════════════════════════════════════════════════════════ */
const SCREENS = [
  { src: SHOT.todayHealthy, title: "One number", body: "Open it, see what's safe. No setup ritual before you get value." },
  { src: SHOT.plan, title: "Enter bills once", body: "Set your money once; it does the forward maths every day after." },
  { src: SHOT.add, title: "Never shaming", body: "No streaks, no red alarms — just a heads-up before you dip." },
];

function ProductSection() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  /* a shallow shared parallax so the row reads as one object with depth */
  const lift = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section className="relative py-24 sm:py-32" style={{ backgroundColor: C.bg }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow num="02">What it does</Eyebrow>
        </Reveal>
        <Reveal delay={0.05}>
          <Display className="max-w-[22ch]" size="clamp(28px, 4.2vw, 52px)">
            Three screens. <span style={{ color: C.accent }}>No categories, no bank login, no chore.</span>
          </Display>
        </Reveal>

        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 mt-16" style={{ perspective: 1600 }}>
          {SCREENS.map((s, i) => (
            <motion.div
              key={s.title}
              className="flex flex-col items-center text-center"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 40, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={{ duration: 0.85, delay: i * 0.11, ease: EASE }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div style={reduce ? undefined : { y: lift, rotateY: i === 0 ? 8 : i === 2 ? -8 : 0 }}>
                <PhoneShell src={s.src} alt={s.title} width={228} />
              </motion.div>
              <h3 className="mt-8 text-[19px] font-bold" style={{ fontFamily: DISPLAY, color: C.ink, letterSpacing: "-0.02em" }}>
                {s.title}
              </h3>
              <p className="mt-2 max-w-[30ch] text-[14.5px]" style={{ fontFamily: BODY, lineHeight: 1.55, color: C.inkSoft }}>
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-16 flex flex-wrap justify-center gap-3">
          {["Fully on-device", "No accounts", "Installable PWA", "Works offline"].map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium"
              style={{ backgroundColor: C.accentSoft, color: C.accentDeep, fontFamily: BODY }}
            >
              <span style={{ fontWeight: 800 }}>✓</span>
              {t}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   04 — SIX VERSIONS  (the centrepiece)

   This is the honest part, and on the old page it was a static list sitting at
   position four, competing with three other sections that made the same
   "restraint" point. It is now the spine of the study: the phone pins, and the
   design inside it changes as you scrub. Each version is drawn in CSS rather
   than screenshotted, which is the honest representation anyway — these are
   directions that were killed, not shipped screens.
   ══════════════════════════════════════════════════════════════════════════ */
const VERSIONS = [
  {
    n: "01",
    title: "Glassmorphic neon",
    lesson: "Premium isn't decoration. Restraint reads as expensive.",
    kind: "glass",
  },
  {
    n: "02",
    title: "Candy-purple mesh",
    lesson: 'The default "AI app" purple looked unserious. Commit to one meaningful accent.',
    kind: "purple",
  },
  {
    n: "03",
    title: "Ink + jade",
    lesson: "Colour discipline: one accent, exactly two state colours.",
    kind: "ink",
  },
  {
    n: "04",
    title: "Forecast graphs everywhere",
    lesson: "If users can't read it, cut it. Every chart went but one.",
    kind: "charts",
  },
  {
    n: "05",
    title: "Felt like a website",
    lesson: "Native feel is structure, not skin: shell, tab bar, sheets, gestures.",
    kind: "web",
  },
  {
    n: "06",
    title: "White + emerald, locked",
    lesson: "The last 20% — what you remove and harden — is the design.",
    kind: "final",
  },
];

function VersionsSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);
  const rotY = useMotionValue(16);

  /* Progress comes from the section's own rect in a passive scroll listener
     rather than from useScroll(). Two reasons.

     Cost: this is one rect read per scroll event, for a single element — not
     the per-frame reads that were the problem elsewhere on this site. Scroll
     events are already throttled to roughly frame rate and the index only
     commits to state when it actually changes, so React re-renders six times
     across the whole sequence rather than continuously.

     Robustness: it does not depend on motion's internal frame loop. The
     rotation rides the same measurement, so there is still only one read. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let last = -1;
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const travel = r.height - window.innerHeight;
      if (travel <= 0) return;
      const p = Math.max(0, Math.min(1, -r.top / travel));
      const next = Math.max(0, Math.min(VERSIONS.length - 1, Math.floor(p * VERSIONS.length * 0.999)));
      if (next !== last) {
        last = next;
        setIdx(next);
      }
      if (!reduce) rotY.set(16 - p * 32);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce, rotY]);

  const active = VERSIONS[idx];

  return (
    <section ref={ref} className="relative" style={{ backgroundColor: C.ink, height: `${VERSIONS.length * 78}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="mx-auto max-w-6xl w-full px-5 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* left — the count and the lesson */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-[11px] uppercase tracking-[0.24em] font-semibold" style={{ color: C.accent, fontFamily: MONO }}>
                03 — Six versions
              </span>
              <span className="h-px flex-1 max-w-[70px]" style={{ backgroundColor: "rgba(255,255,255,0.16)" }} />
            </div>

            <h2
              className="max-w-[16ch]"
              style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.4vw, 42px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: "#fff" }}
            >
              I threw away five designs to find the sixth.
            </h2>

            {/* the changing part */}
            <div className="mt-6 sm:mt-10" style={{ minHeight: "clamp(126px, 20vh, 168px)" }}>
              <motion.div
                key={active.n}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE }}
              >
                <div className="flex items-baseline gap-4">
                  <span style={{ fontFamily: MONO, fontSize: 13, color: C.accent, fontWeight: 700 }}>{active.n}</span>
                  <span style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(20px, 2.2vw, 27px)", color: "#fff", letterSpacing: "-0.02em" }}>
                    {active.title}
                  </span>
                </div>
                <p
                  className="mt-4 max-w-[40ch]"
                  style={{ fontFamily: BODY, fontSize: "clamp(15px, 1.3vw, 17.5px)", lineHeight: 1.6, color: "rgba(255,255,255,0.72)" }}
                >
                  {active.lesson}
                </p>
              </motion.div>
            </div>

            {/* progress rail */}
            <div className="flex items-center gap-2 mt-10" role="presentation">
              {VERSIONS.map((v, i) => (
                <span
                  key={v.n}
                  style={{
                    height: 3,
                    flex: 1,
                    maxWidth: 46,
                    borderRadius: 999,
                    backgroundColor: i <= idx ? C.accent : "rgba(255,255,255,0.18)",
                    transition: "background-color .35s ease",
                  }}
                />
              ))}
            </div>
          </div>

          {/* right — the pinned phone */}
          <div className="lg:col-span-6 order-1 lg:order-2 flex justify-center" style={{ perspective: 1500 }}>
            <motion.div style={reduce ? undefined : { rotateY: rotY, transformStyle: "preserve-3d", willChange: "transform" }}>
              <div
                className="relative rounded-[2.4rem] p-2"
                style={{ backgroundColor: "#050806", width: "clamp(168px, 44vw, 250px)", boxShadow: "0 50px 90px -30px rgba(0,0,0,.7)" }}
              >
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 w-20 h-5 rounded-b-2xl" style={{ backgroundColor: "#050806" }} />
                <div className="relative overflow-hidden rounded-[1.9rem]" style={{ aspectRatio: "393 / 852" }}>
                  <motion.div
                    key={active.kind}
                    className="absolute inset-0"
                    initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <VersionScreen kind={active.kind} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Each killed direction, drawn rather than screenshotted. Static gradients —
   they never animate, so they cost one paint and then composite. */
function VersionScreen({ kind }: { kind: string }) {
  if (kind === "final") {
    return <img src={SHOT.todayHealthy} alt="Final design" loading="lazy" decoding="async" className="absolute inset-0 w-full h-full object-cover" />;
  }

  const skin: Record<string, { bg: string; card: string; accent: string; text: string }> = {
    glass: { bg: "linear-gradient(160deg,#12203A 0%,#0A1020 100%)", card: "rgba(255,255,255,0.13)", accent: "#3BE8FF", text: "rgba(255,255,255,.9)" },
    purple: { bg: "linear-gradient(160deg,#4B2AA8 0%,#8B36C9 55%,#C348A6 100%)", card: "rgba(255,255,255,0.16)", accent: "#F5D0FF", text: "#fff" },
    ink: { bg: "linear-gradient(180deg,#0F1512 0%,#141C18 100%)", card: "rgba(255,255,255,0.07)", accent: C.accent, text: "rgba(255,255,255,.92)" },
    charts: { bg: "#0E1512", card: "rgba(255,255,255,0.06)", accent: C.accent, text: "rgba(255,255,255,.9)" },
    web: { bg: "#F4F6F5", card: "#FFFFFF", accent: C.accent, text: C.ink },
  };
  const s = skin[kind] ?? skin.ink;

  return (
    <div className="absolute inset-0 p-4 flex flex-col gap-3" style={{ background: s.bg }}>
      {/* status strip */}
      <div className="flex justify-between items-center pt-3 px-1">
        <span style={{ fontFamily: MONO, fontSize: 8, color: s.text, opacity: 0.6 }}>9:41</span>
        <span style={{ width: 26, height: 5, borderRadius: 3, backgroundColor: s.text, opacity: 0.3 }} />
      </div>

      {/* hero number card */}
      <div
        className="rounded-2xl p-4 mt-1"
        style={{ backgroundColor: s.card, border: kind === "web" ? `1px solid ${C.hairline}` : "1px solid rgba(255,255,255,0.12)" }}
      >
        <div style={{ fontFamily: MONO, fontSize: 7.5, letterSpacing: "0.12em", color: s.text, opacity: 0.6, textTransform: "uppercase" }}>
          Safe to spend
        </div>
        <div style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: 30, color: s.accent, letterSpacing: "-0.04em", marginTop: 4 }}>
          $1,730
        </div>
        {kind === "charts" && (
          <div className="flex items-end gap-1 mt-3" style={{ height: 34 }}>
            {[40, 68, 30, 84, 52, 74, 44, 90, 60].map((h, i) => (
              <span key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: s.accent, opacity: 0.55, borderRadius: 2 }} />
            ))}
          </div>
        )}
      </div>

      {/* filler rows */}
      {kind === "charts" ? (
        <div className="rounded-2xl p-3" style={{ backgroundColor: s.card }}>
          <svg viewBox="0 0 120 44" className="w-full" style={{ height: 44 }}>
            <polyline points="0,34 15,26 30,30 45,16 60,22 75,10 90,18 105,8 120,14" fill="none" stroke={s.accent} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      ) : null}

      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="rounded-xl px-3 py-2.5 flex items-center justify-between"
          style={{ backgroundColor: s.card, border: kind === "web" ? `1px solid ${C.hairline}` : "none" }}
        >
          <span style={{ width: `${44 - i * 7}%`, height: 6, borderRadius: 3, backgroundColor: s.text, opacity: 0.34 }} />
          <span style={{ width: 26, height: 6, borderRadius: 3, backgroundColor: s.accent, opacity: 0.7 }} />
        </div>
      ))}

      <div className="flex-1" />

      {/* tab bar — the thing version 05 was missing */}
      {kind === "web" ? (
        <div className="rounded-xl px-3 py-2 text-center" style={{ backgroundColor: "#fff", border: `1px solid ${C.hairline}` }}>
          <span style={{ fontFamily: BODY, fontSize: 8, color: C.inkFaint }}>▸ scrolling web page</span>
        </div>
      ) : (
        <div className="flex justify-around items-center pb-2 pt-1">
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 16, height: 16, borderRadius: 5, backgroundColor: i === 0 ? s.accent : s.text, opacity: i === 0 ? 0.9 : 0.22 }} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   05 — OUTCOME
   ══════════════════════════════════════════════════════════════════════════ */
const LIGHTHOUSE = [
  { label: "Performance", score: 92 },
  { label: "Accessibility", score: 95 },
  { label: "Best practices", score: 100 },
];

function OutcomeSection() {
  return (
    <section className="relative py-24 sm:py-32" style={{ backgroundColor: C.surface }}>
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <Eyebrow num="04">Outcome</Eyebrow>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7">
            <Reveal delay={0.05}>
              <Display className="max-w-[17ch]" size="clamp(28px, 4.2vw, 52px)">
                Shipped, installable, and <span style={{ color: C.accent }}>fully on-device.</span>
              </Display>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-8 space-y-5 max-w-[52ch]">
                <Body>
                  Designed and built end-to-end — design through Claude Code — into a working PWA you can install from
                  the browser. No accounts, no bank linking, no server holding your money data.
                </Body>
                <Body>
                  The hardest work wasn't the interface. It was deciding what to leave out: simplicity is a series of
                  refusals, not a coat of paint.
                </Body>
              </div>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 rounded-2xl p-5" style={{ backgroundColor: C.bg, border: `1px solid ${C.hairline}` }}>
                <div className="text-[10.5px] uppercase tracking-[0.16em] font-semibold mb-2" style={{ color: C.inkFaint, fontFamily: MONO }}>
                  What I'd test next
                </div>
                <Body>
                  Whether the heads-up before you dip actually changes behaviour — the one claim I can't validate
                  without real users.
                </Body>
              </div>
            </Reveal>
          </div>

          <div className="lg:col-span-5 w-full">
            <Reveal delay={0.1}>
              <div className="rounded-3xl p-7" style={{ backgroundColor: C.bg, border: `1px solid ${C.hairline}` }}>
                <div className="text-[10.5px] uppercase tracking-[0.16em] font-semibold mb-6" style={{ color: C.inkFaint, fontFamily: MONO }}>
                  Lighthouse · mobile
                </div>
                <div className="space-y-6">
                  {LIGHTHOUSE.map((g, i) => (
                    <Gauge key={g.label} label={g.label} score={g.score} delay={i * 0.12} />
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function Gauge({ label, score, delay }: { label: string; score: number; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const val = useCountUp(score, inView, 1100);
  return (
    <div ref={ref}>
      <div className="flex items-baseline justify-between mb-2">
        <span className="text-[13.5px] font-medium" style={{ color: C.ink, fontFamily: BODY }}>
          {label}
        </span>
        <span
          style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 19, color: C.accent, fontVariantNumeric: "tabular-nums" }}
        >
          {val}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 999, backgroundColor: C.hairline, overflow: "hidden" }}>
        <motion.div
          style={{ height: "100%", borderRadius: 999, backgroundColor: C.accent, transformOrigin: "left" }}
          initial={{ scaleX: 0 }}
          animate={inView ? { scaleX: score / 100 } : { scaleX: 0 }}
          transition={{ duration: 1, delay, ease: EASE }}
        />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   06 — CTA
   ══════════════════════════════════════════════════════════════════════════ */
function FinalCTA() {
  return (
    <section className="relative py-24 sm:py-36" style={{ backgroundColor: C.bg }}>
      <div className="mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <Reveal>
          <Display size="clamp(30px, 4.6vw, 56px)">
            It's live. <span style={{ color: C.accent }}>Go and try it.</span>
          </Display>
        </Reveal>
        <Reveal delay={0.08}>
          <Body className="mt-6 mx-auto max-w-[44ch]">
            Open it on your phone and add it to your home screen — it installs like a native app.
          </Body>
        </Reveal>
        <Reveal delay={0.14}>
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-10 px-8 py-4 rounded-full text-[15px] font-semibold transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{ backgroundColor: C.accent, color: "#fff", fontFamily: BODY, boxShadow: "0 20px 40px -18px rgba(14,158,107,.65)" }}
          >
            Open Headroom
            <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
          </a>
        </Reveal>
        <Reveal delay={0.2}>
          <Link
            to="/"
            className="inline-block mt-12 text-[13px] font-medium transition-opacity hover:opacity-70"
            style={{ color: C.inkSoft, fontFamily: BODY }}
          >
            ← Back to work
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
