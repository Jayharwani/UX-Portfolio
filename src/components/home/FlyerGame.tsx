import { useEffect, useRef, useState, useCallback } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Iron flight: the hidden Easter-egg game. Iron Man flying through the
   New York City skyline on an HTML5 canvas. Flappy mechanic: gravity pulls,
   a tap fires the repulsors. Obstacles are NYC towers: Empire State,
   Chrysler, One WTC, and water-tower rooftops, with a parallax skyline
   behind. Lazy-loaded; never touches initial page load.
   ────────────────────────────────────────────────────────────────────────── */

const BEST_KEY = "flyer_best_score";

type GameState = "ready" | "playing" | "over";

const W = 420;
const H = 560;
const GROUND = 30; // street height
const GRAVITY = 1350;
const THRUST = -430;
const SPEED = 150;
const GAP = 172;
const BW = 66; // tower width
const SPACING = 235;
const FLYER_X = 112;
const FLYER_R = 14;

/* armor palette */
const RED = "#C13530";
const RED_D = "#8E2723";
const GOLD = "#E3A857";
const REACTOR = "#8FE3FF";

type Variant = "empire" | "chrysler" | "wtc" | "slab";
const VARIANTS: Variant[] = ["empire", "slab", "chrysler", "wtc"];

interface Building {
  x: number;
  gapY: number;
  passed: boolean;
  variant: Variant;
  windows: { x: number; y: number; lit: boolean }[]; // y as fraction of column
}

let spawnCounter = 0;
function makeBuilding(x: number): Building {
  const gapY = 120 + Math.random() * (H - GROUND - 240);
  const windows: Building["windows"] = [];
  for (let wy = 0.04; wy < 0.96; wy += 0.07) {
    for (let wx = 10; wx < BW - 14; wx += 18) {
      windows.push({ x: wx, y: wy, lit: Math.random() < 0.3 });
    }
  }
  return { x, gapY, passed: false, variant: VARIANTS[spawnCounter++ % VARIANTS.length], windows };
}

/* background skyline, built once */
interface BgTower {
  x: number;
  w: number;
  h: number;
  spire: boolean;
}
function makeSkyline(): BgTower[] {
  const towers: BgTower[] = [];
  let x = 0;
  let i = 0;
  while (x < W + 140) {
    const w = 34 + ((i * 37) % 40);
    const h = 70 + ((i * 53) % 130);
    towers.push({ x, w, h, spire: i % 4 === 1 });
    x += w + 6;
    i++;
  }
  return towers;
}
const STARS = Array.from({ length: 42 }, (_, i) => ({
  x: (i * 97) % W,
  y: ((i * 61) % Math.round(H * 0.55)) + 8,
  a: 0.15 + ((i * 13) % 10) / 22,
  r: i % 5 === 0 ? 1.3 : 0.8,
}));

