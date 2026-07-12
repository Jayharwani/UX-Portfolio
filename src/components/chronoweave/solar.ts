/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · Solar Engine
   The single source of truth for time → appearance (brief §6).

   Every minute (drift-corrected) it computes a solar position s ∈ [0,1] from
   local time against the sunrise/sunset curve, then writes CSS variables on
   the app root: the ambient wash, the frame-glow color/intensity, and an
   audio-warmth value the sound engine reads. Everything ambient derives from
   this one value.

   It also owns feltTime(): the projected time the user FEELS it is, from
   their calibration Time Signature.

   Deviation from the brief, documented: variables are set on the app root
   element (`.cw-root`) rather than document :root, because this prototype
   lives inside the portfolio SPA and must not collide with site tokens.
   All variables are prefixed --cw-.
   ────────────────────────────────────────────────────────────────────────── */

export interface SolarState {
  /** minutes since local midnight */
  minutes: number;
  /** s ∈ [0,1]: 0 = sunrise, 1 = sunset, clamped through night */
  s: number;
  /** true between sunset and sunrise */
  night: boolean;
  /** current ambient wash color (hex) */
  wash: string;
  /** frame glow color (hex) + intensity 0..1 */
  glow: string;
  glowIntensity: number;
  /** 0 = bright morning, 1 = warm evening (audio filter + shimmer read this) */
  warmth: number;
  phaseName: "dawn" | "morning" | "noon" | "golden" | "dusk" | "night";
}

/* Ambient sky keyframes across the 24h day (brief §5, always pale).
   Positions are minutes since midnight for the DEFAULT curve 06:30–19:30;
   when a custom sunrise/sunset is set, daytime stops stretch linearly. */
const SKY = {
  night: "#E7E5F0",
  dawn: "#E9EDF7",
  morning: "#F4F6FA",
  noon: "#FCFCFD",
  golden: "#F8F1E8",
  dusk: "#EFEAF7",
};

export interface SolarConfig {
  sunriseMin: number; // minutes since midnight, default 390 (06:30)
  sunsetMin: number; // default 1170 (19:30)
}
export const DEFAULT_SOLAR: SolarConfig = { sunriseMin: 6 * 60 + 30, sunsetMin: 19 * 60 + 30 };

/* ── color math (hex ↔ rgb, linear interpolation — fine for pale washes) ── */
function hexToRgb(h: string): [number, number, number] {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
function rgbToHex(r: number, g: number, b: number): string {
  const c = (v: number) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0");
  return `#${c(r)}${c(g)}${c(b)}`;
}
export function mixHex(a: string, b: string, t: number): string {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex(ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t);
}

/* Piecewise wash timeline. Daytime stops are expressed as fractions of the
   sunrise→sunset span so a custom solar curve stretches naturally. */
interface Stop {
  at: number; // minutes since midnight (computed per config)
  color: string;
  name: SolarState["phaseName"];
}
function buildStops(cfg: SolarConfig): Stop[] {
  const rise = cfg.sunriseMin;
  const set = cfg.sunsetMin;
  const span = set - rise;
  return [
    { at: rise - 90, color: SKY.night, name: "night" }, // pre-dawn
    { at: rise, color: SKY.dawn, name: "dawn" },
    { at: rise + span * 0.2, color: SKY.morning, name: "morning" },
    { at: rise + span * 0.46, color: SKY.noon, name: "noon" },
    { at: rise + span * 0.85, color: SKY.golden, name: "golden" },
    { at: set, color: SKY.dusk, name: "dusk" },
    { at: set + 120, color: SKY.night, name: "night" },
  ];
}

/** Compute the full solar state for a given wall-clock time. */
export function solarState(now: Date, cfg: SolarConfig = DEFAULT_SOLAR): SolarState {
  const minutes = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const stops = buildStops(cfg);

  /* wash: interpolate between surrounding stops; outside the timeline
     (deep night) hold the night color */
  let wash = SKY.night;
  let phaseName: SolarState["phaseName"] = "night";
  if (minutes <= stops[0].at || minutes >= stops[stops.length - 1].at) {
    wash = SKY.night;
    phaseName = "night";
  } else {
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];
      if (minutes >= a.at && minutes <= b.at) {
        const t = (minutes - a.at) / (b.at - a.at || 1);
        wash = mixHex(a.color, b.color, t);
        phaseName = t < 0.5 ? a.name : b.name;
        break;
      }
    }
  }

  /* s: 0 at sunrise → 1 at sunset; clamp through night */
  const sRaw = (minutes - cfg.sunriseMin) / (cfg.sunsetMin - cfg.sunriseMin);
  const s = Math.max(0, Math.min(1, sRaw));
  const night = minutes < cfg.sunriseMin || minutes > cfg.sunsetMin;

  /* warmth: cool at dawn (0) → warm by dusk (1); night holds warm-dim.
     Eased so mid-day stays bright longer than the edges. */
  const warmth = night ? 0.85 : Math.pow(s, 1.6);

  /* frame glow: luminous violet, mixed slightly toward amber near golden
     hour. Intensity peaks at dawn/dusk shoulders, gentle at noon, low but
     present at night. */
  const edge = night ? 0.5 : 1 - Math.abs(s - 0.5) * 2; // 0 at noon edges…
  const shoulder = night ? 0.45 : 0.35 + 0.65 * Math.pow(1 - edge, 1.4);
  const glow = mixHex("#8B7CF6", "#E8B87F", night ? 0.05 : Math.max(0, s - 0.6) * 0.9);
  return { minutes, s, night, wash, glow, glowIntensity: shoulder, phaseName, warmth };
}

