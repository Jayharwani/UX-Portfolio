import { useEffect, useRef, useState, useCallback } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Flyer: the hidden Easter-egg game. A Flappy mechanic on an HTML5 canvas.
   Original stylized armored flyer in the slate palette; warm accent stays
   contained inside the game. Lazy-loaded; never touches initial page load.
   ────────────────────────────────────────────────────────────────────────── */

const BEST_KEY = "flyer_best_score";

type GameState = "ready" | "playing" | "over";

interface Building {
  x: number;
  gapY: number; // center of the gap
  passed: boolean;
  windows: { x: number; y: number; lit: boolean }[];
}

const W = 420;
const H = 560;
const GRAVITY = 1350; // px/s^2
const THRUST = -430; // px/s
const SPEED = 150; // px/s world scroll
const GAP = 168;
const BW = 62; // building width
const SPACING = 230;
const FLYER_X = 118;
const FLYER_R = 13; // collision radius

function makeBuilding(x: number): Building {
  const gapY = 110 + Math.random() * (H - 300);
  const windows: Building["windows"] = [];
  for (let wy = 24; wy < H; wy += 34) {
    for (let wx = 10; wx < BW - 14; wx += 20) {
      windows.push({ x: wx, y: wy, lit: Math.random() < 0.28 });
    }
  }
  return { x, gapY, passed: false, windows };
}

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
    flame: 0, // seconds of visible repulsor flame
    t: 0,
  });

  const reset = useCallback(() => {
    game.current = {
      y: H / 2,
      vy: 0,
      buildings: [makeBuilding(W + 60), makeBuilding(W + 60 + SPACING), makeBuilding(W + 60 + SPACING * 2)],
      score: 0,
      flame: 0,
      t: 0,
    };
    setScore(0);
  }, []);

  const flap = useCallback(() => {
    const s = stateRef.current;
    if (s === "ready") {
      reset();
      stateRef.current = "playing";
      setUiState("playing");
      game.current.vy = THRUST;
      game.current.flame = 0.14;
      return;
    }
    if (s === "playing") {
      game.current.vy = THRUST;
      game.current.flame = 0.14;
      return;
    }
    if (s === "over") {
      stateRef.current = "ready";
      setUiState("ready");
      reset();
    }
  }, [reset]);

  /* input */
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

  /* game loop */
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

        for (const b of g.buildings) {
          b.x -= SPEED * dt;
          if (!b.passed && b.x + BW < FLYER_X - FLYER_R) {
            b.passed = true;
            g.score += 1;
            setScore(g.score);
          }
        }
        if (g.buildings[0].x < -BW - 10) {
          g.buildings.shift();
          g.buildings.push(makeBuilding(g.buildings[g.buildings.length - 1].x + SPACING));
        }

        // collisions: ceiling / ground
        if (g.y - FLYER_R < 0 || g.y + FLYER_R > H - 26) die();
        // buildings
        for (const b of g.buildings) {
          if (FLYER_X + FLYER_R > b.x && FLYER_X - FLYER_R < b.x + BW) {
            if (g.y - FLYER_R < b.gapY - GAP / 2 || g.y + FLYER_R > b.gapY + GAP / 2) die();
          }
        }
      } else if (stateRef.current === "ready") {
        // idle hover
        g.y = H / 2 + Math.sin(g.t * 2.4) * 8;
        g.vy = 0;
      }

      draw(ctx, g);
      raf = requestAnimationFrame(step);
    };

    const draw = (c: CanvasRenderingContext2D, g: typeof game.current) => {
      // sky
      const sky = c.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, "#0D1220");
      sky.addColorStop(1, "#0A0E16");
      c.fillStyle = sky;
      c.fillRect(0, 0, W, H);

      // soft accent glow low in the frame
      const glow = c.createRadialGradient(W * 0.7, H * 0.95, 20, W * 0.7, H * 0.95, 320);
      glow.addColorStop(0, "rgba(91,140,255,0.10)");
      glow.addColorStop(1, "rgba(91,140,255,0)");
      c.fillStyle = glow;
      c.fillRect(0, 0, W, H);

      // buildings
      for (const b of g.buildings) {
        const topH = b.gapY - GAP / 2;
        const botY = b.gapY + GAP / 2;
        c.fillStyle = "#161D2E";
        c.fillRect(b.x, 0, BW, topH);
        c.fillRect(b.x, botY, BW, H - botY);
        c.strokeStyle = "#232C3D";
        c.lineWidth = 1;
        c.strokeRect(b.x + 0.5, -2, BW - 1, topH + 1);
        c.strokeRect(b.x + 0.5, botY + 0.5, BW - 1, H - botY);
        // lit windows
        for (const wnd of b.windows) {
          const wy = wnd.y;
          const inTop = wy < topH - 10;
          const inBot = wy > botY + 6 && wy < H - 40;
          if (!inTop && !inBot) continue;
          c.fillStyle = wnd.lit ? "rgba(217,164,65,0.55)" : "rgba(91,140,255,0.10)";
          c.fillRect(b.x + wnd.x, wy, 8, 10);
        }
      }

      // ground strip
      c.fillStyle = "#111725";
      c.fillRect(0, H - 26, W, 26);
      c.strokeStyle = "#2E3950";
      c.beginPath();
      c.moveTo(0, H - 26.5);
      c.lineTo(W, H - 26.5);
      c.stroke();

      // flyer
      const tilt = stateRef.current === "playing" ? Math.max(-0.45, Math.min(0.7, g.vy / 700)) : 0;
      c.save();
      c.translate(FLYER_X, g.y);
      c.rotate(tilt);

      // repulsor flame
      if (g.flame > 0) {
        const f = g.flame / 0.14;
        const flame = c.createLinearGradient(0, 12, 0, 30);
        flame.addColorStop(0, `rgba(255,196,110,${0.85 * f})`);
        flame.addColorStop(1, "rgba(255,120,60,0)");
        c.fillStyle = flame;
        c.beginPath();
        c.moveTo(-5, 12);
        c.lineTo(5, 12);
        c.lineTo(0, 30);
        c.closePath();
        c.fill();
      }

      // body: compact armored capsule, slate
      c.fillStyle = "#2E3950";
      c.beginPath();
      c.roundRect(-11, -14, 22, 27, 8);
      c.fill();
      c.strokeStyle = "#3D4A66";
      c.lineWidth = 1;
      c.stroke();
      // chest core, warm gold (the one warm pop, contained in the game)
      c.fillStyle = "#D9A441";
      c.beginPath();
      c.arc(0, 0, 4, 0, Math.PI * 2);
      c.fill();
      c.fillStyle = "rgba(217,164,65,0.35)";
      c.beginPath();
      c.arc(0, 0, 7, 0, Math.PI * 2);
      c.fill();
      // helmet: rounded slab with gold visor slit
      c.fillStyle = "#232C3D";
      c.beginPath();
      c.roundRect(-8, -24, 16, 13, 5);
      c.fill();
      c.fillStyle = "#D9A441";
      c.fillRect(-5, -19, 10, 2.6);
      // muted red shoulder accents
      c.fillStyle = "#8A3B3B";
      c.fillRect(-11, -12, 3, 7);
      c.fillRect(8, -12, 3, 7);

      c.restore();
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [reset]);

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center px-4"
      role="dialog"
      aria-label="Flyer mini game"
    >
      {/* dim slate backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{ background: "rgba(6,9,15,0.78)", backdropFilter: "blur(10px)" }}
      />

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
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--text-3)",
            }}
          >
            flyer // rooftop run
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

          {/* overlays */}
          {uiState !== "playing" && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center text-center"
              style={{ background: "rgba(10,14,22,0.55)", pointerEvents: "none" }}
            >
              {uiState === "ready" ? (
                <>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>
                    Rooftop run
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13.5, color: "var(--text-2)", marginTop: 8, maxWidth: 240 }}>
                    Tap, click, or press space to fly. Slip through the gaps.
                  </p>
                </>
              ) : (
                <>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 600, color: "var(--text)" }}>
                    Down.
                  </p>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-2)", marginTop: 8 }}>
                    score {score} · best {best}
                  </p>
                  <p style={{ fontFamily: "var(--font-body)", fontSize: 13, color: "var(--text-3)", marginTop: 10 }}>
                    Tap or press space to restart
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
