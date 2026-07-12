/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · the weaver (brief §9)
   The always-on loop that fires quarter-hour moments across the channels,
   applies the adaptive rules, and keeps audio warmth synced to the sun.

   Adaptive rules implemented here:
   · loud environment active  → sound rests, haptics +1 intensity
   · quiet hours              → haptics and sound rest; light continues
   · medication window        → all intensities −1 during the window,
                                +1 for the hour after it ends (assumption
                                documented in solar.ts alongside feltTime)
   Timing: ticks reconcile against the engine clock (which respects the
   demo-time override, so a reviewer's 24h sweep plays real motifs). On
   visibilitychange, missed quarters collapse into ONE catch-up weave —
   never a burst (§9).
   ────────────────────────────────────────────────────────────────────────── */
import { useEffect, useRef } from "react";
import { useCW } from "./store";
import { solar } from "./solar";
import { audio, haptic, quarterPattern } from "./sensory";
import { minutesOf } from "./ui";

function inWindow(min: number, start: number, end: number): boolean {
  // supports ranges that cross midnight
  return start <= end ? min >= start && min < end : min >= start || min < end;
}

export function useWeaver() {
  const { st, set } = useCW();
  const stRef = useRef(st);
  stRef.current = st;
  const lastQuarterRef = useRef<number>(-1);
  const lastWeaveTs = useRef(0);

  /* audio ↔ solar warmth, continuously */
  useEffect(() => {
    const un = solar.subscribe((s) => audio.setWarmth(s.warmth));
    return un;
  }, []);

  /* audio mute follows the sound channel's state */
  useEffect(() => {
    const ch = st.channels.sound;
    const resting = ch.restUntil != null && ch.restUntil > Date.now();
    const loud = st.loudActive;
    const nowMin = minutesOf(solar.now());
    const quiet = st.quietHours.enabled && inWindow(nowMin, st.quietHours.startMin, st.quietHours.endMin);
    audio.setMuted(!ch.enabled || resting || loud || quiet);
  }, [st.channels.sound, st.loudActive, st.quietHours]);

  useEffect(() => {
    if (st.phase !== "app") return;

    const weave = (quarter: 1 | 2 | 3 | 4) => {
      const s = stRef.current;
      const nowMin = minutesOf(solar.now());

      const quiet = s.quietHours.enabled && inWindow(nowMin, s.quietHours.startMin, s.quietHours.endMin);

      /* medication window: −1 during, +1 in the hour after (assumption) */
      let medAdj = 0;
      if (s.med.enabled) {
        const end = s.med.startMin + s.med.durationMin;
        if (inWindow(nowMin, s.med.startMin, end)) medAdj = -1;
        else if (inWindow(nowMin, end, end + 60)) medAdj = 1;
      }

      const level = (base: 1 | 2 | 3, extra: number): 1 | 2 | 3 =>
        Math.max(1, Math.min(3, base + extra + medAdj)) as 1 | 2 | 3;

      const h = s.channels.haptic;
      const hapticResting = h.restUntil != null && h.restUntil > Date.now();
      if (h.enabled && !hapticResting && !quiet) {
        haptic(quarterPattern(quarter, level(h.intensity, s.loudActive ? 1 : 0)), level(h.intensity, s.loudActive ? 1 : 0));
      }

      const snd = s.channels.sound;
      const soundResting = snd.restUntil != null && snd.restUntil > Date.now();
      if (snd.enabled && !soundResting && !quiet && !s.loudActive && audio.armed) {
        audio.playQuarterMotif(quarter, level(snd.intensity, 0));
      }
    };

    const check = (catchUp: boolean) => {
      const nowMin = minutesOf(solar.now());
      const q = Math.floor(nowMin / 15); // absolute quarter index within the day
      if (lastQuarterRef.current === -1) {
        lastQuarterRef.current = q; // first tick: don't fire the past
        return;
      }
      if (q !== lastQuarterRef.current) {
        lastQuarterRef.current = q;
        /* one weave only, even if several quarters were missed (catch-up
           rule) — and never more than one weave per 4 s, so a demo-time
           sweep (24 min/s) plays occasional motifs, not a barrage */
        void catchUp;
        if (Date.now() - lastWeaveTs.current < 4000) return;
        lastWeaveTs.current = Date.now();
        const quarter = ((Math.floor(nowMin / 15) % 4) + 4) % 4; // 0..3 within the hour
        weave((quarter === 0 ? 4 : quarter) as 1 | 2 | 3 | 4);
      }
    };

    const iv = window.setInterval(() => check(false), 1000);
    const onVis = () => {
      if (document.visibilityState === "visible") check(true);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(iv);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [st.phase, set]);
}
