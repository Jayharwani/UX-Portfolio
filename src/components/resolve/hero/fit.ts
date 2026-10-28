/* --------------------------------------------------------------------------
   WHERE THE CARD GOES.

   The text column does not move. It is the thing the page is about and it is
   already placed; the card takes whatever is to the right of it and fits
   itself to that. Everything here is measured, never guessed, and measured
   exactly once per layout — nothing in this file runs per frame.

   THE HEADLINE IS MEASURED AS A TEXT NODE, NOT AS A BOX. `.rs-outline` is a
   block, so its box is as wide as the whole column and tells you nothing
   about where the words end. Range-selecting the text node is the difference
   between the card sitting 72px off "Then ships it." and sitting 500px away
   with a hole in the middle of the page.
   -------------------------------------------------------------------------- */

export const BASE_W = 460;
export const BASE_H = 624;
/** air between the end of the headline and the left edge of the stage */
const GAP = 72;
const SHELL = 1320;
/** the pager and the gap above it, in the stacked layout */
const PAGER_SPACE = 46;
const TOP_MARGIN = 20;
/** a card tilted 6 and 4 degrees projects a little taller than it is */
const TILT_GROWTH = 1.06;

export type FitMode = "full" | "compact" | "minimal" | "stacked";

export type Fit =
  | { layout: "none" }
  | { layout: "side" | "stacked"; mode: FitMode; k: number; w: number; h: number; cx: number; cy: number };

/** the right edge of an element's own text, ignoring the box around it */
function textRight(el: Element | null): number {
  if (!el) return 0;
  const node = Array.from(el.childNodes).find((n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim());
  const range = document.createRange();
  range.selectNodeContents(node ?? el);
  return range.getBoundingClientRect().right;
}

/** The same test the stylesheet and the field already make. All three have to
 *  agree or the card is placed for one layout and the type for another. */
export const isDesktop = (): boolean => window.innerWidth >= 1024 && window.innerWidth / window.innerHeight > 1.25;

export function fitStage(): Fit {
  /* clientWidth, not innerWidth: the scrollbar is not usable space */
  const vw = document.documentElement.clientWidth;
  const vh = window.innerHeight;

  if (!isDesktop()) {
    /* A LANDSCAPE PHONE GETS NO CARD AT ALL. Under 560 points of height there
       is no room for a 624-tall card and a headline, and half a card is worse
       than the sphere that was there before. */
    if (vh < 560) return { layout: "none" };
    /* MEASURED AGAINST THE COPY, NOT SET AS A FRACTION OF THE SCREEN. The
       spec starts at 0.42 of the height and says to try 0.38 if the pager
       does not clear the text. Neither works at 390 x 844: the copy block
       there starts at 45% of the viewport, so a card centred at 27% with its
       pager under it lands 55 pixels inside the eyebrow whatever the factor.

       So the card takes the room that is actually above the copy and no
       more. The fraction stays as a ceiling for tall screens, where there is
       more room than the card should use. */
    const copyTop = document.querySelector(".rs-hero-copy")?.getBoundingClientRect().top ?? vh * 0.5;
    /* 46 for the pager and its gap, 20 above the card, 12 of air below */
    const room = copyTop - 12 - PAGER_SPACE - TOP_MARGIN;
    const h = Math.max(180, Math.min(vh * 0.38, 420, room / TILT_GROWTH));
    const k = h / BASE_H;
    return {
      layout: "stacked",
      mode: "stacked",
      k,
      w: BASE_W * k,
      h,
      cx: vw / 2,
      cy: TOP_MARGIN + (h * TILT_GROWTH) / 2,
    };
  }

  const line1 = document.querySelector(".rs-display .rs-line > span");
  const line2 = document.querySelector(".rs-display .rs-outline");
  const rail = document.querySelector("nav.rs-rail")?.getBoundingClientRect();

  const left = Math.max(textRight(line1), textRight(line2)) + GAP;
  const shellRight = (vw + Math.min(vw, SHELL)) / 2;
  /* THE CARD STAYS NEAR THE TEXT ON A VERY WIDE SCREEN. Without the shell
     term it would drift to the far edge of a 2560 display and the hero would
     read as two unrelated halves. */
  const right = Math.min((rail && rail.width ? rail.left : vw) - 44, shellRight + 200);
  const avail = right - left;

  const raw = Math.min(1.16, (vh - 220) / BASE_H, (avail * 0.86) / BASE_W);
  const mode: FitMode = raw >= 0.68 ? "full" : raw >= 0.56 ? "compact" : "minimal";
  /* below 0.56 the card stops shrinking and simply loses its companions */
  const k = Math.max(raw, 0.56);

  return { layout: "side", mode, k, w: BASE_W * k, h: BASE_H * k, cx: left + avail / 2, cy: vh * 0.5 - 6 };
}
