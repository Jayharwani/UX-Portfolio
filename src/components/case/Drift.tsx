import { useRef } from "react";
import { useScene } from "./useScene";

/* --------------------------------------------------------------------------
   THE DRIFT — ChronoWeave's signature, CASES.md §3.

   The case study's premise is that for people with ADHD and autism time does
   not feel like it passes: "hours vanish without notice." That is a sentence
   about a felt experience, and a sentence is the weakest way to deliver one.

   So the reader scrolls evenly and watches two clocks disagree. The top track
   is clock time and moves with the scroll exactly. The bottom is felt time and
   crawls — then accelerates hard near the end, which is the part people
   describe as the panic. The gap between them is drawn and labelled as it
   opens.

   ILLUSTRATION, NOT MEASUREMENT. The lag curve is a demonstration of a
   described experience, and it is captioned as one. No number here is offered
   as a finding; the page's actual findings are the three cited statistics
   below it, which carry their sources.
   -------------------------------------------------------------------------- */

const START_HOUR = 9; // 9AM, the ruler the product itself uses
const HOURS = 12;

const HOUR_LABELS = ["9AM", "12PM", "3PM", "6PM", "9PM"];

/** felt time crawls, then races. p^2.6 lags hard early and closes at the end. */
const felt = (p: number) => Math.pow(p, 2.6);

const clock = (p: number) => {
  const t = START_HOUR + p * HOURS;
  const h = Math.floor(t);
  const m = Math.round((t - h) * 60);
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${String(m).padStart(2, "0")}${h >= 12 ? "PM" : "AM"}`;
};

export function Drift() {
  const clockOut = useRef<HTMLSpanElement>(null);
  const feltOut = useRef<HTMLSpanElement>(null);
  const gapOut = useRef<HTMLSpanElement>(null);

  const ref = useScene<HTMLDivElement>((p) => {
    const f = felt(p);
    if (clockOut.current) clockOut.current.textContent = clock(p);
    if (feltOut.current) feltOut.current.textContent = clock(f);
    if (gapOut.current) {
      const lost = (p - f) * HOURS;
      gapOut.current.textContent = `${lost.toFixed(1)} HOURS UNACCOUNTED FOR`;
    }
    ref.current?.style.setProperty("--q", f.toFixed(4));
  });

  return (
    <div className="cw-drift" ref={ref}>
      <div className="track clock">
        <span className="mono lbl">CLOCK TIME</span>
        <div className="rule">
          {HOUR_LABELS.map((h) => (
            <span className="mono tick" key={h}>
              {h}
            </span>
          ))}
          <i className="head" />
        </div>
        <span className="mono read" ref={clockOut}>
          9:00AM
        </span>
      </div>

      <div className="link" aria-hidden="true">
        <i />
        <span className="mono gap" ref={gapOut}>
          0.0 HOURS UNACCOUNTED FOR
        </span>
      </div>

      <div className="track feel">
        <span className="mono lbl">FELT TIME</span>
        <div className="rule">
          {HOUR_LABELS.map((h) => (
            <span className="mono tick" key={h}>
              {h}
            </span>
          ))}
          <i className="head" />
        </div>
        <span className="mono read" ref={feltOut}>
          9:00AM
        </span>
      </div>

      <p className="cs-cap">
        An illustration of the experience the research describes, not a measurement of it. Scroll
        moves both clocks; only one of them keeps up.
      </p>
    </div>
  );
}
