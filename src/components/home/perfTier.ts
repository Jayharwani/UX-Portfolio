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
/** Visible time after which an undecided watchdog settles to lite. */
const UNDECIDED_MS = 10000;

/* How long a remembered verdict stands before we re-test. A machine can get a
   new browser, a driver fix, or an external GPU; punishing it forever for one
   bad afternoon would be wrong. A month is long enough that a returning
   visitor never pays the cost twice in a session-realistic window. */
const MEMORY_KEY = "jh.tier.v1";
const MEMORY_MS = 30 * 24 * 60 * 60 * 1000;

function rememberedLite(): boolean {
  try {
    const raw = localStorage.getItem(MEMORY_KEY);
    if (!raw) return false;
    const at = Number(raw);
    if (!Number.isFinite(at) || Date.now() - at > MEMORY_MS) {
      localStorage.removeItem(MEMORY_KEY);
      return false;
    }
    return true;
  } catch {
    /* private mode or storage disabled — just re-test this load */
    return false;
  }
}

function rememberLite() {
  try {
    localStorage.setItem(MEMORY_KEY, String(Date.now()));
  } catch {
    /* nothing to do; the watchdog will reach the same verdict next load */
  }
}

function forgetLite() {
  try {
    localStorage.removeItem(MEMORY_KEY);
  } catch {
    /* ignore */
  }
}

function hardSignalsSayLite(): boolean {
  if (typeof window === "undefined") return false;
  /* Escape hatches, and the only way to see the other tier from a machine that
     always lands in one of them: ?lite=1 forces the degraded path, ?full=1
     forces everything on. Worth keeping — the reason this took several passes
     to get right is that the machine doing the building is a fast one. */
  try {
    const q = new URLSearchParams(window.location.search);
    if (q.has("lite")) return true;
    if (q.has("full")) {
      /* ?full is also the reset: a machine that has been remembered as slow
         needs a way back without clearing site data by hand. */
      forgetLite();
      return false;
    }
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
  /* A verdict this machine already earned. Checked before the spec-sheet
     signals because it is strictly better evidence: it came from real frames
     on this exact hardware, not from a number the browser reports. */
  if (rememberedLite()) return true;
  if (nav.connection?.saveData) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) return true;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4) return true;
  return false;
}

let current: Tier = typeof window === "undefined" ? "full" : hardSignalsSayLite() ? "lite" : "full";
/* Whether the tier is final. Anything expensive enough to be worth gating —
   the WebGL hero above all — waits for this rather than mounting on a timer
   and being torn down a second later. Mounting first and asking afterwards is
   the worst of both: the machine pays the full download, compile and context
   creation, then throws the result away. */
let decided = typeof window === "undefined" ? true : current === "lite";
let watchdogStarted = false;
const subscribers = new Set<(t: Tier) => void>();
const readySubs = new Set<(r: boolean) => void>();

function notifyReady() {
  decided = true;
  readySubs.forEach((fn) => fn(true));
}

function downgrade() {
  if (current === "lite") return;
  current = "lite";
  rememberLite();
  subscribers.forEach((fn) => fn(current));
}

function startWatchdog() {
  if (watchdogStarted || typeof window === "undefined") return;
  watchdogStarted = true;
  if (current === "lite") {
    notifyReady(); // nothing left to detect; the verdict is already final
    return;
  }
  try {
    if (new URLSearchParams(window.location.search).has("full")) {
      notifyReady(); // pinned by hand
      return;
    }
  } catch {
    /* ignore */
  }

  /* Failsafe. Gating the hero on a verdict means no verdict would mean no
     hero, forever, in any environment where rAF does not deliver. If we are
     still undecided after this long we settle to LITE rather than full: an
     environment that cannot produce 82 frames in ten visible seconds is not
     one to hand a WebGL scene to. It is not persisted, because a verdict we
     failed to measure is not evidence about the machine.

     The timer only counts while the page is visible — a backgrounded tab
     stalls rAF by design, and penalising it for that would mean anyone
     opening the site in a new tab lands on the degraded version. */
  let failsafe = 0;
  const armFailsafe = () => {
    failsafe = window.setTimeout(() => {
      if (decided) return;
      if (document.hidden) {
        armFailsafe();
        return;
      }
      current = "lite";
      subscribers.forEach((fn) => fn(current));
      notifyReady();
    }, UNDECIDED_MS);
  };
  armFailsafe();

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
      window.clearTimeout(failsafe);
      if (slow / total >= SLOW_SHARE) downgrade();
      notifyReady();
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

/** Whether the watchdog has returned a final verdict.

    Gate anything whose cost is not worth paying speculatively on this. The
    hero's WebGL chunk is 216 KB gzipped and creates a GL context; mounting it
    on a timer and unmounting it when the verdict lands means a slow machine
    pays the entire bill and keeps none of the benefit — every load. */
export function useTierReady(): boolean {
  const [ready, setReady] = useState(decided);
  useEffect(() => {
    startWatchdog();
    if (decided !== ready) setReady(decided);
    readySubs.add(setReady);
    return () => {
      readySubs.delete(setReady);
    };
  }, [ready]);
  return ready;
}

/** Non-reactive read, for code outside React. */
export function getPerfTier(): Tier {
  return current;
}
