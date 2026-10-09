import { useEffect, useRef } from "react";
import { createField, type FieldHandle } from "../lib/field";

/**
 * Mounts the 3D background.
 *
 * `external` hands the loop and the scroll value to the page. The Print Run
 * homepage uses it so the field runs on the same clock as everything else and
 * reads the same smoothed scroll position Lenis produces, rather than keeping
 * a second rAF loop and a second smoothing curve of its own.
 */
export function Field({ onReady, external }: { onReady?: (h: FieldHandle) => void; external?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const handle = createField(ref.current, { external });
    onReady?.(handle);
    return () => handle.destroy();
  }, [onReady, external]);

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
