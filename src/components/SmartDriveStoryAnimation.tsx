import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import { Bell, MessageSquare, Phone, Navigation, Car, Brain, Shield, CheckCircle, X, MapPin, Clock } from "lucide-react";

export function SmartDriveStoryAnimation() {
  const [phase, setPhase] = useState<'problem' | 'learning' | 'solution'>('problem');
  const [notificationCount, setNotificationCount] = useState(0);
  const [isDriving, setIsDriving] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [speedometer, setSpeedometer] = useState(0);

  useEffect(() => {
    // Cycle through the story with longer duration
    const timeline = setTimeout(() => {
      if (phase === 'problem') {
        setPhase('learning');
        setNotificationCount(0);
        setSpeedometer(0);
      } else if (phase === 'learning') {
        setPhase('solution');
        setAiProgress(0);
      } else {
        setPhase('problem');
        setNotificationCount(0);
        setIsDriving(false);
        setAiProgress(0);
        setSpeedometer(0);
      }
    }, 7000);

    return () => clearTimeout(timeline);
  }, [phase]);

  useEffect(() => {
    if (phase === 'problem') {
      // Start driving first
      setTimeout(() => {
        setIsDriving(true);
        // Animate speedometer
        let speed = 0;
        const speedInterval = setInterval(() => {
          speed += 5;
          if (speed <= 45) setSpeedometer(speed);
        }, 100);
        
        setTimeout(() => clearInterval(speedInterval), 1000);
      }, 500);

      // Then show notifications flooding in
      setTimeout(() => {
        const notifTimer = setInterval(() => {
          setNotificationCount(prev => (prev < 5 ? prev + 1 : prev));
        }, 500);
        
        setTimeout(() => clearInterval(notifTimer), 3000);
      }, 1500);
    } else if (phase === 'learning') {
      // AI learning progress - smoother
      const learningTimer = setInterval(() => {
        setAiProgress(prev => Math.min(prev + 0.5, 100));
      }, 30);
      return () => clearInterval(learningTimer);
    } else if (phase === 'solution') {
      setIsDriving(true);
      setSpeedometer(45);
    }
  }, [phase]);

  const notifications = [
    { id: 1, icon: MessageSquare, text: "Sarah: Hey! Want to grab coffee?", sender: "Sarah", color: "from-blue-500 to-blue-600", important: false, time: "now" },
    { id: 2, icon: Bell, text: "New likes on your post", sender: "Instagram", color: "from-pink-500 to-rose-600", important: false, time: "1m ago" },
    { id: 3, icon: Phone, text: "Incoming call", sender: "Mom", color: "from-green-500 to-emerald-600", important: true, time: "now" },
    { id: 4, icon: MessageSquare, text: "Team meeting in 15 minutes", sender: "Slack", color: "from-purple-500 to-indigo-600", important: false, time: "2m ago" },
    { id: 5, icon: Navigation, text: "Turn right in 0.3 mi", sender: "Navigation", color: "from-teal-500 to-cyan-600", important: true, time: "now" },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Enhanced windshield/sky effect */}
      <div className="absolute top-0 left-0 right-0 h-1/2">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-blue-400/5 to-transparent" />
        <motion.div 
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 30% 20%, rgba(147, 197, 253, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 70% 30%, rgba(147, 197, 253, 0.2) 0%, transparent 50%)',
              'radial-gradient(circle at 30% 20%, rgba(147, 197, 253, 0.2) 0%, transparent 50%)',
            ]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      
      {/* Animated road lines */}
      {isDriving && (
        <div className="absolute inset-0 overflow-hidden opacity-40">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-16 bg-gradient-to-b from-yellow-400 to-yellow-200 left-1/2 -translate-x-1/2 rounded-full"
              initial={{ top: `${i * 20 - 20}%` }}
              animate={{ top: "120%" }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.25,
              }}
            />
          ))}
        </div>
      )}

      {/* Speed indicator (only when driving) */}
      <AnimatePresence>
        {isDriving && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-8 left-8 z-30"
          >
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-slate-800/90 backdrop-blur-sm border-2 border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <motion.div 
                    className="text-2xl font-bold text-white"
                    key={speedometer}
                  >
                    {speedometer}
                  </motion.div>
                  <div className="text-[8px] text-slate-400 font-medium">MPH</div>
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <Car className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main phone mockup */}
      <div className="relative z-10">
        {/* Phone with realistic shadows */}
        <div className="relative w-52 bg-slate-950 rounded-[32px] shadow-2xl border-[6px] border-slate-900 overflow-hidden">
          {/* Phone notch - more realistic */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-7 bg-slate-950 rounded-b-3xl z-20 border-x-[6px] border-slate-900 flex items-center justify-center gap-2">
            <div className="w-12 h-1.5 bg-slate-800 rounded-full" />
            <div className="w-2 h-2 bg-slate-800 rounded-full" />
          </div>

          {/* Screen content with realistic bezel */}
          <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 aspect-[9/19.5]">
            {/* Inner screen */}
            <div className="absolute inset-1 rounded-[28px] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
              <div className="h-full p-4 pt-10">
                {/* Enhanced status bar */}
                <div className="flex justify-between items-center mb-5 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-[10px] font-semibold">9:41</span>
                    {phase === 'problem' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 rounded-full"
                      >
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-400 text-[8px] font-medium">Distracted</span>
                      </motion.div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={`w-0.5 h-2 rounded-full ${i < 3 ? 'bg-white' : 'bg-white/30'}`} />
                      ))}
                    </div>
                    <div className="w-1 h-2 border border-white/60 rounded-[2px] relative">
                      <div className="absolute inset-[1px] bg-white/80 rounded-[1px]" />
                    </div>
                    {isDriving && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                      >
                        <Car className="w-3 h-3 text-cyan-400" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Phase-specific content */}
                <AnimatePresence mode="wait">
                  {phase === 'problem' && (
                    <motion.div
                      key="problem"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {/* Warning header */}
                      <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-center mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl backdrop-blur-sm"
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                            <span className="text-lg">⚠️</span>
                          </div>
                          <div className="text-left">
                            <div className="text-red-400 text-xs font-bold">Unsafe Driving</div>
                            <div className="text-red-300/70 text-[9px]">Too many distractions</div>
                          </div>
                        </div>
                      </motion.div>
                      
                      {/* Enhanced notifications flooding */}
                      <div className="space-y-2 overflow-hidden">
                        {notifications.slice(0, notificationCount).map((notif, index) => (
                          <motion.div
                            key={notif.id}
                            initial={{ x: 300, opacity: 0, rotate: 5 }}
                            animate={{ x: 0, opacity: 1, rotate: 0 }}
                            transition={{ 
                              delay: index * 0.5,
                              type: "spring",
                              stiffness: 200,
                              damping: 20
                            }}
                            className="group"
                          >
                            <div className={`relative bg-gradient-to-r ${notif.color} p-[1px] rounded-xl overflow-hidden`}>
                              <div className="bg-slate-800/95 backdrop-blur-md rounded-xl p-3">
                                <div className="flex items-start gap-2.5">
                                  <div className={`w-8 h-8 bg-gradient-to-br ${notif.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg`}>
                                    <notif.icon className="w-4 h-4 text-white" strokeWidth={2.5} />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="text-white text-[10px] font-bold">{notif.sender}</div>
                                      <div className="text-white/40 text-[8px]">{notif.time}</div>
                                    </div>
                                    <div className="text-white/80 text-[9px] leading-tight truncate">{notif.text}</div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {notificationCount >= 3 && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="text-center p-2 bg-orange-500/10 border border-orange-500/30 rounded-lg"
                        >
                          <div className="text-orange-400 text-[9px] font-semibold">
                            {notificationCount} notifications while driving!
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {phase === 'learning' && (
                    <motion.div
                      key="learning"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-4"
                    >
                      {/* AI Brain visualization */}
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="text-center mb-6"
                      >
                        <div className="relative inline-block">
                          <motion.div
                            className="w-20 h-20 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-2xl"
                            animate={{
                              boxShadow: [
                                '0 0 20px rgba(6, 182, 212, 0.3)',
                                '0 0 40px rgba(6, 182, 212, 0.5)',
                                '0 0 20px rgba(6, 182, 212, 0.3)',
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Brain className="w-10 h-10 text-white" strokeWidth={2} />
                          </motion.div>
                          
                          {/* Orbiting particles */}
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-2 h-2 bg-cyan-400 rounded-full"
                              animate={{
                                rotate: 360,
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "linear",
                                delay: i * 1,
                              }}
                              style={{
                                left: '50%',
                                top: '50%',
                                transformOrigin: '0 0',
                                x: Math.cos((i * 120 * Math.PI) / 180) * 50,
                                y: Math.sin((i * 120 * Math.PI) / 180) * 50,
                              }}
                            />
                          ))}
                        </div>
                        <div className="text-cyan-400 text-xs font-bold mb-1">AI Learning Mode</div>
                        <div className="text-white/60 text-[9px]">Analyzing your driving patterns</div>
                      </motion.div>

                      {/* Beautiful progress card */}
                      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-4 border border-slate-600/50 shadow-xl">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="text-white text-[10px] font-semibold">Learning Progress</div>
                            <motion.div
                              key={Math.floor(aiProgress)}
                              initial={{ scale: 1.3, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-cyan-400 text-xs font-bold"
                            >
                              {Math.floor(aiProgress)}%
                            </motion.div>
                          </div>
                          
                          {/* Gradient progress bar */}
                          <div className="relative h-2.5 bg-slate-900 rounded-full overflow-hidden">
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
                              style={{ width: `${aiProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: ['-100%', '200%'] }}
                              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            />
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-white/40" />
                            <div className="text-white/50 text-[8px]">48-hour learning period</div>
                          </div>
                        </div>
                      </div>

                      {/* Learning insights */}
                      <div className="space-y-2">
                        {[
                          { icon: MapPin, text: "Commute routes detected", delay: 1 },
                          { icon: Phone, text: "Important contacts identified", delay: 2 },
                          { icon: Clock, text: "Driving schedule learned", delay: 3 },
                        ].map((point, i) => (
                          <motion.div
                            key={point.text}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: aiProgress > (i + 1) * 25 ? 1 : 0.3, x: 0 }}
                            transition={{ delay: point.delay * 0.5 }}
                            className="flex items-center gap-2.5 p-2 bg-slate-800/50 rounded-lg border border-slate-700/50"
                          >
                            <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                              aiProgress > (i + 1) * 25 ? 'bg-cyan-500/20' : 'bg-slate-700/50'
                            }`}>
                              <point.icon className={`w-3 h-3 ${
                                aiProgress > (i + 1) * 25 ? 'text-cyan-400' : 'text-white/30'
                              }`} />
                            </div>
                            <div className={`text-[9px] font-medium ${
                              aiProgress > (i + 1) * 25 ? 'text-white/90' : 'text-white/40'
                            }`}>
                              {point.text}
                            </div>
                            {aiProgress > (i + 1) * 25 && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="ml-auto"
                              >
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              </motion.div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {phase === 'solution' && (
                    <motion.div
                      key="solution"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="space-y-3"
                    >
                      {/* Success header */}
                      <motion.div
                        initial={{ scale: 0, y: -20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-500/40 rounded-xl backdrop-blur-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                            <Shield className="w-5 h-5 text-white" strokeWidth={2.5} />
                          </div>
                          <div className="flex-1">
                            <div className="text-green-400 text-xs font-bold mb-0.5">SmartDrive Active</div>
                            <div className="text-green-300/70 text-[9px]">Auto-enabled • AI filtering</div>
                          </div>
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <CheckCircle className="w-5 h-5 text-green-400" />
                          </motion.div>
                        </div>
                      </motion.div>

                      {/* Allowed notification (Navigation) */}
                      <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                        className="relative"
                      >
                        <div className="absolute -inset-1 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur opacity-50" />
                        <div className="relative bg-gradient-to-br from-teal-900/80 to-cyan-900/80 backdrop-blur-md rounded-xl p-3 border border-teal-500/50">
                          <div className="flex items-start gap-2.5">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                              <Navigation className="w-5 h-5 text-white" strokeWidth={2.5} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <div className="text-teal-300 text-[10px] font-bold">Navigation</div>
                                <div className="px-2 py-0.5 bg-green-500/20 rounded-full">
                                  <div className="text-green-400 text-[8px] font-semibold">Allowed</div>
                                </div>
                              </div>
                              <div className="text-white text-[10px] font-medium mb-1">Turn right in 0.3 mi</div>
                              <div className="text-teal-200/60 text-[8px]">Main St → Oak Avenue</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Blocked notifications */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 px-2">
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                          <div className="text-white/30 text-[8px] font-medium">Filtered</div>
                          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>
                        
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0.6 }}
                            animate={{ 
                              opacity: [0.3, 0.15, 0.3],
                              scale: [1, 0.98, 1]
                            }}
                            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                            className="relative"
                          >
                            <div className="bg-slate-800/30 backdrop-blur-sm rounded-lg p-2.5 border border-slate-700/30 blur-[0.5px]">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 bg-slate-700/50 rounded-lg" />
                                <div className="flex-1 space-y-1.5">
                                  <div className="h-1.5 bg-slate-700/50 rounded w-3/4" />
                                  <div className="h-1 bg-slate-700/50 rounded w-1/2" />
                                </div>
                                <div className="w-4 h-4 bg-slate-700/50 rounded-full flex items-center justify-center">
                                  <X className="w-2.5 h-2.5 text-slate-500" />
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced phase indicators */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {[
            { phase: 'problem', label: 'Problem', color: 'from-red-500 to-orange-500' },
            { phase: 'learning', label: 'Learning', color: 'from-cyan-500 to-blue-500' },
            { phase: 'solution', label: 'Solution', color: 'from-green-500 to-emerald-500' }
          ].map((p) => (
            <motion.div
              key={p.phase}
              className="relative"
              animate={{
                scale: phase === p.phase ? 1 : 0.9,
              }}
            >
              <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                phase === p.phase 
                  ? `bg-gradient-to-r ${p.color} w-8 shadow-lg` 
                  : 'bg-slate-700'
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
          <div className="text-white/90 text-sm font-bold mb-1">
            {phase === 'problem' && '⚠️ The Problem'}
            {phase === 'learning' && '🧠 AI Learning'}
            {phase === 'solution' && '✅ Smart Protection'}
          </div>
          <div className="text-white/50 text-xs">
            {phase === 'problem' && 'Dangerous distractions while driving'}
            {phase === 'learning' && 'Understanding your habits in 48 hours'}
            {phase === 'solution' && 'Intelligent auto-filtering in action'}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
