import { revealAt, seg } from "./lens";

/* --------------------------------------------------------------------------
   THE HAND-OFF, PHASE A: THE CARD BECOMES ITS OWN CODE.

   A lens that showed the code for one part of the interface opens until it
   has swallowed the whole card, and what is left is the listing. Then the
   listing stops being DOM and is only the particles that were always under
   it. The field's own morph carries them into chapter 01 from there.

   IT IS A PURE FUNCTION OF THE SCROLL, with no tweens anywhere. That is the
   whole reason it reverses exactly when you scroll back up, survives a fling,
   a rail click, a resize and a reload partway down, and never has to catch up
   with itself. Everything below reads `a` and writes transforms and opacity.
   -------------------------------------------------------------------------- */

export type HeroParts = {
  /** the page root, which is where the light's own tokens live */
  page: HTMLElement | null;
  stage: HTMLElement;
  /** the per-frame loop, which owns every shape transform. The push has to go
   *  through it rather than round it: two writers on one property means the
   *  springs win it back on the very next frame. */
  onExit: (a: number) => void;
  card: HTMLElement;
  code: HTMLElement | null;
  lens: HTMLElement | null;
  rim: HTMLElement | null;
  tag: HTMLElement | null;
  ring: HTMLElement | null;
  overlay: HTMLElement | null;
  frame: HTMLElement | null;
  ui: HTMLElement | null;
  back: HTMLElement | null;
  edge: HTMLElement | null;
  shapes: HTMLElement[];
  extras: HTMLElement[];
};

let parts: HeroParts | null = null;
export const registerHero = (p: HeroParts | null): void => {
  parts = p;
  /* A PRODUCT SWITCH REPLACES THE ELEMENTS, SO THE SCRUB HAS TO RUN AGAIN.
     Without this the new interface would arrive at full opacity in the middle
     of a hand-off, because the scroll has not moved and the scrub short
     circuits on exactly that. */
  lastA = -1;
};

const set = (el: Element | null, prop: string, value: string) => {
  if (el) (el as HTMLElement).style.setProperty(prop, value);
};

/** where the scrub last left the card, and -1 for "nothing was scrubbed" */
let lastA = -1;

/** `a` is phase A, 0 at the top of the page and 1 where the field's own
 *  morph into chapter 01 begins. */
export function scrubHero(a: number): void {
  if (!parts || a === lastA) return;
  lastA = a;
  const p = parts;

  /* THE ANNOTATIONS BELONG TO THE DESIGN FACE AND GO WITH IT. The selection
     handles, the measurement and the collaborator's cursor are all labelling
     an interface that the lens is in the middle of covering up, so they leave
     on the lens's clock. */
  for (const el of [p.overlay, p.frame]) set(el, "opacity", `${1 - seg(a, 0.05, 0.35)}`);
  /* THE FURNITURE OUTLASTS THEM. The tabs, the pager and the lens's own tag
     are still true while the card is code — the reference keeps every one of
     them on screen a fifth of the way down — so they go only once there is no
     card left for them to be about. */
  for (const el of p.extras) set(el, "opacity", `${1 - seg(a, 0.5, 0.75)}`);
  /* the tag goes last of all, with the ring: between them they are the only
     things still saying what the dust used to be */
  set(p.tag, "opacity", `${1 - seg(a, 0.86, 1)}`);
  p.stage.style.pointerEvents = a > 0.02 ? "none" : "";

  /* THE LIGHT GOES WITH WHAT IT WAS LIGHTING. The floor is the card's floor,
     so it is gone within the first third — long before the card is — and the
     card's own key light crosses to the neutral one when the zone flips at the
     halfway mark. Taking the duration to zero is what hands the floor to the
     scroll; releaseHero gives it back. */
  if (p.page) {
    p.page.style.setProperty("--hc-grid-dur", "0ms");
    p.page.style.setProperty("--hc-grid", `${1 - seg(a, 0, 0.33)}`);
  }

  /* the lens stops being a lens: its disc fades while the card's own code
     face takes over the same circle, so the code never moves */
  const { r, x, y, codeOpacity } = revealAt(a);
  set(p.lens, "opacity", `${1 - codeOpacity}`);
  set(p.rim, "opacity", `${1 - seg(a, 0.4, 0.55)}`);
  if (p.code) {
    p.code.style.transition = "none";
    p.code.style.opacity = `${codeOpacity}`;
    p.code.style.setProperty("--hc-reveal-r", `${r}px`);
    p.code.style.setProperty("--hc-reveal-x", `${x}px`);
    p.code.style.setProperty("--hc-reveal-y", `${y}px`);
  }
  /* THE RING OUTLIVES THE CARD. Once the plate and both faces are gone the
     outline is the only thing left saying the dust used to be a screen, and
     the reference still has it two fifths of the way down. It goes last. */
  set(p.ring, "opacity", `${seg(a, 0.4, 0.55) * (1 - seg(a, 0.55, 0.75) * 0.6) * (1 - seg(a, 0.86, 1))}`);

  /* THE CARD FADES BY ITS CHILDREN, NEVER BY ITSELF. Opacity below 1 on .hc
     would flatten preserve-3d and drop the plate and the edge into the face's
     own plane. */
  const body = 1 - seg(a, 0.55, 0.75);
  for (const el of [p.back, p.edge]) set(el, "opacity", `${body}`);
  /* THE DESIGN FACE LEAVES ON THE CIRCLE'S CLOCK, NOT THE CARD'S. Fading the
     two faces together left both of them half-transparent and co-planar from
     0.55 to 0.75, so the interface and its own source code were legible
     through each other — which is not a crossfade, it is a double exposure.
     The circle has covered the card by 0.42, so taking the design away just
     after that is something nobody can see happen. */
  set(p.ui, "opacity", `${1 - seg(a, 0.38, 0.46)}`);
  if (p.code) p.code.style.opacity = `${codeOpacity * body}`;
  /* and it stops being painted at all once there is nothing left of it,
     which is after the ring has gone and not before */
  p.card.style.visibility = a >= 0.995 ? "hidden" : "";

  /* the shapes drift out of frame rather than popping. The travel belongs to
     the loop; only the fade is ours, and nothing else writes opacity. */
  p.onExit(a);
  const fade = 1 - seg(a, 0.5, 0.78) * 0.45 - seg(a, 0.78, 0.99) * 0.55;
  for (const el of p.shapes) {
    el.style.opacity = `${Math.max(fade, 0)}`;
    el.style.visibility = a >= 0.98 ? "hidden" : "";
  }
}

/** put everything back, for a reader who scrolls up again */
export function releaseHero(): void {
  /* nothing was scrubbed, so there is nothing to put back. Without this the
     no-card path would write a dozen styles a frame for no reason at all. */
  if (!parts || lastA < 0) return;
  const p = parts;
  p.onExit(0);
  lastA = -1;
  p.stage.style.pointerEvents = "";
  p.card.style.visibility = "";
  for (const el of [p.overlay, p.frame, p.ui, p.back, p.edge, p.lens, p.rim, ...p.extras]) {
    if (el) el.style.removeProperty("opacity");
  }
  set(p.ring, "opacity", "0");
  for (const el of p.shapes) {
    el.style.removeProperty("opacity");
    el.style.removeProperty("visibility");
  }
  if (p.code) {
    p.code.style.transition = "";
    p.code.style.opacity = "0";
    p.code.style.setProperty("--hc-reveal-r", "0px");
  }
  if (p.page) {
    p.page.style.removeProperty("--hc-grid-dur");
    p.page.style.removeProperty("--hc-grid");
  }
}
