/* --------------------------------------------------------------------------
   ONE SPRING, TWO CONSUMERS.

   Everything that moves on this page is the same solver: the particle field
   integrates it per point per frame, and the interface gets it baked into a
   CSS `linear()` easing so a transition can carry the identical curve without
   JavaScript running during it.

   WHY NOT DURATIONS AND CUBIC BEZIERS. A bezier has no velocity to hand over.
   Interrupt one and it restarts from zero, which is why a dropdown you close
   while it is still opening snaps. A spring keeps its velocity through the
   reversal, and even the baked easings below inherit the shape of that: the
   overshoot in the curve is real physics, not a hand-placed control point.

   THE TOKENS ARE MATERIAL 3 EXPRESSIVE'S. Stiffness assumes unit mass and
   damping is a ratio, so 1.0 is critical and anything below it overshoots.
   Spatial movement gets the bounce; colour and opacity never do, because a
   colour that overshoots is a colour that is briefly wrong.
   -------------------------------------------------------------------------- */

export type SpringName =
  | "spatial-fast"
  | "spatial-default"
  | "spatial-slow"
  | "effects-fast"
  | "effects-default"
  | "effects-slow"
  | "formation";

export const SPRINGS: Record<SpringName, { stiffness: number; damping: number }> = {
  /** button press, small hover moves, the pin landing */
  "spatial-fast": { stiffness: 800, damping: 0.6 },
  /** the progress rail, the magnetic return, rolling digits */
  "spatial-default": { stiffness: 380, damping: 0.8 },
  /** large moves, formation tilt */
  "spatial-slow": { stiffness: 200, damping: 0.8 },
  /** hover colour and opacity */
  "effects-fast": { stiffness: 3800, damping: 1 },
  /** fades, text exits */
  "effects-default": { stiffness: 1600, damping: 1 },
  /** entrance fades */
  "effects-slow": { stiffness: 800, damping: 1 },
  /** the particle morphs themselves */
  formation: { stiffness: 120, damping: 0.82 },
};

/** Mass = 1. `s` is { x, v }. Call with fixed substeps of dt = 1 / 120. */
export function stepSpring(
  s: { x: number; v: number },
  target: number,
  stiffness: number,
  dampingRatio: number,
  dt: number,
): { x: number; v: number } {
  const c = 2 * dampingRatio * Math.sqrt(stiffness);
  s.v += (-stiffness * (s.x - target) - c * s.v) * dt;
  s.x += s.v * dt;
  return s;
}

/** at rest to within a thousandth, in both position and velocity */
const SETTLED = 0.001;
/** a ceiling, so a hypothetical under-damped token cannot hang the loop */
const MAX_SECONDS = 6;
const SUBSTEP = 1 / 120;

/**
 * The 0-to-1 step response of a spring, as a CSS `linear()` easing and the
 * time it actually takes to settle. Values above 1 are kept: that overshoot
 * is the whole reason for doing this rather than picking a bezier.
 */
export function springEasing(stiffness: number, dampingRatio: number, samples = 40): { css: string; ms: number } {
  const s = { x: 0, v: 0 };
  const trace: number[] = [0];
  let t = 0;
  while (t < MAX_SECONDS) {
    stepSpring(s, 1, stiffness, dampingRatio, SUBSTEP);
    t += SUBSTEP;
    trace.push(s.x);
    if (Math.abs(s.x - 1) < SETTLED && Math.abs(s.v) < SETTLED) break;
  }

  /* resample the trace onto an even grid, because linear() spaces its stops
     evenly unless each one is given a position, and even stops are half the
     characters */
  const out: string[] = [];
  for (let i = 0; i < samples; i++) {
    const u = (i / (samples - 1)) * (trace.length - 1);
    const lo = Math.floor(u);
    const hi = Math.min(trace.length - 1, lo + 1);
    const v = trace[lo] + (trace[hi] - trace[lo]) * (u - lo);
    out.push(v.toFixed(4).replace(/0+$/, "").replace(/\.$/, ""));
  }
  /* the last sample is the target by definition; rounding must not say
     otherwise or the element lands a thousandth short */
  out[out.length - 1] = "1";
  return { css: `linear(${out.join(",")})`, ms: Math.round(t * 1000) };
}

/**
 * Bake every token onto an element as --spring-<name> and --dur-<name>.
 * Once, at startup. Doing it per frame would be absurd; doing it at build
 * time would mean a generated file nobody can read.
 */
export function installSprings(el: HTMLElement): void {
  for (const [name, { stiffness, damping }] of Object.entries(SPRINGS)) {
    const { css, ms } = springEasing(stiffness, damping);
    el.style.setProperty(`--spring-${name}`, css);
    el.style.setProperty(`--dur-${name}`, `${ms}ms`);
  }
}
