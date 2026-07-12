/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · calibration suite (brief §8.2) — the hero interaction.
   Five tests, ~4 minutes, each on its own screen with shared progress dots.
   Every test records REAL data; the Time Signature derives from it.

   ── The math, honestly (documented per brief) ─────────────────────────────
   rate = felt minutes per actual minute. rate < 1 → inner clock runs slow.

   · The Minute (production ×2): user taps when 60 felt-seconds have passed,
     producing P real seconds. rateₘ = 60 / P.  (P > 60 ⇒ slow clock.)
   · Pulse (continuation): guided at 1000 ms, then 12 unguided taps.
     Mean inter-tap interval M ⇒ rateₚ = 1000 / M. The coefficient of
     variation (sd/M) is the steadiness measure.
   · Echo (reproduction of 8 s): first-order, reproduction CANCELS clock
     rate (you hold until it feels like the same felt amount), so Echo is
     weighted lightly for rate (8/H) and mainly informs consistency.
   · Combined: rate = 0.45·rateₘ + 0.35·rateₚ + 0.20·rateₑ, clamped 0.55–1.45.
   · Deep Water (retrospective under load): an absorbing 60–75 s task, then
     "how long was that?" Estimate E vs actual T ⇒ retroRate = E/T.
     loadFactor = |1 − retroRate| / max(0.04, |1 − rate|), clamped 1–3.5 —
     "under load, drift roughly doubles" when ≈ 2.
   · steadiness: CV < 0.12 ⇒ steady, else variable.
   ────────────────────────────────────────────────────────────────────────── */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCW, seedSample } from "../store";
import type { TimeSignature } from "../solar";
import { Button, Card, Dots } from "../ui";
import { audio, haptic } from "../sensory";

/* ── shared test scaffold ── */
function TestShell({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="cw-app">
      <div className="cw-main" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ paddingTop: 8, paddingBottom: 18 }}>
          <Dots total={5} current={step} />
          <div className="cw-cap" style={{ textAlign: "center", marginTop: 10 }}>
            {title}
          </div>
        </div>
        <div className="cw-rise" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

/* one-breath interstitial between tests */
function Breath({ next, onDone }: { next: string; onDone: () => void }) {
  useEffect(() => {
    const t = window.setTimeout(onDone, 1400);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <div className="cw-app">
      <div className="cw-main" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="cw-rise" style={{ textAlign: "center" }}>
          <div
            className="cw-breathe"
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "var(--cw-dusk-soft)",
              margin: "0 auto 16px",
            }}
          />
          <div className="cw-sec">{next}</div>
        </div>
      </div>
    </div>
  );
}

/* spacebar = tap (brief §12) */
function useSpaceTap(handler: () => void, active: boolean) {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler, active]);
}

