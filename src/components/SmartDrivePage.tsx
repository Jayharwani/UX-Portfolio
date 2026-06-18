import { motion, useInView, useReducedMotion } from "motion/react";
import { useState, useRef, useEffect, type ReactNode } from "react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Play,
  Sparkles,
  Eye,
  PhoneCall,
  SlidersHorizontal,
  Mail,
  Linkedin,
  Globe,
  ChevronDown,
} from "lucide-react";
import {
  SmartDrivePrototype,
  Hub,
  ThroughScreen,
  LearningScreen,
  DrivingOverlay,
} from "./SmartDrivePrototype";

/* ──────────────────────────────────────────────────────────────────────────
   SmartDrive AI — case study (editorial single page)
   Built to the case-study spec. Voice kept exactly as written.
   Palette grounded in the app's own world: ink + twilight.
   ────────────────────────────────────────────────────────────────────────── */

const T = {
  ink: "#0E1422",
  paper: "#F6F7F9",
  text: "#15171E",
  onInk: "#EDEFF5",
  muted: "#5B6170",
  mutedInk: "#8A92A6",
  twilight: "#4B57EE",
  signal: "#12B981",
  noise: "#F0544F",
  hairline: "#E4E6EB",
  hairlineInk: "#232A3A",
};
const DISPLAY = "'Bricolage Grotesque', sans-serif";
const BODY = "Inter, system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── scroll reveal ───────────────────────────────────────────────────────── */
function Reveal({ children, delay = 0, className, style }: { children: ReactNode; delay?: number; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12% 0px" });
  const reduce = useReducedMotion();
  return (
    <motion.div
      ref={ref}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, onInk }: { children: ReactNode; onInk?: boolean }) {
  return (
    <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: onInk ? T.mutedInk : T.muted }}>
      {children}
    </span>
  );
}

