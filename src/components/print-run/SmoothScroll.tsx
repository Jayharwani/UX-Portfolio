import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, useLenis, type LenisRef } from "lenis/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";
import { onFrame } from "../../lib/clock";
import "lenis/dist/lenis.css";

/* --------------------------------------------------------------------------
   SMOOTH SCROLL.

   CLAUDE.md bans a transform-based smooth-scroll wrapper, and this is not
   one. Lenis animates the real window scroll position, so position: sticky,
   ScrollTrigger pinning, anchor links and the browser's own scrollbar all
   keep working. The rule was about wrappers, not about smoothing.

   NO SECOND SMOOTHING CURVE. The background field used to keep its own
   scroll listener and its own lerp. Two curves on one page means the stars
   lag the type by a different amount at every scroll speed, which reads as
   the canvas being detached from the page. Lenis owns the value now and the
   field is handed it.

   autoRaf is off: the clock drives it, like everything else.

   respectReducedMotion is left at its default of true, which turns smoothing
   off and makes programmatic scrolls jump. That is the correct reduced-motion
   behaviour and it is one less branch to maintain.
   -------------------------------------------------------------------------- */

gsap.registerPlugin(ScrollTrigger);

/** Module-level handle, for the intro timeline and the chapter tabs, which
 *  are not React components and should not be handed a ref. */
let instance: ReturnType<typeof useLenis> = undefined;
export const getLenis = () => instance;

function Bridge() {
  /* ScrollTrigger reads scroll on its own schedule. Telling it to update from
     inside Lenis's callback is what keeps a pinned section from trailing the
     smoothed value by a frame. */
  const lenis = useLenis(ScrollTrigger.update);
  useEffect(() => {
    instance = lenis;
    return () => {
      instance = undefined;
    };
  }, [lenis]);
  return null;
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const ref = useRef<LenisRef>(null);

  useEffect(() => onFrame((timeSec) => ref.current?.lenis?.raf(timeSec * 1000)), []);

  /* ScrollTrigger measures the document once and caches it. The covers carry
     web fonts and the mockups mount after their issue activates, so the page
     height is not final at mount. */
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    const t = window.setTimeout(refresh, 1200);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <ReactLenis
      root
      ref={ref}
      options={{
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        syncTouch: false,
        anchors: { offset: -24 },
        stopInertiaOnNavigate: true,
      }}
    >
      <Bridge />
      {children}
    </ReactLenis>
  );
}
