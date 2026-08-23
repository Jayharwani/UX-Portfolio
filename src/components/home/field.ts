import { bus, IMPACT_MS, type FieldBody } from "./fieldBus";

/* ──────────────────────────────────────────────────────────────────────────
   The field — particles as a MEDIUM rather than as background texture.

   The difference is entirely in four properties, and losing any one of them
   collapses this back into a starfield:

   1. Density is non-uniform (§3.1). A gaussian concentration around the
      headline, thinning toward the margins. This is the central move: you do
      not fill empty space with objects, you fill it with material. The area
      that currently reads as empty becomes the most substantial part of the
      composition.

   2. Particles have a home and inertia (§3.2). A slow spring, k=0.008,
      damping 0.94. Displaced material takes two to three seconds to settle.
      Anything faster reads as insect repellent rather than as a medium.

   3. Objects displace it (§3.3). Every physics body pushes particles out along
      the vector from its centre, quadratic falloff. Through a spatial hash so
      it stays O(n) rather than O(n x bodies).

   4. The cursor leaves a WAKE, not a repulsion (§3.5). The force runs along
      the pointer's velocity vector, not radially outward from it. That single
      distinction is most of the difference between cheap and convincing: a
      radial push says "get away from me", a directional one says "something
      moved through here".

   Rendering is deliberately unchanged from the tuned version: fillRect batched
   by colour bucket, alpha quantised, zero per-particle state changes. The
   performance work that got this to 1.28M backing pixels stands.
   ────────────────────────────────────────────────────────────────────────── */

export interface FieldParticle {
  x: number;
  y: number;
  /** field home, from the density sample */
  hx: number;
  hy: number;
  vx: number;
  vy: number;
  /** headline target, from the DOM sample; -1 when this particle never joins */
  tx: number;
  ty: number;
  /** second headline state, for the A/B morph */
  bx: number;
  by: number;
  size: number;
  bucket: number;
  /** does this particle take part in forming the headline? */
  word: boolean;
  /** per-particle window into the morph */
  mp: number;
  t0: number;
  drift: number;
}

export const FIELD_K = 0.008;
export const FIELD_DAMP = 0.94;
const GRID = 120;

/* ── §3.1 the density function ──────────────────────────────────────────── */
export function densityAt(
  x: number,
  y: number,
  hero: { w: number; h: number },
  head: { x: number; y: number; w: number; h: number }
) {
  /* distance from the headline's rectangle, not its centre — a wide block of
     type should build material along its whole length rather than in a dot */
  const dx = Math.max(head.x - x, 0, x - (head.x + head.w));
  const dy = Math.max(head.y - y, 0, y - (head.y + head.h));
  const d = Math.hypot(dx, dy);
  const core = Math.exp(-(d * d) / (2 * 340 * 340));
  const edge = 0.22;
  /* thin out at the very edges so the field has a soft boundary rather than a
     hard rectangular one */
  const ex = Math.min(x, hero.w - x) / (hero.w * 0.5);
  const ey = Math.min(y, hero.h - y) / (hero.h * 0.5);
  const vign = 1 - 0.4 * (1 - Math.min(1, Math.min(ex, ey) * 1.6));
  return (edge + core * 0.78) * vign;
}

/** Rejection-sample `count` homes against the density function. */
export function sampleHomes(
  count: number,
  hero: { w: number; h: number },
  head: { x: number; y: number; w: number; h: number }
) {
  const out: { x: number; y: number }[] = [];
  let guard = 0;
  while (out.length < count && guard < count * 60) {
    guard++;
    const x = Math.random() * hero.w;
    const y = Math.random() * hero.h;
    if (Math.random() < densityAt(x, y, hero, head)) out.push({ x, y });
  }
  /* if the guard tripped, top up uniformly rather than returning short */
  while (out.length < count) out.push({ x: Math.random() * hero.w, y: Math.random() * hero.h });
  return out;
}

/* ── the spatial hash ───────────────────────────────────────────────────── */
export class Grid {
  private cells = new Map<number, number[]>();
  private cols = 0;

