import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  useReducedMotion,
  useInView,
} from "motion/react";
import { useState, useEffect, useRef, useCallback, type ReactNode, type CSSProperties } from "react";
import { EnvelopeSimple, CopySimple, LinkedinLogo } from "@phosphor-icons/react";

/* ──────────────────────────────────────────────────────────────────────────
   Contact: a live interaction lab that is also the CTA.
   Left: the real actions (Email, copy, LinkedIn). Right: the Lab — a real
   toggle, a real button reporting its own timing, and an easing slider that
   retunes this section's animations while you drag it.
   CSS 3D diorama + cursor spotlight + magnetic buttons. Reduced motion
   collapses every effect to simple fades; controls keep working.
   ────────────────────────────────────────────────────────────────────────── */

/* ── motion tokens (single source of truth for this section) ── */
const SPRING = {
  snappy: { type: "spring" as const, stiffness: 260, damping: 20, mass: 0.6 },
  magnetic: { type: "spring" as const, stiffness: 150, damping: 15, mass: 0.5 },
  tilt: { type: "spring" as const, stiffness: 120, damping: 18 },
  overshoot: { type: "spring" as const, stiffness: 400, damping: 22 },
};
type Bez = [number, number, number, number];
const PRESETS: { name: string; bez: Bez }[] = [
  { name: "LINEAR", bez: [0.25, 0.25, 0.75, 0.75] },
  { name: "IN-OUT", bez: [0.65, 0, 0.35, 1] },
  { name: "OUT-QUINT", bez: [0.22, 1, 0.36, 1] },
  { name: "OUT-EXPO", bez: [0.16, 1, 0.3, 1] },
];
const EXPO = PRESETS[3].bez;

const EMAIL = "harwanijay9498@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/jay-harwani/";
const LIVE = "#3DD68C";

const mono: CSSProperties = { fontFamily: "var(--font-mono)" };
const label: CSSProperties = {
  ...mono,
  fontSize: 10.5,
  fontWeight: 500,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "var(--text-3)",
};

/* ── magnetic pull hook: element eases toward a nearby cursor ── */
function useMagnetic(enabled: boolean, radius = 90, strength = 0.35, innerStrength = 0.2) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const ix = useMotionValue(0);
  const iy = useMotionValue(0);
  const sx = useSpring(x, SPRING.magnetic);
  const sy = useSpring(y, SPRING.magnetic);
  const six = useSpring(ix, SPRING.magnetic);
  const siy = useSpring(iy, SPRING.magnetic);

  useEffect(() => {
    if (!enabled) {
      x.set(0); y.set(0); ix.set(0); iy.set(0);
      return;
    }
    let raf = 0;
    let px = 0;
    let py = 0;
    let queued = false;
    const update = () => {
      queued = false;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = px - cx;
      const dy = py - cy;
      const reach = radius + Math.max(r.width, r.height) / 2;
      if (Math.hypot(dx, dy) < reach) {
        x.set(dx * strength);
        y.set(dy * strength);
        ix.set(dx * innerStrength);
        iy.set(dy * innerStrength);
      } else {
        x.set(0); y.set(0); ix.set(0); iy.set(0);
      }
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(update);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled, radius, strength, innerStrength, x, y, ix, iy]);

  return { ref, sx, sy, six, siy };
}

/* ── magnetic button wrapper with press physics ── */
function Magnetic({
  children,
  enabled,
  onClick,
  href,
  ariaLabel,
  style,
}: {
  children: (inner: { x: ReturnType<typeof useSpring>; y: ReturnType<typeof useSpring> }) => ReactNode;
  enabled: boolean;
  onClick?: () => void;
  href?: string;
  ariaLabel?: string;
  style?: CSSProperties;
}) {
  const { ref, sx, sy, six, siy } = useMagnetic(enabled);
  const Tag: any = href ? motion.a : motion.button;
  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: "inline-block" }}>
      <Tag
        href={href}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        onClick={onClick}
        aria-label={ariaLabel}
        whileHover={enabled ? { z: 8 } : undefined}
        whileTap={{ scale: 0.97 }}
        transition={SPRING.snappy}
        style={{ display: "inline-flex", border: "none", background: "none", padding: 0, cursor: "pointer", ...style }}
      >
        {children({ x: six, y: siy })}
      </Tag>
    </motion.div>
  );
}