/* ──────────────────────────────────────────────────────────────────────────
   feltTime — the heart of the thesis.

   The Time Signature stores `rate`: felt minutes per actual minute.
     rate < 1  → inner clock runs SLOW  (an hour feels like 47 min)
     rate > 1  → inner clock runs FAST  (an hour feels like 70 min)

   Assumption (documented per brief §6/§9): perception re-anchors at natural
   boundaries — we anchor the projection at the most recent of (a) local
   sunrise or (b) the last completed calibration today. Drift accumulates
   from the anchor:  felt = anchor + (now − anchor) × rate.

   Medication window (brief §9): during the window the effective rate moves
   40% toward 1.0 (perception steadies); in the hour after it ends it moves
   20% away from 1.0 (rebound). This is an explicit modelling assumption.
   ────────────────────────────────────────────────────────────────────────── */
export interface TimeSignature {
  rate: number; // felt-minute per actual-minute, e.g. 0.78
  variability: number; // coefficient of variation from the Pulse test, 0..~0.4
  loadFactor: number; // multiplier on drift under load, e.g. 2.1
  steadiness: "steady" | "variable";
  slipPeriods: string[]; // from Your Day chips
  createdAt: number; // epoch ms
}

export interface MedWindow {
  enabled: boolean;
  startMin: number; // minutes since midnight
  durationMin: number;
}

export function effectiveRate(sig: TimeSignature, nowMin: number, med?: MedWindow): number {
  let rate = sig.rate;
  if (med?.enabled) {
    const end = med.startMin + med.durationMin;
    if (nowMin >= med.startMin && nowMin <= end) {
      rate = rate + (1 - rate) * 0.4; // window: steadies toward 1.0
    } else if (nowMin > end && nowMin <= end + 60) {
      rate = 1 + (rate - 1) * 1.2; // wear-off hour: leans away
    }
  }
  return rate;
}

export function feltNow(now: Date, sig: TimeSignature, cfg: SolarConfig = DEFAULT_SOLAR, med?: MedWindow): Date {
  const nowMin = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
  const anchorMin = Math.min(nowMin, cfg.sunriseMin); // before sunrise, no drift yet
  const elapsed = Math.max(0, nowMin - cfg.sunriseMin);
  const rate = effectiveRate(sig, nowMin, med);
  const feltMin = (elapsed === 0 ? nowMin : cfg.sunriseMin + elapsed * rate);
  const d = new Date(now);
  d.setHours(0, 0, 0, 0);
  d.setMinutes(Math.max(anchorMin, feltMin));
  return d;
}

/** felt duration for a real span of minutes, e.g. anchor distances */
export function feltMinutes(actualMinutes: number, sig: TimeSignature, nowMin: number, med?: MedWindow): number {
  return actualMinutes * effectiveRate(sig, nowMin, med);
}

/* ──────────────────────────────────────────────────────────────────────────
   Engine runner: writes CSS variables onto a root element once a minute
   (drift-corrected) and on demand. Supports a demo-time override (§13):
   when override ∈ [0,1440) is set, that clock time is used instead of now.
   ────────────────────────────────────────────────────────────────────────── */
export type SolarListener = (st: SolarState) => void;

export class SolarEngine {
  private el: HTMLElement | null = null;
  private cfg: SolarConfig = DEFAULT_SOLAR;
  private override: number | null = null; // demo minutes since midnight
  private timer: number | null = null;
  private listeners = new Set<SolarListener>();
  state: SolarState = solarState(new Date());

  attach(el: HTMLElement, cfg?: SolarConfig) {
    this.el = el;
    if (cfg) this.cfg = cfg;
    this.tick();
    this.schedule();
    document.addEventListener("visibilitychange", this.onVis);
  }
  detach() {
    if (this.timer) window.clearTimeout(this.timer);
    document.removeEventListener("visibilitychange", this.onVis);
    this.el = null;
    this.listeners.clear();
  }
  setConfig(cfg: SolarConfig) {
    this.cfg = cfg;
    this.tick();
  }
  setOverride(minutes: number | null) {
    this.override = minutes;
    this.tick();
  }
  getOverride() {
    return this.override;
  }
  /** the Date the app should treat as "now" (respects demo override) */
  now(): Date {
    if (this.override == null) return new Date();
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setMinutes(this.override);
    return d;
  }
  subscribe(fn: SolarListener) {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  private onVis = () => {
    if (document.visibilityState === "visible") this.tick();
  };

  private schedule() {
    // drift-corrected: wake shortly after the next minute boundary
    const ms = 60_000 - (Date.now() % 60_000) + 250;
    this.timer = window.setTimeout(() => {
      this.tick();
      this.schedule();
    }, ms);
  }

  tick() {
    const st = solarState(this.now(), this.cfg);
    this.state = st;
    if (this.el) {
      const set = (k: string, v: string) => this.el!.style.setProperty(k, v);
      set("--cw-wash", st.wash);
      set("--cw-glow", st.glow);
      set("--cw-glow-i", String(st.glowIntensity.toFixed(3)));
      set("--cw-warmth", String(st.warmth.toFixed(3)));
    }
    this.listeners.forEach((fn) => fn(st));
  }
}

/** singleton for the prototype */
export const solar = new SolarEngine();
