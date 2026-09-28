import { useEffect, useRef, type ReactNode } from "react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";

/* --------------------------------------------------------------------------
   The four moving parts this page needs. Everything else is CSS.

   All of them collapse to a correct static state under prefers-reduced-motion:
   the counter prints its final value, the tilt stops listening, the parallax
   stops transforming and the reveal renders in place. Nothing is hidden
   behind a transition that never runs.
   -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

const money = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/**
 * A figure that counts up the first time it is seen.
 *
 * The value is written straight into the node. At sixty frames a second a
 * re-render per frame to retype four characters is waste, and React does not
 * need to own a number nobody else reads.
 */
export function CountUp({
  to,
  format = money,
  duration = 1.7,
  className,
}: {
  to: number;
  format?: (n: number) => string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      el.textContent = format(to);
      return;
    }
    if (!seen) return;
    const run = animate(0, to, {
      duration,
      ease: EASE,
      onUpdate: (v) => {
        el.textContent = format(v);
      },
    });
    return () => run.stop();
  }, [seen, reduce, to, duration, format]);

  return (
    <span className={className} ref={ref}>
      {format(reduce ? to : 0)}
    </span>
  );
}

/** The sphere, drifting at its own rate against the page. */
export function Sphere({
  className,
  depth = 90,
  alt = "",
}: {
  className?: string;
  /** how far it travels across the whole scroll, in px */
  depth?: number;
  alt?: string;
}) {
  const ref = useRef<HTMLImageElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [depth, -depth]);
  const smooth = useSpring(y, { stiffness: 90, damping: 24, mass: 0.6 });

  return (
    <motion.img
      ref={ref}
      className={className}
      src="/headroom/sphere.webp"
      alt={alt}
      width={560}
      height={560}
      decoding="async"
      style={reduce ? undefined : { y: smooth }}
      aria-hidden={alt ? undefined : true}
    />
  );
}

/**
 * Tilts its child toward the pointer. Small angles only — past about eight
 * degrees a phone mockup stops reading as a photograph of a device and starts
 * reading as a piece of 3D clip art.
 */
export function Tilt({
  children,
  max = 8,
  className,
}: {
  children: ReactNode;
  max?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 140, damping: 18 });
  const sry = useSpring(ry, { stiffness: 140, damping: 18 });

  useEffect(() => {
    const el = ref.current;
    if (!el || reduce) return;
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ry.set(((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * max);
      rx.set(((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * -max);
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
  }, [max, reduce, rx, ry]);

  return (
    <div className={className} ref={ref}>
      <motion.div
        className="frame"
        style={reduce ? undefined : { rotateX: srx, rotateY: sry }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Arrives once, on the way in. */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.62, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
