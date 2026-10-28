import type { RefObject } from "react";
import type { FitMode } from "./fit";

/* --------------------------------------------------------------------------
   "TASTE INCLUDED".

   Five glossy tokens in Jay's five project colours, floating around the card.
   They are the one part of the hero that is purely about feel, and they earn
   that by being the project palette made physical: the same five keys the
   chapters are lit by, here as objects you can flick.

   SPRITES, NOT MESHES, AND THE REASON IS THE STACKING ORDER. three.js is
   already in the bundle, but the field's canvas sits below the card and the
   front shapes have to sit above it. Real-time meshes would need a second
   WebGL context for the sake of two shapes, which the budget forbids.
   shape-generator.html in docs/ is the recipe if they ever need re-rendering.
   -------------------------------------------------------------------------- */

export type ShapeDef = {
  key: string;
  file: string;
  /** offsets from the card centre, as fractions of the card's own size */
  ox: number;
  oy: number;
  /** size as a fraction of the card width */
  size: number;
  rotate: number;
  layer: "front" | "back";
  blur?: number;
  /** seconds; chosen so no two bobs line up for a long time */
  period: number;
};

export const SHAPES: ShapeDef[] = [
  { key: "clover", file: "clover-mint", ox: -0.55, oy: -0.45, size: 0.22, rotate: -8, layer: "front", period: 5.2 },
  { key: "cookie", file: "cookie-lilac", ox: 0.77, oy: -0.49, size: 0.16, rotate: 10, layer: "back", blur: 1.4, period: 6.4 },
  { key: "sunny", file: "sunny-amber", ox: 0.75, oy: 0.38, size: 0.25, rotate: 6, layer: "front", period: 7.1 },
  { key: "pill", file: "pill-coral", ox: -0.62, oy: 0.49, size: 0.17, rotate: -14, layer: "back", blur: 2, period: 8.3 },
  { key: "flower", file: "flower-sky", ox: 0.3, oy: -0.63, size: 0.1, rotate: 0, layer: "back", blur: 3, period: 9 },
];

/** stacked keeps the three that read at small size; minimal keeps none */
const FOR_MODE: Record<FitMode, string[]> = {
  full: ["clover", "cookie", "sunny", "pill", "flower"],
  compact: ["clover", "sunny", "pill"],
  minimal: [],
  stacked: ["clover", "sunny", "pill"],
};

export const shapesFor = (mode: FitMode): ShapeDef[] => SHAPES.filter((s) => FOR_MODE[mode].includes(s.key));

export function ShapeLayer({
  layer,
  mode,
  bag,
}: {
  layer: "front" | "back";
  mode: FitMode;
  bag: RefObject<Map<string, HTMLElement>>;
}) {
  const list = shapesFor(mode).filter((s) => s.layer === layer);
  return (
    <div className={`hc-shapes hc-shapes--${layer}`} aria-hidden="true">
      {list.map((s) => (
        <img
          key={s.key}
          className="hc-shape"
          data-shape={s.key}
          ref={(el) => {
            if (el) bag.current?.set(s.key, el);
            else bag.current?.delete(s.key);
          }}
          src={`/hero/shapes/${s.file}.webp`}
          srcSet={`/hero/shapes/${s.file}.webp 1x, /hero/shapes/${s.file}@2x.webp 2x`}
          alt=""
          decoding="async"
          draggable={false}
          style={s.blur ? ({ ["--hc-blur" as string]: `${s.blur}px` } as React.CSSProperties) : undefined}
        />
      ))}
    </div>
  );
}

/* Both numbers are real, which is the only reason they are worth showing:
   the card's corner radius is 34, and 0.82 is the damping ratio of the
   field's own `formation` spring. They read as design tokens because they
   are design tokens. */
export const TOKEN_TAGS = [
  { key: "cookie", chip: "var(--accent-healthy)", text: "radius · 34" },
  { key: "sunny", chip: "var(--accent-bumper)", text: "motion · spring 0.82" },
];
