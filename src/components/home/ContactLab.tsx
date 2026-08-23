import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  useInView,
} from "motion/react";
import { useState, useEffect, useRef, useCallback, type ReactNode, type CSSProperties } from "react";
import { EnvelopeSimple, CopySimple, LinkedinLogo } from "@phosphor-icons/react";
import { MobileScroll3D, useDiorama, Ambience, useOnScreen } from "./motionKit";
import Constellation from "./Constellation";

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
/* NOTE on radius/strength: these used to be 90 / 0.35, which let a button
   travel ~50px toward the cursor — far enough for the Email button to slide
   on top of the LinkedIn button beside it and eat its clicks. Kept subtle so
   a magnetic control never leaves its own footprint. */
function useMagnetic(enabled: boolean, radius = 46, strength = 0.18, innerStrength = 0.12) {
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
   SECTION
   ══════════════════════════════════════════════════════════════════════════ */
export function ContactSection() {
  const reduce = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [entered, setEntered] = useState(false);
  const [fine, setFine] = useState(false);

  useEffect(() => {
    /* dev-only: ?touch=1 forces the touch path for desktop testing */
    const forceTouch = import.meta.env.DEV && new URLSearchParams(window.location.search).has("touch");
    setFine(forceTouch ? false : window.matchMedia("(pointer: fine)").matches);
  }, []);
  useEffect(() => {
    if (inView) setEntered(true);
  }, [inView]);

  const ease = EXPO; // out-expo, the section's one curve
  const dur = 400;

  /* This section used to carry its own copy of the diorama — the same tilt
     springs, the same spotlight, the same three rAF loops as motionKit, about
     130 lines duplicated. Keeping two copies in sync was already the stated
     goal of motionKit ("one source of truth so Contact, About and How-I-Work
     feel identical"), and the duplicate is what let the unguarded idle-drift
     loop survive here after it was fixed there. Same tilt limits (4.5 / 5.5),
     so this is a straight swap. */
  const d = useDiorama(sectionRef);
  const { interactive, tiltOn, ambientOn, srx, sry } = d;
  const visible = useOnScreen(sectionRef);

  /* entrance variants */
  const enter = (i: number, dy = 24) => ({
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: dy },
    animate: entered ? { opacity: 1, y: 0 } : undefined,
    transition: reduce ? { duration: 0.2 } : { ...SPRING.snappy, delay: 0.28 + i * 0.07 },
  });

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
      <div className="absolute inset-0" style={{ pointerEvents: "none" }}>
        <Ambience d={d} entered={entered} />
      </div>

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

            {/* Every control in this row is positioned, so DOM order decides
                who paints on top in any overlap — and LinkedIn, being last,
                can no longer be covered by the button before it. */}
            <div className="flex flex-wrap items-center gap-4" style={{ marginTop: 30 }}>
              {/* Email me: primary, magnetic, breathing glow */}
              <motion.div {...enter(1)} className="relative" style={{ position: "relative", zIndex: 1 }}>
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
              <motion.div {...enter(2)} style={{ minWidth: 0, maxWidth: "100%", position: "relative", zIndex: 2 }}>
                <EmailCopy ease={ease} dur={dur} reduce={reduce} />
              </motion.div>

              {/* LinkedIn — reported as unclickable twice, so this one is now
                  a plain anchor: the <a> IS the padded box (no nested spans
                  carrying the hit area), no magnetic transform, no z-translate
                  inside the section's 3D context, and it sits highest in the
                  row. Nothing here can move it out from under a click. The
                  hover lift is pure CSS on the anchor itself. */}
              <motion.div {...enter(3)} style={{ position: "relative", zIndex: 3 }}>
                <a
                  href={LINKEDIN}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="sg-linkedin inline-flex items-center gap-2"
                  style={{
                    padding: "13px 18px",
                    minHeight: 44,
                    borderRadius: 8,
                    background: "rgba(17,23,37,0.85)",
                    /* border lives in .sg-linkedin so :hover can override it
                       without !important — an inline border would win. */
                    fontFamily: "var(--font-body)",
                    fontSize: 14.5,
                    fontWeight: 500,
                    color: "var(--text-2)",
                    cursor: "pointer",
                    textDecoration: "none",
                    transition: "border-color .25s ease, transform .25s ease, color .25s ease",
                  }}
                >
                  <LinkedinLogo size={16} weight="duotone" color="#5B8CFF" /> LinkedIn
                </a>
              </motion.div>
            </div>
          </div>

          {/* ── right: the constellation ── */}
          <motion.div
            {...enter(2, 28)}
            style={{ transform: tiltOn ? "translateZ(30px)" : undefined }}
          >
            <MobileScroll3D>
              <Constellation reduce={reduce} fine={fine} />
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
              animate={reduce || !visible ? {} : { opacity: [0.9, 0.35, 0.9], scale: [1, 0.85, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            MICRO-INTERACTIONS · LIVE
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}
