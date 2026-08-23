import { bus } from "./fieldBus";

/* ──────────────────────────────────────────────────────────────────────────
   The light — one implied source, every surface relights from it.

   Two custom properties on :root, written once per frame. Not once per
   consumer: every card, the wash and the field all read the same --lx/--ly, so
   adding a consumer costs nothing and they can never disagree with each other.

   The two things that decide whether this reads as expensive or as a gimmick:

   · It must TRAIL. Lerp at 0.055, so the light arrives noticeably after the
     cursor. Instant tracking is the single clearest tell of an amateur
     implementation, and it is the default anyone reaches for.

   · It must never touch the headline. Light playing across type is precisely
     the move that turns this from expensive to tacky, so the h1 has no
     light-driven property at all.

   Idle behaviour matters as much as the tracking. After 4s without pointer
   movement — and permanently on touch, where there is no cursor to follow —
   the source drifts along a slow ellipse. The scene is never static and never
   depends on a pointer existing.
   ────────────────────────────────────────────────────────────────────────── */

export const LIGHT_LERP = 0.055;
const IDLE_AFTER_MS = 4000;
const DRIFT_PERIOD_MS = 24000;

let lx = 0;
let ly = 0;
let started = false;
let lastMove = 0;
let hasPointer = false;

export function notePointer(x: number, y: number) {
  bus.px = x;
  bus.py = y;
  lastMove = performance.now();
  hasPointer = true;
}

/** Call once per frame from the single ticker. `t` is seconds. */
export function updateLight(t: number, hero: { w: number; h: number }, root: HTMLElement) {
  const now = performance.now();
  const idle = !hasPointer || now - lastMove > IDLE_AFTER_MS;

  let targetX: number;
  let targetY: number;
  if (idle) {
    /* a slow ellipse, wider than it is tall so it reads as a light crossing a
       room rather than a circling spotlight */
    const a = ((now % DRIFT_PERIOD_MS) / DRIFT_PERIOD_MS) * Math.PI * 2;
    targetX = hero.w * (0.5 + Math.cos(a) * 0.32);
    targetY = hero.h * (0.42 + Math.sin(a) * 0.18);
  } else {
    targetX = bus.px;
    targetY = bus.py;
  }

  if (!started) {
    lx = targetX;
    ly = targetY;
    started = true;
  }
  lx += (targetX - lx) * LIGHT_LERP;
  ly += (targetY - ly) * LIGHT_LERP;

  bus.lx = lx;
  bus.ly = ly;

  /* normalised, so consumers can express themselves in percentages without
     knowing the hero's pixel size */
  root.style.setProperty("--lx", (lx / Math.max(1, hero.w)).toFixed(4));
  root.style.setProperty("--ly", (ly / Math.max(1, hero.h)).toFixed(4));
  root.style.setProperty("--lxpx", `${lx.toFixed(1)}px`);
  root.style.setProperty("--lypx", `${ly.toFixed(1)}px`);
  root.style.setProperty("--lit", bus.lightUp.toFixed(3));
}

export function resetLight() {
  started = false;
  hasPointer = false;
  lastMove = 0;
}
