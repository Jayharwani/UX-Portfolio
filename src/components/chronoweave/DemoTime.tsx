/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · Demo time (brief §13) — reviewer affordance, desktop only.
   Lives in the frame chrome, clearly OUTSIDE the product UI. Overrides the
   Solar Engine and can sweep 24 hours in 60 seconds so a visitor at 2pm
   still gets to feel dawn, dusk and night. Touches nothing else.
   ────────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from "react";
import { solar } from "./solar";
import { GlyphDemoTime, fmtClock, fmtAmPm } from "./ui";

export function DemoTime() {
  const [open, setOpen] = useState(false);
  const [demoMin, setDemoMin] = useState<number | null>(null);
  const [sweeping, setSweeping] = useState(false);
  const rafRef = useRef(0);

  /* 24h in 60s → 24 demo-minutes per real second */
  useEffect(() => {
    if (!sweeping) return;
    let last = performance.now();
    const step = (t: number) => {
      const dt = (t - last) / 1000;
      last = t;
      setDemoMin((m) => {
        const next = ((m ?? solar.state.minutes) + dt * 24) % 1440;
        solar.setOverride(next);
        return next;
      });
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [sweeping]);

  const exit = () => {
    setSweeping(false);
    setDemoMin(null);
    solar.setOverride(null);
    setOpen(false);
  };

  const scrub = (min: number) => {
    setSweeping(false);
    setDemoMin(min);
    solar.setOverride(min);
  };

  const pill: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    border: "1px solid var(--cw-line)",
    background: "rgba(255,255,255,0.75)",
    color: "var(--cw-ink2)",
    borderRadius: 999,
    padding: "9px 14px",
    fontSize: 13,
    fontWeight: 500,
    fontFamily: "inherit",
    cursor: "pointer",
    backdropFilter: "blur(6px)",
  };

  if (!open) {
    return (
      <button style={pill} onClick={() => setOpen(true)} aria-label="Open demo time — preview the full day">
        <GlyphDemoTime size={15} strokeWidth={1.7} />
        Demo time
      </button>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        border: "1px solid var(--cw-line)",
        background: "rgba(255,255,255,0.85)",
        borderRadius: 18,
        padding: "10px 14px",
        backdropFilter: "blur(8px)",
        width: 400,
        maxWidth: "92vw",
      }}
    >
      <span className="cw-cap" style={{ flexShrink: 0 }}>Demo time</span>
      <input
        className="cw-range"
        type="range"
        min={0}
        max={1439}
        step={5}
        value={Math.round(demoMin ?? solar.state.minutes)}
        onChange={(e) => scrub(Number(e.target.value))}
        aria-label="Scrub the time of day"
        style={{ flex: 1 }}
      />
      <span className="cw-cap cw-num" style={{ width: 66, textAlign: "right", flexShrink: 0 }}>
        {fmtClock(demoMin ?? solar.state.minutes)} {fmtAmPm(demoMin ?? solar.state.minutes)}
      </span>
      <button style={{ ...pill, padding: "7px 11px" }} onClick={() => setSweeping((s) => !s)} aria-pressed={sweeping} aria-label="Sweep 24 hours in one minute">
        {sweeping ? "Pause" : "Sweep"}
      </button>
      <button style={{ ...pill, padding: "7px 11px" }} onClick={exit} aria-label="Exit demo time">
        Exit
      </button>
    </div>
  );
}
