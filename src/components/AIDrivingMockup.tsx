import Component3 from "../imports/3";
import { motion } from "motion/react";

export function AIDrivingMockup() {
  return (
    <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden flex items-center justify-center">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/20 rounded-full blur-[100px]"
        animate={{
          x: [0, -80, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-[15%] left-[10%] w-12 h-12 border-2 border-blue-400/40 rounded-lg"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      <motion.div
        className="absolute top-[25%] right-[12%] w-16 h-16 border-2 border-cyan-400/30 rounded-full"
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-[20%] left-[15%] w-10 h-10 bg-gradient-to-br from-blue-400/20 to-cyan-400/20 rounded-lg"
        animate={{
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />

      {/* Phone mockup container */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Phone frame with glow */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 via-cyan-500/30 to-blue-500/30 rounded-[60px] blur-2xl" />
          
          {/* Phone frame */}
          <div className="relative bg-gradient-to-b from-slate-800 to-slate-900 rounded-[50px] p-3 shadow-2xl border border-slate-700/50">
            {/* Phone notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-3xl z-20" />
            
            {/* Screen container */}
            <div className="relative bg-black rounded-[42px] overflow-hidden shadow-inner">
              {/* Screen content with scale to fit */}
              <div className="w-[390px] h-[844px] relative overflow-hidden">
                <div className="absolute inset-0 scale-[1.05] origin-center">
                  <Component3 />
                </div>
              </div>
            </div>
          </div>

          {/* Side buttons */}
          <div className="absolute right-0 top-[120px] w-1 h-12 bg-slate-700 rounded-l-sm" />
          <div className="absolute right-0 top-[180px] w-1 h-16 bg-slate-700 rounded-l-sm" />
          <div className="absolute right-0 top-[250px] w-1 h-16 bg-slate-700 rounded-l-sm" />
          <div className="absolute left-0 top-[160px] w-1 h-8 bg-slate-700 rounded-r-sm" />
        </div>

        {/* Floating AI badge */}
        <motion.div
          className="absolute -top-8 -right-8 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full shadow-lg border border-white/20"
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <span className="font-mono text-sm">AI Powered</span>
        </motion.div>

        {/* Feature highlights */}
        <motion.div
          className="absolute -bottom-6 -left-6 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 px-4 py-2 rounded-2xl shadow-xl"
          animate={{
            x: [0, 5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <p className="text-cyan-400 text-xs font-mono">Smart Behavior Learning</p>
        </motion.div>

        <motion.div
          className="absolute -bottom-6 -right-6 bg-slate-800/90 backdrop-blur-sm border border-slate-700/50 px-4 py-2 rounded-2xl shadow-xl"
          animate={{
            x: [0, -5, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          <p className="text-blue-400 text-xs font-mono">Distraction Free Driving</p>
        </motion.div>
      </motion.div>

      {/* Particle effects */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
