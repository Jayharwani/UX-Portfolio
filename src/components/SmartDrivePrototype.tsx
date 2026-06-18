import { motion, useReducedMotion } from "motion/react";
import { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  ChevronRight,
  ChevronLeft,
  Car,
  Sparkles,
  Bell,
  BellOff,
  MessageSquare,
  Clock,
  BarChart3,
  Navigation,
  Plus,
  Check,
  Play,
  Pause,
  RotateCcw,
  Power,
} from "lucide-react";

/* ──────────────────────────────────────────────────────────────────────────
   SmartDrive AI — interactive prototype · Design Spec v2
   A calm Settings feature. White surface, one Twilight accent, a single
   breathing status-hero with a horizon, and a low-glare driving overlay.
   v2 discipline: light type, single-line labels, monochrome line icons,
   generous air, master toggle inside the hero, specified motion.
   ────────────────────────────────────────────────────────────────────────── */

/* ── 2.1 / 2.4 tokens ────────────────────────────────────────────────────── */
const C = {
  canvas: "#F6F7F9",
  surface: "#FFFFFF",
  press: "#F1F2F5",
  hairline: "#ECEEF1",
  ink900: "#15171E",
  ink600: "#5B6170",
  ink400: "#9CA2AE",
  tw50: "#EEF0FE",
  tw400: "#6E78F2",
  tw500: "#4B57EE",
  tw600: "#3A45DE",
  twInk: "#0E1422",
  signal: "#12B981",
  signalTint: "#E7F7F1",
  alert: "#F0544F",
  alertTint: "#FDECEB",
  toggleOff: "#D7DAE2",
};
const FONT = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

/* ── 2.5 motion ──────────────────────────────────────────────────────────── */
const SPRING = {
  snappy: { type: "spring" as const, stiffness: 320, damping: 26, mass: 1 },
  soft: { type: "spring" as const, stiffness: 180, damping: 22, mass: 1 },
};
const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;
const EASE_ENTER = [0, 0, 0.2, 1] as const;

const RADIUS = { card: 20, hero: 24, sheet: 28, control: 14 };
const INSET = 20;
const ROW_H = 56;

const HOURS_LEFT = 28;
const LEARN_PCT = 58;

type Mode = "off" | "standby" | "learning" | "driving";

/* section cascade-in (one card animates as a unit; safe + visible) */
const sectionMotion = (idx: number, reduce: boolean | null) =>
  reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.16, delay: idx * 0.04 } }
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.36, ease: EASE_ENTER, delay: 0.04 + idx * 0.07 },
      };

/* ════════════════════════════════════════════════════════════════════════
   PRIMITIVES
   ════════════════════════════════════════════════════════════════════════ */
function StatusBar({ tint = C.ink900 }: { tint?: string }) {
  return (
    <div className="flex items-center justify-between px-6 pt-3 pb-1 select-none" style={{ fontFamily: FONT }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: tint, fontVariantNumeric: "tabular-nums" }}>9:41</span>
      <div className="flex items-center gap-1.5" style={{ color: tint }}>
        <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={i * 4.4} y={8 - i * 2.4} width="3" height={3 + i * 2.4} rx="0.7" fill="currentColor" />
          ))}
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 12" fill="none">
          <path d="M8 10.2l2.1-2.6a3.3 3.3 0 00-4.2 0L8 10.2zM8 5.4a6.6 6.6 0 014.8 2.1l1.6-2A9.2 9.2 0 008 2.8 9.2 9.2 0 001.6 5.5l1.6 2A6.6 6.6 0 018 5.4z" fill="currentColor" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.6" y="0.6" width="21" height="10.8" rx="2.8" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2.2" y="2.2" width="16" height="7.6" rx="1.6" fill="currentColor" />
          <rect x="23" y="4" width="1.6" height="4" rx="0.8" fill="currentColor" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

function NavBar({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <div
      className="relative flex items-center justify-center flex-shrink-0"
      style={{ height: 48, background: "rgba(246,247,249,0.86)", backdropFilter: "blur(10px)" }}
    >
      {onBack && (
        <button onClick={onBack} className="absolute flex items-center" style={{ left: 8, color: C.tw500, background: "none", border: "none", cursor: "pointer" }}>
          <ChevronLeft size={27} strokeWidth={2} />
          <span style={{ fontSize: 16, marginLeft: -2 }}>Back</span>
        </button>
      )}
      <span style={{ fontSize: 18, fontWeight: 600, color: C.ink900, letterSpacing: "-0.01em" }}>{title}</span>
    </div>
  );
}

type IconType = typeof Car;

function Section({
  header,
  footer,
  idx = 0,
  reduce,
  children,
}: {
  header?: string;
  footer?: React.ReactNode;
  idx?: number;
  reduce: boolean | null;
  children: React.ReactNode;
}) {
  return (
    <motion.div {...sectionMotion(idx, reduce)} style={{ flexShrink: 0 }}>
      {header && (
        <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", color: C.ink400, textTransform: "uppercase", margin: `0 0 10px ${INSET}px` }}>
          {header}
        </p>
      )}
      <div style={{ background: C.surface, borderRadius: RADIUS.card, overflow: "hidden" }}>{children}</div>
      {footer && <p style={{ fontSize: 13, lineHeight: "18px", color: C.ink400, margin: `10px ${INSET}px 0` }}>{footer}</p>}
    </motion.div>
  );
}

