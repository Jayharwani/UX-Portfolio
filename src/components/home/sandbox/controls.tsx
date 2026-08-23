import { useState, useRef, type ReactNode } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   The component sandbox — six real controls.

   These replace twelve tool logos. A logo is a claim: it says someone owns a
   licence. A toggle that toggles is evidence. The argument the hero makes is
   "this person designs by building", and the cheapest way to stop asserting
   that in copy is to put working software in the fold and let a visitor find
   it.

   Rules that hold for all six:

   · Real semantics. <input type="range">, role="switch", role="radiogroup".
     Not divs with click handlers. This is what makes them keyboard operable
     and screen-reader legible, and it is also what makes them genuinely
     working rather than a simulation of working. The distinction survives
     inspection, which is the point: the audience for this includes people who
     will open devtools.

   · Portfolio tokens only. These are lifted from four different products —
     Headroom, Signal, Intent, ChronoWeave — and every one of those has its own
     brand colour. None of it comes along. Headroom's emerald sits nowhere near
     this palette's 264° hue, and importing it would read as a screenshot
     rather than as a system. Six controls from four products that look like
     one system is a design-systems argument made without a word of copy.

   · The grip. Each card carries ~15px of chrome around its control. The
     control captures pointer events; the chrome is the drag handle. That split
     is what lets the same object be both throwable and usable, and it is
     enforced here rather than in the physics layer so the components remain
     correct on their own.

   · No animated box-shadow, filter or backdrop-filter anywhere. Transitions
     ≤200ms on one curve.

   Built and verified standalone, before any physics. A card that tumbles
   beautifully but whose toggle does not toggle is worse than no card, because
   the entire argument rests on the controls being real.
   ────────────────────────────────────────────────────────────────────────── */

export const EASE_UI = "cubic-bezier(0.16, 1, 0.3, 1)";
const T = "160ms";

/* radius scale, §8 */
export const R = { sm: 6, md: 10, lg: 14, xl: 20 } as const;

/* ── the shared shell ──────────────────────────────────────────────────────
   Implied light from upper-left (§6.2): a 1px inset highlight on the TOP edge
   only. No bottom highlight. This single line is what stops a flat rectangle
   on a flat dark ground from reading as a hole and starts it reading as an
   object sitting on a surface. */
