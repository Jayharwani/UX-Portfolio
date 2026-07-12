/* ──────────────────────────────────────────────────────────────────────────
   ChronoWeave · shared primitives + hand-drawn glyphs (brief §3: no icon
   packs — every glyph is a simple inline SVG drawn for this product).
   ────────────────────────────────────────────────────────────────────────── */
import type { ReactNode, CSSProperties, ButtonHTMLAttributes } from "react";

/* ── glyphs ── */
interface GlyphProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}
const g = ({ size = 22, color = "currentColor", strokeWidth = 1.6 }: GlyphProps) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none" as const,
  stroke: color,
  strokeWidth,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
});

/** haptic: a dot radiating two soft arcs */
export function GlyphHaptic(p: GlyphProps) {
  return (
    <svg {...g(p)}>
      <circle cx="12" cy="12" r="2.4" fill={p.color ?? "currentColor"} stroke="none" />
      <path d="M6.8 8.2a6.4 6.4 0 0 0 0 7.6" />
      <path d="M17.2 8.2a6.4 6.4 0 0 1 0 7.6" />
      <path d="M4 5.6a10.4 10.4 0 0 0 0 12.8" opacity="0.45" />
      <path d="M20 5.6a10.4 10.4 0 0 1 0 12.8" opacity="0.45" />
    </svg>
  );
}

/** sound: a quiet sine drifting upward */
export function GlyphSound(p: GlyphProps) {
  return (
    <svg {...g(p)}>
      <path d="M3 14.5c2.2 0 2.2-5 4.5-5s2.3 5 4.5 5 2.3-5 4.5-5 2.3 5 4.5 5" />
      <path d="M3 9.5c2.2 0 2.2-3 4.5-3" opacity="0.4" />
    </svg>
  );
}

/** light: a horizon sun, half-risen */
export function GlyphLight(p: GlyphProps) {
  return (
    <svg {...g(p)}>
      <path d="M7 15a5 5 0 0 1 10 0" />
      <path d="M3.5 15h17" />
      <path d="M12 5.5v2M5.6 8l1.4 1.4M18.4 8 17 9.4" opacity="0.7" />
    </svg>
  );
}

/** Today tab: the Horizon arc with the two markers */
export function GlyphToday(p: GlyphProps) {
  return (
    <svg {...g(p)}>
      <path d="M3 16c2.5-6 6-9 9-9s6.5 3 9 9" />
      <circle cx="9.4" cy="9.9" r="1.9" fill={p.color ?? "currentColor"} stroke="none" />
      <circle cx="15" cy="8.7" r="1.9" />
    </svg>
  );
}

/** Focus tab: a breathing ring with an intent dot */
export function GlyphFocus(p: GlyphProps) {
  return (
    <svg {...g(p)}>
      <circle cx="12" cy="12" r="7.5" />
      <circle cx="12" cy="12" r="2" fill={p.color ?? "currentColor"} stroke="none" />
    </svg>
  );
}

/** Insights tab: a drift line above its typical band */
export function GlyphInsights(p: GlyphProps) {
  return (
    <svg {...g(p)}>
      <path d="M3.5 14.5c2.6-1.4 4-4.5 6.2-4.5 2.4 0 3 3.4 5.2 3.4 1.8 0 3-1.7 5.6-2.2" />
      <path d="M3.5 18h17" opacity="0.35" />
    </svg>
  );
}

/** Settings tab: two calm sliders */
export function GlyphSettings(p: GlyphProps) {
  return (
    <svg {...g(p)}>
      <path d="M4 9h16M4 15h16" opacity="0.5" />
      <circle cx="9.5" cy="9" r="2.4" fill="var(--cw-wash, #fff)" />
      <circle cx="14.5" cy="15" r="2.4" fill="var(--cw-wash, #fff)" />
    </svg>
  );
}

/** small plus for anchors */
export function GlyphPlus(p: GlyphProps) {
  return (
    <svg {...g(p)}>
      <path d="M12 6v12M6 12h12" />
    </svg>
  );
}

/** demo-time hourglass-ish mark (frame chrome only) */
export function GlyphDemoTime(p: GlyphProps) {
  return (
    <svg {...g(p)}>
      <path d="M7 4h10M7 20h10M8 4c0 4 8 4 8 8s-8 4-8 8M16 4c0 4-8 4-8 8s8 4 8 8" />
    </svg>
  );
}

/* ── primitives ── */
export function Button({
  variant = "primary",
  block,
  children,
  style,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "quiet";
  block?: boolean;
}) {
  return (
    <button
      className={`cw-btn cw-btn-${variant}${block ? " cw-btn-block" : ""}`}
      style={style}
      {...rest}
    >
      {children}
    </button>
  );
}

export function Card({ children, style, className }: { children: ReactNode; style?: CSSProperties; className?: string }) {
  return (
    <div className={`cw-card${className ? " " + className : ""}`} style={style}>
      {children}
    </div>
  );
}

export function Dots({ total, current }: { total: number; current: number }) {
  return (
    <div className="cw-dots" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={current + 1} aria-label={`Step ${current + 1} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`cw-dot${i < current ? " cw-done" : ""}${i === current ? " cw-now" : ""}`} />
      ))}
    </div>
  );
}

export function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      className="cw-switch"
      role="switch"
      aria-checked={on}
      aria-label={label}
      onClick={() => onChange(!on)}
    />
  );
}

/* time formatting helpers — always tabular in markup via .cw-num */
export function fmtClock(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = String(Math.round(m % 60)).padStart(2, "0");
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${mm}`;
}
export function fmtAmPm(min: number): string {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return m < 720 ? "am" : "pm";
}
export function fmtDur(min: number): string {
  const m = Math.max(0, Math.round(min));
  if (m < 60) return `${m} m`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r ? `${h} h ${r.toString().padStart(2, "0")} m` : `${h} h`;
}
export const minutesOf = (d: Date) => d.getHours() * 60 + d.getMinutes() + d.getSeconds() / 60;