export default function FlyerGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>("ready");
  const [uiState, setUiState] = useState<GameState>("ready");
  const [score, setScore] = useState(0);
  const [best, setBest] = useState<number>(() => {
    try {
      return Number(localStorage.getItem(BEST_KEY) || 0);
    } catch {
      return 0;
    }
  });

  const game = useRef({
    y: H / 2,
    vy: 0,
    buildings: [] as Building[],
    score: 0,
    flame: 0,
    t: 0,
    roadOff: 0,
    bgOff: 0,
    skyline: makeSkyline(),
  });

  const reset = useCallback(() => {
    game.current.y = H / 2;
    game.current.vy = 0;
    game.current.buildings = [makeBuilding(W + 80), makeBuilding(W + 80 + SPACING), makeBuilding(W + 80 + SPACING * 2)];
    game.current.score = 0;
    game.current.flame = 0;
    setScore(0);
  }, []);

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s === "ready") {
      reset();
      stateRef.current = "playing";
      setUiState("playing");
      game.current.vy = THRUST;
      game.current.flame = 0.16;
      return;
    }
    if (s === "playing") {
      game.current.vy = THRUST;
      game.current.flame = 0.16;
      return;
    }
    stateRef.current = "ready";
    setUiState("ready");
    reset();
  }, [reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        flap();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap, onClose]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    reset();

    let raf = 0;
    let last = performance.now();

    const die = () => {
      stateRef.current = "over";
      setUiState("over");
      const s = game.current.score;
      setBest((b) => {
        const nb = Math.max(b, s);
        try {
          localStorage.setItem(BEST_KEY, String(nb));
        } catch {
          /* ignore */
        }
        return nb;
      });
    };

    const step = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      const g = game.current;
      g.t += dt;

      if (stateRef.current === "playing") {
        g.vy += GRAVITY * dt;
        g.y += g.vy * dt;
        g.flame = Math.max(0, g.flame - dt);
        g.roadOff = (g.roadOff + SPEED * dt) % 38;
        g.bgOff = (g.bgOff + SPEED * 0.22 * dt) % (W + 140);

        for (const b of g.buildings) {
          b.x -= SPEED * dt;
          if (!b.passed && b.x + BW < FLYER_X - FLYER_R) {
            b.passed = true;
            g.score += 1;
            setScore(g.score);
          }
        }
        if (g.buildings[0].x < -BW - 30) {
          g.buildings.shift();
          g.buildings.push(makeBuilding(g.buildings[g.buildings.length - 1].x + SPACING));
        }

        if (g.y - FLYER_R < 0 || g.y + FLYER_R > H - GROUND) die();
        for (const b of g.buildings) {
          if (FLYER_X + FLYER_R > b.x && FLYER_X - FLYER_R < b.x + BW) {
            if (g.y - FLYER_R < b.gapY - GAP / 2 || g.y + FLYER_R > b.gapY + GAP / 2) die();
          }
        }
      } else if (stateRef.current === "ready") {
        g.y = H / 2 + Math.sin(g.t * 2.4) * 8;
        g.vy = 0;
        g.flame = 0.1 + 0.06 * Math.sin(g.t * 6); // idle hover thrusters
        g.bgOff = (g.bgOff + SPEED * 0.08 * dt) % (W + 140);
      }

      draw(ctx, g);
      raf = requestAnimationFrame(step);
    };

    /* ── drawing ── */

    const drawSky = (c: CanvasRenderingContext2D) => {
      const sky = c.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0B1020");
      sky.addColorStop(0.65, "#0D1220");
      sky.addColorStop(1, "#0A0E16");
      c.fillStyle = sky;
      c.fillRect(0, 0, W, H);
      // moon
      const moon = c.createRadialGradient(W * 0.2, H * 0.13, 4, W * 0.2, H * 0.13, 52);
      moon.addColorStop(0, "rgba(232,236,243,0.32)");
      moon.addColorStop(0.3, "rgba(232,236,243,0.1)");
      moon.addColorStop(1, "rgba(232,236,243,0)");
      c.fillStyle = moon;
      c.fillRect(0, 0, W, H * 0.4);
      c.fillStyle = "#E8ECF3";
      c.beginPath();
      c.arc(W * 0.2, H * 0.13, 9, 0, Math.PI * 2);
      c.fill();
      // stars
      for (const s of STARS) {
        c.fillStyle = `rgba(232,236,243,${s.a})`;
        c.fillRect(s.x, s.y, s.r, s.r);
      }
    };

    const drawSkyline = (c: CanvasRenderingContext2D, off: number) => {
      const base = H - GROUND;
      c.fillStyle = "#101626";
      const drawSet = (shift: number) => {
        for (const t of game.current.skyline) {
          const x = t.x - off + shift;
          if (x + t.w < -20 || x > W + 20) continue;
          c.fillRect(x, base - t.h, t.w, t.h);
          if (t.spire) {
            c.fillRect(x + t.w / 2 - 1.5, base - t.h - 22, 3, 22);
          }
        }
      };
      drawSet(0);
      drawSet(W + 140);
      // accent glow at the horizon
      const glow = c.createLinearGradient(0, base - 90, 0, base);
      glow.addColorStop(0, "rgba(91,140,255,0)");
      glow.addColorStop(1, "rgba(91,140,255,0.07)");
      c.fillStyle = glow;
      c.fillRect(0, base - 90, W, 90);
    };

    const drawWindows = (c: CanvasRenderingContext2D, b: Building, colTop: number, colBottom: number, x: number) => {
      const colH = colBottom - colTop;
      if (colH < 24) return;
      for (const wnd of b.windows) {
        const wy = colTop + wnd.y * colH;
        if (wy < colTop + 4 || wy > colBottom - 12) continue;
        c.fillStyle = wnd.lit ? "rgba(217,164,65,0.5)" : "rgba(91,140,255,0.09)";
        c.fillRect(x + wnd.x, wy, 7, 9);
      }
    };

    const TOWER = "#161D2E";
    const TOWER_EDGE = "#232C3D";

    /* bottom tower: NYC silhouettes, crown at the top edge (all decor kept
       inside the collision column so a near miss never looks unfair) */
    const drawBottomTower = (c: CanvasRenderingContext2D, b: Building) => {
      const x = b.x;
      const top = b.gapY + GAP / 2;
      const bottom = H - GROUND;
      const h = bottom - top;
      c.fillStyle = TOWER;
      c.strokeStyle = TOWER_EDGE;
      c.lineWidth = 1;
      const cx = x + BW / 2;

      if (b.variant === "empire" && h > 120) {
        // needle, crown block, setback, main shaft
        c.fillRect(cx - 2, top + 2, 4, 20);
        c.fillRect(cx - BW * 0.21, top + 22, BW * 0.42, 14);
        c.fillRect(cx - BW * 0.34, top + 36, BW * 0.68, 16);
        c.fillRect(x, top + 52, BW, h - 52);
        c.strokeRect(x + 0.5, top + 52.5, BW - 1, h - 52);
        drawWindows(c, b, top + 56, bottom, x);
        // crown light
        c.fillStyle = "rgba(217,164,65,0.7)";
        c.fillRect(cx - 1, top + 2, 2, 4);
      } else if (b.variant === "chrysler" && h > 120) {
        // spire + stacked crown arcs + shaft
        c.fillRect(cx - 1.5, top + 2, 3, 16);
        const arcs = [0.32, 0.48, 0.64];
        arcs.forEach((f, i) => {
          const aw = BW * f;
          const ay = top + 18 + i * 10;
          c.beginPath();
          c.roundRect(cx - aw / 2, ay, aw, 11, 5);
          c.fill();
        });
        c.fillRect(x, top + 48, BW, h - 48);
        c.strokeRect(x + 0.5, top + 48.5, BW - 1, h - 48);
        drawWindows(c, b, top + 52, bottom, x);
        c.fillStyle = "rgba(232,236,243,0.5)";
        c.fillRect(cx - 1, top + 2, 2, 3);
      } else if (b.variant === "wtc" && h > 100) {
        // antenna + tapered glass tower
        c.fillRect(cx - 1.5, top + 2, 3, 14);
        c.beginPath();
        c.moveTo(cx - BW * 0.3, top + 16);
        c.lineTo(cx + BW * 0.3, top + 16);
        c.lineTo(x + BW, bottom);
        c.lineTo(x, bottom);
        c.closePath();
        c.fill();
        c.stroke();
        // glassy vertical streaks
        c.fillStyle = "rgba(91,140,255,0.12)";
        c.fillRect(cx - 2, top + 20, 4, h - 20);
        c.fillRect(cx - BW * 0.22, top + 40, 3, h - 40);
        c.fillRect(cx + BW * 0.18, top + 40, 3, h - 40);
      } else {
        // classic setback slab with a rooftop water tower
        c.fillRect(x, top + 14, BW, h - 14);
        c.strokeRect(x + 0.5, top + 14.5, BW - 1, h - 14);
        // water tower (recessed just below the collision edge)
        const wx = x + BW * 0.22;
        c.fillStyle = "#1B2436";
        c.fillRect(wx, top + 3, 13, 9); // tank
        c.beginPath();
        c.moveTo(wx - 1, top + 3);
        c.lineTo(wx + 6.5, top - 2 + 3);
        c.lineTo(wx + 14, top + 3);
        c.closePath();
        c.fill(); // roof cone
        c.fillRect(wx + 1.5, top + 12, 2, 3);
        c.fillRect(wx + 9.5, top + 12, 2, 3); // legs
        c.fillStyle = TOWER;
        drawWindows(c, b, top + 18, bottom, x);
      }
    };

    /* top building: hangs from above, setback near its lower edge */
    const drawTopTower = (c: CanvasRenderingContext2D, b: Building) => {
      const x = b.x;
      const bottomEdge = b.gapY - GAP / 2;
      if (bottomEdge < 8) return;
      c.fillStyle = TOWER;
      c.strokeStyle = TOWER_EDGE;
      const mainH = Math.max(0, bottomEdge - 14);
      c.fillRect(x, 0, BW, mainH);
      c.strokeRect(x + 0.5, -2, BW - 1, mainH + 1);
      c.fillRect(x + BW * 0.14, mainH, BW * 0.72, bottomEdge - mainH);
      drawWindows(c, b, 6, mainH - 4, x);
    };

    /* Iron Man, chibi proportions like the reference: big helmet, red and
       gold armor, glowing arc reactor, boot repulsors when thrusting */
    const drawIronMan = (c: CanvasRenderingContext2D, g: typeof game.current) => {
      const tilt = stateRef.current === "playing" ? Math.max(-0.4, Math.min(0.65, g.vy / 750)) : 0;
      c.save();
      c.translate(FLYER_X, g.y);
      c.rotate(tilt);

      // boot repulsor flames
      if (g.flame > 0) {
        const f = Math.min(1, g.flame / 0.16);
        const flame = (fx: number) => {
          const gr = c.createLinearGradient(fx, 16, fx, 16 + 15 * f);
          gr.addColorStop(0, `rgba(143,227,255,${0.9 * f})`);
          gr.addColorStop(0.5, `rgba(255,196,110,${0.55 * f})`);
          gr.addColorStop(1, "rgba(255,120,60,0)");
          c.fillStyle = gr;
          c.beginPath();
          c.moveTo(fx - 3, 16);
          c.lineTo(fx + 3, 16);
          c.lineTo(fx, 16 + 15 * f);
          c.closePath();
          c.fill();
        };
        flame(-4.5);
        flame(4.5);
      }

      // legs and boots
      c.fillStyle = RED;
      c.beginPath();
      c.roundRect(-7.5, 7, 6, 9.5, 2.5);
      c.fill();
      c.beginPath();
      c.roundRect(1.5, 7, 6, 9.5, 2.5);
      c.fill();
      c.fillStyle = GOLD;
      c.fillRect(-7.5, 10.5, 6, 2);
      c.fillRect(1.5, 10.5, 6, 2);

      // arms
      c.fillStyle = RED_D;
      c.beginPath();
      c.roundRect(-11.5, -6, 4.5, 12, 2.2);
      c.fill();
      c.beginPath();
      c.roundRect(7, -6, 4.5, 12, 2.2);
      c.fill();

      // torso
      c.fillStyle = RED;
      c.beginPath();
      c.roundRect(-8.5, -8, 17, 17, 5);
      c.fill();
      c.strokeStyle = RED_D;
      c.lineWidth = 1;
      c.stroke();
      // gold abdomen plate
      c.fillStyle = GOLD;
      c.beginPath();
      c.roundRect(-3.5, 3.5, 7, 5, 2);
      c.fill();

      // shoulders
      c.fillStyle = RED;
      c.beginPath();
      c.arc(-9.5, -6.5, 3.6, 0, Math.PI * 2);
      c.fill();
      c.beginPath();
      c.arc(9.5, -6.5, 3.6, 0, Math.PI * 2);
      c.fill();

      // arc reactor
      c.fillStyle = "rgba(143,227,255,0.35)";
      c.beginPath();
      c.arc(0, -1.5, 5.6, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = REACTOR;
      c.beginPath();
      c.arc(0, -1.5, 3, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "#FFFFFF";
      c.beginPath();
      c.arc(0, -1.5, 1.2, 0, Math.PI * 2);
      c.fill();

      // helmet: big, chibi
      c.fillStyle = RED;
      c.beginPath();
      c.roundRect(-8.5, -25, 17, 17.5, 7);
      c.fill();
      c.strokeStyle = RED_D;
      c.stroke();
      // gold faceplate
      c.fillStyle = GOLD;
      c.beginPath();
      c.roundRect(-5.2, -21.5, 10.4, 12.2, 4.2);
      c.fill();
      // eye slits
      c.fillStyle = "#F4FAFF";
      c.beginPath();
      c.roundRect(-3.9, -17.4, 3, 1.9, 0.9);
      c.fill();
      c.beginPath();
      c.roundRect(0.9, -17.4, 3, 1.9, 0.9);
      c.fill();
      // mouth slit
      c.fillStyle = "rgba(142,39,35,0.55)";
      c.fillRect(-1.6, -12.4, 3.2, 1);

      c.restore();
    };

    const drawStreet = (c: CanvasRenderingContext2D, g: typeof game.current) => {
      c.fillStyle = "#111725";
      c.fillRect(0, H - GROUND, W, GROUND);
      c.strokeStyle = "#2E3950";
      c.beginPath();
      c.moveTo(0, H - GROUND + 0.5);
      c.lineTo(W, H - GROUND + 0.5);
      c.stroke();
      // taxi-yellow lane dashes, scrolling
      c.fillStyle = "rgba(217,164,65,0.4)";
      for (let dx = -g.roadOff; dx < W; dx += 38) {
        c.fillRect(dx, H - GROUND / 2 - 1, 16, 2.4);
      }
    };

    const draw = (c: CanvasRenderingContext2D, g: typeof game.current) => {
      drawSky(c);
      drawSkyline(c, g.bgOff);
      for (const b of g.buildings) {
        drawTopTower(c, b);
        drawBottomTower(c, b);
      }
      drawStreet(c, g);
      drawIronMan(c, g);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reset]);

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center px-4" role="dialog" aria-label="Iron Man mini game">
      {/* dim slate backdrop */}
      <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(6,9,15,0.78)", backdropFilter: "blur(10px)" }} />

      {/* glass panel */}
      <div
        className="relative flex flex-col"
        style={{
          background: "rgba(17,23,37,0.88)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.7)",
          padding: 14,
          maxWidth: "100%",
        }}
      >
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-3)" }}>
            iron flight // new york city
          </span>
          <div className="flex items-center gap-4">
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-2)" }}>
              score {score} · best {best}
            </span>
            <button
              onClick={onClose}
              aria-label="Close game"
              style={{
                width: 26,
                height: 26,
                borderRadius: 6,
                background: "var(--surface-2)",
                border: "1px solid var(--border)",
                color: "var(--text-2)",
                fontSize: 13,
                lineHeight: 1,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div className="relative" style={{ borderRadius: 8, overflow: "hidden", border: "1px solid var(--border)" }}>
          <canvas
            ref={canvasRef}
            onPointerDown={flap}
            style={{ width: "min(420px, calc(100vw - 64px))", height: "auto", aspectRatio: `${W} / ${H}`, display: "block", touchAction: "none", cursor: "pointer" }}
          />

          {uiState !== "playing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ background: "rgba(10,14,22,0.55)", pointerEvents: "none" }}>
              {uiState === "ready" ? (
                <>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>Iron flight</p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--text-2)", marginTop: 8, maxWidth: 250 }}>
                    Tap, click, or press space to fire the repulsors. Thread the skyline.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>Down in midtown.</p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-2)", marginTop: 8 }}>
                    score {score} · best {best}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-3)", marginTop: 10 }}>
                    Tap or press space to fly again
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