function CountUp({ to, suffix = "", duration = 1.4 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setV(to);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / (duration * 1000), 1);
      const e = 1 - Math.pow(1 - p, 3);
      setV(Math.round(e * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, reduce, duration]);
  return (
    <span ref={ref}>
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}

/* ── lane-line motif (ties back to the app's horizon) ───────────────────── */
function LaneLine({ onInk }: { onInk?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px" });
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className="relative mx-auto max-w-6xl px-6" style={{ height: 1 }}>
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : undefined}
        transition={{ duration: 0.9, ease: EASE }}
        style={{ height: 1, background: onInk ? T.hairlineInk : T.hairline, transformOrigin: "left" }}
      />
      {!reduce && (
        <motion.span
          initial={{ left: "0%", opacity: 0 }}
          animate={inView ? { left: "100%", opacity: [0, 1, 0] } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay: 0.1 }}
          style={{ position: "absolute", top: -1.5, width: 26, height: 3, borderRadius: 999, background: T.twilight, boxShadow: `0 0 12px ${T.twilight}` }}
        />
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HERO — noise → signal (the signature)
   ════════════════════════════════════════════════════════════════════════ */
const NOISE = [
  { app: "Slack", line: "5 new in #general", l: 4, t: 8, r: -7 },
  { app: "Instagram", line: "liked your photo", l: 54, t: 4, r: 6 },
  { app: "Breaking", line: "Markets dip 2%", l: 30, t: 20, r: -4 },
  { app: "ShopNow", line: "50% off — tonight only", l: 60, t: 30, r: 8 },
  { app: "Group chat", line: "😂 you HAVE to see this", l: 2, t: 38, r: 5 },
  { app: "Gmail", line: "Re: Q3 planning", l: 48, t: 50, r: -6 },
  { app: "X", line: "Trending now", l: 16, t: 60, r: 7 },
  { app: "WhatsApp", line: "Weekend plans?", l: 58, t: 64, r: -5 },
  { app: "Calendar", line: "Standup in 10 min", l: 34, t: 78, r: 4 },
  { app: "TikTok", line: "New video for you", l: 6, t: 84, r: -8 },
];

function NoiseToSignal() {
  const reduce = useReducedMotion();
  return (
    <div className="relative w-full" style={{ height: "100%", minHeight: 340 }}>
      {!reduce &&
        NOISE.map((n, i) => (
          <motion.div
            key={n.app}
            className="absolute"
            style={{ left: `${n.l}%`, top: `${n.t}%`, width: 158, rotate: `${n.r}deg` }}
            initial={{ opacity: 0, y: -8, scale: 0.92 }}
            animate={{ opacity: [0, 1, 1, 0], y: [0, 0, 0, 380], scale: [0.92, 1, 1, 0.95] }}
            transition={{ duration: 2.6, times: [0, 0.12, 0.42, 1], ease: "easeIn", delay: 0.1 + i * 0.05 }}
          >
            <NoiseCard app={n.app} line={n.line} />
          </motion.div>
        ))}

      {/* the survivor */}
      <div className="absolute" style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)", width: 230 }}>
        <motion.div
          initial={reduce ? { opacity: 1 } : { opacity: 0, x: 50, y: -70, scale: 0.96 }}
          animate={reduce ? { opacity: 1 } : { opacity: [0, 1, 1], x: [50, 50, 0], y: [-70, -70, 0], scale: [0.96, 1, 1.05] }}
          transition={reduce ? {} : { duration: 2.4, times: [0, 0.32, 1], ease: EASE, delay: 0.2 }}
          style={{
            borderRadius: 20,
            padding: 16,
            background: `linear-gradient(135deg, ${T.twilight}, #6E78F2)`,
            boxShadow: `0 24px 60px -18px rgba(75,87,238,0.7)`,
          }}
        >
          <div className="flex items-center gap-2.5">
            <span style={{ width: 36, height: 36, borderRadius: 999, background: "rgba(255,255,255,0.22)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, fontFamily: BODY }}>M</span>
            <div className="flex-1">
              <p style={{ fontFamily: BODY, fontSize: 15, fontWeight: 600, color: "#fff" }}>Mom</p>
              <p style={{ fontFamily: BODY, fontSize: 12.5, color: "rgba(255,255,255,0.85)" }}>calling again · second time</p>
            </div>
            <span style={{ fontFamily: MONO, fontSize: 11, color: "rgba(255,255,255,0.7)" }}>now</span>
          </div>
          <div className="flex gap-2" style={{ marginTop: 12 }}>
            <span style={{ flex: 1, textAlign: "center", padding: "9px", borderRadius: 11, background: T.signal, color: "#fff", fontSize: 13.5, fontWeight: 600, fontFamily: BODY }}>Answer</span>
            <span style={{ flex: 1, textAlign: "center", padding: "9px", borderRadius: 11, background: "rgba(255,255,255,0.16)", color: "#fff", fontSize: 13.5, fontWeight: 600, fontFamily: BODY }}>Decline</span>
          </div>
        </motion.div>
        {!reduce && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.5 }}
            style={{ textAlign: "center", marginTop: 14, fontFamily: MONO, fontSize: 11.5, letterSpacing: "0.06em", color: T.signal }}
          >
            ONE THING GETS THROUGH
          </motion.p>
        )}
      </div>
    </div>
  );
}

function NoiseCard({ app, line }: { app: string; line: string }) {
  return (
    <div style={{ borderRadius: 14, padding: "10px 12px", background: "rgba(255,255,255,0.055)", border: `1px solid ${T.hairlineInk}`, backdropFilter: "blur(2px)" }}>
      <div className="flex items-center gap-1.5" style={{ marginBottom: 3 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: T.noise, opacity: 0.7 }} />
        <span style={{ fontFamily: MONO, fontSize: 10.5, color: T.mutedInk, letterSpacing: "0.02em" }}>{app}</span>
      </div>
      <p style={{ fontFamily: BODY, fontSize: 12.5, color: "rgba(237,239,245,0.78)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{line}</p>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   PHONE SHELL (reuses the real v2 screens)
   ════════════════════════════════════════════════════════════════════════ */
function PhoneShell({ children, heightClass = "h-[560px]" }: { children: ReactNode; heightClass?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.62);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w && h) setScale(Math.min(w / 390, h / 844));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={`relative mx-auto ${heightClass}`} style={{ aspectRatio: "390 / 844", borderRadius: 42, padding: 6, background: "linear-gradient(160deg, #2A2E38, #0B0D12)", boxShadow: "0 40px 80px -24px rgba(0,0,0,0.55)" }}>
      <div ref={wrapRef} className="relative w-full h-full overflow-hidden" style={{ borderRadius: 37, background: T.paper }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: 390, height: 844, transformOrigin: "top left", transform: `scale(${scale})` }}>
          <div className="absolute left-1/2 -translate-x-1/2 z-40 rounded-full" style={{ top: 13, width: 112, height: 31, background: "#05070B" }} />
          {children}
        </div>
      </div>
    </div>
  );
}

const NOOP = () => {};
function ScreenByKey({ k, reduce }: { k: string; reduce: boolean | null }) {
  if (k === "hub") return <Hub mode="standby" onToggle={NOOP} onOpenDriving={NOOP} push={NOOP} reduce={reduce} />;
  if (k === "through") return <ThroughScreen onBack={NOOP} push={NOOP} reduce={reduce} />;
  if (k === "driving") return <DrivingOverlay open onEnd={NOOP} onClosed={NOOP} reduce={reduce} />;
  if (k === "learning") return <LearningScreen onBack={NOOP} reduce={reduce} />;
  return null;
}

/* ════════════════════════════════════════════════════════════════════════
   DATA
   ════════════════════════════════════════════════════════════════════════ */
const MATRIX_ROWS = [
  {
    k: "How it picks what's urgent",
    ios: 'You hand-pick allowed people; senders type "urgent" to break through',
    android: "Blanket silence or manual rules",
    sd: "Learns your real habits over 48h, then adapts",
  },
  {
    k: "Apps allowed through",
    ios: "People only — you can't allow apps",
    android: "Limited",
    sd: "Navigation, repeat callers, emergencies, learned favorites",
  },
  {
    k: "Setup",
    ios: "Manual lists and toggles",
    android: "Manual",
    sd: "Sets itself up by watching two days of you",
  },
  {
    k: "Does it explain itself?",
    ios: "Apple Intelligence can auto-allow — but you can't see why",
    android: "Opaque",
    sd: 'Shows its reasoning, fully editable: "Mom — you always answer"',
  },
  {
    k: "Real-world adoption",
    ios: "Shipped since iOS 11 · ~1 in 5 turn it on",
    android: "Low",
    sd: "Designed to earn trust so people leave it on",
  },
];

const UNIQUE = [
  { icon: Sparkles, title: "It learns you. You don't configure it.", body: "A 48-hour window watches what you actually answer vs. swipe away. No setup grind — the reason people abandon the existing tools." },
  { icon: Eye, title: "It shows its work.", body: 'Every rule is visible and one tap to change: "Mom — you always answer." Black-box AI is AI you won\'t trust with your kid\'s phone call.' },
  { icon: PhoneCall, title: "Urgency logic, not hacks.", body: 'If it\'s real, people call twice. SmartDrive treats a repeat call as urgent automatically — no "text the word URGENT" gymnastics.' },
  { icon: SlidersHorizontal, title: "A setting, not another app.", body: "It lives in Settings. The existing tools don't fail on features — they fail on adoption. The win is being there by default, not a download you forget." },
];

const DESIGN_STEPS = [
  { screen: "hub", title: "The whole screen tells you what it's doing.", body: "Folded the on/off switch into a living status hero — Standby, Learning, Driving — instead of a dead toggle. The feature should narrate, not just sit there." },
  { screen: "through", title: "The AI argues its case.", body: "Learned rules are shown as plain-language reasoning you can keep or kill. That one pattern is how a trust problem becomes a UI." },
  { screen: "driving", title: "The driving screen breaks the rules on purpose.", body: "Everything else is bright and white; the active driving view goes dark and low-glare — because a white screen is dangerous to glance at behind the wheel. Safety in the pixels, not just the logic." },
  { screen: "learning", title: "I kept it boring where it counts.", body: "No flashy standalone app. It's a settings panel, because the real failure was adoption — and you don't fix adoption by adding a download." },
];

/* ════════════════════════════════════════════════════════════════════════
   PAGE
   ════════════════════════════════════════════════════════════════════════ */
export function SmartDrivePage() {
  const reduce = useReducedMotion();
  const [protoOpen, setProtoOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  /* sticky-phone screen swap (desktop) */
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.step);
            if (!Number.isNaN(idx)) setActiveStep(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    stepRefs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div style={{ background: T.ink, fontFamily: BODY }}>
      {/* minimal back nav */}
      <Link
        to="/"
        className="fixed top-5 left-5 z-50 inline-flex items-center gap-2 rounded-full transition-colors"
        style={{ padding: "8px 14px", background: "rgba(14,20,34,0.6)", backdropFilter: "blur(10px)", border: `1px solid ${T.hairlineInk}`, color: T.onInk, fontSize: 13, fontWeight: 500 }}
      >
        <ArrowLeft size={15} /> Back
      </Link>

      {/* ════ 1 · HERO ════ */}
      <section className="relative min-h-[100svh] flex flex-col overflow-hidden" style={{ background: T.ink }}>
        {/* ambient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(120% 80% at 80% 10%, rgba(75,87,238,0.16), transparent 60%)` }} />
        <div className="absolute inset-0 pointer-events-none opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />

        {/* top bar */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pt-20 sm:pt-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span style={{ width: 9, height: 9, borderRadius: 999, background: T.twilight, boxShadow: `0 0 10px ${T.twilight}` }} />
            <span style={{ fontFamily: BODY, fontWeight: 600, fontSize: 14, color: T.onInk }}>SmartDrive AI</span>
            <span className="hidden sm:inline" style={{ fontFamily: MONO, fontSize: 11.5, color: T.mutedInk }}>· AI distraction filter for drivers</span>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.mutedInk }}>~4 min read</span>
        </div>

        {/* content */}
        <div className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-8 items-center py-10">
          {/* left */}
          <div className="max-w-xl">
            <Reveal>
              <Eyebrow onInk>CONCEPT · PRODUCT DESIGN, END-TO-END · DESIGNED + BUILT WITH AI</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(38px, 6.4vw, 80px)", lineHeight: 0.98, letterSpacing: "-0.03em", color: T.onInk, marginTop: 18 }}>
                Your phone has a "shut up, I'm driving" switch.{" "}
                <span style={{ color: T.mutedInk }}>Almost nobody turns it on.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p style={{ fontFamily: BODY, fontSize: "clamp(16px, 2vw, 19px)", lineHeight: 1.6, color: T.mutedInk, marginTop: 22, maxWidth: 520 }}>
                Because blanket silence is scary — what if it's your kid calling? SmartDrive AI is a distraction filter that learns who actually matters to you, so silencing the rest finally feels safe.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="flex flex-wrap gap-2" style={{ marginTop: 24 }}>
                {["Solo", "0 → 1", "Designed in Figma", "Shipped in Claude Code"].map((c) => (
                  <span key={c} style={{ fontFamily: MONO, fontSize: 12, color: T.onInk, padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: `1px solid ${T.hairlineInk}` }}>
                    {c}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 28 }}>
                <button
                  onClick={() => setProtoOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full transition-transform hover:scale-[1.03] active:scale-[0.98]"
                  style={{ padding: "13px 22px", background: T.twilight, color: "#fff", fontSize: 15, fontWeight: 600, boxShadow: `0 14px 32px -10px rgba(75,87,238,0.6)` }}
                >
                  <Play size={16} fill="#fff" /> Open the live prototype
                </button>
                <a href="#problem" className="inline-flex items-center gap-1.5" style={{ color: T.mutedInk, fontSize: 14, fontWeight: 500 }}>
                  See how <ChevronDown size={15} />
                </a>
              </div>
            </Reveal>
          </div>

          {/* right — noise→signal */}
          <div className="relative w-full" style={{ minHeight: 360, height: "min(58vh, 520px)" }}>
            <NoiseToSignal />
          </div>
        </div>
      </section>

      {/* ════ 2 · THE PROBLEM ════ */}
      <section id="problem" className="relative" style={{ background: T.ink, paddingTop: 0, paddingBottom: 40 }}>
        {/* ink → paper wash */}
        <div className="w-full max-w-6xl mx-auto px-6 pb-20">
          <Reveal>
            <Eyebrow onInk>The problem</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.08, letterSpacing: "-0.02em", color: T.onInk, marginTop: 14, maxWidth: 880 }}>
              Look at a text for five seconds at 55mph and you've driven the length of a football field{" "}
              <span style={{ color: T.noise }}>blind.</span>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-4" style={{ marginTop: 40 }}>
            {[
              { num: <CountUp to={3208} />, label: "people killed in U.S. crashes involving a distracted driver in 2024", src: "NHTSA" },
              { num: <CountUp to={58} suffix="%" />, label: "of trips where drivers touched their phone", src: "Cambridge Mobile Telematics" },
              { num: "~1 in 5", label: "iPhone owners who actually turn on Do Not Disturb While Driving", src: "IIHS" },
            ].map((s, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <div style={{ borderRadius: 18, padding: 22, background: "rgba(255,255,255,0.035)", border: `1px solid ${T.hairlineInk}`, height: "100%" }}>
                  <div style={{ fontFamily: MONO, fontWeight: 700, fontSize: "clamp(34px, 5vw, 46px)", color: i === 2 ? T.mutedInk : T.onInk, letterSpacing: "-0.02em" }}>{s.num}</div>
                  <p style={{ fontFamily: BODY, fontSize: 14.5, lineHeight: 1.5, color: T.mutedInk, marginTop: 10 }}>{s.label}</p>
                  <p style={{ fontFamily: MONO, fontSize: 11, color: "#5A6376", marginTop: 12 }}>{s.src}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div style={{ marginTop: 36, borderLeft: `2px solid ${T.twilight}`, paddingLeft: 20 }}>
              <p style={{ fontFamily: BODY, fontSize: "clamp(17px, 2.2vw, 21px)", lineHeight: 1.55, color: T.onInk, maxWidth: 760 }}>
                The tech to fix this already ships on every phone. The problem isn't the feature. It's that people don't trust it enough to leave it on.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ════ 3 · THE INSIGHT ════ */}
      <section style={{ background: T.paper }}>
        <div className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32">
          <Reveal>
            <Eyebrow>The insight</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: T.text, marginTop: 14, maxWidth: 820 }}>
              Nobody keeps Do Not Disturb on, because "silence everything" includes the one thing you can't miss.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: BODY, fontSize: 18, lineHeight: 1.65, color: T.muted, marginTop: 24, maxWidth: 680 }}>
              I kept coming back to one fear: <em style={{ color: T.text, fontStyle: "italic" }}>what if it's important?</em> That single worry is why people leave notifications screaming the whole drive. So the real design problem was never "how do we block stuff." It was "how do we make silence trustworthy." Solve trust, and people leave it on. Leave it on, and it actually saves lives.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(28px, 4.4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: T.text, marginTop: 48, maxWidth: 760 }}>
              This was never a blocking problem. <span style={{ color: T.twilight }}>It was a trust problem.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ 4 · COMPETITOR TEARDOWN ════ */}
      <section style={{ background: T.ink }}>
        <div className="w-full max-w-6xl mx-auto px-6 py-24 md:py-32">
          <Reveal>
            <Eyebrow onInk>What's already out there</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: T.onInk, marginTop: 14, maxWidth: 820 }}>
              The pieces exist. They're either too blunt or too quiet about what they're doing.
            </h2>
          </Reveal>

          {/* desktop matrix */}
          <div className="hidden md:block" style={{ marginTop: 40 }}>
            <div className="grid items-stretch" style={{ gridTemplateColumns: "1.1fr 1fr 1fr 1.25fr", gap: 1, background: T.hairlineInk, borderRadius: 18, overflow: "hidden", border: `1px solid ${T.hairlineInk}` }}>
              {/* header row */}
              {["", "iOS Driving Focus", "Android Driving Mode", "SmartDrive AI"].map((h, i) => (
                <div key={i} style={{ background: i === 3 ? "rgba(75,87,238,0.16)" : T.ink, padding: "16px 18px" }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: i === 3 ? 700 : 500, letterSpacing: "0.04em", color: i === 3 ? "#A9B0FF" : T.mutedInk, textTransform: i === 0 ? "uppercase" : "none" }}>
                    {i === 0 ? "" : h}
                  </span>
                </div>
              ))}
              {/* rows */}
              {MATRIX_ROWS.map((row, ri) =>
                [row.k, row.ios, row.android, row.sd].map((cell, ci) => (
                  <Reveal key={`${ri}-${ci}`} delay={ri * 0.06}>
                    <div style={{ background: ci === 3 ? "rgba(75,87,238,0.1)" : T.ink, padding: "16px 18px", height: "100%" }}>
                      {ci === 0 ? (
                        <span style={{ fontFamily: MONO, fontSize: 12, color: T.mutedInk, letterSpacing: "0.02em" }}>{cell}</span>
                      ) : (
                        <span style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.5, color: ci === 3 ? T.onInk : T.mutedInk, fontWeight: ci === 3 ? 500 : 400 }}>{cell}</span>
                      )}
                    </div>
                  </Reveal>
                ))
              )}
            </div>
          </div>

          {/* mobile stacked */}
          <div className="md:hidden flex flex-col gap-3" style={{ marginTop: 32 }}>
            {MATRIX_ROWS.map((row, ri) => (
              <Reveal key={ri} delay={ri * 0.05}>
                <div style={{ borderRadius: 16, border: `1px solid ${T.hairlineInk}`, overflow: "hidden" }}>
                  <div style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)" }}>
                    <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.mutedInk, letterSpacing: "0.03em" }}>{row.k}</span>
                  </div>
                  {[
                    { lbl: "iOS", v: row.ios, hot: false },
                    { lbl: "Android", v: row.android, hot: false },
                    { lbl: "SmartDrive", v: row.sd, hot: true },
                  ].map((c, ci) => (
                    <div key={ci} style={{ padding: "12px 16px", borderTop: `1px solid ${T.hairlineInk}`, background: c.hot ? "rgba(75,87,238,0.1)" : "transparent" }}>
                      <span style={{ fontFamily: MONO, fontSize: 10.5, color: c.hot ? "#A9B0FF" : "#5A6376", letterSpacing: "0.04em" }}>{c.lbl}</span>
                      <p style={{ fontFamily: BODY, fontSize: 14, lineHeight: 1.5, color: c.hot ? T.onInk : T.mutedInk, marginTop: 4 }}>{c.v}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p style={{ fontFamily: BODY, fontSize: 15.5, lineHeight: 1.6, color: T.mutedInk, marginTop: 28, maxWidth: 760 }}>
              Apple's newest version does use AI to decide what breaks through. Good — but it's a black box. You can't see what it learned or fix it when it's wrong.{" "}
              <span style={{ color: T.onInk }}>A safety feature you can't trust is a safety feature you turn off.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ 5 · WHAT'S UNIQUE ════ */}
      <section style={{ background: T.paper }}>
        <div className="w-full max-w-6xl mx-auto px-6 py-24 md:py-32">
          <Reveal>
            <Eyebrow>Why this one's different</Eyebrow>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-4" style={{ marginTop: 28 }}>
            {UNIQUE.map((u, i) => {
              const Icon = u.icon;
              return (
                <Reveal key={i} delay={i * 0.07}>
                  <div style={{ borderRadius: 20, padding: 26, background: T.paper, border: `1px solid ${T.hairline}`, height: "100%", boxShadow: "0 1px 3px rgba(21,23,30,0.03)" }}>
                    <span style={{ display: "inline-flex", width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center", background: "rgba(75,87,238,0.1)", color: T.twilight }}>
                      <Icon size={20} strokeWidth={1.9} />
                    </span>
                    <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 21, lineHeight: 1.2, letterSpacing: "-0.01em", color: T.text, marginTop: 18 }}>{u.title}</h3>
                    <p style={{ fontFamily: BODY, fontSize: 15.5, lineHeight: 1.6, color: T.muted, marginTop: 10 }}>{u.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════ 6 · THE DESIGN (sticky phone) ════ */}
      <section style={{ background: T.paper }}>
        <div className="w-full max-w-6xl mx-auto px-6 pt-8 md:pt-12">
          <Reveal>
            <Eyebrow>The design</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(26px, 3.6vw, 44px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: T.text, marginTop: 14, maxWidth: 720 }}>
              Make an algorithm feel safe enough to hand your attention to.
            </h2>
          </Reveal>
        </div>

        {/* desktop: sticky phone + scrolling decisions */}
        <div className="hidden lg:block w-full max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-[1fr_0.85fr] gap-16 items-start">
            <div>
              {DESIGN_STEPS.map((s, i) => (
                <div
                  key={i}
                  ref={(el) => { stepRefs.current[i] = el; }}
                  data-step={i}
                  className="flex flex-col justify-center"
                  style={{ minHeight: "78vh" }}
                >
                  <span style={{ fontFamily: MONO, fontSize: 13, color: T.twilight }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(24px, 2.6vw, 32px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: T.text, marginTop: 12, maxWidth: 460 }}>{s.title}</h3>
                  <p style={{ fontFamily: BODY, fontSize: 17, lineHeight: 1.65, color: T.muted, marginTop: 14, maxWidth: 440 }}>{s.body}</p>
                </div>
              ))}
            </div>
            {/* sticky phone */}
            <div className="sticky self-start" style={{ top: "10vh", height: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PhoneShell heightClass="h-[620px]">
                <ScreenByKey k={DESIGN_STEPS[activeStep].screen} reduce={reduce} />
              </PhoneShell>
            </div>
          </div>
        </div>

        {/* mobile: vertical sequence (phone above caption) */}
        <div className="lg:hidden w-full max-w-md mx-auto px-6 pb-24" style={{ paddingTop: 32 }}>
          {DESIGN_STEPS.map((s, i) => (
            <Reveal key={i} delay={0}>
              <div style={{ marginBottom: 56 }}>
                <PhoneShell heightClass="h-[520px]">
                  <ScreenByKey k={s.screen} reduce={reduce} />
                </PhoneShell>
                <div style={{ marginTop: 22 }}>
                  <span style={{ fontFamily: MONO, fontSize: 12, color: T.twilight }}>{String(i + 1).padStart(2, "0")}</span>
                  <h3 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, lineHeight: 1.18, letterSpacing: "-0.01em", color: T.text, marginTop: 8 }}>{s.title}</h3>
                  <p style={{ fontFamily: BODY, fontSize: 16, lineHeight: 1.6, color: T.muted, marginTop: 10 }}>{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="w-full max-w-6xl mx-auto px-6 pb-24 flex justify-center">
          <button
            onClick={() => setProtoOpen(true)}
            className="inline-flex items-center gap-2 rounded-full transition-transform hover:scale-[1.03] active:scale-[0.98]"
            style={{ padding: "13px 24px", background: T.text, color: "#fff", fontSize: 15, fontWeight: 600 }}
          >
            <Play size={15} fill="#fff" /> Tap through the real thing
          </button>
        </div>
      </section>

      <LaneLine />

      {/* ════ 7 · BUILT WITH AI ════ */}
      <section style={{ background: T.ink }}>
        <div className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32">
          <Reveal>
            <Eyebrow onInk>How I built it</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 800, fontSize: "clamp(32px, 5vw, 60px)", lineHeight: 1.02, letterSpacing: "-0.03em", color: T.onInk, marginTop: 14 }}>
              I didn't mock this up. <span style={{ color: T.twilight }}>I shipped it.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p style={{ fontFamily: BODY, fontSize: 18, lineHeight: 1.65, color: T.mutedInk, marginTop: 24, maxWidth: 680 }}>
              I'm a designer, not an engineer — but I took this from a blank page to a working prototype solo, using AI as my build team. Designed the system, then wrote production React with Claude Code and deployed it live.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-wrap gap-2" style={{ marginTop: 22 }}>
              {["Claude Code", "Figma", "Google Stitch", "Perplexity"].map((t) => (
                <span key={t} style={{ fontFamily: MONO, fontSize: 12, color: T.onInk, padding: "6px 12px", borderRadius: 999, background: "rgba(255,255,255,0.05)", border: `1px solid ${T.hairlineInk}` }}>{t}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.6, color: "#6B7488", marginTop: 24, maxWidth: 600 }}>
              Is it a finished product? No. It's a sharp prototype that proves the concept holds up in your hand, not just on a slide.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <button
              onClick={() => setProtoOpen(true)}
              className="inline-flex items-center gap-2 rounded-full transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ marginTop: 28, padding: "13px 22px", background: T.twilight, color: "#fff", fontSize: 15, fontWeight: 600, boxShadow: `0 14px 32px -10px rgba(75,87,238,0.6)` }}
            >
              <Play size={16} fill="#fff" /> Open the live prototype
            </button>
          </Reveal>
        </div>
      </section>

      {/* ════ 8 · WHAT I'D TEST NEXT ════ */}
      <section style={{ background: T.paper }}>
        <div className="w-full max-w-5xl mx-auto px-6 py-24 md:py-32">
          <Reveal>
            <Eyebrow>What I'd test next</Eyebrow>
          </Reveal>
          <Reveal delay={0.08}>
            <p style={{ fontFamily: BODY, fontSize: "clamp(18px, 2.4vw, 22px)", lineHeight: 1.6, color: T.text, marginTop: 18, maxWidth: 760 }}>
              It's a concept, so I'm not going to wave fake numbers at you. Here's what I'd actually want to know: does 48 hours capture enough to be right more than it's wrong? How often does it let the wrong thing through — or worse, silence the right one? Trust lives or dies on that false-positive rate, so that's the first thing I'd put in front of real drivers.
            </p>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(22px, 3vw, 34px)", lineHeight: 1.15, letterSpacing: "-0.02em", color: T.text, marginTop: 40, maxWidth: 720 }}>
              The hardest part wasn't building the filter. It was designing something people would trust with{" "}
              <span style={{ color: T.twilight }}>the call that matters.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ════ 9 · FOOTER ════ */}
      <section style={{ background: T.ink }}>
        <div className="w-full max-w-5xl mx-auto px-6 py-20">
          <Reveal>
            <h2 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: "clamp(24px, 3.4vw, 38px)", lineHeight: 1.1, letterSpacing: "-0.02em", color: T.onInk, maxWidth: 620 }}>
              Jay Harwani — product designer.{" "}
              <span style={{ color: T.mutedInk }}>I take ideas to working products.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="flex flex-wrap gap-3" style={{ marginTop: 26 }}>
              {[
                { label: "Portfolio", href: "https://jayharwani.com", icon: Globe },
                { label: "Email", href: "mailto:harwanijay9498@gmail.com", icon: Mail },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/jay-harwani/", icon: Linkedin },
              ].map((l) => {
                const Icon = l.icon;
                return (
                  <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full transition-colors hover:bg-white/[0.04]" style={{ padding: "10px 18px", border: `1px solid ${T.hairlineInk}`, color: T.onInk, fontSize: 14, fontWeight: 500 }}>
                    <Icon size={15} /> {l.label} <ArrowUpRight size={14} style={{ opacity: 0.5 }} />
                  </a>
                );
              })}
            </div>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ fontFamily: MONO, fontSize: 11.5, color: "#5A6376", marginTop: 40, lineHeight: 1.6 }}>
              Self-initiated concept project. All stats sourced (NHTSA, IIHS, Cambridge Mobile Telematics).
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <Link to="/" className="inline-flex items-center gap-2" style={{ marginTop: 20, color: T.mutedInk, fontSize: 14 }}>
              <ArrowLeft size={15} /> Back to portfolio
            </Link>
          </Reveal>
        </div>
      </section>

      <SmartDrivePrototype open={protoOpen} onClose={() => setProtoOpen(false)} />
    </div>
  );
}
