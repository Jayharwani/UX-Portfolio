import { motion, useReducedMotion } from "motion/react";

/* ──────────────────────────────────────────────────────────────────────────
   UX motion backdrop: a ghost cursor performs three quiet micro-interactions
   on an invisible interface — flips a toggle, presses a button, drags a
   slider — on a 14s loop. Hairline strokes, huge negative space, one accent,
   faint redline annotations. Minimal on purpose.
   Static composition under reduced motion.
   ────────────────────────────────────────────────────────────────────────── */

const LOOP = 14;
const EASE_IO = [0.45, 0.05, 0.25, 1] as const;

/* stage coordinates (560 × 480) — targets the cursor visits */
const TOGGLE = { x: 372, y: 84 };
const BUTTON = { x: 96, y: 214 };
const SLIDER = { x: 236, y: 396 }; // knob start
const SLIDER_END = { x: 356, y: 396 };
const REST = { x: 520, y: 300 };

function Ripple({ x, y, at }: { x: number; y: number; at: number }) {
  return (
    <motion.span
      aria-hidden="true"
      style={{
        position: "absolute",
        left: x - 34,
        top: y - 34,
        width: 68,
        height: 68,
        borderRadius: 999,
        border: "1.5px solid var(--accent)",
      }}
      initial={{ opacity: 0, scale: 0.2 }}
      animate={{ opacity: [0, 0, 0.5, 0, 0], scale: [0.2, 0.2, 0.55, 1.15, 1.15] }}
      transition={{ duration: LOOP, repeat: Infinity, times: [0, at, at + 0.012, at + 0.06, 1], ease: "easeOut" }}
    />
  );
}