/* ── the hero micro-interaction: email + copy ── */
function EmailCopy({ ease, dur, reduce }: { ease: Bez; dur: number; reduce: boolean }) {
  const [copied, setCopied] = useState(false);
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);
  const boxRef = useRef<HTMLButtonElement>(null);

  const copy = useCallback(
    async (e?: { clientX?: number; clientY?: number }) => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(EMAIL);
        ok = true;
      } catch {
        const ta = document.createElement("textarea");
        ta.value = EMAIL;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          ok = document.execCommand("copy");
        } catch {
          ok = false;
        }
        document.body.removeChild(ta);
      }
      if (!ok) return;
      if (!reduce && boxRef.current && e?.clientX != null) {
        const r = boxRef.current.getBoundingClientRect();
        setRipple({ x: e.clientX - r.left, y: (e.clientY ?? 0) - r.top, key: Date.now() });
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    },
    [reduce]
  );

  return (
    <>
      <motion.button
        ref={boxRef}
        onClick={(e) => copy(e)}
        aria-label="Copy email address"
        className="relative inline-flex items-center gap-2.5 overflow-hidden"
        animate={!reduce && copied ? { scale: [1, 1.02, 1] } : undefined}
        transition={SPRING.snappy}
        style={{
          ...mono,
          fontSize: "clamp(11px, 3.3vw, 13.5px)",
          color: copied ? LIVE : "var(--text-2)",
          padding: "13px 16px",
          borderRadius: 8,
          background: "rgba(17,23,37,0.85)",
          border: `1px solid ${copied ? "rgba(61,214,140,0.5)" : "var(--border-strong)"}`,
          cursor: "pointer",
          maxWidth: "100%",
          transition: `color ${dur}ms cubic-bezier(${ease.join(",")}), border-color ${dur}ms cubic-bezier(${ease.join(",")})`,
        }}
      >
        {/* click ripple */}
        {ripple && (
          <motion.span
            key={ripple.key}
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{ left: ripple.x - 40, top: ripple.y - 40, width: 80, height: 80, borderRadius: 999, background: "rgba(91,140,255,0.28)" }}
            initial={{ scale: 0, opacity: 0.6 }}
            animate={{ scale: 3.2, opacity: 0 }}
            transition={{ duration: 0.4, ease: EXPO }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0, position: "relative" }}>{EMAIL}</span>
        {/* icon: copy ↔ drawn check */}
        <span className="relative inline-flex" style={{ width: 16, height: 16, flexShrink: 0 }}>
          <motion.span className="absolute inset-0 inline-flex" animate={{ opacity: copied ? 0 : 1 }} transition={{ duration: 0.15 }}>
            <CopySimple size={15} color="#6A7488" />
          </motion.span>
          {copied && (
            <svg className="absolute inset-0" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <motion.path
                d="M2.5 8.5 L6.2 12 L13.5 4"
                stroke={LIVE}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, ease: EXPO }}
              />
            </svg>
          )}
        </span>
        <span style={{ fontSize: 11, color: copied ? LIVE : "var(--text-3)", minWidth: 46, textAlign: "left", flexShrink: 0 }}>
          {copied ? "Copied" : "copy"}
        </span>
      </motion.button>
      {/* screen-reader announcement */}
      <span aria-live="polite" className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>
        {copied ? "Email copied" : ""}
      </span>
    </>
  );
}

/* ── bezier curve preview ── */
function CurvePreview({ bez }: { bez: Bez }) {
  const d = `M 4 40 C ${4 + bez[0] * 52} ${40 - bez[1] * 36}, ${4 + bez[2] * 52} ${40 - bez[3] * 36}, 56 4`;
  return (
    <svg width="60" height="44" viewBox="0 0 60 44" aria-hidden="true" style={{ flexShrink: 0 }}>
      <line x1="4" y1="40" x2="56" y2="40" stroke="var(--border)" strokeWidth="1" />
      <line x1="4" y1="40" x2="4" y2="4" stroke="var(--border)" strokeWidth="1" />
      <motion.path d={d} animate={{ d }} transition={SPRING.snappy} stroke="var(--accent)" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="4" cy="40" r="2" fill="var(--text-3)" />
      <circle cx="56" cy="4" r="2" fill="var(--accent)" />
    </svg>
  );
}

