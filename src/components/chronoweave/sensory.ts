/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · sensory engine (brief §9)
   Three channels, one shared anti-habituation rule: no pattern, motif, or
   pulse repeats identically twice in a row (rotating pools, no-immediate-
   repeat picks).

   Haptics   → navigator.vibrate (Android Chrome). Everywhere else the same
               scheduled moments render as a DESIGNED visible pulse: the
               desktop bezel glows, the mobile wash ripples. The fallback is
               a behavior, not an apology (§9).
   Sound     → generative Web Audio: two detuned triangle oscillators through
               a low-pass filter with a slow LFO; warmth (from the Solar
               Engine) maps to filter cutoff and shimmer rate. Quarter-hour
               motifs are three notes whose contour encodes the quarter.
   Light     → the Solar Engine's wash + frame glow (already live).

   Audio starts only after a user gesture ("Begin my day" / first tap).
   ────────────────────────────────────────────────────────────────────────── */

/* Desktop Chrome EXPOSES navigator.vibrate but silently no-ops it, so the
   API check alone would lie. Real vibration ships on Android Chrome (§4) —
   say the truth there and only there. */
export const canVibrate =
  typeof navigator !== "undefined" && "vibrate" in navigator && /Android/i.test(navigator.userAgent || "");

/* fallback pulse event — FrameShell (bezel) and the app screen (ripple)
   both listen for this and render the visible pulse in sync */
export const HAPTIC_FALLBACK_EVENT = "cw-haptic-fallback";
function emitFallback(strength: 1 | 2 | 3) {
  window.dispatchEvent(new CustomEvent(HAPTIC_FALLBACK_EVENT, { detail: { strength } }));
}

/* ── anti-habituation pool picker: never the same index twice running ── */
export class RotatingPool<T> {
  private last = -1;
  constructor(private items: T[]) {}
  pick(): T {
    if (this.items.length === 1) return this.items[0];
    let i: number;
    do {
      i = Math.floor(Math.random() * this.items.length);
    } while (i === this.last);
    this.last = i;
    return this.items[i];
  }
}

/* ──────────────────────────────────────────────────────────────────────────
   HAPTICS — quarter-hour grammar (§9):
   Q1 = one soft pulse · Q2 = two · Q3 = three · Q4 = long-short.
   Each hour draws a "texture" from a pool of six: gap timing and amplitude
   shaping vary, so the same quarter never feels identical twice.
   (navigator.vibrate has no amplitude control — texture varies pulse WIDTH
   and gap rhythm instead, which reads as intensity on real hardware.)
   ────────────────────────────────────────────────────────────────────────── */
type Texture = { widen: number; gap: number };
const TEXTURES = new RotatingPool<Texture>([
  { widen: 1.0, gap: 140 },
  { widen: 0.8, gap: 180 },
  { widen: 1.2, gap: 120 },
  { widen: 0.9, gap: 220 },
  { widen: 1.1, gap: 160 },
  { widen: 1.0, gap: 200 },
]);

export function quarterPattern(quarter: 1 | 2 | 3 | 4, intensity: 1 | 2 | 3): number[] {
  const t = TEXTURES.pick();
  const base = 40 * t.widen * (0.75 + intensity * 0.25);
  const gap = t.gap;
  switch (quarter) {
    case 1:
      return [base];
    case 2:
      return [base, gap, base];
    case 3:
      return [base, gap, base, gap, base];
    case 4:
      return [base * 3, gap * 0.4, base]; // long–short
  }
}

/** fire a haptic moment; falls back to the designed visible pulse */
export function haptic(pattern: number[], intensity: 1 | 2 | 3 = 2) {
  if (canVibrate) {
    try {
      navigator.vibrate(pattern);
      return;
    } catch {
      /* fall through to visible pulse */
    }
  }
  emitFallback(intensity);
}

/* ──────────────────────────────────────────────────────────────────────────
   SOUND — generative, no audio files.
   ────────────────────────────────────────────────────────────────────────── */

