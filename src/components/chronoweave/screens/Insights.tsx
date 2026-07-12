/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · Insights (brief §8.5)
   Three quiet modules. Charts are hand-rolled SVG. Sample days are labeled
   honestly and get replaced as real days accrue. Never compliance-framed.
   ────────────────────────────────────────────────────────────────────────── */
import { useMemo } from "react";
import { useCW } from "../store";
import { Card, Button } from "../ui";

const DAY_NAMES = ["Sundays", "Mondays", "Tuesdays", "Wednesdays", "Thursdays", "Fridays", "Saturdays"];

function DriftChart() {
  const { st } = useCW();
  const days = useMemo(() => [...st.driftDays].sort((a, b) => (a.day < b.day ? -1 : 1)).slice(-14), [st.driftDays]);
  const hasSample = days.some((d) => d.sample);

  if (days.length < 2) {
    return (
      <Card>
        <div className="cw-cap" style={{ marginBottom: 6 }}>Drift trend</div>
        <p className="cw-sec" style={{ margin: 0 }}>Trends appear as your days accrue.</p>
      </Card>
    );
  }

  const W = 320;
  const H = 110;
  const PAD = 10;
  const vals = days.map((d) => d.drift * 100); // percent
  const lo = Math.min(...vals, -5);
  const hi = Math.max(...vals, 5);
  const toX = (i: number) => PAD + ((W - PAD * 2) * i) / (days.length - 1);
  const toY = (v: number) => PAD + (H - PAD * 2) * (1 - (v - lo) / (hi - lo || 1));

  const line = vals.map((v, i) => `${i === 0 ? "M" : "L"}${toX(i).toFixed(1)},${toY(v).toFixed(1)}`).join(" ");

  /* personal typical band: mean ± 1 sd */
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
  const sd = Math.sqrt(vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length);
  const bandTop = toY(mean + sd);
  const bandBot = toY(mean - sd);

  /* annotation: which weekday drifts most (needs 2+ distinct weekdays) */
  const byDay = new Map<number, number[]>();
  days.forEach((d) => {
    const wd = new Date(d.day + "T12:00:00").getDay();
    byDay.set(wd, [...(byDay.get(wd) ?? []), Math.abs(d.drift)]);
  });
  let worst: { wd: number; m: number } | null = null;
  byDay.forEach((arr, wd) => {
    const m = arr.reduce((a, b) => a + b, 0) / arr.length;
    if (!worst || m > worst.m) worst = { wd, m };
  });

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="cw-cap">Drift trend · 14 days</span>
        {hasSample && (
          <span className="cw-cap" style={{ color: "var(--cw-dusk)" }}>
            sample days — yours replace them
          </span>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" role="img" aria-label={`Daily average drift over ${days.length} days, mean ${mean.toFixed(0)} percent`}>
        {/* typical range band */}
        <rect x={PAD} y={Math.min(bandTop, bandBot)} width={W - PAD * 2} height={Math.abs(bandBot - bandTop)} fill="var(--cw-dusk-soft)" opacity="0.75" rx="4" />
        {/* zero line */}
        <line x1={PAD} y1={toY(0)} x2={W - PAD} y2={toY(0)} stroke="var(--cw-line)" strokeWidth="1" />
        {/* the drift line */}
        <path d={line} fill="none" stroke="var(--cw-dusk)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        {vals.map((v, i) => (
          <circle key={i} cx={toX(i)} cy={toY(v)} r={i === vals.length - 1 ? 3 : 1.8} fill="var(--cw-dusk)" />
        ))}
      </svg>
      <p className="cw-sec cw-num" style={{ margin: "8px 0 0" }}>
        {worst && byDay.size > 1 ? `${DAY_NAMES[worst.wd]} drift most. ` : ""}
        Typical day: {mean < 0 ? "" : "+"}
        {mean.toFixed(0)}% drift.
      </p>
    </Card>
  );
}

function TimeSurfaced() {
  const { st } = useCW();
  const sessions = st.sessions;
  const hasSample = sessions.some((s) => s.sample);
  if (sessions.length === 0) {
    return (
      <Card>
        <div className="cw-cap" style={{ marginBottom: 6 }}>Time surfaced</div>
        <p className="cw-sec" style={{ margin: 0 }}>Your first focus session will land here.</p>
      </Card>
    );
  }
  /* surfaced within 10 min of intent — framed as time reclaimed, never compliance */
  const onTime = sessions.filter((s) => Math.abs(s.actualMin - s.plannedMin) <= 10);
  const caught = onTime.reduce((a, s) => a + s.plannedMin, 0);
  const hours = Math.round((caught / 60) * 10) / 10;
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 8 }}>
        <span className="cw-cap">Time surfaced</span>
        {hasSample && (
          <span className="cw-cap" style={{ color: "var(--cw-dusk)" }}>
            includes sample sessions
          </span>
        )}
      </div>
      <p className="cw-body cw-num" style={{ margin: 0 }}>
        You surfaced on time <strong>{onTime.length} of {sessions.length}</strong> sessions — about{" "}
        <strong>{hours} hours</strong> caught before they slipped.
      </p>
    </Card>
  );
}

function History({ onRecalibrate }: { onRecalibrate: () => void }) {
  const { st } = useCW();
  return (
    <Card>
      <div className="cw-cap" style={{ marginBottom: 10 }}>Calibration history</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {st.signatureHistory.length === 0 && <p className="cw-sec" style={{ margin: 0 }}>No signatures yet.</p>}
        {[...st.signatureHistory].reverse().map((s, i) => {
          const pct = Math.round(Math.abs(1 - s.rate) * 100);
          const d = new Date(s.createdAt);
          return (
            <div key={s.createdAt + i} className="cw-num" style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "8px 12px", border: "1px solid var(--cw-line)", borderRadius: 14 }}>
              <span className="cw-body" style={{ fontSize: 16 }}>
                {s.rate < 1 ? "−" : s.rate > 1 ? "+" : "±"}
                {pct}% · {s.steadiness}
              </span>
              <span className="cw-cap">{d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}</span>
            </div>
          );
        })}
      </div>
      <p className="cw-sec" style={{ margin: "10px 0 12px" }}>
        Perception changes. ChronoWeave expects that.
      </p>
      <Button block variant="ghost" onClick={onRecalibrate}>
        Recalibrate
      </Button>
    </Card>
  );
}

export function Insights() {
  const { set } = useCW();
  return (
    <div className="cw-rise" style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 10 }}>
      <h2 className="cw-title" style={{ margin: 0 }}>
        Insights
      </h2>
      <DriftChart />
      <TimeSurfaced />
      <History onRecalibrate={() => set({ phase: "calibration" })} />
    </div>
  );
}
