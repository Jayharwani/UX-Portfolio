/* --------------------------------------------------------------------------
   THE HERO'S SPEC LAYER.

   Blue guides, a selection box and three chips drawn over line 1. Every value
   on them is read from computed styles at the size the page is actually at, so
   the spec is true at 320px and at 1440px and nobody has to keep a number in
   two places. "Everything is real" (§3.2.5) means the chip says 168/155
   because the line IS 168 over 155.

   Geometry comes from Geist's own metrics: ascent 1.005em, descent 0.295em,
   cap 0.710em, x-height 0.534em (§4.2). The inline box of a line should
   therefore be 1.3em tall, and that is the one assertion made before drawing:
   if the box is not the height the metrics predict, the font in use is not the
   font the numbers describe, and the guides would be confidently wrong. The
   box is still drawn, because it needs no metrics.
   -------------------------------------------------------------------------- */

export interface SpecGeometry {
  /** the metrics check passed, so the three guides can be trusted */
  guides: boolean;
  capY: number;
  xY: number;
  baseY: number;
  boxL: number;
  boxT: number;
  boxW: number;
  boxH: number;
  /** line 2, for the scanline that rides the ink fill */
  shipL: number;
  shipT: number;
  shipH: number;
  shipW: number;
  chipA: string;
  chipW: string;
  chipB: string;
}

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_IN = "cubic-bezier(0.32, 0, 0.67, 0)";

/** Geist, units per em 1000 */
const ASCENT = 1.005;
const DESCENT = 0.295;
const CAP = 0.71;
const XH = 0.534;

export function measure(hero: HTMLElement, ink1: HTMLElement, ink2: HTMLElement): SpecGeometry {
  const h = hero.getBoundingClientRect();
  const r = ink1.getBoundingClientRect();
  const r2 = ink2.getBoundingClientRect();
  const cs = getComputedStyle(ink1);
  const fs = parseFloat(cs.fontSize);
  const lh = parseFloat(cs.lineHeight);
  const track = parseFloat(cs.letterSpacing) || 0;

  const baseline = r.bottom - DESCENT * fs;
  const capLine = baseline - CAP * fs;
  const xLine = baseline - XH * fs;

  const boxL = r.left - h.left - 8;
  const boxT = capLine - h.top - 10;

  return {
    guides: Math.abs(r.height - (ASCENT + DESCENT) * fs) <= 2,
    capY: capLine - h.top,
    xY: xLine - h.top,
    baseY: baseline - h.top,
    boxL,
    boxT,
    boxW: r.width + 16,
    boxH: baseline + 0.162 * fs + 8 - h.top - boxT,
    shipL: r2.left - h.left,
    /* Cap to descender on line 2, not its full 1.3em inline box: at a line
       height of 0.92 the box reaches into line 1's descenders, and a scanline
       that crosses the line above reads as a cursor rather than as the edge
       of the ink it is riding. */
    shipT: r2.bottom - DESCENT * fs - CAP * fs - 8 - h.top,
    shipH: (CAP + 0.162) * fs + 16,
    shipW: r2.width,
    chipA: `Geist SemiBold ${Math.round(fs)}/${Math.round(lh)}`,
    chipW: `W ${Math.round(r.width)}`,
    chipB: `Tracking ${((track / fs) * 100).toFixed(1)}%`,
  };
}

const px = (n: number) => `${n}px`;

/** write the measurement onto the layer's nodes */
export function paint(layer: HTMLElement, g: SpecGeometry) {
  const set = (sel: string, style: Partial<CSSStyleDeclaration>, text?: string) => {
    const el = layer.querySelector<HTMLElement>(sel);
    if (!el) return;
    Object.assign(el.style, style);
    if (text !== undefined) el.textContent = text;
  };

  layer.dataset.guides = g.guides ? "on" : "off";
  set(".sl-guide--cap", { top: px(g.capY) });
  set(".sl-guide--x", { top: px(g.xY) });
  set(".sl-guide--base", { top: px(g.baseY) });

  set(".sl-box", { left: px(g.boxL), top: px(g.boxT), width: px(g.boxW), height: px(g.boxH) });

  /* the dimension line sits clear of the box's own top border rather than on
     it, where the two 1px rules would have read as one thick one */
  set(".sl-dim", { left: px(g.boxL), top: px(g.boxT - 20), width: px(g.boxW) });
  set(".sl-chip--w", { left: px(g.boxL + g.boxW / 2), top: px(g.boxT - 20) }, g.chipW);
  set(".sl-chip--a", { left: px(g.boxL), top: px(g.boxT - 48) }, g.chipA);
  set(".sl-chip--b", { left: px(g.boxL + g.boxW + 12), top: px(g.xY) }, g.chipB);

  set(".sl-scan", { left: px(g.shipL), top: px(g.shipT), height: px(g.shipH) });
}

