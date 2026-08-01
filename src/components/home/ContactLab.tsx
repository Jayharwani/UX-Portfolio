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
import { MobileScroll3D } from "./motionKit";

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

/* ══════════════════════════════════════════════════════════════════════════
   THE VAULT — hover (or tap / focus) and the doors part, releasing three
   things about me. Move away and they lock back in.
   ══════════════════════════════════════════════════════════════════════════ */
function FilmMark() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <rect x="6" y="15" width="52" height="34" rx="6" fill="#0C111C" stroke="#2A3550" strokeWidth="1.5" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={`t${i}`} x={11 + i * 10.5} y="18.5" width="6" height="4" rx="1.2" fill="#5B8CFF" opacity=".38" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={`b${i}`} x={11 + i * 10.5} y="41.5" width="6" height="4" rx="1.2" fill="#5B8CFF" opacity=".38" />
      ))}
      <path d="M28 26.5 41 32l-13 5.5z" fill="#5B8CFF" />
    </svg>
  );
}

const VAULT_ITEMS = [
  { key: "ahm", kicker: "Born in", title: "Ahmedabad", sub: "Gujarat, India", img: "/vault/ahmedabad.jpg" },
  { key: "umbc", kicker: "Masters at", title: "UMBC", sub: "MS, Human-Centered Computing", logo: "/vault/umbc.svg" },
  { key: "film", kicker: "Off the clock", title: "Movie lover", sub: "Anything with a good third act", film: true },
];