  rebuild(parts: FieldParticle[], w: number) {
    this.cells.clear();
    this.cols = Math.max(1, Math.ceil(w / GRID));
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      const key = ((p.y / GRID) | 0) * this.cols + ((p.x / GRID) | 0);
      const c = this.cells.get(key);
      if (c) c.push(i);
      else this.cells.set(key, [i]);
    }
  }

  /** indices of particles within `r` of (x, y), by cell neighbourhood */
  near(x: number, y: number, r: number, out: number[]) {
    out.length = 0;
    const c0 = ((x - r) / GRID) | 0;
    const c1 = ((x + r) / GRID) | 0;
    const r0 = ((y - r) / GRID) | 0;
    const r1 = ((y + r) / GRID) | 0;
    for (let ry = r0; ry <= r1; ry++) {
      for (let cx = c0; cx <= c1; cx++) {
        const c = this.cells.get(ry * this.cols + cx);
        if (c) for (let i = 0; i < c.length; i++) out.push(c[i]);
      }
    }
  }
}

/* ── the step ───────────────────────────────────────────────────────────── */
export function stepField(
  parts: FieldParticle[],
  grid: Grid,
  width: number,
  dt: number,
  opts: { bodyStrength: number; wakeStrength: number; waveStrength: number }
) {
  grid.rebuild(parts, width);
  const hits: number[] = [];

  /* §3.3 objects displace the medium */
  for (let b = 0; b < bus.bodies.length; b++) {
    const body = bus.bodies[b] as FieldBody;
    const radius = Math.hypot(body.hw, body.hh) + 60;
    grid.near(body.x, body.y, radius, hits);
    for (let k = 0; k < hits.length; k++) {
      const p = parts[hits[k]];
      const dx = p.x - body.x;
      const dy = p.y - body.y;
      const d = Math.hypot(dx, dy);
      if (d > radius || d < 0.001) continue;
      const t = 1 - d / radius;
      const f = opts.bodyStrength * t * t;
      p.vx += (dx / d) * f;
      p.vy += (dy / d) * f;
    }
  }

  /* §3.4 pressure waves from landings */
  for (let i = bus.impacts.length - 1; i >= 0; i--) {
    const im = bus.impacts[i];
    im.life -= dt / (IMPACT_MS / 1000);
    if (im.life <= 0) {
      bus.impacts.splice(i, 1);
      continue;
    }
    const R = 220;
    grid.near(im.x, im.y, R, hits);
    for (let k = 0; k < hits.length; k++) {
      const p = parts[hits[k]];
      const dx = p.x - im.x;
      const dy = p.y - im.y;
      const d = Math.hypot(dx, dy);
      if (d > R || d < 0.001) continue;
      const t = 1 - d / R;
      const f = opts.waveStrength * im.power * im.life * t * t;
      p.vx += (dx / d) * f;
      p.vy += (dy / d) * f;
    }
  }

  /* §3.5 the cursor wake — DIRECTIONAL, along the pointer's travel */
  if (bus.pointerActive) {
    const sp = Math.hypot(bus.pvx, bus.pvy);
    if (sp > 0.5) {
      const R = 150;
      const ux = bus.pvx / sp;
      const uy = bus.pvy / sp;
      grid.near(bus.px, bus.py, R, hits);
      for (let k = 0; k < hits.length; k++) {
        const p = parts[hits[k]];
        const dx = p.x - bus.px;
        const dy = p.y - bus.py;
        const d = Math.hypot(dx, dy);
        if (d > R) continue;
        const t = 1 - d / R;
        /* carried ALONG the direction of travel rather than pushed away from
           the point — this is the whole difference between a wake and a
           repulsion, and it is the cheapest thing to get wrong */
        const f = opts.wakeStrength * t * t * Math.min(1, sp / 24);
        p.vx += ux * f;
        p.vy += uy * f;
      }
    }
  }

  /* §3.2 the slow return */
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    p.vx += (p.hx - p.x) * FIELD_K;
    p.vy += (p.hy - p.y) * FIELD_K;
    p.vx *= FIELD_DAMP;
    p.vy *= FIELD_DAMP;
    p.x += p.vx;
    p.y += p.vy;
  }
}