/* ══════════════════ Test 1 · The Minute (production ×2) ═══════════════════ */
function TheMinute({ onDone }: { onDone: (produced: number[]) => void }) {
  const [phase, setPhase] = useState<"intro" | "run" | "between">("intro");
  const [trial, setTrial] = useState(0);
  const startRef = useRef(0);
  const results = useRef<number[]>([]);

  const begin = () => {
    startRef.current = Date.now();
    setPhase("run");
  };
  const stop = useCallback(() => {
    const secs = (Date.now() - startRef.current) / 1000;
    results.current.push(secs);
    if (trial === 0) {
      setTrial(1);
      setPhase("between");
    } else {
      onDone(results.current);
    }
  }, [trial, onDone]);

  useSpaceTap(phase === "run" ? stop : phase === "intro" || phase === "between" ? begin : () => {}, true);

  if (phase === "run") {
    return (
      <button
        onClick={stop}
        aria-label="Tap when you feel one minute has passed"
        style={{
          flex: 1,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          position: "relative",
          borderRadius: 24,
          fontFamily: "inherit",
        }}
      >
        {/* no clock. a barely-breathing gradient holds the screen. */}
        <span
          aria-hidden="true"
          className="cw-breathe"
          style={{
            position: "absolute",
            inset: "12% 8%",
            borderRadius: "50%",
            background: "radial-gradient(closest-side, var(--cw-dusk-soft), transparent 72%)",
          }}
        />
        <span className="cw-sec" style={{ position: "relative" }}>
          tap again when you feel one minute has passed
        </span>
      </button>
    );
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
      <h2 className="cw-title" style={{ margin: 0 }}>
        The Minute
      </h2>
      <p className="cw-body" style={{ color: "var(--cw-ink2)", margin: 0 }}>
        {phase === "between"
          ? "Once more. Same thing — no counting, just feel."
          : "No clock on this screen. Tap begin, then tap again when you feel one minute has passed."}
      </p>
      <p className="cw-cap" style={{ margin: 0 }}>
        {phase === "between" ? "Trial 2 of 2" : "Trial 1 of 2 · spacebar works too"}
      </p>
      <div style={{ marginTop: 14 }}>
        <Button block onClick={begin}>
          {phase === "between" ? "Begin trial 2" : "Begin"}
        </Button>
      </div>
    </div>
  );
}

/* ══════════════════ Test 2 · Echo (interval reproduction) ═════════════════ */
const ECHO_SECS = 8;
function Echo({ onDone }: { onDone: (held: number) => void }) {
  const [phase, setPhase] = useState<"intro" | "play" | "hold">("intro");
  const [holding, setHolding] = useState(false);
  const downRef = useRef(0);

  const play = () => {
    setPhase("play");
    audio.playSwell(ECHO_SECS);
    haptic([60]);
    window.setTimeout(() => haptic([60]), ECHO_SECS * 1000 - 80);
    window.setTimeout(() => setPhase("hold"), ECHO_SECS * 1000 + 350);
  };

  const down = () => {
    if (phase !== "hold" || holding) return;
    downRef.current = Date.now();
    setHolding(true);
  };
  const up = () => {
    if (!holding) return;
    setHolding(false);
    onDone((Date.now() - downRef.current) / 1000);
  };

  /* spacebar hold support */
  useEffect(() => {
    if (phase !== "hold") return;
    const kd = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat) {
        e.preventDefault();
        down();
      }
    };
    const ku = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        up();
      }
    };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => {
      window.removeEventListener("keydown", kd);
      window.removeEventListener("keyup", ku);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, holding]);

  if (phase === "intro") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <h2 className="cw-title" style={{ margin: 0 }}>
          Echo
        </h2>
        <p className="cw-body" style={{ color: "var(--cw-ink2)", margin: 0 }}>
          A pulse will bloom for a while — watch it, feel it. Then hold the screen to reproduce the same length from memory.
        </p>
        <div style={{ marginTop: 14 }}>
          <Button block onClick={play}>
            Play the pulse
          </Button>
        </div>
      </div>
    );
  }

  const active = phase === "play" || holding;
  return (
    <button
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={up}
      aria-label={phase === "play" ? "Feel the pulse" : "Hold to reproduce the pulse, release when it feels the same"}
      disabled={phase === "play"}
      style={{
        flex: 1,
        border: "none",
        background: "transparent",
        cursor: phase === "hold" ? "pointer" : "default",
        position: "relative",
        borderRadius: 24,
        fontFamily: "inherit",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: "16% 12%",
          borderRadius: "50%",
          background: "radial-gradient(closest-side, var(--cw-dusk-soft), transparent 70%)",
          opacity: active ? 1 : 0.25,
          transform: active ? "scale(1.05)" : "scale(0.92)",
          transition: "opacity 900ms ease-in-out, transform 900ms ease-in-out",
        }}
      />
      <span className="cw-sec" style={{ position: "relative" }}>
        {phase === "play" ? "feel this" : holding ? "release when it feels the same" : "now hold to reproduce it"}
      </span>
    </button>
  );
}

