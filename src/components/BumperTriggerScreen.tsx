import { motion } from "motion/react";
import { ShoppingCart, ChevronLeft, Heart, Share2, Star, Shield, Truck, ArrowRight } from "lucide-react";

export function BumperTriggerScreen() {
  return (
    <div className="w-full h-full bg-white flex flex-col" style={{ width: '393px', height: '852px' }}>
      {/* Status Bar */}
      <div className="h-11 bg-white flex items-center justify-between px-6 pt-2">
        <span className="text-sm font-semibold text-black">9:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect width="16" height="12" rx="2" fill="#000000" fillOpacity="0.9"/>
            <rect x="14" y="4" width="2" height="4" rx="1" fill="#000000" fillOpacity="0.9"/>
          </svg>
        </div>
      </div>

      {/* Top Nav - E-commerce Site */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <button className="w-9 h-9 flex items-center justify-center">
          <ChevronLeft className="w-6 h-6 text-slate-900" strokeWidth={2} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black rounded-md" />
          <span className="font-bold text-lg text-slate-900">AudioHub</span>
        </div>
        <button className="w-9 h-9 flex items-center justify-center relative">
          <ShoppingCart className="w-5 h-5 text-slate-900" strokeWidth={2} />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">1</span>
          </div>
        </button>
      </div>

      {/* Product Image */}
      <div className="bg-slate-50 px-6 py-8 flex items-center justify-center relative">
        {/* Product Image Placeholder */}
        <div className="relative">
          <svg width="280" height="200" viewBox="0 0 280 200" fill="none">
            {/* Headphones illustration */}
            <ellipse cx="140" cy="100" rx="100" ry="90" fill="#F1F5F9"/>
            <path d="M70 80C70 50 100 30 140 30C180 30 210 50 210 80" stroke="#334155" strokeWidth="12" strokeLinecap="round"/>
            <rect x="50" y="70" width="35" height="50" rx="17.5" fill="#334155"/>
            <rect x="195" y="70" width="35" height="50" rx="17.5" fill="#334155"/>
            <circle cx="67.5" cy="95" r="12" fill="#E2E8F0"/>
            <circle cx="212.5" cy="95" r="12" fill="#E2E8F0"/>
          </svg>
        </div>
        
        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center">
            <Share2 className="w-4 h-4 text-slate-700" strokeWidth={2} />
          </button>
          <button className="w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center">
            <Heart className="w-4 h-4 text-slate-700" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Product Details */}
      <div className="flex-1 bg-white rounded-t-3xl -mt-4 px-6 py-5 overflow-y-auto shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {/* Title & Price */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Sony WH-1000XM5</h1>
          <p className="text-sm text-slate-500 mb-3">Premium Wireless Noise Cancelling Headphones</p>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" strokeWidth={0} />
              ))}
            </div>
            <span className="text-sm font-medium text-slate-900">4.8</span>
            <span className="text-sm text-slate-500">(2,847 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">$279.99</span>
            <span className="text-lg text-slate-400 line-through">$399.99</span>
            <div className="px-2 py-1 bg-red-50 border border-red-200 rounded-md">
              <span className="text-xs font-semibold text-red-600">30% OFF</span>
            </div>
          </div>
        </div>

        {/* Stock Alert */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 flex items-center gap-3">
          <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-900">Only 2 left in stock!</p>
            <p className="text-xs text-amber-700">Order soon to secure this deal</p>
          </div>
        </div>

        {/* Color Options */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-900 mb-2">Color</p>
          <div className="flex gap-2">
            <button className="w-12 h-12 bg-slate-900 rounded-lg border-2 border-slate-900 shadow-sm" />
            <button className="w-12 h-12 bg-slate-200 rounded-lg border-2 border-transparent shadow-sm" />
            <button className="w-12 h-12 bg-blue-100 rounded-lg border-2 border-transparent shadow-sm" />
          </div>
        </div>

        {/* Features */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-emerald-600" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Free Shipping</p>
              <p className="text-xs text-slate-500">Delivery by tomorrow</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" strokeWidth={2} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">2 Year Warranty</p>
              <p className="text-xs text-slate-500">+ 30-day returns</p>
            </div>
          </div>
        </div>

        {/* Quantity */}
        <div className="mb-4">
          <p className="text-sm font-semibold text-slate-900 mb-2">Quantity</p>
          <div className="inline-flex items-center border border-slate-300 rounded-lg overflow-hidden">
            <button className="px-4 py-2 bg-slate-50 text-slate-700 font-medium">−</button>
            <div className="px-6 py-2 bg-white font-semibold text-slate-900">1</div>
            <button className="px-4 py-2 bg-slate-50 text-slate-700 font-medium">+</button>
          </div>
        </div>
      </div>

      {/* Bottom CTA Bar */}
      <div className="bg-white border-t border-slate-200 px-6 py-4 pb-8 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-3">
          <button className="flex-shrink-0 w-14 h-14 border-2 border-slate-900 rounded-xl flex items-center justify-center">
            <ShoppingCart className="w-6 h-6 text-slate-900" strokeWidth={2} />
          </button>
          
          <motion.button
            className="flex-1 bg-slate-900 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg relative overflow-hidden"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <span>Buy Now</span>
            <ArrowRight className="w-5 h-5" strokeWidth={2.5} />
            
            {/* Pulsing ring to show user about to click */}
            <motion.div
              className="absolute inset-0 border-3 border-blue-400 rounded-xl pointer-events-none"
              animate={{ 
                scale: [1, 1.08, 1],
                opacity: [0, 0.4, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </motion.button>
        </div>
        <p className="text-center text-xs text-slate-500 mt-3">Secure checkout · Free returns</p>
      </div>
    </div>
  );
}
