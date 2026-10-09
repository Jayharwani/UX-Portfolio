import { useEffect, useRef, type MutableRefObject } from "react";
import { onFrame } from "../../lib/clock";
import type { Stage } from "../../lib/stage";
import jhSvg from "../../assets/emblems/jh.svg?raw";

/* --------------------------------------------------------------------------
   THE EMBLEM SLOT.

   One of two things sits here: a real extruded solid on the full tier, or the
   same mark drawn flat on every other tier.

   THE FLAT VERSION IS NOT A DEGRADED PHOTOGRAPH OF THE 3D ONE. The spec
   called for a pre-rendered poster, which would mean an image pipeline, a
   build step and a 40 kB download to show a shape that is already in the
   bundle as 123 bytes of path data. A vector mark loses nothing by being
   drawn flat and gains a crisp edge at every size, so the lite tier gets the
   same emblem with the lighting taken off rather than a blurry picture of the
   lighting. It is also one fewer request before first paint.

   three.js is behind a dynamic import and the import only runs once the tier
   is decided and says full. Mounting speculatively and unmounting on the
   verdict would make a weak machine pay the entire download, compile and
   context creation and keep none of it, which is the exact mistake
   perfTier.ts was written to avoid.
   -------------------------------------------------------------------------- */

export type EmblemHandle = {
  box: HTMLElement | null;
  stage: Stage | null;
  /** whether WebGL is actually running, as opposed to the flat mark */
  live: boolean;
};

/** how much bigger the emblem gets at the centre of the intro */
export const INTRO_SCALE = 1.5;

export function EmblemSlot({
  handle,
  full,
  onReady,
}: {
  handle: MutableRefObject<EmblemHandle>;
  full: boolean;
  onReady?: () => void;
}) {
  const box = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    handle.current.box = box.current;
  });

  useEffect(() => {
    if (!full || !canvas.current || !box.current) return;
    let stage: Stage | null = null;
    let stopFrame: (() => void) | null = null;
    let io: IntersectionObserver | null = null;
    let ro: ResizeObserver | null = null;
    let cancelled = false;
    const el = box.current;
    const cv = canvas.current;

    const fine = window.matchMedia("(pointer: fine)").matches;
    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      stage?.setPointer((e.clientX - (r.left + r.width / 2)) / r.width, (e.clientY - (r.top + r.height / 2)) / r.height);
    };

    import("../../lib/stage")
      .then(({ createStage }) => {
        if (cancelled) return;
        const size = el.clientWidth || 280;
        stage = createStage(cv, jhSvg, size * INTRO_SCALE);
        handle.current.stage = stage;
        handle.current.live = true;

        stopFrame = onFrame((_t, deltaMs) => stage?.tick(deltaMs / 1000));

        /* An emblem rendering behind the Issue Run is work nobody can see. */
        io = new IntersectionObserver(
          (entries) => {
            for (const e of entries) (e.isIntersecting ? stage?.wake : stage?.sleep)?.call(stage);
          },
          { threshold: 0 },
        );
        io.observe(el);

        ro = new ResizeObserver(() => stage?.resize((el.clientWidth || 280) * INTRO_SCALE));
        ro.observe(el);

        if (fine) window.addEventListener("pointermove", onPointer, { passive: true });

        return stage.ready;
      })
      .then(() => {
        if (!cancelled) onReady?.();
      })
      .catch(() => {
        /* No WebGL, a blocked chunk, or a shader that will not compile. The
           flat mark is already in the DOM underneath, so there is nothing to
           recover: just stop claiming to be live. */
        handle.current.live = false;
        if (!cancelled) onReady?.();
      });

    return () => {
      cancelled = true;
      stopFrame?.();
      io?.disconnect();
      ro?.disconnect();
      window.removeEventListener("pointermove", onPointer);
      stage?.destroy();
      handle.current.stage = null;
      handle.current.live = false;
    };
  }, [full, handle, onReady]);

  return (
    <div className="pr-emblem" ref={box} aria-hidden="true">
      {/* always present: it is the lite tier's emblem and the full tier's
          fallback if the context is lost mid-session */}
      <div className="pr-emblem-flat" dangerouslySetInnerHTML={{ __html: jhSvg }} />
      {full ? <canvas className="pr-emblem-gl" ref={canvas} /> : null}
    </div>
  );
}