/* faint Figma-style redline: measurement ticks + a tiny mono value */
function Redline({ style, w, label }: { style: React.CSSProperties; w: number; label: string }) {
  return (
    <div aria-hidden="true" style={{ position: "absolute", opacity: 0.6, ...style }}>
      <div style={{ position: "relative", width: w, height: 10 }}>
        <span style={{ position: "absolute", left: 0, top: 0, width: 1, height: 10, background: "var(--accent)", opacity: 0.55 }} />
        <span style={{ position: "absolute", right: 0, top: 0, width: 1, height: 10, background: "var(--accent)", opacity: 0.55 }} />
        <span style={{ position: "absolute", left: 0, right: 0, top: 5, height: 1, background: "var(--accent)", opacity: 0.4 }} />
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: -4,
            transform: "translateX(-50%)",
            fontFamily: "var(--font-mono)",
            fontSize: 8.5,
            color: "var(--accent)",
            background: "var(--bg-2)",
            padding: "0 5px",
            letterSpacing: "0.06em",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

export default function UXMotionBackdrop() {
  const reduce = useReducedMotion();

  const hairline = "1.5px solid rgba(106, 116, 136, 0.34)";
  const label: React.CSSProperties = {
    position: "absolute",
    fontFamily: "var(--font-mono)",
    fontSize: 9,
    letterSpacing: "0.14em",
    color: "rgba(106,116,136,0.55)",
    textTransform: "uppercase",
  };

  /* cursor path keyframes (shared times) */
  const times = [0, 0.09, 0.16, 0.28, 0.38, 0.5, 0.66, 0.78, 1];
  const cx = [REST.x, TOGGLE.x, TOGGLE.x, BUTTON.x, BUTTON.x, SLIDER.x, SLIDER_END.x, REST.x, REST.x];
  const cy = [REST.y, TOGGLE.y, TOGGLE.y, BUTTON.y, BUTTON.y, SLIDER.y, SLIDER.y, REST.y, REST.y];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden pointer-events-none"
      style={{ opacity: 0.8 }}
    >
      {/* faint dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(rgba(106,116,136,0.16) 1px, transparent 1px)",
          backgroundSize: "34px 34px",
          maskImage: "radial-gradient(70% 80% at 62% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(70% 80% at 62% 50%, black, transparent)",
        }}
      />

      {/* the stage, right-weighted (content lives left) */}
      <div
        className="absolute"
        style={{
          right: "3%",
          top: "50%",
          width: 560,
          height: 480,
          transform: "translateY(-50%)",
        }}
      >
        {/* ── toggle ── */}
        <div style={{ position: "absolute", left: TOGGLE.x - 46, top: TOGGLE.y - 24 }}>
          <span style={{ ...label, top: -18, left: 2 }}>toggle / on</span>
          <motion.div
            style={{ width: 92, height: 48, borderRadius: 999, border: hairline, padding: 5 }}
            animate={
              reduce
                ? { backgroundColor: "rgba(91,140,255,0.14)", borderColor: "rgba(91,140,255,0.4)" }
                : {
                    backgroundColor: ["rgba(91,140,255,0)", "rgba(91,140,255,0)", "rgba(91,140,255,0.14)", "rgba(91,140,255,0.14)", "rgba(91,140,255,0)"],
                    borderColor: ["rgba(106,116,136,0.34)", "rgba(106,116,136,0.34)", "rgba(91,140,255,0.4)", "rgba(91,140,255,0.4)", "rgba(106,116,136,0.34)"],
                  }
            }
            transition={{ duration: LOOP, repeat: Infinity, times: [0, 0.115, 0.135, 0.86, 0.92] }}
          >
            <motion.span
              style={{ display: "block", width: 36, height: 36, borderRadius: 999, background: "rgba(153,164,182,0.5)" }}
              animate={reduce ? { x: 44 } : { x: [0, 0, 44, 44, 0], backgroundColor: ["rgba(153,164,182,0.5)", "rgba(153,164,182,0.5)", "rgba(91,140,255,0.85)", "rgba(91,140,255,0.85)", "rgba(153,164,182,0.5)"] }}
              transition={{ duration: LOOP, repeat: Infinity, times: [0, 0.115, 0.145, 0.86, 0.92], ease: EASE_IO }}
            />
          </motion.div>
        </div>

        {/* ── button ── */}
        <div style={{ position: "absolute", left: BUTTON.x - 88, top: BUTTON.y - 30 }}>
          <span style={{ ...label, top: -18, left: 2 }}>button / primary</span>
          <motion.div
            className="flex items-center justify-center"
            style={{ width: 176, height: 60, borderRadius: 12, border: hairline }}
            animate={
              reduce
                ? {}
                : {
                    scale: [1, 1, 0.96, 1, 1],
                    borderColor: [
                      "rgba(106,116,136,0.34)",
                      "rgba(106,116,136,0.34)",
                      "rgba(91,140,255,0.55)",
                      "rgba(106,116,136,0.34)",
                      "rgba(106,116,136,0.34)",
                    ],
                  }
            }
            transition={{ duration: LOOP, repeat: Infinity, times: [0, 0.315, 0.335, 0.4, 1] }}
          >
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.18em", color: "rgba(153,164,182,0.55)" }}>
              SAY&nbsp;HI
            </span>
          </motion.div>
          {/* redline under the button */}
          <Redline style={{ left: 0, top: 72 }} w={176} label="176" />
        </div>

        {/* ── slider ── */}
        <div style={{ position: "absolute", left: SLIDER.x - 96, top: SLIDER.y - 8 }}>
          <span style={{ ...label, top: -22, left: 2 }}>ease / out-expo</span>
          <div style={{ position: "relative", width: 240, height: 16, display: "flex", alignItems: "center" }}>
            <div style={{ position: "absolute", left: 0, right: 0, height: 2, background: "rgba(106,116,136,0.28)", borderRadius: 2 }} />
            <motion.div
              style={{ position: "absolute", left: 0, height: 2, background: "rgba(91,140,255,0.6)", borderRadius: 2 }}
              animate={reduce ? { width: 216 } : { width: [96, 96, 216, 216, 96] }}
              transition={{ duration: LOOP, repeat: Infinity, times: [0, 0.5, 0.66, 0.9, 1], ease: EASE_IO }}
            />
            <motion.span
              style={{
                position: "absolute",
                top: 0,
                width: 16,
                height: 16,
                borderRadius: 999,
                background: "var(--bg-2)",
                border: "1.5px solid rgba(91,140,255,0.75)",
                marginLeft: -8,
              }}
              animate={reduce ? { left: 216 } : { left: [96, 96, 216, 216, 96] }}
              transition={{ duration: LOOP, repeat: Infinity, times: [0, 0.5, 0.66, 0.9, 1], ease: EASE_IO }}
            />
          </div>
        </div>

        {/* click ripples, synced to the cursor's moments */}
        {!reduce && (
          <>
            <Ripple x={TOGGLE.x} y={TOGGLE.y} at={0.12} />
            <Ripple x={BUTTON.x} y={BUTTON.y} at={0.32} />
            <Ripple x={SLIDER_END.x} y={SLIDER.y} at={0.665} />
          </>
        )}

        {/* ── the ghost cursor ── */}
        <motion.div
          style={{ position: "absolute", left: 0, top: 0, zIndex: 2 }}
          animate={reduce ? { x: BUTTON.x + 10, y: BUTTON.y + 10 } : { x: cx, y: cy }}
          transition={reduce ? undefined : { duration: LOOP, repeat: Infinity, times, ease: EASE_IO }}
        >
          {/* click dips ride on an inner element so they don't fight the path */}
          <motion.div
            animate={reduce ? {} : { scale: [1, 1, 0.8, 1, 1, 0.8, 1, 1, 0.8, 1, 1] }}
            transition={{
              duration: LOOP,
              repeat: Infinity,
              times: [0, 0.115, 0.125, 0.14, 0.315, 0.325, 0.34, 0.66, 0.67, 0.685, 1],
            }}
            style={{ transformOrigin: "top left" }}
          >
            <svg width="30" height="34" viewBox="0 0 15 17" style={{ filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.45))" }}>
              <path
                d="M1 1 L1 13.6 L4.6 10.4 L7 15.6 L9.3 14.6 L6.9 9.5 L11.6 9.2 Z"
                fill="rgba(232,236,243,0.92)"
                stroke="rgba(10,14,22,0.9)"
                strokeWidth="0.8"
              />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