/* Row — the atom. Single line, 56 tall, monochrome icon, label 16/500. */
function Row({
  icon: Icon,
  label,
  value,
  subtitle,
  trailing,
  onClick,
  last,
  disabled,
  accent,
}: {
  icon?: IconType;
  label: string;
  value?: string | number;
  subtitle?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
  last?: boolean;
  disabled?: boolean;
  accent?: boolean;
}) {
  const [pressed, setPressed] = useState(false);
  const tall = !!subtitle;
  const interactive = !!onClick && !disabled;
  return (
    <motion.div
      onClick={interactive ? onClick : undefined}
      onPointerDown={() => interactive && setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      animate={{ scale: pressed ? 0.985 : 1 }}
      transition={SPRING.snappy}
      style={{
        display: "flex",
        alignItems: "center",
        paddingLeft: INSET,
        background: pressed ? C.press : "transparent",
        opacity: disabled ? 0.4 : 1,
        cursor: interactive ? "pointer" : "default",
      }}
    >
      {Icon && <Icon size={20} color={accent ? C.tw500 : C.ink400} strokeWidth={1.75} style={{ flexShrink: 0, marginRight: 14 }} />}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
          minHeight: tall ? 64 : ROW_H,
          paddingRight: INSET,
          borderBottom: last ? "none" : `1px solid ${C.hairline}`,
        }}
      >
        {/* label never shrinks → never truncates (spec rule); value yields instead */}
        <div style={{ flexShrink: 0, minWidth: 0 }}>
          <p style={{ fontSize: 16, lineHeight: "20px", fontWeight: 500, color: accent ? C.tw500 : C.ink900, whiteSpace: "nowrap" }}>
            {label}
          </p>
          {subtitle && <p style={{ fontSize: 13, lineHeight: "17px", color: C.ink400, marginTop: 2, whiteSpace: "nowrap" }}>{subtitle}</p>}
        </div>
        <div style={{ flex: 1, minWidth: 12 }} />
        {value != null && (
          <span style={{ fontSize: 15, color: C.ink400, marginRight: trailing ? 8 : 0, fontVariantNumeric: "tabular-nums", flexShrink: 1, minWidth: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "right" }}>{value}</span>
        )}
        {trailing}
      </div>
    </motion.div>
  );
}

const Chevron = () => <ChevronRight size={16} color={C.ink400} strokeWidth={2.2} style={{ flexShrink: 0 }} />;

function Toggle({ on, onChange, disabled }: { on: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (!disabled) onChange(!on);
      }}
      style={{
        width: 51,
        height: 31,
        borderRadius: 999,
        background: on ? C.tw500 : C.toggleOff,
        position: "relative",
        flexShrink: 0,
        border: "none",
        transition: "background 160ms",
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "default" : "pointer",
      }}
      aria-pressed={on}
    >
      <motion.span
        style={{ position: "absolute", top: 2, width: 27, height: 27, borderRadius: 999, background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.18)" }}
        animate={{ left: on ? 22 : 2 }}
        transition={SPRING.snappy}
      />
    </button>
  );
}

function Segmented({ options, value, onChange }: { options: string[]; value: number; onChange: (i: number) => void }) {
  const n = options.length;
  return (
    <div style={{ position: "relative", display: "flex", padding: 3, background: C.press, borderRadius: RADIUS.control }}>
      <motion.div
        style={{ position: "absolute", top: 3, bottom: 3, width: `calc(${100 / n}% - 4px)`, background: C.surface, borderRadius: RADIUS.control - 3, boxShadow: "0 1px 3px rgba(21,23,30,0.1)" }}
        animate={{ left: `calc(${(value * 100) / n}% + 2px)` }}
        transition={SPRING.snappy}
      />
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onChange(i)}
          style={{ position: "relative", zIndex: 1, flex: 1, padding: "8px 0", fontSize: 14, fontWeight: value === i ? 500 : 400, color: value === i ? C.ink900 : C.ink400, background: "transparent", border: "none", cursor: "pointer" }}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function Btn({ children, onClick, variant = "primary" }: { children: React.ReactNode; onClick?: () => void; variant?: "primary" | "text" }) {
  if (variant === "text") {
    return (
      <button onClick={onClick} style={{ width: "100%", minHeight: 48, color: C.tw500, fontSize: 16, fontWeight: 500, background: "none", border: "none", cursor: "pointer", fontFamily: FONT }}>
        {children}
      </button>
    );
  }
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      style={{ width: "100%", minHeight: 52, padding: "0 24px", borderRadius: RADIUS.control, background: C.tw500, color: "#fff", fontSize: 16, fontWeight: 600, border: "none", cursor: "pointer", fontFamily: FONT }}
    >
      {children}
    </motion.button>
  );
}

