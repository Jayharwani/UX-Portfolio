/* ──────────────────────────────────────────────────────────────────────────
   The bus between the three systems.

   v3's whole argument is that the field, the objects and the light are one
   world rather than three features sharing a viewport. That only works if the
   particle field knows where the physics bodies are, and the physics knows
   where the light is. Passing that through React props would mean a re-render
   per frame, which is exactly the wrong shape for something that updates 60
   times a second.

   So it is a plain module-scope record, written by the systems that own the
   data and read by the ones that need it, all inside the single existing
   gsap.ticker. No React involvement, no subscriptions, no per-frame garbage.

   Coordinates are HERO-LOCAL throughout — the particle canvas covers the hero,
   so everything is expressed in its space and converted once at the boundary.
   ────────────────────────────────────────────────────────────────────────── */

export interface FieldBody {
  /** centre, hero-local */
  x: number;
  y: number;
  /** half-extent of the bounding box, hero-local */
  hw: number;
  hh: number;
  /** how fast it is moving, for wake strength */
  speed: number;
}

export interface Impact {
  x: number;
  y: number;
  /** 0..1, decays to 0 over IMPACT_MS */
  life: number;
  /** impact velocity, scales the magnitude */
  power: number;
}

export const IMPACT_MS = 600;

export const bus = {
  /** live physics bodies, rewritten each frame by the sandbox */
  bodies: [] as FieldBody[],
  /** active pressure waves; the field decays and prunes them */
  impacts: [] as Impact[],

  /** pointer in hero-local space, plus its per-frame velocity */
  px: -9999,
  py: -9999,
  pvx: 0,
  pvy: 0,
  pointerActive: false,

  /** the light, hero-local. Trails the pointer; see updateLight. */
  lx: 0,
  ly: 0,
  /** 0..1 — the scene assembles unlit and the light comes up last (§6) */
  lightUp: 0,
};

/** Called by the sandbox when a body lands. */
export function pushImpact(x: number, y: number, power: number) {
  /* cap the queue: a card bouncing repeatedly should not accumulate waves
     faster than they decay */
  if (bus.impacts.length > 8) bus.impacts.shift();
  bus.impacts.push({ x, y, life: 1, power: Math.min(1, power) });
}

export function resetBus() {
  bus.bodies = [];
  bus.impacts = [];
  bus.px = -9999;
  bus.py = -9999;
  bus.pvx = 0;
  bus.pvy = 0;
  bus.pointerActive = false;
  bus.lightUp = 0;
}
