import { useEffect, useRef, useState } from "react";
import { slurp, zip, typing, typingMs, chime } from "./deskSounds";

/* ──────────────────────────────────────────────────────────────────────────
   Desk objects: the mobile hero signature. Real 3D-rendered objects
   (Microsoft Fluent 3D, MIT) with handwritten captions — and every tap has
   a SOUND and a story:

     phone    a live mini ChronoWeave — tap: soft chime + the sun sweeps a day
     coffee   tap: a loud, honest slurp; the cup tips back
     laptop   tap: keyboard typing while a line types itself out —
              "i think, design, code & ship — using AI"
     luggage  tap: zip-open sound and six soft-skill stickers spill out;
              tap again zips them back in

   Desktop keeps the physics block playground.
   ────────────────────────────────────────────────────────────────────────── */

const CAVEAT = "'Caveat', cursive";
const MONO = "'Geist Mono', monospace";
const INK2 = "#97A3BD";

const SKILLS = [
  "storytelling",
  "systems thinking",
  "user empathy",
  "cross-team collab",
  "fast learner",
  "ownership",
];
/* sticker spots relative to the bag itself (px from its top-left), fanning
   up and to the right — works wherever the bag sits, mobile or desktop */
const SKILL_SPOTS = [
  { dx: 95, dy: -115, r: -6 },
  { dx: 58, dy: -98, r: 5 },
  { dx: 148, dy: -70, r: 4 },
  { dx: 62, dy: -42, r: -5 },
  { dx: 150, dy: -14, r: -3 },
  { dx: -2, dy: -16, r: 6 },
];

function Enter({ i, children, style }: { i: number; children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="dsk-in" style={{ position: "absolute", animationDelay: `${0.75 + i * 0.14}s`, ...style }}>
      {children}
    </div>
  );
}

function Caption({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ fontFamily: CAVEAT, fontSize: 18, lineHeight: 1.1, color: INK2, whiteSpace: "nowrap", ...style }}>
      {children}
    </div>
  );
}

function Arrow({ flip, style }: { flip?: boolean; style?: React.CSSProperties }) {
  return (
    <svg width="26" height="18" viewBox="0 0 26 18" fill="none" aria-hidden="true" style={{ transform: flip ? "scaleX(-1)" : undefined, ...style }}>
      <path d="M2 2c6 1 14 3 19 11" stroke={INK2} strokeWidth="1.5" strokeLinecap="round" />
      <path d="m16.5 12.5 4.7 1 .5-4.6" stroke={INK2} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Ground({ w }: { w: number }) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "50%",
        bottom: -8,
        width: w,
        height: 13,
        transform: "translateX(-50%)",
        background: "radial-gradient(50% 50% at 50% 50%, rgba(0,0,0,0.45), transparent 70%)",
        filter: "blur(3px)",
      }}
    />
  );
}

const bareBtn: React.CSSProperties = {
  display: "block",
  padding: 0,
  border: "none",
  background: "transparent",
  cursor: "pointer",
  position: "relative",
};

