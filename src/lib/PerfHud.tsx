import { useEffect, useRef, useState } from "react";
import { PERF_ACTIVE, PERF_QUERY } from "./perfFlags";

/* ──────────────────────────────────────────────────────────────────────────
   TEMPORARY — on-screen frame-time readout for the bisect. Delete with
   perfFlags.ts once the culprit is found.

   The bisect needs one number per run: p95 frame time. Reading that out of the
   DevTools frames track is fiddly and easy to misread, and a misread number
   sends the whole investigation the wrong way. So it goes on the screen.

   Shows only when a ?perf= flag is present, or with ?hud=1 for the baseline
   row. It samples timestamps in a rAF loop and does nothing else — no layout
   reads, no DOM writes except its own text once per second, so it does not
   meaningfully perturb what it is measuring.
   ────────────────────────────────────────────────────────────────────────── */

function pct(sorted: number[], p: number) {
  if (!sorted.length) return 0;
  const i = Math.min(sorted.length - 1, Math.max(0, Math.round((p / 100) * sorted.length) - 1));
  return sorted[i];
}

export function PerfHud() {
  const [show, setShow] = useState(false);
  const [stats, setStats] = useState({ p50: 0, p95: 0, slow: 0, n: 0, fps: 0 });
  const frames = useRef<number[]>([]);

  useEffect(() => {
    let hud = false;
    try {
      hud = PERF_ACTIVE || new URLSearchParams(window.location.search).has("hud");
    } catch {
      hud = PERF_ACTIVE;
    }
    if (!hud) return;
    setShow(true);

    let raf = 0;
    let last = performance.now();
    let warm = 12; // skip mount / font-swap frames
    let lastPaint = 0;

    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      raf = requestAnimationFrame(tick);
      if (warm > 0) {
        warm--;
        return;
      }
      /* ignore tab-away gaps, which would otherwise dominate p95 */
      if (dt < 500) frames.current.push(dt);

      if (now - lastPaint > 500) {
        lastPaint = now;
        const sorted = [...frames.current].sort((a, b) => a - b);
        const n = sorted.length;
        setStats({
          p50: pct(sorted, 50),
          p95: pct(sorted, 95),
          slow: n ? (frames.current.filter((d) => d > 22).length / n) * 100 : 0,
          n,
          fps: n ? 1000 / (frames.current.reduce((a, b) => a + b, 0) / n) : 0,
        });
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (!show) return null;

  const bad = stats.p95 > 22;
  const reset = () => {
    frames.current = [];
    setStats({ p50: 0, p95: 0, slow: 0, n: 0, fps: 0 });
  };

  return (
    <div
      style={{
        position: "fixed",
        left: 12,
        bottom: 12,
        zIndex: 2147483647,
        background: "rgba(8,10,14,0.94)",
        color: "#E8ECF3",
        border: `1px solid ${bad ? "#E5484D" : "#3DD68C"}`,
        borderRadius: 10,
        padding: "10px 12px",
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 11.5,
        lineHeight: 1.55,
        minWidth: 190,
        pointerEvents: "auto",
        boxShadow: "0 10px 30px -12px rgba(0,0,0,.7)",
      }}
    >
      <div style={{ color: "#5B8CFF", fontWeight: 700, marginBottom: 4 }}>
        {PERF_QUERY || "baseline"}
      </div>
      <div style={{ fontVariantNumeric: "tabular-nums" }}>
        p95&nbsp;
        <strong style={{ color: bad ? "#FF6B6E" : "#3DD68C", fontSize: 15 }}>
          {stats.p95.toFixed(1)}
        </strong>
        &nbsp;ms
      </div>
      <div style={{ fontVariantNumeric: "tabular-nums", color: "#99A4B6" }}>
        p50 {stats.p50.toFixed(1)} ms · {stats.fps.toFixed(0)} fps
      </div>
      <div style={{ fontVariantNumeric: "tabular-nums", color: "#99A4B6" }}>
        slow {stats.slow.toFixed(0)}% · n={stats.n}
      </div>
      <button
        onClick={reset}
        style={{
          marginTop: 7,
          width: "100%",
          background: "#1B2333",
          color: "#E8ECF3",
          border: "1px solid #2E3950",
          borderRadius: 6,
          padding: "5px 8px",
          font: "inherit",
          cursor: "pointer",
        }}
      >
        reset
      </button>
    </div>
  );
}
