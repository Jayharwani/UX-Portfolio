import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Dark cloth that actually moves.

   The previous attempt was a fixed fabric texture with a light riding the
   cursor. That is the wrong model: it makes the light move, not the cloth,
   and no amount of tuning gets you "pushing fabric" out of it. This is a real
   height field, shaded per pixel, with a bump that the pointer pushes into it.

   HOW IT WORKS, and why it is affordable:

   · The surface is a height field at 192x120 — about 23,000 cells, not the
     1.3 million pixels of the viewport. Cloth is soft, so the canvas is
     rendered at that size and stretched, and the browser's own smoothing does
     the interpolation for free. Computing this at full resolution would be
     fifty times the work for something visibly identical.

   · The static part is value noise stretched horizontally, which is what
     makes folds read as drapes running one way rather than as isotropic
     static.

   · The moving part is a gaussian bump that EASES toward the pointer rather
     than snapping to it. The lag is the whole effect: cloth pushed quickly
     bunches behind the hand, and a bump locked to the cursor reads as a
     spotlight instead.

   · Shading is a Lambert dot against the surface normal, derived from
     neighbouring heights. Strictly greyscale — no hue anywhere, because dark
     plain cloth is what was asked for and any tint immediately reads as a
     coloured light rather than as fabric.

   It stops completely when the hero is off screen, and never starts at all
   under prefers-reduced-motion.
   ────────────────────────────────────────────────────────────────────────── */

const W = 192;
const H = 120;

/* deterministic value noise, so the drape is a design decision and not a
   different picture on every load */
function makeFabric() {
  const field = new Float32Array(W * H);
  let seed = 1337;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  /* Four octaves, each stretched 3:1 horizontally. The stretch is what turns
     noise into drape — equal frequencies in both axes give crumpled paper. */
  for (let oct = 0; oct < 4; oct++) {
    const fx = 3 + oct * 5;
    const fy = 9 + oct * 15;
    const amp = 1 / (oct + 1.4);
    const gw = fx + 2;
    const gh = fy + 2;
    const grid = new Float32Array(gw * gh);
    for (let i = 0; i < grid.length; i++) grid[i] = rnd() * 2 - 1;

    for (let y = 0; y < H; y++) {
      const gy = (y / H) * fy;
      const y0 = Math.floor(gy);
      const ty = gy - y0;
      const sy = ty * ty * (3 - 2 * ty); // smoothstep
      for (let x = 0; x < W; x++) {
        const gx = (x / W) * fx;
        const x0 = Math.floor(gx);
        const tx = gx - x0;
        const sx = tx * tx * (3 - 2 * tx);
        const a = grid[y0 * gw + x0];
        const b = grid[y0 * gw + x0 + 1];
        const c = grid[(y0 + 1) * gw + x0];
        const d = grid[(y0 + 1) * gw + x0 + 1];
        const top = a + (b - a) * sx;
        const bot = c + (d - c) * sx;
        field[y * W + x] += (top + (bot - top) * sy) * amp;
      }
    }
  }
  return field;
}

export default function ClothField({ reduce }: { reduce: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reduce) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    canvas.width = W;
    canvas.height = H;

    const fabric = makeFabric();
    const img = ctx.createImageData(W, H);
    const px = img.data;

    /* pointer in field coordinates; the bump eases toward it */
    let tx = W * 0.5;
    let ty = H * 0.42;
    let bx = tx;
    let by = ty;
    let press = 0;
    let target = 0;

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      tx = ((e.clientX - r.left) / r.width) * W;
      ty = ((e.clientY - r.top) / r.height) * H;
      target = 1;
    };
    const onLeave = () => {
      target = 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerout", onLeave);

    let onScreen = true;
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
    });
    io.observe(canvas);

    /* The push, in field units.

       The first values were RAD 0.26 of the width and DEPTH 2.6, and the hand
       was invisible: shading reads the surface GRADIENT, not its height, and a
       bump that wide has a slope of roughly depth over radius — about 0.05,
       far below the fabric's own local gradients. Narrower and deeper gives
       the mound a flank steep enough to catch the light, which is what makes
       it read as cloth being pushed rather than as a faint haze. */
    const RAD = W * 0.15;
    const RAD2 = RAD * RAD;
    const DEPTH = 11;

    /* Lag is the effect. Cloth pushed quickly bunches behind the hand; a bump
       welded to the cursor reads as a spotlight. */
    const step = () => {
      bx += (tx - bx) * 0.09;
      by += (ty - by) * 0.09;
      press += (target - press) * 0.06;
    };

    const draw = () => {
      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const i = y * W + x;

          /* height = drape + the hand's push, sampled for this cell and its
             two neighbours so the normal comes out of the same surface */
          const h = (ix: number, iy: number) => {
            const base = fabric[iy * W + ix];
            const dx = ix - bx;
            const dy = (iy - by) * 1.7; // the push is wider than it is tall
            const d2 = dx * dx + dy * dy;
            return d2 < RAD2
              ? base + Math.exp(-d2 / (RAD2 * 0.28)) * DEPTH * press
              : base;
          };

          const xl = x > 0 ? x - 1 : 0;
          const xr = x < W - 1 ? x + 1 : W - 1;
          const yu = y > 0 ? y - 1 : 0;
          const yd = y < H - 1 ? y + 1 : H - 1;

          /* Lambert against the normal implied by the neighbouring heights.
             Light from the upper left, raking, which is what shows folds. */
          const nx = h(xl, y) - h(xr, y);
          const ny = h(x, yu) - h(x, yd);
          const inv = 1 / Math.sqrt(nx * nx + ny * ny + 1);
          const lum = (nx * -0.55 + ny * -0.45 + 0.72) * inv;

          /* strictly greyscale: dark plain cloth, no hue at all */
          let v = 15 + lum * 74;
          if (v < 0) v = 0;
          else if (v > 255) v = 255;
          const o = i * 4;
          px[o] = px[o + 1] = px[o + 2] = v;
          px[o + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    };

    if (import.meta.env.DEV) {
      /* rAF does not tick in a backgrounded tab, so an automated check can
         mount this and never see a second frame. Exposing one step lets a
         test push the pointer and confirm the surface actually changes.
         Declared AFTER step and draw rather than closing over them from
         above, which worked but read like a bug. */
      (window as unknown as Record<string, unknown>).__cloth = () => {
        step();
        draw();
      };
    }

    /* Paint once, synchronously, before any animation frame exists. Without
       this the canvas is black until the first rAF lands — and in a
       backgrounded or throttled tab that can be never, which would leave the
       hero with a black hole where the fabric should be. */
    draw();

    let raf = 0;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!onScreen || document.hidden) return;
      step();
      draw();
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerout", onLeave);
    };
  }, [reduce]);

  return <canvas ref={ref} className="cloth" aria-hidden="true" />;
}