function Vault({ reduce, fine, entered }: { reduce: boolean; fine: boolean; entered: boolean }) {
  const [open, setOpen] = useState(false);
  const spring = reduce ? { duration: 0.2 } : { type: "spring" as const, stiffness: 210, damping: 26, mass: 0.7 };

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
      animate={entered ? { opacity: 1, y: 0 } : undefined}
      transition={reduce ? { duration: 0.2 } : { duration: 0.7, ease: EXPO, delay: 0.35 }}
      style={{ position: "relative" }}
    >
      <div
        onMouseEnter={() => fine && setOpen(true)}
        onMouseLeave={() => fine && setOpen(false)}
        style={{
          position: "relative",
          borderRadius: 16,
          overflow: "hidden",
          background: "rgba(13,18,30,0.92)",
          border: "1px solid var(--border-strong)",
          boxShadow: open
            ? "0 40px 90px -40px rgba(0,0,0,0.8), 0 0 60px -24px rgba(91,140,255,0.5)"
            : "0 30px 70px -34px rgba(0,0,0,0.7)",
          transition: "box-shadow .5s ease",
          minHeight: 396,
        }}
      >
        {/* ── the contents, revealed ── */}
        <div style={{ padding: "22px 22px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="flex items-center justify-between">
            <span style={label}>The vault</span>
            <motion.span
              style={{ ...label, color: "var(--accent)" }}
              animate={{ opacity: open ? 1 : 0.75 }}
              transition={{ duration: 0.3 }}
            >
              {open ? "unlocked" : fine ? "hover me" : "tap me"}
            </motion.span>
          </div>

          {VAULT_ITEMS.map((it, i) => (
            <motion.div
              key={it.key}
              className="flex items-center gap-14"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: 12,
                borderRadius: 12,
                background: "rgba(255,255,255,0.035)",
                border: "1px solid var(--border)",
                transformStyle: "preserve-3d",
              }}
              initial={false}
              animate={
                open
                  ? { opacity: 1, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }
                  : reduce
                  ? { opacity: 0.28, y: 0, scale: 1, rotateX: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 26, scale: 0.94, rotateX: -22, filter: "blur(4px)" }
              }
              transition={{ ...spring, delay: reduce ? 0 : (open ? 0.16 + i * 0.09 : (2 - i) * 0.04) }}
            >
              {/* the thing itself */}
              <div
                style={{
                  width: 78,
                  height: 62,
                  flexShrink: 0,
                  borderRadius: 9,
                  overflow: "hidden",
                  background: it.logo ? "#fff" : "#0C111C",
                  border: "1px solid var(--border-strong)",
                  display: "grid",
                  placeItems: "center",
                  padding: it.logo ? 8 : 0,
                }}
              >
                {it.img && <img src={it.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                {it.logo && <img src={it.logo} alt="" style={{ width: "100%", height: "auto", display: "block" }} />}
                {it.film && <div style={{ width: 54, height: 54 }}><FilmMark /></div>}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ ...label, fontSize: 9.5, marginBottom: 3 }}>{it.kicker}</div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 16, fontWeight: 600, color: "var(--text)", lineHeight: 1.2 }}>
                  {it.title}
                </div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>{it.sub}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── the doors ── */}
        {[-1, 1].map((side) => (
          <motion.div
            key={side}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              [side === -1 ? "left" : "right"]: 0,
              width: "50.5%",
              background: "linear-gradient(180deg, #131A29, #0C1220)",
              borderRight: side === -1 ? "1px solid rgba(255,255,255,0.07)" : undefined,
              borderLeft: side === 1 ? "1px solid rgba(255,255,255,0.07)" : undefined,
              pointerEvents: "none",
            }}
            initial={false}
            animate={{ x: open ? `${side * 101}%` : "0%" }}
            transition={reduce ? { duration: 0.2 } : { type: "spring", stiffness: 150, damping: 24, mass: 0.9 }}
          >
            {/* brushed seam + rivets */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage:
                  "repeating-linear-gradient(90deg, rgba(255,255,255,0.022) 0 2px, transparent 2px 5px)",
                opacity: 0.7,
              }}
            />
            {[16, 1].map((t, k) => (
              <span
                key={k}
                style={{
                  position: "absolute",
                  [side === -1 ? "left" : "right"]: 14,
                  top: k === 0 ? 16 : undefined,
                  bottom: k === 1 ? 16 : undefined,
                  width: 5,
                  height: 5,
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.16)",
                }}
              />
            ))}
          </motion.div>
        ))}

        {/* the dial, sitting on the seam */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 76,
            height: 76,
            marginLeft: -38,
            marginTop: -38,
            borderRadius: 999,
            border: "2px solid rgba(91,140,255,0.5)",
            background: "radial-gradient(circle at 50% 40%, rgba(91,140,255,0.22), rgba(12,17,28,0.95))",
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            boxShadow: "0 0 26px rgba(91,140,255,0.3), inset 0 1px 0 rgba(255,255,255,0.14)",
          }}
          initial={false}
          animate={{ opacity: open ? 0 : 1, rotate: open ? 150 : 0, scale: open ? 0.7 : 1 }}
          transition={reduce ? { duration: 0.2 } : { duration: 0.55, ease: EXPO }}
        >
          <svg viewBox="0 0 40 40" width="34" height="34">
            <circle cx="20" cy="20" r="13" fill="none" stroke="rgba(91,140,255,0.75)" strokeWidth="2" />
            {[0, 90, 180, 270].map((a) => (
              <line
                key={a}
                x1="20"
                y1="4"
                x2="20"
                y2="9"
                stroke="rgba(91,140,255,0.9)"
                strokeWidth="2.4"
                strokeLinecap="round"
                transform={`rotate(${a} 20 20)`}
              />
            ))}
            <circle cx="20" cy="20" r="3.5" fill="#5B8CFF" />
          </svg>
        </motion.div>

        {/* the whole panel is one control: click / tap / keyboard */}
        <button
          onClick={() => setOpen((o) => !o)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          aria-expanded={open}
          aria-label={open ? "Close the vault" : "Open the vault: three things about me"}
          style={{
            position: "absolute",
            inset: 0,
            background: "none",
            border: "none",
            cursor: "pointer",
            zIndex: 3,
          }}
        />
      </div>
    </motion.div>
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
  const highMotion = true; // the lab's toggle is gone; the section keeps its motion

  useEffect(() => {
    /* dev-only: ?touch=1 forces the touch path for desktop testing */
    const forceTouch = import.meta.env.DEV && new URLSearchParams(window.location.search).has("touch");
    setFine(forceTouch ? false : window.matchMedia("(pointer: fine)").matches);
    setWide(window.matchMedia("(min-width: 1024px)").matches);
  }, []);
  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  const ease = EXPO; // out-expo, the section's one curve
  const dur = 400;
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
      {/* ── ambient: dot grid + cursor spotlight ──
           pointer-events: none is REQUIRED — these are full-bleed aria-hidden
           decorations, and without it they sit over the section's real
           controls (Email / copy / LinkedIn) and can swallow clicks. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ pointerEvents: "none" }}
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

          {/* ── right: the vault ── */}
          <motion.div
            {...enter(2, 28)}
            style={{ transform: tiltOn ? "translateZ(30px)" : undefined }}
          >
            <MobileScroll3D>
              <Vault reduce={reduce} fine={fine} entered={entered} />
            </MobileScroll3D>
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