/* quarter contours (§9): rising / level / falling / rise-fall,
   as semitone offsets from a mode root */
const CONTOURS: Record<1 | 2 | 3 | 4, number[]> = {
  1: [0, 4, 7], // rising
  2: [4, 4, 4], // level
  3: [7, 4, 0], // falling
  4: [0, 7, 4], // rise-fall
};
/* small pool of modes (root offsets in semitones from A3) for rotation */
const MODES = new RotatingPool<number>([0, 2, 5, 7, -3]);

class AudioEngineImpl {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private padGain: GainNode | null = null;
  private oscA: OscillatorNode | null = null;
  private oscB: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;
  private _armed = false;
  private muted = false;
  private warmth = 0.3;
  private padFilter: BiquadFilterNode | null = null;
  private padWanted = false;

  get armed() {
    return this._armed;
  }

  /** The ambient pad exists only inside the app proper — never during
      onboarding or calibration. Ramps in/out over a couple of seconds. */
  padOn(on: boolean) {
    this.padWanted = on;
    if (!this.ctx || !this.padGain || !this.lfoGain) return;
    const t = this.ctx.currentTime;
    /* breathing envelope: gain = base + sine·amp with base = amp, so the
       trough touches true silence once per cycle */
    const peak = 0.055;
    this.padGain.gain.setTargetAtTime(on ? peak / 2 : 0, t, 1.2);
    this.lfoGain.gain.setTargetAtTime(on ? peak / 2 : 0, t, 1.2);
  }

