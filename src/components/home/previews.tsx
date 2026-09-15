import { useState, useEffect } from "react";
import { motion } from "motion/react";

/* ──────────────────────────────────────────────────────────────────────────
   The live previews.

   These are the single most portfolio-appropriate thing in the codebase and
   they had been buried: hand-built, animated recreations of the four shipped
   products. Signal walks its map pins from four to twelve, Headroom counts a
   balance up inside a phone frame. They are not screenshots — they are
   working front-end, which is exactly the claim the site is making.

   Lifted out of HomePage.tsx so the homepage can use them without importing
   that module, which would drag the particle canvas, the WebGL hero and
   matter-js back into the bundle with them. They reference only these three
   font tokens and no other component, so the extraction is clean.

   Each takes an `active` prop: false resets it, true plays its animation. The
   scroll choreography drives that, so a preview animates when it is actually
   on screen rather than on a timer nobody sees.
   ────────────────────────────────────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;

const V = {
  mono: "var(--font-mono)",
  display: "var(--font-display)",
  body: "var(--font-body)",
};

export function SignalPreview({ active }: { active: boolean }) {
  const [n, setN] = useState(4);
  useEffect(() => {
    if (!active) {
      setN(4);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / 850, 1);
      setN(4 + Math.round((1 - Math.pow(1 - p, 3)) * 8)); // 4 → 12
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const pins = [
    { x: 20, y: 32, c: "#0090CE", fit: "open" },
    { x: 37, y: 22, c: "#C8102E", fit: "tight" },
    { x: 55, y: 30, c: "#E07B00", fit: "open" },
    { x: 30, y: 50, c: "#009A44", fit: "open" },
    { x: 63, y: 48, c: "#E8B800", fit: "conflict" },
    { x: 46, y: 62, c: "#7E868C", fit: "open" },
    { x: 74, y: 36, c: "#009A44", fit: "tight" },
  ];
  const ring: Record<string, string> = { open: "#1F9D55", tight: "#E0A100", conflict: "#C8102E" };

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full"
      style={{ background: "radial-gradient(120% 120% at 28% 12%, #141922 0%, #0C0F15 62%, #090B0F 100%)", minHeight: "inherit", overflow: "hidden" }}
    >
      {/* faint street grid */}
      <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.5 }} preserveAspectRatio="none">
        {[18, 38, 58, 78].map((y) => (
          <line key={"h" + y} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} stroke="#1B2230" strokeWidth="1" />
        ))}
        {[16, 34, 52, 70, 88].map((x) => (
          <line key={"v" + x} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" stroke="#1B2230" strokeWidth="1" />
        ))}
        <path d="M2 78 Q 30 60 46 66 T 96 40" stroke="#243042" strokeWidth="2" fill="none" opacity="0.8" />
      </svg>
      {/* Chesapeake water nod */}
      <div style={{ position: "absolute", right: "-10%", top: "6%", width: "44%", height: "58%", background: "linear-gradient(160deg, rgba(120,152,170,0.18), rgba(90,120,140,0.05))", borderRadius: "45% 35% 55% 40%", filter: "blur(2px)" }} />

      {/* pins — ink tiles with a category dot; ring encodes Fit when active */}
      {pins.map((p, i) => (
        <motion.div
          key={i}
          style={{ position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-100%)" }}
          animate={active ? { y: [0, -3, 0] } : { y: 0 }}
          transition={{ duration: 2.4, repeat: active ? Infinity : 0, ease: "easeInOut", delay: (i % 4) * 0.3 }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 18,
              height: 18,
              borderRadius: 6,
              background: "#16181C",
              boxShadow: active ? `0 0 0 2px ${ring[p.fit]}, 0 4px 10px rgba(0,0,0,0.5)` : "0 4px 10px rgba(0,0,0,0.5)",
              /* box-shadow is deliberately NOT transitioned: animating it repaints
                 the whole card each frame. The border carries the hover instead. */
              transition: "border-color 0.25s var(--ease-ui)",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 2, background: p.c }} />
          </span>
          <span style={{ display: "block", width: 1.5, height: 6, background: "#16181C", margin: "0 auto" }} />
        </motion.div>
      ))}

      {/* the Fit card */}
      <div
        data-region="FIT PANEL"
        className="absolute"
        style={{
          left: 16,
          bottom: 16,
          borderRadius: 12,
          padding: "12px 14px",
          background: "rgba(251,250,246,0.96)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 14px 34px -14px rgba(0,0,0,0.55)",
          minWidth: 150,
        }}
      >
        <div className="flex items-center gap-1.5">
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "#1F9D55" }} />
          <span style={{ fontFamily: V.mono, fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8A8F97" }}>This week · Fit</span>
        </div>
        <p style={{ fontFamily: V.display, fontSize: 26, fontWeight: 600, color: "#16181C", lineHeight: 1.05, marginTop: 4, fontVariantNumeric: "tabular-nums" }}>
          {n} <span style={{ fontFamily: V.body, fontSize: 12, fontWeight: 600, color: "#4A4E55" }}>you can make</span>
        </p>
        <div className="flex items-center gap-3" style={{ marginTop: 8 }}>
          {[
            { l: "open", c: "#1F9D55" },
            { l: "tight", c: "#E0A100" },
            { l: "conflict", c: "#C8102E" },
          ].map((s) => (
            <span key={s.l} className="inline-flex items-center gap-1" style={{ fontFamily: V.body, fontSize: 8.5, fontWeight: 600, color: "#4A4E55" }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: s.c }} /> {s.l}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function HeadroomPreview({ active }: { active: boolean }) {
  const [n, setN] = useState(1730);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let start: number | null = null;
    const tick = (t: number) => {
      if (start === null) start = t;
      const p = Math.min((t - start) / 750, 1);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 1730));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full flex items-center justify-center"
      style={{ background: "radial-gradient(120% 120% at 70% 20%, #0D2A1F 0%, #081A12 60%, #06130D 100%)", minHeight: "inherit" }}
    >
      <div data-region="DEVICE" style={{ width: 168, borderRadius: 26, padding: 6, background: "#0B0D12", border: "1px solid #1E2A24", boxShadow: "0 24px 50px -18px rgba(0,0,0,0.6)", margin: "28px 0" }}>
        <div style={{ borderRadius: 21, background: "#FFFFFF", overflow: "hidden", padding: "16px 14px 12px" }}>
          <p style={{ fontFamily: V.mono, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5B6560" }}>
            Safe to spend
          </p>
          <p style={{ fontFamily: V.display, fontSize: 30, fontWeight: 600, color: "#10160F", lineHeight: 1.1, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>
            ${n.toLocaleString()}
          </p>
          <p style={{ fontFamily: V.body, fontSize: 9.5, fontWeight: 500, color: "#0A7A52", marginTop: 3 }}>≈ $87/day · 20 days</p>
          <div data-region="RUNWAY" style={{ marginTop: 10, height: 5, borderRadius: 999, background: "#E6F5EE", overflow: "hidden" }}>
            <motion.div
              style={{ height: "100%", borderRadius: 999, background: "#34D399" }}
              animate={{ width: active ? "69%" : "12%" }}
              transition={{ duration: 0.8, ease: EASE }}
            />
          </div>
          {[
            { l: "Rent", v: "$650" },
            { l: "Wifi", v: "$120" },
          ].map((r) => (
            <div key={r.l} className="flex items-center justify-between" style={{ padding: "7px 0", borderBottom: "1px solid #EDF1EE" }}>
              <span style={{ fontFamily: V.body, fontSize: 9.5, fontWeight: 600, color: "#10160F" }}>{r.l}</span>
              <span style={{ fontFamily: V.body, fontSize: 9.5, color: "#5B6560", fontVariantNumeric: "tabular-nums" }}>{r.v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ChronoWeavePreview({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full flex items-center justify-center"
      style={{ background: "radial-gradient(120% 120% at 30% 20%, #1A1430 0%, #110D20 60%, #0C0916 100%)", minHeight: "inherit" }}
    >
      <div data-region="DEVICE" style={{ width: 168, borderRadius: 26, padding: 6, background: "#0B0D12", border: "1px solid #241E38", boxShadow: "0 24px 50px -18px rgba(0,0,0,0.6)", margin: "28px 0" }}>
        <div style={{ borderRadius: 21, background: "#120E22", overflow: "hidden", padding: "16px 14px 44px", position: "relative" }}>
          <p style={{ fontFamily: V.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#A79FC9" }}>
            Focus block
          </p>
          {/* time ring */}
          <div data-region="FOCUS TIMER" className="relative mx-auto" style={{ width: 92, height: 92, marginTop: 10 }}>
            <svg width="92" height="92" viewBox="0 0 92 92">
              <circle cx="46" cy="46" r="38" fill="none" stroke="#241E38" strokeWidth="6" />
              <motion.circle
                cx="46"
                cy="46"
                r="38"
                fill="none"
                stroke="#A78BFA"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 38}
                /* initial is REQUIRED, not decorative. Without it Motion takes the
                   current animate value as the start, so a component mounted with
                   active already true has nothing to animate FROM and renders the
                   finished state. Until Motion's first frame lands it also writes
                   this attribute as the string "undefined", which the browser reads
                   as 0 and draws as a full ring instead of an arc. */
                initial={{ strokeDashoffset: 2 * Math.PI * 38 * 0.78 }}
                animate={{ strokeDashoffset: active ? 2 * Math.PI * 38 * 0.35 : 2 * Math.PI * 38 * 0.78 }}
                transition={{ duration: 0.9, ease: EASE }}
                transform="rotate(-90 46 46)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span style={{ fontFamily: V.display, fontSize: 20, fontWeight: 600, color: "#EDEAF7", fontVariantNumeric: "tabular-nums" }}>
                24:00
              </span>
              <span style={{ fontFamily: V.mono, fontSize: 9, color: "#A79FC9", letterSpacing: "0.1em" }}>REMAINING</span>
            </div>
          </div>
          {/* haptic dots */}
          <div className="flex items-center justify-center gap-2" style={{ marginTop: 10 }}>
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                style={{ width: 5, height: 5, borderRadius: 999, background: "#A78BFA" }}
                initial={{ opacity: 0.3, scale: 1 }}
                animate={active ? { opacity: [0.3, 1, 0.3], scale: [1, 1.35, 1] } : { opacity: 0.3, scale: 1 }}
                transition={{ duration: 0.9, repeat: active ? Infinity : 0, delay: i * 0.14 }}
              />
            ))}
          </div>
          {/* nudge toast */}
          <motion.div
            className="absolute left-2.5 right-2.5"
            style={{
              bottom: 10,
              borderRadius: 10,
              padding: "8px 10px",
              background: "#2A2247",
              border: "1px solid rgba(167,139,250,0.5)",
            }}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: active ? 0 : 40, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <p style={{ fontFamily: V.body, fontSize: 10, fontWeight: 600, color: "#E4DEFA" }}>Gentle nudge</p>
            <p style={{ fontFamily: V.body, fontSize: 9.5, color: "#B7ACE4", marginTop: 1 }}>Halfway through. Feel the pulse.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function BumperPreview({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden="true"
      className="relative w-full h-full flex items-center justify-center px-6"
      style={{ background: "radial-gradient(120% 120% at 70% 25%, #0A2422 0%, #071A18 55%, #061211 100%)", minHeight: "inherit" }}
    >
      {/* browser frame */}
      <div data-region="BROWSER" style={{ width: "100%", maxWidth: 300, borderRadius: 12, overflow: "hidden", border: "1px solid #16302D", background: "#0D1512", boxShadow: "0 24px 50px -18px rgba(0,0,0,0.6)", margin: "28px 0" }}>
        {/* chrome bar */}
        <div className="flex items-center gap-2" style={{ padding: "7px 10px", background: "#101B18", borderBottom: "1px solid #16302D" }}>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 6, height: 6, borderRadius: 999, background: "#1F332F" }} />
            ))}
          </div>
          <span style={{ fontFamily: V.mono, fontSize: 9, color: "#8AA39D", flex: 1, textAlign: "center" }}>
            checkout.store/cart
          </span>
        </div>
        {/* page + intercept */}
        <div data-region="CHECKOUT" className="relative" style={{ height: 150, padding: 12, overflow: "hidden" }}>
          <div className="flex items-center gap-2.5">
            <div style={{ width: 34, height: 34, borderRadius: 8, background: "#14211E" }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 7, width: "72%", borderRadius: 3, background: "#1A2A26" }} />
              <div style={{ height: 6, width: "42%", borderRadius: 3, background: "#152220", marginTop: 5 }} />
            </div>
            <span style={{ fontFamily: V.mono, fontSize: 10, color: "#B9C9C4", fontVariantNumeric: "tabular-nums" }}>$89</span>
          </div>
          <div style={{ marginTop: 12, height: 26, borderRadius: 7, background: "#10231F", border: "1px solid #1C453E", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: V.body, fontSize: 10, fontWeight: 600, color: "#63D8CA" }}>Buy now</span>
          </div>

          {/* intercept panel */}
          <motion.div
            className="absolute left-2 right-2"
            style={{
              bottom: 8,
              borderRadius: 10,
              padding: "10px 12px",
              background: "#0D1A18",
              border: "1px solid rgba(20,184,166,0.5)",
              boxShadow: "0 -8px 26px rgba(0,0,0,0.45)",
            }}
            initial={{ y: 110, opacity: 0 }}
            animate={{ y: active ? 0 : 110, opacity: active ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <div className="flex items-center gap-1.5">
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "#14B8A6" }} />
              <span style={{ fontFamily: V.mono, fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6FD3C6" }}>
                Bumper
              </span>
            </div>
            <p style={{ fontFamily: V.body, fontSize: 10.5, fontWeight: 600, color: "#DCEBE8", marginTop: 4 }}>
              Wait. Do you need this, or do you want it?
            </p>
            <div className="flex gap-1.5" style={{ marginTop: 7 }}>
              <span style={{ fontFamily: V.body, fontSize: 9, fontWeight: 600, color: "#06120F", background: "#3FCFBE", borderRadius: 5, padding: "4px 9px" }}>
                Sleep on it
              </span>
              <span style={{ fontFamily: V.body, fontSize: 9, fontWeight: 500, color: "#9CB8B2", border: "1px solid #24463F", borderRadius: 5, padding: "4px 9px" }}>
                Buy anyway
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
