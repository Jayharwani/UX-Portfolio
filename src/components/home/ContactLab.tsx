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
   THE MAGICIAN'S VAULT
   A obsidian cabinet in the portfolio's own blue. Hover (tap on touch, or
   focus by keyboard) and its two doors swing open on real 3D hinges, the
   sigil dissolves, and three cards levitate out in a fan — each one a thing
   about me. Leave, and they spin back inside and the doors shut.

   All CSS 3D (preserve-3d + rotateY hinges + translateZ depth): it stays
   smooth, needs no WebGL, and degrades to a plain readable list under
   prefers-reduced-motion.
   ══════════════════════════════════════════════════════════════════════════ */
function FilmMark() {
  return (
    <svg viewBox="0 0 64 64" width="100%" height="100%" aria-hidden="true">
      <rect x="7" y="16" width="50" height="32" rx="6" fill="#0B1120" stroke="rgba(91,140,255,0.45)" strokeWidth="1.4" />
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={`t${i}`} x={11.5 + i * 9.8} y="19.5" width="5.4" height="3.6" rx="1.1" fill="#5B8CFF" opacity=".4" />
      ))}
      {[0, 1, 2, 3, 4].map((i) => (
        <rect key={`b${i}`} x={11.5 + i * 9.8} y="41" width="5.4" height="3.6" rx="1.1" fill="#5B8CFF" opacity=".4" />
      ))}
      <path d="M28 26.5 41 32l-13 5.5z" fill="#5B8CFF" />
    </svg>
  );
}

/* the four-point sparkle that says "magic" without saying "clip art" */
function Spark({ size = 14, opacity = 1 }: { size?: number; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ opacity, display: "block" }}>
      <path d="M12 0c.7 6.4 4.9 10.6 12 12-7.1 1.4-11.3 5.6-12 12-.7-6.4-4.9-10.6-12-12C7.1 10.6 11.3 6.4 12 0Z" fill="#5B8CFF" />
    </svg>
  );
}

const VAULT_ITEMS = [
  { key: "ahm", kicker: "Born in", title: "Ahmedabad", sub: "Gujarat, India", img: "/vault/ahmedabad.jpg" },
  { key: "umbc", kicker: "Masters at", title: "UMBC", sub: "Human-Centered Computing", logo: "/vault/umbc.svg" },
  { key: "film", kicker: "Off the clock", title: "Movie lover", sub: "Give me a good third act", film: true },
];

/* where each card lands when the trick fires */
const FAN = [
  { x: -1, rot: -13, y: 12, z: 40 },
  { x: 0, rot: 0, y: -20, z: 96 },
  { x: 1, rot: 13, y: 12, z: 40 },
];
const SPARKS = [
  { x: 14, y: 20, s: 13, d: 0.16 }, { x: 84, y: 16, s: 10, d: 0.3 },
  { x: 50, y: 8, s: 15, d: 0.22 }, { x: 26, y: 78, s: 11, d: 0.4 },
  { x: 76, y: 82, s: 14, d: 0.26 }, { x: 92, y: 52, s: 9, d: 0.36 },
  { x: 6, y: 54, s: 10, d: 0.44 },
];

