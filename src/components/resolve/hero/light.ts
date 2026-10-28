import type { ProductKey } from "../../../data/heroCards";

/* --------------------------------------------------------------------------
   THE CARD'S LIGHT, HANDED TO THE PAGE'S LIGHT SYSTEM.

   The card is lit by Chapter Light's `hero` key rather than by a glow of its
   own, so the whole page has exactly one light system: the thing behind the
   card in the hero is the same thing that travels between chapters below it,
   and the hand-off is a continuation rather than a swap.

   MODULE LEVEL, LIKE setFieldTarget. The stage knows where the card is; the
   light lives three components away in .rs-atmos. Threading a prop through
   the page root would re-render the chapters every time the fit changes, for
   a value only one fixed div ever reads.
   -------------------------------------------------------------------------- */

export type CardLight = { x: number; y: number; product: ProductKey };

let current: CardLight | null = null;
let listener: ((l: CardLight | null) => void) | null = null;

export function setCardLight(next: CardLight | null): void {
  const same =
    current === next ||
    (current && next && current.x === next.x && current.y === next.y && current.product === next.product);
  if (same) return;
  current = next;
  listener?.(next);
}

export function onCardLight(fn: ((l: CardLight | null) => void) | null): () => void {
  listener = fn;
  fn?.(current);
  return () => {
    if (listener === fn) listener = null;
  };
}
