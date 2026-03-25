import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[9999]"
      style={{
        scaleX,
        transformOrigin: '0%',
        height: '2px',
        background: 'linear-gradient(90deg, #2DD4BF, #A78BFA, #FBBF24)',
      }}
    />
  );
}
