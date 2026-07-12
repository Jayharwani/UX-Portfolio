/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · Today (brief §8.3)
   The Horizon owns the screen. Below it: the next anchor (felt distance
   first), the channel tray (tap = 2s preview, long-press = rest an hour),
   and the drift chip for today's weave.
   ────────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState } from "react";
import { useCW, uid, type ChannelId } from "../store";
import { solar, feltMinutes } from "../solar";
import { Horizon, DEMO_SIGNATURE } from "../Horizon";
import { Card, Button, GlyphHaptic, GlyphSound, GlyphLight, GlyphPlus, fmtClock, fmtAmPm, fmtDur, minutesOf } from "../ui";
import { audio, haptic, lightPulse, quarterPattern } from "../sensory";

const CHANNEL_META: Record<ChannelId, { label: string; G: typeof GlyphHaptic }> = {
  haptic: { label: "Touch", G: GlyphHaptic },
  sound: { label: "Sound", G: GlyphSound },
  light: { label: "Light", G: GlyphLight },
};

function ChannelTray() {
  const { st, set } = useCW();
  const [, force] = useState(0);
  const pressTimer = useRef<number | null>(null);
  const longFired = useRef(false);

  /* tick once a minute so resting countdowns stay honest */
  useEffect(() => {
    const t = window.setInterval(() => force((n) => n + 1), 30_000);
    return () => window.clearInterval(t);
  }, []);

  const preview = (id: ChannelId) => {
    const ch = st.channels[id];
    if (!ch.enabled) return;
    if (id === "haptic") haptic(quarterPattern(2, ch.intensity), ch.intensity);
    if (id === "sound") {
      if (audio.arm()) set({ audioArmed: true });
      audio.playPreview(ch.intensity);
    }
    if (id === "light") lightPulse();
  };

  const restHour = (id: ChannelId) => {
    set((prev) => ({
      channels: {
        ...prev.channels,
        [id]: { ...prev.channels[id], restUntil: Date.now() + 60 * 60_000 },
      },
    }));
  };
  const wake = (id: ChannelId) => {
    set((prev) => ({
      channels: { ...prev.channels, [id]: { ...prev.channels[id], restUntil: null } },
    }));
  };

  return (
    <Card>
      <div className="cw-cap" style={{ marginBottom: 10 }}>
        Channels — tap to preview, hold to rest an hour
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {(Object.keys(CHANNEL_META) as ChannelId[]).map((id) => {
          const { label, G } = CHANNEL_META[id];
          const ch = st.channels[id];
          const resting = ch.restUntil != null && ch.restUntil > Date.now();
          const restMin = resting ? Math.ceil((ch.restUntil! - Date.now()) / 60_000) : 0;
          const live = ch.enabled && !resting;
          return (
            <button
              key={id}
              aria-label={
                !ch.enabled
                  ? `${label} — off (see Settings)`
                  : resting
                  ? `${label} resting, ${restMin} minutes left. Tap to wake.`
                  : `${label} — active. Tap to preview, long-press to rest for an hour.`
              }
              onPointerDown={() => {
                longFired.current = false;
                pressTimer.current = window.setTimeout(() => {
                  longFired.current = true;
                  if (live) restHour(id);
                }, 550);
              }}
              onPointerUp={() => {
                if (pressTimer.current) window.clearTimeout(pressTimer.current);
                if (longFired.current) return;
                if (resting) wake(id);
                else preview(id);
              }}
              onPointerLeave={() => {
                if (pressTimer.current) window.clearTimeout(pressTimer.current);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  resting ? wake(id) : preview(id);
                }
              }}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                padding: "14px 6px 12px",
                borderRadius: 16,
                border: "1px solid var(--cw-line)",
                background: live ? "rgba(255,255,255,0.7)" : "transparent",
                color: live ? "var(--cw-ink)" : "var(--cw-ink3)",
                cursor: "pointer",
                fontFamily: "inherit",
                position: "relative",
                minHeight: 76,
              }}
            >
              {/* live state dot in --glow, with a text equivalent above */}
              <span
                aria-hidden="true"
                style={{
                  position: "absolute",
                  top: 9,
                  right: 10,
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: live ? "var(--cw-glow-c)" : "var(--cw-line)",
                  boxShadow: live ? "0 0 6px var(--cw-glow-c)" : "none",
                }}
              />
              <G size={22} strokeWidth={1.6} />
              <span className="cw-cap" style={{ color: "inherit" }}>
                {resting ? `resting · ${restMin} m` : !ch.enabled ? "off" : label}
              </span>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function AnchorCard() {
  const { st, set } = useCW();
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [time, setTime] = useState("");
  const sig = st.signature ?? DEMO_SIGNATURE;

  const now = solar.now();
  const nowMin = minutesOf(now);
  const upcoming = [...st.anchors].filter((a) => a.timeMin > nowMin).sort((a, b) => a.timeMin - b.timeMin);
  const next = upcoming[0];

  const addAnchor = () => {
    if (!name.trim() || !time) return;
    const [h, m] = time.split(":").map(Number);
    set((prev) => ({ anchors: [...prev.anchors, { id: uid(), name: name.trim(), timeMin: h * 60 + m }] }));
    setName("");
    setTime("");
    setAdding(false);
  };

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: next || adding ? 10 : 0 }}>
        <span className="cw-cap">Next anchor</span>
        <button
          aria-label={adding ? "Close" : "Add an anchor"}
          onClick={() => setAdding((a) => !a)}
          style={{
            width: 34,
            height: 34,
            borderRadius: 12,
            border: "1px solid var(--cw-line)",
            background: "transparent",
            color: "var(--cw-dusk)",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            transform: adding ? "rotate(45deg)" : "none",
            transition: "transform 220ms ease-out",
          }}
        >
          <GlyphPlus size={16} strokeWidth={1.8} />
        </button>
      </div>

      {adding && (
        <div className="cw-rise" style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: next ? 12 : 0 }}>
          <input
            className="cw-input"
            placeholder="What matters"
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <input
              className="cw-input cw-num"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              aria-label="Anchor time"
              style={{ flex: 1 }}
            />
            <Button onClick={addAnchor} disabled={!name.trim() || !time} style={{ opacity: !name.trim() || !time ? 0.5 : 1 }}>
              Add
            </Button>
          </div>
        </div>
      )}

      {next ? (
        <div>
          <div className="cw-h3" style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
            <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{next.name}</span>
            <span className="cw-num" style={{ fontWeight: 500, fontSize: 18, color: "var(--cw-ink2)" }}>
              {fmtClock(next.timeMin)} {fmtAmPm(next.timeMin)}
            </span>
          </div>
          {/* felt distance FIRST — that is the product */}
          <p className="cw-body cw-num" style={{ marginTop: 6, marginBottom: 0 }}>
            feels like <strong style={{ color: "var(--cw-dusk)" }}>{fmtDur(feltMinutes(next.timeMin - nowMin, sig, nowMin, st.med))} away</strong>
            <span className="cw-sec cw-num"> · actually {fmtDur(next.timeMin - nowMin)}</span>
          </p>
        </div>
      ) : (
        !adding && (
          <p className="cw-sec" style={{ margin: 0 }}>
            No anchors today. Add one thing you don't want to slip past.
          </p>
        )
      )}
    </Card>
  );
}

export function Today({ onGoFocus }: { onGoFocus: () => void }) {
  const { st } = useCW();
  const sig = st.signature ?? DEMO_SIGNATURE;
  const [nowMin, setNowMin] = useState(() => minutesOf(solar.now()));

  useEffect(() => {
    const un = solar.subscribe(() => setNowMin(minutesOf(solar.now())));
    return un;
  }, []);

  /* drift chip: today's weave — pattern family + the next quarter mark */
  const nextQuarter = Math.ceil((nowMin + 0.02) / 15) * 15;
  const family = (Math.floor(nowMin / 60) % 6) + 1;

  return (
    <div className="cw-rise" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ padding: "14px 0 4px" }}>
        <Horizon sig={sig} cfg={st.solarCfg} med={st.med} />
      </div>

      <AnchorCard />
      <ChannelTray />

      <div className="cw-chip cw-num" style={{ cursor: "default", alignSelf: "stretch", justifyContent: "center" }} role="status">
        Quarter marks: pattern family {family} · next weave at {fmtClock(nextQuarter)} {fmtAmPm(nextQuarter)}
      </div>

      {st.focus && (
        <Button block variant="ghost" onClick={onGoFocus}>
          A session is weaving — return to it
        </Button>
      )}
    </div>
  );
}
