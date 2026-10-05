import { useEffect, useRef } from "react";
import { createScene, type DotsOptions } from "./engine";

/* --------------------------------------------------------------------------
   One dot graphic. Plays once, the first time it is seen, then holds.

   The canvas is decorative; the sentence that explains it lives in the
   markup beside it, so `label` is what a screen reader gets and the picture
   is hidden. A graphic nobody can read is not evidence.
   -------------------------------------------------------------------------- */

export function Dots({
  label,
  className,
  ...opts
}: DotsOptions & { label: string; className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const cv = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const h = host.current;
    const c = cv.current;
    if (!h || !c) return;

    const scene = createScene(c, h, opts);
    if (!scene) return;

    /* play on first sight; pause the moment it leaves, so a page of these
       never has more than the visible one running */
    const io = new IntersectionObserver(
      ([e]) => (e.isIntersecting ? scene.start() : scene.stop()),
      { threshold: 0.2 }
    );
    io.observe(h);

    const onVis = () => {
      if (document.hidden) scene.stop();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      scene.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.preset, opts.count, opts.keep, opts.duration]);

  return (
    <div className={`dots ${className ?? ""}`} ref={host} role="img" aria-label={label}>
      <canvas ref={cv} aria-hidden="true" />
    </div>
  );
}
