import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChatTeardropText, TreeStructure, HandHeart, UsersThree, Lightning, Flag, X } from "@phosphor-icons/react";
import { slurp, zip, typing, typingMs, chime } from "./deskSounds";

/* ──────────────────────────────────────────────────────────────────────────
   Desk objects: the hero signature. REAL photo cutouts (not renders), every
   tap has a sound and a story:

     phone     a live mini ChronoWeave — tap: soft chime + the sun sweeps a day
     coffee    tap: a loud, honest slurp; the cup tips back
     laptop    tap: keyboard typing while a line types itself out
     suitcase  tap: zip-open sound → a card modal with six soft skills,
               each with its own icon (the paridhi "values" pattern)

   Photo sources (transparent cutouts):
     coffee   Wikimedia Commons "Cup of Coffee with foam"        CC BY-SA 3.0
     laptop   Wikimedia Commons "MacBook Pro transparency"       CC BY 2.0
     suitcase Wikimedia Commons "Travel luggage" (blue, cropped) CC0
   ────────────────────────────────────────────────────────────────────────── */

const CAVEAT = "'Caveat', cursive";
const MONO = "'Geist Mono', monospace";
const DISPLAY = "'Clash Display', 'General Sans', sans-serif";
const BODY = "'General Sans', sans-serif";
const INK2 = "#97A3BD";

/* natural aspect ratios of the real photos (w / h) */
const ASPECT = { coffee: 512 / 389, laptop: 512 / 412, suitcase: 392 / 293 };

const SKILLS: { label: string; Icon: typeof ChatTeardropText }[] = [
  { label: "Storytelling", Icon: ChatTeardropText },
  { label: "Systems thinking", Icon: TreeStructure },
  { label: "User empathy", Icon: HandHeart },
  { label: "Cross-team collaboration", Icon: UsersThree },
  { label: "Fast learner", Icon: Lightning },
  { label: "Ownership", Icon: Flag },
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

/* ── 2 · coffee: a real cappuccino, a loud slurp ────────────────────────── */
function Coffee({ size = 92 }: { size?: number }) {
  const [tilt, setTilt] = useState(false);
  const timer = useRef(0);
  const h = Math.round(size / ASPECT.coffee);
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
          <span aria-hidden="true" className="dsk-halo" style={{ background: "radial-gradient(closest-side, rgba(236,170,88,0.5), transparent 72%)" }} />
          {/* rising steam over the foam */}
          <svg width="44" height="28" viewBox="0 0 40 26" fill="none" aria-hidden="true" style={{ position: "absolute", top: -14, left: Math.round(size * 0.14) }}>
            <g className="dsk-steam">
              <path d="M10 24c-3-5 3-7 0-12" stroke="#C9D4EA" strokeWidth="1.7" strokeLinecap="round" opacity="0.7" />
              <path d="M20 22c-3-5 3-7 0-12" stroke="#C9D4EA" strokeWidth="1.7" strokeLinecap="round" opacity="0.5" />
              <path d="M30 24c-3-5 3-7 0-12" stroke="#C9D4EA" strokeWidth="1.7" strokeLinecap="round" opacity="0.6" />
            </g>
          </svg>
          <img
            src="/desk/coffee-real.png"
            alt=""
            width={size}
            height={h}
            draggable={false}
            style={{
              display: "block",
              transform: tilt ? "rotate(-14deg) translateY(-3px)" : "rotate(0deg)",
              transition: "transform 300ms cubic-bezier(0.34,1.4,0.64,1)",
              transformOrigin: "30% 85%",
              filter:
                "saturate(1.06) contrast(1.04) drop-shadow(0 18px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 18px rgba(236,170,88,0.25))",
            }}
          />
        </span>
      </span>
      <Ground w={Math.round(size * 0.82)} />
    </button>
  );
}