function MagicVault({ reduce, fine, entered }: { reduce: boolean; fine: boolean; entered: boolean }) {
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  /* the fan needs less spread in a narrow column */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setCompact(el.clientWidth < 430);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* the whole cabinet leans toward the cursor */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 120, damping: 18 });
  const sry = useSpring(ry, { stiffness: 120, damping: 18 });
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || reduce || !fine) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry.set(((e.clientX - r.left) / r.width - 0.5) * 13);
      rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
    };
    const onLeave = () => { rx.set(0); ry.set(0); };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => { el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
  }, [reduce, fine, rx, ry]);

  const spread = compact ? 86 : 132;
  const cardW = compact ? 108 : 138;
  const cardH = compact ? 148 : 186;
  const doorSpring = reduce ? { duration: 0.2 } : { type: "spring" as const, stiffness: 120, damping: 20, mass: 1 };
  const cardSpring = reduce ? { duration: 0.2 } : { type: "spring" as const, stiffness: 190, damping: 22, mass: 0.8 };

  return (
    <motion.div
      ref={wrapRef}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 26 }}
      animate={entered ? { opacity: 1, y: 0 } : undefined}
      transition={reduce ? { duration: 0.2 } : { duration: 0.7, ease: EXPO, delay: 0.35 }}
      onMouseEnter={() => fine && setOpen(true)}
      onMouseLeave={() => fine && setOpen(false)}
      style={{ position: "relative", perspective: 1400 }}
    >
      {/* IMPORTANT: the clipping shell and the 3D stage must be two different
          elements. `overflow: hidden` forces transform-style to FLAT on the
          same element, which would silently collapse every hinge and depth in
          here (and computed styles still read "preserve-3d", so it looks fine
          while being broken). Shell clips and paints; stage does the 3D. */}
      <motion.div
        style={{
          position: "relative",
          height: 396,
          borderRadius: 20,
          overflow: "hidden",
          background: "radial-gradient(120% 100% at 50% 0%, #131B2E 0%, #0B101B 60%, #080C14 100%)",
          border: "1px solid var(--border-strong)",
          boxShadow: open
            ? "0 50px 110px -50px rgba(0,0,0,0.95), 0 0 90px -30px rgba(91,140,255,0.55), inset 0 1px 0 rgba(255,255,255,0.07)"
            : "0 34px 80px -44px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05)",
          transition: "box-shadow .6s ease",
        }}
      >
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          transformStyle: "preserve-3d",
          perspective: 1400,
          rotateX: reduce ? 0 : srx,
          rotateY: reduce ? 0 : sry,
        }}
      >
        {/* the interior: a lit void the cards come out of */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(60% 55% at 50% 50%, rgba(91,140,255,0.30), rgba(10,14,22,0) 70%), #05070C",
            pointerEvents: "none",
          }}
          animate={{ opacity: open ? 1 : 0.35 }}
          transition={{ duration: 0.5 }}
        />

        {/* floor grid, so the void has depth */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(91,140,255,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(91,140,255,0.10) 1px, transparent 1px)",
            backgroundSize: "34px 34px",
            maskImage: "radial-gradient(70% 60% at 50% 55%, #000, transparent 75%)",
            WebkitMaskImage: "radial-gradient(70% 60% at 50% 55%, #000, transparent 75%)",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />

        {/* ── the three cards ── */}
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", pointerEvents: "none" }}>
          {VAULT_ITEMS.map((it, i) => {
            const f = FAN[i];
            const openState = {
              x: f.x * spread,
              y: f.y,
              z: f.z,
              rotateZ: f.rot,
              rotateY: 0,
              scale: 1,
              opacity: 1,
            };
            const shutState = { x: 0, y: 0, z: -70, rotateZ: 0, rotateY: 0, scale: 0.7, opacity: 0 };
            return (
              <motion.div
                key={it.key}
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  width: cardW,
                  height: cardH,
                  marginLeft: -cardW / 2,
                  marginTop: -cardH / 2,
                  /* no preserve-3d here: the card's own children are flat, and
                     overflow:hidden (for the rounded corners) would force it to
                     flat anyway. The card still lives in the stage's 3D space. */
                  borderRadius: 14,
                  overflow: "hidden",
                  background: "linear-gradient(170deg, #1B2438 0%, #121A2A 60%, #0E1524 100%)",
                  border: "1px solid rgba(91,140,255,0.4)",
                  boxShadow: "0 26px 50px -20px rgba(0,0,0,0.9), 0 0 26px -8px rgba(91,140,255,0.45), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
                initial={false}
                animate={reduce ? { ...openState, x: 0, y: (i - 1) * 4, z: 0, rotateZ: 0, opacity: open ? 1 : 0 } : open ? openState : shutState}
                transition={{ ...cardSpring, delay: reduce ? 0 : open ? 0.18 + i * 0.08 : (2 - i) * 0.05 }}
              >
                {/* the face */}
                <div style={{ height: "58%", position: "relative", background: it.logo ? "#fff" : "#080D16", display: "grid", placeItems: "center", padding: it.logo ? 12 : 0 }}>
                  {it.img && <img src={it.img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
                  {it.logo && <img src={it.logo} alt="" style={{ width: "100%", height: "auto", display: "block" }} />}
                  {it.film && <div style={{ width: "72%" }}><FilmMark /></div>}
                </div>
                <div style={{ padding: compact ? "9px 10px" : "12px 13px" }}>
                  <div style={{ ...label, fontSize: 8.5, marginBottom: 3 }}>{it.kicker}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: compact ? 13 : 15, fontWeight: 600, color: "var(--text)", lineHeight: 1.15 }}>
                    {it.title}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: compact ? 10 : 11.5, color: "var(--text-3)", marginTop: 3, lineHeight: 1.3 }}>
                    {it.sub}
                  </div>
                </div>
                {/* a glint across the card face */}
                <span
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.16) 50%, transparent 65%)",
                    pointerEvents: "none",
                  }}
                />
              </motion.div>
            );
          })}
        </div>

        {/* ── sparks ── */}
        {!reduce &&
          SPARKS.map((sp, i) => (
            <motion.span
              key={i}
              aria-hidden="true"
              style={{ position: "absolute", left: `${sp.x}%`, top: `${sp.y}%`, pointerEvents: "none", transformStyle: "preserve-3d" }}
              initial={false}
              animate={open ? { opacity: [0, 1, 0.85], scale: [0.2, 1.25, 1], z: 120, rotate: 90 } : { opacity: 0, scale: 0.2, z: 0, rotate: 0 }}
              transition={{ duration: 0.9, ease: EXPO, delay: open ? 0.2 + sp.d : 0 }}
            >
              <Spark size={sp.s} />
            </motion.span>
          ))}

        {/* ── the doors, on real hinges ── */}
        {([-1, 1] as const).map((side) => (
          <motion.div
            key={side}
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: side === -1 ? 0 : "50%",
              width: "50%",
              transformOrigin: side === -1 ? "left center" : "right center",
              transformStyle: "preserve-3d",
              background:
                "linear-gradient(150deg, #1A2338 0%, #131A2B 45%, #0D1421 100%)",
              borderRight: side === -1 ? "1px solid rgba(91,140,255,0.28)" : undefined,
              borderLeft: side === 1 ? "1px solid rgba(91,140,255,0.28)" : undefined,
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
              pointerEvents: "none",
            }}
            initial={false}
            animate={{ rotateY: open ? side * -112 : 0 }}
            transition={doorSpring}
          >
            {/* engraved panel line */}
            <span
              style={{
                position: "absolute",
                inset: 16,
                borderRadius: 12,
                border: "1px solid rgba(91,140,255,0.16)",
                boxShadow: "inset 0 0 30px rgba(91,140,255,0.06)",
              }}
            />
            {/* brushed metal grain */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: "repeating-linear-gradient(115deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 6px)",
              }}
            />
            {/* the handle */}
            <span
              style={{
                position: "absolute",
                top: "50%",
                [side === -1 ? "right" : "left"]: 12,
                width: 4,
                height: 34,
                marginTop: -17,
                borderRadius: 999,
                background: "linear-gradient(180deg, rgba(91,140,255,0.9), rgba(91,140,255,0.35))",
                boxShadow: "0 0 12px rgba(91,140,255,0.6)",
              }}
            />
          </motion.div>
        ))}

        {/* ── the sigil on the seam ── */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 108,
            height: 108,
            marginLeft: -54,
            marginTop: -54,
            display: "grid",
            placeItems: "center",
            pointerEvents: "none",
            transformStyle: "preserve-3d",
          }}
          initial={false}
          animate={{ opacity: open ? 0 : 1, scale: open ? 0.6 : 1, rotate: open ? 120 : 0, z: open ? -40 : 30 }}
          transition={{ duration: reduce ? 0.2 : 0.6, ease: EXPO }}
        >
          <motion.svg
            viewBox="0 0 120 120"
            width="108"
            height="108"
            animate={reduce ? undefined : { rotate: 360 }}
            transition={{ duration: 34, repeat: Infinity, ease: "linear" }}
          >
            <circle cx="60" cy="60" r="44" fill="none" stroke="rgba(91,140,255,0.34)" strokeWidth="1.2" strokeDasharray="3 7" />
            <circle cx="60" cy="60" r="33" fill="none" stroke="rgba(91,140,255,0.5)" strokeWidth="1.4" />
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <line key={a} x1="60" y1="16" x2="60" y2="26" stroke="rgba(91,140,255,0.75)" strokeWidth="2" strokeLinecap="round" transform={`rotate(${a} 60 60)`} />
            ))}
          </motion.svg>
          <div style={{ position: "absolute", display: "grid", placeItems: "center" }}>
            <Spark size={30} />
          </div>
        </motion.div>

        </motion.div>
        {/* ── end 3D stage ── */}

        {/* label + prompt, flat above the doors */}
        <div style={{ position: "absolute", left: 0, right: 0, top: 0, padding: "18px 20px", display: "flex", justifyContent: "space-between", pointerEvents: "none", zIndex: 4 }}>
          <span style={label}>The vault</span>
          <motion.span style={{ ...label, color: "var(--accent)" }} animate={{ opacity: open ? 1 : 0.8 }} transition={{ duration: 0.3 }}>
            {open ? "abracadabra" : fine ? "hover to open" : "tap to open"}
          </motion.span>
        </div>

        {/* one control for mouse, touch and keyboard */}
        <button
          onClick={() => setOpen((o) => !o)}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          aria-expanded={open}
          aria-label={open ? "Close the vault" : "Open the vault: three things about me"}
          style={{ position: "absolute", inset: 0, background: "none", border: "none", cursor: "pointer", zIndex: 5 }}
        />
      </motion.div>
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
              <MagicVault reduce={reduce} fine={fine} entered={entered} />
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
