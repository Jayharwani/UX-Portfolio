import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Web } from "./Web";

/* ──────────────────────────────────────────────────────────────────────────
   Three webs on three planes inside one perspective container.

   The parallax is a single transform on the stage. Because the planes sit at
   different translateZ, the perspective divide produces correct differential
   motion for free — no per-plane maths, one style write per frame.

   Two constraints do most of the work:

   · Maximum 3.2 degrees. Beyond that it stops being depth and becomes a tilt
     gimmick, which is the most common way this effect is ruined.

   · Lerp at 0.06 so it TRAILS the cursor. Instant tracking is the clearest
     tell of an amateur implementation, and it is what everyone reaches for
     first.

   The headline lives outside this container, deliberately. Text inside a
   perspective transform skews and its rasterisation goes soft, which would
   trade a legible headline for a parallax nobody asked for.
   ────────────────────────────────────────────────────────────────────────── */

const MAX_DEG = 3.2;
const LERP = 0.06;

export default function WebStage({ interactive }: { interactive: boolean }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || !interactive) return;

    let rotY = 0;
    let rotX = 0;
    let targetY = 0;
    let targetX = 0;
    let onScreen = true;

    const onMove = (e: PointerEvent) => {
      const cx = e.clientX / Math.max(1, window.innerWidth);
      const cy = e.clientY / Math.max(1, window.innerHeight);
      targetY = (cx - 0.5) * MAX_DEG;
      targetX = -(cy - 0.5) * (MAX_DEG * 0.62);
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const io = new IntersectionObserver(([en]) => (onScreen = en.isIntersecting), { rootMargin: "80px" });
    io.observe(stage);

    /* rides the one existing ticker rather than opening a second driver */
    const tick = () => {
      if (!onScreen || document.hidden) return;
      const dy = targetY - rotY;
      const dx = targetX - rotX;
      /* settle completely rather than jittering forever a hundredth of a
         degree from target */
      if (Math.abs(dy) < 0.001 && Math.abs(dx) < 0.001) return;
      rotY += dy * LERP;
      rotX += dx * LERP;
      stage.style.transform = `rotateY(${rotY.toFixed(3)}deg) rotateX(${rotX.toFixed(3)}deg)`;
    };
    gsap.ticker.add(tick);

    return () => {
      gsap.ticker.remove(tick);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [interactive]);

  return (
    <div className="web-stage" aria-hidden="true">
      <div ref={stageRef} className="web-stage__inner">
        {/* primary, top right. Tucked under the nav: the nav sits above it in
            z-order and the web is faint enough that the overlap reads as depth
            rather than as collision. The top-LEFT corner stays clear for the
            name lockup — one open corner keeps the composition from feeling
            boxed in. */}
        <div className="web-plane web--primary">
          <Web size={380} seed={7} depth="primary" />
        </div>
        <div className="web-plane web--secondary">
          <Web size={260} seed={23} depth="secondary" />
        </div>
        <div className="web-plane web--tertiary">
          <Web size={180} seed={51} depth="tertiary" />
        </div>
      </div>
    </div>
  );
}