/* ── 3 · laptop: a real MacBook, typing sound + the line types out ──────── */
const LINE = "i think, design, code & ship — using AI";
function Laptop({ size = 100 }: { size?: number }) {
  const [typed, setTyped] = useState<string | null>(null);
  const timers = useRef<number[]>([]);
  const h = Math.round(size / ASPECT.laptop);
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
            bottom: h + 8,
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
          <span aria-hidden="true" className="dsk-halo" style={{ background: "radial-gradient(closest-side, rgba(96,196,255,0.45), transparent 72%)" }} />
          <img
            src="/desk/laptop-real.png"
            alt=""
            width={size}
            height={h}
            draggable={false}
            style={{
              display: "block",
              filter:
                "saturate(1.05) contrast(1.05) drop-shadow(0 18px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 18px rgba(96,196,255,0.22))",
            }}
          />
        </span>
      </span>
      <Ground w={Math.round(size * 0.84)} />
    </button>
  );
}

/* ── the six-skills card modal (zip open → her "values" pattern) ────────── */
function SkillsModal({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      className="dskm-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 90,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        background: "rgba(5, 8, 13, 0.74)",
        backdropFilter: "blur(7px)",
        WebkitBackdropFilter: "blur(7px)",
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Soft skills I carry everywhere"
        onClick={(e) => e.stopPropagation()}
        className="dskm-panel"
        style={{
          position: "relative",
          width: "min(600px, 100%)",
          borderRadius: 26,
          padding: "clamp(22px, 5vw, 36px)",
          background: "linear-gradient(165deg, #131A29 0%, #0D1320 100%)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 40px 90px -20px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        <button
          ref={closeRef}
          onClick={onClose}
          aria-label="Zip it back up"
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(255,255,255,0.05)",
            color: "#E8ECF3",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={18} weight="bold" />
        </button>

        <div style={{ fontFamily: CAVEAT, fontSize: 19, color: "#5B8CFF", marginBottom: 4 }}>unzipped ↓</div>
        <h2
          style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: "clamp(1.45rem, 4.6vw, 2rem)",
            letterSpacing: "-0.02em",
            color: "#E8ECF3",
            margin: "0 0 22px",
            paddingRight: 44,
          }}
        >
          Soft skills I carry everywhere
        </h2>

        <div className="dskm-grid">
          {SKILLS.map(({ label, Icon }, i) => (
            <div
              key={label}
              className="dskm-card"
              style={{
                animationDelay: `${90 + i * 55}ms`,
                borderRadius: 16,
                padding: "16px 14px 15px",
                background: "rgba(255,255,255,0.035)",
                border: "1px solid rgba(255,255,255,0.07)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <span
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 11,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(91,140,255,0.12)",
                  border: "1px solid rgba(91,140,255,0.25)",
                }}
              >
                <Icon size={20} weight="duotone" color="#5B8CFF" />
              </span>
              <span style={{ fontFamily: BODY, fontSize: 15, lineHeight: 1.35, fontWeight: 500, color: "#D5DCEA" }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── 4 · suitcase: a real case; unzip → the skills card ─────────────────── */
function Suitcase({ size = 94 }: { size?: number }) {
  const [open, setOpen] = useState(false);
  const h = Math.round(size / ASPECT.suitcase);

  const openUp = () => {
    zip(true);
    setOpen(true);
  };
  const close = () => {
    zip(false);
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        onClick={openUp}
        aria-label="Suitcase — tap to unzip my soft skills"
        aria-expanded={open}
        style={{ ...bareBtn, width: size, transform: "rotate(-4deg)" }}
      >
        <span className="dsk-float" style={{ animationDelay: "1s" }}>
          <span className="dsk-pop">
            <span aria-hidden="true" className="dsk-halo" style={{ background: "radial-gradient(closest-side, rgba(91,140,255,0.5), transparent 72%)" }} />
            <img
              src="/desk/suitcase-real.png"
              alt=""
              width={size}
              height={h}
              draggable={false}
              style={{
                display: "block",
                filter:
                  "saturate(1.12) contrast(1.05) brightness(1.08) drop-shadow(0 18px 24px rgba(0,0,0,0.6)) drop-shadow(0 0 18px rgba(91,140,255,0.3))",
              }}
            />
          </span>
        </span>
        <Ground w={Math.round(size * 0.84)} />
      </button>
      {open && <SkillsModal onClose={close} />}
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

        /* skills modal: springs in like the bag popping open */
        .dskm-backdrop { animation: dskm-fade 240ms ease-out both; }
        @keyframes dskm-fade { from { opacity: 0; } to { opacity: 1; } }
        .dskm-panel { animation: dskm-pop 420ms cubic-bezier(0.34, 1.3, 0.64, 1) both; }
        @keyframes dskm-pop {
          0% { opacity: 0; transform: translateY(26px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .dskm-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media (min-width: 480px) {
          .dskm-grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
        }
        .dskm-card { animation: dskm-card 380ms cubic-bezier(0.34, 1.35, 0.64, 1) both; }
        @keyframes dskm-card {
          0% { opacity: 0; transform: translateY(14px) scale(0.94); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }

        @media (prefers-reduced-motion: reduce) {
          .dsk-in { animation-duration: 1ms; }
          .dsk-sky-on, .dsk-arm-on, .dsk-sun, .dsk-steam path, .dsk-caret, .dsk-float, .dsk-halo { animation: none !important; }
          .dsk-halo { opacity: 0.55; }
          .dskm-backdrop, .dskm-panel, .dskm-card { animation-duration: 1ms; }
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
      <Enter i={1} style={{ left: "7%", bottom: "15%" }}>
        <div style={{ position: "relative" }}>
          <Coffee size={82} />
          <Caption style={{ position: "absolute", top: 8, left: 78, transform: "rotate(8deg)" }}>slurp!</Caption>
        </div>
      </Enter>

      {/* laptop, left column below coffee — caption to its right */}
      <Enter i={2} style={{ left: "9%", bottom: "2.5%" }}>
        <div style={{ position: "relative" }}>
          <Laptop size={92} />
          <Caption style={{ position: "absolute", bottom: 22, left: 98, transform: "rotate(-2deg)" }}>how i ship</Caption>
        </div>
      </Enter>

      {/* suitcase, center — caption above */}
      <Enter i={3} style={{ left: "42%", bottom: "10.5%" }}>
        <div style={{ position: "relative" }}>
          <Suitcase size={86} />
          <Caption style={{ position: "absolute", top: -26, left: 4, transform: "rotate(3deg)" }}>unzip me</Caption>
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

      {/* left of the text: coffee above, suitcase below */}
      <Enter i={1} style={{ left: "6%", top: "24%" }}>
        <div style={{ position: "relative" }}>
          <Coffee size={104} />
          <Caption style={{ position: "absolute", top: 8, left: 96, transform: "rotate(8deg)" }}>slurp!</Caption>
        </div>
      </Enter>
      <Enter i={3} style={{ left: "10%", top: "48%" }}>
        <div style={{ position: "relative" }}>
          <Suitcase size={112} />
          <Caption style={{ position: "absolute", bottom: -26, left: 6, transform: "rotate(3deg)" }}>unzip me</Caption>
        </div>
      </Enter>

      {/* right of the text: laptop above, the live phone below */}
      <Enter i={2} style={{ right: "7%", top: "24%" }}>
        <div style={{ position: "relative" }}>
          <Laptop size={118} />
          <Caption style={{ position: "absolute", bottom: -24, left: 12, transform: "rotate(-2deg)" }}>how i ship</Caption>
        </div>
      </Enter>
      <Enter i={0} style={{ right: "6%", top: "42%" }}>
        <div style={{ position: "relative" }}>
          <Caption style={{ position: "absolute", top: -30, right: 0, transform: "rotate(-4deg)" }}>my latest build, live</Caption>
          <PhoneChrono />
        </div>
      </Enter>
    </div>
  );
}
