import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* ──────────────────────────────────────────────────────────────────────────
   Live Manhattan skyline: three parallax silhouette layers drifting like a
   slow tracking shot, twinkling warm windows, blinking rooftop beacons,
   stars, moon, and an occasional tiny Iron Man flyby. Canvas, slate palette,
   dimmed by the section overlay so content stays readable.
   Pauses offscreen; renders a single static frame under reduced motion.
   ────────────────────────────────────────────────────────────────────────── */

type Kind = "generic" | "empire" | "chrysler" | "wtc" | "water";

interface Tower {
  x: number;
  w: number;
  h: number;
  kind: Kind;
  windows: { x: number; y: number; p: number }[];
}

interface Layer {
  towers: Tower[];
  span: number;
  speed: number;
  color: string;
  detail: boolean;
}

function buildLayer(width: number, seed: number, minH: number, maxH: number, speed: number, color: string, detail: boolean): Layer {
  const towers: Tower[] = [];
  let x = 0;
  let i = seed;
  while (x < width + 260) {
    const w = 30 + ((i * 37) % 46);
    const h = minH + ((i * 53) % (maxH - minH));
    let kind: Kind = "generic";
    if (detail) {
      const m = i % 11;
      if (m === 2) kind = "empire";
      else if (m === 6) kind = "chrysler";
      else if (m === 9) kind = "wtc";
      else if (m === 4) kind = "water";
    }
    const windows: Tower["windows"] = [];
    if (detail) {
      for (let wy = 10; wy < h - 8; wy += 15) {
        for (let wx = 6; wx < w - 9; wx += 13) {
          windows.push({ x: wx, y: wy, p: ((i * 7 + wx * 3 + wy * 5) % 100) / 100 });
        }
      }
    }
    towers.push({ x, w, h, kind, windows });
    x += w + 5 + ((i * 13) % 12);
    i++;
  }
  return { towers, span: x, speed, color, detail };
}

