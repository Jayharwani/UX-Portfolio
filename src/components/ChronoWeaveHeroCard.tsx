import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";

export function ChronoWeaveHeroCard() {
  const [time, setTime] = useState(new Date());
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  // IntersectionObserver-gated clock interval
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !interval) {
          interval = setInterval(() => {
            setTime(new Date());
          }, 1000);
        } else if (!entry.isIntersecting && interval) {
          clearInterval(interval);
          interval = null;
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (interval) clearInterval(interval);
    };
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = (seconds / 60) * 360;
  const minuteAngle = (minutes / 60) * 360 + (seconds / 60) * 6;
  const hourAngle = (hours / 12) * 360 + (minutes / 60) * 30;

  const clockRadius = 140; // 280px / 2

  // Generate tick marks
  const tickMarks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180); // -90 to start at 12 o'clock
    const isMajor = i % 3 === 0; // Major ticks at 12, 3, 6, 9
    const innerRadius = isMajor ? clockRadius * 0.74 : clockRadius * 0.82;
    const outerRadius = clockRadius * 0.9;

    return {
      x1: clockRadius + Math.cos(angle) * innerRadius,
      y1: clockRadius + Math.sin(angle) * innerRadius,
      x2: clockRadius + Math.cos(angle) * outerRadius,
      y2: clockRadius + Math.sin(angle) * outerRadius,
      isMajor,
    };
  });

  // Generate pie zones (3 zones at 120 each)
  const createPieZone = (startAngle: number, color: string) => {
    const endAngle = startAngle + 120;
    const innerRadius = clockRadius * 0.86;

    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = clockRadius + Math.cos(startRad) * innerRadius;
    const y1 = clockRadius + Math.sin(startRad) * innerRadius;
    const x2 = clockRadius + Math.cos(endRad) * innerRadius;
    const y2 = clockRadius + Math.sin(endRad) * innerRadius;

    const largeArc = 0; // 120 is less than 180

    return {
      d: `M ${clockRadius} ${clockRadius} L ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color,
    };
  };

  const pieZones = [
    createPieZone(0, 'rgba(244,114,182,0.16)'),    // Pink (12-4)
    createPieZone(120, 'rgba(167,139,250,0.16)'), // Purple (4-8)
    createPieZone(240, 'rgba(251,191,36,0.16)'),  // Amber (8-12)
  ];

  return (
    <Link to="/chronoweave" className="block">
      <div
        ref={cardRef}
        className="relative overflow-hidden mx-auto rounded-[16px] md:rounded-[22px]"
        style={{
          width: '100%',
          maxWidth: '1340px',
          minHeight: '360px',
          background: 'radial-gradient(ellipse at 70% 30%, #1A1025 0%, #12091E 50%, #0D0618 100%)',
        }}
      >
        {/* Clock Glow */}
        <div
          className="absolute"
          style={{
            top: '-8%',
            right: '8%',
            width: '48%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(160,60,255,0.18) 0%, rgba(200,80,200,0.08) 40%, transparent 68%)',
          }}
        />

        {/* Top Left Badge */}
        <motion.div
          className="absolute flex items-center gap-2"
          style={{
            top: '24px',
            left: '24px',
            padding: '6px 14px',
            borderRadius: '100px',
            backgroundColor: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: 'easeOut' }}
        >
          {/* Pulsing Dot — CSS */}
          <div
            className="rounded-full"
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#C084FC',
              filter: 'drop-shadow(0 0 6px #C084FC)',
              animation: 'pulse-dot 2.2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              fontWeight: 500,
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.05em',
            }}
          >
            Mobile App • FigBuild 2026
          </span>
        </motion.div>

        {/* Content + Visual Layout */}
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:min-h-[700px] min-h-[420px]">

        {/* Left Content */}
        <div
          className="relative z-10 flex flex-col gap-3 md:gap-[18px] p-6 pt-16 md:p-12 md:pt-20 lg:p-[50px] lg:pb-16 lg:pt-auto lg:absolute lg:bottom-16 lg:left-[50px] lg:max-w-[50%]"
        >
          {/* Title */}
          <motion.h1
            className="text-[28px] sm:text-[56px] md:text-[68px] lg:text-[80px]"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              lineHeight: 0.93,
              letterSpacing: '-2px',
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <span style={{ color: '#FFFFFF' }}>Chrono</span>
            <span
              style={{
                background: 'linear-gradient(120deg, #C4B5FD 0%, #F472B6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              Weave
            </span>
          </motion.h1>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap items-center gap-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: 'easeOut' }}
          >
            <div
              style={{
                padding: '5px 12px',
                borderRadius: '100px',
                backgroundColor: 'rgba(244,114,182,0.08)',
                border: '1px solid rgba(244,114,182,0.30)',
                color: '#F472B6',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10.5px',
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><path d="M2 8h4l3-5 6 14 3-9h4"/></svg>Haptics
            </div>
            <div
              style={{
                padding: '5px 12px',
                borderRadius: '100px',
                backgroundColor: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.30)',
                color: '#A78BFA',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10.5px',
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>Audio
            </div>
            <div
              style={{
                padding: '5px 12px',
                borderRadius: '100px',
                backgroundColor: 'rgba(251,191,36,0.08)',
                border: '1px solid rgba(251,191,36,0.30)',
                color: '#FBBF24',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10.5px',
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>Light
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            className="hidden sm:block"
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15.5px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.58)',
              lineHeight: 1.72,
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.42, ease: 'easeOut' }}
          >
            Multi-sensory nudges for time blindness. An AI-powered app that helps ADHD adults feel time passing.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            className="inline-flex items-center gap-2"
            style={{
              padding: '10px 18px',
              borderRadius: '100px',
              backgroundColor: '#FFFFFF',
              color: '#08091A',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              width: 'fit-content',
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.52, ease: 'easeOut' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <span>Go to project</span>
            <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Right Side - Floating Clock */}
        <div
          className="relative flex items-center justify-center py-6 lg:absolute lg:py-0 lg:top-1/2 lg:right-[120px] lg:-translate-y-1/2"
        >
          {/* Outer Glow — CSS pulse */}
          <div
            className="absolute hidden lg:block"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '364px',
              height: '364px',
              background: 'radial-gradient(circle, rgba(140,100,255,0.18) 0%, rgba(200,80,200,0.08) 50%, transparent 100%)',
              borderRadius: '50%',
              animation: 'pulse-dot 5s ease-in-out infinite',
            }}
          />

          {/* Clock Container */}
          <svg className="w-[180px] h-[180px] sm:w-[220px] sm:h-[220px] lg:w-[280px] lg:h-[280px]" viewBox="0 0 280 280" style={{ position: 'relative', zIndex: 1 }}>
            {/* Clock Face */}
            <circle
              cx={clockRadius}
              cy={clockRadius}
              r={clockRadius - 1.5}
              fill="rgba(10,8,26,0.88)"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1.5"
            />

            {/* Pie Zones */}
            {pieZones.map((zone, i) => (
              <path key={i} d={zone.d} fill={zone.color} />
            ))}

            {/* Colored Rim - Conic Gradient */}
            <defs>
              <linearGradient id="clockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F472B6" />
                <stop offset="33%" stopColor="#A78BFA" />
                <stop offset="66%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#F472B6" />
              </linearGradient>
            </defs>
            <circle
              cx={clockRadius}
              cy={clockRadius}
              r={clockRadius - 1.5}
              fill="none"
              stroke="url(#clockGradient)"
              strokeWidth="2.5"
            />

            {/* Tick Marks */}
            {tickMarks.map((tick, i) => (
              <line
                key={i}
                x1={tick.x1}
                y1={tick.y1}
                x2={tick.x2}
                y2={tick.y2}
                stroke={tick.isMajor ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)'}
                strokeWidth={tick.isMajor ? '2.5' : '1.2'}
                strokeLinecap="round"
              />
            ))}

            {/* Hour Hand */}
            <line
              x1={clockRadius}
              y1={clockRadius}
              x2={clockRadius + Math.cos((hourAngle - 90) * Math.PI / 180) * (clockRadius * 0.5)}
              y2={clockRadius + Math.sin((hourAngle - 90) * Math.PI / 180) * (clockRadius * 0.5)}
              stroke="#C4B5FD"
              strokeWidth="4"
              strokeLinecap="round"
              filter="drop-shadow(0 0 12px #A78BFA)"
            />

            {/* Minute Hand */}
            <line
              x1={clockRadius}
              y1={clockRadius}
              x2={clockRadius + Math.cos((minuteAngle - 90) * Math.PI / 180) * (clockRadius * 0.68)}
              y2={clockRadius + Math.sin((minuteAngle - 90) * Math.PI / 180) * (clockRadius * 0.68)}
              stroke="#DDD6FE"
              strokeWidth="2.8"
              strokeLinecap="round"
              filter="drop-shadow(0 0 12px #C4B5FD)"
            />

            {/* Second Hand */}
            <line
              x1={clockRadius}
              y1={clockRadius}
              x2={clockRadius + Math.cos((secondAngle - 90) * Math.PI / 180) * (clockRadius * 0.82)}
              y2={clockRadius + Math.sin((secondAngle - 90) * Math.PI / 180) * (clockRadius * 0.82)}
              stroke="#F472B6"
              strokeWidth="1.6"
              strokeLinecap="round"
              filter="drop-shadow(0 0 12px #F472B6)"
            />

            {/* Center Cap */}
            <circle
              cx={clockRadius}
              cy={clockRadius}
              r={clockRadius * 0.065}
              fill="#C084FC"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1.5"
              filter="drop-shadow(0 0 14px #C084FC)"
            />
          </svg>
        </div>
        </div>{/* end content+visual layout */}
      </div>
    </Link>
  );
}
