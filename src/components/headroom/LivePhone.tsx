import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/* --------------------------------------------------------------------------
   THE HERO PHONE — the real Home screen, with its number alive.

   The product should be the hero object, not a sphere. So this is the actual
   screenshot in a frame, with one live element: the safe-to-spend figure
   counts up in place, over a patch of the card's own white.

   THE GEOMETRY IS MEASURED, NOT GUESSED. In the 446x1000 capture the figure
   occupies x 52-277, y 248-318. The green "On track" pill sits at y 214 and
   was contaminating a naive colour sample, which is why the numbers below
   come from a row profile rather than a bounding box. Everything is
   expressed against the frame's own width in container units, so the overlay
   tracks the phone at any size.

   The card behind the figure is pure #FFFFFF, so the patch that hides the
   baked-in number is invisible.
   -------------------------------------------------------------------------- */

const SHOT = { w: 446, h: 1000 };
const NUM = { x: 52, y: 245, w: 225, h: 74 };

/*
 * Geist is wider than the face baked into the capture, so at the cap height
 * that matches, "$1,730" overflowed its patch and clipped to "$1.73".
 * Shrinking to fit the width would have cost a third of the height, so the
 * figure is condensed instead.
 *
 * THE AMOUNT IS MEASURED, NOT WRITTEN DOWN. The first attempt hardcoded
 * 0.738 from a reading taken before the webfont had swapped in; once Geist
 * actually loaded, the same constant squeezed the figure to 130px against a
 * 163px target. Measuring after `fonts.ready` and on resize survives the
 * swap, a font change, and any width.
 */

/** as a share of the image, which is also a share of the frame */
const pc = (v: number, of: number) => `${(v / of) * 100}%`;

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

export function LivePhone({ to = 1730, tilt = 6 }: { to?: number; tilt?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const out = useRef<HTMLSpanElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const [squeeze, setSqueeze] = useState(1);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.4 });

  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 20 });
  const sry = useSpring(ry, { stiffness: 140, damping: 20 });

  /* fit the condensed figure to the width of the one it replaces */
  useEffect(() => {
    const el = out.current;
    const scr = screen.current;
    if (!el || !scr) return;
    let dead = false;
    const fit = () => {
      if (dead || !el.parentElement) return;
      const cs = getComputedStyle(el);
      const probe = document.createElement("span");
      probe.style.cssText =
        `position:absolute;visibility:hidden;white-space:nowrap;font-family:${cs.fontFamily};` +
        `font-weight:${cs.fontWeight};font-size:${cs.fontSize};letter-spacing:${cs.letterSpacing};` +
        `font-variant-numeric:tabular-nums`;
      probe.textContent = money(to);
      el.parentElement.appendChild(probe);
      const natural = probe.getBoundingClientRect().width;
      probe.remove();
      const target = (NUM.w / SHOT.w) * scr.getBoundingClientRect().width;
      if (natural > 0) setSqueeze(Math.min(1, target / natural));
    };
    document.fonts?.ready.then(fit).catch(fit);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(scr);
    return () => {
      dead = true;
      ro.disconnect();
    };
  }, [to]);

  useEffect(() => {
    const el = out.current;
    if (!el) return;
    const fmt = money;
    if (reduce) {
      el.textContent = fmt(to);
      return;
    }
    if (!seen) return;
    const run = animate(0, to, {
      duration: 2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        el.textContent = fmt(v);
      },
    });
    return () => run.stop();
  }, [seen, reduce, to]);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * tilt);
      rx.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * -tilt);
    };
    const leave = () => {
      rx.set(0);
      ry.set(0);
    };
    window.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [reduce, tilt, rx, ry]);

  return (
    <div className="livePhone" ref={ref}>
      <motion.div className="frame" style={reduce ? undefined : { rotateX: srx, rotateY: sry }}>
        <div className="screen" ref={screen}>
          <img
            src="/headroom/today-healthy.png"
            alt="Headroom's home screen: safe to spend, marked On track, with what's coming up listed underneath"
            width={SHOT.w}
            height={SHOT.h}
            decoding="async"
          />
          {/* the live figure, over the card's own white */}
          <span
            className="liveNum"
            aria-hidden="true"
            style={{
              left: pc(NUM.x, SHOT.w),
              top: pc(NUM.y, SHOT.h),
              width: pc(NUM.w + 18, SHOT.w),
              height: pc(NUM.h, SHOT.h),
            }}
          >
            <span
              ref={out}
              style={{
                display: "inline-block",
                transform: `scaleX(${squeeze})`,
                transformOrigin: "left center",
              }}
            >
              {reduce ? "$1,730" : "$0"}
            </span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
