/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · Settings (brief §8.6)
   Grouped list, hairline dividers. States the truth once (haptic capability,
   privacy) and then behaves well forever. Geolocation is asked ONLY when the
   real-sunrise toggle is switched on (§4).
   ────────────────────────────────────────────────────────────────────────── */
import { useState } from "react";
import { useCW, type ChannelId } from "../store";
import { DEFAULT_SOLAR, solar } from "../solar";
import { Card, Button, Switch, GlyphHaptic, GlyphSound, GlyphLight, fmtClock, fmtAmPm } from "../ui";
import { audio, haptic, lightPulse, quarterPattern, canVibrate } from "../sensory";

/* Sunrise/sunset from coordinates — classic declination approximation.
   Accuracy ±15 min (no equation-of-time term); plenty for ambience, and
   documented as an approximation. Returns minutes since local midnight. */
function sunTimes(lat: number, lng: number, date: Date): { rise: number; set: number } | null {
  const rad = Math.PI / 180;
  const start = new Date(date.getFullYear(), 0, 0);
  const N = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  const decl = -23.44 * rad * Math.cos(((2 * Math.PI) / 365) * (N + 10));
  const cosH = -Math.tan(lat * rad) * Math.tan(decl);
  if (cosH < -1 || cosH > 1) return null; // polar day/night
  const H = Math.acos(cosH) / rad; // degrees
  const tz = -date.getTimezoneOffset(); // minutes east of UTC
  const noonLocal = 720 - 4 * lng + tz;
  return { rise: noonLocal - 4 * H, set: noonLocal + 4 * H };
}

function ChannelRow({ id, label, G }: { id: ChannelId; label: string; G: typeof GlyphHaptic }) {
  const { st, set } = useCW();
  const ch = st.channels[id];

  const preview = (intensity: 1 | 2 | 3) => {
    if (id === "haptic") haptic(quarterPattern(2, intensity), intensity);
    if (id === "sound") {
      if (audio.arm()) set({ audioArmed: true });
      audio.playPreview(intensity);
    }
    if (id === "light") lightPulse();
  };

  return (
    <div style={{ paddingBottom: ch.enabled ? 4 : 0 }}>
      <div className="cw-row" style={{ borderBottom: "none" }}>
        <G size={20} color="var(--cw-ink2)" />
        <span className="cw-body" style={{ flex: 1, fontSize: 16 }}>{label}</span>
        <Switch
          on={ch.enabled}
          label={`${label} channel`}
          onChange={(v) => set((p) => ({ channels: { ...p.channels, [id]: { ...p.channels[id], enabled: v } } }))}
        />
      </div>
      {ch.enabled && (
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 2px 8px 32px" }}>
          <input
            className="cw-range"
            type="range"
            min={1}
            max={3}
            step={1}
            value={ch.intensity}
            aria-label={`${label} intensity`}
            onChange={(e) =>
              set((p) => ({ channels: { ...p.channels, [id]: { ...p.channels[id], intensity: Number(e.target.value) as 1 | 2 | 3 } } }))
            }
            onPointerUp={(e) => preview(Number((e.target as HTMLInputElement).value) as 1 | 2 | 3)}
            onKeyUp={(e) => {
              if (e.key.startsWith("Arrow")) preview(Number((e.target as HTMLInputElement).value) as 1 | 2 | 3);
            }}
            style={{ flex: 1 }}
          />
          <span className="cw-cap" style={{ width: 62, textAlign: "right" }}>
            {["soft", "standard", "firm"][ch.intensity - 1]}
          </span>
        </div>
      )}
      {id === "haptic" && !canVibrate && (
        <p className="cw-sec" style={{ margin: "0 0 8px 32px", fontSize: 13 }}>
          This device can't vibrate in the browser — ChronoWeave shows a light pulse instead.
        </p>
      )}
    </div>
  );
}

