import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

export function CursorGlow() {
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <motion.div
      className="pointer-events-none fixed z-[9998]"
      style={{
        x,
        y,
        width: '600px',
        height: '600px',
        marginLeft: '-300px',
        marginTop: '-300px',
        background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, rgba(167,139,250,0.03) 30%, transparent 70%)',
        borderRadius: '50%',
      }}
    />
  );
}
