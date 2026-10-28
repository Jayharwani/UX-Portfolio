import type { HeroCard } from "../../../data/heroCards";

/* --------------------------------------------------------------------------
   "DESIGNS IT", SHOWN RATHER THAN CLAIMED.

   The marks a designer leaves on a file: a selection with handles, the size
   it resolved to, a spacing measure, and the cursor that made them. They sit
   in the card's own plane, so they tilt with it — which is what stops them
   reading as a sticker on top of a photograph.

   JAY'S CURSOR IS AN ILLUSTRATION, NOT A REPLACEMENT. The system cursor is
   never hidden. This one lives inside the card and belongs to the file being
   edited, not to the visitor's pointer.
   -------------------------------------------------------------------------- */

const HANDLES: Array<[number, number]> = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
];

export function Overlay({ card }: { card: HeroCard }) {
  const [x, y, w, h] = card.select.box;
  /* two pixels outside the element, so the box reads as a selection around
     it rather than as a border on it */
  const bx = x - 2;
  const by = y - 2;
  const bw = w + 4;
  const bh = h + 4;
  const topRight = card.select.sizeAt === "top-right";
  /* Bumper's target is half-width, so its measure starts nearer the left */
  const markX = card.key === "bumper" ? 120 : 300;

  return (
    <div className="hc-overlay" aria-hidden="true">
      <div className="hc-sel" style={{ left: bx, top: by, width: bw, height: bh }}>
        {HANDLES.map(([hx, hy], i) => (
          <span key={i} className="hc-handle" style={{ left: `${hx * 100}%`, top: `${hy * 100}%` }} />
        ))}
      </div>

      <span className="hc-sel-name" style={{ left: bx, top: by - 20 }}>
        {card.select.name}
      </span>

      <span
        className="hc-size"
        style={
          topRight
            ? { left: bx + bw, top: by, transform: "translate(-100%, -130%)" }
            : { left: bx + bw / 2, top: by + bh + 10, transform: "translate(-50%, 0)" }
        }
      >
        {card.select.size}
      </span>

      {/* the gap between this element and the one above it, measured */}
      <span className="hc-mark" style={{ left: markX, top: by - 14 }} />
      <span className="hc-mark-label" style={{ left: markX, top: by - 21 }}>
        16
      </span>

      <span className="hc-cursor" style={{ left: bx + bw, top: by + bh }}>
        <svg viewBox="0 0 24 28" aria-hidden="true">
          <path d="M3 2 L21 15.5 L12.4 16.6 L17 25.6 L13 27.4 L8.6 18.4 L3 23.4 Z" />
        </svg>
        <i>Jay</i>
      </span>
    </div>
  );
}