/* ══════════════════ Test 3 · Pulse (continuation tapping) ═════════════════ */
const GUIDED = 12;
const FREE = 12;
function Pulse({ onDone }: { onDone: (intervals: number[]) => void }) {
  const [phase, setPhase] = useState<"intro" | "guided" | "free">("intro");
  const [beat, setBeat] = useState(0);
  const [taps, setTaps] = useState(0);
  const tapTimes = useRef<number[]>([]);

  const start = () => {
    setPhase("guided");
    let n = 0;
    const iv = window.setInterval(() => {
      n++;
      setBeat(n);
      audio.playTick();
      haptic([16]);
      if (n >= GUIDED) {
        window.clearInterval(iv);
        window.setTimeout(() => setPhase("free"), 1000);
      }
    }, 1000);
  };

  const tap = useCallback(() => {
    if (phase !== "free") return;
    tapTimes.current.push(Date.now());
    setTaps(tapTimes.current.length);
    if (tapTimes.current.length >= FREE) {
      const iv: number[] = [];
      for (let i = 1; i < tapTimes.current.length; i++) iv.push(tapTimes.current[i] - tapTimes.current[i - 1]);
      onDone(iv);
    }
  }, [phase, onDone]);

  useSpaceTap(phase === "free" ? tap : () => {}, phase === "free");

  if (phase === "intro") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <h2 className="cw-title" style={{ margin: 0 }}>
          Pulse
        </h2>
        <p className="cw-body" style={{ color: "var(--cw-ink2)", margin: 0 }}>
          Twelve guided beats, one per second. When the guide goes quiet, keep the beat — twelve more taps on your own.
        </p>
        <div style={{ marginTop: 14 }}>
          <Button block onClick={start}>
            Start the beat
          </Button>
        </div>
      </div>
    );
  }

  const count = phase === "guided" ? beat : taps;
  const total = phase === "guided" ? GUIDED : FREE;

  return (
    <button
      onClick={tap}
      aria-label={phase === "guided" ? "Feel the guided beat" : "Keep the beat — tap"}
      disabled={phase === "guided"}
      style={{
        flex: 1,
        border: "none",
        background: "transparent",
        cursor: phase === "free" ? "pointer" : "default",
        position: "relative",
        fontFamily: "inherit",
        borderRadius: 24,
      }}
    >
      <span
        aria-hidden="true"
        key={count}
        style={{
          position: "absolute",
          left: "50%",
          top: "42%",
          width: 84,
          height: 84,
          marginLeft: -42,
          marginTop: -42,
          borderRadius: "50%",
          background: "var(--cw-dusk-soft)",
          animation: count > 0 ? "cw-beat 500ms ease-out" : undefined,
        }}
      />
      <style>{`@keyframes cw-beat { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(1.25); opacity: 0.35; } }`}</style>
      <span style={{ position: "relative", display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
        <span className="cw-sec">{phase === "guided" ? "feel the beat" : "keep it going"}</span>
        <span style={{ display: "flex", gap: 5 }} aria-hidden="true">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: i < count ? "var(--cw-dusk)" : "var(--cw-line)",
                transition: "background 200ms",
              }}
            />
          ))}
        </span>
      </span>
    </button>
  );
}

/* ══════════════════ Test 4 · Deep Water (retrospective, under load) ═══════ */
interface Shape {
  id: number;
  hue: number; // index into WELLS
  x: number; // percent
  y: number;
  vx: number;
  vy: number;
}
const WELLS = [
  { name: "dusk", color: "#4E46B4" },
  { name: "moss", color: "#5E7D5A" },
  { name: "clay", color: "#B0766B" },
];