function Avatar({ initials, color = C.tw500 }: { initials: string; color?: string }) {
  return (
    <span style={{ width: 36, height: 36, borderRadius: 999, background: `${color}1A`, color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600, flexShrink: 0 }}>
      {initials}
    </span>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HERO (signature) — §4.2 · master toggle lives here
   ════════════════════════════════════════════════════════════════════════ */
function Hero({ mode, onToggle, onOpenDriving, reduce }: { mode: Mode; onToggle: (v: boolean) => void; onOpenDriving: () => void; reduce: boolean | null }) {
  const off = mode === "off";
  const standby = mode === "standby";
  const learning = mode === "learning";
  const driving = mode === "driving";

  const bg = off
    ? C.surface
    : standby
    ? `linear-gradient(165deg, ${C.tw50} 0%, ${C.surface} 78%)`
    : learning
    ? `linear-gradient(165deg, ${C.tw50} 0%, #F4F5FF 100%)`
    : `linear-gradient(165deg, #2C3470 0%, ${C.twInk} 100%)`;

  const word = off ? "Off" : standby ? "Standby" : learning ? "Learning" : "Driving";
  const support = off ? "Turn on to filter distractions" : standby ? "Turns on when you drive" : learning ? `About ${HOURS_LEFT} hours left` : "3 let through · tap to see";

  const wordCol = driving ? "#FFFFFF" : C.ink900;
  const supCol = driving ? "rgba(255,255,255,0.74)" : C.ink600;
  const orbCol = off ? C.ink400 : standby || learning ? C.tw500 : C.signal;

  return (
    <motion.div
      {...sectionMotion(0, reduce)}
      onClick={driving ? onOpenDriving : undefined}
      className="relative overflow-hidden"
      style={{ borderRadius: RADIUS.hero, height: 180, padding: 24, background: bg, boxShadow: "0 2px 8px rgba(21,23,30,0.04)", border: off ? `1px solid ${C.hairline}` : "1px solid transparent", flexShrink: 0, cursor: driving ? "pointer" : "default" }}
    >
      {/* top row: orb + master toggle */}
      <div className="relative flex items-center justify-between" style={{ zIndex: 2 }}>
        <motion.span
          style={{ width: 13, height: 13, borderRadius: 999, background: orbCol, boxShadow: off ? "none" : `0 0 14px ${orbCol}` }}
          animate={reduce || off || driving ? {} : standby ? { scale: [1, 1.12, 1], opacity: [0.85, 1, 0.85] } : { opacity: [1, 0.5, 1] }}
          transition={{ duration: standby ? 3.6 : 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <Toggle on={!off} onChange={onToggle} />
      </div>

      {/* state word + support, bottom-anchored */}
      <div className="absolute" style={{ left: 24, right: 24, bottom: 46, zIndex: 2 }}>
        <p style={{ fontSize: 30, lineHeight: "34px", fontWeight: 600, letterSpacing: "-0.02em", color: wordCol }}>{word}</p>
        <p style={{ fontSize: 15, lineHeight: "20px", color: supCol, marginTop: 4 }}>{support}</p>
        {off && (
          <button onClick={() => onToggle(true)} style={{ marginTop: 14, padding: "10px 22px", borderRadius: RADIUS.control, background: C.tw500, color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>
            Turn on
          </button>
        )}
      </div>

      {/* horizon */}
      {!off && (
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 26, height: 2, zIndex: 1 }}>
          <div style={{ position: "absolute", inset: 0, background: standby ? "rgba(110,120,242,0.4)" : learning ? "rgba(110,120,242,0.25)" : "transparent" }} />
          {learning && (
            <motion.div
              style={{ position: "absolute", left: 0, top: 0, height: "100%", background: C.tw500, boxShadow: `0 0 10px ${C.tw500}` }}
              initial={{ width: 0 }}
              animate={{ width: `${LEARN_PCT}%` }}
              transition={{ duration: reduce ? 0 : 1.3, ease: EASE_ENTER }}
            />
          )}
          {driving && <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, transparent, ${C.signal}, transparent)`, boxShadow: `0 0 22px ${C.signal}` }} />}
        </div>
      )}
      {driving && <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: `radial-gradient(120% 100% at 50% 100%, rgba(18,185,129,0.22), transparent 70%)`, zIndex: 1 }} />}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SCREEN FRAMES
   ════════════════════════════════════════════════════════════════════════ */
function DetailScreen({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.canvas, fontFamily: FONT }}>
      <StatusBar />
      <NavBar title={title} onBack={onBack} />
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: `20px ${INSET}px 36px`, display: "flex", flexDirection: "column", gap: 36 }}>
        {children}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   HUB — §4.1
   ════════════════════════════════════════════════════════════════════════ */
export function Hub({ mode, onToggle, onOpenDriving, push, reduce }: { mode: Mode; onToggle: (v: boolean) => void; onOpenDriving: () => void; push: (k: string) => void; reduce: boolean | null }) {
  const on = mode !== "off";
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: C.canvas, fontFamily: FONT }}>
      <StatusBar />
      <NavBar title="SmartDrive" />
      <div className="flex-1 overflow-y-auto no-scrollbar" style={{ padding: `20px ${INSET}px 36px`, display: "flex", flexDirection: "column", gap: 36 }}>
        <Hero mode={mode} onToggle={onToggle} onOpenDriving={onOpenDriving} reduce={reduce} />

        <Section header="Filtering" idx={1} reduce={reduce}>
          <Row icon={Sparkles} label="Learning" value={mode === "learning" ? `${HOURS_LEFT}h left` : "Complete"} trailing={<Chevron />} onClick={on ? () => push("learning") : undefined} disabled={!on} />
          <Row icon={Car} label="Detection" value="On" trailing={<Chevron />} onClick={on ? () => push("detection") : undefined} disabled={!on} />
          <Row icon={Bell} label="Let through" value="4 rules" trailing={<Chevron />} onClick={on ? () => push("through") : undefined} disabled={!on} />
          <Row icon={BellOff} label="Silenced" trailing={<Chevron />} onClick={on ? () => push("silenced") : undefined} disabled={!on} last />
        </Section>

        <Section header="Responses" idx={2} reduce={reduce}>
          <Row icon={MessageSquare} label="Auto-reply" value="On" trailing={<Chevron />} onClick={on ? () => push("autoreply") : undefined} disabled={!on} />
          <Row icon={Clock} label="Activation" value="Automatic" trailing={<Chevron />} onClick={on ? () => push("activation") : undefined} disabled={!on} last />
        </Section>

        <Section idx={3} reduce={reduce}>
          <Row icon={BarChart3} label="Activity" trailing={<Chevron />} onClick={on ? () => push("activity") : undefined} disabled={!on} last />
        </Section>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   DETAIL SCREENS
   ════════════════════════════════════════════════════════════════════════ */

/* §4.4 Let through */
export function ThroughScreen({ onBack, push, reduce }: { onBack: () => void; push: (k: string) => void; reduce: boolean | null }) {
  const [nav, setNav] = useState(true);
  const [fav, setFav] = useState(true);
  const [learned, setLearned] = useState([true, false]);
  return (
    <DetailScreen title="Let through" onBack={onBack}>
      <Section header="Always" idx={0} reduce={reduce}>
        <Row label="Emergency contacts" value="3" trailing={<Chevron />} onClick={() => push("emergency")} />
        <Row label="Repeat callers" value="On" trailing={<Chevron />} onClick={() => push("repeat")} />
        <Row label="Navigation" trailing={<Toggle on={nav} onChange={setNav} />} last />
      </Section>

      <Section header="Sometimes" idx={1} reduce={reduce}>
        <Row label="Favorites" trailing={<Toggle on={fav} onChange={setFav} />} />
        <Row label="Allowed apps" value="2" trailing={<Chevron />} onClick={() => push("apps")} last />
      </Section>

      <Section header="Learned" idx={2} reduce={reduce}>
        <LearnedRow name="Mom" reason="you always answer" allowed={learned[0]} onToggle={() => setLearned((l) => [!l[0], l[1]])} />
        <LearnedRow name="Work group" reason="you mute it" allowed={learned[1]} onToggle={() => setLearned((l) => [l[0], !l[1]])} last />
      </Section>
    </DetailScreen>
  );
}

function LearnedRow({ name, reason, allowed, onToggle, last }: { name: string; reason: string; allowed: boolean; onToggle: () => void; last?: boolean }) {
  return (
    <div onClick={onToggle} style={{ display: "flex", alignItems: "center", paddingLeft: INSET, cursor: "pointer" }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", minHeight: ROW_H, paddingRight: INSET, borderBottom: last ? "none" : `1px solid ${C.hairline}` }}>
        <p style={{ flex: 1, fontSize: 16, fontWeight: 500, color: C.ink900, whiteSpace: "nowrap" }}>
          {name} <span style={{ color: C.ink400, fontWeight: 400 }}>· {reason}</span>
        </p>
        <motion.span
          key={String(allowed)}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING.snappy}
          style={{ width: 26, height: 26, borderRadius: 999, display: "flex", alignItems: "center", justifyContent: "center", background: allowed ? C.signalTint : C.press, flexShrink: 0 }}
        >
          {allowed ? <Check size={15} color={C.signal} strokeWidth={3} /> : <X size={14} color={C.ink400} strokeWidth={3} />}
        </motion.span>
      </div>
    </div>
  );
}

/* §4.5 Emergency contacts */
function EmergencyScreen({ onBack, reduce }: { onBack: () => void; reduce: boolean | null }) {
  const people = [
    { name: "Mom", i: "M" },
    { name: "Alex", i: "A" },
    { name: "Dr. Reyes", i: "R" },
  ];
  return (
    <DetailScreen title="Emergency contacts" onBack={onBack}>
      <Section idx={0} reduce={reduce} footer="They always reach you — even on Do Not Disturb.">
        {people.map((p, i) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", paddingLeft: INSET }}>
            <Avatar initials={p.i} color={C.alert} />
            <div style={{ flex: 1, display: "flex", alignItems: "center", minHeight: 64, paddingLeft: 14, paddingRight: INSET, borderBottom: i === people.length - 1 ? "none" : `1px solid ${C.hairline}` }}>
              <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: C.ink900 }}>{p.name}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.signal, background: C.signalTint, padding: "4px 11px", borderRadius: 999 }}>Always</span>
            </div>
          </div>
        ))}
      </Section>
      <Section idx={1} reduce={reduce}>
        <Row icon={Plus} label="Add an emergency contact" accent last onClick={() => {}} />
      </Section>
    </DetailScreen>
  );
}

/* §4.5 Repeat callers */
function RepeatScreen({ onBack, reduce }: { onBack: () => void; reduce: boolean | null }) {
  const [on, setOn] = useState(true);
  const [win, setWin] = useState(0);
  return (
    <DetailScreen title="Repeat callers" onBack={onBack}>
      <Section idx={0} reduce={reduce}>
        <Row label="Repeat callers" trailing={<Toggle on={on} onChange={setOn} />} last />
      </Section>
      <Section header="Within" idx={1} reduce={reduce}>
        <div style={{ padding: 14 }}>
          <Segmented options={["2 min", "3 min", "5 min"]} value={win} onChange={setWin} />
        </div>
      </Section>
    </DetailScreen>
  );
}

/* §4.5 Allowed apps */
function AllowedAppsScreen({ onBack, reduce }: { onBack: () => void; reduce: boolean | null }) {
  const apps = [
    { label: "Maps", suggested: true, on: true },
    { label: "Waze", suggested: true, on: true },
    { label: "Messages", on: false },
    { label: "Phone", on: false },
    { label: "Spotify", on: false },
  ];
  const [on, setOn] = useState(apps.map((a) => a.on));
  return (
    <DetailScreen title="Allowed apps" onBack={onBack}>
      <Section idx={0} reduce={reduce}>
        {apps.map((a, i) => (
          <Row key={a.label} label={a.label} value={a.suggested ? "Suggested" : undefined} last={i === apps.length - 1} trailing={<Toggle on={on[i]} onChange={(v) => setOn((p) => p.map((x, j) => (j === i ? v : x)))} />} />
        ))}
      </Section>
    </DetailScreen>
  );
}

/* §4.6 Silenced */
function SilencedScreen({ onBack, reduce }: { onBack: () => void; reduce: boolean | null }) {
  const cats = ["Social", "News", "Shopping", "Games", "Everything else"];
  const [on, setOn] = useState([true, true, true, true, true]);
  const [summary, setSummary] = useState(true);
  return (
    <DetailScreen title="Silenced" onBack={onBack}>
      <Section header="Silence while driving" idx={0} reduce={reduce}>
        {cats.map((c, i) => (
          <Row key={c} label={c} last={i === cats.length - 1} trailing={<Toggle on={on[i]} onChange={(v) => setOn((p) => p.map((x, j) => (j === i ? v : x)))} />} />
        ))}
      </Section>
      <Section idx={1} reduce={reduce}>
        <Row label="Summary when I park" last trailing={<Toggle on={summary} onChange={setSummary} />} />
      </Section>
    </DetailScreen>
  );
}

/* §4.3 Detection */
function DetectionScreen({ onBack, reduce }: { onBack: () => void; reduce: boolean | null }) {
  const [m, setM] = useState(true);
  const [cp, setCp] = useState(true);
  const [bt, setBt] = useState(true);
  const [sens, setSens] = useState(1);
  return (
    <DetailScreen title="Detection" onBack={onBack}>
      <Section header="Detect with" idx={0} reduce={reduce}>
        <Row label="Motion & speed" trailing={<Toggle on={m} onChange={setM} />} />
        <Row label="CarPlay" trailing={<Toggle on={cp} onChange={setCp} />} />
        <Row label="Car Bluetooth" trailing={<Toggle on={bt} onChange={setBt} />} last />
      </Section>
      <Section header="Sensitivity" idx={1} reduce={reduce}>
        <div style={{ padding: 14 }}>
          <Segmented options={["Eager", "Balanced", "Relaxed"]} value={sens} onChange={setSens} />
        </div>
      </Section>
    </DetailScreen>
  );
}

/* §4.7 Auto-reply */
function AutoReplyScreen({ onBack, reduce }: { onBack: () => void; reduce: boolean | null }) {
  const [on, setOn] = useState(true);
  const [to, setTo] = useState(0);
  return (
    <DetailScreen title="Auto-reply" onBack={onBack}>
      <Section idx={0} reduce={reduce}>
        <Row label="Auto-reply to texts" last trailing={<Toggle on={on} onChange={setOn} />} />
      </Section>
      <Section header="Message" idx={1} reduce={reduce}>
        <div style={{ padding: 16 }}>
          <div style={{ background: C.tw50, borderRadius: 18, borderBottomLeftRadius: 4, padding: "12px 15px", maxWidth: "88%" }}>
            <p style={{ fontSize: 16, lineHeight: "22px", color: C.ink900 }}>Driving — I'll reply when I stop. Urgent? Call twice.</p>
          </div>
        </div>
      </Section>
      <Section header="Send to" idx={2} reduce={reduce}>
        <div style={{ padding: 14 }}>
          <Segmented options={["Everyone", "Favorites", "No one"]} value={to} onChange={setTo} />
        </div>
      </Section>
    </DetailScreen>
  );
}

/* §4.8 Activation */
function ActivationScreen({ onBack, reduce }: { onBack: () => void; reduce: boolean | null }) {
  const [sel, setSel] = useState(0);
  const opts = ["Automatic", "Automatic + schedule", "Manual only"];
  return (
    <DetailScreen title="Activation" onBack={onBack}>
      <Section idx={0} reduce={reduce}>
        {opts.map((o, i) => (
          <Row key={o} label={o} last={i === opts.length - 1} onClick={() => setSel(i)} trailing={sel === i ? <Check size={20} color={C.tw500} strokeWidth={2.4} /> : <span style={{ width: 20 }} />} />
        ))}
      </Section>
    </DetailScreen>
  );
}

/* §4.9 Learning */
export function LearningScreen({ onBack, reduce }: { onBack: () => void; reduce: boolean | null }) {
  const R = 50;
  const Circ = 2 * Math.PI * R;
  const noticed = ["You answer Mom every time", "You mute work chats", "Navigation stays visible"];
  return (
    <DetailScreen title="Learning" onBack={onBack}>
      <Section idx={0} reduce={reduce}>
        <div style={{ padding: "28px 20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ position: "relative", width: 136, height: 136 }}>
            <svg width="136" height="136" viewBox="0 0 136 136">
              <circle cx="68" cy="68" r={R} fill="none" stroke={C.hairline} strokeWidth="7" />
              <motion.circle
                cx="68"
                cy="68"
                r={R}
                fill="none"
                stroke={C.tw500}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={Circ}
                initial={{ strokeDashoffset: Circ }}
                animate={{ strokeDashoffset: Circ - (LEARN_PCT / 100) * Circ }}
                transition={{ duration: reduce ? 0 : 1.3, ease: EASE_ENTER }}
                transform="rotate(-90 68 68)"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span style={{ fontSize: 30, fontWeight: 700, color: C.ink900, fontVariantNumeric: "tabular-nums" }}>{LEARN_PCT}%</span>
            </div>
          </div>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.ink900, marginTop: 16 }}>Learning</p>
          <p style={{ fontSize: 15, color: C.ink400, marginTop: 2, fontVariantNumeric: "tabular-nums" }}>About {HOURS_LEFT} hours left</p>
        </div>
      </Section>
      <Section header="What I've noticed" idx={1} reduce={reduce}>
        {noticed.map((n, i) => (
          <Row key={n} label={n} last={i === noticed.length - 1} />
        ))}
      </Section>
      <Section idx={2} reduce={reduce}>
        <div style={{ padding: "4px 0" }}>
          <Btn variant="text" onClick={() => {}}>
            Restart learning
          </Btn>
        </div>
      </Section>
    </DetailScreen>
  );
}

/* §4.10 Activity */
function useCountUp(target: number, reduce: boolean | null, delay = 0) {
  const [v, setV] = useState(reduce ? target : 0);
  useEffect(() => {
    if (reduce) {
      setV(target);
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const begin = () => {
      const tick = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / 700, 1);
        const e = 1 - Math.pow(1 - p, 3);
        setV(Math.round(e * target));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const id = setTimeout(begin, delay);
    return () => {
      clearTimeout(id);
      cancelAnimationFrame(raf);
    };
  }, [target, reduce, delay]);
  return v;
}

function ActivityScreen({ onBack, reduce }: { onBack: () => void; reduce: boolean | null }) {
  const silenced = useCountUp(47, reduce, 0);
  const through = useCountUp(3, reduce, 80);
  const mins = useCountUp(22, reduce, 160);
  const stats = [
    { v: silenced, l: "distractions silenced" },
    { v: through, l: "things let through" },
    { v: `${mins}m`, l: "focused driving" },
  ];
  const log = [
    { i: "M", c: C.alert, who: "Mom · 2 calls", t: "9:14", nav: false },
    { i: "", c: C.tw500, who: "Navigation", t: "9:31", nav: true },
    { i: "A", c: C.alert, who: "Alex · emergency", t: "5:02", nav: false },
  ];
  return (
    <DetailScreen title="Activity" onBack={onBack}>
      <Section header="Today" idx={0} reduce={reduce}>
        <div style={{ padding: `4px ${INSET}px` }}>
          {stats.map((s, i) => (
            <div key={s.l} style={{ display: "flex", alignItems: "baseline", gap: 14, padding: "14px 0", borderBottom: i === stats.length - 1 ? "none" : `1px solid ${C.hairline}` }}>
              <span style={{ fontSize: 32, lineHeight: "36px", fontWeight: 700, color: C.ink900, fontVariantNumeric: "tabular-nums", minWidth: 58, letterSpacing: "-0.02em" }}>{s.v}</span>
              <span style={{ fontSize: 16, color: C.ink600 }}>{s.l}</span>
            </div>
          ))}
        </div>
      </Section>
      <Section header="Let through today" idx={1} reduce={reduce}>
        {log.map((r, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", paddingLeft: INSET }}>
            {r.nav ? <Navigation size={20} color={C.tw500} strokeWidth={1.75} style={{ flexShrink: 0 }} /> : <Avatar initials={r.i} color={r.c} />}
            <div style={{ flex: 1, display: "flex", alignItems: "center", minHeight: ROW_H, paddingLeft: 14, paddingRight: INSET, borderBottom: i === log.length - 1 ? "none" : `1px solid ${C.hairline}` }}>
              <span style={{ flex: 1, fontSize: 16, fontWeight: 500, color: C.ink900 }}>{r.who}</span>
              <span style={{ fontSize: 15, color: C.ink400, fontVariantNumeric: "tabular-nums" }}>{r.t}</span>
            </div>
          </div>
        ))}
      </Section>
    </DetailScreen>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   FIRST-RUN SHEETS — §4.3
   ════════════════════════════════════════════════════════════════════════ */
function FirstRunSheet({ step, setStep, onFinish, onClose, reduce }: { step: number; setStep: (n: number) => void; onFinish: () => void; onClose: () => void; reduce: boolean | null }) {
  return (
    <motion.div key={step} initial={{ opacity: 0, y: reduce ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24, ease: EASE_STANDARD }} style={{ padding: "10px 24px 28px", fontFamily: FONT }}>
      {step === 0 && (
        <>
          <h2 style={{ fontSize: 24, lineHeight: "30px", fontWeight: 600, letterSpacing: "-0.01em", color: C.ink900, marginBottom: 22 }}>Drive without the noise</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 20 }}>
            {[
              { icon: Car, t: "Turns on when you drive" },
              { icon: BellOff, t: "Silences what can wait" },
              { icon: Bell, t: "Lets urgent things through" },
            ].map((r, i) => {
              const Ic = r.icon;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <Ic size={22} color={C.tw500} strokeWidth={1.75} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 16, color: C.ink900 }}>{r.t}</span>
                </div>
              );
            })}
          </div>
          <p style={{ fontSize: 13, color: C.ink400, marginBottom: 22 }}>Learns what matters in about two days.</p>
          <Btn onClick={() => setStep(1)}>Get started</Btn>
          <div style={{ marginTop: 6 }}>
            <Btn variant="text" onClick={onClose}>
              Not now
            </Btn>
          </div>
        </>
      )}

      {step === 1 && (
        <>
          <h2 style={{ fontSize: 24, lineHeight: "30px", fontWeight: 600, color: C.ink900, marginBottom: 18 }}>A few permissions</h2>
          <div style={{ background: C.surface, borderRadius: RADIUS.card, border: `1px solid ${C.hairline}`, overflow: "hidden", marginBottom: 14 }}>
            <PermRow label="Motion" why="Detect driving" />
            <PermRow label="Notifications" why="Silence & allow" />
            <PermRow label="Location" why="Detect trips" />
            <PermRow label="Bluetooth" why="Detect your car" last />
          </div>
          <p style={{ fontSize: 13, color: C.ink400, marginBottom: 18 }}>Nothing leaves your phone.</p>
          <Btn onClick={() => setStep(2)}>Continue</Btn>
        </>
      )}

      {step === 2 && (
        <>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 20 }}>
            <div style={{ position: "relative", width: 92, height: 92, marginBottom: 18 }}>
              <svg width="92" height="92" viewBox="0 0 92 92">
                <circle cx="46" cy="46" r="40" fill="none" stroke={C.hairline} strokeWidth="6" />
                <circle cx="46" cy="46" r="40" fill="none" stroke={C.tw400} strokeWidth="6" strokeLinecap="round" strokeDasharray={2 * Math.PI * 40} strokeDashoffset={2 * Math.PI * 40 * 0.98} transform="rotate(-90 46 46)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={26} color={C.tw500} />
              </div>
            </div>
            <h2 style={{ fontSize: 24, lineHeight: "30px", fontWeight: 600, color: C.ink900 }}>I'll start learning</h2>
          </div>
          <p style={{ fontSize: 16, lineHeight: "22px", color: C.ink600, marginBottom: 22, textAlign: "center" }}>Drive normally for two days. I'll learn what matters.</p>
          <Btn onClick={onFinish}>Start</Btn>
        </>
      )}
    </motion.div>
  );
}

function PermRow({ label, why, last }: { label: string; why: string; last?: boolean }) {
  const [granted, setGranted] = useState(false);
  return (
    <div style={{ display: "flex", alignItems: "center", paddingLeft: INSET }}>
      <div style={{ flex: 1, display: "flex", alignItems: "center", minHeight: 58, paddingRight: INSET, borderBottom: last ? "none" : `1px solid ${C.hairline}` }}>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 500, color: C.ink900 }}>{label}</p>
          <p style={{ fontSize: 13, color: C.ink400, marginTop: 1 }}>{why}</p>
        </div>
        {granted ? (
          <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={SPRING.snappy} style={{ width: 24, height: 24, borderRadius: 999, background: C.signalTint, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Check size={14} color={C.signal} strokeWidth={3} />
          </motion.span>
        ) : (
          <button onClick={() => setGranted(true)} style={{ fontSize: 15, fontWeight: 500, color: C.tw500, background: "none", border: "none", cursor: "pointer" }}>
            Allow
          </button>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   DRIVING OVERLAY (§4.11) + BREAKTHROUGH (§4.12)
   ════════════════════════════════════════════════════════════════════════ */
function Breakthrough() {
  return (
    <motion.div
      className="absolute"
      style={{ left: 16, right: 16, top: 60, borderRadius: 20, background: "#fff", boxShadow: "0 12px 32px rgba(21,23,30,0.34)", padding: 16, outline: `1.5px solid rgba(18,185,129,0.5)` }}
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={SPRING.soft}
    >
      <div className="flex items-center gap-3">
        <Avatar initials="M" color={C.signal} />
        <div className="flex-1">
          <p style={{ fontSize: 16, fontWeight: 600, color: C.ink900 }}>Mom is calling</p>
          <p style={{ fontSize: 13, color: C.signal }}>Second call</p>
        </div>
      </div>
      <div className="flex gap-2" style={{ marginTop: 12 }}>
        <button style={{ flex: 1, padding: "12px", borderRadius: 12, background: C.signal, color: "#fff", fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>Answer</button>
        <button style={{ flex: 1, padding: "12px", borderRadius: 12, background: C.press, color: C.ink600, fontSize: 15, fontWeight: 600, border: "none", cursor: "pointer" }}>Decline</button>
      </div>
    </motion.div>
  );
}

export function DrivingOverlay({ open, onEnd, onClosed, reduce }: { open: boolean; onEnd: () => void; onClosed: () => void; reduce: boolean | null }) {
  const [bt, setBt] = useState(reduce ? true : false);
  useEffect(() => {
    if (reduce) return;
    const t = setTimeout(() => setBt(true), 2400);
    return () => clearTimeout(t);
  }, [reduce]);
  return (
    <motion.div
      className="absolute inset-0 flex flex-col"
      style={{ background: `linear-gradient(180deg, #1C2350 0%, ${C.twInk} 56%)`, fontFamily: FONT, pointerEvents: open ? "auto" : "none" }}
      initial={{ y: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
      animate={{ y: open ? 0 : reduce ? 0 : "100%", opacity: open ? 1 : reduce ? 0 : 1 }}
      transition={reduce ? { duration: 0.14 } : SPRING.soft}
      onAnimationComplete={() => {
        if (!open) onClosed();
      }}
    >
      <StatusBar tint="#FFFFFF" />
      <div className="flex-1 flex flex-col items-center justify-center text-center" style={{ padding: "0 40px" }}>
        <motion.span
          style={{ width: 14, height: 14, borderRadius: 999, background: C.signal, boxShadow: `0 0 18px ${C.signal}` }}
          animate={reduce ? {} : { opacity: [1, 0.7, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <p style={{ marginTop: 28, fontSize: 26, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>Driving</p>
        <p style={{ marginTop: 10, fontSize: 17, lineHeight: "23px", color: "rgba(255,255,255,0.74)", maxWidth: 250 }}>Distractions silenced. I'll let urgent things through.</p>
      </div>
      <div style={{ position: "relative", height: 2, background: `linear-gradient(90deg, transparent, ${C.signal}, transparent)`, boxShadow: `0 0 26px ${C.signal}` }} />
      <div className="flex items-center justify-between" style={{ padding: "0 24px", height: 104 }}>
        <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 16 }}>
          <b style={{ color: "#fff", fontVariantNumeric: "tabular-nums" }}>3</b> let through
        </span>
        <button onClick={onEnd} style={{ color: "#fff", fontSize: 16, fontWeight: 600, padding: "16px 22px", borderRadius: 14, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.16)", cursor: "pointer", minHeight: 64 }}>
          End driving mode
        </button>
      </div>
      {open && bt && <Breakthrough />}
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   SHELL — overlay modal, device frame, state machine, chrome
   ════════════════════════════════════════════════════════════════════════ */
const SCENARIOS: { key: Mode; label: string }[] = [
  { key: "off", label: "Off" },
  { key: "standby", label: "Standby" },
  { key: "learning", label: "Learning" },
  { key: "driving", label: "Driving" },
];
const TOUR_ORDER: Mode[] = ["standby", "learning", "driving"];
const TOUR_MS = 3600;

const DETAIL_TITLES: Record<string, string> = {
  learning: "Learning",
  detection: "Detection",
  through: "Let through",
  silenced: "Silenced",
  autoreply: "Auto-reply",
  activation: "Activation",
  activity: "Activity",
  emergency: "Emergency contacts",
  repeat: "Repeat callers",
  apps: "Allowed apps",
};

export function SmartDrivePrototype({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  const [mode, setMode] = useState<Mode>("off");
  const [firstRunDone, setFirstRunDone] = useState(false);
  const [stack, setStack] = useState<{ key: string; id: number; exiting: boolean }[]>([]);
  const idRef = useRef(0);
  const [firstRunStep, setFirstRunStep] = useState<number | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [ovMounted, setOvMounted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const screenWrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.78);

  useEffect(() => {
    if (open) {
      setMounted(true);
      setMode("off");
      setFirstRunDone(false);
      setStack([]);
      setFirstRunStep(null);
      setSheetOpen(false);
      setOverlayOpen(false);
      setPlaying(false);
      return;
    }
    if (!mounted) return;
    const t = setTimeout(() => setMounted(false), 280);
    return () => clearTimeout(t);
  }, [open, mounted]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  /* scale the logical 390×844 screen to fit the rendered device (clamp to
     both axes so content never clips; re-measure after layout settles) */
  useEffect(() => {
    if (!mounted) return;
    const el = screenWrapRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      if (w && h) setScale(Math.min(w / 390, h / 844));
    };
    update();
    const raf = requestAnimationFrame(update);
    const t = window.setTimeout(update, 280);
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
      ro.disconnect();
    };
  }, [mounted]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (overlayOpen) {
      setOvMounted(true);
      return;
    }
    if (!ovMounted) return;
    const t = setTimeout(() => setOvMounted(false), 900);
    return () => clearTimeout(t);
  }, [overlayOpen, ovMounted]);

  useEffect(() => {
    if (!open || !playing) return;
    const t = setTimeout(() => {
      setMode((m) => {
        const idx = TOUR_ORDER.indexOf(m as Mode);
        return TOUR_ORDER[(idx + 1) % TOUR_ORDER.length];
      });
    }, TOUR_MS);
    return () => clearTimeout(t);
  }, [open, playing, mode]);

  const push = useCallback((k: string) => {
    setStack((s) => [...s, { key: k, id: ++idRef.current, exiting: false }]);
  }, []);
  const pop = useCallback(() => {
    setStack((prev) => {
      if (!prev.length) return prev;
      const top = prev[prev.length - 1];
      if (top.exiting) return prev;
      window.setTimeout(() => setStack((cur) => cur.filter((it) => it.id !== top.id)), 260);
      return prev.map((it) => (it.id === top.id ? { ...it, exiting: true } : it));
    });
  }, []);

  const handleToggle = useCallback(
    (v: boolean) => {
      if (v) {
        if (!firstRunDone) {
          setFirstRunStep(0);
          setSheetOpen(true);
        } else {
          setMode("standby");
        }
      } else {
        setMode("off");
      }
    },
    [firstRunDone]
  );

  const finishFirstRun = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => setFirstRunStep(null), 320);
    setFirstRunDone(true);
    setMode("learning");
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
    setTimeout(() => setFirstRunStep(null), 320);
  }, []);

  const setScenario = useCallback((m: Mode) => {
    setPlaying(false);
    setStack([]);
    setSheetOpen(false);
    setFirstRunStep(null);
    setMode(m);
    setFirstRunDone(m !== "off");
    setOverlayOpen(m === "driving");
  }, []);

  const openDriving = useCallback(() => {
    setMode("driving");
    setFirstRunDone(true);
    setOverlayOpen(true);
  }, []);

  const endDriving = useCallback(() => {
    setOverlayOpen(false);
    setMode("standby");
  }, []);

  if (!mounted) return null;

  const detailKey = stack.length ? stack[stack.length - 1].key : undefined;
  const ctxLabel = overlayOpen
    ? "Driving mode"
    : firstRunStep != null
    ? "First-run setup"
    : detailKey
    ? DETAIL_TITLES[detailKey]
    : `Hub · ${mode[0].toUpperCase()}${mode.slice(1)}`;

  return (
    <motion.div
      className="fixed inset-0 z-[120] flex flex-col items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      transition={{ duration: 0.25 }}
      style={{ fontFamily: FONT, pointerEvents: open ? "auto" : "none" }}
    >
      <div className="absolute inset-0" onClick={onClose} style={{ background: "rgba(8,10,16,0.82)", backdropFilter: "blur(14px)" }} />

      {/* chrome top */}
      <motion.div initial={{ y: -16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }} className="relative z-10 w-full max-w-5xl px-5 sm:px-8 pt-5 sm:pt-7 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span style={{ width: 34, height: 34, borderRadius: 10, background: C.tw500, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Car size={19} color="#fff" strokeWidth={2} />
          </span>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>SmartDrive AI</p>
            <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}>Interactive prototype · built in code</p>
          </div>
        </div>
        <button onClick={onClose} className="flex items-center justify-center rounded-full" style={{ width: 38, height: 38, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.14)", color: "#fff", cursor: "pointer" }} aria-label="Close prototype">
          <X size={18} />
        </button>
      </motion.div>

      {/* device */}
      <div className="relative z-10 flex-1 w-full flex items-center justify-center px-4 min-h-0 py-3">
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 14 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ ...SPRING.soft, delay: 0.05 }}
          className="relative"
          style={{ height: "min(74vh, 680px)", aspectRatio: "390 / 844", borderRadius: 46, padding: 7, background: "linear-gradient(160deg, #2A2E38, #0B0D12)", boxShadow: "0 40px 90px -20px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.12)" }}
        >
          <div ref={screenWrapRef} className="relative w-full h-full overflow-hidden" style={{ borderRadius: 40, background: C.canvas }}>
            {/* logical 390×844 layer, scaled to fill the screen so content matches a real phone */}
            <div style={{ position: "absolute", top: 0, left: 0, width: 390, height: 844, transformOrigin: "top left", transform: `scale(${scale})` }}>
            <div className="absolute left-1/2 -translate-x-1/2 z-40 rounded-full" style={{ top: 13, width: 112, height: 31, background: "#05070B" }} />

            <Hub mode={mode} onToggle={handleToggle} onOpenDriving={openDriving} push={push} reduce={reduce} />

            {stack.map((item, i) => (
              <motion.div
                key={item.id}
                className="absolute inset-0"
                style={{ zIndex: 10 + i }}
                initial={{ x: reduce ? 0 : "100%", opacity: reduce ? 0 : 1 }}
                animate={{ x: item.exiting ? (reduce ? 0 : "100%") : 0, opacity: item.exiting && reduce ? 0 : 1 }}
                transition={reduce ? { duration: 0.14 } : { type: "spring", stiffness: 320, damping: 34 }}
              >
                {item.key === "through" && <ThroughScreen onBack={pop} push={push} reduce={reduce} />}
                {item.key === "emergency" && <EmergencyScreen onBack={pop} reduce={reduce} />}
                {item.key === "repeat" && <RepeatScreen onBack={pop} reduce={reduce} />}
                {item.key === "apps" && <AllowedAppsScreen onBack={pop} reduce={reduce} />}
                {item.key === "silenced" && <SilencedScreen onBack={pop} reduce={reduce} />}
                {item.key === "detection" && <DetectionScreen onBack={pop} reduce={reduce} />}
                {item.key === "autoreply" && <AutoReplyScreen onBack={pop} reduce={reduce} />}
                {item.key === "activation" && <ActivationScreen onBack={pop} reduce={reduce} />}
                {item.key === "learning" && <LearningScreen onBack={pop} reduce={reduce} />}
                {item.key === "activity" && <ActivityScreen onBack={pop} reduce={reduce} />}
              </motion.div>
            ))}

            {/* first-run sheet */}
            {firstRunStep != null && (
              <div className="absolute inset-0 z-50 flex flex-col justify-end" style={{ pointerEvents: sheetOpen ? "auto" : "none" }}>
                <motion.div className="absolute inset-0" onClick={closeSheet} initial={{ opacity: 0 }} animate={{ opacity: sheetOpen ? 1 : 0 }} transition={{ duration: 0.2 }} style={{ background: "rgba(14,20,34,0.34)" }} />
                <motion.div
                  className="relative no-scrollbar"
                  initial={{ y: "100%" }}
                  animate={{ y: sheetOpen ? 0 : "100%" }}
                  transition={SPRING.soft}
                  style={{ background: C.surface, borderTopLeftRadius: RADIUS.sheet, borderTopRightRadius: RADIUS.sheet, boxShadow: "0 -10px 44px rgba(21,23,30,0.14)", maxHeight: "90%", overflowY: "auto" }}
                >
                  <div style={{ display: "flex", justifyContent: "center", paddingTop: 10 }}>
                    <div style={{ width: 36, height: 4, borderRadius: 999, background: C.toggleOff }} />
                  </div>
                  <FirstRunSheet step={firstRunStep} setStep={setFirstRunStep} onFinish={finishFirstRun} onClose={closeSheet} reduce={reduce} />
                </motion.div>
              </div>
            )}

            {/* driving overlay */}
            {ovMounted && (
              <div className="absolute inset-0 z-[60]">
                <DrivingOverlay open={overlayOpen} onEnd={endDriving} onClosed={() => setOvMounted(false)} reduce={reduce} />
              </div>
            )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* chrome bottom */}
      <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="relative z-10 w-full max-w-md px-5 pb-6 sm:pb-8">
        <p style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8 }}>Preview state</p>
        <div className="flex items-center gap-1.5" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 14, padding: 4 }}>
          {SCENARIOS.map((s) => {
            const active = mode === s.key && !overlayOpen ? true : s.key === "driving" && overlayOpen;
            return (
              <button key={s.key} onClick={() => setScenario(s.key)} className="flex-1 rounded-[10px]" style={{ padding: "8px 0", fontSize: 12.5, fontWeight: 600, color: active ? "#fff" : "rgba(255,255,255,0.55)", background: active ? C.tw500 : "transparent", border: "none", cursor: "pointer" }}>
                {s.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3" style={{ marginTop: 12 }}>
          <button onClick={() => setScenario("off")} className="flex items-center justify-center rounded-full" style={{ width: 42, height: 42, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", cursor: "pointer" }} aria-label="Reset">
            <RotateCcw size={17} />
          </button>

          <div className="flex-1 flex flex-col items-center">
            <button
              onClick={() => {
                if (!playing) {
                  setStack([]);
                  setOverlayOpen(false);
                  setSheetOpen(false);
                  setFirstRunStep(null);
                  setFirstRunDone(true);
                  if (mode === "off" || mode === "driving") setMode("standby");
                }
                setPlaying((p) => !p);
              }}
              className="flex items-center gap-2 rounded-full"
              style={{ padding: "10px 20px", background: playing ? "rgba(255,255,255,0.1)" : C.tw500, border: playing ? "1px solid rgba(255,255,255,0.14)" : "none", color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              {playing ? <Pause size={16} /> : <Play size={16} />}
              {playing ? "Pause tour" : "Play tour"}
            </button>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 7 }}>{ctxLabel}</p>
          </div>

          <button onClick={() => (mode === "off" ? handleToggle(true) : openDriving())} className="flex items-center justify-center rounded-full" style={{ width: 42, height: 42, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", color: "#fff", cursor: "pointer" }} aria-label={mode === "off" ? "Turn on" : "Open driving mode"}>
            {mode === "off" ? <Power size={17} /> : <Car size={18} />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
