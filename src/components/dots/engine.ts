/* --------------------------------------------------------------------------
   THE DOT ENGINE.

   One primitive carries every explanatory graphic in the Friction case
   study: one dot is one review. Ten thousand of them drifting is the corpus;
   a handful lit is what gets read; dots falling through narrowing bands is
   the filter; survivors fusing is a challenge; a cluster fanning into four
   is the lenses.

   One particle array and one loop. A preset is a pair of pure functions —
   where the dots live, and where they should be at progress p — so adding a
   seventh costs a few lines rather than a second engine.

   PERFORMANCE. Canvas 2D beats WebGL here: ten thousand one-pixel rects is
   a handful of milliseconds, and a GL context costs more to create than the
   whole animation costs to run. DPR capped at 2. Colour changes are batched
   into luminance buckets, because flipping fillStyle ten thousand times a
   frame is the only way to make this expensive.

   EVERYTHING RUNS ONCE. A graphic that replays every time it re-enters the
   viewport is the single most irritating thing a scroll page does, so each
   scene plays on first sight and then holds its final state. The ambient
   drift is the exception and never stops being slow enough to ignore.
   -------------------------------------------------------------------------- */

export type Preset = "field" | "highlight" | "filter" | "cluster" | "fan" | "grid";

export type DotsOptions = {
  preset: Preset;
  /** how many reviews are on screen */
  count?: number;
  /** highlight: how many get read */
  keep?: number;
  /** filter: survivors after each band */
  bands?: number[];
  /** cluster / grid: how many dots in each group */
  groups?: number[];
  /** seconds the one-shot takes */
  duration?: number;
};

type P = {
  hx: number; hy: number;   // home, the resting field position
  x: number; y: number;     // current
  tx: number; ty: number;   // target
  r: number;                // stable rank, 0..1
  s: number;                // size seed
  ph: number;               // drift phase
  grp: number;              // group, for cluster / fan / grid
  live: number;             // 0..1 toward the lit colour
  gone: number;             // -1 alive, else the progress it was rejected at
};

type RGB = [number, number, number];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);
const smooth = (n: number) => n * n * (3 - 2 * n);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Read a CSS colour token and resolve it to real sRGB.
 *
 * NOT via getComputedStyle. Chrome does not serialize oklch() down to rgb():
 * it hands back "oklch(0.42 0.015 255)" verbatim, and pulling three numbers
 * out of that string yields rgb(0, 0, 255). Every dot on this page was being
 * drawn pure blue, and all four lens hues resolved to the same wrong value,
 * which is why they looked like one colour.
 *
 * A 1x1 canvas does the conversion with the browser's own colour engine and
 * works for any notation it supports. The pre-set black also detects an
 * unparseable value, since fillStyle silently ignores one.
 */
