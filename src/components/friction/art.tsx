/* --------------------------------------------------------------------------
   DRAWN IN ONE HAND.

   Four lens marks and four people, built from the same parts: a 1.6 stroke,
   one radius, one internal rhythm, two tones per figure. Nothing here is
   from an icon set — a stock glyph next to a custom dot engine reads as a
   page assembled rather than designed, which is the thing this rebuild is
   trying to stop doing.

   Each lens owns a hue from the four-step cool arc, and that hue appears
   here and on the fan and nowhere else.
   -------------------------------------------------------------------------- */

export const LENSES = [
  { key: "build", title: "Build it", hue: "var(--lens-1)", who: "Designer" },
  { key: "start", title: "Start it", hue: "var(--lens-2)", who: "Founder" },
  { key: "study", title: "Study it", hue: "var(--lens-3)", who: "Researcher" },
  { key: "write", title: "Write it", hue: "var(--lens-4)", who: "Writer" },
] as const;

export type LensKey = (typeof LENSES)[number]["key"];

/** the four marks: a thing made, a thing started, a thing examined, a thing said */
export function LensMark({ kind, hue }: { kind: LensKey; hue: string }) {
  const common = {
    fill: "none",
    stroke: hue,
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" aria-hidden="true">
      {kind === "build" && (
        <>
          <rect x="6.5" y="12" width="21" height="15.5" rx="3" {...common} />
          <path d="M11 12V9.2a6 6 0 0 1 12 0V12" {...common} />
          <path d="M17 17.6v4.3" {...common} />
        </>
      )}
      {kind === "start" && (
        <>
          <path d="M6.5 26.5 13 16l5 5.4L27.5 7.5" {...common} />
          <path d="M22 7.5h5.5V13" {...common} />
          <circle cx="13" cy="16" r="1.7" fill={hue} stroke="none" />
        </>
      )}
      {kind === "study" && (
        <>
          <circle cx="15" cy="15" r="8.2" {...common} />
          <path d="m21.3 21.3 6 6" {...common} />
          <path d="M11.6 15.4h6.8M15 12v6.8" {...common} opacity={0.55} />
        </>
      )}
      {kind === "write" && (
        <>
          <path d="M7 27h6.5l12-12a3.1 3.1 0 0 0-4.4-4.4l-12 12V27Z" {...common} />
          <path d="m19.6 12.8 4.4 4.4" {...common} />
        </>
      )}
    </svg>
  );
}

/* --------------------------------------------------------------------------
   THE FOUR PEOPLE.

   Flat, two tones, a lot of air inside the frame. Same head radius, same
   shoulder curve, same stroke across all four, so the only thing that
   differs is what the person is holding — which is the only thing that
   should differ.
   -------------------------------------------------------------------------- */
export function Persona({ kind, hue }: { kind: LensKey; hue: string }) {
  const line = {
    fill: "none",
    stroke: "var(--text-3)",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const lit = { ...line, stroke: hue };

  return (
    <svg width="100%" viewBox="0 0 120 120" aria-hidden="true" className="persona">
      {/* the shared body: one head, one pair of shoulders */}
      <circle cx="60" cy="38" r="14.5" {...line} />
      <path d="M31 94a29 29 0 0 1 58 0" {...line} />

      {kind === "build" && (
        <>
          <rect x="18" y="56" width="26" height="20" rx="3.5" {...lit} />
          <path d="M18 63h26" {...lit} />
        </>
      )}
      {kind === "start" && (
        <>
          <path d="M18 76l9-13 7 7 11-16" {...lit} />
          <path d="M40 54h5.5v5.5" {...lit} />
        </>
      )}
      {kind === "study" && (
        <>
          <circle cx="29" cy="64" r="10" {...lit} />
          <path d="m36.6 71.6 7 7" {...lit} />
        </>
      )}
      {kind === "write" && (
        <>
          <path d="M18 78h7l15-15a2.9 2.9 0 0 0-4.1-4.1L21 73.9V78Z" {...lit} />
          <path d="M18 86h26" {...lit} opacity={0.5} />
        </>
      )}
    </svg>
  );
}

/* --------------------------------------------------------------------------
   SECTION 05's DIAGRAM.

   No dots. Two columns, one struck through. This is the section the actual
   audience came for — product managers who have been handed a confident
   number by an AI tool before — so it is the one that has to be plain.
   -------------------------------------------------------------------------- */
const MAY = ["Group reviews describing the same struggle", "Copy one short quote from each"];
const MAY_NOT = ["Produce a score", "Produce a rank", "Produce a priority"];

export function Gate() {
  return (
    <div className="gate">
      <div className="may">
        <span className="label">THE MODEL MAY</span>
        <ul>
          {MAY.map((m) => (
            <li key={m}>
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="m4.5 10.5 3.4 3.4L15.5 6.3"
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {m}
            </li>
          ))}
        </ul>
      </div>
      <div className="mayNot">
        <span className="label">THE MODEL MAY NOT</span>
        <ul>
          {MAY_NOT.map((m) => (
            <li key={m}>
              <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  d="M5 15 15 5"
                  fill="none"
                  stroke="var(--text-3)"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
              <s>{m}</s>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
