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
  const c = ensure();
  if (!c || swellPlayed) return;
  if (c.state === "running") {
    swell(c, durationSec);
  } else {
    c.resume()
      .then(() => {
        if (c.state === "running" && !swellPlayed) swell(c, durationSec);
      })
      .catch(() => {});
  }
}

/** first real gesture DURING the assembly: unlock audio and join the swell.
    Callers only invoke this while the intro is still forming. */
export function gestureUnlock(remainingIntroSec: number) {
  const c = ensure();
  if (!c) return;
  const go = () => {
    if (swellPlayed || remainingIntroSec <= 0.9) return;
    swell(c, remainingIntroSec);
  };
  if (c.state === "running") go();
  else c.resume().then(go).catch(() => {});
}
