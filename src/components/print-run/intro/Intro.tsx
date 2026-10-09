import { useEffect, useRef, type MutableRefObject } from "react";
import { getLenis } from "../SmoothScroll";
import type { EmblemHandle } from "../EmblemSlot";
import { buildIntro } from "./timeline";
import { onFrame } from "../../../lib/clock";
import { remember, type Mode } from "./mode";
import jhSvg from "../../../assets/emblems/jh.svg?raw";

/* --------------------------------------------------------------------------
   THE INTRO OVERLAY.

   Markup and control. The choreography is in timeline.ts.

   ANY INPUT SKIPS IT. pointerdown, keydown, wheel and touchstart, all
   passive, plus a real button that is the first thing in the tab order. An
   intro you cannot leave is not a flourish, it is a toll, and someone who has
   already decided they want the work should never wait for a decoration.

   THE OVERLAY IS aria-hidden AND THE BUTTON IS NOT. The plates, the mark and
   the flash are decoration with nothing to announce; the skip control is the
   one thing in here that a screen reader must find, so it sits outside.

   A HIDDEN TAB FINISHES IT. gsap.ticker parks when the tab hides, so an intro
   left running in a background tab would be waiting, mid-flash, whenever
   someone came back to it. Finishing immediately is the honest behaviour: by
   then they have been elsewhere, and the opening is not worth replaying.

   THE TIMELINE IS DRIVEN BY WALL CLOCK, NOT BY THE TICKER. Letting it advance
   a frame at a time makes its length depend on how fast the machine is: the
   three.js chunk parsing and the emblem's shaders compiling block for a few
   hundred milliseconds right in the middle of it, and every one of those
   milliseconds was being added to the opening rather than absorbed by it.
   3.2 seconds is a budget of someone's attention, so it is measured against
   the clock on the wall. A machine that stalls drops frames out of the
   opening; it does not get to charge the reader for them.
   -------------------------------------------------------------------------- */

const PLATE_ACCENTS = ["teal", "mint", "cyan", "gold"] as const;
const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

export function Intro({
  mode,
  emblem,
  onDone,
}: {
  mode: Mode;
  emblem: MutableRefObject<EmblemHandle>;
  onDone: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const skipBtn = useRef<HTMLButtonElement>(null);
  const jump = useRef<() => void>(() => {});

  useEffect(() => {
    if (mode === "none" || !root.current) {
      onDone();
      return;
    }

    const host = root.current;
    const lenis = getLenis();
    lenis?.stop();
    skipBtn.current?.focus({ preventScroll: true });

    let timeline: ReturnType<typeof buildIntro> | null = null;
    let finished = false;

    let stopFrame: () => void = () => {};
    const skip = () => timeline?.progress(1);
    const onHide = () => {
      if (document.hidden) skip();
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      stopFrame();
      SKIP_EVENTS.forEach((type) => window.removeEventListener(type, skip));
      window.removeEventListener("resize", skip);
      document.removeEventListener("visibilitychange", onHide);
      lenis?.start();
      remember(mode);
      onDone();
    };

    jump.current = skip;
    timeline = buildIntro({ mode, root: host, emblem, onFinish: finish });
    timeline.pause();

    const started = performance.now();
    stopFrame = onFrame(() => {
      if (!timeline) return;
      const at = (performance.now() - started) / 1000;
      if (at >= timeline.duration()) {
        timeline.progress(1);
        return;
      }
      timeline.time(at);
    });

    SKIP_EVENTS.forEach((type) => window.addEventListener(type, skip, { passive: true }));
    /* A resize mid-intro invalidates every viewport-relative offset the plates
       were given. Finishing beats replaying from a position that no longer
       exists. */
    window.addEventListener("resize", skip, { passive: true });
    document.addEventListener("visibilitychange", onHide);

    return () => {
      timeline?.kill();
      finish();
    };
  }, [mode, emblem, onDone]);

  if (mode === "none") return null;

  return (
    <>
      <div className="pr-intro" ref={root} aria-hidden="true">
        <div className="pr-veil" />

        <svg className="pr-regmark" viewBox="0 0 120 120" fill="none">
          <circle className="pr-reg-ring" cx="60" cy="60" r="34" stroke="currentColor" strokeWidth="1.5" />
          <rect className="pr-reg-arm" x="59.25" y="8" width="1.5" height="34" fill="currentColor" />
          <rect className="pr-reg-arm" x="59.25" y="78" width="1.5" height="34" fill="currentColor" />
          <rect className="pr-reg-arm" x="8" y="59.25" width="34" height="1.5" fill="currentColor" />
          <rect className="pr-reg-arm" x="78" y="59.25" width="34" height="1.5" fill="currentColor" />
        </svg>

        <div className="pr-plates">
          {PLATE_ACCENTS.map((accent) => (
            <span key={accent} className="pr-plate" data-accent={accent} dangerouslySetInnerHTML={{ __html: jhSvg }} />
          ))}
        </div>

        <span className="pr-ring" />
        <span className="pr-screen" />
        <span className="pr-flash" />
      </div>

      <button className="pr-skip-intro" type="button" ref={skipBtn} onClick={() => jump.current()}>
        Skip intro
      </button>
    </>
  );
}