export function SandboxCard({
  label,
  from,
  width,
  children,
}: {
  label: string;
  from: string;
  width: number;
  children: ReactNode;
}) {
  return (
    <div
      className="sbx-card"
      style={{
        width,
        position: "relative", // the grip outline is an ::after on this box
        borderRadius: R.lg,
        background: "var(--surface)",
        border: "1px solid rgb(232 236 243 / 0.08)",
        boxShadow: "inset 0 1px 0 0 rgb(232 236 243 / 0.10)",
        padding: 15,
        userSelect: "none",
        transition: `border-color ${T} ${EASE_UI}, background-color ${T} ${EASE_UI}`,
      }}
    >
      {/* provenance, small enough to be texture rather than a caption */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 8.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--text-3)",
          marginBottom: 9,
          display: "flex",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span>{label}</span>
        <span style={{ opacity: 0.6 }}>{from}</span>
      </div>
      {/* the control surface: pointer events stop here so the physics layer
          above never sees a drag that began on a control */}
      <div data-control onPointerDown={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

/* ── 1. Safe to spend — Headroom ───────────────────────────────────────────
   The anchor. It is the largest card and it carries a number that visibly
   changes, which is the fastest available proof that something is live rather
   than rendered. A visitor who drags this once has answered the question the
   whole page exists to answer. */
export function SafeToSpendCard() {
  const [bills, setBills] = useState(770);
  const balance = 2500;
  const safe = balance - bills;
  return (
    <SandboxCard label="Safe to spend" from="Headroom" width={184}>
      <div
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: 30,
          lineHeight: 1,
          letterSpacing: "-0.03em",
          color: "var(--text)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        ${safe.toLocaleString()}
      </div>
      <label
        style={{
          display: "block",
          fontFamily: "var(--font-body)",
          fontSize: 11,
          color: "var(--text-2)",
          margin: "9px 0 7px",
        }}
      >
        Bills before payday
        <span style={{ float: "right", fontVariantNumeric: "tabular-nums" }}>${bills}</span>
      </label>
      <input
        type="range"
        min={0}
        max={1800}
        step={10}
        value={bills}
        onChange={(e) => setBills(+e.target.value)}
        aria-label="Bills due before the next payday"
        className="sbx-range"
      />
    </SandboxCard>
  );
}

/* ── 2. Fit status — Signal ────────────────────────────────────────────────
   Three states, cycled. Signal's own palette uses green for "open"; here the
   whole ladder is expressed in the portfolio's neutrals with the accent
   reserved for the resolved state, because the accent budget (§6.4) does not
   stretch to a traffic-light system. */
const FITS = [
  { key: "open", label: "Open", dot: "var(--accent)", border: "rgb(91 140 255 / 0.42)" },
  { key: "tight", label: "Tight", dot: "var(--text-2)", border: "rgb(232 236 243 / 0.18)" },
  { key: "conflict", label: "Conflict", dot: "var(--text-3)", border: "rgb(232 236 243 / 0.10)" },
] as const;

export function FitChipCard() {
  const [i, setI] = useState(0);
  const f = FITS[i];
  return (
    <SandboxCard label="Fit status" from="Signal" width={150}>
      <button
        type="button"
        onClick={() => setI((n) => (n + 1) % FITS.length)}
        aria-label={`Fit status: ${f.label}. Activate to cycle.`}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 13px",
          borderRadius: 999,
          background: "var(--surface-2)",
          border: `1px solid ${f.border}`,
          color: "var(--text)",
          fontFamily: "var(--font-body)",
          fontSize: 12.5,
          fontWeight: 500,
          cursor: "pointer",
          transition: `border-color ${T} ${EASE_UI}`,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: f.dot,
            transition: `background-color ${T} ${EASE_UI}`,
          }}
        />
        {f.label}
      </button>
    </SandboxCard>
  );
}

/* ── 3. Toggle — Bumper ───────────────────────────────────────────────────
   Relabelled from "System". A source label that reads SYSTEM carries no
   information sitting next to HEADROOM and SIGNAL, which do: it tells a
   reviewer the component came from nowhere in particular. Every card names
   a real project now, and if one genuinely had no home it would be cut
   rather than labelled generically.

   role="switch" rather than a checkbox, so assistive tech announces on/off
   rather than checked/unchecked. Space and Enter both operate it natively
   because it is a real button. */
export function ToggleCard() {
  const [on, setOn] = useState(true);
  return (
    <SandboxCard label="Toggle" from="Bumper" width={140}>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Demo toggle"
        onClick={() => setOn((v) => !v)}
        style={{
          width: 52,
          height: 30,
          borderRadius: 999,
          padding: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          background: on ? "var(--accent)" : "var(--surface-2)",
          border: `1px solid ${on ? "transparent" : "rgb(232 236 243 / 0.14)"}`,
          cursor: "pointer",
          transition: `background-color ${T} ${EASE_UI}`,
        }}
      >
        <span
          style={{
            width: 22,
            height: 22,
            borderRadius: 999,
            background: on ? "#0A0E16" : "var(--text-2)",
            transform: `translateX(${on ? 22 : 0}px)`,
            transition: `transform 200ms ${EASE_UI}, background-color ${T} ${EASE_UI}`,
          }}
        />
      </button>
    </SandboxCard>
  );
}

/* ── 4. Segmented control — Intent ─────────────────────────────────────────
   A real radiogroup. Arrow keys move between options natively once focus is
   inside, which is the behaviour a reviewer checks first and the reason this
   is not three buttons. */
const SEGMENTS = ["Day", "Week"] as const;

export function SegmentedCard() {
  const [sel, setSel] = useState(0);
  return (
    <SandboxCard label="Range" from="Intent" width={152}>
      <div
        role="radiogroup"
        aria-label="Time range"
        style={{
          position: "relative",
          display: "grid",
          gridTemplateColumns: `repeat(${SEGMENTS.length}, 1fr)`,
          background: "var(--surface-2)",
          borderRadius: R.md,
          padding: 3,
          border: "1px solid rgb(232 236 243 / 0.08)",
        }}
      >
        {/* the sliding indicator; transform only */}
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 3,
            left: 3,
            bottom: 3,
            width: `calc((100% - 6px) / ${SEGMENTS.length})`,
            borderRadius: R.sm,
            background: "var(--surface)",
            border: "1px solid rgb(232 236 243 / 0.10)",
            transform: `translateX(${sel * 100}%)`,
            transition: `transform 200ms ${EASE_UI}`,
          }}
        />
        {SEGMENTS.map((s, i) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={i === sel}
            tabIndex={i === sel ? 0 : -1}
            onClick={() => setSel(i)}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                e.preventDefault();
                setSel((n) => (n + 1) % SEGMENTS.length);
              }
              if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                e.preventDefault();
                setSel((n) => (n - 1 + SEGMENTS.length) % SEGMENTS.length);
              }
            }}
            style={{
              position: "relative",
              zIndex: 1,
              padding: "6px 0",
              background: "none",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-body)",
              fontSize: 12,
              fontWeight: 500,
              color: i === sel ? "var(--text)" : "var(--text-2)",
              transition: `color ${T} ${EASE_UI}`,
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </SandboxCard>
  );
}

