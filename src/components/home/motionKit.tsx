import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import { useState, useEffect, useRef, type RefObject, type ReactNode } from "react";
import { usePerfTier } from "./perfTier";

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

/* Is this element on screen right now?
   Looping decorations (`repeat: Infinity`) keep running for the life of the
   page otherwise — a DevTools recording of the site showed the Animations track
   solid for 47 seconds straight, because roughly a dozen of them never stop
   whether or not anyone can see them. Framer drives those from the main thread,
   so each one is a style write every frame, forever. Gate them on this.
   Defaults to true so that a browser which accepts an observer and never
   delivers to it (some in-app webviews) shows the animation rather than a
   frozen decoration. */
export function useOnScreen(ref: RefObject<Element>, rootMargin = "120px") {
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, rootMargin]);
  return onScreen;
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
  /* On the lite tier the diorama collapses to its static form: no pointer
     loop, no idle drift, no scroll drive, and <Ambience> falls through to the
     fixed glow instead of the two layers that follow the cursor. Three of
     these run on the homepage at once, so this is the largest single saving
     available without changing the layout. */
  const lite = usePerfTier() === "lite";
  const interactive = fine && !reduce && !lite;
  const scrollDrive = !fine && !reduce && !lite;
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
    let onScreen = false;

    /* Visibility and size both come from observers, so the loop itself never
       touches the layout. An earlier version of this fix polled
       getBoundingClientRect() once per frame just to decide whether the
       section was on screen — with three sections that is three forced layouts
       every frame, interleaved with the motion-value writes that dirty style,
       which is precisely the read/write/read pattern that makes scrolling
       stutter. It was worse than the bug it replaced.
       A false negative from the observer is harmless here: the worst case is
       that an ambient flourish pauses. */
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
      if (!onScreen || document.hidden) return;
      if (performance.now() - lastMove.current > 4000) {
        mx.set(w / 2 + Math.sin(t / 2400) * w * 0.28);
        my.set(h / 2 + Math.cos(t / 3100) * h * 0.22);
      }
    };

    /* No webview guard on this one, unlike the other two: the drift is purely
       ambient, so a browser that never delivers observer callbacks simply gets
       a still spotlight rather than anything that looks broken. Not worth
       spending frames to rescue. */
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        if (onScreen && !raf) raf = requestAnimationFrame(drift);
        if (!onScreen && raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "80px" }
    );
    io.observe(el);

    return () => {
      alive = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
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
    let onScreen = false;

    /* This is scroll-linked, so it genuinely needs to know where the section
       sits every frame — but it does NOT need a fresh getBoundingClientRect to
       find out. The section's position in the document only changes when the
       layout above it changes; what moves each frame is the scroll offset. So
       measure once, then derive `top` from window.scrollY, which is a far
       cheaper read and identical for every one of these loops in the same
       frame. Re-measure on the events that can actually invalidate it, plus a
       slow safety tick for late-loading content above. */
    let docTop = 0;
    let elW = 0;
    let elH = 0;
    const measure = () => {
      const r = el.getBoundingClientRect();
      docTop = r.top + window.scrollY;
      elW = r.width;
      elH = r.height;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);

    let sinceMeasure = 0;
    const loop = (t: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (!onScreen || document.hidden) return;
      if (++sinceMeasure >= 30) {
        sinceMeasure = 0;
        measure();
      }
      const vh = window.innerHeight || 800;
      const top = docTop - window.scrollY;
      /* +1 when the section is below the viewport, 0 centered, −1 above */
      const prog = Math.max(-1, Math.min(1, (top + elH / 2 - vh / 2) / (vh / 2 + elH / 2)));
      if (tilt) {
        rx.set(prog * maxX * 0.9);
        ry.set(Math.sin(t / 2600) * maxY * 0.22);
      }
      mx.set(elW / 2 + Math.sin(t / 2400) * elW * 0.3);
      my.set(elH * 0.4 + Math.cos(t / 3100) * elH * 0.22 - prog * elH * 0.18);
    };

    /* one synchronous pass on entry, then it self-schedules — same reasoning
       as MobileScroll3D, including the guard for webviews that accept an
       observer and never deliver to it */
    let ioFired = false;
    const io = new IntersectionObserver(
      ([e]) => {
        ioFired = true;
        onScreen = e.isIntersecting;
        if (onScreen) {
          measure();
          if (!raf) loop(performance.now());
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "80px" }
    );
    io.observe(el);

    const ioGuard = window.setTimeout(() => {
      if (ioFired || !alive) return;
      onScreen = true;
      measure();
      if (!raf) loop(performance.now());
    }, 1200);

    return () => {
      alive = false;
      window.clearTimeout(ioGuard);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", measure);
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
  /* Resting values, NOT the "entering" pose (tilted back, dimmed, pushed away).
     If the driving loop never runs — a browser where IntersectionObserver does
     not deliver, which does happen in some in-app webviews — a card seeded with
     the entering pose stays dim and tilted forever, which looks broken. Seeded
     neutral, the worst case is simply that the effect is absent. The loop snaps
     to the true pose on its first tick, and because it starts 160px before the
     card is visible, that snap happens off screen. */
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const ty = useMotionValue(0);
  const sc = useMotionValue(1);
  const op = useMotionValue(1);

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
    let onScreen = false;
    /* Three of these run at once (How I work, About, Contact) and each one used
       to take a getBoundingClientRect every frame — on a phone that was a large
       share of the scroll budget, and it is avoidable: the card's position in
       the document is stable, only the scroll offset moves. Measure once, derive
       from window.scrollY, and let an IntersectionObserver decide when to run at
       all. Re-measure on resize, on the card's own size changes, and on a slow
       tick so late-loading content above cannot leave it stale. */
    let docTop = 0;
    let elH = 0;
    const measure = () => {
      const r = el.getBoundingClientRect();
      docTop = r.top + window.scrollY;
      elH = r.height;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);

    let sinceMeasure = 0;
    const loop = (t: number) => {
      if (!alive) return;
      raf = requestAnimationFrame(loop);
      if (!onScreen || document.hidden) return;
      if (++sinceMeasure >= 30) {
        sinceMeasure = 0;
        measure();
      }
      {
        const vh = window.innerHeight || 800;
        const top = docTop - window.scrollY;
        /* p: +1 fully below viewport center → 0 centered → −1 fully above */
        const p = Math.max(-1, Math.min(1, (top + elH / 2 - vh / 2) / (vh / 2 + elH / 2)));
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
    };

    /* Run one pass synchronously on entry rather than waiting for the next
       frame, so there is no gap between becoming visible and the first tick.
       loop() schedules its own successor, so this both paints now and starts
       it. */
    let ioFired = false;
    const io = new IntersectionObserver(
      ([e]) => {
        ioFired = true;
        onScreen = e.isIntersecting;
        if (onScreen) {
          measure();
          if (!raf) loop(performance.now());
        } else if (raf) {
          cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { rootMargin: "160px" }
    );
    io.observe(el);

    /* Fallback for browsers that accept an observer and then never deliver to
       it — some embedded webviews do exactly that, which is why this file used
       plain rect polling before. If nothing has arrived shortly after mount,
       drive the loop unconditionally: it costs a little idle work off screen,
       and it is the difference between the effect being absent and the card
       being stuck in a pose. */
    const ioGuard = window.setTimeout(() => {
      if (ioFired || !alive) return;
      onScreen = true;
      measure();
      if (!raf) loop(performance.now());
    }, 1200);

    return () => {
      alive = false;
      window.clearTimeout(ioGuard);
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("resize", measure);
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
/* The light is one fixed-size element with a STATIC gradient baked in, moved by
   transform, so the compositor slides it without repainting. The original
   version rebuilt a gradient string into `background` every frame, which
   repainted a section-sized layer each time. */
const LIGHT_R = 320;

export function Ambience({ d, entered = true }: { d: Diorama; entered?: boolean }) {
  const dotGrid: React.CSSProperties = {
    backgroundImage: "radial-gradient(rgba(106,116,136,0.35) 1px, transparent 1px)",
    backgroundSize: "34px 34px",
  };

  /* There used to be a second moving layer here: brighter dots revealed through
     a travelling mask. It is gone deliberately. The drift animation keeps the
     light moving whenever the section is on screen and the pointer has been
     still — which is exactly what happens while someone scrolls — so that
     masked layer was re-rasterizing on every scroll frame, and an animated mask
     is the one thing the compositor cannot take off the main thread. Dropping
     it removes a mask and an oversized child layer per section; the pool of
     light was always the part that actually reads. */
  return (
    <motion.div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={entered ? { opacity: 1 } : undefined}
      transition={{ duration: d.reduce ? 0.2 : 1.1, ease: EXPO }}
    >
      <div className="absolute inset-0" style={{ ...dotGrid, opacity: 0.14 }} />
      {d.live ? (
        <motion.div
          className="absolute top-0 left-0"
          style={{
            width: LIGHT_R * 2,
            height: LIGHT_R * 2,
            marginLeft: -LIGHT_R,
            marginTop: -LIGHT_R,
            background: "radial-gradient(circle closest-side, rgba(91,140,255,0.15), transparent 70%)",
            x: d.smx,
            y: d.smy,
            willChange: "transform",
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(420px circle at 60% 40%, rgba(91,140,255,0.08), transparent 70%)" }}
        />
      )}
    </motion.div>
  );
}