/* --------------------------------------------------------------------------
   §7.2, to the millisecond. Every animation is anchored to t0, the moment the
   hero first painted, rather than to the moment this code happened to run:
   the ink fill is a CSS animation that started at first paint, and the
   scanline has to ride its edge, not trail it by however long the font took.
   -------------------------------------------------------------------------- */
export function playIntro(layer: HTMLElement, g: SpecGeometry, t0: number): Animation[] {
  const anims: Animation[] = [];
  const run = (
    el: Element | null,
    frames: Keyframe[],
    opts: KeyframeAnimationOptions,
    fill: FillMode = "both"
  ) => {
    if (!el) return;
    const a = el.animate(frames, { fill, ...opts });
    a.startTime = t0;
    anims.push(a);
  };

  if (g.guides) {
    layer.querySelectorAll(".sl-guide").forEach((el) =>
      run(el, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], {
        duration: 420,
        delay: 80,
        easing: EASE_OUT,
      })
    );
  }

  run(
    layer.querySelector(".sl-box"),
    [
      { opacity: 0, transform: "scale(0.985)" },
      { opacity: 1, transform: "scale(1)" },
    ],
    { duration: 240, delay: 200, easing: EASE_OUT }
  );

  /* Three chips, 40ms apart (§7.2). The dimension line and the W label it
     carries are one mark, not two, so they share a step. */
  const CHIPS: [string, number][] = [
    [".sl-chip--a", 0],
    [".sl-dim", 1],
    [".sl-chip--w", 1],
    [".sl-chip--b", 2],
  ];
  CHIPS.forEach(([sel, step]) =>
    run(layer.querySelector(sel), [{ opacity: 0 }, { opacity: 1 }], {
      duration: 200,
      delay: 300 + step * 40,
      easing: EASE_OUT,
    })
  );

  /* Rides the fill edge: the same 520ms delay, 760ms duration and easing as
     the CSS keyframe on line 2, anchored to the same t0, so the two cannot
     drift however long the font took to arrive.

     "forwards", not "both": a backwards fill would hold the first keyframe
     from t0 and the scanline would sit at the left edge of the line from
     first paint instead of appearing when the ink does. */
  run(
    layer.querySelector(".sl-scan"),
    [
      { transform: "translateX(0px)", opacity: 1 },
      { transform: `translateX(${g.shipW}px)`, opacity: 1 },
    ],
    { duration: 760, delay: 520, easing: "cubic-bezier(0.65, 0, 0.35, 1)" },
    "forwards"
  );

  /* The layer retracts the way it arrived, toward the right. Every exit fills
     forwards for the same reason as the scanline: these are added after the
     entrances, so a backwards fill would win the cascade of animations and
     pin each element to its pre-exit value from t0. */
  layer.querySelectorAll<HTMLElement>(".sl-guide").forEach((el) => {
    el.style.transformOrigin = "right center";
    run(
      el,
      [{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }],
      { duration: 120, delay: 1280, easing: EASE_IN },
      "forwards"
    );
  });
  [".sl-box", ".sl-dim", ".sl-chip--a", ".sl-chip--w", ".sl-chip--b", ".sl-scan"].forEach((sel) =>
    run(
      layer.querySelector(sel),
      [{ opacity: 1 }, { opacity: 0 }],
      { duration: 120, delay: 1280, easing: EASE_IN },
      "forwards"
    )
  );

  return anims;
}

/** the transform-origin swap for the exit has to be undone before a re-show */
export function resetGuides(layer: HTMLElement) {
  layer
    .querySelectorAll<HTMLElement>(".sl-guide")
    .forEach((el) => (el.style.transformOrigin = "left center"));
}
