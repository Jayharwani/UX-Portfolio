/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · Focus (brief §8.4) — the hyperfocus-aware session.
   Setup → the emptiest screen in the app → a sensory ramp that escalates
   BEFORE any visual interruption → a soft surface → a no-shame recap.

   Timing is timestamp-derived on every tick and on visibilitychange, so a
   session left in a hidden tab for an hour comes back correct (§4). Missed
   ramp stages collapse to the latest one — never a burst.
   ────────────────────────────────────────────────────────────────────────── */
import { useCallback, useEffect, useRef, useState } from "react";
import { useCW, type FocusSession, type SessionRecord } from "../store";
import { solar } from "../solar";
import { DEMO_SIGNATURE } from "../Horizon";
import { Button, Card, fmtClock, fmtAmPm, minutesOf } from "../ui";
import { audio, haptic, lightPulse, quarterPattern } from "../sensory";

/* ── setup ── */
function Setup({ onBegin }: { onBegin: (s: FocusSession) => void }) {
  const [intent, setIntent] = useState("");
  const [mins, setMins] = useState(45);
  const [ramp, setRamp] = useState<"gentle" | "firm">("gentle");

  const surfaceMin = minutesOf(solar.now()) + mins;

  return (
    <div className="cw-rise" style={{ display: "flex", flexDirection: "column", gap: 14, paddingTop: 10 }}>
      <div>
        <h2 className="cw-title" style={{ margin: "0 0 4px" }}>
          Sink in
        </h2>
        <p className="cw-sec" style={{ margin: 0 }}>
          ChronoWeave keeps a thread back to the surface.
        </p>
      </div>

      <Card>
        <div className="cw-cap" style={{ marginBottom: 8 }}>What are you sinking into?</div>
        <input
          className="cw-input"
          placeholder="One line is plenty"
          value={intent}
          maxLength={60}
          onChange={(e) => setIntent(e.target.value)}
        />
      </Card>

      <Card>
        <div className="cw-cap" style={{ marginBottom: 8 }}>When do you want to surface?</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          {[25, 45, 90].map((m) => (
            <button key={m} className="cw-chip cw-num" aria-pressed={mins === m} onClick={() => setMins(m)} style={{ flex: 1, justifyContent: "center" }}>
              {m} min
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <input
            className="cw-range"
            type="range"
            min={10}
            max={180}
            step={5}
            value={mins}
            onChange={(e) => setMins(Number(e.target.value))}
            aria-label="Session length in minutes"
            style={{ flex: 1 }}
          />
          <span className="cw-sec cw-num" style={{ width: 118, textAlign: "right" }}>
            {mins} min · {fmtClock(surfaceMin)} {fmtAmPm(surfaceMin)}
          </span>
        </div>
      </Card>

      <Card>
        <div className="cw-cap" style={{ marginBottom: 8 }}>Ramp</div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="cw-chip" aria-pressed={ramp === "gentle"} onClick={() => setRamp("gentle")} style={{ flex: 1, justifyContent: "center" }}>
            Gentle
          </button>
          <button className="cw-chip" aria-pressed={ramp === "firm"} onClick={() => setRamp("firm")} style={{ flex: 1, justifyContent: "center" }}>
            Firm
          </button>
        </div>
        {ramp === "firm" && (
          <p className="cw-sec cw-rise" style={{ margin: "10px 0 0" }}>
            Still no sirens. Just less subtle.
          </p>
        )}
      </Card>

      <Button
        block
        onClick={() =>
          onBegin({
            intent: intent.trim() || "Deep work",
            startedAt: Date.now(),
            plannedMin: mins,
            ramp,
            extensions: 0,
          })
        }
      >
        Begin
      </Button>
    </div>
  );
}

/* ── active session + ramp + surface ── */
type RampStage = 0 | 1 | 2 | 3; // none · T-15 · T-5 · T-0 surfaced

function Active({ session, onSurface, onExtend }: { session: FocusSession; onSurface: () => void; onExtend: () => void }) {
  const { st } = useCW();
  const sig = st.signature ?? DEMO_SIGNATURE;
  const [nowTs, setNowTs] = useState(Date.now());
  const [showFelt, setShowFelt] = useState(true);
  const stageRef = useRef<RampStage>(0);
  const [stage, setStage] = useState<RampStage>(0);
  const lastMinutePulse = useRef(-1);
  const wakeLock = useRef<any>(null);

  const plannedEnd = session.startedAt + (session.plannedMin + session.extensions * 5) * 60_000;
  const remainMs = plannedEnd - nowTs;
  const elapsedMin = (nowTs - session.startedAt) / 60_000;
  const firm = session.ramp === "firm";

  /* Wake Lock during active sessions where supported; silent elsewhere (§4) */
  useEffect(() => {
    let released = false;
    const acquire = async () => {
      try {
        wakeLock.current = await (navigator as any).wakeLock?.request?.("screen");
      } catch {
        /* fail silently */
      }
    };
    acquire();
    const onVis = () => {
      if (document.visibilityState === "visible" && !released) acquire();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      released = true;
      document.removeEventListener("visibilitychange", onVis);
      audio.holdWarm(false); // release the T-5 warmth pin with the session
      try {
        wakeLock.current?.release?.();
      } catch {
        /* ignore */
      }
    };
  }, []);

  /* the ramp — stages derive from absolute time so hidden tabs reconcile;
     if several stages passed while hidden, only the LATEST fires (§9) */
  const tick = useCallback(() => {
    const now = Date.now();
    setNowTs(now);
    const remain = plannedEnd - now;

    let target: RampStage = 0;
    if (remain <= 0) target = 3;
    else if (remain <= 5 * 60_000) target = 2;
    else if (remain <= 15 * 60_000) target = 1;

    if (target > stageRef.current) {
      stageRef.current = target;
      setStage(target);
      if (target === 1) {
        /* T-15: the haptic pattern family changes; the motif adds a note */
        haptic(quarterPattern(4, firm ? 3 : 2), firm ? 3 : 2);
        audio.playQuarterMotif(4, firm ? 3 : 2);
      } else if (target === 2) {
        /* T-5: audio warms noticeably (held until surface); wash pulses per minute */
        audio.holdWarm(true);
        lightPulse();
      } else if (target === 3) {
        haptic(firm ? [180, 90, 60, 90, 60] : [120, 100, 40], firm ? 3 : 2);
        audio.playQuarterMotif(1, firm ? 3 : 2);
        lightPulse();
      }
    }
    /* during T-5: one wash pulse per minute */
    if (stageRef.current === 2 && remain > 0) {
      const minuteIdx = Math.floor(remain / 60_000);
      if (minuteIdx !== lastMinutePulse.current) {
        lastMinutePulse.current = minuteIdx;
        lightPulse();
      }
    }
  }, [plannedEnd, firm]);

  useEffect(() => {
    // extensions move plannedEnd back: allow the ramp to step back down
    const remain = plannedEnd - Date.now();
    let target: RampStage = 0;
    if (remain <= 0) target = 3;
    else if (remain <= 5 * 60_000) target = 2;
    else if (remain <= 15 * 60_000) target = 1;
    stageRef.current = target;
    setStage(target);
    if (target < 2) audio.holdWarm(false); // ramp stepped back: unpin warmth
  }, [plannedEnd]);

  useEffect(() => {
    const iv = window.setInterval(tick, 1000);
    const onVis = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVis);
    tick();
    return () => {
      window.clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [tick]);

  /* ── surfaced (T-0): the only full-screen moment, and even this is soft ── */
  if (stage === 3) {
    const nowMin = minutesOf(solar.now());
    const overMin = Math.max(0, -remainMs / 60_000);
    return (
      <div className="cw-rise" aria-live="polite" style={{ minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, textAlign: "center", padding: "20px 0" }}>
        <div
          className="cw-breathe"
          style={{ width: 74, height: 74, borderRadius: "50%", background: "var(--cw-dusk-soft)", margin: "0 auto" }}
        />
        <h2 className="cw-title cw-num" style={{ margin: 0 }}>
          It's {fmtClock(nowMin)} {fmtAmPm(nowMin)} — time to surface
        </h2>
        <p className="cw-sec cw-num" style={{ margin: 0 }}>
          {session.intent}
          {overMin >= 1 ? ` · weaving for ${Math.round(overMin)} extra min` : ""}
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
          <Button block onClick={onSurface}>
            Surface
          </Button>
          {session.extensions < 2 && (
            <Button block variant="ghost" onClick={onExtend}>
              {session.extensions === 1 ? "Last one — 5 more" : "5 more minutes"}
            </Button>
          )}
        </div>
      </div>
    );
  }

  /* ── the emptiest screen in the app ── */
  const feltElapsed = elapsedMin * sig.rate;
  const shown = showFelt ? feltElapsed : elapsedMin;

  return (
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", padding: "10px 0" }}>
      <div className="cw-cap" style={{ textAlign: "center" }}>{session.intent}</div>

      <button
        onClick={() => setShowFelt((f) => !f)}
        aria-label={`Elapsed ${showFelt ? "felt" : "actual"} time — tap to toggle`}
        style={{ flex: 1, background: "transparent", border: "none", cursor: "pointer", position: "relative", fontFamily: "inherit" }}
      >
        <span
          aria-hidden="true"
          className="cw-breathe"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 236,
            height: 236,
            marginLeft: -118,
            marginTop: -118,
            borderRadius: "50%",
            border: "1px solid color-mix(in srgb, var(--cw-dusk) 34%, transparent)",
          }}
        />
        <span style={{ position: "relative", display: "block" }}>
          <span className="cw-num" style={{ fontSize: 56, fontWeight: 300, letterSpacing: "-0.02em", color: "var(--cw-ink)", display: "block" }}>
            {Math.floor(shown)}
            <span style={{ fontSize: 20, fontWeight: 400, color: "var(--cw-ink2)" }}> min</span>
          </span>
          <span className="cw-cap" style={{ display: "block", marginTop: 6 }}>
            {showFelt ? "felt" : "actual"} · tap to flip
          </span>
        </span>
      </button>

      <div className="cw-sec cw-num" style={{ textAlign: "center", paddingBottom: 6 }} role="status">
        {stage >= 2 ? "surfacing soon — the weave is leaning in" : stage === 1 ? "the weave has shifted — surface is nearing" : `surfacing at ${fmtClock(minutesOf(new Date(plannedEnd)))} ${fmtAmPm(minutesOf(new Date(plannedEnd)))}`}
      </div>
    </div>
  );
}

/* ── recap — no streaks, no confetti, no grade ── */
function Recap({ record, onDone }: { record: SessionRecord; onDone: () => void }) {
  const { st } = useCW();
  const sig = st.signature ?? DEMO_SIGNATURE;
  const overPct = record.actualMin / record.plannedMin - 1;
  const sigPct = Math.abs(1 - sig.rate);
  const slow = sig.rate < 1;

  let line: string;
  if (Math.abs(overPct) < 0.06) {
    line = "You surfaced almost exactly on your intent.";
  } else if (overPct > 0) {
    const ranPct = Math.round(overPct * 100);
    const within = Math.abs(overPct - sigPct) <= 0.08 && slow;
    line = `Your clock ran about ${ranPct}% slow — ${within ? "right in your signature." : "a little beyond your usual signature."}`;
  } else {
    line = `You surfaced ${Math.round(-overPct * 100)}% early — the thread held.`;
  }

  return (
    <div className="cw-rise" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, minHeight: "100%", paddingTop: 10 }}>
      <Card style={{ padding: 22, textAlign: "center" }}>
        <div className="cw-cap" style={{ marginBottom: 10 }}>Surfaced</div>
        <div className="cw-num" style={{ fontSize: 44, fontWeight: 300, letterSpacing: "-0.02em" }}>
          {record.plannedMin}
          <span style={{ fontSize: 18, color: "var(--cw-ink2)" }}> planned</span>
          {"  ·  "}
          {record.actualMin}
          <span style={{ fontSize: 18, color: "var(--cw-ink2)" }}> actual</span>
        </div>
        <p className="cw-body cw-num" style={{ color: "var(--cw-ink2)", margin: "12px 0 0" }}>{line}</p>
      </Card>
      <Button block onClick={onDone}>
        Done
      </Button>
    </div>
  );
}

