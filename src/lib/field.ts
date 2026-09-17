/**
 * The 3D background field.
 *
 * Framework-agnostic. Mount a full-viewport <canvas>, hand it to createField(),
 * call destroy() on unmount. Owns its own rAF loop, listeners, and DPR handling.
 *
 * No Three.js on purpose — this is ~1,000 points, a rotation matrix and a
 * perspective divide. A WebGL dependency would cost 150kB to do less.
 */

export type FieldHandle = {
  /** ease the primary light toward an rgb triple */
  setAccent: (rgb: [number, number, number]) => void;
  /** smoothed scrollY — drive the hero exit from this, not from window.scrollY */
  getScroll: () => number;
  /** per-frame delta of the smoothed scroll; drives the warp */
  getVelocity: () => number;
  destroy: () => void;
};

const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

const GX = 13, GY = 6, GZ = 13, SP = 155;
const SPAN = GZ * SP;
const FLOOR = ((GY - 1) / 2) * SP + 300;
const ACC: [number, number, number][] = [
  [233, 197, 139],
  [95, 211, 216],
  [139, 123, 232],
];

type Pt = { x: number; y: number; z: number; ph: number; acc: number[] | null };

export function createField(canvas: HTMLCanvasElement): FieldHandle {
  const g = canvas.getContext('2d')!;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const pts: Pt[] = [];
  for (let i = 0; i < GX; i++)
    for (let j = 0; j < GY; j++)
      for (let k = 0; k < GZ; k++)
        pts.push({
          x: (i - (GX - 1) / 2) * SP,
          y: (j - (GY - 1) / 2) * SP,
          z: (k - (GZ - 1) / 2) * SP,
          ph: Math.random() * 6.28,
          acc: (i * 7 + j * 3 + k) % 19 === 0 ? ACC[(i + j + k) % 3] : null,
        });

  const lights = [
    { c: null as string | null, a: 0.26, ox: 0.28, oy: 0.30, sx: 0.00033, sy: 0.00021, r: 0.55 },
    { c: '95,211,216',          a: 0.18, ox: 0.74, oy: 0.62, sx: 0.00025, sy: 0.00031, r: 0.48 },
    { c: '139,123,232',         a: 0.15, ox: 0.48, oy: 0.88, sx: 0.00018, sy: 0.00026, r: 0.44 },
  ];

  let W = 0, H = 0, DPR = 1, cx = 0, cy = 0, F = 0;
  let rx = 0, ry = 0, trx = 0, try_ = 0;
  let tScroll = 0, smooth = 0, prev = 0, vel = 0, svel = 0;
  let assemble = 0, tm = 0, running = true, raf = 0;
  let pmx = 0.5, pmy = 0.5;
  let target: [number, number, number] = [95, 216, 164];
  const live: [number, number, number] = [95, 216, 164];

  function size() {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = canvas.width = innerWidth * DPR;
    H = canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + 'px';
    canvas.style.height = innerHeight + 'px';
    cx = W / 2; cy = H / 2; F = Math.max(W, H) * 0.62;
  }

  const onMove = (e: PointerEvent) => {
    pmx = e.clientX / innerWidth; pmy = e.clientY / innerHeight;
    try_ = (pmx - 0.5) * 0.55; trx = (pmy - 0.5) * -0.35;
  };
  const onScroll = () => { tScroll = window.scrollY; };
  const onVis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(frame); };

  function rot(x: number, y: number, z: number, sy: number, cyr: number, sx: number, cxr: number) {
    const x1 = x * cyr - z * sy, z1 = x * sy + z * cyr;
    const y1 = y * cxr - z1 * sx, z2 = y * sx + z1 * cxr;
    return [x1, y1, z2] as const;
  }

  function frame() {
    if (!running) return;
    tm += 16;
    assemble = Math.min(assemble + 0.009, 1);
    const ease = 1 - Math.pow(1 - assemble, 3);

    ry = lerp(ry, try_, 0.045);
    rx = lerp(rx, trx, 0.045);
    prev = smooth;
    smooth = lerp(smooth, tScroll, 0.075);
    vel = smooth - prev;
    svel = lerp(svel, vel, 0.18);
    const warp = Math.max(-90, Math.min(90, svel * 3.2));
    const camZ = smooth * 0.55;

    for (let i = 0; i < 3; i++) live[i] = lerp(live[i], target[i], 0.035);

    g.clearRect(0, 0, W, H);
    g.fillStyle = '#05070C';
    g.fillRect(0, 0, W, H);
    g.globalCompositeOperation = 'lighter';

    for (let i = 0; i < lights.length; i++) {
      const L = lights[i];
      const col = L.c ?? `${live[0] | 0},${live[1] | 0},${live[2] | 0}`;
      const lx = (L.ox + Math.sin(tm * L.sx) * 0.15 + (pmx - 0.5) * 0.18) * W;
      const ly = (L.oy + Math.cos(tm * L.sy) * 0.13 + (pmy - 0.5) * 0.18) * H;
      const rad = L.r * Math.max(W, H);
      const gr = g.createRadialGradient(lx, ly, 0, lx, ly, rad);
      gr.addColorStop(0, `rgba(${col},${L.a * ease})`);
      gr.addColorStop(0.45, `rgba(${col},${(L.a * ease * 0.22).toFixed(3)})`);
      gr.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = gr;
      g.beginPath(); g.arc(lx, ly, rad, 0, 6.2832); g.fill();
    }

    const sy = Math.sin(ry), cyr = Math.cos(ry), sx = Math.sin(rx), cxr = Math.cos(rx);
    const wrap = ((camZ % SPAN) + SPAN) % SPAN;

    // horizon floor
    g.lineWidth = DPR;
    for (let f = 0; f < GZ + 6; f++) {
      const fz = (f - (GZ + 6) / 2) * SP;
      const a = rot(-GX * SP * 0.6, FLOOR, fz, sy, cyr, sx, cxr);
      const b = rot(GX * SP * 0.6, FLOOR, fz, sy, cyr, sx, cxr);
      let za = (((a[2] + 900 + wrap) % SPAN) + SPAN) % SPAN + 700;
      let zb = (((b[2] + 900 + wrap) % SPAN) + SPAN) % SPAN + 700;
      if (za < 90 || zb < 90) continue;
      const sa = F / za, sb = F / zb;
      const fog = Math.max(0, Math.min(1, 1 - (za - 300) / 1900));
      if (fog < 0.03) continue;
      g.strokeStyle = `rgba(238,241,245,${fog * fog * 0.08 * ease})`;
      g.beginPath();
      g.moveTo(cx + a[0] * sa, cy + a[1] * sa);
      g.lineTo(cx + b[0] * sb, cy + b[1] * sb);
      g.stroke();
    }

    // lattice
    const spread = 1 + (1 - ease) * 2.4;
    for (let n = 0; n < pts.length; n++) {
      const p = pts[n];
      const by = p.y * spread + Math.sin(tm * 0.00035 + p.ph) * 9;
      const r3 = rot(p.x * spread, by, p.z * spread, sy, cyr, sx, cxr);
      const z = (((r3[2] + 900 + wrap) % SPAN) + SPAN) % SPAN + 700;
      const s = F / z;
      const px = cx + r3[0] * s, py = cy + r3[1] * s;
      if (px < -60 || px > W + 60 || py < -60 || py > H + 60) continue;
      const fog = Math.max(0, Math.min(1, 1 - (z - 300) / 1900));
      const a = fog * fog * 0.58 * ease;
      if (a < 0.012) continue;
      const r = Math.max(0.6, s * 1.6) * DPR;

      if (Math.abs(warp) > 2) {
        const z2 = Math.max(140, z + warp * 2.2), s2 = F / z2;
        g.strokeStyle = p.acc ? `rgba(${p.acc.join(',')},${a * 1.2})` : `rgba(238,241,245,${a * 0.85})`;
        g.lineWidth = r * (p.acc ? 1.6 : 1);
        g.beginPath(); g.moveTo(px, py); g.lineTo(cx + r3[0] * s2, cy + r3[1] * s2); g.stroke();
      }
      if (p.acc) {
        g.fillStyle = `rgba(${p.acc.join(',')},${a * 1.6})`;
        g.beginPath(); g.arc(px, py, r * 1.8, 0, 6.2832); g.fill();
      } else {
        g.fillStyle = `rgba(238,241,245,${a})`;
        g.fillRect(px - r / 2, py - r / 2, r, r);
      }
    }

    g.globalCompositeOperation = 'source-over';
    raf = requestAnimationFrame(frame);
  }

  size();
  addEventListener('resize', size);

  if (reduced) {
    g.fillStyle = '#0A101A';
    g.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    raf = requestAnimationFrame(frame);
  }

  return {
    setAccent: (rgb) => { target = rgb; },
    getScroll: () => smooth,
    getVelocity: () => svel,
    destroy() {
      running = false;
      cancelAnimationFrame(raf);
      removeEventListener('resize', size);
      removeEventListener('pointermove', onMove);
      removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
    },
  };
}
