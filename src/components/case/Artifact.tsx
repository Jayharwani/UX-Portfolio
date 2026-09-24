import { useRef, useState, type ReactNode } from "react";
import { useReveal } from "./useScene";

/* --------------------------------------------------------------------------
   ARTIFACTS.

   The case study's problem was never the words, it was that it described its
   evidence instead of showing it. These are the three presentations that
   evidence needs: a framed screenshot, a before/after you can drag, and the
   contact sheet of nine redesigns.

   One frame treatment throughout, three widths, captions capped short. No
   device mockups and no fake browser chrome — a screenshot of a real page
   does not need a drawing of a laptop around it to be believed.
   -------------------------------------------------------------------------- */

type Width = "full" | "wide" | "half";

/** a framed screenshot with a caption under it */
export function Figure({
  src,
  alt,
  w,
  h,
  caption,
  width = "wide",
  past = false,
  children,
}: {
  src: string;
  alt: string;
  /** intrinsic pixels — always set, or the page reflows as each image lands */
  w: number;
  h: number;
  caption: string;
  width?: Width;
  /** historical artifacts are desaturated, so past reads apart from present */
  past?: boolean;
  children?: ReactNode;
}) {
  const [ref, seen] = useReveal<HTMLElement>(0.1);
  return (
    <figure className={`fr-fig is-${width}${past ? " past" : ""} cs-rv${seen ? " in" : ""}`} ref={ref}>
      <div className="shell">
        <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" />
        {children}
      </div>
      <figcaption className="mono">{caption}</figcaption>
    </figure>
  );
}

/* --------------------------------------------------------------------------
   BEFORE / AFTER.

   The handle is a real range input, not a div with pointer handlers. That is
   the whole accessibility story for free: arrow keys, Home and End, a focus
   ring, and a value a screen reader can announce. It is made invisible and
   the visible handle is drawn under it, so the control a person operates and
   the control the browser exposes are the same element.
   -------------------------------------------------------------------------- */
export function Compare({
  before,
  after,
  beforeAlt,
  afterAlt,
  w,
  h,
  caption,
}: {
  before: string;
  after: string;
  beforeAlt: string;
  afterAlt: string;
  w: number;
  h: number;
  caption: string;
}) {
  const [split, setSplit] = useState(50);
  const [ref, seen] = useReveal<HTMLElement>(0.1);
  const box = useRef<HTMLDivElement>(null);

  /* dragging anywhere on the image moves the split, which is what everyone
     tries first; the range input keeps it operable without a pointer */
  const drag = (e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    const r = box.current?.getBoundingClientRect();
    if (!r) return;
    setSplit(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };

  return (
    <figure className={`fr-cmp cs-rv${seen ? " in" : ""}`} ref={ref}>
      <div
        className="shell"
        ref={box}
        style={{ ["--split" as string]: `${split}%` }}
        onPointerMove={drag}
        onPointerDown={drag}
      >
        <img className="base" src={before} alt={beforeAlt} width={w} height={h} loading="lazy" decoding="async" />
        <div className="over" aria-hidden="true">
          <img src={after} alt="" width={w} height={h} loading="lazy" decoding="async" />
        </div>
        <span className="tag a mono">BEFORE</span>
        <span className="tag b mono">AFTER</span>
        <i className="bar" aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={100}
          value={split}
          aria-label="Reveal the rebuilt homepage"
          onChange={(e) => setSplit(Number(e.target.value))}
        />
        {/* the after image is decorative above; this carries its description */}
        <span className="sr">{afterAlt}</span>
      </div>
      <figcaption className="mono">{caption}</figcaption>
    </figure>
  );
}

/* --------------------------------------------------------------------------
   THE CONTACT SHEET.

   Nine builds of the same homepage, each checked out of git, built and shot
   at 1440x900 by the same script, so the only thing that differs between
   frames is the design. Every portfolio claims iteration; this is the thing
   itself.
   -------------------------------------------------------------------------- */
export type Round = {
  n: string;
  date: string;
  note: string;
  /** the two rounds that happened because people could not read the page */
  test?: boolean;
};

export function ContactSheet({ rounds, caption }: { rounds: Round[]; caption: string }) {
  const [ref, seen] = useReveal<HTMLDivElement>(0.05);
  return (
    <div className={`fr-sheet${seen ? " in" : ""}`} ref={ref}>
      <ol>
        {rounds.map((r, i) => (
          <li key={r.n} style={{ transitionDelay: `${i * 60}ms` }} className={r.test ? "test" : undefined}>
            <img
              src={`/friction/round-${r.n}.webp`}
              alt={`Friction's homepage on ${r.date}: ${r.note}`}
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
            />
            <span className="meta mono">
              <b>{r.date}</b>
              {r.note}
            </span>
          </li>
        ))}
      </ol>
      <p className="cap mono">{caption}</p>
    </div>
  );
}
