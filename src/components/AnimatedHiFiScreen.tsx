import { motion } from "motion/react";
import { useEffect, useState } from "react";

// Animated wrapper for the high-fidelity screen
export function AnimatedHiFiScreen({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Animated SVG overlay for diagram connections */}
      <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }}>
        {/* Animated connecting lines */}
        {isVisible && (
          <>
            {/* Line 1 - top horizontal */}
            <motion.line
              x1="139"
              y1="104"
              x2="187"
              y2="104"
              stroke="#4a5565"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
            
            {/* Line 2 - diagonal top right */}
            <motion.line
              x1="206"
              y1="83"
              x2="246"
              y2="73"
              stroke="#4a5565"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1 }}
            />
            
            {/* Line 3 - bottom left diagonal */}
            <motion.line
              x1="112"
              y1="180"
              x2="144"
              y2="174"
              stroke="#4a5565"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            />
            
            {/* Line 4 - bottom horizontal */}
            <motion.line
              x1="182"
              y1="199"
              x2="230"
              y2="199"
              stroke="#4a5565"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 1.4 }}
            />
          </>
        )}
      </svg>

      {/* Main content with staggered animations */}
      <div className="relative" style={{ zIndex: 2 }}>
        {/* AI Card - Main Center */}
        <motion.div
          className="absolute left-[91px] top-[56px] w-[144px] h-[80px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 200 }}
        >
          <motion.div
            animate={{
              boxShadow: [
                "0px 10px 15px -3px rgba(43, 127, 255, 0.3)",
                "0px 15px 25px -3px rgba(43, 127, 255, 0.5)",
                "0px 10px 15px -3px rgba(43, 127, 255, 0.3)",
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Floating Icons with pulse animations */}
        {/* Blue Icon - Left */}
        <motion.div
          className="absolute left-[64px] top-[32px] w-[32px] h-[32px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            animate={{
              y: [0, -8, 0],
              rotate: [0, 5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Green Icon - Top Right */}
        <motion.div
          className="absolute left-[246px] top-[16px] w-[32px] h-[32px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, -5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </motion.div>

        {/* Orange Icon - Bottom Left */}
        <motion.div
          className="absolute left-[80px] top-[112px] w-[32px] h-[32px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          <motion.div
            animate={{
              y: [0, 8, 0],
              rotate: [0, -8, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.6,
            }}
          />
        </motion.div>

        {/* Purple Icon - Bottom Right */}
        <motion.div
          className="absolute left-[230px] top-[128px] w-[32px] h-[32px]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          <motion.div
            animate={{
              y: [0, 10, 0],
              rotate: [0, 8, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.9,
            }}
          />
        </motion.div>

        {/* Three step items with staggered entrance */}
        {/* Step 1 - Learn Your Behavior */}
        <motion.div
          className="absolute left-[33px] top-[289px] w-[326px] h-[82px]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Step 2 - Classify Notifications */}
        <motion.div
          className="absolute left-[33px] top-[390px] w-[326px] h-[82px]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Step 3 - Smart Alerts Only */}
        <motion.div
          className="absolute left-[33px] top-[492px] w-[326px] h-[82px]"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          <motion.div
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        {/* Progress bars with fill animation */}
        <motion.div
          className="absolute left-[139px] top-[246px] w-[114px] h-[5px]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          style={{ transformOrigin: "left" }}
        />

        <motion.div
          className="absolute left-[139px] top-[614px] w-[114px] h-[5px]"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 2.2 }}
          style={{ transformOrigin: "left" }}
        />

        {/* Start Setup Button with pulse */}
        <motion.div
          className="absolute left-[24px] top-[769px] w-[343px] h-[48px]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 2.4 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* Render the actual screen content */}
        {children}
      </div>
    </div>
  );
}
