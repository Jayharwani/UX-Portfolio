import { useEffect, useRef, useState } from "react";

/* ──────────────────────────────────────────────────────────────────────────
   Machine perception, over the work.

   The brief was "robotics and AI", and the honest version of that is NOT neon
   circuitry, glitch type or a glowing brain — this site has already tried and
   rejected the genre default twice. The real visual language of robotics is
   PERCEPTION: a system showing you what it has found, where, and what it
   thinks it is. Detection boxes, coordinate frames, mono telemetry.

   So the page runs a detection pass over its own interface. As a project
   arrives, boxes snap onto regions of the running preview and label them.

   THE BOXES ARE MEASURED, NOT AUTHORED. Each one comes from
   getBoundingClientRect on a real element carrying data-region, so what is
   drawn is genuinely where that element is — resize the window and the boxes
   follow, because they are re-measured rather than positioned by hand. A set
   of hard-coded percentages would have looked identical on the machine it was
   tuned on and wrong everywhere else, and would have been a picture of
   detection rather than the thing itself.

   The readout is true for the same reason: the coordinates printed next to
   each label are that element's real normalised position in the frame.
   Nothing here is invented, which is the difference between an instrument and
   a costume.

   It is a ONE-SHOT pass, not a loop. It runs when a project arrives or when
   you hover to replay, then settles to a quiet resting opacity — motion that
   answers something rather than performing continuously.
   ────────────────────────────────────────────────────────────────────────── */

interface Box {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** normalised centre, printed as the readout — real, not decorative */
  cx: number;
  cy: number;
}

export default function Detect({
  hostRef,
  runKey,
  reduce,
}: {
  hostRef: React.RefObject<HTMLElement>;
  runKey: string;
  reduce: boolean;
}) {
  const [boxes, setBoxes] = useState<Box[]>([]);
  const frameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    const frame = frameRef.current;
    if (!host || !frame) return;

    const measure = () => {
      const base = frame.getBoundingClientRect();
      if (!base.width || !base.height) return;
      const found: Box[] = [];
      /* ONLY the visible slide. All four previews stay mounted and
         cross-faded, so querying the whole face finds every project's regions
         at once — Signal was being labelled with Bumper's checkout. */
      const live = host.querySelector<HTMLElement>(".stage__slide.is-on") || host;
      live.querySelectorAll<HTMLElement>("[data-region]").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const x = ((r.left - base.left) / base.width) * 100;
        const y = ((r.top - base.top) / base.height) * 100;
        const w = (r.width / base.width) * 100;
        const h = (r.height / base.height) * 100;
        /* anything essentially offscreen is not a detection, it is noise */
        if (x < -20 || y < -20 || x > 120 || y > 120) return;
        found.push({
          label: el.dataset.region || "REGION",
          x, y, w, h,
          cx: (x + w / 2) / 100,
          cy: (y + h / 2) / 100,
        });
      });
      setBoxes(found);
    };

    /* Two frames of grace: the preview has just mounted and Motion has not
       written its first transform yet, so measuring immediately would box
       elements at their pre-animation positions. */
    const t = window.setTimeout(measure, 90);
    const ro = new ResizeObserver(measure);
    ro.observe(frame);
    return () => {
      window.clearTimeout(t);
      ro.disconnect();
    };
  }, [hostRef, runKey]);

  if (!boxes.length) return <div ref={frameRef} className="det" aria-hidden="true" />;

  return (
    <div ref={frameRef} className={`det${reduce ? " det--still" : ""}`} aria-hidden="true">
      {boxes.map((b, i) => (
        <div
          /* the index is part of the key because a label is not unique —
             DEVICE appears in two previews */
          key={`${runKey}-${i}-${b.label}`}
          className="det__box"
          style={{
            left: `${b.x}%`,
            top: `${b.y}%`,
            width: `${b.w}%`,
            height: `${b.h}%`,
            animationDelay: reduce ? "0s" : `${0.18 + i * 0.13}s`,
          }}
        >
          <span className="det__c det__c--tl" />
          <span className="det__c det__c--tr" />
          <span className="det__c det__c--bl" />
          <span className="det__c det__c--br" />
          <span className="det__tag">
            {b.label}
            <i>
              {b.cx.toFixed(2)} {b.cy.toFixed(2)}
            </i>
          </span>
        </div>
      ))}
    </div>
  );
}