/* ── 5. Stepper — ChronoWeave ──────────────────────────────────────────────
   The value rolls rather than swapping, which is the detail that makes a
   number feel mechanical rather than re-rendered. Two digits share a column
   and translate; no layout property animates. */
export function StepperCard() {
  const [v, setV] = useState(25);
  const prev = useRef(25);
  const dir = v >= prev.current ? 1 : -1;
  prev.current = v;
  const btn: React.CSSProperties = {
    width: 30,
    height: 30,
    borderRadius: R.sm,
    background: "var(--surface-2)",
    border: "1px solid rgb(232 236 243 / 0.10)",
    color: "var(--text)",
    fontFamily: "var(--font-body)",
    fontSize: 15,
    lineHeight: 1,
    cursor: "pointer",
    transition: `border-color ${T} ${EASE_UI}`,
  };
  return (
    <SandboxCard label="Focus block" from="ChronoWeave" width={158}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
        <button type="button" style={btn} aria-label="Decrease by five minutes" onClick={() => setV((n) => Math.max(5, n - 5))}>
          −
        </button>
        <div style={{ position: "relative", overflow: "hidden", height: 26, minWidth: 52, textAlign: "center" }}>
          <span
            key={v}
            className="sbx-roll"
            style={{
              display: "block",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: 20,
              lineHeight: "26px",
              color: "var(--text)",
              fontVariantNumeric: "tabular-nums",
              ["--roll-from" as string]: `${dir * 26}px`,
            }}
          >
            {v}m
          </span>
        </div>
        <button type="button" style={btn} aria-label="Increase by five minutes" onClick={() => setV((n) => Math.min(120, n + 5))}>
          +
        </button>
      </div>
    </SandboxCard>
  );
}

/* ── 6. Checkbox — Intent ─────────────────────────────────────────────────
   The check draws on over 240ms via stroke-dashoffset. It is the one place
   here that animates a paint property rather than a transform, and it is worth
   it: the path is 24px across, so the raster cost is trivial, and a check that
   draws is the difference between a control and a picture of one. */
export function CheckboxCard() {
  const [on, setOn] = useState(false);
  return (
    <SandboxCard label="Checkbox" from="Intent" width={132}>
      <button
        type="button"
        role="checkbox"
        aria-checked={on}
        aria-label="Demo checkbox"
        onClick={() => setOn((v) => !v)}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          fontSize: 12.5,
          color: "var(--text-2)",
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: R.sm,
            display: "grid",
            placeItems: "center",
            background: on ? "var(--accent)" : "var(--surface-2)",
            border: `1px solid ${on ? "transparent" : "rgb(232 236 243 / 0.14)"}`,
            transition: `background-color ${T} ${EASE_UI}`,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M2.5 7.4 5.6 10.4 11.5 3.9"
              fill="none"
              stroke="#0A0E16"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 16,
                strokeDashoffset: on ? 0 : 16,
                transition: `stroke-dashoffset 240ms ${EASE_UI}`,
              }}
            />
          </svg>
        </span>
        Done
      </button>
    </SandboxCard>
  );
}

export const SANDBOX = [
  { id: "safe", Component: SafeToSpendCard, project: "headroom" },
  { id: "fit", Component: FitChipCard, project: "signal" },
  { id: "toggle", Component: ToggleCard, project: "bumper" },
  { id: "segment", Component: SegmentedCard, project: "intent" },
  { id: "stepper", Component: StepperCard, project: "chronoweave" },
  { id: "check", Component: CheckboxCard, project: "intent" },
] as const;
