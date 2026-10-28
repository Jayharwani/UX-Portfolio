import { Fragment } from "react";
import { tokenize, type Tok } from "../../../data/heroCards";

/* --------------------------------------------------------------------------
   CODE, COLOURED.

   One renderer for both places code appears: the lens snippet and the full
   listing behind it. They share a tokenizer so a line cannot be highlighted
   one way in the lens and another on the card, which would give the whole
   conceit away.

   The colours are class names, not inline styles: the eight syntax roles are
   declared once on .hero-stage in resolve.css, which is where colour lives.
   -------------------------------------------------------------------------- */

const CLASS: Record<Exclude<Tok, "sp">, string> = {
  kw: "hc-kw",
  tg: "hc-tg",
  at: "hc-at",
  st: "hc-st",
  nu: "hc-nu",
  pu: "hc-pu",
  cm: "hc-cm",
  id: "hc-id",
};

/** Render one line's tokens. Whitespace stays plain text so the monospace
 *  grid is never broken by a span boundary. */
export function CodeLine({ line }: { line: string }) {
  return (
    <>
      {tokenize(line).map(([t, s], i) =>
        t === "sp" ? <Fragment key={i}>{s}</Fragment> : (
          <span key={i} className={CLASS[t]}>
            {s}
          </span>
        ),
      )}
    </>
  );
}

/** A block of code: the listing on the card, or the snippet in the lens.
 *  `caret` marks the line the blinking caret sits at the end of. */
export function CodeBlock({ text, caret }: { text: string; caret?: number }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={i}>
          <CodeLine line={line} />
          {i === caret && <span className="hc-caret" aria-hidden="true" />}
          {i < lines.length - 1 && "\n"}
        </Fragment>
      ))}
    </>
  );
}
