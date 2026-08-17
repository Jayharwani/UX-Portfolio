import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useState, useEffect, useRef, type RefObject, type ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Motion kit: the shared physics for the homepage's interactive sections.
   One source of truth so Contact, About, and How-I-Work feel identical:
   - spring tokens
   - useDiorama: cursor spotlight + shallow 3D section tilt (rAF-throttled)
   - <Ambience>: dot grid lit by the spotlight, with static fallbacks
   ────────────────────────────────────────────────────────────────────────── */

export const SPRING = {
  snappy: { type: "spring" as const, stiffness: 260, damping: 20, mass: 0.6 },
  magnetic: { type: "spring" as const, stiffness: 150, damping: 15, mass: 0.5 },
  tilt: { type: "spring" as const, stiffness: 120, damping: 18 },
  overshoot: { type: "spring" as const, stiffness: 400, damping: 22 },
};
export const EXPO = [0.16, 1, 0.3, 1] as const;

export function useMediaFlags() {
  const reduce = !!useReducedMotion();
  const [fine, setFine] = useState(false);
  const [wide, setWide] = useState(false);
  useEffect(() => {
    /* dev-only: ?touch=1 forces the touch path for desktop testing */
    const forceTouch = import.meta.env.DEV && new URLSearchParams(window.location.search).has("touch");
    setFine(forceTouch ? false : window.matchMedia("(pointer: fine)").matches);
    setWide(window.matchMedia("(min-width: 1024px)").matches);
  }, []);
  return { reduce, fine, wide };
}

export interface Diorama {
  interactive: boolean;
  /** any live motion source — cursor (desktop) or scroll (touch) */
  live: boolean;
  tiltOn: boolean;
  ambientOn: boolean;
  srx: MotionValue<number>;
  sry: MotionValue<number>;
  /* The spotlight used to be handed over as two ready-made gradient STRINGS
     (background + mask-image) rebuilt every frame. Assigning a fresh gradient
     to background repaints a full-bleed layer, and an animated mask-image
     cannot be composited at all — three sections doing both, every frame, is
     what made the whole site feel heavy. Now the light's position is handed
     over as plain numbers and <Ambience> moves a fixed, static-gradient
     element with a transform, which the compositor can do without repainting. */
  smx: MotionValue<number>;
  smy: MotionValue<number>;
  reduce: boolean;
  fine: boolean;
}

/* cursor spotlight + shallow tilt for a section. `tilt`/`ambient` let a
   caller (the Lab toggle) switch high-motion behavior on and off.
   Touch devices get the SAME diorama driven by scroll: the section tilts
   as it travels through the viewport and the spotlight wanders on its own,
   so mobile is never the static version. */
