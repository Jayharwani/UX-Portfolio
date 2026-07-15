import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Desk objects: the mobile hero signature (paridhi.space energy, Jay's
   world). Four hand-drawn objects from a designer-who-ships' desk, scattered
   under the hero copy with handwritten captions. Every one has a tap story:

     phone      a live mini ChronoWeave — tap sweeps the sun through a day
     coffee     steaming — each tap sips it down; empty cup asks for refill
     metrocard  swipe it through the reader; it tells you the fare
     sticky     "ship it!!" — peel it to find "shipped ✓" underneath

   No physics, no 3D — personality. Desktop keeps the block playground.
   ────────────────────────────────────────────────────────────────────────── */

const CAVEAT = "'Caveat', cursive";
const MONO = "'Geist Mono', monospace";
const INK2 = "#97A3BD";

/* gentle settle-in for each object, staggered */
function Enter({ i, children, style }: { i: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="dsk-in" style={{ position: "absolute", animationDelay: `${0.75 + i * 0.14}s`, ...style }}>
      {children}
    </div>
  );
}

function Caption({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: CAVEAT,
        fontSize: 18,
        lineHeight: 1.1,
        color: INK2,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* a little hand-drawn arrow to point captions at their objects */
function Arrow({ flip, style }: { flip?: boolean; style?: React.CSSProperties }) {
  return (
    <svg width="26" height="18" viewBox="0 0 26 18" fill="none" aria-hidden="true" style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <path d="M2 2c6 1 14 3 19 11" stroke={INK2} strokeWidth="1.5" strokeLinecap="round" />
      <path d="m16.5 12.5 4.7 1 .5-4.6" stroke={INK2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* soft ground shadow so objects sit on the page instead of floating */
function Ground({ w }: { w: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "50%",
        bottom: -10,
        width: w,
        height: 14,
        transform: "translateX(-50%)",
        background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.45), transparent 70%)",
        filter: "blur(3px)",
      }}
    />
  );
}

/* ── 1 · the phone: a live mini ChronoWeave ─────────────────────────────── */
function PhoneChrono() {
  const [sweeping, setSweeping] = useState(false);
  const timer = useRef(0);
  const sweep = () => {
    if (sweeping) return;
    setSweeping(true);
    timer.current = window.setTimeout(() => setSweeping(false), 4300);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      onClick={sweep}
      aria-label="ChronoWeave mini demo — tap to sweep the sun through a day"
      style={{
        display: "block",
        width: 86,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        transform: "rotate(-7deg)",
        position: "relative",
      }}
    >
      <div
        style={{
          borderRadius: 16,
          padding: 5,
          background: "linear-gradient(155deg, #232B3E, #10151F)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 14px 30px -12px rgba(0,0,0,0.65), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* the screen: a pale ChronoWeave sky with a sun on its day arc */}
        <div
          className={sweeping ? "dsk-sky dsk-sky-on" : "dsk-sky"}
          style={{
            position: "relative",
            width: "100%",
            height: 130,
            borderRadius: 11,
            overflow: "hidden",
          }}
        >
          {/* sun on a rotating arm = a real arc across the screen */}
          <div
            className={sweeping ? "dsk-arm dsk-arm-on" : "dsk-arm"}
            style={{
              position: "absolute",
              left: "50%",
              bottom: 34,
              width: 2,
              height: 74,
              transformOrigin: "bottom center",
            }}
          >
            <div
              className="dsk-sun"
              style={{
                position: "absolute",
                top: -5,
                left: -5,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: "#F6C243",
                boxShadow: "0 0 12px 3px rgba(246,194,67,0.55)",
              }}
            />
          </div>
          {/* horizon */}
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, height: 1, background: "rgba(20,18,28,0.35)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 34, background: "rgba(20,18,28,0.16)" }} />
          {/* felt-time numeral, the product's soul in 8px */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 8,
              textAlign: "center",
              fontFamily: MONO,
              fontSize: 8,
              letterSpacing: "0.04em",
              color: "#3A3650",
            }}
          >
            feels like 3:12
          </div>
        </div>
      </div>
      <Ground w={70} />
    </button>
  );
}

/* ── 2 · coffee, sipped down three taps then refilled ───────────────────── */
const LEVELS = [30, 38, 46, 54]; // y of coffee surface per remaining sips (3..0)
function Coffee() {
  const [sips, setSips] = useState(0); // 0 = full, 3 = empty
  const [tilt, setTilt] = useState(false);
  const timer = useRef(0);
  const tap = () => {
    if (sips >= 3) {
      setSips(0); // refill
      return;
    }
    setTilt(true);
    setSips((s) => s + 1);
    timer.current = window.setTimeout(() => setTilt(false), 550);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const y = LEVELS[sips];

  return (
    <button
      onClick={tap}
      aria-label={sips >= 3 ? "Empty coffee cup — tap to refill" : "Coffee cup — tap to sip"}
      style={{
        display: "block",
        width: 74,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        position: "relative",
        transform: "rotate(3deg)",
      }}
    >
      <svg
        width="74"
        height="78"
        viewBox="0 0 74 78"
        fill="none"
        style={{ transform: tilt ? "rotate(-13deg)" : "rotate(0deg)", transition: "transform 260ms cubic-bezier(0.34,1.4,0.64,1)", transformOrigin: "50% 80%" }}
      >
        {/* steam, only while there's coffee */}
        {sips < 3 && (
          <g className="dsk-steam">
            <path d="M28 22c-3-4 3-6 0-10" stroke={INK2} strokeWidth="1.6" strokeLinecap="round" opacity="0.7" />
            <path d="M38 20c-3-4 3-6 0-10" stroke={INK2} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
            <path d="M47 22c-3-4 3-6 0-10" stroke={INK2} strokeWidth="1.6" strokeLinecap="round" opacity="0.65" />
          </g>
        )}
        {/* cup */}
        <path d="M16 28h42v30a12 12 0 0 1-12 12H28a12 12 0 0 1-12-12V28z" fill="#1A2234" stroke="rgba(255,255,255,0.16)" />
        {/* coffee level */}
        <rect x="19" y={y} width="36" height={67 - y} rx="8" fill="#8A5A3B" style={{ transition: "y 380ms ease-out, height 380ms ease-out" }} />
        <ellipse cx="37" cy={y} rx="18" ry="3.4" fill="#A9714C" style={{ transition: "cy 380ms ease-out" }} />
        {/* handle */}
        <path d="M58 34h4a8 8 0 0 1 0 16h-4" stroke="rgba(255,255,255,0.16)" strokeWidth="4" fill="none" />
        <path d="M58 34h4a8 8 0 0 1 0 16h-4" stroke="#1A2234" strokeWidth="2.4" fill="none" />
        {/* accent ring */}
        <path d="M16 28h42" stroke="#5B8CFF" strokeWidth="2" opacity="0.75" />
      </svg>
      <Ground w={56} />
    </button>
  );
}

/* ── 3 · the MetroCard, swiped through an invisible reader ──────────────── */
function MetroCard() {
  const [swiping, setSwiping] = useState(false);
  const timer = useRef(0);
  const tap = () => {
    if (swiping) return;
    setSwiping(true);
    timer.current = window.setTimeout(() => setSwiping(false), 1250);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button
      onClick={tap}
      aria-label="MetroCard — tap to swipe it"
      style={{
        display: "block",
        width: 96,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        position: "relative",
        transform: "rotate(7deg)",
      }}
    >
      <div className={swiping ? "dsk-swipe" : undefined} style={{ position: "relative" }}>
        <div
          style={{
            width: 96,
            height: 58,
            borderRadius: 7,
            background: "linear-gradient(160deg, #F2C14E, #DFA92F)",
            boxShadow: "0 12px 26px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.35)",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ position: "absolute", left: 8, top: 9, fontFamily: MONO, fontWeight: 600, fontSize: 9, letterSpacing: "0.02em", color: "#14213D" }}>
            MetroCard
          </div>
          {/* the classic notch arrow */}
          <div style={{ position: "absolute", right: 7, top: 7, width: 0, height: 0, borderTop: "7px solid transparent", borderBottom: "7px solid transparent", borderLeft: "9px solid #14213D", opacity: 0.85 }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 17, background: "#14213D" }} />
          <div style={{ position: "absolute", left: 8, bottom: 4, fontFamily: MONO, fontSize: 7, color: "#F2C14E", letterSpacing: "0.1em" }}>
            NYC · UNLIMITED
          </div>
        </div>
      </div>
      {/* fare flash on swipe */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: -20,
          transform: "translateX(-50%)",
          fontFamily: CAVEAT,
          fontSize: 17,
          color: "#7CE0A3",
          opacity: swiping ? 1 : 0,
          transition: "opacity 240ms ease-out",
          whiteSpace: "nowrap",
        }}
      >
        GO — $2.90
      </div>
      <Ground w={78} />
    </button>
  );
}

/* ── 4 · the sticky note: peel "ship it!!" to reveal "shipped ✓" ────────── */
function Sticky() {
  const [peeled, setPeeled] = useState(false);
  const timer = useRef(0);
  const tap = () => {
    if (peeled) return;
    setPeeled(true);
    timer.current = window.setTimeout(() => setPeeled(false), 2600);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const note: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: CAVEAT,
    fontSize: 19,
    lineHeight: 1,
  };

  return (
    <button
      onClick={tap}
      aria-label={peeled ? "Note says: shipped" : "Sticky note says: ship it. Tap to peel."}
      style={{
        display: "block",
        width: 72,
        height: 72,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: "pointer",
        position: "relative",
        transform: "rotate(-6deg)",
      }}
    >
      {/* the note underneath */}
      <div style={{ ...note, background: "#1E2A44", border: "1px solid rgba(91,140,255,0.35)", color: "#7CE0A3", boxShadow: "0 10px 24px -10px rgba(0,0,0,0.55)" }}>
        shipped ✓
      </div>
      {/* the note on top, peels away */}
      <div
        className={peeled ? "dsk-peel" : undefined}
        style={{
          ...note,
          background: "linear-gradient(165deg, #B7CCFF, #8FB0FF)",
          color: "#14213D",
          boxShadow: "0 8px 18px -8px rgba(0,0,0,0.5)",
          transformOrigin: "top left",
        }}
      >
        ship it!!
      </div>
      <Ground w={58} />
    </button>
  );
}

/* ── the desk ───────────────────────────────────────────────────────────── */
export default function DeskObjects() {
  return (
    <div aria-hidden={false} style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{`
        .dsk-in { opacity: 0; animation: dsk-in 640ms cubic-bezier(0.34, 1.35, 0.64, 1) both; }
        @keyframes dsk-in {
          0% { opacity: 0; transform: translateY(-14px) rotate(4deg) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        .dsk-in > * { pointer-events: auto; -webkit-tap-highlight-color: transparent; }

        /* phone sky: idle dusk → tap runs a whole day */
        .dsk-sky { background: linear-gradient(180deg, #EFEAF7, #FCFAF5); }
        .dsk-sky-on { animation: dsk-sky 4.2s ease-in-out both; }
        @keyframes dsk-sky {
          0% { background: linear-gradient(180deg, #E9EDF7, #FBF7F2); }
          30% { background: linear-gradient(180deg, #E8F0FA, #FFFFFF); }
          62% { background: linear-gradient(180deg, #F4E3D3, #FDFAF6); }
          82% { background: linear-gradient(180deg, #B9AEE8, #F6F2FB); }
          100% { background: linear-gradient(180deg, #8F8AC4, #E4E2F0); }
        }
        .dsk-arm { transform: rotate(-38deg); }
        .dsk-arm-on { animation: dsk-arm 4.2s ease-in-out both; }
        @keyframes dsk-arm {
          0% { transform: rotate(-72deg); }
          100% { transform: rotate(72deg); }
        }
        .dsk-sun { animation: dsk-sun 3.4s ease-in-out infinite; }
        @keyframes dsk-sun {
          0%, 100% { box-shadow: 0 0 10px 2px rgba(246,194,67,0.45); }
          50% { box-shadow: 0 0 16px 5px rgba(246,194,67,0.7); }
        }

        .dsk-steam path { stroke-dasharray: 14; animation: dsk-steam 2.2s linear infinite; }
        .dsk-steam path:nth-child(2) { animation-delay: -0.7s; }
        .dsk-steam path:nth-child(3) { animation-delay: -1.4s; }
        @keyframes dsk-steam { to { stroke-dashoffset: -28; } }

        .dsk-swipe { animation: dsk-swipe 1.15s cubic-bezier(0.45, 0, 0.2, 1) both; }
        @keyframes dsk-swipe {
          0% { transform: translateX(0) rotate(0); }
          28% { transform: translateX(-14px) rotate(-3deg); }
          62% { transform: translateX(58px) rotate(2deg); }
          100% { transform: translateX(0) rotate(0); }
        }

        .dsk-peel { animation: dsk-peel 680ms cubic-bezier(0.5, 0, 0.75, 0.4) both; }
        @keyframes dsk-peel {
          0% { transform: rotate(0) translate(0, 0); opacity: 1; }
          35% { transform: rotate(14deg) translate(8px, -12px); opacity: 1; }
          100% { transform: rotate(38deg) translate(64px, -110px) scale(0.82); opacity: 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          .dsk-in { animation-duration: 1ms; }
          .dsk-sky-on, .dsk-arm-on, .dsk-sun, .dsk-steam path, .dsk-swipe, .dsk-peel { animation: none !important; }
        }
      `}</style>

      {/* phone, lower right — caption written above, reading leftward */}
      <Enter i={0} style={{ right: "6%", bottom: "5%" }}>
        <div style={{ position: "relative" }}>
          <Caption style={{ position: "absolute", top: -30, right: 0, transform: "rotate(-4deg)" }}>my latest build, live</Caption>
          <Arrow flip style={{ position: "absolute", top: -16, right: 92, transform: "rotate(-52deg)" }} />
          <PhoneChrono />
        </div>
      </Enter>

      {/* coffee, lower left (safely under the CTA) */}
      <Enter i={1} style={{ left: "8%", bottom: "8%" }}>
        <div style={{ position: "relative" }}>
          <Coffee />
          <Caption style={{ position: "absolute", bottom: -24, left: -6, transform: "rotate(-3deg)" }}>tap for a sip</Caption>
        </div>
      </Enter>

      {/* metrocard, center of the band */}
      <Enter i={2} style={{ left: "34%", bottom: "15%" }}>
        <div style={{ position: "relative" }}>
          <MetroCard />
          <Caption style={{ position: "absolute", bottom: -22, right: 4, transform: "rotate(4deg)" }}>swipe :)</Caption>
        </div>
      </Enter>

      {/* sticky note, bottom center */}
      <Enter i={3} style={{ left: "35%", bottom: "2.5%" }}>
        <Sticky />
      </Enter>
    </div>
  );
}
