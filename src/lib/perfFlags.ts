/* ──────────────────────────────────────────────────────────────────────────
   TEMPORARY — bisect harness. Delete once the culprit is identified.

   Several optimisation passes were applied speculatively and the jank survived
   all of them, so stop guessing and isolate by elimination. Each flag disables
   exactly one subsystem. Record p95 frame time for each run; whichever single
   flag produces the largest delta is the bug.

   Usage:  /?perf=noLenis
           /?perf=noLenis,noMatter

   The symptom is desktop-only, and three of these subsystems are desktop-only
   by construction — Lenis and matter-js do not run on touch at all, and the
   canvas backing store is ten to twenty times larger on a desktop display than
   on a phone. That overlap is the reason to start here rather than with
   particle count, which differs by only ~2x between the two.
   ────────────────────────────────────────────────────────────────────────── */

function read(): string {
  if (typeof window === "undefined") return "";
  try {
    return new URLSearchParams(window.location.search).get("perf") ?? "";
  } catch {
    return "";
  }
}

const q = read();
const has = (name: string) => q.split(",").some((p) => p.trim() === name);

export const PERF = {
  /** Lenis smooth scroll: its own rAF loop, plus an easing tail that keeps
   *  every scroll-linked transform writing styles after the wheel stops. */
  noLenis: has("noLenis"),
  /** matter-js physics for the blocks band: its own solver and rAF loop. */
  noMatter: has("noMatter"),
  /** The hero particle canvas entirely — simulation, render and backing store. */
  noParticles: has("noParticles"),
  /** Framer Motion scroll-linked work: parallax transforms become static. */
  noMotion: has("noMotion"),
  /** The headline crossfade's animated filter: blur() and textShadow, which
   *  re-rasterise the layer on every frame of the transition. Opacity only. */
  noBlur: has("noBlur"),
  /** Cursor-lit dioramas: three sections' pointer, drift and spring loops. */
  noDiorama: has("noDiorama"),
} as const;

export const PERF_ACTIVE = q.length > 0;
export const PERF_QUERY = q;

/** Announce the active flags once, so a recording is never mislabelled. */
if (typeof window !== "undefined" && PERF_ACTIVE) {
  // eslint-disable-next-line no-console
  console.info(
    "%c[perf bisect]%c " + q,
    "background:#5B8CFF;color:#fff;padding:2px 6px;border-radius:3px",
    "color:#5B8CFF"
  );
}
