import { useRef } from "react";

/* --------------------------------------------------------------------------
   SPEC / SHIPPED.

   The stacked layout's way of doing what scroll does on a wide screen: a
   reader on a phone can put the frame back into its spec state and look at
   the measurements, as often as they like.

   role="group" with two aria-pressed buttons, not a radiogroup: these are two
   toggles over one object, and a screen reader saying "Shipped, pressed" is
   the state. Left and right move between them, which is what a reader who has
   met a segmented control anywhere else will try.
   -------------------------------------------------------------------------- */

export type FrameState = "spec" | "shipped";

const ORDER: FrameState[] = ["spec", "shipped"];

export function Segmented({
  value,
  onChange,
  label,
}: {
  value: FrameState;
  onChange: (v: FrameState) => void;
  /** names the thing being switched, since "Spec" alone says nothing */
  label: string;
}) {
  const root = useRef<HTMLDivElement>(null);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    /* step, not toggle: with two options both arrows land on the same place,
       but writing +1 for both was a typo waiting for a third state */
    const step = e.key === "ArrowRight" ? 1 : ORDER.length - 1;
    const next = ORDER[(ORDER.indexOf(value) + step) % ORDER.length];
    onChange(next);
    /* move focus with the selection, so the next arrow press continues from
       the control the reader is now on */
    root.current?.querySelector<HTMLButtonElement>(`[data-state="${next}"]`)?.focus();
  };

  return (
    <div
      className="seg"
      role="group"
      aria-label={label}
      ref={root}
      onKeyDown={onKey}
      data-value={value}
    >
      <i className="seg-thumb" aria-hidden="true" />
      {ORDER.map((s) => (
        <button
          key={s}
          type="button"
          data-state={s}
          aria-pressed={value === s}
          onClick={() => onChange(s)}
        >
          {s === "spec" ? "Spec" : "Shipped"}
        </button>
      ))}
    </div>
  );
}
