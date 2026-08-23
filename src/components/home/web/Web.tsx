import { useMemo } from "react";
import { buildWeb } from "./geometry";

/* ──────────────────────────────────────────────────────────────────────────
   One orb web, rendered.

   Stroke weight is the whole game here. At 0.75px with non-scaling-stroke it
   reads as silk; anywhere above 1px it reads as a net, and a net reads as
   Halloween. Opacity falls with depth — atmospheric perspective sells the three
   planes harder than the transforms do.

   The silk glint on the primary web is the detail that makes it material
   rather than lines: a second stroke layer over the same paths, white at 0.10,
   dashed, with the offset crawling round on a 40s cycle. Real silk catches
   light in glints along its length. One slow dashoffset, primary only.

   Nothing here sags, droops, or tatters. A drooping web reads as abandonment,
   which is the opposite of what the page argues.
   ────────────────────────────────────────────────────────────────────────── */

export type WebDepth = "primary" | "secondary" | "tertiary";

/* Roughly 2.5x what these were.

   At 0.22 / 0.13 / 0.08 the webs were too timid to be a feature and too
   visible to be nothing: they read as smudges on the glass rather than as
   intent, and they were paying the cost of both. Refusing to commit is
   what made them look like dirt.

   The ratios between the planes are unchanged, because atmospheric
   perspective is what sells the depth. Only the overall commitment moves. */
const OPACITY: Record<WebDepth, number> = {
  primary: 0.55,
  secondary: 0.32,
  tertiary: 0.2,
};

export function Web({
  size,
  seed,
  depth,
  className,
  style,
}: {
  size: number;
  seed: number;
  depth: WebDepth;
  className?: string;
  style?: React.CSSProperties;
}) {
  const g = useMemo(() => buildWeb(size, seed), [size, seed]);
  const all = [g.bridge, ...g.frame, ...g.radials, g.hubSpiral, g.captureSpiral];

  return (
    <svg
      className={className}
      style={style}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g
        stroke="var(--text)"
        strokeWidth={0.75}
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        opacity={OPACITY[depth]}
      >
        {/* The frame RECEDES. Drawn at full weight it becomes a hard
            polygon outline and the whole thing reads as a geodesic dome or
            a radar display rather than a web. In a real web the frame is
            structural but visually subordinate: what you actually see is
            the capture spiral catching light. */}
        <path d={g.bridge} opacity={0.4} />
        {g.frame.map((d, i) => (
          <path key={`f${i}`} d={d} opacity={0.4} />
        ))}
        {g.radials.map((d, i) => (
          <path key={`r${i}`} d={d} opacity={0.55} />
        ))}
        <path d={g.hubSpiral} opacity={0.6} />
        <path d={g.captureSpiral} opacity={0.85} />
      </g>

      {depth === "primary" && (
        <g
          className="web-glint"
          stroke="#FFFFFF"
          strokeWidth={0.75}
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round"
          opacity={0.1}
        >
          {all.map((d, i) => (
            <path key={`g${i}`} d={d} />
          ))}
        </g>
      )}
    </svg>
  );
}