/* ── The Lab panel ── */
function LabPanel({
  reduce,
  fine,
  highMotion,
  setHighMotion,
  slider,
  setSlider,
  presetIdx,
  dur,
  ease,
  entered,
}: {
  reduce: boolean;
  fine: boolean;
  highMotion: boolean;
  setHighMotion: (v: boolean) => void;
  slider: number;
  setSlider: (v: number) => void;
  presetIdx: number;
  dur: number;
  ease: Bez;
  entered: boolean;
}) {
  const [toast, setToast] = useState(0);
  const easeCss = `cubic-bezier(${ease.join(",")})`;

  const rowAnim = (i: number) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 14 },
    animate: entered ? { opacity: 1, y: 0 } : undefined,
    transition: reduce ? { duration: 0.2 } : { duration: 0.55, ease: EXPO, delay: 0.5 + i * 0.06 },
  });

  return (
    <div
      className="relative"
      style={{
        background: "rgba(17,23,37,0.88)",
        border: "1px solid var(--border-strong)",
        borderRadius: 14,
        padding: "20px 22px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 30px 70px -30px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <motion.div {...rowAnim(0)} className="flex items-center justify-between" style={{ marginBottom: 18 }}>
        <span style={label}>The lab</span>
        <span style={{ ...label, color: "var(--accent)" }}>try me</span>
      </motion.div>

      {/* toggle row */}
      <motion.div {...rowAnim(1)} className="flex items-center justify-between" style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}>
        <span style={label}>Toggle / {highMotion ? "on" : "off"}</span>
        <button
          role="switch"
          aria-checked={highMotion}
          aria-label="High motion mode"
          onClick={() => setHighMotion(!highMotion)}
          className="relative flex items-center justify-center"
          style={{ width: 64, height: 44, background: "none", border: "none", cursor: "pointer", flexShrink: 0, padding: 0 }}
        >
          {/* visual track (44px hit area around it) */}
          <span
            className="relative block"
            style={{
              width: 56,
              height: 30,
              borderRadius: 999,
              background: highMotion ? "var(--accent-soft)" : "rgba(255,255,255,0.06)",
              border: `1px solid ${highMotion ? "rgba(91,140,255,0.55)" : "var(--border-strong)"}`,
              transition: `background ${dur}ms ${easeCss}, border-color ${dur}ms ${easeCss}`,
              boxShadow: highMotion ? "0 0 14px rgba(91,140,255,0.25)" : "none",
            }}
          >
            <motion.span
              className="absolute top-1/2"
              style={{ width: 22, height: 22, marginTop: -11, borderRadius: 999, background: highMotion ? "var(--accent)" : "#99A4B6" }}
              animate={{ left: highMotion ? 30 : 3 }}
              transition={reduce ? { duration: 0 } : SPRING.overshoot}
            />
          </span>
        </button>
      </motion.div>

      {/* SAY HI row: the button reports its own timing */}
      <motion.div {...rowAnim(2)} className="flex items-center justify-between gap-4" style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}>
        <div className="flex flex-col gap-1" style={{ minWidth: 0 }}>
          <span style={label}>Button / primary</span>
          <span style={{ ...mono, fontSize: 11, color: "var(--text-3)", fontVariantNumeric: "tabular-nums" }}>{Math.round(dur)}ms</span>
        </div>
        <div className="relative">
          <Magnetic
            enabled={fine && !reduce}
            onClick={() => setToast(Date.now())}
            ariaLabel="Say hi"
          >
            {({ x, y }) => (
              <span
                className="inline-flex items-center justify-center"
                style={{
                  padding: "12px 22px",
                  minHeight: 44,
                  borderRadius: 9,
                  background: "var(--accent)",
                  color: "#0A0E16",
                  fontFamily: "var(--font-body)",
                  fontSize: 13.5,
                  fontWeight: 600,
                  boxShadow: "0 8px 26px -8px rgba(91,140,255,0.5)",
                }}
              >
                <motion.span style={{ x, y }}>SAY HI</motion.span>
              </span>
            )}
          </Magnetic>
          {toast > 0 && (
            <motion.span
              key={toast}
              className="absolute pointer-events-none"
              style={{ ...mono, left: "50%", top: -10, fontSize: 12, color: "var(--accent)", whiteSpace: "nowrap" }}
              initial={{ opacity: 0, y: 6, x: "-50%" }}
              animate={{ opacity: [0, 1, 1, 0], y: [6, -14, -18, -26] }}
              transition={{ duration: reduce ? 0.3 : 1.2, times: [0, 0.15, 0.7, 1] }}
              onAnimationComplete={() => setToast(0)}
            >
              hi.
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* easing slider row */}
      <motion.div {...rowAnim(3)} style={{ padding: "12px 0 4px", borderTop: "1px solid var(--border)" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <span style={label}>Ease / {PRESETS[presetIdx].name}</span>
          <span style={{ ...label, fontSize: 9.5 }}>drag to retune this section</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1" style={{ height: 44, display: "flex", alignItems: "center" }}>
            {/* track */}
            <div className="absolute left-0 right-0" style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.08)" }} />
            <div
              className="absolute left-0"
              style={{ height: 3, borderRadius: 2, width: `${slider}%`, background: "var(--accent)", opacity: 0.75, transition: "none" }}
            />
            {/* preset ticks */}
            {[0, 33.3, 66.6, 100].map((p) => (
              <span key={p} className="absolute" style={{ left: `calc(${p}% - 1px)`, width: 2, height: 9, background: "var(--border-strong)", borderRadius: 1 }} />
            ))}
            {/* thumb */}
            <span
              className="absolute pointer-events-none"
              style={{
                left: `calc(${slider}% - 8px)`,
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "var(--bg-2)",
                border: "2px solid var(--accent)",
                boxShadow: "0 0 10px rgba(91,140,255,0.4)",
              }}
            />
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={slider}
              onChange={(e) => setSlider(Number(e.target.value))}
              aria-label="Easing and timing of this section's animations"
              className="absolute left-0 right-0"
              style={{ width: "100%", height: 44, opacity: 0, cursor: "ew-resize", margin: 0 }}
            />
          </div>
          <CurvePreview bez={ease} />
        </div>
      </motion.div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SECTION
   ══════════════════════════════════════════════════════════════════════════ */
export function ContactSection() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [entered, setEntered] = useState(false);
  const [fine, setFine] = useState(false);
  const [wide, setWide] = useState(false);
  const [highMotion, setHighMotion] = useState(true);
  const [slider, setSlider] = useState(100); // start on OUT-EXPO

  useEffect(() => {
    /* dev-only: ?touch=1 forces the touch path for desktop testing */
    const forceTouch = import.meta.env.DEV && new URLSearchParams(window.location.search).has("touch");
    setFine(forceTouch ? false : window.matchMedia("(pointer: fine)").matches);
    setWide(window.matchMedia("(min-width: 1024px)").matches);
  }, []);
  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  const presetIdx = Math.round((slider / 100) * (PRESETS.length - 1));
  const ease = PRESETS[presetIdx].bez;
  const dur = 120 + (slider / 100) * 280; // 120..400ms, live-reported by the lab
  const easeCss = `cubic-bezier(${ease.join(",")})`;

  const interactive = fine && !reduce;
  const scrollDrive = !fine && !reduce; // touch: scroll drives the diorama
  const live = interactive || scrollDrive;
  const tiltOn = (interactive && wide && highMotion) || (scrollDrive && highMotion);
  const ambientOn = live && highMotion;

  /* ── section tilt (the diorama) ── */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, SPRING.tilt);
  const sry = useSpring(ry, SPRING.tilt);

  /* ── cursor spotlight ── */
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const smx = useSpring(mx, SPRING.magnetic);
  const smy = useSpring(my, SPRING.magnetic);
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${smx}px ${smy}px, rgba(91,140,255,0.13), transparent 70%)`;
  const dotMask = useMotionTemplate`radial-gradient(260px circle at ${smx}px ${smy}px, black, transparent 75%)`;
  const lastMove = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !interactive) return;
    let raf = 0;
    let px = 0;
    let py = 0;
    let queued = false;
    const update = () => {
      queued = false;
      const r = el.getBoundingClientRect();
      const lx = px - r.left;
      const ly = py - r.top;
      mx.set(lx);
      my.set(ly);
      if (tiltOn) {
        const nx = (lx / r.width - 0.5) * 2;
        const ny = (ly / r.height - 0.5) * 2;
        ry.set(Math.max(-5.5, Math.min(5.5, nx * 5.5)));
        rx.set(Math.max(-4.5, Math.min(4.5, ny * -4.5)));
      } else {
        rx.set(0);
        ry.set(0);
      }
      lastMove.current = performance.now();
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(update);
      }
    };
    const onLeave = () => {
      rx.set(0);
      ry.set(0);
    };
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [interactive, tiltOn, mx, my, rx, ry]);

  /* idle drift (cursor mode): after 4s without movement, the spotlight wanders */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !ambientOn || !interactive) return;
    let raf = 0;
    const drift = (t: number) => {
      if (performance.now() - lastMove.current > 4000) {
        const r = el.getBoundingClientRect();
        mx.set(r.width / 2 + Math.sin(t / 2400) * r.width * 0.28);
        my.set(r.height / 2 + Math.cos(t / 3100) * r.height * 0.22);
      }
      raf = requestAnimationFrame(drift);
    };
    raf = requestAnimationFrame(drift);
    return () => cancelAnimationFrame(raf);
  }, [ambientOn, interactive, mx, my]);

  /* scroll drive (touch): tilt follows the section through the viewport,
     spotlight wanders — the mobile version is never static. Plain-rect
     visibility check: IntersectionObserver misreports in some embedded
     viewports (same workaround as the blocks playground). */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !scrollDrive) return;
    let raf = 0;
    let alive = true;
    const loop = (t: number) => {
      if (!alive) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      if (r.bottom > -80 && r.top < vh + 80) {
        const prog = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
        if (tiltOn) {
          rx.set(prog * 4.5 * 0.9);
          ry.set(Math.sin(t / 2600) * 5.5 * 0.22);
        }
        mx.set(r.width / 2 + Math.sin(t / 2400) * r.width * 0.3);
        my.set(r.height * 0.4 + Math.cos(t / 3100) * r.height * 0.22 - prog * r.height * 0.18);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [scrollDrive, tiltOn, mx, my, rx, ry]);

  /* entrance variants */
  const enter = (i: number, dy = 24) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: dy },
    animate: entered ? { opacity: 1, y: 0 } : undefined,
    transition: reduce ? { duration: 0.2 } : { ...SPRING.snappy, delay: 0.28 + i * 0.07 },
  });

  const dotGrid: CSSProperties = {
    backgroundImage: "radial-gradient(rgba(106,116,136,0.35) 1px, transparent 1px)",
    backgroundSize: "34px 34px",
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        background: "var(--bg-2)",
        borderTop: "1px solid var(--border)",
        scrollMarginTop: 70,
        perspective: 1200,
      }}
    >
      {/* ── ambient: dot grid + cursor spotlight ── */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={entered ? { opacity: 1 } : undefined}
        transition={{ duration: reduce ? 0.2 : 1.1, ease: EXPO }}
      >
        {/* base grid, very dim */}
        <div className="absolute inset-0" style={{ ...dotGrid, opacity: 0.12 }} />
        {live ? (
          <>
            {/* brighter dots revealed near the light */}
            <motion.div className="absolute inset-0" style={{ ...dotGrid, opacity: 0.5, maskImage: dotMask, WebkitMaskImage: dotMask }} />
            {/* the pool of light itself */}
            <motion.div className="absolute inset-0" style={{ background: spotlight }} />
          </>
        ) : (
          /* touch / reduced motion: static soft glow */
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(420px circle at 60% 40%, rgba(91,140,255,0.08), transparent 70%)" }}
          />
        )}
      </motion.div>

      {/* ── tilting diorama ── */}
      <motion.div
        className="relative z-10 mx-auto max-w-6xl px-6 md:px-10 lg:px-16 pt-24 md:pt-32"
        style={{
          paddingBottom: "clamp(110px, 18vh, 190px)",
          rotateX: tiltOn ? srx : 0,
          rotateY: tiltOn ? sry : 0,
          transformStyle: "preserve-3d",
        }}
      >
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-14 lg:gap-20 items-start" style={{ transformStyle: "preserve-3d" }}>
          {/* ── left: the real actions ── */}
          <div style={{ transform: tiltOn ? "translateZ(30px)" : undefined, transformStyle: "preserve-3d" }}>
            <motion.div
              initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: "inset(0 100% 0 0)" }}
              animate={entered ? { opacity: 1, clipPath: "inset(0 0% 0 0)" } : undefined}
              transition={reduce ? { duration: 0.2 } : { duration: 0.6, ease: EXPO, delay: 0.12 }}
            >
              <span className="inline-flex items-center gap-3">
                <span style={{ width: 22, height: 2, background: "var(--accent)", display: "inline-block" }} />
                <span style={label}>Contact</span>
              </span>
            </motion.div>

            <motion.h2
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={entered ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
              transition={reduce ? { duration: 0.2 } : { duration: 0.8, ease: EXPO, delay: 0.2 }}
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(3rem, 8.5vw, 6.4rem)",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                lineHeight: 1.04,
                color: "var(--text)",
                marginTop: 18,
              }}
            >
              Say{" "}
              <em style={{ fontFamily: "var(--font-serif-it)", fontStyle: "italic", fontWeight: 400 }}>hi.</em>
            </motion.h2>

            <motion.p
              {...enter(0, 16)}
              style={{ fontFamily: "var(--font-body)", fontSize: 16.5, lineHeight: 1.6, color: "var(--text-2)", marginTop: 14, maxWidth: 440 }}
            >
              One email. I reply fast, and the work speaks for itself.
            </motion.p>

            <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 30 }}>
              {/* Email me: primary, magnetic, breathing glow */}
              <motion.div {...enter(1)} className="relative">
                {/* pre-blurred breathing glow (opacity only) */}
                <motion.span
                  aria-hidden="true"
                  className="absolute pointer-events-none"
                  style={{ inset: -14, borderRadius: 20, background: "rgba(91,140,255,0.35)", filter: "blur(18px)" }}
                  animate={ambientOn ? { opacity: [0.25, 0.5, 0.25] } : { opacity: 0.25 }}
                  transition={{ duration: 4, repeat: ambientOn ? Infinity : 0, ease: "easeInOut" }}
                />
                <Magnetic enabled={interactive} onClick={() => (window.location.href = `mailto:${EMAIL}`)} ariaLabel="Email me">
                  {({ x, y }) => (
                    <span
                      className="relative inline-flex items-center gap-2.5"
                      style={{
                        padding: "14px 24px",
                        minHeight: 44,
                        borderRadius: 9,
                        background: "var(--accent)",
                        color: "#0A0E16",
                        fontFamily: "var(--font-body)",
                        fontSize: 15,
                        fontWeight: 600,
                      }}
                    >
                      <motion.span className="inline-flex items-center gap-2.5" style={{ x, y }}>
                        <EnvelopeSimple size={17} weight="bold" /> Email me
                      </motion.span>
                    </span>
                  )}
                </Magnetic>
              </motion.div>

              {/* the copy hero */}
              <motion.div {...enter(2)} style={{ minWidth: 0, maxWidth: "100%" }}>
                <EmailCopy ease={ease} dur={dur} reduce={reduce} />
              </motion.div>

              {/* LinkedIn */}
              <motion.div {...enter(3)}>
                <Magnetic enabled={interactive} href={LINKEDIN} ariaLabel="LinkedIn profile">
                  {({ x, y }) => (
                    <span
                      className="inline-flex items-center gap-2 group"
                      style={{
                        padding: "13px 18px",
                        minHeight: 44,
                        borderRadius: 8,
                        background: "rgba(17,23,37,0.85)",
                        border: "1px solid var(--border-strong)",
                        fontFamily: "var(--font-body)",
                        fontSize: 14.5,
                        fontWeight: 500,
                        color: "var(--text-2)",
                        transition: `border-color ${dur}ms ${easeCss}`,
                      }}
                    >
                      <motion.span className="inline-flex items-center gap-2" style={{ x, y }}>
                        <LinkedinLogo size={16} weight="duotone" color="#5B8CFF" /> LinkedIn
                      </motion.span>
                    </span>
                  )}
                </Magnetic>
              </motion.div>
            </div>
          </div>

          {/* ── right: the lab ── */}
          <motion.div
            {...enter(2, 28)}
            style={{ transform: tiltOn ? "translateZ(30px)" : undefined }}
          >
            <LabPanel
              reduce={reduce}
              fine={fine}
              highMotion={highMotion}
              setHighMotion={setHighMotion}
              slider={slider}
              setSlider={setSlider}
              presetIdx={presetIdx}
              dur={dur}
              ease={ease}
              entered={entered}
            />
          </motion.div>
        </div>

        {/* LIVE indicator, nearest layer */}
        <motion.div
          className="absolute"
          style={{ right: 24, bottom: 18, transform: tiltOn ? "translateZ(50px)" : undefined }}
          initial={{ opacity: 0 }}
          animate={entered ? { opacity: 1 } : undefined}
          transition={{ duration: 0.5, delay: reduce ? 0 : 1 }}
        >
          <span className="inline-flex items-center gap-2" style={{ ...label, fontSize: 10.5, letterSpacing: "0.12em" }}>
            <motion.span
              style={{ width: 6, height: 6, borderRadius: 999, background: LIVE, boxShadow: `0 0 8px ${LIVE}` }}
              animate={reduce ? {} : { opacity: [0.9, 0.35, 0.9], scale: [1, 0.85, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            MICRO-INTERACTIONS · LIVE
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
