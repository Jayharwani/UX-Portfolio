import { Badge } from "./ui/badge";
import { ArrowRight, ShoppingCart, Heart, DollarSign, Plane, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { useMobileDetect } from "./hooks/useMobileDetect";
import { Link } from "react-router";
import { BumperStoryAnimation } from "./BumperStoryAnimation";
import bumperBg from "../assets/bumper-bg.png";

// Optimized static particles for transition effect
function FloatingParticles({ isMobile }: { isMobile: boolean }) {
  const particles = Array.from({ length: isMobile ? 8 : 12 });
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        return (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              left: `${(i * 10 + 5)}%`,
              top: `${(i % 3) * 30 + 15}%`,
              backgroundColor: color,
              opacity: 0.3,
            }}
          />
        );
      })}
    </div>
  );
}

// Enhanced browser extension visualization with continuous animations
function GlassPortal({ isMobile }: { isMobile: boolean }) {
  const [savingsAmount, setSavingsAmount] = useState(1200);
  const [showPopup, setShowPopup] = useState(false);
  
  // Simulate popup appearing after a delay
  useState(() => {
    const timer = setTimeout(() => setShowPopup(true), 500);
    return () => clearTimeout(timer);
  });
  
  // Animate savings progress
  useState(() => {
    const interval = setInterval(() => {
      setSavingsAmount(prev => {
        const newVal = prev + 50;
        return newVal > 1500 ? 1200 : newVal;
      });
    }, 4000);
    return () => clearInterval(interval);
  });

  const savingsProgress = (savingsAmount / 1800) * 100;

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Soft blurred background for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-teal-50 opacity-60" />

      {/* Main laptop/browser mockup */}
      <motion.div
        className="relative z-10 w-full max-w-md mx-auto"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        {/* Browser window */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-200">
          {/* Browser chrome */}
          <div className="bg-slate-50 px-3 py-2.5 flex items-center gap-3 border-b border-slate-200">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
            </div>
            <div className="flex-1 bg-white rounded px-3 py-1.5 border border-slate-200">
              {/* Animated loading bar */}
              <div className="relative">
                <div className="text-[9px] text-slate-500 font-mono">🔒 shop.example.com/product/wireless-headphones</div>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-indigo-500"
                  initial={{ width: "0%" }}
                  animate={{ width: showPopup ? "100%" : "0%" }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
            {/* Extension icon in toolbar with pulse */}
            <motion.div 
              className="w-6 h-6 bg-gradient-to-br from-teal-500 to-indigo-500 rounded-md flex items-center justify-center shadow-sm"
              animate={{
                boxShadow: [
                  '0 0 0 0 rgba(20, 184, 166, 0)',
                  '0 0 0 4px rgba(20, 184, 166, 0.2)',
                  '0 0 0 0 rgba(20, 184, 166, 0)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-3 h-3 bg-white/90 rounded-sm" />
            </motion.div>
          </div>

          {/* Shopping website content */}
          <div className="relative bg-white p-4 pb-6">
            {/* Product header */}
            <div className="flex gap-3 mb-3">
              <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                <div className="text-slate-400 text-xs">📦</div>
              </div>
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-slate-200 rounded w-4/5" />
                <div className="h-2 bg-slate-100 rounded w-3/5" />
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-lg font-bold text-slate-700">$299</div>
                  <div className="text-xs text-slate-400 line-through">$349</div>
                </div>
              </div>
            </div>

            {/* Product details placeholder with shimmer */}
            <div className="space-y-2 mb-4">
              {[0, 1, 2].map((index) => (
                <motion.div
                  key={index}
                  className="relative h-2 bg-slate-100 rounded overflow-hidden"
                  style={{ width: index === 0 ? '100%' : index === 1 ? '85%' : '65%' }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-200/60 to-transparent"
                    animate={{
                      x: ['-100%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      delay: index * 0.3,
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Buy button with shield blocking it */}
            <div className="relative">
              <button className="w-full bg-slate-200 text-slate-400 rounded-lg py-3 font-semibold text-sm blur-[1px] opacity-50">
                Add to Cart
              </button>
              
              {/* Glowing shield barrier with pulse */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{
                  opacity: [0.8, 1, 0.8],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-indigo-500/10 to-teal-500/10 rounded-lg" />
                <motion.div
                  className="relative"
                  initial={{ scale: 0.8, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  animate={{
                    rotate: [0, -5, 5, 0],
                  }}
                  style={{
                    transition: 'transform 3s ease-in-out infinite',
                  }}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-indigo-500 rounded-full flex items-center justify-center shadow-lg">
                    {/* Shield icon */}
                    <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3zm0 16c-3.45-.89-6-4.24-6-7.91V6.17l6-2.52 6 2.52v4.92c0 3.67-2.55 7.02-6 7.91z"/>
                    </svg>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Extension popup overlay - THE HERO with staggered animation */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%]"
              initial={{ scale: 0.85, opacity: 0, y: 30 }}
              animate={{ 
                scale: showPopup ? 1 : 0.85, 
                opacity: showPopup ? 1 : 0, 
                y: showPopup ? 0 : 30 
              }}
              transition={{ 
                duration: 0.5, 
                delay: 0.8,
                type: "spring",
                stiffness: 200,
                damping: 20
              }}
            >
              {/* Glassmorphic extension popup */}
              <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/60 p-5 overflow-hidden">
                {/* Animated gradient accent */}
                <motion.div 
                  className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-indigo-500 to-teal-400"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    backgroundSize: '200% 100%',
                  }}
                />
                
                <div className="relative space-y-4">
                  {/* Icon and headline with bounce */}
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: showPopup ? 1 : 0, x: showPopup ? 0 : -10 }}
                    transition={{ delay: 1, duration: 0.4 }}
                  >
                    <motion.div 
                      className="w-10 h-10 bg-gradient-to-br from-teal-50 to-indigo-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-teal-100"
                      animate={{
                        rotate: [0, -10, 10, -10, 0],
                      }}
                      transition={{
                        duration: 0.6,
                        delay: 1.2,
                        ease: "easeInOut",
                      }}
                    >
                      <span className="text-xl">🤔</span>
                    </motion.div>
                    <div className="flex-1 pt-0.5">
                      <h4 className="text-slate-800 font-semibold text-sm mb-1">Do you really need this?</h4>
                      <p className="text-slate-600 text-xs leading-relaxed">
                        You could save $299 toward your goal instead
                      </p>
                    </div>
                  </motion.div>

                  {/* Savings goal visualization with animated progress */}
                  <motion.div 
                    className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-3 border border-amber-100"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: showPopup ? 1 : 0, y: showPopup ? 0 : 10 }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center text-lg shadow-sm"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        🕌
                      </motion.div>
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-slate-700 mb-1">Trip to Jaipur 2026</div>
                        <div className="bg-white/80 rounded-full h-1.5 overflow-hidden">
                          <motion.div 
                            className="h-full bg-gradient-to-r from-teal-400 to-indigo-500"
                            animate={{ 
                              width: `${savingsProgress}%`,
                            }}
                            transition={{ 
                              duration: 1,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                        <motion.div 
                          className="text-[10px] text-slate-500 mt-1"
                          key={savingsAmount}
                          initial={{ opacity: 0, y: -3 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          ${savingsAmount} / $1,800
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action buttons with stagger */}
                  <motion.div 
                    className="flex gap-2 pt-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: showPopup ? 1 : 0, y: showPopup ? 0 : 10 }}
                    transition={{ delay: 1.4, duration: 0.4 }}
                  >
                    <motion.button 
                      className="flex-1 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors border border-slate-200"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Continue Anyway
                    </motion.button>
                    <motion.button 
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-teal-500/25"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      animate={{
                        boxShadow: [
                          '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                          '0 6px 20px 0 rgba(20, 184, 166, 0.35)',
                          '0 4px 14px 0 rgba(20, 184, 166, 0.25)',
                        ],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      Save Instead ✓
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Subtle floating shadow for depth with pulse */}
        <motion.div 
          className="absolute inset-0 -z-10 blur-2xl opacity-20 bg-gradient-to-br from-teal-400 via-indigo-400 to-blue-400 scale-95"
          animate={{
            opacity: [0.15, 0.25, 0.15],
            scale: [0.95, 1, 0.95],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
}

export function EnhancedBumperCard() {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobileDetect();

  return (
    <Link to="/bumper">
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        whileHover={{ 
          y: -8,
          transition: { duration: 0.3 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="group"
      >
        {/* Main card with background image */}
        <div className="relative rounded-[28px] overflow-hidden h-[650px] md:h-[700px] shadow-2xl">
          {/* HD Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
            style={{
              backgroundImage: `url(${bumperBg})`,
            }}
          />
          
          {/* Dark gradient overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/85 via-slate-900/75 to-slate-900/65" />
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-between p-10 md:p-12 lg:p-14">
            {/* Top section - Category badge */}
            <div className="flex justify-start">
              <Badge className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-4 py-2 rounded-full text-sm">
                Browser Extension
              </Badge>
            </div>

            {/* Bottom section - Title and CTA */}
            <div className="space-y-6 max-w-xl">
              <motion.h3
                className="text-white text-4xl md:text-5xl lg:text-6xl leading-tight"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Stop impulse buys, save for what matters
              </motion.h3>

              <motion.p
                className="text-white/80 text-lg md:text-xl leading-relaxed max-w-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Bumper helps you resist impulse purchases by showing what you could do with that money instead—like saving for your dream trip to Jaipur
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <button 
                  className="inline-flex items-center gap-2 text-[15px] font-semibold transition-all duration-300 hover:opacity-90"
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#0D0D1A',
                    fontFamily: 'DM Sans, sans-serif',
                    padding: '15px 28px',
                    borderRadius: '100px'
                  }}
                >
                  <span>Go to project</span>
                  <ArrowRight className="w-[15px] h-[15px] group-hover/btn:translate-x-1 transition-transform duration-300" style={{ strokeWidth: 1.8 }} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Subtle glow effect on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-teal-500/20 via-transparent to-transparent opacity-0"
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    </Link>
  );
}