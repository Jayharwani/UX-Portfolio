import { motion } from "motion/react";
import { X, Plane, TrendingUp, ChevronRight, CheckCircle2, Sparkles } from "lucide-react";

export function BumperInterventionScreen() {
  return (
    <div className="w-full h-full bg-[#1C1B1F] flex flex-col relative" style={{ width: '393px', height: '852px' }}>
      {/* Scrim overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />
      
      {/* Bottom Sheet */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Top spacer */}
        <div className="flex-shrink-0 h-20" />
        
        {/* Main Surface */}
        <div className="flex-1 bg-[#2D2D2D] rounded-t-[32px] shadow-2xl flex flex-col max-h-[calc(100%-80px)] border-t border-white/10">
          {/* Drag Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-white/20 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-6 pt-3 pb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-gradient-to-br from-[#8AB4F8] to-[#C58AF9] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8AB4F8]/20">
                <Sparkles className="w-5 h-5 text-white" strokeWidth={2} fill="white"/>
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Bumper</h3>
                <p className="text-xs text-white/50">Mindful spending</p>
              </div>
            </div>
            <button className="w-10 h-10 bg-white/8 hover:bg-white/12 backdrop-blur-xl rounded-full flex items-center justify-center transition-colors">
              <X className="w-4.5 h-4.5 text-white/70" strokeWidth={2} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* Main Message */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2.5 leading-tight">
                Before you checkout...
              </h2>
              <p className="text-sm text-white/60 leading-relaxed">
                You're about to spend <span className="font-semibold text-white">$302.39</span>. 
                What if this could bring you closer to something more meaningful?
              </p>
            </div>

            {/* Current Purchase Card */}
            <div className="bg-[#1C1B1F] border border-white/10 rounded-3xl p-5 mb-4">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-1.5">This purchase</p>
                  <h3 className="font-medium text-white text-base">Sony Headphones</h3>
                </div>
                <div className="px-3 py-1.5 bg-white/5 rounded-full flex-shrink-0">
                  <span className="text-lg font-semibold text-white whitespace-nowrap">$302</span>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/40">
                <div className="w-1 h-1 bg-white/40 rounded-full" />
                <span>Instant gratification</span>
              </div>
            </div>

            {/* OR Divider */}
            <div className="flex items-center gap-3 py-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs font-medium text-white/30 uppercase tracking-wider">Or save for</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Dream Goal Card - Material Design 3 Style */}
            <div className="bg-gradient-to-br from-[#8AB4F8] to-[#A8C7FA] rounded-3xl p-6 text-[#001D35] shadow-2xl shadow-[#8AB4F8]/20 mb-5">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-xs font-medium text-[#001D35]/60 uppercase tracking-wider mb-1.5">Your dream</p>
                  <h3 className="font-semibold text-[#001D35] text-xl mb-1">Jaipur, India</h3>
                  <p className="text-sm text-[#001D35]/70">The Pink City</p>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                  <Plane className="w-6 h-6 text-[#001D35]" strokeWidth={2} />
                </div>
              </div>

              {/* Progress Section */}
              <div className="mb-4">
                <div className="flex justify-between items-baseline mb-2.5">
                  <span className="text-xs font-medium text-[#001D35]/70">Your progress</span>
                  <div className="text-right">
                    <span className="text-base font-semibold text-[#001D35]">$1,180</span>
                    <span className="text-sm text-[#001D35]/60"> / $2,800</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2.5 bg-[#001D35]/20 rounded-full overflow-hidden mb-2.5">
                  <motion.div 
                    className="h-full bg-[#001D35] rounded-full relative overflow-hidden"
                    initial={{ width: "42%" }}
                    animate={{ width: "53%" }}
                    transition={{ duration: 1.5, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    {/* Shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2, delay: 1, ease: "easeInOut" }}
                    />
                  </motion.div>
                </div>

                {/* Impact message */}
                <motion.div 
                  className="flex items-start gap-2"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-[#001D35]/70 mt-0.5 flex-shrink-0" strokeWidth={2} />
                  <p className="text-xs text-[#001D35]/80 leading-relaxed">
                    Add $302 and you'll be at <span className="font-semibold text-[#001D35]">53% complete</span>
                  </p>
                </motion.div>
              </div>

              {/* Next Milestone */}
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-4 border border-[#001D35]/10">
                <p className="text-xs font-medium text-[#001D35]/60 mb-2.5">Next unlocked</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#34A853]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#137333]" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#001D35]">Round-trip flights</p>
                    <p className="text-xs text-[#001D35]/60">Direct from LAX</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insight Quote - Material You */}
            <div className="bg-[#C58AF9]/10 border-l-4 border-[#C58AF9] rounded-r-2xl p-4 backdrop-blur-xl">
              <p className="text-sm text-white/80 italic leading-relaxed">
                "The best things in life aren't things."
              </p>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="border-t border-white/10 px-6 py-5 pb-8 bg-[#2D2D2D] rounded-b-[32px]">
            <div className="space-y-3">
              {/* Primary CTA */}
              <motion.button
                className="w-full bg-[#8AB4F8] hover:bg-[#A8C7FA] text-[#001D35] font-semibold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#8AB4F8]/20 transition-colors"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <span>Save for Jaipur</span>
                <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
              </motion.button>

              {/* Secondary CTA */}
              <button className="w-full text-white/70 hover:text-white font-medium py-3.5 rounded-full hover:bg-white/5 transition-all text-sm">
                Continue to purchase
              </button>
            </div>

            {/* Timer */}
            <div className="flex items-center justify-center gap-2 mt-5 text-xs text-white/40">
              <div className="w-1.5 h-1.5 bg-[#8AB4F8] rounded-full">
                <motion.div
                  className="w-full h-full bg-[#8AB4F8] rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <span>Take your time · <span className="text-white/60 font-medium">24s to reflect</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}