/* ── the tab ── */
export function Focus() {
  const { st, set } = useCW();
  const [recap, setRecap] = useState<SessionRecord | null>(null);

  const begin = (s: FocusSession) => set({ focus: s });

  const surface = () => {
    const f = st.focus;
    if (!f) return;
    const actualMin = Math.max(1, Math.round((Date.now() - f.startedAt) / 60_000));
    const rec: SessionRecord = { intent: f.intent, startedAt: f.startedAt, plannedMin: f.plannedMin, actualMin };
    set((prev) => {
      /* real data replaces the seeded sample, one session at a time */
      const samples = prev.sessions.filter((x) => x.sample);
      const real = prev.sessions.filter((x) => !x.sample);
      const sessions = [...(samples.length ? samples.slice(1) : []), ...real, rec];
      /* today's measured drift joins the trend (planned/actual − 1: negative = ran long = slow) */
      const today = new Date().toISOString().slice(0, 10);
      const drift = +(f.plannedMin / actualMin - 1).toFixed(3);
      const others = prev.driftDays.filter((x) => x.day !== today);
      return { focus: null, sessions, driftDays: [...others, { day: today, drift }] };
    });
    setRecap(rec);
  };

  const extend = () => {
    set((prev) => (prev.focus ? { focus: { ...prev.focus, extensions: prev.focus.extensions + 1 } } : {}));
  };

  if (recap) return <Recap record={recap} onDone={() => setRecap(null)} />;
  if (st.focus) return <Active session={st.focus} onSurface={surface} onExtend={extend} />;
  return <Setup onBegin={begin} />;
}
