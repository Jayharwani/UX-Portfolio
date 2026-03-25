import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

export function ChronoWeaveHeroAnimation() {
  const [phase, setPhase] = useState<'chaos' | 'nudge' | 'calm'>('chaos');
  const [chaosVariant, setChaosVariant] = useState<'A' | 'B'>('A');

  // Debug: Log phase changes
  useEffect(() => {
    console.log('ChronoWeave Phase:', phase, 'Variant:', chaosVariant);
  }, [phase, chaosVariant]);

  // Timeline: 3s chaos → 1.5s nudge → 3.5s calm
  useEffect(() => {
    const timeline = [
      { phase: 'chaos' as const, duration: 3000 },
      { phase: 'nudge' as const, duration: 1500 },
      { phase: 'calm' as const, duration: 3500 },
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

  // Dancing effect for chaos ticks - alternate between A and B positions every 500ms for faster dancing
  useEffect(() => {
    if (phase !== 'chaos') return;
    
    const interval = setInterval(() => {
      setChaosVariant(prev => prev === 'A' ? 'B' : 'A');
    }, 500);

    return () => clearInterval(interval);
  }, [phase]);

  // Segment colors
  const segments = [
    { id: 1, color: '#2DD4BF', label: '6AM' },
    { id: 2, color: '#60A5FA', label: '9AM' },
    { id: 3, color: '#FBBF24', label: '12PM' },
    { id: 4, color: '#A78BFA', label: '3PM' },
    { id: 5, color: '#F472B6', label: '6PM' },
    { id: 6, color: '#818CF8', label: '9PM' },
  ];

  // Segment widths based on phase
  const getSegmentWidth = (index: number) => {
    if (phase === 'calm') return 16.67; // Equal
    if (phase === 'nudge') {
      // Almost equal
      const nudgeWidths = [13, 20, 15, 18, 16, 18];
      return nudgeWidths[index];
    }
    // Chaos - unequal
    const chaosWidths = [8, 24, 11, 19, 14, 24];
    return chaosWidths[index];
  };

  // Background glow color
  const getBackgroundGlow = () => {
    if (phase === 'chaos') return 'radial-gradient(circle at center, rgba(244,114,182,0.1), transparent 70%)';
    if (phase === 'nudge') return 'radial-gradient(circle at center, rgba(167,139,250,0.08), transparent 70%)';
    return 'radial-gradient(circle at center, rgba(45,212,191,0.08), transparent 70%)';
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center" style={{ backgroundColor: '#07090F', minHeight: '600px' }}>
      {/* Background Glow */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: getBackgroundGlow(),
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Main Container */}
      <div className="relative w-[86%] max-w-[1150px]">
        {/* Timeline Bar Container */}
        <div className="relative mb-[200px]">
          {/* Ghost Bars (Chaos only) */}
          <AnimatePresence>
            {phase === 'chaos' && (
              <>
                {/* Ghost bar 8px above - pink */}
                <motion.div
                  className="absolute inset-x-0 rounded-[29px]"
                  style={{
                    height: '58px',
                    bottom: 'calc(100% + 8px)',
                    border: '1px solid rgba(244,114,182,0.12)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Ghost bar 16px above - pink */}
                <motion.div
                  className="absolute inset-x-0 rounded-[29px]"
                  style={{
                    height: '58px',
                    bottom: 'calc(100% + 16px)',
                    border: '1px solid rgba(244,114,182,0.08)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
                {/* Ghost bar 8px below - purple */}
                <motion.div
                  className="absolute inset-x-0 rounded-[29px]"
                  style={{
                    height: '58px',
                    top: 'calc(100% + 8px)',
                    border: '1px solid rgba(167,139,250,0.12)',
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </>
            )}
          </AnimatePresence>

          {/* Main Timeline Bar */}
          <div 
            className="relative w-full rounded-[29px] overflow-hidden"
            style={{
              height: '58px',
              backgroundColor: 'rgba(255,255,255,0.02)',
            }}
          >
            {/* Segments */}
            <div className="absolute inset-0 flex">
              {segments.map((segment, index) => (
                <motion.div
                  key={`segment-${segment.id}`}
                  className="relative h-full"
                  animate={{
                    width: `${getSegmentWidth(index)}%`,
                    opacity: phase === 'chaos' ? 0.15 : 1,
                  }}
                  transition={{ 
                    duration: phase === 'nudge' ? 0.6 : phase === 'calm' ? 0.5 : 0.4,
                    ease: phase === 'calm' ? [0.645, 0.045, 0.355, 1] : "easeOut"
                  }}
                  style={{
                    backgroundColor: `${segment.color}40`, // 25% opacity
                  }}
                >
                  {/* Top Rim Glow (Calm only) */}
                  <AnimatePresence>
                    {phase === 'calm' && (
                      <motion.div
                        className="absolute top-0 inset-x-0"
                        style={{
                          height: '3px',
                          backgroundColor: segment.color,
                          filter: `drop-shadow(0 0 8px ${segment.color})`,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Segment Dividers */}
                  {index < segments.length - 1 && (
                    <div
                      className="absolute right-0 top-1/2 -translate-y-1/2 bg-white"
                      style={{
                        width: '1.5px',
                        height: '70%',
                        opacity: 0.25,
                      }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Crack Lines (Chaos only) */}
            <AnimatePresence>
              {phase === 'chaos' && (
                <>
                  {[20, 35, 50, 65, 80].map((left, idx) => (
                    <motion.div
                      key={`crack-${idx}`}
                      className="absolute top-1/2"
                      style={{
                        left: `${left}%`,
                        width: '1.5px',
                        height: '45%',
                        backgroundColor: 'rgba(244,114,182,0.4)',
                        transform: `translateY(-50%) rotate(${-8 + idx * 4}deg)`,
                        transformOrigin: 'center',
                      }}
                      initial={{ opacity: 0, scaleY: 0 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      exit={{ opacity: 0, scaleY: 0 }}
                      transition={{ delay: idx * 0.08, duration: 0.3 }}
                    />
                  ))}
                </>
              )}
            </AnimatePresence>

            {/* Now Marker (Moving Dot) */}
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: '22px',
                height: '22px',
              }}
              animate={{
                left: ['15%', '85%', '15%'],
                backgroundColor: phase === 'chaos' ? 'rgba(244,114,182,0.3)' : phase === 'nudge' ? '#C4B5FD' : '#FFFFFF',
                borderColor: phase === 'chaos' ? 'rgba(244,114,182,0.5)' : phase === 'nudge' ? '#C4B5FD' : '#2DD4BF',
                borderWidth: '2.5px',
                filter: phase === 'chaos' 
                  ? 'drop-shadow(0 0 8px rgba(244,114,182,0.4))' 
                  : phase === 'nudge'
                  ? 'drop-shadow(0 0 14px rgba(167,139,250,0.8))'
                  : 'drop-shadow(0 0 14px rgba(45,212,191,1))',
              }}
              transition={{
                left: { duration: 7, repeat: Infinity, ease: "linear" },
                backgroundColor: { duration: 0.5 },
                borderColor: { duration: 0.5 },
                filter: { duration: 0.5 },
              }}
            />
          </div>

          {/* Tick Marks and Labels Above Bar */}
          <div className="absolute bottom-full mb-0 inset-x-0">
            {segments.slice(1).map((segment, index) => {
              // Calculate cumulative position
              let position = 0;
              for (let i = 0; i <= index; i++) {
                position += getSegmentWidth(i);
              }
              
              // Dancing tick marks - different positions for chaos A vs B
              const getChaosTickData = () => {
                if (chaosVariant === 'A') {
                  const dataA = [
                    { height: 12, offsetX: -3, rotate: -3 },
                    { height: 18, offsetX: 2, rotate: 2 },
                    { height: 10, offsetX: 0, rotate: -4 },
                    { height: 16, offsetX: -2, rotate: 3 },
                    { height: 14, offsetX: 3, rotate: -2 },
                  ];
                  return dataA[index];
                } else {
                  const dataB = [
                    { height: 16, offsetX: 6, rotate: 2 },
                    { height: 12, offsetX: -4, rotate: -3 },
                    { height: 20, offsetX: 5, rotate: 1 },
                    { height: 10, offsetX: -3, rotate: -2 },
                    { height: 18, offsetX: 7, rotate: 3 },
                  ];
                  return dataB[index];
                }
              };

              const getNudgeTickData = () => {
                const nudgeData = [
                  { height: 22, offsetX: 1, rotate: 1 },
                  { height: 26, offsetX: -1, rotate: -1 },
                  { height: 20, offsetX: 2, rotate: 2 },
                  { height: 28, offsetX: 0, rotate: -1 },
                  { height: 24, offsetX: -1, rotate: 1 },
                ];
                return nudgeData[index];
              };

              // Dancing label positions for chaos
              const getChaosLabelData = () => {
                if (chaosVariant === 'A') {
                  const labelsA = [
                    { offsetY: -25, offsetX: -8 },
                    { offsetY: 15, offsetX: 10 },
                    { offsetY: -18, offsetX: 5 },
                    { offsetY: 20, offsetX: -12 },
                    { offsetY: -12, offsetX: 15 },
                  ];
                  return labelsA[index];
                } else {
                  const labelsB = [
                    { offsetY: 18, offsetX: 12 },
                    { offsetY: -20, offsetX: -6 },
                    { offsetY: 22, offsetX: -10 },
                    { offsetY: -15, offsetX: 8 },
                    { offsetY: 25, offsetX: -15 },
                  ];
                  return labelsB[index];
                }
              };

              // Get data based on phase
              const chaosData = getChaosTickData();
              const nudgeData = getNudgeTickData();
              const chaosLabelData = getChaosLabelData();

              const tickHeight = phase === 'calm' ? 35 : phase === 'nudge' ? nudgeData.height : chaosData.height;
              const tickOffsetX = phase === 'calm' ? 0 : phase === 'nudge' ? nudgeData.offsetX : chaosData.offsetX;
              const tickRotate = phase === 'calm' ? 0 : phase === 'nudge' ? nudgeData.rotate : chaosData.rotate;

              // Label dancing offsets
              const labelOffsetY = phase === 'chaos' ? chaosLabelData.offsetY : 0;
              const labelOffsetX = phase === 'chaos' ? chaosLabelData.offsetX : 0;

              return (
                <div key={`tick-${segment.id}`} className="absolute" style={{ left: `${position}%` }}>
                  {/* Tick Mark - Dancing with labels in chaos, connector in nudge/calm */}
                  <motion.div
                    className="absolute left-1/2 rounded-full origin-bottom"
                    animate={{
                      // During chaos: short tick at label position (dancing)
                      // During nudge/calm: grows down to connect label to bar
                      height: phase === 'chaos' ? '8px' : `${tickHeight}px`,
                      width: '1.5px',
                      bottom: phase === 'chaos' ? `${20 + Math.abs(labelOffsetY)}px` : '0px',
                      x: phase === 'chaos' ? `calc(-50% + ${labelOffsetX}px)` : `${tickOffsetX - 0.75}px`,
                      rotate: `${tickRotate}deg`,
                      backgroundColor: phase === 'chaos' 
                        ? `rgba(255,255,255,0.2)` 
                        : phase === 'nudge'
                        ? `${segment.color}99` // 60% opacity
                        : segment.color, // Full color in calm
                      filter: phase === 'calm' ? `drop-shadow(0 0 8px ${segment.color})` : 'none',
                    }}
                    transition={{ 
                      duration: phase === 'chaos' ? 0.5 : phase === 'nudge' ? 0.6 : 0.5,
                      ease: "easeInOut"
                    }}
                  />

                  {/* Glowing Dot at top of tick (Calm only) */}
                  <AnimatePresence>
                    {phase === 'calm' && (
                      <motion.div
                        className="absolute left-1/2 rounded-full"
                        style={{
                          bottom: '35px',
                          width: '8px',
                          height: '8px',
                          marginLeft: '-4px',
                          backgroundColor: segment.color,
                          filter: `drop-shadow(0 0 8px ${segment.color})`,
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.4 }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Time Label */}
                  <motion.div
                    className="absolute left-1/2 text-sm font-medium whitespace-nowrap"
                    style={{
                      bottom: phase === 'calm' ? '48px' : phase === 'nudge' ? '35px' : '20px',
                    }}
                    animate={{
                      x: phase === 'chaos' ? `calc(-50% + ${labelOffsetX}px)` : '-50%',
                      y: phase === 'chaos' ? `${labelOffsetY}px` : '0px',
                      color: phase === 'calm' ? segment.color : `rgba(255,255,255,${phase === 'nudge' ? 0.5 : 0.3})`,
                      filter: phase === 'calm' ? `drop-shadow(0 0 6px ${segment.color})` : 'none',
                    }}
                    transition={{ 
                      duration: phase === 'chaos' ? 0.5 : phase === 'nudge' ? 0.6 : 0.5,
                      ease: "easeInOut"
                    }}
                  >
                    {segment.label}
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sensor Icons Below Timeline */}
        <div className="relative flex justify-between items-center px-[10%]">
          {[
            { 
              id: 'haptic', 
              color: '#2DD4BF', 
              label: 'Haptic',
              icon: 'phone',
            },
            { 
              id: 'audio', 
              color: '#A78BFA', 
              label: 'Audio',
              icon: 'speaker',
            },
            { 
              id: 'light', 
              color: '#FBBF24', 
              label: 'Light',
              icon: 'bulb',
            },
          ].map((sensor) => (
            <div key={sensor.id} className="relative flex flex-col items-center">
              {/* Connector Line */}
              <AnimatePresence>
                {(phase === 'nudge' || phase === 'calm') && (
                  <motion.div
                    className="absolute bottom-full left-1/2 -translate-x-1/2"
                    style={{
                      width: '1.5px',
                      height: '200px',
                      background: `${sensor.color}59`, // 35% opacity
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 5px, rgba(0,0,0,0) 5px, rgba(0,0,0,0) 10px)',
                      borderLeft: `1.5px dashed ${sensor.color}59`,
                      backgroundColor: 'rgba(0, 0, 0, 0)',
                    }}
                    initial={{ opacity: 0, scaleY: 0, originY: 1 }}
                    animate={{ opacity: 1, scaleY: 1 }}
                    exit={{ opacity: 0, scaleY: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Travelling Dot */}
                    <motion.div
                      className="absolute left-1/2 -translate-x-1/2 rounded-full"
                      style={{
                        width: '6px',
                        height: '6px',
                        backgroundColor: sensor.color,
                        filter: `drop-shadow(0 0 6px ${sensor.color})`,
                      }}
                      animate={{
                        bottom: ['0%', '100%'],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Icon Circle */}
              <motion.div
                className="relative rounded-full flex items-center justify-center"
                style={{
                  width: '110px',
                  height: '110px',
                }}
                animate={{
                  scale: phase === 'chaos' ? 0 : 1,
                  opacity: phase === 'chaos' ? 0 : 1,
                  backgroundColor: 'rgba(0, 0, 0, 0)',
                  borderColor: sensor.color,
                  borderWidth: '2.5px',
                }}
                transition={{
                  duration: phase === 'nudge' ? 0.6 : 0.5,
                  ease: "easeOut"
                }}
              >
                {/* Icon Content */}
                {sensor.icon === 'phone' && (
                  <div className="relative">
                    {/* Phone body */}
                    <div 
                      className="relative rounded-lg"
                      style={{
                        width: '32px',
                        height: '52px',
                        backgroundColor: '#10122A',
                        border: `2px solid ${sensor.color}`,
                      }}
                    >
                      <div 
                        className="absolute rounded-md"
                        style={{ 
                          top: '4px',
                          left: '4px',
                          right: '4px',
                          bottom: '4px',
                          backgroundColor: `${sensor.color}14`,
                        }}
                      />
                    </div>
                    
                    {/* Vibration arcs (Calm only) */}
                    <AnimatePresence>
                      {phase === 'calm' && (
                        <>
                          {/* Left side arcs */}
                          {[16, 22, 28].map((size, idx) => (
                            <motion.div
                              key={`arc-left-${idx}`}
                              className="absolute top-1/2 rounded-full"
                              style={{
                                right: '100%',
                                width: `${size}px`,
                                height: `${size}px`,
                                border: `2px solid ${sensor.color}`,
                                borderRightColor: 'transparent',
                                borderTopColor: 'transparent',
                                borderBottomColor: 'transparent',
                                transform: 'translateY(-50%)',
                                opacity: 0.7 - idx * 0.2,
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.7 - idx * 0.2 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: idx * 0.08, duration: 0.3 }}
                            />
                          ))}
                          {/* Right side arcs */}
                          {[16, 22, 28].map((size, idx) => (
                            <motion.div
                              key={`arc-right-${idx}`}
                              className="absolute top-1/2 rounded-full"
                              style={{
                                left: '100%',
                                width: `${size}px`,
                                height: `${size}px`,
                                border: `2px solid ${sensor.color}`,
                                borderLeftColor: 'transparent',
                                borderTopColor: 'transparent',
                                borderBottomColor: 'transparent',
                                transform: 'translateY(-50%)',
                                opacity: 0.7 - idx * 0.2,
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.7 - idx * 0.2 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: idx * 0.08, duration: 0.3 }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {sensor.icon === 'speaker' && (
                  <div className="relative">
                    {/* Speaker body */}
                    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                      <path
                        d="M12 14 L12 28 L18 28 L26 33 L26 9 L18 14 Z"
                        fill="#10122A"
                        stroke={sensor.color}
                        strokeWidth="2"
                        strokeLinejoin="round"
                      />
                    </svg>

                    {/* Sound waves (Calm only) */}
                    <AnimatePresence>
                      {phase === 'calm' && (
                        <>
                          {[20, 28, 36].map((size, idx) => (
                            <motion.div
                              key={`wave-${idx}`}
                              className="absolute top-1/2 left-3/4 rounded-full"
                              style={{
                                width: `${size}px`,
                                height: `${size}px`,
                                border: `2px solid ${sensor.color}`,
                                borderLeftColor: 'transparent',
                                borderBottomColor: 'transparent',
                                transform: 'translateY(-50%) rotate(45deg)',
                                opacity: 0.8 - idx * 0.2,
                              }}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ scale: 1, opacity: 0.8 - idx * 0.2 }}
                              exit={{ scale: 0, opacity: 0 }}
                              transition={{ delay: idx * 0.08, duration: 0.3 }}
                            />
                          ))}
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {sensor.icon === 'bulb' && (
                  <div className="relative">
                    {/* Lightbulb */}
                    <svg width="40" height="52" viewBox="0 0 40 52" fill="none">
                      {/* Bulb */}
                      <circle cx="20" cy="16" r="12" fill="#10122A" stroke={sensor.color} strokeWidth="2" />
                      {/* Base bars */}
                      <rect x="12" y="30" width="16" height="4" rx="2" fill={sensor.color} />
                      <rect x="14" y="36" width="12" height="4" rx="2" fill={sensor.color} />
                      
                      {/* Active glow (Calm only) */}
                      {phase === 'calm' && (
                        <>
                          <circle cx="20" cy="16" r="10" fill={sensor.color} opacity="0.3" />
                          {/* Rays */}
                          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                            const rad = (angle * Math.PI) / 180;
                            const x1 = 20 + Math.cos(rad) * 15;
                            const y1 = 16 + Math.sin(rad) * 15;
                            const x2 = 20 + Math.cos(rad) * 21;
                            const y2 = 16 + Math.sin(rad) * 21;
                            return (
                              <line
                                key={angle}
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={sensor.color}
                                strokeWidth="2"
                                strokeLinecap="round"
                                opacity="0.7"
                              />
                            );
                          })}
                        </>
                      )}
                    </svg>
                  </div>
                )}
              </motion.div>

              {/* Ripple Rings (Calm only) */}
              <AnimatePresence>
                {phase === 'calm' && (
                  <>
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full border-2"
                      style={{
                        borderColor: sensor.color,
                        width: '130px',
                        height: '130px',
                        opacity: 0.35,
                      }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.35 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    />
                    <motion.div
                      className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full border-2"
                      style={{
                        borderColor: sensor.color,
                        width: '150px',
                        height: '150px',
                        opacity: 0.18,
                      }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 0.18 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Label */}
              <motion.p 
                className="absolute top-full mt-4 text-sm font-medium whitespace-nowrap"
                style={{ color: sensor.color }}
                animate={{
                  opacity: phase === 'chaos' ? 0 : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {sensor.label}
              </motion.p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}