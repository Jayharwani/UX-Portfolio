/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · onboarding (brief §8.1)
   Three screens: thesis → how it works → permissions & honesty.
   The app demonstrates itself before explaining itself: screen 1 carries a
   miniature LIVE Horizon already drifting with the real solar wash, and
   screen 2's three rows really pulse, really play, really warm.
   ────────────────────────────────────────────────────────────────────────── */
import { useState } from "react";
import { useCW } from "../store";
import { Horizon, DEMO_SIGNATURE } from "../Horizon";
import { Button, Card, GlyphHaptic, GlyphSound, GlyphLight } from "../ui";
import { audio, haptic, lightPulse, canVibrate, quarterPattern } from "../sensory";

function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div className="cw-app">
      <div className="cw-main cw-rise" style={{ display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  );
}

/* one "how it works" row with a real inline demo */
function DemoRow({
  glyph,
  title,
  line,
  onDemo,
  demoHint,
}: {
  glyph: React.ReactNode;
  title: string;
  line: string;
  onDemo: () => void;
  demoHint: string;
}) {
  const [live, setLive] = useState(false);
  return (
    <button
      onClick={() => {
        setLive(true);
        onDemo();
        window.setTimeout(() => setLive(false), 900);
      }}
      aria-label={`${title} — ${demoHint}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        textAlign: "left",
        background: "rgba(255,255,255,0.6)",
        border: "1px solid var(--cw-line)",
        borderRadius: 20,
        padding: "16px 16px",
        cursor: "pointer",
        fontFamily: "inherit",
        color: "var(--cw-ink)",
      }}
    >
      <span
        style={{
          width: 46,
          height: 46,
          borderRadius: 15,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: live ? "var(--cw-dusk-soft)" : "transparent",
          border: "1px solid var(--cw-line)",
          color: live ? "var(--cw-dusk)" : "var(--cw-ink2)",
          transition: "background 220ms ease-out, color 220ms ease-out",
          transform: live ? "scale(1.06)" : "scale(1)",
          flexShrink: 0,
        }}
      >
        {glyph}
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="cw-body" style={{ display: "block", fontWeight: 600, fontSize: 16 }}>
          {title}
        </span>
        <span className="cw-sec" style={{ display: "block", marginTop: 1 }}>
          {line}
        </span>
      </span>
      <span className="cw-cap" style={{ color: "var(--cw-dusk)", flexShrink: 0 }}>
        try
      </span>
    </button>
  );
}

export function Onboarding() {
  const { st, set } = useCW();
  const step = st.onboardingStep;
  const go = (n: number) => set({ onboardingStep: n });

  /* ── 1 · thesis ── */
  if (step === 0) {
    return (
      <Screen>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
          <div style={{ padding: "0 4px" }}>
            <h1 className="cw-display" style={{ margin: 0 }}>
              A clock you feel,
              <br />
              not read.
            </h1>
            <p className="cw-body" style={{ color: "var(--cw-ink2)", marginTop: 12 }}>
              For brains that don't feel time passing.
            </p>
          </div>
          {/* the app demonstrating itself: a live mini Horizon, already drifting */}
          <div style={{ margin: "26px 0 8px" }}>
            <Horizon sig={st.signature ?? DEMO_SIGNATURE} cfg={st.solarCfg} mini />
            <p className="cw-cap cw-num" style={{ textAlign: "center", marginTop: 10 }}>
              solid — actual now · hollow — how far a clock can drift
            </p>
          </div>
        </div>
        <Button block onClick={() => go(1)}>
          How it works
        </Button>
      </Screen>
    );
  }

  /* ── 2 · how it works, with real demos ── */
  if (step === 1) {
    return (
      <Screen>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
          <h2 className="cw-title" style={{ margin: "0 0 10px", padding: "0 4px" }}>
            Three quiet channels
          </h2>
          <DemoRow
            glyph={<GlyphHaptic size={24} />}
            title="Touch"
            line="Soft pulses mark the quarter hours."
            demoHint="tap to feel a pulse"
            onDemo={() => haptic(quarterPattern(2, 2))}
          />
          <DemoRow
            glyph={<GlyphSound size={24} />}
            title="Sound"
            line="A low ambient tone drifts with the day."
            demoHint="tap to hear a motif"
            onDemo={() => {
              audio.arm();
              audio.playPreview(2);
            }}
          />
          <DemoRow
            glyph={<GlyphLight size={24} />}
            title="Light"
            line="The screen follows the sun's curve."
            demoHint="tap to warm the screen"
            onDemo={() => lightPulse()}
          />
          <p className="cw-sec" style={{ padding: "6px 4px 0" }}>
            Patterns rotate so your brain never tunes them out. Nothing interrupts. It weaves.
          </p>
        </div>
        <Button block onClick={() => go(2)}>
          Set up my clock
        </Button>
      </Screen>
    );
  }

  /* ── 3 · permissions & honesty ── */
  return (
    <Screen>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <h2 className="cw-title" style={{ margin: "0 0 4px", padding: "0 4px" }}>
          What this needs, plainly
        </h2>
        <Card>
          <div className="cw-row">
            <GlyphSound size={20} color="var(--cw-ink2)" />
            <div style={{ flex: 1 }}>
              <div className="cw-body" style={{ fontSize: 16, fontWeight: 600 }}>Sound</div>
              <div className="cw-sec">Needs one tap to start — browsers require it. The next button counts.</div>
            </div>
          </div>
          <div className="cw-row">
            <GlyphHaptic size={20} color="var(--cw-ink2)" />
            <div style={{ flex: 1 }}>
              <div className="cw-body" style={{ fontSize: 16, fontWeight: 600 }}>Vibration</div>
              <div className="cw-sec">
                {canVibrate
                  ? "Works on this device."
                  : "This device can't vibrate in the browser — you'll see a soft light pulse at the same moments instead."}
              </div>
            </div>
          </div>
          <div className="cw-row">
            <GlyphLight size={20} color="var(--cw-ink2)" />
            <div style={{ flex: 1 }}>
              <div className="cw-body" style={{ fontSize: 16, fontWeight: 600 }}>Notifications</div>
              <div className="cw-sec">Not requested. ChronoWeave doesn't interrupt.</div>
            </div>
          </div>
        </Card>
        <p className="cw-sec" style={{ padding: "2px 4px 0" }}>
          Everything stays on this device.
        </p>
      </div>
      <Button
        block
        onClick={() => {
          audio.arm(); // this tap is the Web Audio gesture
          set({ audioArmed: true, phase: "calibration" });
        }}
      >
        Start calibration
      </Button>
    </Screen>
  );
}
