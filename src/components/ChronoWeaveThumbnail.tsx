import { motion } from "motion/react";
import { ChronoWeaveHeroCard } from "./ChronoWeaveHeroCard";

export function ChronoWeaveThumbnail() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
    >
      <ChronoWeaveHeroCard />
    </motion.div>
  );
}