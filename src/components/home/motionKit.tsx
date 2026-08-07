import {
  motion,
  useMotionValue,
  useSpring,
  useMotionTemplate,
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
  spotlight: MotionValue<string>;
  dotMask: MotionValue<string>;
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
  const spotlight = useMotionTemplate`radial-gradient(320px circle at ${smx}px ${smy}px, rgba(91,140,255,0.13), transparent 70%)`;
  const dotMask = useMotionTemplate`radial-gradient(260px circle at ${smx}px ${smy}px, black, transparent 75%)`;
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

  /* idle drift (cursor mode): after 4s without movement, the spotlight wanders */
  useEffect(() => {
    const el = ref.current;
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

  return { interactive, live, tiltOn, ambientOn, srx, sry, spotlight, dotMask, reduce, fine };
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
export function Ambience({ d, entered = true }: { d: Diorama; entered?: boolean }) {
  const dotGrid: React.CSSProperties = {
    backgroundImage: "radial-gradient(rgba(106,116,136,0.35) 1px, transparent 1px)",
    backgroundSize: "34px 34px",
  };
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={entered ? { opacity: 1 } : undefined}
      transition={{ duration: d.reduce ? 0.2 : 1.1, ease: EXPO }}
    >
      <div className="absolute inset-0" style={{ ...dotGrid, opacity: 0.12 }} />
      {d.live ? (
        <>
          <motion.div
            className="absolute inset-0"
            style={{ ...dotGrid, opacity: 0.5, maskImage: d.dotMask, WebkitMaskImage: d.dotMask }}
          />
          <motion.div className="absolute inset-0" style={{ background: d.spotlight }} />
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