export function useDiorama(
  ref: RefObject<HTMLElement>,
  { tilt = true, ambient = true, maxX = 4.5, maxY = 5.5 }: { tilt?: boolean; ambient?: boolean; maxX?: number; maxY?: number } = {}
): Diorama {
  const { reduce, fine, wide } = useMediaFlags();
  const interactive = fine && !reduce;
  const scrollDrive = !fine && !reduce;
  const live = interactive || scrollDrive;
  const tiltOn = (interactive && wide && tilt) || (scrollDrive && tilt);
  const ambientOn = live && ambient;

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, SPRING.tilt);
  const sry = useSpring(ry, SPRING.tilt);

  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const smx = useSpring(mx, SPRING.magnetic);
  const smy = useSpring(my, SPRING.magnetic);
  const lastMove = useRef(0);

  useEffect(() => {
    const el = ref.current;
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
        ry.set(Math.max(-maxY, Math.min(maxY, nx * maxY)));
        rx.set(Math.max(-maxX, Math.min(maxX, ny * -maxX)));
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
  }, [ref, interactive, tiltOn, maxX, maxY, mx, my, rx, ry]);

  /* idle drift (cursor mode): after 4s without movement, the spotlight wanders.
     This loop had no visibility gate at all: it ran at 60fps for the life of
     the page, for every section using a diorama, including while the section
     was far off screen and while the tab was in the background — and once the
     pointer had been idle four seconds (the normal state while reading) every
     one of those frames also took a getBoundingClientRect, forcing layout.
     It now idles off screen, stops dead when the tab is hidden, and caches the
     section size instead of re-measuring it each frame. */
  useEffect(() => {
    const el = ref.current;
    if (!el || !ambientOn || !interactive) return;
    let raf = 0;
    let alive = true;
    let idle = 0;
    let onScreen = true;
    let w = el.offsetWidth;
    let h = el.offsetHeight;
    const ro = new ResizeObserver(() => {
      w = el.offsetWidth;
      h = el.offsetHeight;
    });
    ro.observe(el);
    const drift = (t: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(drift);
      if (!onScreen && ++idle < 8) return;
      idle = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      onScreen = r.bottom > 0 && r.top < vh;
      if (!onScreen) return;
      if (performance.now() - lastMove.current > 4000) {
        mx.set(w / 2 + Math.sin(t / 2400) * w * 0.28);
        my.set(h / 2 + Math.cos(t / 3100) * h * 0.22);
      }
    };
    raf = requestAnimationFrame(drift);
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && alive) raf = requestAnimationFrame(drift);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref, ambientOn, interactive, mx, my]);

  /* scroll drive (touch mode): tilt follows the section's travel through the
     viewport; the spotlight wanders continuously. Plain-rect visibility check
     inside the loop — IntersectionObserver misreports in some embedded and
     emulated viewports (same workaround as the blocks playground). */
  useEffect(() => {
    const el = ref.current;
    if (!el || !scrollDrive) return;
    let raf = 0;
    let alive = true;
    let idle = 0;
    let onScreen = true;
    /* getBoundingClientRect() forces a synchronous layout, and several of
       these loops run at once. Off-screen we sample it every 8th frame
       instead of every frame — ~90% less layout work while scrolling past,
       and it self-corrects (the rect read is what tells us we're back). */
    const loop = (t: number) => {
      if (!alive) return;
      if (onScreen || ++idle >= 8) {
        idle = 0;
        const r = el.getBoundingClientRect();
        const vh = window.innerHeight || 800;
        onScreen = r.bottom > -80 && r.top < vh + 80;
        if (onScreen) {
          /* +1 when the section is below the viewport, 0 centered, −1 above */
          const prog = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
          if (tilt) {
            rx.set(prog * maxX * 0.9);
            ry.set(Math.sin(t / 2600) * maxY * 0.22);
          }
          mx.set(r.width / 2 + Math.sin(t / 2400) * r.width * 0.3);
          my.set(r.height * 0.4 + Math.cos(t / 3100) * r.height * 0.22 - prog * r.height * 0.18);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else raf = requestAnimationFrame(loop);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref, scrollDrive, tilt, maxX, maxY, mx, my, rx, ry]);

  return { interactive, live, tiltOn, ambientOn, srx, sry, smx, smy, reduce, fine };
}

/* ──────────────────────────────────────────────────────────────────────────
   MobileScroll3D — a strong scroll-linked 3D lift for a single card, TOUCH
   ONLY. Desktop (fine pointer, wide) renders the children with NO wrapper at
   all, so the mouse-driven experience there is byte-for-byte unchanged.

   On a phone: the card enters tilted back / pushed away / dimmed, rises to
   flat-upright-full as it reaches the vertical middle of the screen, then
   recedes gently as it exits the top. A faint continuous sway near center
   keeps it alive. Values are lerped for a buttery, scroll-tracking feel.
   ────────────────────────────────────────────────────────────────────────── */
function detectTouchMotion(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    return window.matchMedia("(pointer: coarse)").matches || window.matchMedia("(max-width: 767px)").matches;
  } catch {
    return false;
  }
}

export function MobileScroll3D({
  children,
  origin = "center center",
  maxTilt = 20,
  lift = 42,
}: {
  children: ReactNode;
  origin?: string;
  maxTilt?: number;
  lift?: number;
}) {
  const [enabled] = useState(detectTouchMotion);
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(maxTilt);
  const ry = useMotionValue(0);
  const ty = useMotionValue(lift);
  const sc = useMotionValue(0.9);
  const op = useMotionValue(0.5);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let alive = true;
    let first = true;
    let cRx = maxTilt;
    let cTy = lift;
    let cSc = 0.9;
    let cOp = 0.5;
    let idle = 0;
    let onScreen = true;
    /* three of these run at once (How I work, About, Contact). Sampling the
       rect every frame from each was a third of the scroll cost on a phone;
       off-screen they now sample every 8th frame. */
    const loop = (t: number) => {
      if (!alive) return;
      if (!onScreen && ++idle < 8) {
        raf = requestAnimationFrame(loop);
        return;
      }
      idle = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      onScreen = r.bottom > -160 && r.top < vh + 160;
      if (onScreen) {
        /* p: +1 fully below viewport center → 0 centered → −1 fully above */
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)));
        let tRx: number, tTy: number, tSc: number, tOp: number;
        if (p >= 0) {
          // entering from below: tilt back, sit low, pushed away, dimmed
          tRx = p * maxTilt;
          tTy = p * lift;
          tSc = 1 - p * 0.1;
          tOp = 1 - p * 0.5;
        } else {
          // past center, exiting the top: recede a little
          const q = -p;
          tRx = -q * (maxTilt * 0.5);
          tTy = -q * (lift * 0.36);
          tSc = 1 - q * 0.05;
          tOp = 1 - q * 0.3;
        }
        if (first) {
          cRx = tRx;
          cTy = tTy;
          cSc = tSc;
          cOp = tOp;
          first = false;
        } else {
          const k = 0.16;
          cRx += (tRx - cRx) * k;
          cTy += (tTy - cTy) * k;
          cSc += (tSc - cSc) * k;
          cOp += (tOp - cOp) * k;
        }
        rx.set(cRx);
        ry.set(Math.sin(t / 2600) * 2.6 * (1 - Math.abs(p))); // sway, strongest near center
        ty.set(cTy);
        sc.set(cSc);
        op.set(cOp);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [enabled, maxTilt, lift, rx, ry, ty, sc, op]);

  if (!enabled) return <>{children}</>;
  return (
    <motion.div
      ref={ref}
      style={{
        transformPerspective: 900,
        transformOrigin: origin,
        rotateX: rx,
        rotateY: ry,
        y: ty,
        scale: sc,
        opacity: op,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      {children}
    </motion.div>
  );
}

/* the lit dot grid. Interactive: spotlight pool + brighter dots near the
   cursor. Touch / reduced motion: a static soft glow. */
/* Radius of the two moving layers. The elements are fixed at this size with a
   STATIC gradient baked in and are moved by transform, so the compositor can
   slide them around without ever repainting — the previous version rebuilt a
   gradient string into `background` and `mask-image` on every frame. */
const LIGHT_R = 320;
const DOTS_R = 260;

export function Ambience({ d, entered = true }: { d: Diorama; entered?: boolean }) {
  const dotGrid: React.CSSProperties = {
    backgroundImage: "radial-gradient(rgba(106,116,136,0.35) 1px, transparent 1px)",
    backgroundSize: "34px 34px",
  };
  /* The bright dots live inside the moving mask, so on their own they would
     slide with it and the grid would visibly swim against the static dots
     underneath. Counter-translating the inner layer by the same amount pins
     the pattern to the section while the mask travels over it. Both halves are
     transforms, so this stays composited. */
  const dotsX = useTransform(d.smx, (v) => DOTS_R - v);
  const dotsY = useTransform(d.smy, (v) => DOTS_R - v);

  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={entered ? { opacity: 1 } : undefined}
      transition={{ duration: d.reduce ? 0.2 : 1.1, ease: EXPO }}
    >
      <div className="absolute inset-0" style={{ ...dotGrid, opacity: 0.12 }} />
      {d.live ? (
        <>
          {/* brighter dots, revealed by a static mask that travels with the light */}
          <motion.div
            className="absolute top-0 left-0 overflow-hidden"
            style={{
              width: DOTS_R * 2,
              height: DOTS_R * 2,
              marginLeft: -DOTS_R,
              marginTop: -DOTS_R,
              maskImage: "radial-gradient(circle closest-side, #000 25%, transparent 75%)",
              WebkitMaskImage: "radial-gradient(circle closest-side, #000 25%, transparent 75%)",
              x: d.smx,
              y: d.smy,
              willChange: "transform",
            }}
          >
            {/* Deliberately far larger than the mask window: it is pinned to
                the section origin while the window travels, so it has to be big
                enough to still be under the window when the light reaches the
                far corner of a section. maxWidth is reset because globals.css
                sets `* { max-width: 100% }`, which was silently clamping this
                to the parent's 520px and leaving the far side of the light with
                no bright dots under it. */}
            <motion.div
              className="absolute top-0 left-0"
              style={{
                ...dotGrid,
                opacity: 0.5,
                width: 2400,
                height: 2400,
                maxWidth: "none",
                maxHeight: "none",
                x: dotsX,
                y: dotsY,
              }}
            />
          </motion.div>
          {/* the pool of light itself */}
          <motion.div
            className="absolute top-0 left-0"
            style={{
              width: LIGHT_R * 2,
              height: LIGHT_R * 2,
              marginLeft: -LIGHT_R,
              marginTop: -LIGHT_R,
              background: "radial-gradient(circle closest-side, rgba(91,140,255,0.13), transparent 70%)",
              x: d.smx,
              y: d.smy,
              willChange: "transform",
            }}
          />
        </>
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(420px circle at 60% 40%, rgba(91,140,255,0.08), transparent 70%)" }}
        />
      )}
    </motion.div>
  );
}
