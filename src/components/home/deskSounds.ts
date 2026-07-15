/* ──────────────────────────────────────────────────────────────────────────
   Desk sounds: synthesized with Web Audio — no audio files, no licensing.
   Each tap on a desk object gets its own sound: a loud coffee slurp, a bag
   zip, keyboard typing, and a soft phone chime. Context is created lazily
   on the first tap (browser gesture rule).
   ────────────────────────────────────────────────────────────────────────── */

let ctx: AudioContext | null = null;
function ac(): AudioContext | null {
  if (ctx) {
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return null;
    ctx = new Ctx();
    return ctx;
  } catch {
    return null;
  }
}

/** shared white-noise buffer */
let noiseBuf: AudioBuffer | null = null;
function noise(c: AudioContext): AudioBuffer {
  if (noiseBuf) return noiseBuf;
  noiseBuf = c.createBuffer(1, c.sampleRate * 1.2, c.sampleRate);
  const d = noiseBuf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noiseBuf;
}

/* ── the coffee slurp: suction sweep + wobble + a gulp at the end ───────── */
export function slurp() {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + 0.01;

  // suction: loud noise pulled through a wobbling, falling bandpass
  const src = c.createBufferSource();
  src.buffer = noise(c);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 2.2;
  bp.frequency.setValueAtTime(1500, t0);
  bp.frequency.exponentialRampToValueAtTime(320, t0 + 0.5);
  const wob = c.createOscillator(); // the slurpy wobble
  wob.frequency.value = 21;
  const wobG = c.createGain();
  wobG.gain.value = 380;
  wob.connect(wobG);
  wobG.connect(bp.frequency);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.55, t0 + 0.08);
  g.gain.setValueAtTime(0.55, t0 + 0.38);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.52);
  src.connect(bp);
  bp.connect(g);
  g.connect(c.destination);
  src.start(t0);
  src.stop(t0 + 0.6);
  wob.start(t0);
  wob.stop(t0 + 0.6);

  // the gulp
  const osc = c.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(280, t0 + 0.52);
  osc.frequency.exponentialRampToValueAtTime(95, t0 + 0.66);
  const og = c.createGain();
  og.gain.setValueAtTime(0.0001, t0 + 0.52);
  og.gain.exponentialRampToValueAtTime(0.4, t0 + 0.56);
  og.gain.exponentialRampToValueAtTime(0.001, t0 + 0.7);
  osc.connect(og);
  og.connect(c.destination);
  osc.start(t0 + 0.52);
  osc.stop(t0 + 0.72);
}

/* ── the zip: noise dragged through a rising bandpass, with teeth ───────── */
export function zip(open = true) {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + 0.01;
  const dur = 0.34;

  const src = c.createBufferSource();
  src.buffer = noise(c);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.Q.value = 1.6;
  if (open) {
    bp.frequency.setValueAtTime(500, t0);
    bp.frequency.exponentialRampToValueAtTime(5200, t0 + dur);
  } else {
    bp.frequency.setValueAtTime(5200, t0);
    bp.frequency.exponentialRampToValueAtTime(500, t0 + dur);
  }
  // zipper teeth: fast amplitude ripple
  const teeth = c.createGain();
  const lfo = c.createOscillator();
  lfo.type = "square";
  lfo.frequency.setValueAtTime(55, t0);
  lfo.frequency.linearRampToValueAtTime(90, t0 + dur);
  const lfoG = c.createGain();
  lfoG.gain.value = 0.32;
  lfo.connect(lfoG);
  lfoG.connect(teeth.gain);
  teeth.gain.value = 0.68;

  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(0.5, t0 + 0.05);
  g.gain.setValueAtTime(0.5, t0 + dur - 0.06);
  g.gain.exponentialRampToValueAtTime(0.001, t0 + dur + 0.05);

  src.connect(bp);
  bp.connect(teeth);
  teeth.connect(g);
  g.connect(c.destination);
  src.start(t0);
  src.stop(t0 + dur + 0.1);
  lfo.start(t0);
  lfo.stop(t0 + dur + 0.1);
}

/* ── typing: a jittered run of mechanical key clicks ────────────────────── */
export function typing(keys = 12) {
  const c = ac();
  if (!c) return;
  let t = c.currentTime + 0.02;
  for (let i = 0; i < keys; i++) {
    const src = c.createBufferSource();
    src.buffer = noise(c);
    const bp = c.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 2200 + Math.random() * 1800;
    bp.Q.value = 4;
    const g = c.createGain();
    const vol = 0.16 + Math.random() * 0.14;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
    // key "thock" body
    const osc = c.createOscillator();
    osc.type = "triangle";
    osc.frequency.value = 130 + Math.random() * 60;
    const og = c.createGain();
    og.gain.setValueAtTime(vol * 0.5, t);
    og.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    src.connect(bp);
    bp.connect(g);
    g.connect(c.destination);
    osc.connect(og);
    og.connect(c.destination);
    src.start(t);
    src.stop(t + 0.06);
    osc.start(t);
    osc.stop(t + 0.04);
    t += 0.07 + Math.random() * 0.075; // human jitter
  }
}
/** total length of a typing run in ms (for syncing the typewriter text) */
export const typingMs = (keys: number) => keys * 107;

/* ── phone chime: two soft partials, a small dawn ───────────────────────── */
export function chime() {
  const c = ac();
  if (!c) return;
  const t0 = c.currentTime + 0.01;
  [523.25, 659.25].forEach((f, i) => {
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = f;
    const g = c.createGain();
    const start = t0 + i * 0.09;
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(0.16, start + 0.03);
    g.gain.exponentialRampToValueAtTime(0.001, start + 0.7);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(start);
    osc.stop(start + 0.75);
  });
}
