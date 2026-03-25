import { motion } from "motion/react";
import { CheckCircle2, TrendingUp, Plane, ArrowRight, Calendar, MapPin, Sparkles, Award } from "lucide-react";

export function BumperSuccessScreen() {
  return (
    <div className="w-full h-full bg-[#1C1B1F] flex flex-col" style={{ width: '393px', height: '852px' }}>
      {/* Status Bar */}
      <div className="h-11 bg-[#1C1B1F] flex items-center justify-between px-6 pt-2">
        <span className="text-sm font-semibold text-white">9:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect width="16" height="12" rx="2" fill="#E8EAED" fillOpacity="0.9"/>
            <rect x="14" y="4" width="2" height="4" rx="1" fill="#E8EAED" fillOpacity="0.9"/>
          </svg>
        </div>
      </div>

      {/* Header */}
      <div className="bg-[#1C1B1F] px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-gradient-to-br from-[#8AB4F8] to-[#C58AF9] rounded-2xl flex items-center justify-center shadow-lg shadow-[#8AB4F8]/20">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2} fill="white"/>
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Bumper</h3>
              <p className="text-xs text-[#81C995] font-medium">Smart savings</p>
            </div>
          </div>
          <div className="px-3 py-1.5 bg-[#137333]/20 border border-[#34A853]/30 rounded-full">
            <span className="text-xs font-semibold text-[#81C995]">Active</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-[#1C1B1F] px-6 py-6">
        {/* Success Hero */}
        <motion.div 
          className="text-center mb-7"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div 
            className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#34A853]/20 to-[#137333]/20 rounded-3xl flex items-center justify-center border border-[#34A853]/30 shadow-xl shadow-[#34A853]/10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          >
            <CheckCircle2 className="w-11 h-11 text-[#81C995]" strokeWidth={2.5} />
          </motion.div>
          <h2 className="text-2xl font-semibold text-white mb-2.5">Excellent choice!</h2>
          <p className="text-sm text-white/60">You chose your dream over impulse</p>
        </motion.div>

        {/* Amount Saved - Hero Card */}
        <motion.div 
          className="bg-gradient-to-br from-[#2D2D2D] to-[#232323] border border-white/10 rounded-3xl p-6 mb-4 shadow-2xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <span className="text-xs font-medium text-white/40 uppercase tracking-wider">Today's save</span>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#137333]/20 border border-[#34A853]/30 rounded-full flex-shrink-0">
              <TrendingUp className="w-3.5 h-3.5 text-[#81C995]" strokeWidth={2} />
              <span className="text-xs font-semibold text-[#81C995] whitespace-nowrap">+11%</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-5xl font-semibold text-white">$302</span>
            <span className="text-2xl text-white/40">.39</span>
          </div>
          <p className="text-sm text-white/50">Added to your Jaipur fund</p>
        </motion.div>

        {/* Trip Progress Card */}
        <motion.div 
          className="bg-[#2D2D2D] border border-white/10 rounded-3xl p-6 mb-4 shadow-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-medium text-white text-base">Trip to Jaipur</h3>
            <div className="w-10 h-10 bg-[#8AB4F8]/15 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5 text-[#8AB4F8]" strokeWidth={2} />
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-gradient-to-br from-[#8AB4F8]/10 to-[#C58AF9]/10 border border-[#8AB4F8]/20 rounded-2xl p-5 mb-5 backdrop-blur-xl">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs font-medium text-[#8AB4F8] uppercase tracking-wider mb-1.5">Total progress</p>
                <p className="text-3xl font-semibold text-white">53%</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/50 mb-1">Saved</p>
                <p className="text-lg font-semibold text-white">$1,482</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-3 bg-white/10 rounded-full overflow-hidden mb-3">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#8AB4F8] to-[#C58AF9] rounded-full relative overflow-hidden"
                initial={{ width: "42%" }}
                animate={{ width: "53%" }}
                transition={{ duration: 1.2, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 1.5, delay: 1.4, ease: "easeInOut" }}
                />
              </motion.div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-white/50">Goal: $2,800</span>
              <span className="font-medium text-[#A8C7FA]">$1,318 to go</span>
            </div>
          </div>

          {/* Milestones */}
          <div className="space-y-3">
            {/* Completed Milestone */}
            <div className="flex items-center gap-3.5 p-4 bg-[#137333]/15 border border-[#34A853]/25 rounded-2xl">
              <div className="w-10 h-10 bg-[#137333]/30 rounded-xl flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#81C995]" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white mb-0.5">Round-trip flights</p>
                <p className="text-xs text-[#81C995]">✓ Unlocked</p>
              </div>
            </div>

            {/* In Progress Milestone */}
            <div className="flex items-center gap-3.5 p-4 bg-white/5 border border-white/10 rounded-2xl">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-white/50" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white mb-0.5">7-night hotel stay</p>
                <p className="text-xs text-white/40">Need $580 more · 44% complete</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          className="grid grid-cols-2 gap-3 mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="bg-[#2D2D2D] border border-white/10 rounded-2xl p-4 shadow-lg">
            <div className="w-10 h-10 bg-[#C58AF9]/15 rounded-xl flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-[#C58AF9]" strokeWidth={2} />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">12</p>
            <p className="text-xs text-white/50">Smart saves</p>
          </div>

          <div className="bg-[#2D2D2D] border border-white/10 rounded-2xl p-4 shadow-lg">
            <div className="w-10 h-10 bg-[#81C995]/15 rounded-xl flex items-center justify-center mb-3">
              <TrendingUp className="w-5 h-5 text-[#81C995]" strokeWidth={2} />
            </div>
            <p className="text-2xl font-semibold text-white mb-1">$847</p>
            <p className="text-xs text-white/50">This month</p>
          </div>
        </motion.div>

        {/* Insight Card - Material You */}
        <motion.div 
          className="bg-gradient-to-br from-[#FCC934]/15 to-[#F9AB00]/15 border border-[#FCC934]/30 rounded-2xl p-5 backdrop-blur-xl"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-[#FCC934]/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#FDD663]" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-medium text-[#FDD663] uppercase tracking-wider mb-2">At this rate</h4>
              <p className="text-sm text-white/90 leading-relaxed">
                You'll be exploring the Pink City by <span className="font-semibold text-white">October 2025</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom CTA */}
      <div className="bg-[#1C1B1F] border-t border-white/10 px-6 py-5 pb-8">
        <motion.button
          className="w-full bg-[#8AB4F8] hover:bg-[#A8C7FA] text-[#001D35] font-semibold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg shadow-[#8AB4F8]/20 transition-colors"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <span>View full dashboard</span>
          <ArrowRight className="w-5 h-5" strokeWidth={2} />
        </motion.button>
        <p className="text-center text-xs text-white/40 mt-4">Keep building your dream, one save at a time</p>
      </div>
    </div>
  );
}