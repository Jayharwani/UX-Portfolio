/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · app shell
   Desktop (≥900px): a custom phone frame on a quiet solar-washed stage,
   bezel glowing with the engine. Mobile: the app, full-bleed.
   The frame chrome (outside the app UI) hosts the reviewer Demo-time
   control (§13).
   ────────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef, useState, type ReactNode } from "react";
import "./cw.css";
import { solar } from "./solar";
import { CWProvider, useCW } from "./store";
import { audio, HAPTIC_FALLBACK_EVENT, LIGHT_PULSE_EVENT } from "./sensory";
import { GlyphToday, GlyphFocus, GlyphInsights, GlyphSettings } from "./ui";
import { Onboarding } from "./screens/Onboarding";
import { Calibration } from "./screens/Calibration";
import { Today } from "./screens/Today";
import { Focus } from "./screens/Focus";
import { Insights } from "./screens/Insights";
import { Settings } from "./screens/Settings";
import { DemoTime } from "./DemoTime";
import { useWeaver } from "./weaver";

type Tab = "today" | "focus" | "insights" | "settings";

function FrameShell({ children, chrome }: { children: ReactNode; chrome?: ReactNode }) {
  const scopeRef = useRef<HTMLDivElement>(null);
  /* IMPORTANT: pulses retrigger via class toggling, never via React keys —
     a key change here would remount (and reset) the entire running app. */
  const [pulsing, setPulsing] = useState(false);
  const [rippling, setRippling] = useState(false);
  const [lighting, setLighting] = useState(false);
  const timers = useRef<{ p?: number; r?: number; l?: number }>({});

  useEffect(() => {
    if (scopeRef.current) solar.attach(scopeRef.current);
    return () => solar.detach();
  }, []);

  useEffect(() => {
    const retrigger = (setter: (v: boolean) => void, slot: "p" | "r" | "l", ms: number) => {
      setter(false);
      if (timers.current[slot]) window.clearTimeout(timers.current[slot]);
      // next frame so the class removal lands before re-adding (restarts CSS animation)
      requestAnimationFrame(() => {
        setter(true);
        timers.current[slot] = window.setTimeout(() => setter(false), ms);
      });
    };
    const onHaptic = () => {
      const desktop = window.matchMedia("(min-width: 900px)").matches;
      if (desktop) retrigger(setPulsing, "p", 760);
      else retrigger(setRippling, "r", 960);
    };
    const onLight = () => retrigger(setLighting, "l", 1160);
    window.addEventListener(HAPTIC_FALLBACK_EVENT, onHaptic);
    window.addEventListener(LIGHT_PULSE_EVENT, onLight);
    return () => {
      window.removeEventListener(HAPTIC_FALLBACK_EVENT, onHaptic);
      window.removeEventListener(LIGHT_PULSE_EVENT, onLight);
      Object.values(timers.current).forEach((t) => t && window.clearTimeout(t));
    };
  }, []);

  return (
    <div ref={scopeRef} className="cw-scope">
      <div className="cw-stage">
        <div className={`cw-frame${pulsing ? " cw-pulse" : ""}`}>
          <div className="cw-screen">
            {children}
            {/* mobile haptic fallback: soft ripple across the wash */}
            <div className={`cw-ripple${rippling ? " cw-on" : ""}`} />
            {/* light-channel preview: one warm pulse */}
            <div
              className="cw-ripple"
              style={
                lighting
                  ? {
                      animation: "cw-ripple 1100ms ease-out",
                      background:
                        "radial-gradient(130% 100% at 50% 100%, rgba(232,184,127,0.35), transparent 62%)",
                    }
                  : undefined
              }
            />
          </div>
        </div>
        {chrome && <div className="cw-chrome">{chrome}</div>}
      </div>
    </div>
  );
}

function TabBar({ tab, onTab }: { tab: Tab; onTab: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; G: typeof GlyphToday }[] = [
    { id: "today", label: "Today", G: GlyphToday },
    { id: "focus", label: "Focus", G: GlyphFocus },
    { id: "insights", label: "Insights", G: GlyphInsights },
    { id: "settings", label: "Settings", G: GlyphSettings },
  ];
  return (
    <nav className="cw-tabs" aria-label="ChronoWeave">
      {tabs.map(({ id, label, G }) => (
        <button key={id} className="cw-tab" aria-current={tab === id} onClick={() => onTab(id)}>
          <G size={23} strokeWidth={tab === id ? 1.9 : 1.5} />
          {label}
        </button>
      ))}
    </nav>
  );
}

function AppInner() {
  const { st, set } = useCW();
  const [tab, setTab] = useState<Tab>("today");

  /* the weaver: quarter-mark scheduling, adaptive rules, warmth sync */
  useWeaver();

  /* returning users: audio re-arms on the first tap anywhere (§11) */
  const needsWake = st.phase === "app" && st.channels.sound.enabled && !st.audioArmed;
  useEffect(() => {
    if (!needsWake) return;
    const onTap = () => {
      if (audio.arm()) set({ audioArmed: true });
    };
    window.addEventListener("pointerdown", onTap, { once: true });
    return () => window.removeEventListener("pointerdown", onTap);
  }, [needsWake, set]);

  let screen: ReactNode;
  if (st.phase === "onboarding") screen = <Onboarding />;
  else if (st.phase === "calibration") screen = <Calibration />;
  else {
    screen = (
      <div className="cw-app">
        {needsWake && (
          <div style={{ padding: "10px 20px 0" }}>
            <div className="cw-chip" role="status" style={{ width: "100%", justifyContent: "center", cursor: "default" }}>
              Tap anywhere to wake the sound
            </div>
          </div>
        )}
        <div className="cw-main">
          {tab === "today" && <Today onGoFocus={() => setTab("focus")} />}
          {tab === "focus" && <Focus />}
          {tab === "insights" && <Insights />}
          {tab === "settings" && <Settings />}
        </div>
        <TabBar tab={tab} onTab={setTab} />
      </div>
    );
  }

  return <FrameShell chrome={<DemoTime />}>{screen}</FrameShell>;
}

export default function ChronoWeaveLive() {
  return (
    <CWProvider>
      <AppInner />
    </CWProvider>
  );
}
