/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · store
   Local-first state (brief §3): everything lives in localStorage under
   cw:v1. No backend, no telemetry — the Settings screen says so, and the
   code keeps that promise. Export/erase implemented here.
   ────────────────────────────────────────────────────────────────────────── */
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import type { TimeSignature, MedWindow, SolarConfig } from "./solar";
import { DEFAULT_SOLAR } from "./solar";

export interface Anchor {
  id: string;
  name: string;
  timeMin: number; // minutes since midnight, today
}

export type ChannelId = "haptic" | "sound" | "light";
export interface ChannelState {
  enabled: boolean;
  intensity: 1 | 2 | 3; // soft / standard / firm
  restUntil: number | null; // epoch ms — long-press mute for an hour
}

export interface QuietHours {
  enabled: boolean;
  startMin: number;
  endMin: number;
}

export interface FocusSession {
  intent: string;
  startedAt: number; // epoch ms
  plannedMin: number; // planned duration in minutes
  ramp: "gentle" | "firm";
  extensions: number; // 0..2 ("5 more minutes")
  /** set when surfaced; session then moves to history */
  surfacedAt?: number;
}

export interface SessionRecord {
  intent: string;
  startedAt: number;
  plannedMin: number;
  actualMin: number;
  sample?: boolean; // seeded demo history, replaced by real sessions
}

export interface DriftDay {
  /** ISO date */
  day: string;
  /** average drift for the day: felt-rate deviation from 1.0, e.g. -0.22 */
  drift: number;
  sample?: boolean;
}

export interface CWState {
  phase: "onboarding" | "calibration" | "app";
  onboardingStep: number;
  signature: TimeSignature | null;
  signatureHistory: TimeSignature[];
  anchors: Anchor[];
  channels: Record<ChannelId, ChannelState>;
  quietHours: QuietHours;
  loudEnvironments: string[]; // from calibration Your Day
  loudActive: boolean; // manual "I'm somewhere loud" toggle
  med: MedWindow;
  solarCfg: SolarConfig;
  useRealSun: boolean;
  focus: FocusSession | null;
  sessions: SessionRecord[];
  driftDays: DriftDay[];
  audioArmed: boolean; // Web Audio unlocked by a user gesture this visit
}

const KEY = "cw:v1";

const defaultChannels = (): Record<ChannelId, ChannelState> => ({
  haptic: { enabled: true, intensity: 2, restUntil: null },
  sound: { enabled: true, intensity: 2, restUntil: null },
  light: { enabled: true, intensity: 2, restUntil: null },
});

export function defaultState(): CWState {
  return {
    phase: "onboarding",
    onboardingStep: 0,
    signature: null,
    signatureHistory: [],
    anchors: [],
    channels: defaultChannels(),
    quietHours: { enabled: false, startMin: 22 * 60, endMin: 7 * 60 },
    loudEnvironments: [],
    loudActive: false,
    med: { enabled: false, startMin: 8 * 60, durationMin: 8 * 60 },
    solarCfg: DEFAULT_SOLAR,
    useRealSun: false,
    focus: null,
    sessions: [],
    driftDays: [],
    audioArmed: false,
  };
}

function load(): CWState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    // merge over defaults so new fields never crash old saves
    const base = defaultState();
    return { ...base, ...parsed, channels: { ...base.channels, ...(parsed.channels || {}) }, audioArmed: false };
  } catch {
    return defaultState();
  }
}

function persist(st: CWState) {
  try {
    const { audioArmed, ...rest } = st; // audioArmed is per-visit, not persisted
    localStorage.setItem(KEY, JSON.stringify(rest));
  } catch {
    /* storage unavailable: run in-memory */
  }
}

/* ── seeded sample history (user-approved): a plausible 14 days consistent
      with the visitor's own signature, honestly labeled sample:true and
      replaced as real data accrues ── */
export function seedSample(sig: TimeSignature): { driftDays: DriftDay[]; sessions: SessionRecord[] } {
  const days: DriftDay[] = [];
  const base = sig.rate - 1; // e.g. -0.22 for a slow clock
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // deterministic-ish wobble from the day index; Tuesdays lean harder
    const wobble = Math.sin(i * 2.13) * sig.variability * 0.6;
    const tuesday = d.getDay() === 2 ? base * 0.25 : 0;
    days.push({ day: d.toISOString().slice(0, 10), drift: +(base + wobble + tuesday).toFixed(3), sample: true });
  }
  const intents = ["Deep work", "Writing", "Sketching", "Reading", "Editing", "Prototyping"];
  const sessions: SessionRecord[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    d.setHours(10 + (i % 6), 12, 0, 0);
    const planned = [45, 60, 90][i % 3];
    const over = i % 4 === 0 ? planned * Math.abs(base) * sig.loadFactor : planned * Math.abs(base) * 0.4;
    sessions.push({
      intent: intents[i % intents.length],
      startedAt: d.getTime(),
      plannedMin: planned,
      actualMin: Math.round(planned + over),
      sample: true,
    });
  }
  return { driftDays: days, sessions };
}

/* ── context ── */
interface CWStore {
  st: CWState;
  set: (patch: Partial<CWState> | ((prev: CWState) => Partial<CWState>)) => void;
  exportJSON: () => string;
  eraseAll: () => void;
}
const Ctx = createContext<CWStore | null>(null);

export function CWProvider({ children }: { children: ReactNode }) {
  const [st, setSt] = useState<CWState>(load);
  const stRef = useRef(st);
  stRef.current = st;

  const set: CWStore["set"] = (patch) => {
    setSt((prev) => {
      const p = typeof patch === "function" ? patch(prev) : patch;
      const next = { ...prev, ...p };
      persist(next);
      return next;
    });
  };

  const exportJSON = () => {
    const { audioArmed, ...rest } = stRef.current;
    return JSON.stringify(rest, null, 2);
  };

  const eraseAll = () => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
    setSt(defaultState());
  };

  // midnight housekeeping: yesterday's anchors don't linger
  useEffect(() => {
    const today = new Date().toDateString();
    const stamp = localStorage.getItem("cw:day");
    if (stamp && stamp !== today && stRef.current.anchors.length) {
      set({ anchors: [] });
    }
    try {
      localStorage.setItem("cw:day", today);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ st, set, exportJSON, eraseAll }), [st]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCW(): CWStore {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCW outside CWProvider");
  return v;
}

/* small id helper */
export const uid = () => Math.random().toString(36).slice(2, 9);