function resolve(el: HTMLElement, token: string, fallback: RGB): RGB {
  const v = getComputedStyle(el).getPropertyValue(token).trim();
  if (!v) return fallback;
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const g = c.getContext("2d", { willReadFrequently: true });
  if (!g) return fallback;
  g.fillStyle = "#000000";
  g.fillStyle = v;
  if (g.fillStyle === "#000000" && !/^#?0{3,6}$|black/i.test(v)) return fallback;
  g.fillRect(0, 0, 1, 1);
  const d = g.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

export function createScene(canvas: HTMLCanvasElement, host: HTMLElement, opts: DotsOptions) {
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return null;

  const N = opts.count ?? 2600;
  const DUR = (opts.duration ?? 1.6) * 1000;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const dim = resolve(host, "--dot-dim", [92, 101, 118]);
  const live = resolve(host, "--dot-live", [150, 220, 240]);
  const hues: RGB[] = [0, 1, 2, 3].map((i) =>
    resolve(host, `--lens-${i + 1}`, live)
  );

  let W = 0, H = 0, dpr = 1;
  const ps: P[] = new Array(N);

  /* a stable shuffled rank, so "the first k" is a spatially random k */
  const order = new Int32Array(N);
  for (let i = 0; i < N; i++) order[i] = i;
  for (let i = N - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    const t = order[i]; order[i] = order[j]; order[j] = t;
  }

  const layout = () => {
    for (let i = 0; i < N; i++) {
      const p = ps[i] ?? (ps[i] = {} as P);
      p.hx = Math.random() * W;
      p.hy = Math.random() * H;
      p.x = p.hx; p.y = p.hy;
      p.tx = p.hx; p.ty = p.hy;
      p.r = order[i] / N;
      p.s = 1 + Math.random() * 1.1;
      p.ph = Math.random() * Math.PI * 2;
      p.grp = 0;
      p.live = 0;
      p.gone = -1;
    }
    assign();
  };

  /* group membership, fixed once per layout */
  function assign() {
    const g = opts.groups ?? [];
    if (!g.length) return;
    const total = g.reduce((a, b) => a + b, 0) || 1;
    for (let i = 0; i < N; i++) {
      const p = ps[i];
      let acc = 0, k = 0;
      const share = p.r * total;
      for (; k < g.length; k++) { acc += g[k]; if (share < acc) break; }
      p.grp = Math.min(k, g.length - 1);
    }
  }

  const size = () => {
    const r = host.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layout();
  };

  /* ── where each preset wants its dots at progress p ── */
  function aim(p: number, t: number) {
    const drift = (d: P) => ({
      x: d.hx + Math.sin(t * 0.00013 + d.ph) * 9,
      y: d.hy + Math.cos(t * 0.00011 + d.ph * 1.7) * 9,
    });

    switch (opts.preset) {
      case "field": {
        for (const d of ps) { const o = drift(d); d.tx = o.x; d.ty = o.y; d.live = 0; }
        break;
      }
      case "highlight": {
        const k = (opts.keep ?? 25) / N;
        for (const d of ps) {
          const o = drift(d); d.tx = o.x; d.ty = o.y;
          /* lit ones come up one after another rather than together */
          d.live = d.r < k ? smooth(clamp01((p - d.r / k * 0.5) * 2.2)) : 0;
        }
        break;
      }
      case "filter": {
        /* A funnel that still reads when nothing moves.
           Earlier versions marched every dot downward and let the rejects
           fly off, so the end state was one horizontal line in an empty
           frame — fine mid-animation, meaningless the moment motion stops,
           and reduced motion gets exactly that frame.
           So each dot settles in the tier it reached: everything in the
           first, a third in the second, the survivors lit in the third.
           Three stacked bands of decreasing width is the shape of the idea,
           and it is legible as a still. */
        const bands = opts.bands ?? [0.332, 0.015];
        const gates = bands.length;
        const tiers = gates + 1;
        const tierH = H / tiers;

        for (const d of ps) {
          let depth = gates;
          for (let i = 0; i < gates; i++) if (d.r >= bands[i]) { depth = i; break; }

          const cy = tierH * (depth + 0.5);
          const wide = 1 - 0.3 * depth;
          const jitter = (d.r * 7919) % 1;
          /* deeper tiers arrive later, so it reads as falling through */
          const e = smooth(clamp01((p - depth * 0.16) / 0.72));

          d.tx = lerp(d.hx, W / 2 + (d.hx - W / 2) * wide, e);
          d.ty = lerp(d.hy, cy + (jitter - 0.5) * tierH * 0.62, e);
          d.live = depth === gates ? e : 0;
        }
        break;
      }
      case "cluster": {
        const g = opts.groups ?? [40, 28, 22, 16, 12, 9];
        const cols = Math.min(g.length, W < 560 ? 2 : 3);
        const rows = Math.ceil(g.length / cols);
        const e = smooth(p);
        for (const d of ps) {
          const gi = d.grp;
          const cx = ((gi % cols) + 0.5) * (W / cols);
          const cy = (Math.floor(gi / cols) + 0.5) * (H / rows);
          /* denser groups pull tighter, which is the whole point of the shot */
          const tight = 44 - Math.min(30, g[gi] * 0.45);
          const a = d.r * Math.PI * 2 * 97;
          const rad = (1 - e) * 180 + e * tight * (0.35 + (d.r * 7919) % 1);
          d.tx = lerp(d.hx, cx + Math.cos(a) * rad, e);
          d.ty = lerp(d.hy, cy + Math.sin(a) * rad, e);
          d.live = e;
        }
        break;
      }
      case "fan": {
        const e = smooth(p);
        for (const d of ps) {
          const gi = d.grp;
          const spread = (gi - 1.5) * (W / 4.6);
          const a = d.r * Math.PI * 2 * 97;
          const rad = 16 + ((d.r * 7919) % 1) * 22;
          const cx = W / 2 + spread * e;
          const cy = H * (0.5 + 0.12 * e);
          d.tx = lerp(W / 2 + Math.cos(a) * rad, cx + Math.cos(a) * rad, e);
          d.ty = lerp(H * 0.5 + Math.sin(a) * rad, cy + Math.sin(a) * rad, e);
          d.live = e;
        }
        break;
      }
      case "grid": {
        const g = opts.groups ?? [1, 1, 1, 1, 1, 1];
        const cols = Math.min(g.length, W < 560 ? 3 : 6);
        const rows = Math.ceil(g.length / cols);
        const e = smooth(p);
        for (const d of ps) {
          const gi = d.grp;
          const cx = ((gi % cols) + 0.5) * (W / cols);
          const cy = (Math.floor(gi / cols) + 0.35) * (H / rows);
          const a = d.r * Math.PI * 2 * 97;
          const rad = 10 + ((d.r * 7919) % 1) * 16;
          d.tx = lerp(d.hx, cx + Math.cos(a) * rad, e);
          d.ty = lerp(d.hy, cy + Math.sin(a) * rad, e);
          d.live = e;
        }
        break;
      }
    }
  }

  /* ── draw ──
     Six luminance buckets, so fillStyle changes six times a frame instead of
     ten thousand. The lens hues get their own buckets in fan. */
  const BUCKETS = 6;
  function paint() {
    ctx.clearRect(0, 0, W, H);
    const fan = opts.preset === "fan";
    const lanes = fan ? hues.length : 1;

    for (let lane = 0; lane < lanes; lane++) {
      for (let b = 0; b < BUCKETS; b++) {
        const k = b / (BUCKETS - 1);
        const target = fan ? hues[lane] : live;
        const col: RGB = [
          Math.round(lerp(dim[0], target[0], k)),
          Math.round(lerp(dim[1], target[1], k)),
          Math.round(lerp(dim[2], target[2], k)),
        ];
        ctx.fillStyle = `rgb(${col[0]},${col[1]},${col[2]})`;
        ctx.globalAlpha = 0.6 + k * 0.4;
        for (let i = 0; i < N; i++) {
          const d = ps[i];
          if (fan && d.grp !== lane) continue;
          const bk = Math.round(clamp01(d.live) * (BUCKETS - 1));
          if (bk !== b) continue;
          if (d.x < -6 || d.x > W + 6 || d.y < -6 || d.y > H + 6) continue;
          const sz = d.s * (1 + k * 0.65);
          ctx.fillRect(d.x, d.y, sz, sz);
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  let raf = 0;
  let t0 = 0;
  let elapsed = 0;
  let running = false;
  let played = false;

  const frame = (now: number) => {
    raf = 0;
    const dt = t0 ? Math.min(64, now - t0) : 16;
    t0 = now;
    elapsed += dt;
    const p = opts.preset === "field" ? 1 : clamp01(elapsed / DUR);

    aim(p, now);
    /* ease toward the target rather than snapping, which is what makes the
       whole thing feel like one material */
    for (let i = 0; i < N; i++) {
      const d = ps[i];
      d.x += (d.tx - d.x) * 0.12;
      d.y += (d.ty - d.y) * 0.12;
    }
    paint();

    if (p >= 1 && opts.preset !== "field") {
      played = true;
      /* hold: one more settle pass, then stop burning frames */
      if (elapsed > DUR + 900) { running = false; return; }
    }
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || played || reduced) return;
    running = true;
    t0 = 0;
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
    running = false;
  };

  /** the complete, motionless version — what reduced motion and SSR get */
  const settle = () => {
    aim(1, 0);
    for (const d of ps) { d.x = d.tx; d.y = d.ty; }
    paint();
  };

  size();
  if (reduced) settle();
  else paint();

  const ro = new ResizeObserver(() => {
    size();
    if (reduced || played) settle();
    else paint();
  });
  ro.observe(host);

  return {
    start,
    stop,
    settle,
    reduced,
    destroy() {
      stop();
      ro.disconnect();
    },
  };
}
