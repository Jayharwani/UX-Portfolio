import { useRef, useState } from "react";
import { useScene } from "./useScene";

/* --------------------------------------------------------------------------
   VERIFY — Friction's second scene.

   The site makes an unusual promise about its quotes: "every quote is checked
   character by character against the review it came from." It is the claim
   that separates a quote from a paraphrase, and it is the reason a reader
   should believe any of the rest. So the page performs it, one character at
   a time, and then produces the provenance the check was run against.

   The quote and all five fields are real, copied from the Notion challenge
   page on friction, including the capture date. Nothing here is composed.

   Set in mono, which is a departure from the serif friction sets its quotes
   in. That is deliberate: this scene is about the machine checking the quote,
   not about the person who wrote it.

   The split point is the only thing that moves, and it moves at most once per
   character — 58 DOM writes across the whole scroll rather than one per frame.
   Both halves are the same string, so the line never reflows.
   -------------------------------------------------------------------------- */

const QUOTE = "The screen keeps randomly jumping from one place to another";

/** exactly as friction records it under the quote */
const PROVENANCE = ["iOS", "version 1.7.338", "1 star", "United States", "17 Sept 2026"];

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

export function Verify() {
  const ok = useRef<HTMLSpanElement>(null);
  const rest = useRef<HTMLSpanElement>(null);
  const [stage, setStage] = useState(0);
  const at = useRef(-1);

  const scene = useScene<HTMLDivElement>((p) => {
    /* the check runs across the middle of the travel, so it has finished
       before the section leaves and the reader ends on a settled line */
    const k = clamp01((p - 0.26) / 0.36);
    const n = Math.round(k * QUOTE.length);
    if (n !== at.current) {
      at.current = n;
      if (ok.current) ok.current.textContent = QUOTE.slice(0, n);
      if (rest.current) rest.current.textContent = QUOTE.slice(n);
    }
    /* the fields arrive after the line they describe has been proved */
    const s = k >= 1 ? PROVENANCE.length + 1 : Math.floor(clamp01((k - 0.45) / 0.5) * PROVENANCE.length);
    setStage((prev) => (prev === s ? prev : s));
  });

  return (
    <div className="fr-verify" ref={scene}>
      <div className="fr-vq" data-done={stage > PROVENANCE.length ? "1" : "0"}>
        <span className="ok mono" ref={ok} />
        <i className="caret" aria-hidden="true" />
        <span className="rest mono" ref={rest}>
          {QUOTE}
        </span>
      </div>

      <ul className="fr-prov mono" data-stage={stage}>
        {PROVENANCE.map((f) => (
          <li key={f}>{f}</li>
        ))}
      </ul>

      <p className="fr-vfoot mono">
        <b>Captured 20 Sept 2026.</b> Checked character by character against the review it came from.
      </p>
    </div>
  );
}