function DeepWater({ onDone }: { onDone: (actualSecs: number, estimateSecs: number) => void }) {
  const [phase, setPhase] = useState<"intro" | "task" | "ask">("intro");
  const actual = useMemo(() => 60 + Math.random() * 15, []); // 60–75 s
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const idRef = useRef(0);
  const startRef = useRef(0);
  const dragRef = useRef<{ id: number; moved: boolean } | null>(null);
  const areaRef = useRef<HTMLDivElement>(null);

  const spawn = useCallback((): Shape => {
    idRef.current++;
    return {
      id: idRef.current,
      hue: Math.floor(Math.random() * WELLS.length),
      x: 12 + Math.random() * 76,
      y: 12 + Math.random() * 48,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.04,
    };
  }, []);

  const begin = () => {
    setShapes(Array.from({ length: 5 }, spawn));
    startRef.current = Date.now();
    setPhase("task");
    window.setTimeout(() => setPhase("ask"), actual * 1000);
  };

  /* slow drift — the task should feel liquid, slightly absorbing */
  useEffect(() => {
    if (phase !== "task") return;
    let raf = 0;
    const step = () => {
      setShapes((prev) =>
        prev.map((s) => {
          if (dragRef.current?.id === s.id) return s;
          let { x, y, vx, vy } = s;
          x += vx;
          y += vy;
          if (x < 8 || x > 92) vx = -vx;
          if (y < 8 || y > 62) vy = -vy;
          return { ...s, x, y, vx, vy };
        })
      );
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const sortInto = (shapeId: number, wellIdx: number) => {
    setShapes((prev) => {
      const s = prev.find((p) => p.id === shapeId);
      if (!s || s.hue !== wellIdx) return prev; // wrong well: nothing dramatic, it just doesn't take
      return prev.filter((p) => p.id !== shapeId).concat(spawn());
    });
    setSelected(null);
  };

  const onShapePointerDown = (e: React.PointerEvent, id: number) => {
    dragRef.current = { id, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onShapePointerMove = (e: React.PointerEvent, id: number) => {
    if (dragRef.current?.id !== id || !areaRef.current) return;
    dragRef.current.moved = true;
    const r = areaRef.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, x: Math.max(4, Math.min(96, x)), y: Math.max(4, Math.min(92, y)) } : s)));
  };
  const onShapePointerUp = (e: React.PointerEvent, id: number) => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag || drag.id !== id) return;
    if (!drag.moved) {
      setSelected((cur) => (cur === id ? null : id)); // plain tap: select for tap-to-sort (keyboard path)
      return;
    }
    /* dropped: inside a well? wells occupy the bottom band, thirds across */
    if (!areaRef.current) return;
    const r = areaRef.current.getBoundingClientRect();
    const relY = (e.clientY - r.top) / r.height;
    if (relY > 0.72) {
      const wellIdx = Math.min(2, Math.floor(((e.clientX - r.left) / r.width) * 3));
      sortInto(id, wellIdx);
    }
  };

  if (phase === "intro") {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <h2 className="cw-title" style={{ margin: 0 }}>
          Deep Water
        </h2>
        <p className="cw-body" style={{ color: "var(--cw-ink2)", margin: 0 }}>
          A small sorting task. Drift the shapes into their color wells — drag them, or tap a shape then its well. No score. It ends on its own.
        </p>
        <div style={{ marginTop: 14 }}>
          <Button block onClick={begin}>
            Sink in
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "ask") {
    return (
      <div className="cw-rise" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 12 }}>
        <h2 className="cw-title" style={{ margin: 0 }}>
          Surface for a moment
        </h2>
        <p className="cw-body" style={{ color: "var(--cw-ink2)", margin: 0 }}>
          Without counting back — how long was that?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
          {[
            { label: "30 seconds", secs: 30 },
            { label: "1 minute", secs: 60 },
            { label: "1 minute 30", secs: 90 },
            { label: "2 minutes", secs: 120 },
            { label: "3 minutes", secs: 180 },
          ].map((o) => (
            <button key={o.secs} className="cw-chip cw-num" style={{ justifyContent: "center" }} onClick={() => onDone(actual, o.secs)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={areaRef} style={{ flex: 1, position: "relative", borderRadius: 20, overflow: "hidden", touchAction: "none" }}>
      {shapes.map((s) => (
        <button
          key={s.id}
          aria-label={`${WELLS[s.hue].name} shape${selected === s.id ? ", selected — now choose its well" : ""}`}
          onPointerDown={(e) => onShapePointerDown(e, s.id)}
          onPointerMove={(e) => onShapePointerMove(e, s.id)}
          onPointerUp={(e) => onShapePointerUp(e, s.id)}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            transform: "translate(-50%, -50%)",
            width: 52,
            height: 52,
            borderRadius: "42% 58% 55% 45% / 52% 44% 56% 48%",
            border: selected === s.id ? "2px solid var(--cw-ink)" : "1px solid rgba(255,255,255,0.7)",
            background: `color-mix(in srgb, ${WELLS[s.hue].color} 55%, white)`,
            cursor: "grab",
            touchAction: "none",
          }}
        />
      ))}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, display: "flex", gap: 8, padding: "0 4px 4px" }}>
        {WELLS.map((w, i) => (
          <button
            key={w.name}
            aria-label={`${w.name} well${selected != null ? " — place selected shape here" : ""}`}
            onClick={() => selected != null && sortInto(selected, i)}
            style={{
              flex: 1,
              height: 74,
              borderRadius: "18px 18px 4px 4px",
              border: "1px dashed color-mix(in srgb, " + w.color + " 55%, transparent)",
              background: `color-mix(in srgb, ${w.color} 12%, transparent)`,
              cursor: "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════ Test 5 · Your Day (self-report mapping) ═══════════════ */
function YourDay({
  onDone,
}: {
  onDone: (slips: string[], med: { enabled: boolean; startMin: number; durationMin: number }, loud: string[]) => void;
}) {
  const [slips, setSlips] = useState<string[]>([]);
  const [medOn, setMedOn] = useState(false);
  const [medStart, setMedStart] = useState("08:00");
  const [medDur, setMedDur] = useState(8);
  const [loud, setLoud] = useState<string[]>([]);

  const toggle = (arr: string[], setArr: (v: string[]) => void, v: string, exclusive?: string) => {
    if (arr.includes(v)) setArr(arr.filter((x) => x !== v));
    else if (v === exclusive) setArr([v]);
    else setArr([...arr.filter((x) => x !== exclusive), v]);
  };

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16, justifyContent: "center" }}>
      <div>
        <h2 className="cw-title" style={{ margin: "0 0 4px" }}>
          Your day
        </h2>
        <p className="cw-sec" style={{ margin: 0 }}>
          Last one — just what you already know about yourself.
        </p>
      </div>

      <div>
        <div className="cw-cap" style={{ marginBottom: 8 }}>When does time slip most?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["morning", "afternoon", "evening", "late night"].map((p) => (
            <button key={p} className="cw-chip" aria-pressed={slips.includes(p)} onClick={() => toggle(slips, setSlips, p)}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <div className="cw-cap">Medication window · optional</div>
            <div className="cw-sec" style={{ fontSize: 13 }}>Just times. No names, no doses.</div>
          </div>
          <button className="cw-switch" role="switch" aria-checked={medOn} aria-label="Medication window" onClick={() => setMedOn(!medOn)} />
        </div>
        {medOn && (
          <div className="cw-rise" style={{ display: "flex", gap: 8 }}>
            <input className="cw-input cw-num" type="time" value={medStart} onChange={(e) => setMedStart(e.target.value)} aria-label="Window starts" style={{ flex: 1 }} />
            <select className="cw-input cw-num" value={medDur} onChange={(e) => setMedDur(Number(e.target.value))} aria-label="Window length" style={{ flex: 1 }}>
              {[4, 6, 8, 10, 12].map((h) => (
                <option key={h} value={h}>
                  {h} hours
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div>
        <div className="cw-cap" style={{ marginBottom: 8 }}>Loud places in a typical week?</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {["commute", "gym", "none"].map((p) => (
            <button key={p} className="cw-chip" aria-pressed={loud.includes(p)} onClick={() => toggle(loud, setLoud, p, "none")}>
              {p}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 6 }}>
        <Button
          block
          onClick={() => {
            const [h, m] = medStart.split(":").map(Number);
            onDone(slips, { enabled: medOn, startMin: h * 60 + m, durationMin: medDur * 60 }, loud.filter((l) => l !== "none"));
          }}
        >
          Weave my signature
        </Button>
      </div>
    </div>
  );
}

/* ══════════════════ the Time Signature result card ════════════════════════ */
function SignatureCard({ sig, onBegin }: { sig: TimeSignature; onBegin: () => void }) {
  const slow = sig.rate < 1;
  const magPct = Math.round(Math.abs(1 - sig.rate) * 100);
  const hourFeels = Math.round(60 * sig.rate);
  const loadTxt =
    sig.loadFactor >= 2.4
      ? `under load, drift roughly triples ×${sig.loadFactor.toFixed(1)}`
      : sig.loadFactor >= 1.6
      ? `under load, drift roughly doubles ×${sig.loadFactor.toFixed(1)}`
      : `under load, drift stays close to baseline ×${sig.loadFactor.toFixed(1)}`;

  return (
    <div className="cw-app">
      <div className="cw-main cw-rise" style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 16 }}>
        <div className="cw-cap" style={{ textAlign: "center" }}>Your Time Signature</div>

        <Card style={{ padding: 24, textAlign: "center" }}>
          {/* magnitude, the money numeral */}
          <div className="cw-num" style={{ fontSize: 64, fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1, color: "var(--cw-dusk)" }}>
            {magPct === 0 ? "±0" : `${slow ? "−" : "+"}${magPct}`}
            <span style={{ fontSize: 26, fontWeight: 400 }}>%</span>
          </div>
          <div className="cw-h3" style={{ marginTop: 10 }}>
            Your inner clock runs {magPct === 0 ? "true" : slow ? "slow" : "fast"}
          </div>
          {magPct > 0 && (
            <p className="cw-body cw-num" style={{ color: "var(--cw-ink2)", margin: "6px 0 0" }}>
              an hour feels like about {hourFeels} minutes
            </p>
          )}

          <div style={{ borderTop: "1px solid var(--cw-line)", margin: "18px 0 14px" }} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8, textAlign: "left" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
              <span className="cw-cap" style={{ width: 86, flexShrink: 0 }}>steadiness</span>
              <span className="cw-sec" style={{ color: "var(--cw-ink)" }}>
                {sig.steadiness === "steady" ? "steady — your drift holds a consistent shape" : "variable — your drift changes with the day"}
              </span>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
              <span className="cw-cap" style={{ width: 86, flexShrink: 0 }}>under load</span>
              <span className="cw-sec cw-num" style={{ color: "var(--cw-ink)" }}>{loadTxt}</span>
            </div>
            {sig.slipPeriods.length > 0 && (
              <div style={{ display: "flex", gap: 10, alignItems: "baseline" }}>
                <span className="cw-cap" style={{ width: 86, flexShrink: 0 }}>slips most</span>
                <span className="cw-sec" style={{ color: "var(--cw-ink)" }}>{sig.slipPeriods.join(", ")}</span>
              </div>
            )}
          </div>
        </Card>

        <p className="cw-sec" style={{ textAlign: "center", margin: 0 }}>
          ChronoWeave will weave around this.
        </p>
        <Button block onClick={onBegin}>
          Begin my day
        </Button>
      </div>
    </div>
  );
}

/* ══════════════════ the suite ═════════════════════════════════════════════ */
type Stage =
  | { t: "test"; i: number }
  | { t: "breath"; next: string; to: number }
  | { t: "result"; sig: TimeSignature };

const TITLES = ["The Minute", "Echo", "Pulse", "Deep Water", "Your day"];

export function Calibration() {
  const { set } = useCW();
  const [stage, setStage] = useState<Stage>({ t: "test", i: 0 });
  const data = useRef<{
    minute?: number[];
    echo?: number;
    pulse?: number[];
    water?: { actual: number; estimate: number };
  }>({});

  const advance = (from: number) => {
    if (from < 4) setStage({ t: "breath", next: `next — ${TITLES[from + 1]}`, to: from + 1 });
  };

  const finish = (slips: string[], med: { enabled: boolean; startMin: number; durationMin: number }, loud: string[]) => {
    /* ── derive the signature (formulas at the top of this file) ── */
    const d = data.current;
    const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

    const minuteRates = (d.minute ?? [60]).map((p) => 60 / clamp(p, 15, 240));
    const rateM = minuteRates.reduce((a, b) => a + b, 0) / minuteRates.length;

    const iv = d.pulse ?? [1000];
    const meanIv = iv.reduce((a, b) => a + b, 0) / iv.length;
    const rateP = 1000 / clamp(meanIv, 400, 2500);
    const sd = Math.sqrt(iv.reduce((a, b) => a + (b - meanIv) ** 2, 0) / iv.length);
    const cv = sd / meanIv;

    const rateE = 8 / clamp(d.echo ?? 8, 2, 30); // lightly weighted — reproduction largely cancels rate

    const rate = clamp(0.45 * rateM + 0.35 * rateP + 0.2 * rateE, 0.55, 1.45);

    const retroRate = d.water ? clamp(d.water.estimate / d.water.actual, 0.25, 3) : 1;
    const loadFactor = clamp(Math.abs(1 - retroRate) / Math.max(0.04, Math.abs(1 - rate)), 1, 3.5);

    const sig: TimeSignature = {
      rate: +rate.toFixed(3),
      variability: +cv.toFixed(3),
      loadFactor: +loadFactor.toFixed(2),
      steadiness: cv < 0.12 ? "steady" : "variable",
      slipPeriods: slips,
      createdAt: Date.now(),
    };
    set((prev) => ({
      signature: sig,
      signatureHistory: [...prev.signatureHistory, sig],
      med: { ...med },
      loudEnvironments: loud,
    }));
    setStage({ t: "result", sig });
  };

  if (stage.t === "breath") {
    return <Breath next={stage.next} onDone={() => setStage({ t: "test", i: stage.to })} />;
  }

  if (stage.t === "result") {
    return (
      <SignatureCard
        sig={stage.sig}
        onBegin={() => {
          audio.arm(); // "Begin my day" is the audio gesture (§8.2)
          set((prev) => {
            const seeded =
              prev.driftDays.length === 0 || prev.driftDays.every((x) => x.sample)
                ? seedSample(stage.sig)
                : { driftDays: prev.driftDays, sessions: prev.sessions };
            return { phase: "app", audioArmed: true, ...seeded };
          });
        }}
      />
    );
  }

  const i = stage.i;
  return (
    <TestShell step={i} title={TITLES[i]}>
      {i === 0 && (
        <TheMinute
          onDone={(produced) => {
            data.current.minute = produced;
            advance(0);
          }}
        />
      )}
      {i === 1 && (
        <Echo
          onDone={(held) => {
            data.current.echo = held;
            advance(1);
          }}
        />
      )}
      {i === 2 && (
        <Pulse
          onDone={(intervals) => {
            data.current.pulse = intervals;
            advance(2);
          }}
        />
      )}
      {i === 3 && (
        <DeepWater
          onDone={(actual, estimate) => {
            data.current.water = { actual, estimate };
            advance(3);
          }}
        />
      )}
      {i === 4 && <YourDay onDone={finish} />}
    </TestShell>
  );
}
