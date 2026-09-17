import { useCallback, useRef } from "react";
import { Field } from "./Field";
import type { FieldHandle } from "../lib/field";
import { TitleSequence } from "./v2/TitleSequence";
import { Rail } from "./v2/Rail";
import { Hero } from "./v2/Hero";
import { RouteMap } from "./v2/RouteMap";
import { Work } from "./v2/Work";
import { Contact } from "./v2/Contact";
import "../styles/v2.css";
import "../styles/v2-ported.css";

/* --------------------------------------------------------------------------
   THE HOMEPAGE — the handoff design.

   ONE HANDLE FOR THE WHOLE PAGE. The field owns the only rAF loop and the
   only scroll listener here, and hands back getScroll / getVelocity /
   setAccent. The hero reads its exit from the smoothed scroll rather than
   from window.scrollY, and the rail and the work list push the accent into
   the canvas lights through setAccent. Six sections sharing one loop is the
   difference between a page that animates and six that compete.

   The ready callback is memoised because Field's effect depends on it; an
   inline arrow would tear down and rebuild the canvas on every render.

   Native scroll stays native. There is no transform wrapper — CLAUDE.md is
   explicit that one would break the sticky preview panel in the work section,
   and smoothness comes from lerping the scroll VALUE, which field.ts does.
   -------------------------------------------------------------------------- */

export function HomeV2() {
  const field = useRef<FieldHandle | null>(null);

  const onReady = useCallback((h: FieldHandle) => {
    field.current = h;
  }, []);

  const onHue = useCallback((rgb: [number, number, number]) => {
    field.current?.setAccent(rgb);
  }, []);

  return (
    <div className="v2">
      <Field onReady={onReady} />
      <div className="vig" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <TitleSequence />
      <Rail onHue={onHue} />

      <div className="stage">
        <div className="wrap">
          <Hero field={field} />
          <RouteMap />
          <Work onHue={onHue} />
          <Contact />
        </div>
      </div>
    </div>
  );
}

export default HomeV2;
