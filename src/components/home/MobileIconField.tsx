import { useEffect, useRef, useState } from "react";
import { TILES, tileStyle } from "./IconPlayground";

/* ──────────────────────────────────────────────────────────────────────────
   Mobile icon field: the hero signature for touch screens.
   The same ten tech blocks as the desktop physics playground, but staged as
   a 3D moment: they tumble in from depth (rotate + z + blur), then each one
   floats forever on its own rhythm. Tap a block and it pops with a spin.
   Scrolling parallaxes the field in three depth layers.

   Layered wrappers so every transform has one owner:
     .mif-pos    position + scroll parallax (JS-driven CSS var)
     .mif-in     one-shot tumble-in entrance
     .mif-float  infinite drift
     .mif-pop    tap pop (remounted per pop to restart the animation)
   ────────────────────────────────────────────────────────────────────────── */

/* x/y in %, scale vs desktop size, parallax depth, entrance delay (s).
   The band under the hero copy owns most blocks; two dim escapees float
   high behind the headline for depth without hurting readability. */
const SPOTS = [
  { x: 82, y: 7, s: 0.52, d: -0.22, o: 0.5 }, // figma — escapee, top right
  { x: 10, y: 63, s: 0.66, d: -0.1, o: 1 }, // claude
  { x: 38, y: 58, s: 0.6, d: -0.18, o: 0.92 }, // chatgpt
  { x: 66, y: 62, s: 0.64, d: -0.12, o: 1 }, // antigravity
  { x: 88, y: 55, s: 0.5, d: -0.24, o: 0.72 }, // gemini — small, deep
  { x: 6, y: 33, s: 0.46, d: -0.26, o: 0.45 }, // ux — escapee, mid left
  { x: 24, y: 78, s: 0.62, d: -0.14, o: 1 }, // code
  { x: 52, y: 74, s: 0.68, d: -0.08, o: 1 }, // cursor — nearest layer
  { x: 78, y: 79, s: 0.58, d: -0.16, o: 0.95 }, // adobe
  { x: 42, y: 90, s: 0.52, d: -0.2, o: 0.8 }, // aidesign
];

export default function MobileIconField() {
  const fieldRef = useRef<HTMLDivElement>(null);
  const [pops, setPops] = useState<number[]>(() => TILES.map(() => 0));

  /* scroll parallax: one rAF-throttled listener writes a px var; each
     tile multiplies it by its depth. Transform-only, no layout work. */
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        el.style.setProperty("--mif-sy", `${window.scrollY}px`);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const pop = (i: number) => setPops((p) => p.map((n, j) => (j === i ? n + 1 : n)));

  return (
    <div
      ref={fieldRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        perspective: 900,
        pointerEvents: "none",
      }}
    >
      <style>{`
        @keyframes mif-in {
          0% {
            opacity: 0;
            transform: translate3d(0, -46vh, 240px) rotateX(72deg) rotateY(-38deg) rotateZ(-26deg);
            filter: blur(10px);
          }
          62% { filter: blur(0px); }
          78% { transform: translate3d(0, 1.5vh, -14px) rotateX(-7deg) rotateY(5deg) rotateZ(2.5deg); }
          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) rotateX(0) rotateY(0) rotateZ(0);
            filter: blur(0px);
          }
        }
        @keyframes mif-float {
          0% { transform: translate3d(0, 0, 0) rotateX(3deg) rotateY(-4deg) rotateZ(-1.6deg); }
          100% { transform: translate3d(0, -9px, 12px) rotateX(-4deg) rotateY(5deg) rotateZ(1.8deg); }
        }
        @keyframes mif-pop {
          0% { transform: scale3d(1, 1, 1) rotateY(0); }
          38% { transform: scale3d(1.22, 1.22, 1.22) rotateY(200deg); }
          100% { transform: scale3d(1, 1, 1) rotateY(360deg); }
        }
        .mif-in { animation: mif-in 1.15s cubic-bezier(0.23, 1, 0.32, 1) both; transform-style: preserve-3d; }
        .mif-float { animation: mif-float ease-in-out infinite alternate; transform-style: preserve-3d; }
        .mif-pop { animation: mif-pop 0.72s cubic-bezier(0.34, 1.3, 0.5, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .mif-in { animation: none; opacity: 1; }
          .mif-float, .mif-pop { animation: none; }
        }
      `}</style>

      {TILES.map((t, i) => {
        const spot = SPOTS[i];
        const size = Math.round(t.size * spot.s);
        return (
          <div
            key={t.id}
            className="mif-pos"
            style={{
              position: "absolute",
              left: `${spot.x}%`,
              top: `${spot.y}%`,
              opacity: spot.o,
              transform: `translate3d(0, calc(var(--mif-sy, 0px) * ${spot.d}), 0)`,
              willChange: "transform",
            }}
          >
            <div className="mif-in" style={{ animationDelay: `${0.55 + i * 0.09}s` }}>
              <div
                className="mif-float"
                style={{ animationDuration: `${4.8 + (i % 5) * 0.7}s`, animationDelay: `${-(i * 1.13)}s` }}
              >
                {/* remount on pop so the animation restarts cleanly */}
                <div
                  key={pops[i]}
                  className={pops[i] > 0 ? "mif-pop" : undefined}
                  onPointerDown={() => pop(i)}
                  style={{ ...tileStyle(size), pointerEvents: "auto", touchAction: "manipulation" }}
                >
                  {t.icon(Math.round(size * 0.46))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
