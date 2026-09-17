import { useCallback, useRef } from "react";
import { Field } from "./Field";
import type { FieldHandle } from "../lib/field";
import "../styles/v2.css";

/* ──────────────────────────────────────────────────────────────────────────
   HOME V2 — the handoff design, under construction.

   Lives at /v2 while it is built section by section, so the homepage at /
   keeps working until this is ready to replace it. BUILD.md step by step;
   reference/index.html is the target.

   ONE HANDLE FOR THE WHOLE PAGE. The field owns the only rAF loop and the
   only scroll listener on this page, and hands back getScroll / getVelocity /
   setAccent. Every section that needs the camera, the smoothed scroll or the
   accent reads them from here rather than starting a loop of its own — which
   is the difference between one page that animates and six that compete.

   The callback is memoised because Field's effect depends on it; an inline
   arrow would tear down and rebuild the canvas on every parent render.
   ────────────────────────────────────────────────────────────────────────── */

export function HomeV2() {
  const field = useRef<FieldHandle | null>(null);
  const onReady = useCallback((h: FieldHandle) => {
    field.current = h;
  }, []);

  return (
    <div className="v2">
      <Field onReady={onReady} />
      <div className="grain" aria-hidden="true" />
      <div className="vig" aria-hidden="true" />

      <main className="page">
        {/* sections land here, one BUILD step at a time */}
        <section
          style={{
            minHeight: "100svh",
            display: "grid",
            placeItems: "center",
            padding: "0 var(--gut)",
          }}
        >
          <p className="mono" style={{ fontSize: 10.5, letterSpacing: ".12em", opacity: 0.5 }}>
            STEP 1 · FIELD
          </p>
        </section>
        <section style={{ minHeight: "200svh" }} aria-hidden="true" />
      </main>
    </div>
  );
}

export default HomeV2;
