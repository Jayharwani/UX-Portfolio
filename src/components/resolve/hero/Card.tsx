import type { RefObject } from "react";
import type { HeroCard, Region } from "../../../data/heroCards";
import { CardUI } from "./CardUI";
import { CodeBlock } from "./Code";
import { Overlay } from "./Overlay";

/* --------------------------------------------------------------------------
   THE CARD.

   Four stacked faces in one 3D plane: the plate and the edge behind, the
   product screen, and the full listing hidden under a clip that the lens and
   later the scroll open up.

   THE LENS IS NOT A FACE. It is a disc above them with its own copy of the
   code, which is what lets the snippet be readable: a window into the listing
   would show it at the card's tilt and at the card's scale, sideways and
   small. An inspector shows the code *for* what it is over, square to the
   reader. That is the difference between a gimmick and a tool.
   -------------------------------------------------------------------------- */

export type CardRefs = {
  card: RefObject<HTMLDivElement | null>;
  lens: RefObject<HTMLDivElement | null>;
  rim: RefObject<HTMLDivElement | null>;
  tag: RefObject<HTMLDivElement | null>;
  snip: RefObject<HTMLPreElement | null>;
  code: RefObject<HTMLDivElement | null>;
  ui: RefObject<HTMLDivElement | null>;
  overlay: RefObject<HTMLDivElement | null>;
  frame: RefObject<HTMLDivElement | null>;
};

/** which snippet line the caret sits at the end of, per region */
const CARET: Record<Region, number> = { number: 3, module: 2, list: 3, cta: 4 };

export function Card({ card, region, refs }: { card: HeroCard; region: Region; refs: CardRefs }) {
  return (
    <div className="hc-persp" aria-hidden="true">
      <div className="hc" ref={refs.card}>
        <div className="hc-back" />
        <div className="hc-edge" />

        <div className="hc-face hc-ui" ref={refs.ui}>
          <CardUI card={card} />
        </div>

        <div className="hc-face hc-code" ref={refs.code}>
          <pre>
            <CodeBlock text={card.listing} />
          </pre>
        </div>

        <div className="hc-lens" ref={refs.lens}>
          <pre className="hc-snip" ref={refs.snip}>
            <CodeBlock text={card.snippets[region]} caret={CARET[region]} />
          </pre>
        </div>
        <div className="hc-rim" ref={refs.rim} />
        <div className="hc-tag" ref={refs.tag}>
          <i>{"</>"}</i>
          REAL CODE
        </div>
        <div className="hc-ring" />

        {/* above the lens, so the lens slides under the selection box */}
        <div ref={refs.overlay}>
          <Overlay card={card} />
        </div>

        <div className="hc-frame" ref={refs.frame}>
          {card.frame}
        </div>
      </div>
    </div>
  );
}
