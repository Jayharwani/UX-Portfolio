import { useEffect, useRef } from 'react';
import { createField, type FieldHandle } from '../lib/field';

/**
 * Mounts the 3D background. Everything else on the page reads the accent and
 * the smoothed scroll value through this handle, so there is only ever one
 * rAF loop and one scroll listener on the page.
 */
export function Field({ onReady }: { onReady?: (h: FieldHandle) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const handle = createField(ref.current);
    onReady?.(handle);
    return () => handle.destroy();
  }, [onReady]);

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
