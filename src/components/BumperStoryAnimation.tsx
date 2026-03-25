import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { ShoppingCart, CreditCard, MapPin, Plane, DollarSign, Heart, Sparkles, TrendingUp, CheckCircle, X, Calendar, Star, Award } from "lucide-react";

export function BumperStoryAnimation() {
  const [phase, setPhase] = useState<'browsing' | 'checkout' | 'intervention' | 'decision'>('browsing');
  const [cartCount, setCartCount] = useState(0);
  const [savingsAmount, setSavingsAmount] = useState(1200);
  const [showPopup, setShowPopup] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Cycle through the story with better timing
    const timeline = setTimeout(() => {
      if (phase === 'browsing') {
        setPhase('checkout');
        setShowPopup(false);
      } else if (phase === 'checkout') {
        setPhase('intervention');
        setShowPopup(true);
      } else if (phase === 'intervention') {
        setPhase('decision');
        setShowSuccess(true);
      } else {
        // Reset
        setPhase('browsing');
        setCartCount(0);
        setShowPopup(false);
        setShowSuccess(false);
        setSavingsAmount(1200);
      }
    }, phase === 'decision' ? 4000 : phase === 'intervention' ? 5000 : 4500);

    return () => clearTimeout(timeline);
  }, [phase]);

  useEffect(() => {
    if (phase === 'browsing') {
      const timer = setTimeout(() => setCartCount(1), 1500);
      return () => clearTimeout(timer);
    } else if (phase === 'decision') {
      // Show savings increasing with animation
      const timer = setTimeout(() => {
        setSavingsAmount(1499);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const savingsProgress = (savingsAmount / 1800) * 100;
  const productPrice = 299;

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 overflow-hidden">
      {/* Enhanced decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-300/30 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-300/30 to-rose-400/20 rounded-full blur-3xl" />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-teal-300/20 to-cyan-400/20 rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Browser mockup with shadow */}
      <div className="relative z-10 w-full max-w-md">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/60"
          animate={{
            boxShadow: showPopup 
              ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Realistic browser chrome */}
          <div className="bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 flex items-center gap-3 border-b border-slate-200/80">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-red-400 to-red-500 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 shadow-sm" />
              <div className="w-3 h-3 rounded-full bg-gradient-to-br from-green-400 to-green-500 shadow-sm" />
            </div>
            <div className="flex-1 bg-white rounded-lg px-3 py-2 flex items-center gap-2 shadow-sm border border-slate-200/50">
              <div className="text-[9px] text-emerald-600 font-medium">🔒</div>
              <div className="text-[9px] text-slate-500 flex-1">shop.example.com</div>
              {phase !== 'browsing' && (
                <motion.div
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="relative"
                >
                  <motion.div
                    className="w-6 h-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-md flex items-center justify-center shadow-lg"
                    animate={{
                      boxShadow: showPopup
                        ? ['0 0 0 0 rgba(79, 70, 229, 0.4)', '0 0 0 8px rgba(79, 70, 229, 0)', '0 0 0 0 rgba(79, 70, 229, 0)']
                        : '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                    transition={{
                      duration: 2,
                      repeat: showPopup ? Infinity : 0,
                    }}
                  >
                    <div className="w-3 h-3 bg-white/95 rounded-sm" />
                  </motion.div>
                  {showPopup && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full border-2 border-white flex items-center justify-center"
                    >
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </div>
          </div>

          {/* Page content */}
          <div className="relative bg-gradient-to-b from-white to-slate-50/50 min-h-[450px]">
            <AnimatePresence mode="wait">
              {phase === 'browsing' && (
                <motion.div
                  key="browsing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="p-5 space-y-5"
                >
                  {/* Product showcase */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/60 shadow-sm"
                  >
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-4xl">🎧</span>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                          15%
                        </div>
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-bold text-slate-900 mb-0.5">Premium Wireless Headphones</div>
                            <div className="text-xs text-slate-500">Noise Cancelling • 30hr Battery</div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-200"
                          >
                            <Heart className="w-4 h-4 text-slate-400" />
                          </motion.button>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            ${productPrice}
                          </div>
                          <div className="text-sm text-slate-400 line-through">$349</div>
                          <div className="ml-auto flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <span className="text-xs text-slate-500 ml-1">(248)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Product features */}
                  <div className="space-y-2">
                    {['Premium sound quality', 'Active noise cancellation', 'Fast charging'].map((feature, i) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1 }}
                        className="flex items-center gap-2 text-xs text-slate-600"
                      >
                        <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-2.5 h-2.5 text-white" />
                        </div>
                        {feature}
                      </motion.div>
                    ))}
                  </div>

                  {/* Add to cart button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setCartCount(1)}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all shadow-lg ${
                      cartCount > 0
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                    }`}
                  >
                    {cartCount > 0 ? (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Added to Cart!
                      </motion.span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        Add to Cart
                      </span>
                    )}
                  </motion.button>

                  {/* Cart preview */}
                  <AnimatePresence>
                    {cartCount > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                              <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-slate-900">{cartCount} item in cart</div>
                              <div className="text-xs text-slate-600">Ready to checkout</div>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-indigo-600">${productPrice}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {phase === 'checkout' && (
                <motion.div
                  key="checkout"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="p-5 space-y-5"
                >
                  {/* Checkout header */}
                  <div className="text-center pb-4 border-b border-slate-200">
                    <div className="text-xl font-bold text-slate-900 mb-1">Checkout</div>
                    <div className="text-xs text-slate-500">Complete your purchase</div>
                  </div>

                  {/* Order summary with rich details */}
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-4 border border-slate-200/60 space-y-3">
                    <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                      <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-xl flex items-center justify-center shadow-sm">
                        <span className="text-2xl">🎧</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-slate-900 mb-0.5">Premium Headphones</div>
                        <div className="text-xs text-slate-500">Qty: 1 • Black</div>
                      </div>
                      <div className="text-lg font-bold text-slate-900">${productPrice}</div>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Subtotal</span>
                        <span className="text-slate-900 font-semibold">${productPrice}.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Shipping</span>
                        <span className="text-green-600 font-semibold">FREE</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Tax</span>
                        <span className="text-slate-900 font-semibold">$0.00</span>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-300 flex justify-between text-base">
                        <span className="font-bold text-slate-900">Total</span>
                        <span className="font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          ${productPrice}.00
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment button with loading effect */}
                  <motion.button
                    animate={{
                      boxShadow: [
                        '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                        '0 20px 25px -5px rgba(79, 70, 229, 0.4)',
                        '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                      ],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-3"
                  >
                    <CreditCard className="w-5 h-5" />
                    Complete Purchase
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                  </motion.button>
                </motion.div>
              )}

              {(phase === 'intervention' || phase === 'decision') && (
                <motion.div
                  key="overlay"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-5"
                >
                  {/* Blurred checkout in background */}
                  <div className="opacity-20 blur-md pointer-events-none space-y-4">
                    <div className="text-center pb-4 border-b border-slate-200">
                      <div className="text-xl font-bold">Checkout</div>
                    </div>
                    <div className="bg-slate-100 rounded-2xl p-4 h-32" />
                    <div className="bg-indigo-600 rounded-xl p-4" />
                  </div>

                  {/* Bumper intervention popup */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="absolute inset-5 flex items-center justify-center"
                  >
                    <div className="relative w-full max-w-sm">
                      {/* Glow effect */}
                      <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
                      
                      <div className="relative bg-white/98 backdrop-blur-2xl rounded-3xl shadow-2xl border border-indigo-200/60 p-6 overflow-hidden">
                        {/* Animated gradient border */}
                        <motion.div
                          className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
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

                        <AnimatePresence mode="wait">
                          {phase === 'intervention' && !showSuccess && (
                            <motion.div
                              key="intervention"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="space-y-5"
                            >
                              {/* Icon with animation */}
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                                className="text-center"
                              >
                                <div className="relative inline-block">
                                  <motion.div
                                    animate={{
                                      rotate: [0, -15, 15, -15, 0],
                                    }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                    className="w-20 h-20 bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center mx-auto border-2 border-amber-200 shadow-lg"
                                  >
                                    <span className="text-4xl">🤔</span>
                                  </motion.div>
                                  <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <DollarSign className="w-5 h-5 text-white" strokeWidth={3} />
                                  </motion.div>
                                </div>
                              </motion.div>

                              {/* Message */}
                              <div className="text-center space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">Wait a moment...</h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                  You could save <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">${productPrice}</span> toward your dream goal
                                </p>
                              </div>

                              {/* Rich goal visualization */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-5 border-2 border-amber-200/60 shadow-lg"
                              >
                                <div className="flex items-center gap-4 mb-4">
                                  <motion.div
                                    animate={{
                                      scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                      duration: 2,
                                      repeat: Infinity,
                                    }}
                                    className="w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl"
                                  >
                                    <span className="text-3xl">🕌</span>
                                  </motion.div>
                                  <div className="flex-1">
                                    <div className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                                      Trip to Jaipur 2026
                                      <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                    </div>
                                    <div className="text-xs text-slate-600">Your dream destination awaits</div>
                                  </div>
                                </div>

                                {/* Progress bar */}
                                <div className="space-y-3">
                                  <div className="relative h-3 bg-white/80 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                                      initial={{ width: "66%" }}
                                      animate={{ width: "66%" }}
                                    />
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                                      animate={{ x: ['-100%', '200%'] }}
                                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                    />
                                  </div>
                                  <div className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                                      <span className="font-bold text-slate-900">${savingsAmount} saved</span>
                                    </div>
                                    <span className="text-slate-600">Goal: $1,800</span>
                                  </div>
                                  <div className="text-center text-xs text-amber-700 font-medium">
                                    You're {Math.floor(savingsProgress)}% there! 🎉
                                  </div>
                                </div>
                              </motion.div>

                              {/* Action buttons */}
                              <div className="grid grid-cols-2 gap-3 pt-2">
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200"
                                >
                                  Buy Anyway
                                </motion.button>
                                <motion.button
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  animate={{
                                    boxShadow: [
                                      '0 4px 14px 0 rgba(79, 70, 229, 0.3)',
                                      '0 8px 20px 0 rgba(79, 70, 229, 0.4)',
                                      '0 4px 14px 0 rgba(79, 70, 229, 0.3)',
                                    ],
                                  }}
                                  transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                  }}
                                  className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                                >
                                  Save Instead
                                  <Sparkles className="w-3.5 h-3.5" />
                                </motion.button>
                              </div>
                            </motion.div>
                          )}

                          {phase === 'decision' && (
                            <motion.div
                              key="decision"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-center space-y-5 py-4"
                            >
                              {/* Success icon */}
                              <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ type: "spring", stiffness: 200, damping: 12 }}
                                className="relative inline-block"
                              >
                                <motion.div
                                  className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl"
                                  animate={{
                                    boxShadow: [
                                      '0 0 0 0 rgba(34, 197, 94, 0.4)',
                                      '0 0 0 20px rgba(34, 197, 94, 0)',
                                      '0 0 0 0 rgba(34, 197, 94, 0)',
                                    ],
                                  }}
                                  transition={{ duration: 2, repeat: Infinity }}
                                >
                                  <CheckCircle className="w-12 h-12 text-white" strokeWidth={2.5} />
                                </motion.div>
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.3 }}
                                  className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                                >
                                  <Award className="w-5 h-5 text-white" />
                                </motion.div>
                              </motion.div>

                              {/* Success message */}
                              <div>
                                <motion.h3
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="text-2xl font-bold text-slate-900 mb-2"
                                >
                                  Great choice! 🎉
                                </motion.h3>
                                <motion.p
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                  className="text-sm text-slate-600"
                                >
                                  You're one step closer to your dream
                                </motion.p>
                              </div>

                              {/* Updated goal card */}
                              <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 border-2 border-green-200/60 shadow-lg"
                              >
                                <div className="flex items-center justify-center gap-3 mb-4">
                                  <span className="text-4xl">🕌</span>
                                  <div className="text-left">
                                    <div className="text-sm font-bold text-slate-900">Trip to Jaipur 2026</div>
                                    <motion.div
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      className="flex items-center gap-1.5 text-xs text-green-600 font-bold"
                                    >
                                      <TrendingUp className="w-3.5 h-3.5" />
                                      +${productPrice} saved!
                                    </motion.div>
                                  </div>
                                </div>

                                <div className="space-y-3">
                                  <div className="relative h-3 bg-white/80 rounded-full overflow-hidden shadow-inner">
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
                                      initial={{ width: "66%" }}
                                      animate={{ width: `${(savingsAmount / 1800) * 100}%` }}
                                      transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                    <motion.div
                                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                                      animate={{ x: ['-100%', '200%'] }}
                                      transition={{ duration: 1.5, ease: "linear" }}
                                    />
                                  </div>
                                  <motion.div
                                    className="flex justify-between items-center text-xs"
                                    key={savingsAmount}
                                  >
                                    <motion.div
                                      initial={{ y: -10, opacity: 0 }}
                                      animate={{ y: 0, opacity: 1 }}
                                      className="flex items-center gap-1.5"
                                    >
                                      <Sparkles className="w-3 h-3 text-green-600" />
                                      <span className="font-bold text-green-700">${savingsAmount} saved</span>
                                    </motion.div>
                                    <span className="text-slate-600">Goal: $1,800</span>
                                  </motion.div>
                                  <div className="text-center text-xs bg-green-100 text-green-700 font-bold py-2 rounded-lg">
                                    Only ${1800 - savingsAmount} to go! 🚀
                                  </div>
                                </div>
                              </motion.div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Enhanced phase indicators */}
        <div className="flex items-center justify-center gap-3 mt-6">
          {[
            { phase: 'browsing', label: 'Browse', color: 'from-blue-500 to-indigo-500' },
            { phase: 'checkout', label: 'Checkout', color: 'from-indigo-500 to-purple-500' },
            { phase: 'intervention', label: 'Pause', color: 'from-orange-500 to-amber-500' },
            { phase: 'decision', label: 'Save', color: 'from-green-500 to-emerald-500' }
          ].map((p) => (
            <motion.div
              key={p.phase}
              className="relative"
              animate={{
                scale: phase === p.phase ? 1 : 0.85,
              }}
            >
              <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                phase === p.phase
                  ? `bg-gradient-to-r ${p.color} w-10 shadow-lg`
                  : 'bg-slate-300'
              }`} />
            </motion.div>
          ))}
        </div>

        {/* Story label */}
        <motion.div
          key={phase}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4"
        >
          <div className="text-slate-800 text-sm font-bold mb-1">
            {phase === 'browsing' && '🛍️ Online Shopping'}
            {phase === 'checkout' && '💳 Impulse Purchase'}
            {phase === 'intervention' && '🛡️ Bumper Intervenes'}
            {phase === 'decision' && '✅ Money Saved!'}
          </div>
          <div className="text-slate-600 text-xs">
            {phase === 'browsing' && 'Finding the perfect product'}
            {phase === 'checkout' && 'About to spend impulsively'}
            {phase === 'intervention' && 'Pause & reflect on your goals'}
            {phase === 'decision' && 'Closer to your dream destination'}
          </div>
        </motion.div>
      </div>
    </div>
  );
}