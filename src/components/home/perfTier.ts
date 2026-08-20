import { useEffect, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Device capability tier.

   Three rounds of optimisation made every individual effect on this site
   well-behaved, and it was still slow on other people's machines. The
   measurements said why. There is no leak — across repeated navigations,
   IntersectionObservers and listeners are created and destroyed in exactly
   equal numbers, and the DOM node count never moves. The scroll handlers cost
   0.12ms per event. Nothing is broken.

   The problem is the SUM. A smooth-scroll lerp, a particle canvas, a physics
   engine and three cursor-lit dioramas with their spring loops all run at
   once, and 16.7ms per frame does not stretch. Shaving each one further was
   never going to fix that.

   So decide once whether this machine can afford them. A capable desktop keeps
   everything. A weak one gets identical layout, type and content with the
   optional machinery switched off — the honest trade, because none of that
   machinery is what the portfolio is for.

   Two signals, deliberately:

   1. Hard signals, known before first paint — reduced motion, Save-Data, very
      low core count or memory. Cheap and reliable when present.

   2. A frame-time watchdog, because the hard signals miss the case that
      actually matters: a laptop reporting eight threads behind weak integrated
      graphics looks capable and is not. Sampling real frames catches what spec
      sheets cannot. It only ever downgrades, never upgrades, so nothing
      degrades in front of someone who was already doing fine.

   The result is computed ONCE per page load and shared. Every consumer reads
   the same value from the same watchdog rather than starting its own.
   ────────────────────────────────────────────────────────────────────────── */

export type Tier = "full" | "lite";

/** Frames slower than this mean the machine is not holding 60fps. */
const SLOW_FRAME_MS = 22;
/** Share of sampled frames that must be slow before downgrading. */
const SLOW_SHARE = 0.4;
/** Frames to discard at the start: mount, font swap and image decode make the
 *  first handful unrepresentative on every machine, fast ones included. */
const WARMUP_FRAMES = 12;
/** Frames to judge on. ~70 is a little over a second of healthy playback. */
const SAMPLE_FRAMES = 70;

function hardSignalsSayLite(): boolean {
  if (typeof window === "undefined") return false;
  /* Escape hatches, and the only way to see the other tier from a machine that
     always lands in one of them: ?lite=1 forces the degraded path, ?full=1
     forces everything on. Worth keeping — the reason this took several passes
     to get right is that the machine doing the building is a fast one. */
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.has("lite")) return true;
    if (q.has("full")) return false;
  } catch {
    /* URL unavailable — fall through to real signals */
  }
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  } catch {
    /* matchMedia unavailable — fall through to the other signals */
  }
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) return true;
  return false;
}

let current: Tier = typeof window === "undefined" ? "full" : hardSignalsSayLite() ? "lite" : "full";
let watchdogStarted = false;
const subscribers = new Set<(t: Tier) => void>();

function downgrade() {
  if (current === "lite") return;
  current = "lite";
  subscribers.forEach((fn) => fn(current));
}

function startWatchdog() {
  if (watchdogStarted || typeof window === "undefined") return;
  watchdogStarted = true;
  if (current === "lite") return; // nothing left to detect
  try {
    if (new URLSearchParams(window.location.search).has("full")) return; // pinned by hand
  } catch {
    /* ignore */
  }

  let last = performance.now();
  let warmup = WARMUP_FRAMES;
  let slow = 0;
  let total = 0;

  const sample = (now: number) => {
    const dt = now - last;
    last = now;

    if (warmup > 0) {
      warmup--;
      requestAnimationFrame(sample);
      return;
    }

    total++;
    if (dt > SLOW_FRAME_MS) slow++;

    if (total >= SAMPLE_FRAMES) {
      if (slow / total >= SLOW_SHARE) downgrade();
      return; // finished — this is a probe, not a permanent loop
    }
    requestAnimationFrame(sample);
  };

  requestAnimationFrame(sample);
}

/** Read the shared tier. Safe to call from as many components as you like. */
export function usePerfTier(): Tier {
  const [tier, setTier] = useState<Tier>(current);
  useEffect(() => {
    startWatchdog();
    if (current !== tier) setTier(current);
    subscribers.add(setTier);
    return () => {
      subscribers.delete(setTier);
    };
  }, [tier]);
  return tier;
}

/** Non-reactive read, for code outside React. */
export function getPerfTier(): Tier {
  return current;
}