export function Settings() {
  const { st, set, exportJSON, eraseAll } = useCW();
  const [confirmErase, setConfirmErase] = useState(false);
  const [sunNote, setSunNote] = useState<string | null>(null);

  const toMin = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const toTime = (min: number) => {
    const m = ((Math.round(min) % 1440) + 1440) % 1440;
    return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  };

  const enableRealSun = (on: boolean) => {
    if (!on) {
      set({ useRealSun: false, solarCfg: DEFAULT_SOLAR });
      solar.setConfig(DEFAULT_SOLAR);
      setSunNote(null);
      return;
    }
    if (!("geolocation" in navigator)) {
      setSunNote("This browser doesn't share location — staying with the default curve.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const t = sunTimes(pos.coords.latitude, pos.coords.longitude, new Date());
        if (!t) {
          setSunNote("Polar sky today — staying with the default curve.");
          return;
        }
        const cfg = { sunriseMin: Math.round(t.rise), sunsetMin: Math.round(t.set) };
        set({ useRealSun: true, solarCfg: cfg });
        solar.setConfig(cfg);
        setSunNote(`Sunrise ${fmtClock(cfg.sunriseMin)} ${fmtAmPm(cfg.sunriseMin)} · sunset ${fmtClock(cfg.sunsetMin)} ${fmtAmPm(cfg.sunsetMin)} — approximate, on purpose.`);
      },
      () => {
        setSunNote("Location wasn't shared — staying with the default curve. That's fine.");
      },
      { timeout: 8000 }
    );
  };

  const doExport = () => {
    const blob = new Blob([exportJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chronoweave-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="cw-rise" style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 10 }}>
      <h2 className="cw-title" style={{ margin: 0 }}>Settings</h2>

      {/* channels */}
      <Card>
        <div className="cw-cap" style={{ marginBottom: 4 }}>Channels</div>
        <ChannelRow id="haptic" label="Touch" G={GlyphHaptic} />
        <div style={{ borderTop: "1px solid var(--cw-line)" }} />
        <ChannelRow id="sound" label="Sound" G={GlyphSound} />
        <div style={{ borderTop: "1px solid var(--cw-line)" }} />
        <ChannelRow id="light" label="Light" G={GlyphLight} />
      </Card>

      {/* environments */}
      <Card>
        <div className="cw-cap" style={{ marginBottom: 4 }}>Environments</div>
        <div className="cw-row">
          <span className="cw-body" style={{ flex: 1, fontSize: 16 }}>Quiet hours</span>
          <Switch on={st.quietHours.enabled} label="Quiet hours" onChange={(v) => set((p) => ({ quietHours: { ...p.quietHours, enabled: v } }))} />
        </div>
        {st.quietHours.enabled && (
          <div className="cw-rise" style={{ display: "flex", gap: 8, padding: "2px 0 10px" }}>
            <input className="cw-input cw-num" type="time" aria-label="Quiet from" value={toTime(st.quietHours.startMin)} onChange={(e) => set((p) => ({ quietHours: { ...p.quietHours, startMin: toMin(e.target.value) } }))} style={{ flex: 1 }} />
            <input className="cw-input cw-num" type="time" aria-label="Quiet until" value={toTime(st.quietHours.endMin)} onChange={(e) => set((p) => ({ quietHours: { ...p.quietHours, endMin: toMin(e.target.value) } }))} style={{ flex: 1 }} />
          </div>
        )}
        <p className="cw-sec" style={{ margin: "0 0 8px", fontSize: 13 }}>
          In quiet hours, touch and sound rest. Light continues.
        </p>
        <div className="cw-row">
          <span style={{ flex: 1 }}>
            <span className="cw-body" style={{ fontSize: 16, display: "block" }}>Somewhere loud right now</span>
            <span className="cw-sec" style={{ fontSize: 13 }}>Sound rests, touch leans in.</span>
          </span>
          <Switch on={st.loudActive} label="Loud environment" onChange={(v) => set({ loudActive: v })} />
        </div>
        {st.loudEnvironments.length > 0 && (
          <p className="cw-sec" style={{ margin: "6px 0 0", fontSize: 13 }}>
            From calibration: {st.loudEnvironments.join(", ")}.
          </p>
        )}
      </Card>

      {/* medication window */}
      <Card>
        <div className="cw-row" style={{ borderBottom: "none" }}>
          <span style={{ flex: 1 }}>
            <span className="cw-cap" style={{ display: "block" }}>Medication window</span>
            <span className="cw-sec" style={{ fontSize: 13 }}>During the window, weaving softens; as it wears off, it leans in.</span>
          </span>
          <Switch on={st.med.enabled} label="Medication window" onChange={(v) => set((p) => ({ med: { ...p.med, enabled: v } }))} />
        </div>
        {st.med.enabled && (
          <div className="cw-rise" style={{ display: "flex", gap: 8, paddingTop: 4 }}>
            <input className="cw-input cw-num" type="time" aria-label="Window starts" value={toTime(st.med.startMin)} onChange={(e) => set((p) => ({ med: { ...p.med, startMin: toMin(e.target.value) } }))} style={{ flex: 1 }} />
            <select className="cw-input cw-num" aria-label="Window length" value={st.med.durationMin} onChange={(e) => set((p) => ({ med: { ...p.med, durationMin: Number(e.target.value) } }))} style={{ flex: 1 }}>
              {[4, 6, 8, 10, 12].map((h) => (
                <option key={h} value={h * 60}>{h} hours</option>
              ))}
            </select>
          </div>
        )}
      </Card>

      {/* solar curve */}
      <Card>
        <div className="cw-row" style={{ borderBottom: "none" }}>
          <span style={{ flex: 1 }}>
            <span className="cw-cap" style={{ display: "block" }}>Solar curve</span>
            <span className="cw-sec cw-num" style={{ fontSize: 13 }}>
              {st.useRealSun ? "Your real sunrise, from location." : "Default 6:30 – 19:30."}
            </span>
          </span>
          <Switch on={st.useRealSun} label="Use my real sunrise" onChange={enableRealSun} />
        </div>
        {sunNote && <p className="cw-sec cw-num cw-rise" style={{ margin: "6px 0 0", fontSize: 13 }}>{sunNote}</p>}
      </Card>

      {/* recalibrate */}
      <Card>
        <p className="cw-sec" style={{ margin: "0 0 10px" }}>
          Perception changes with seasons, sleep, and life. Re-run the suite any time.
        </p>
        <Button block variant="ghost" onClick={() => set({ phase: "calibration" })}>
          Recalibrate
        </Button>
      </Card>

      {/* data & privacy */}
      <Card>
        <div className="cw-cap" style={{ marginBottom: 6 }}>Data & privacy</div>
        <p className="cw-sec" style={{ margin: "0 0 12px" }}>
          Everything lives on this device. Nothing is sent anywhere.
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" onClick={doExport} style={{ flex: 1 }}>
            Export JSON
          </Button>
          {!confirmErase ? (
            <Button variant="ghost" onClick={() => setConfirmErase(true)} style={{ flex: 1 }}>
              Erase all
            </Button>
          ) : (
            <Button
              onClick={() => {
                eraseAll();
                setConfirmErase(false);
              }}
              style={{ flex: 1, background: "#8A4B43" }}
            >
              Erase — sure
            </Button>
          )}
        </div>
        {confirmErase && (
          <button className="cw-btn cw-btn-quiet cw-btn-block cw-rise" style={{ marginTop: 4, minHeight: 40 }} onClick={() => setConfirmErase(false)}>
            Keep my data
          </button>
        )}
      </Card>

      {/* about */}
      <Card>
        <div className="cw-cap" style={{ marginBottom: 6 }}>About</div>
        <p className="cw-sec" style={{ margin: 0 }}>
          ChronoWeave is a clock you feel instead of read — for brains that don't feel time passing. It calibrates to how
          far your perception drifts, then keeps you loosely synced to the day on three quiet sensory channels. No
          interruptions, no shame. Designed and built by Jay Harwani.
        </p>
      </Card>
    </div>
  );
}
