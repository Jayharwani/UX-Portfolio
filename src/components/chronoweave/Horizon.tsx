/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · the Horizon (brief §8.3) — the one signature element.

   A full-width, gently curved arc spanning the day from sunrise to sunset,
   flattening into night at the edges, drawn as a hairline over the ambient
   wash. A solid --cw-dusk marker sits at ACTUAL now; a hollow marker at
   FELT now (projected via the Time Signature). The shaded span between
   them IS time blindness — the entire thesis in one visual.
   ────────────────────────────────────────────────────────────────────────── */
import { useEffect, useMemo, useState } from "react";
import { solar, feltNow, type TimeSignature, type SolarConfig, type MedWindow } from "./solar";
import { fmtClock, fmtAmPm, minutesOf } from "./ui";

/* Illustrative signature for the onboarding mini-Horizon, before the user
   has calibrated. Replaced by the real Time Signature after the suite. */
export const DEMO_SIGNATURE: TimeSignature = {
  rate: 0.86,
  variability: 0.1,
  loadFactor: 1.8,
  steadiness: "steady",
  slipPeriods: [],
  createdAt: 0,
};

const W = 360; // viewBox width
const H = 132; // viewBox height for the full version
const BASE = 104; // arc baseline y
const AMP = 74; // arc amplitude

interface HorizonProps {
  sig: TimeSignature;
  cfg: SolarConfig;
  med?: MedWindow;
  mini?: boolean; // onboarding: no numerals, shorter
}

export function Horizon({ sig, cfg, med, mini = false }: HorizonProps) {
  const [now, setNow] = useState(() => solar.now());

  useEffect(() => {
    // follow the engine (real minutes AND demo-time sweeps), plus a light
    // local tick so the marker never feels frozen between engine minutes
    const un = solar.subscribe(() => setNow(solar.now()));
    const t = window.setInterval(() => setNow(solar.now()), 15_000);
    return () => {
      un();
      window.clearInterval(t);
    };
  }, []);

  const { rise, set } = { rise: cfg.sunriseMin, set: cfg.sunsetMin };

  /* x-axis spans sunrise−150m → sunset+150m so night visibly flattens */
  const x0 = rise - 150;
  const x1 = set + 150;
  const toX = (min: number) => ((Math.min(x1, Math.max(x0, min)) - x0) / (x1 - x0)) * W;

  /* the day curve: flat at night, sine arc between sunrise and sunset */
  const toY = (min: number) => {
    if (min <= rise || min >= set) return BASE;
    const t = (min - rise) / (set - rise);
    return BASE - AMP * Math.sin(Math.PI * t);
  };

  const arcPath = useMemo(() => {
    const pts: string[] = [];
    const N = 72;
    for (let i = 0; i <= N; i++) {
      const min = x0 + ((x1 - x0) * i) / N;
      pts.push(`${i === 0 ? "M" : "L"}${toX(min).toFixed(1)},${toY(min).toFixed(1)}`);
    }
    return pts.join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rise, set]);

  const nowMin = minutesOf(now);
  const felt = feltNow(now, sig, cfg, med);
  const feltMin = minutesOf(felt);

  const ax = toX(nowMin);
  const ay = toY(nowMin);
  const fx = toX(feltMin);
  const fy = toY(feltMin);

  /* the gap between felt and actual, shaded down to the baseline */
  const gapPath = useMemo(() => {
    const from = Math.min(nowMin, feltMin);
    const to = Math.max(nowMin, feltMin);
    if (to - from < 0.5) return "";
    const pts: string[] = [`M${toX(from).toFixed(1)},${BASE}`];
    const N = 24;
    for (let i = 0; i <= N; i++) {
      const min = from + ((to - from) * i) / N;
      pts.push(`L${toX(min).toFixed(1)},${toY(min).toFixed(1)}`);
    }
    pts.push(`L${toX(to).toFixed(1)},${BASE} Z`);
    return pts.join(" ");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nowMin, feltMin, rise, set]);

  const vbH = mini ? H - 10 : H;

  return (
    <div>
      <svg
        viewBox={`0 0 ${W} ${vbH}`}
        width="100%"
        role="img"
        aria-label={`Horizon: it feels like ${fmtClock(feltMin)} ${fmtAmPm(feltMin)}, actually ${fmtClock(nowMin)} ${fmtAmPm(nowMin)}`}
        style={{ display: "block", overflow: "visible" }}
      >
        {/* shaded drift gap — the thesis */}
        {gapPath && <path d={gapPath} fill="var(--cw-dusk-soft)" opacity="0.85" />}

        {/* night flats + day arc, hairline */}
        <path d={arcPath} fill="none" stroke="color-mix(in srgb, var(--cw-ink) 22%, transparent)" strokeWidth="1" />

        {/* sunrise / sunset ticks */}
        <line x1={toX(rise)} y1={BASE + 3} x2={toX(rise)} y2={BASE + 9} stroke="var(--cw-ink3)" strokeWidth="1" />
        <line x1={toX(set)} y1={BASE + 3} x2={toX(set)} y2={BASE + 9} stroke="var(--cw-ink3)" strokeWidth="1" />

        {/* felt marker: hollow */}
        <circle cx={fx} cy={fy} r="5" fill="var(--cw-wash)" stroke="var(--cw-dusk)" strokeWidth="1.8" />
        {/* actual marker: solid, with a quiet breathing halo */}
        <circle className="cw-breathe" cx={ax} cy={ay} r="9" fill="var(--cw-dusk)" opacity="0.14" />
        <circle cx={ax} cy={ay} r="5" fill="var(--cw-dusk)" />
      </svg>

      {!mini && (
        <div style={{ textAlign: "center", marginTop: 4 }}>
          <div className="cw-cap" style={{ marginBottom: 2 }}>feels like</div>
          <div
            className="cw-num"
            style={{ fontSize: 60, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.05, color: "var(--cw-ink)" }}
          >
            {fmtClock(feltMin)}
            <span style={{ fontSize: 22, fontWeight: 400, color: "var(--cw-ink2)", marginLeft: 6 }}>{fmtAmPm(feltMin)}</span>
          </div>
          <div className="cw-sec cw-num" style={{ marginTop: 4 }}>
            actually {fmtClock(nowMin)} {fmtAmPm(nowMin)}
          </div>
        </div>
      )}
    </div>
  );
}