export default function SkylineBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;

    let W = 0;
    let H = 0;
    let layers: Layer[] = [];
    let stars: { x: number; y: number; a: number; ph: number; r: number }[] = [];
    let raf = 0;
    let running = false;
    let t0 = performance.now();

    const setup = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      W = parent.clientWidth;
      H = parent.clientHeight;
      if (!W || !H) return;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      layers = [
        buildLayer(W, 3, H * 0.1, H * 0.3, 3, "#0E1524", false),
        buildLayer(W, 17, H * 0.16, H * 0.42, 8, "#121A2C", false),
        buildLayer(W, 8, H * 0.22, H * 0.52, 15, "#182238", true),
      ];
      stars = Array.from({ length: 56 }, (_, i) => ({
        x: (i * 89) % W,
        y: ((i * 47) % Math.round(H * 0.5)) + 6,
        a: 0.12 + ((i * 13) % 12) / 30,
        ph: (i * 1.7) % 6.28,
        r: i % 6 === 0 ? 1.4 : 0.9,
      }));
    };

    const drawTowerDetail = (c: CanvasRenderingContext2D, tw: Tower, x: number, base: number, t: number) => {
      const top = base - tw.h;
      const cx = x + tw.w / 2;
      c.fillStyle = "#182238";
      if (tw.kind === "empire") {
        c.fillRect(cx - 1.5, top - 26, 3, 26);
        c.fillRect(cx - tw.w * 0.2, top - 12, tw.w * 0.4, 12);
        // beacon
        const blink = Math.sin(t * 2 + x) > 0.55 ? 0.85 : 0.12;
        c.fillStyle = `rgba(240,84,79,${blink})`;
        c.fillRect(cx - 1.2, top - 28, 2.4, 2.4);
        c.fillStyle = "#182238";
      } else if (tw.kind === "chrysler") {
        c.fillRect(cx - 1.2, top - 18, 2.4, 18);
        [0.34, 0.52, 0.7].forEach((f, j) => {
          const aw = tw.w * f;
          c.beginPath();
          c.roundRect(cx - aw / 2, top - 14 + j * 5, aw, 6, 3);
          c.fill();
        });
      } else if (tw.kind === "wtc") {
        c.fillRect(cx - 1.2, top - 22, 2.4, 22);
        const blink = Math.sin(t * 2.4 + x * 0.7) > 0.6 ? 0.8 : 0.1;
        c.fillStyle = `rgba(240,84,79,${blink})`;
        c.fillRect(cx - 1.1, top - 24, 2.2, 2.2);
        c.fillStyle = "#182238";
      } else if (tw.kind === "water") {
        const wx = x + tw.w * 0.2;
        c.fillRect(wx, top - 9, 11, 9);
        c.beginPath();
        c.moveTo(wx - 1, top - 9);
        c.lineTo(wx + 5.5, top - 14);
        c.lineTo(wx + 12, top - 9);
        c.closePath();
        c.fill();
      }
    };

    const draw = (now: number) => {
      const t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);

      // stars
      for (const s of stars) {
        const tw = reduce ? 1 : 0.55 + 0.45 * Math.sin(t * 0.8 + s.ph);
        ctx.fillStyle = `rgba(232,236,243,${s.a * tw})`;
        ctx.fillRect(s.x, s.y, s.r, s.r);
      }
      // moon
      const mg = ctx.createRadialGradient(W * 0.82, H * 0.16, 3, W * 0.82, H * 0.16, 56);
      mg.addColorStop(0, "rgba(232,236,243,0.22)");
      mg.addColorStop(0.35, "rgba(232,236,243,0.07)");
      mg.addColorStop(1, "rgba(232,236,243,0)");
      ctx.fillStyle = mg;
      ctx.fillRect(W * 0.62, 0, W * 0.38, H * 0.42);
      ctx.fillStyle = "rgba(232,236,243,0.85)";
      ctx.beginPath();
      ctx.arc(W * 0.82, H * 0.16, 8, 0, Math.PI * 2);
      ctx.fill();

      // parallax skyline layers
      for (const layer of layers) {
        const off = reduce ? 0 : (t * layer.speed) % layer.span;
        ctx.fillStyle = layer.color;
        for (const pass of [0, layer.span]) {
          for (const tw of layer.towers) {
            const x = tw.x - off + pass;
            if (x + tw.w < -30 || x > W + 30) continue;
            ctx.fillRect(x, H - tw.h, tw.w, tw.h);
            if (layer.detail) {
              drawTowerDetail(ctx, tw, x, H, t);
              // twinkling windows
              for (const wnd of tw.windows) {
                const lit = reduce ? wnd.p < 0.3 : Math.sin(t * 0.6 + wnd.p * 12.5) > 0.35 - wnd.p * 0.9;
                if (!lit) continue;
                ctx.fillStyle = wnd.p > 0.82 ? "rgba(91,140,255,0.16)" : "rgba(217,164,65,0.34)";
                ctx.fillRect(x + wnd.x, H - tw.h + wnd.y, 5, 6);
              }
              ctx.fillStyle = layer.color;
            }
          }
        }
      }

      // Iron Man flyby, every ~17s
      if (!reduce) {
        const cycle = t % 17;
        if (cycle > 2 && cycle < 6.2) {
          const p = (cycle - 2) / 4.2;
          const fx = -60 + p * (W + 120);
          const fy = H * 0.34 + Math.sin(p * 7) * 12;
          // repulsor trail
          const trail = ctx.createLinearGradient(fx - 46, fy, fx, fy);
          trail.addColorStop(0, "rgba(143,227,255,0)");
          trail.addColorStop(1, "rgba(143,227,255,0.45)");
          ctx.strokeStyle = trail;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(fx - 46, fy + 2);
          ctx.lineTo(fx - 4, fy + 1);
          ctx.stroke();
          // tiny suit
          ctx.fillStyle = "#C13530";
          ctx.beginPath();
          ctx.roundRect(fx - 4, fy - 3, 9, 6, 3);
          ctx.fill();
          ctx.fillStyle = "#E3A857";
          ctx.fillRect(fx + 1.4, fy - 1.6, 2.6, 3);
          ctx.fillStyle = "rgba(143,227,255,0.9)";
          ctx.fillRect(fx - 1.2, fy - 0.8, 1.6, 1.6);
        }
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    setup();
    if (reduce) {
      draw(performance.now());
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (reduce) return;
        if (entry.isIntersecting && !running) {
          running = true;
          raf = requestAnimationFrame(loop);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(parent);

    const ro = new ResizeObserver(() => {
      setup();
      if (reduce) draw(performance.now());
    });
    ro.observe(parent);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className="absolute inset-0" aria-hidden="true" style={{ display: "block" }} />;
}
