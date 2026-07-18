/* ──────────────────────────────────────────────────────────────────────────
   Hero sound — synthesized, no audio files. ONE moment only: the intro
   assembly swell that lands on a warm chime. Nothing else on the page
   makes a sound.

   Browsers refuse audio before the first tap/click (autoplay policy), so
   this module has two doors:
     · introAttempt()  — polite autoplay try when the intro starts; works
                         for returning visitors the browser already trusts
     · gestureUnlock() — a first tap/keypress DURING the assembly joins the
                         swell in progress; after the intro, nothing plays
   ────────────────────────────────────────────────────────────────────────── */

let ctx: AudioContext | null = null;
let swellPlayed = false;
let outputUnlocked = false;
let introStartMs: number | null = null;
let introDurSec = 3.3;

function ensure(): AudioContext | null {
  if (ctx) return ctx;
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    return ctx;
  } catch {
    return null;
  }
}

/** seconds of assembly still ahead; full duration before the intro starts */
function remainingNow(): number {
  if (introStartMs == null) return introDurSec;
  return introDurSec - (performance.now() - introStartMs) / 1000;
}

/* iPhone mute-switch bypass: Web Audio is classified as "sound effects" and
   the hardware silent switch kills it. Flipping the audio session to
   "playback" (iOS 16.4+) and kicking a near-silent <audio> element inside
   the first real gesture reroutes us as media, which the switch spares.
   Harmless everywhere else. */
function unlockOutput() {
  if (outputUnlocked) return;
  outputUnlocked = true;
  try {
    const s = (navigator as any).audioSession;
    if (s && typeof s.type === "string") s.type = "playback";
  } catch {
    /* not iOS, fine */
  }
  try {
    // hand-built 50ms silent WAV — no asset, no magic base64
    const rate = 8000;
    const n = 400;
    const bytes = new Uint8Array(44 + n * 2);
    const dv = new DataView(bytes.buffer);
    const w = (o: number, s: string) => {
      for (let i = 0; i < s.length; i++) bytes[o + i] = s.charCodeAt(i);
    };
    w(0, "RIFF");
    dv.setUint32(4, 36 + n * 2, true);
    w(8, "WAVEfmt ");
    dv.setUint32(16, 16, true);
    dv.setUint16(20, 1, true);
    dv.setUint16(22, 1, true);
    dv.setUint32(24, rate, true);
    dv.setUint32(28, rate * 2, true);
    dv.setUint16(32, 2, true);
    dv.setUint16(34, 16, true);
    w(36, "data");
    dv.setUint32(40, n * 2, true);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    const a = new Audio("data:audio/wav;base64," + btoa(bin));
    a.volume = 0.01;
    void a.play().catch(() => {});
  } catch {
    /* ignore */
  }
}
/* ── building blocks ── */
function swell(c: AudioContext, durationSec: number) {
  swellPlayed = true;
  const t0 = c.currentTime + 0.05;

  /* airy noise drawn upward through a rising bandpass */
  const buf = c.createBuffer(1, Math.ceil(c.sampleRate * (durationSec + 1)), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = c.createBufferSource();
  src.buffer = buf;
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 1.1;
  bp.frequency.setValueAtTime(240, t0);
  bp.frequency.exponentialRampToValueAtTime(2400, t0 + durationSec);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.09, t0 + durationSec * 0.72);
  g.gain.exponentialRampToValueAtTime(0.0004, t0 + durationSec + 0.5);
  src.connect(bp);
  bp.connect(g);
  g.connect(c.destination);
  src.start(t0);
  src.stop(t0 + durationSec + 0.8);

  chime(c, t0 + Math.max(0.1, durationSec - 0.35), 0.11);
}

function chime(c: AudioContext, at: number, vol: number) {
  [523.25, 783.99].forEach((f, i) => {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = c.createGain();
    const t = at + i * 0.12;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + 0.06);
    g.gain.exponentialRampToValueAtTime(0.0004, t + 1.6);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t);
    osc.stop(t + 1.8);
  });
}

/* ── public doors ── */

/** polite autoplay attempt as the intro starts */
export function introAttempt(durationSec = 3.3) {
  introDurSec = durationSec;
  introStartMs = performance.now();
  const c = ensure();
  if (!c || swellPlayed) return;
  if (c.state === "running") {
    swell(c, durationSec);
    return;
  }
  /* When autoplay is blocked, resume() doesn't reject — it stays PENDING
     until the user's first gesture finally unlocks the context. That can
     be seconds (or minutes) later, so on resolve we recompute what's left
     of the assembly and only join if it's still in progress. The intro
     sound must never play after the intro. */
  c.resume()
    .then(() => {
      const rem = remainingNow();
      if (c.state === "running" && !swellPlayed && rem > 0.5) swell(c, Math.min(durationSec, rem));
    })
    .catch(() => {});
}

/** the first real gesture: reroute iOS output, resume the context, and if
    the assembly is still forming, join the swell for whatever remains */
export function gestureUnlock() {
  unlockOutput(); // must happen inside the gesture
  const c = ensure();
  if (!c) return;
  const go = () => {
    const rem = remainingNow();
    if (swellPlayed || rem <= 0.5) return;
    swell(c, rem);
  };
  if (c.state === "running") go();
  else c.resume().then(go).catch(() => {});
}
