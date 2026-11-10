import type { FitMode } from "../components/resolve/hero/fit";

/* --------------------------------------------------------------------------
   THE MESS, WRITTEN OUT.

   Each fragment is one of the everyday problems a product on this page
   fixes, and they are the literal subject of the opening: the page says it
   takes something messy and gives back one clear thing, so the first second
   is the mess, and the second is it being pulled into a card.

   THEY ARE THE PRODUCTS' OWN COMPLAINTS, not generic clutter. The sticky note
   about where the money went is Headroom's, the one-star review about not
   being able to cancel is Friction's, the receipt is Bumper's. A reader who
   comes back to the page after reading the case studies should recognise
   every one of them.
   -------------------------------------------------------------------------- */

export type FragmentKind = "note" | "review" | "receipt" | "toast" | "badge";

export type Fragment = {
  key: string;
  kind: FragmentKind;
  /** the accent that names it, which is the product it belongs to */
  accent?: "bumper" | "friction" | "healthy";
  text?: string;
  lines?: string[];
  /** from the card centre, as fractions of its width and height */
  ox: number;
  oy: number;
  angle: number;
  /** left out of the narrow layouts, where there is no room for them */
  big?: boolean;
};

export const FRAGMENTS: Fragment[] = [
  { key: "money", kind: "note", accent: "bumper", text: "where did my money go??", ox: -0.52, oy: -0.42, angle: -9 },
  { key: "cancel", kind: "review", accent: "friction", text: "can't cancel my subscription", ox: 0.3, oy: -0.52, angle: 4 },
  { key: "need", kind: "note", accent: "healthy", text: "did I really need that?", ox: -0.6, oy: 0.3, angle: 5, big: true },
  {
    key: "receipt",
    kind: "receipt",
    lines: ["COFFEE          6.40", "SUBSCRIPTION   12.99", "SUBSCRIPTION   12.99", "???            45.00", "TOTAL             ???"],
    ox: 0.62,
    oy: -0.28,
    angle: 7,
    big: true,
  },
  { key: "failed", kind: "toast", accent: "friction", text: "Payment failed. Try again?", ox: -0.12, oy: 0.04, angle: -3 },
  { key: "b12", kind: "badge", accent: "friction", text: "12", ox: 0.12, oy: -0.25, angle: 0 },
  { key: "b99", kind: "badge", accent: "friction", text: "99+", ox: -0.42, oy: 0.12, angle: 0, big: true },
];

/** THREE OF THEM WHEN THE CARD IS STACKED. A phone has the card and the
 *  headline in the same column, so there is no room beside it for a mess —
 *  what is left is the three that read at a glance. */
const STACKED = new Set(["money", "cancel", "failed"]);

export function fragmentsFor(mode: FitMode): Fragment[] {
  if (mode === "stacked" || mode === "minimal") return FRAGMENTS.filter((f) => STACKED.has(f.key));
  if (mode === "compact") return FRAGMENTS.filter((f) => !f.big);
  return FRAGMENTS;
}