  /** must be called from a user gesture (Web Audio autoplay rule, §4) */
  arm(): boolean {
    if (this._armed) {
      this.ctx?.resume();
      return true;
    }
    try {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctx) return false;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.04; // background presence, ~ -30 dB feel
      this.master.connect(this.ctx.destination);

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = "lowpass";
      this.filter.frequency.value = 1600;
      this.filter.Q.value = 0.4;
      this.filter.connect(this.master);

      /* ambient pad: two detuned triangles that BREATHE — the amplitude LFO
         swings the gain all the way to zero each cycle, so the pad swells
         out of silence and sinks back into it (a constant drone reads as
         buzz, and nothing in this app is allowed to drone). A3 not A2:
         an octave up trades hum for air on small speakers. The pad gets its
         OWN always-soft lowpass — the shared warmth filter opens bright in
         the morning, which is right for motifs and wrong for a drone. */
      this.padFilter = this.ctx.createBiquadFilter();
      this.padFilter.type = "lowpass";
      this.padFilter.frequency.value = 500;
      this.padFilter.Q.value = 0.2;
      this.padFilter.connect(this.master);

      this.padGain = this.ctx.createGain();
      this.padGain.gain.value = 0; // silent until padOn(true) — app phase only
      this.padGain.connect(this.padFilter);

      this.oscA = this.ctx.createOscillator();
      this.oscA.type = "triangle";
      this.oscA.frequency.value = 220; // A3
      this.oscB = this.ctx.createOscillator();
      this.oscB.type = "triangle";
      this.oscB.frequency.value = 220 * Math.pow(2, 3 / 1200); // +3 cents detune
      this.oscA.connect(this.padGain);
      this.oscB.connect(this.padGain);

      /* breathing: gain = base + lfo, tuned so the trough touches 0 */
      this.lfo = this.ctx.createOscillator();
      this.lfo.type = "sine";
      this.lfo.frequency.value = 0.08; // ~12s breath
      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.value = 0; // engaged by padOn()
      this.lfo.connect(this.lfoGain);
      this.lfoGain.connect(this.padGain.gain);

      this.oscA.start();
      this.oscB.start();
      this.lfo.start();
      this._armed = true;
      this.setWarmth(this.warmth);
      if (this.padWanted) this.padOn(true);
      return true;
    } catch {
      return false;
    }
  }

  /** During a focus ramp's final minutes the warmth is PINNED warm so the
      per-minute solar sync doesn't quietly undo the T-5 escalation. */
  private warmHold = false;
  holdWarm(on: boolean) {
    this.warmHold = on;
    if (on) this.applyWarmth(1);
    else this.applyWarmth(this.warmth);
  }

  /** Solar warmth 0 (bright morning) → 1 (warm evening):
      filter 2.4 kHz → 700 Hz, shimmer faster in the morning (§9) */
  setWarmth(w: number) {
    this.warmth = w;
    if (!this.warmHold) this.applyWarmth(w);
  }

  private applyWarmth(w: number) {
    if (!this.ctx || !this.filter || !this.lfo) return;
    const cutoff = 2400 - (2400 - 700) * w;
    this.filter.frequency.setTargetAtTime(cutoff, this.ctx.currentTime, 2);
    /* breath rate stays a BREATH: ~10s bright morning → ~18s warm dusk.
       (Anything faster reads as throbbing, which reads as buzz.) */
    this.lfo.frequency.setTargetAtTime(0.1 - 0.045 * w, this.ctx.currentTime, 2);
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.ctx && this.master) {
      this.master.gain.setTargetAtTime(m ? 0 : 0.04, this.ctx.currentTime, 0.15);
    }
  }

  /** three-note quarter motif; contour encodes the quarter, mode rotates */
  playQuarterMotif(quarter: 1 | 2 | 3 | 4, intensity: 1 | 2 | 3 = 2) {
    this.playContour(CONTOURS[quarter], intensity);
  }

  /** short two-note preview for the channel tray / onboarding */
  playPreview(intensity: 1 | 2 | 3 = 2) {
    this.playContour([0, 7], intensity, 0.22);
  }

  /** calibration Echo: a single soft tone swelling across `seconds` */
  playSwell(seconds: number) {
    if (!this._armed || !this.ctx || !this.filter || this.muted) return;
    const t0 = this.ctx.currentTime + 0.02;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 220;
    const g = this.ctx.createGain();
    g.gain.value = 0;
    osc.connect(g);
    g.connect(this.filter);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.11, t0 + seconds * 0.35);
    g.gain.setValueAtTime(0.11, t0 + seconds * 0.7);
    g.gain.exponentialRampToValueAtTime(0.0004, t0 + seconds);
    osc.start(t0);
    osc.stop(t0 + seconds + 0.1);
  }

  /** calibration Pulse: one short metronome tick */
  playTick() {
    if (!this._armed || !this.ctx || !this.filter || this.muted) return;
    const t0 = this.ctx.currentTime + 0.01;
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 660;
    const g = this.ctx.createGain();
    osc.connect(g);
    g.connect(this.filter);
    g.gain.setValueAtTime(0.09, t0);
    g.gain.exponentialRampToValueAtTime(0.0004, t0 + 0.09);
    osc.start(t0);
    osc.stop(t0 + 0.12);
  }

  private playContour(offsets: number[], intensity: 1 | 2 | 3, step = 0.3) {
    if (!this._armed || !this.ctx || !this.filter || this.muted) return;
    const root = 220 * Math.pow(2, MODES.pick() / 12); // around A3
    const t0 = this.ctx.currentTime + 0.02;
    const vol = 0.05 + intensity * 0.035;
    offsets.forEach((semi, i) => {
      const osc = this.ctx!.createOscillator();
      osc.type = "sine";
      osc.frequency.value = root * Math.pow(2, semi / 12);
      const g = this.ctx!.createGain();
      g.gain.value = 0;
      osc.connect(g);
      g.connect(this.filter!);
      const t = t0 + i * step;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(vol, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0004, t + step * 1.9);
      osc.start(t);
      osc.stop(t + step * 2);
    });
  }
}

export const audio = new AudioEngineImpl();

/* ── light preview: one warm pulse of the wash (onboarding demo) ── */
export const LIGHT_PULSE_EVENT = "cw-light-pulse";
export function lightPulse() {
  window.dispatchEvent(new CustomEvent(LIGHT_PULSE_EVENT));
}
