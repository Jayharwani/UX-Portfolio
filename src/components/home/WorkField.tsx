import { useEffect, useRef } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   THE FIELD BEHIND THE WORK.

   The hero puts its name inside a stack of hairline frames receding into
   depth. The work section put four cards on a flat void. Same page, same
   claim, and only one of them was standing in a space.

   So this is the hero's motif, in CSS. Nine hairline frames on three depth
   planes, drifting at three different rates as the section crosses the
   screen. Nothing here is random: the plates are placed on a broken grid,
   biased to the margins and the gutter, because the cards are opaque and the
   field's whole job is to be visible AROUND them rather than behind them
   where it would only be a texture nobody sees.

   WHY NOT A SECOND WEBGL SCENE. three.js is already loaded for the hero, so
   it would have been cheap to reach for, and it would have been the wrong
   answer twice: a second render loop running the length of a section that
   already has four animating previews in it, to draw rectangles that CSS
   draws for free, and a second ownership of the same visual idea. Depth here
   comes from three numbers — how fast each plane moves — which is the only
   thing that was ever producing it in the hero either.

   ONE LIGHT, AND IT CHANGES COLOUR RATHER THAN MOVING. A soft wash takes the
   accent of whichever project you are reading and crossfades between them,
   so the section's ambient IS the case study you are in. It does not travel
   and it does not pulse. A light that chases the reader is the thing that
   makes a background feel messy, and the brief was the opposite.

   IT RUNS ON THE SCROLL LISTENER, like everything else here. Parallax is a
   function of scroll position, so it is computed when the scroll position
   changes, not every frame whether or not anything moved.
   ────────────────────────────────────────────────────────────────────────── */

/** px each plane travels across the section, near to far. The RATIO is the
    depth; the absolute values only set how much of it you get. */
const RATES = [26, 64, 124] as const;

/** Nine plates, hand-placed. x / y / width are percentages of the field. */
const PLANES: Array<Array<{ x: number; y: number; w: number; r: number }>> = [
  /* far: large, slow, almost not there */
  [
    { x: -6, y: 4, w: 34, r: 0.62 },
    { x: 72, y: 20, w: 38, r: 0.74 },
    { x: 16, y: 63, w: 30, r: 0.58 },
    { x: 66, y: 78, w: 33, r: 0.66 },
  ],
  /* mid */
  [
    { x: 78, y: 6, w: 20, r: 0.7 },
    { x: -3, y: 33, w: 17, r: 0.82 },
    { x: 84, y: 52, w: 22, r: 0.6 },
  ],
  /* near: small, quick, the only ones with a visible edge */
  [
    { x: 6, y: 21, w: 11, r: 0.72 },
    { x: 90, y: 88, w: 13, r: 0.64 },
  ],
];

export default function WorkField({
  active,
  accent,
  reduce,
}: {
  active: number;
  accent: string;
  reduce: boolean;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || reduce) return;
    const planes = Array.from(el.querySelectorAll<HTMLElement>(".wfield__plane"));
    if (!planes.length) return;

    const onScroll = () => {
      const b = el.getBoundingClientRect();
      const vh = window.innerHeight;
      /* -1 with the section still below the fold, +1 once it has gone past.
         Measured from the section's own centre against the screen's, so the
         field is at rest exactly when the work is centred. */
      const centre = b.top + b.height / 2;
      const p = Math.max(-1, Math.min(1, (vh / 2 - centre) / (vh / 2 + b.height / 2)));
      for (let i = 0; i < planes.length; i++) {
        planes[i].style.transform = `translate3d(0, ${(p * RATES[i]).toFixed(1)}px, 0)`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduce]);

  return (
    /* --ac rides the whole field, not just the wash: the plates take a trace
       of it too, so the hairlines around the grid shift from green through
       mint and violet to teal as you read down the four case studies. It is
       the cheapest possible way to make the section's ambient MEAN something
       — one custom property and a transition — and it is the difference
       between a decorative background and one that is telling you where you
       are. */
    <div className="wfield" ref={host} aria-hidden="true" style={{ ["--ac" as string]: accent }}>
      {/* the wash, whose only job is to be the colour of the project you are
          currently reading */}
      <span className="wfield__light" data-on={active} />
      {PLANES.map((plates, i) => (
        <div className={`wfield__plane wfield__plane--${i}`} key={i}>
          {plates.map((p, k) => (
            <span
              key={k}
              className="wfield__plate"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.w}%`,
                aspectRatio: `1 / ${p.r}`,
                ["--k" as string]: k,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
