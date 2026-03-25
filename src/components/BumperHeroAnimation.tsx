import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ShoppingCart, CreditCard, Plane, Heart, TrendingUp, Pause, DollarSign } from "lucide-react";

export function BumperHeroAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timeline = [
      { phase: 0, duration: 2500 }, // Shopping cart appears
      { phase: 1, duration: 2500 }, // Bumper pause intervention
      { phase: 2, duration: 2500 }, // Choice comparison
      { phase: 3, duration: 2500 }, // Save money celebration
    ];

    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;

    const scheduleNext = () => {
      const current = timeline[currentIndex];
      
      timeoutId = setTimeout(() => {
        currentIndex = (currentIndex + 1) % timeline.length;
        setPhase(timeline[currentIndex].phase);
        scheduleNext();
      }, current.duration);
    };

    scheduleNext();

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Main Animation Container */}
      <div className="relative w-full max-w-2xl h-full">
        
        {/* Phase 0: Shopping Cart with Cursor */}
        <AnimatePresence mode="wait">
          {phase === 0 && (
            <motion.div
              key="phase-0"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Shopping Website Browser Window */}
              <motion.div 
                className="w-[500px] h-[350px] bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                {/* Browser Chrome */}
                <div className="h-10 bg-slate-100 border-b border-slate-200 flex items-center px-4 gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 ml-4 h-6 bg-white rounded-md px-3 flex items-center text-xs text-slate-400">
                    shopping-site.com/product
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col items-center justify-center h-[310px]">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ShoppingCart className="w-24 h-24 text-indigo-500 mb-6" strokeWidth={1.5} />
                  </motion.div>
                  
                  <div className="text-center mb-6">
                    <p className="text-2xl font-bold text-slate-900 mb-2">Premium Headphones</p>
                    <p className="text-4xl font-bold text-indigo-600">$279.99</p>
                  </div>

                  {/* Buy Now Button */}
                  <motion.button
                    className="relative px-12 py-4 bg-slate-900 text-white font-bold rounded-xl text-lg shadow-lg"
                    animate={{ 
                      boxShadow: [
                        "0 10px 30px rgba(0,0,0,0.2)",
                        "0 10px 40px rgba(99,102,241,0.4)",
                        "0 10px 30px rgba(0,0,0,0.2)"
                      ]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Buy Now
                  </motion.button>

                  {/* Animated Cursor */}
                  <motion.div
                    className="absolute text-4xl"
                    style={{ bottom: '125px', left: '50%' }}
                    initial={{ opacity: 0, x: -50, y: -50 }}
                    animate={{ 
                      opacity: 1,
                      x: -20,
                      y: -20,
                      scale: [1, 0.9, 1]
                    }}
                    transition={{ 
                      opacity: { delay: 0.5 },
                      x: { delay: 0.5 },
                      y: { delay: 0.5 },
                      scale: { duration: 0.6, repeat: Infinity, repeatDelay: 0.5, delay: 1 }
                    }}
                  >
                    👆
                  </motion.div>
                </div>
              </motion.div>

              {/* Label */}
              <motion.div
                className="mt-6 px-6 py-3 bg-blue-100 text-blue-700 rounded-full font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                🛍️ About to impulse buy...
              </motion.div>
            </motion.div>
          )}

          {/* Phase 1: Bumper Intervention */}
          {phase === 1 && (
            <motion.div
              key="phase-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Large Pause Symbol */}
              <motion.div
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
              >
                <div className="w-48 h-48 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl">
                  <Pause className="w-24 h-24 text-white" strokeWidth={3} fill="white" />
                </div>

                {/* Pulsing rings */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-purple-400"
                  animate={{ 
                    scale: [1, 1.3, 1.3],
                    opacity: [0.6, 0, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="absolute inset-0 rounded-3xl border-4 border-indigo-400"
                  animate={{ 
                    scale: [1, 1.5, 1.5],
                    opacity: [0.4, 0, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                />
              </motion.div>

              {/* Timer */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.p
                  className="text-6xl font-bold text-slate-900 mb-3"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  30s
                </motion.p>
                <p className="text-xl text-slate-600 font-medium">Time to reflect</p>
              </motion.div>

              {/* Label */}
              <motion.div
                className="mt-8 px-6 py-3 bg-purple-100 text-purple-700 rounded-full font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                ⏸️ Bumper creates a pause
              </motion.div>
            </motion.div>
          )}

          {/* Phase 2: Choice Comparison */}
          {phase === 2 && (
            <motion.div
              key="phase-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <div className="flex items-center gap-8">
                {/* Left: Instant Purchase */}
                <motion.div
                  className="relative"
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="w-52 h-64 bg-slate-100 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-slate-300">
                    <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                      <CreditCard className="w-10 h-10 text-slate-500" strokeWidth={2} />
                    </div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">This purchase</p>
                    <p className="text-3xl font-bold text-slate-900 mb-2">$279</p>
                    <p className="text-xs text-slate-400 text-center">Instant gratification</p>
                  </div>
                  <motion.div
                    className="absolute -top-3 -right-3 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ❌
                  </motion.div>
                </motion.div>

                {/* VS */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="text-2xl font-bold text-slate-400"
                >
                  VS
                </motion.div>

                {/* Right: Dream Goal */}
                <motion.div
                  className="relative"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="w-52 h-64 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 flex flex-col items-center justify-center border-2 border-indigo-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-200/30 rounded-full blur-2xl" />
                    <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                      <Plane className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <p className="text-sm text-indigo-600 uppercase tracking-wider mb-2 font-semibold">Your dream</p>
                    <p className="text-lg font-bold text-slate-900 mb-2">Jaipur Trip</p>
                    <p className="text-xs text-slate-600 text-center">+$279 closer</p>
                  </div>
                  <motion.div
                    className="absolute -top-3 -right-3 w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ✨
                  </motion.div>
                </motion.div>
              </div>

              {/* Label */}
              <motion.div
                className="mt-10 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-full font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                🤔 What matters more?
              </motion.div>
            </motion.div>
          )}

          {/* Phase 3: Success Celebration */}
          {phase === 3 && (
            <motion.div
              key="phase-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              {/* Success Circle */}
              <motion.div
                className="relative"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
              >
                <div className="w-56 h-56 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-2xl relative overflow-hidden">
                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                  />
                  
                  <TrendingUp className="w-28 h-28 text-white" strokeWidth={3} />
                </div>

                {/* Confetti particles */}
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                    style={{
                      top: '50%',
                      left: '50%',
                    }}
                    animate={{
                      x: [0, Math.cos(i * Math.PI / 4) * 100],
                      y: [0, Math.sin(i * Math.PI / 4) * 100],
                      opacity: [1, 0],
                      scale: [1, 0]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.1
                    }}
                  />
                ))}
              </motion.div>

              {/* Money Saved */}
              <motion.div
                className="mt-8 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  <DollarSign className="w-8 h-8 text-emerald-600" strokeWidth={3} />
                  <p className="text-6xl font-bold text-slate-900">279</p>
                </div>
                <p className="text-xl text-slate-600 font-medium mb-2">Saved toward Jaipur</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 rounded-full">
                  <TrendingUp className="w-4 h-4 text-emerald-700" strokeWidth={2.5} />
                  <span className="text-sm font-bold text-emerald-700">+11% Progress</span>
                </div>
              </motion.div>

              {/* Label */}
              <motion.div
                className="mt-8 px-6 py-3 bg-emerald-100 text-emerald-700 rounded-full font-semibold"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                ✨ Money saved for dreams!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Background Gradient that changes per phase */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-[3rem] blur-3xl"
          animate={{
            background: phase === 0 
              ? 'radial-gradient(circle, rgba(99,102,241,0.15), transparent)'
              : phase === 1
              ? 'radial-gradient(circle, rgba(168,85,247,0.2), transparent)'
              : phase === 2
              ? 'radial-gradient(circle, rgba(99,102,241,0.15), rgba(168,85,247,0.15))'
              : 'radial-gradient(circle, rgba(16,185,129,0.2), transparent)'
          }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Progress Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className={`h-2 rounded-full transition-all ${
              phase === i ? 'bg-slate-900 w-8' : 'bg-slate-300 w-2'
            }`}
            animate={{
              width: phase === i ? 32 : 8,
              backgroundColor: phase === i ? '#0f172a' : '#cbd5e1'
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>
    </div>
  );
}
