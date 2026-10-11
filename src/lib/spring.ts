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

/** the raw 0-to-1 step response, one sample per substep */
function trace(stiffness: number, dampingRatio: number): { curve: number[]; seconds: number } {
  const s = { x: 0, v: 0 };
  const curve: number[] = [0];
  let t = 0;
  while (t < MAX_SECONDS) {
    stepSpring(s, 1, stiffness, dampingRatio, SUBSTEP);
    t += SUBSTEP;
    curve.push(s.x);
    if (Math.abs(s.x - 1) < SETTLED && Math.abs(s.v) < SETTLED) break;
  }
  return { curve, seconds: t };
}

/** sample a trace at 0 to 1, linearly between substeps */
function at(curve: number[], u: number): number {
  const i = Math.max(0, Math.min(1, u)) * (curve.length - 1);
  const lo = Math.floor(i);
  const hi = Math.min(curve.length - 1, lo + 1);
  return curve[lo] + (curve[hi] - curve[lo]) * (i - lo);
}

/**
 * THE SAME CURVE AS A FUNCTION, for animation engines that want one. GSAP
 * does not parse a CSS `linear()` string as an ease, so handing it the
 * generated string silently falls back to its own default and the page ends
 * up with two different motion systems that were supposed to be one.
 */
export function springEase(name: SpringName): { ease: (t: number) => number; duration: number } {
  const { stiffness, damping } = SPRINGS[name];
  const { curve, seconds } = trace(stiffness, damping);
  return { ease: (t) => at(curve, t), duration: seconds };
}

/**
 * The 0-to-1 step response of a spring, as a CSS `linear()` easing and the
 * time it actually takes to settle. Values above 1 are kept: that overshoot
 * is the whole reason for doing this rather than picking a bezier.
 */
export function springEasing(stiffness: number, dampingRatio: number, samples = 40): { css: string; ms: number } {
  const { curve: traced, seconds: t } = trace(stiffness, dampingRatio);

  /* resample the trace onto an even grid, because linear() spaces its stops
     evenly unless each one is given a position, and even stops are half the
     characters */
  const out: string[] = [];
  for (let i = 0; i < samples; i++) {
    out.push(
      at(traced, i / (samples - 1))
        .toFixed(4)
        .replace(/0+$/, "")
        .replace(/\.$/, ""),
    );
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
  /* A BROWSER THAT CANNOT PARSE linear() MUST NOT BE GIVEN ONE. Every
     transition here is written as var(--spring-x, cubic-bezier(...)), and a
     var() fallback only covers an UNSET variable, not one holding a value the
     browser cannot read: set it anyway and the whole transition declaration
     goes invalid, so the element does not ease at all, it cuts. Leaving the
     variable unset is what lets the bezier through. */
  if (!CSS.supports("transition-timing-function", "linear(0, 1)")) return;
  for (const [name, { stiffness, damping }] of Object.entries(SPRINGS)) {
    const { css, ms } = springEasing(stiffness, damping);
    el.style.setProperty(`--spring-${name}`, css);
    el.style.setProperty(`--dur-${name}`, `${ms}ms`);
  }
}
