import type { RefObject } from "react";
import { FRAGMENTS, fragmentsFor, type Fragment } from "../../../data/heroFragments";
import type { FitMode } from "./fit";

/* --------------------------------------------------------------------------
   EVERYTHING THAT ONLY EXISTS WHILE THE PAGE IS INTRODUCING ITSELF.

   The line of light the card is born out of, the mess of everyday problems
   it pulls in, the scribble behind them, and the control that ends the whole
   thing. All of it is inert markup: the timeline in intro.ts owns every
   position and every opacity, and this file owns none.

   IT IS RENDERED ONCE AND NEVER RE-RENDERED. A fragment that re-rendered
   mid-timeline would drop the transform GSAP had put on it, so what is here
   is keyed off the mode and nothing else.
   -------------------------------------------------------------------------- */

const STARS = "★☆☆☆☆";

function Piece({ f }: { f: Fragment }) {
  const tone = f.accent ? { "--hc-frag": `var(--accent-${f.accent})` } as React.CSSProperties : undefined;
  if (f.kind === "receipt") {
    return (
      <div className="hc-frag hc-frag--receipt" data-frag={f.key}>
        {f.lines?.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    );
  }
  if (f.kind === "review") {
    return (
      <div className="hc-frag hc-frag--review" data-frag={f.key} style={tone}>
        <i>{STARS}</i>
        {f.text}
      </div>
    );
  }
  if (f.kind === "toast") {
    return (
      <div className="hc-frag hc-frag--toast" data-frag={f.key} style={tone}>
        <i>!</i>
        {f.text}
      </div>
    );
  }
  if (f.kind === "badge") {
    return (
      <div className="hc-frag hc-frag--badge" data-frag={f.key} style={tone}>
        {f.text}
      </div>
    );
  }
  return (
    <div className="hc-frag hc-frag--note" data-frag={f.key} style={tone}>
      {f.text}
    </div>
  );
}

export function IntroLayer({
  mode,
  bag,
  line,
  scribble,
  skip,
  onSkip,
}: {
  mode: FitMode;
  bag: RefObject<Map<string, HTMLElement>>;
  line: RefObject<HTMLDivElement | null>;
  scribble: RefObject<SVGPathElement | null>;
  skip: RefObject<HTMLButtonElement | null>;
  onSkip: () => void;
}) {
  const live = new Set(fragmentsFor(mode).map((f) => f.key));
  return (
    <div className="hc-intro" data-intro-layer>
      <div className="hc-line" ref={line} aria-hidden="true" />

      {/* A TANGLE, NOT A DOODLE. It draws itself behind the mess in the time
          the fragments are landing, so the noise has a shape before it has
          any content. */}
      <svg className="hc-scribble" viewBox="0 0 520 300" aria-hidden="true" focusable="false">
        <path
          ref={scribble}
          d="M34 168c44-84 118-46 142 12s-74 118-20 150 148-20 160-88-96-96-52-150 164-8 176 62-120 96-66 148 160 6 142 68-178 42-236 6-84-66-150-56-92-70-96-152zm96 10c58-52 150-18 160 52s-104 96-150 60-68-60-10-112zm190 24c46-34 118 4 108 64s-102 76-140 36-14-66 32-100z"
        />
      </svg>

      <div className="hc-mess" aria-hidden="true">
        {FRAGMENTS.filter((f) => live.has(f.key)).map((f) => (
          <div
            key={f.key}
            className="hc-frag-at"
            data-frag-at={f.key}
            ref={(el) => {
              if (el) bag.current.set(f.key, el);
              else bag.current.delete(f.key);
            }}
          >
            {/* THREE LEVELS, ONE OWNER EACH. The outer is placed and then
                travels, the middle does the centring once and never moves
                again, and the inner pops and shrinks. Collapsing any two of
                them puts GSAP and a stylesheet on the same transform, and the
                tween pins its captured start value inline, so the stylesheet
                can never win it back. */}
            <div className="hc-frag-mid">
              <Piece f={f} />
            </div>
          </div>
        ))}
      </div>

      {/* THE WAY OUT IS A REAL BUTTON, and it is the first thing in the tab
          order of the stage, because somebody who wants to skip an animation
          should not have to wait for it to find out how. */}
      <button className="hc-skip" type="button" ref={skip} onClick={onSkip}>
        Skip intro
      </button>
    </div>
  );
}