/* ── 1 · the phone: a live mini ChronoWeave (chime + day sweep) ─────────── */
function PhoneChrono() {
  const [sweeping, setSweeping] = useState(false);
  const timer = useRef(0);
  const sweep = () => {
    if (sweeping) return;
    chime();
    setSweeping(true);
    timer.current = window.setTimeout(() => setSweeping(false), 4300);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button onClick={sweep} aria-label="ChronoWeave mini demo — tap to sweep the sun through a day" style={{ ...bareBtn, width: 86, transform: "rotate(-7deg)" }}>
      <span className="dsk-float" style={{ animationDelay: "1.4s" }}>
      <span className="dsk-pop">
      <span aria-hidden="true" className="dsk-halo" style={{ background: "radial-gradient(closest-side, rgba(139,124,246,0.5), transparent 72%)" }} />
      <div
        style={{
          borderRadius: 16,
          padding: 5,
          background: "linear-gradient(155deg, #232B3E, #10151F)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow:
            "0 18px 34px -12px rgba(0,0,0,0.7), 0 0 22px rgba(139,124,246,0.22), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <div className={sweeping ? "dsk-sky dsk-sky-on" : "dsk-sky"} style={{ position: "relative", width: "100%", height: 130, borderRadius: 11, overflow: "hidden" }}>
          <div className={sweeping ? "dsk-arm dsk-arm-on" : "dsk-arm"} style={{ position: "absolute", left: "50%", bottom: 34, width: 2, height: 74, transformOrigin: "bottom center" }}>
            <div className="dsk-sun" style={{ position: "absolute", top: -5, left: -5, width: 12, height: 12, borderRadius: "50%", background: "#F6C243", boxShadow: "0 0 12px 3px rgba(246,194,67,0.55)" }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 34, height: 1, background: "rgba(20,18,28,0.35)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 34, background: "rgba(20,18,28,0.16)" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 8, textAlign: "center", fontFamily: MONO, fontSize: 8, letterSpacing: "0.04em", color: "#3A3650" }}>
            feels like 3:12
          </div>
        </div>
      </div>
      </span>
      </span>
      <Ground w={70} />
    </button>
  );
}

/* ── 2 · coffee: a real cup, a loud slurp ───────────────────────────────── */
function Coffee({ size = 92 }: { size?: number }) {
  const [tilt, setTilt] = useState(false);
  const timer = useRef(0);
  const tap = () => {
    slurp();
    setTilt(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setTilt(false), 620);
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <button onClick={tap} aria-label="Coffee — tap for a loud sip" style={{ ...bareBtn, width: size }}>
      <span className="dsk-float" style={{ animationDelay: "0.2s" }}>
        <span className="dsk-pop">
          {/* a warm pool of light behind the cup */}
          <span aria-hidden="true" className="dsk-halo" style={{ background: "radial-gradient(closest-side, rgba(236,170,88,0.55), transparent 72%)" }} />
          {/* rising steam over the real cup */}
          <svg width="44" height="28" viewBox="0 0 40 26" fill="none" aria-hidden="true" style={{ position: "absolute", top: Math.round(size * 0.02), left: Math.round(size * 0.26) }}>
            <g className="dsk-steam">
              <path d="M10 24c-3-5 3-7 0-12" stroke="#C9D4EA" strokeWidth="1.7" strokeLinecap="round" opacity="0.7" />
              <path d="M20 22c-3-5 3-7 0-12" stroke="#C9D4EA" strokeWidth="1.7" strokeLinecap="round" opacity="0.5" />
              <path d="M30 24c-3-5 3-7 0-12" stroke="#C9D4EA" strokeWidth="1.7" strokeLinecap="round" opacity="0.6" />
            </g>
          </svg>
          <img
            src="/desk/coffee-3d.png"
            alt=""
            width={size}
            height={size}
            draggable={false}
            style={{
              display: "block",
              transform: tilt ? "rotate(-16deg) translateY(-3px)" : "rotate(0deg)",
              transition: "transform 300ms cubic-bezier(0.34,1.4,0.64,1)",
              transformOrigin: "30% 85%",
              filter:
                "saturate(1.3) contrast(1.07) brightness(1.06) drop-shadow(0 18px 24px rgba(0,0,0,0.55)) drop-shadow(0 0 20px rgba(236,170,88,0.3))",
            }}
          />
        </span>
      </span>
      <Ground w={Math.round(size * 0.76)} />
    </button>
  );
}

/* ── 3 · laptop: typing sound + the line types itself out ───────────────── */
const LINE = "i think, design, code & ship — using AI";
function Laptop({ size = 100 }: { size?: number }) {
  const [typed, setTyped] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const run = () => {
    if (typed !== null) return;
    typing(16);
    const perChar = typingMs(16) / LINE.length;
    setTyped("");
    for (let i = 1; i <= LINE.length; i++) {
      timers.current.push(window.setTimeout(() => setTyped(LINE.slice(0, i)), Math.round(i * perChar)));
    }
    timers.current.push(window.setTimeout(() => setTyped(null), typingMs(16) + 3600));
  };
  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  return (
    <button onClick={run} aria-label="Laptop — tap to hear how I work" style={{ ...bareBtn, width: size, transform: "rotate(3deg)" }}>
      {/* the typed line, floating above the laptop */}
      {typed !== null && (
        <div
          style={{
            position: "absolute",
            bottom: size + 2,
            left: -26,
            width: 210,
            padding: "8px 10px",
            borderRadius: 10,
            background: "rgba(16,21,31,0.92)",
            border: "1px solid rgba(91,140,255,0.35)",
            boxShadow: "0 10px 24px -10px rgba(0,0,0,0.6)",
            fontFamily: MONO,
            fontSize: 11,
            lineHeight: 1.5,
            textAlign: "left",
            color: "#CFE0FF",
            zIndex: 3,
          }}
        >
          <span style={{ color: "#5B8CFF" }}>&gt; </span>
          {typed}
          <span className="dsk-caret">▍</span>
        </div>
      )}
      <span className="dsk-float" style={{ animationDelay: "0.6s" }}>
        <span className="dsk-pop">
          <span aria-hidden="true" className="dsk-halo" style={{ background: "radial-gradient(closest-side, rgba(96,196,255,0.5), transparent 72%)" }} />
          <img
            src="/desk/laptop-3d.png"
            alt=""
            width={size}
            height={size}
            draggable={false}
            style={{
              display: "block",
              filter:
                "saturate(1.32) contrast(1.07) brightness(1.07) drop-shadow(0 18px 24px rgba(0,0,0,0.55)) drop-shadow(0 0 20px rgba(96,196,255,0.28))",
            }}
          />
        </span>
      </span>
      <Ground w={Math.round(size * 0.8)} />
    </button>
  );
}

/* ── 4 · luggage: zip it open, six soft skills spill out ────────────────── */
function Luggage({ size = 94 }: { size?: number }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(0);

  const toggle = () => {
    zip(!open);
    setOpen((o) => !o);
    window.clearTimeout(timer.current);
    if (!open) {
      // auto-zip back after a while so the hero tidies itself
      timer.current = window.setTimeout(() => {
        zip(false);
        setOpen(false);
      }, 7000);
    }
  };
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={toggle}
        aria-label={open ? "Luggage open — six soft skills out. Tap to zip it back up." : "Luggage — tap to unzip my soft skills"}
        aria-expanded={open}
        style={{ ...bareBtn, width: size, transform: "rotate(-4deg)" }}
      >
        <span className="dsk-float" style={{ animationDelay: "1s" }}>
          <span className="dsk-pop">
            <span aria-hidden="true" className="dsk-halo" style={{ background: "radial-gradient(closest-side, rgba(91,140,255,0.55), transparent 72%)" }} />
            <img
              src="/desk/luggage-3d.png"
              alt=""
              width={size}
              height={size}
              draggable={false}
              style={{
                display: "block",
                transform: open ? "rotate(-7deg) scale(1.05)" : "rotate(0deg) scale(1)",
                transition: "transform 320ms cubic-bezier(0.34,1.4,0.64,1)",
                filter:
                  "saturate(1.3) contrast(1.06) brightness(1.06) drop-shadow(0 18px 24px rgba(0,0,0,0.55)) drop-shadow(0 0 20px rgba(91,140,255,0.32))",
              }}
            />
          </span>
        </span>
        <Ground w={Math.round(size * 0.8)} />
      </button>

      {/* the six soft skills that live in the bag */}
      {open &&
        SKILLS.map((s, i) => (
          <div
            key={s}
            className="dsk-skill"
            style={{
              position: "absolute",
              left: SKILL_SPOTS[i].dx,
              top: SKILL_SPOTS[i].dy,
              // @ts-expect-error CSS var for the settle rotation
              "--r": `${SKILL_SPOTS[i].r}deg`,
              animationDelay: `${i * 75}ms`,
              padding: "5px 11px",
              borderRadius: 9,
              background: "rgba(20,27,43,0.94)",
              border: "1px solid rgba(91,140,255,0.45)",
              boxShadow: "0 8px 20px -8px rgba(0,0,0,0.6), 0 0 12px rgba(91,140,255,0.15)",
              fontFamily: CAVEAT,
              fontSize: 17,
              color: "#CFE0FF",
              whiteSpace: "nowrap",
              zIndex: 4,
              pointerEvents: "none",
            }}
          >
            {s}
          </div>
        ))}
    </div>
  );
}

/* shared animation css for the mobile collage AND the desktop flanks */
function DeskCss() {
  return (
    <style>{`
        .dsk-in { opacity: 0; animation: dsk-in 640ms cubic-bezier(0.34, 1.35, 0.64, 1) both; }
        @keyframes dsk-in {
          0% { opacity: 0; transform: translateY(-14px) rotate(4deg) scale(0.92); }
          100% { opacity: 1; transform: translateY(0) rotate(0deg) scale(1); }
        }
        .dsk-in > * { pointer-events: auto; -webkit-tap-highlight-color: transparent; }

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
        @keyframes dsk-arm { 0% { transform: rotate(-72deg); } 100% { transform: rotate(72deg); } }
        .dsk-sun { animation: dsk-sun 3.4s ease-in-out infinite; }
        @keyframes dsk-sun {
          0%, 100% { box-shadow: 0 0 10px 2px rgba(246,194,67,0.45); }
          50% { box-shadow: 0 0 16px 5px rgba(246,194,67,0.7); }
        }

        .dsk-steam path { stroke-dasharray: 15; animation: dsk-steam 2.2s linear infinite; }
        .dsk-steam path:nth-child(2) { animation-delay: -0.7s; }
        .dsk-steam path:nth-child(3) { animation-delay: -1.4s; }
        @keyframes dsk-steam { to { stroke-dashoffset: -30; } }

        .dsk-caret { animation: dsk-caret 0.9s step-end infinite; color: #5B8CFF; }
        @keyframes dsk-caret { 50% { opacity: 0; } }

        .dsk-skill { animation: dsk-skill 480ms cubic-bezier(0.34, 1.45, 0.64, 1) both; }
        @keyframes dsk-skill {
          0% { opacity: 0; transform: translateY(26px) scale(0.5) rotate(0deg); }
          100% { opacity: 1; transform: translateY(0) scale(1) rotate(var(--r)); }
        }

        /* idle float: objects hover a few px above their grounded shadow */
        .dsk-float { display: block; animation: dsk-float 5.4s ease-in-out infinite alternate; will-change: transform; }
        @keyframes dsk-float { from { transform: translateY(0); } to { transform: translateY(-7px); } }

        /* hover lift + press squish (pointer devices) */
        .dsk-pop { display: block; position: relative; transition: transform 260ms cubic-bezier(0.34, 1.4, 0.64, 1); }
        @media (hover: hover) {
          .dsk-in button:hover .dsk-pop { transform: scale(1.08); }
        }
        .dsk-in button:active .dsk-pop { transform: scale(0.93); }

        /* tinted light pool behind each object — breathing */
        .dsk-halo {
          position: absolute;
          inset: -20%;
          border-radius: 50%;
          filter: blur(16px);
          animation: dsk-halo 4.6s ease-in-out infinite alternate;
          pointer-events: none;
        }
        @keyframes dsk-halo { from { opacity: 0.45; } to { opacity: 0.8; } }

        @media (prefers-reduced-motion: reduce) {
          .dsk-in { animation-duration: 1ms; }
          .dsk-sky-on, .dsk-arm-on, .dsk-sun, .dsk-steam path, .dsk-caret, .dsk-skill, .dsk-float, .dsk-halo { animation: none !important; }
          .dsk-skill { opacity: 1; transform: rotate(var(--r)); }
          .dsk-halo { opacity: 0.55; }
        }
      `}</style>
  );
}

/* ── the mobile desk ────────────────────────────────────────────────────── */
export default function DeskObjects() {
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <DeskCss />

      {/* phone, lower right */}
      <Enter i={0} style={{ right: "6%", bottom: "5%" }}>
        <div style={{ position: "relative" }}>
          <Caption style={{ position: "absolute", top: -30, right: 0, transform: "rotate(-4deg)" }}>my latest build, live</Caption>
          <Arrow flip style={{ position: "absolute", top: -16, right: 50, transform: "rotate(-52deg)" }} />
          <PhoneChrono />
        </div>
      </Enter>

      {/* coffee, left, above the laptop — compact sizes so the 375px band fits */}
      <Enter i={1} style={{ left: "7%", bottom: "13.5%" }}>
        <div style={{ position: "relative" }}>
          <Coffee size={76} />
          <Caption style={{ position: "absolute", top: 12, left: 70, transform: "rotate(8deg)" }}>slurp!</Caption>
        </div>
      </Enter>

      {/* laptop, left column below coffee — caption to its right */}
      <Enter i={2} style={{ left: "9%", bottom: "1%" }}>
        <div style={{ position: "relative" }}>
          <Laptop size={84} />
          <Caption style={{ position: "absolute", bottom: 26, left: 88, transform: "rotate(-2deg)" }}>how i ship</Caption>
        </div>
      </Enter>

      {/* luggage, center — caption above */}
      <Enter i={3} style={{ left: "40%", bottom: "9%" }}>
        <div style={{ position: "relative" }}>
          <Luggage size={78} />
          <Caption style={{ position: "absolute", top: -26, left: 2, transform: "rotate(3deg)" }}>unzip me</Caption>
        </div>
      </Enter>
    </div>
  );
}

/* ── the desktop flanks: two objects each side of the centered hero copy ── */
export function DeskFlanks() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <DeskCss />

      {/* left of the text: coffee above, luggage below */}
      <Enter i={1} style={{ left: "6%", top: "24%" }}>
        <div style={{ position: "relative" }}>
          <Coffee />
          <Caption style={{ position: "absolute", top: 12, left: 82, transform: "rotate(8deg)" }}>slurp!</Caption>
        </div>
      </Enter>
      <Enter i={3} style={{ left: "10%", top: "46%" }}>
        <div style={{ position: "relative" }}>
          <Luggage />
          <Caption style={{ position: "absolute", bottom: -26, left: 2, transform: "rotate(3deg)" }}>unzip me</Caption>
        </div>
      </Enter>

      {/* right of the text: laptop above, the live phone below */}
      <Enter i={2} style={{ right: "7%", top: "24%" }}>
        <div style={{ position: "relative" }}>
          <Laptop />
          <Caption style={{ position: "absolute", bottom: -24, left: 8, transform: "rotate(-2deg)" }}>how i ship</Caption>
        </div>
      </Enter>
      <Enter i={0} style={{ right: "6%", top: "40%" }}>
        <div style={{ position: "relative" }}>
          <Caption style={{ position: "absolute", top: -30, right: 0, transform: "rotate(-4deg)" }}>my latest build, live</Caption>
          <PhoneChrono />
        </div>
      </Enter>
    </div>
  );
}
