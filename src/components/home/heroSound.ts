/* ──────────────────────────────────────────────────────────────────────────
   Hero intro sound — a soft synthesized swell that rises with the particle
   convergence and resolves on a warm two-note chime as the headline lands.
   No audio files. Browsers block autoplay before a user gesture: we try
   once, politely, and stay silent if refused (no retries, no nagging).
   ────────────────────────────────────────────────────────────────────────── */

let attempted = false;

export function playIntroSound(durationSec = 3.2) {
  if (attempted) return;
  attempted = true;
  try {
    const Ctx = window.AudioContext || (window as any).webkitAudioContext;
    if (!Ctx) return;
    const ctx: AudioContext = new Ctx();

    const go = () => {
      const t0 = ctx.currentTime + 0.05;
      const master = ctx.createGain();
      master.gain.value = 0.8;
      master.connect(ctx.destination);

      /* the swell: airy noise drawn upward through a rising bandpass */
      const buf = ctx.createBuffer(1, ctx.sampleRate * (durationSec + 1), ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.Q.value = 1.1;
      bp.frequency.setValueAtTime(240, t0);
      bp.frequency.exponentialRampToValueAtTime(2400, t0 + durationSec);
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.0001, t0);
      ng.gain.exponentialRampToValueAtTime(0.09, t0 + durationSec * 0.72);
      ng.gain.exponentialRampToValueAtTime(0.0004, t0 + durationSec + 0.5);
      src.connect(bp);
      bp.connect(ng);
      ng.connect(master);
      src.start(t0);
      src.stop(t0 + durationSec + 0.8);

      /* the resolve: C5 + G5, softly, right as the text lands */
      const land = t0 + durationSec - 0.35;
      [523.25, 783.99].forEach((f, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = f;
        const g = ctx.createGain();
        const at = land + i * 0.12;
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.11, at + 0.06);
        g.gain.exponentialRampToValueAtTime(0.0004, at + 1.6);
        osc.connect(g);
        g.connect(master);
        osc.start(at);
        osc.stop(at + 1.8);
      });

      /* close the context once everything has rung out */
      window.setTimeout(() => ctx.close().catch(() => {}), (durationSec + 3) * 1000);
    };

    if (ctx.state === "running") {
      go();
    } else {
      ctx
        .resume()
        .then(() => {
          if (ctx.state === "running") go();
          else ctx.close().catch(() => {});
        })
        .catch(() => ctx.close().catch(() => {}));
    }
  } catch {
    /* silence is fine */
  }
}
