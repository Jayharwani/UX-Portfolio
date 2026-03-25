import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";

export function ChronoWeaveHeroCard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
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

  // Generate pie zones (3 zones at 120° each)
  const createPieZone = (startAngle: number, color: string) => {
    const endAngle = startAngle + 120;
    const innerRadius = clockRadius * 0.86;
    
    const startRad = (startAngle - 90) * (Math.PI / 180);
    const endRad = (endAngle - 90) * (Math.PI / 180);
    
    const x1 = clockRadius + Math.cos(startRad) * innerRadius;
    const y1 = clockRadius + Math.sin(startRad) * innerRadius;
    const x2 = clockRadius + Math.cos(endRad) * innerRadius;
    const y2 = clockRadius + Math.sin(endRad) * innerRadius;
    
    const largeArc = 0; // 120° is less than 180°
    
    return {
      d: `M ${clockRadius} ${clockRadius} L ${x1} ${y1} A ${innerRadius} ${innerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color,
    };
  };

  const pieZones = [
    createPieZone(0, 'rgba(45,212,191,0.16)'),    // Teal (12→4)
    createPieZone(120, 'rgba(167,139,250,0.16)'), // Purple (4→8)
    createPieZone(240, 'rgba(251,191,36,0.16)'),  // Amber (8→12)
  ];

  return (
    <Link to="/chronoweave" className="block">
      <div
        className="relative overflow-hidden mx-auto"
        style={{
          width: '100%',
          maxWidth: '1340px',
          height: '700px',
          borderRadius: '22px',
          background: 'radial-gradient(ellipse at 70% 30%, #14172E 0%, #0B0D1E 50%, #08091A 100%)',
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
            background: 'radial-gradient(circle, rgba(120,80,255,0.16) 0%, rgba(40,200,180,0.07) 40%, transparent 68%)',
          }}
        />

        {/* Top Left Badge */}
        <motion.div
          className="absolute flex items-center gap-2"
          style={{
            top: '36px',
            left: '50px',
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
          {/* Pulsing Dot */}
          <motion.div
            className="rounded-full"
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#2DD4BF',
              filter: 'drop-shadow(0 0 6px #2DD4BF)',
            }}
            animate={{
              opacity: [1, 0.2, 1],
            }}
            transition={{
              duration: 2.2,
              repeat: Infinity,
              ease: 'easeInOut',
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

        {/* Bottom Left Content */}
        <div
          className="absolute"
          style={{
            bottom: '64px',
            left: '50px',
            maxWidth: '50%',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Title */}
          <motion.h1
            style={{
              fontFamily: 'Syne, sans-serif',
              fontSize: '80px',
              fontWeight: 800,
              lineHeight: 0.93,
              letterSpacing: '-2px',
            }}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
          >
            <span style={{ color: '#FFFFFF' }}>Chrono</span>
            <motion.span
              style={{
                background: 'linear-gradient(120deg, #C4B5FD 0%, #2DD4BF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              Weave
            </motion.span>
          </motion.h1>

          {/* Feature Pills */}
          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.32, ease: 'easeOut' }}
          >
            <div
              style={{
                padding: '5px 12px',
                borderRadius: '100px',
                backgroundColor: 'rgba(45,212,191,0.08)',
                border: '1px solid rgba(45,212,191,0.30)',
                color: '#2DD4BF',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '11.5px',
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
                fontSize: '11.5px',
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
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>Light
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '15.5px',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.48)',
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
              padding: '14px 26px',
              borderRadius: '100px',
              backgroundColor: '#FFFFFF',
              color: '#08091A',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '14px',
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
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Right Side - Floating Clock */}
        <motion.div
          className="absolute"
          style={{
            top: '50%',
            right: '120px',
            transform: 'translateY(-50%)',
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -12, 0],
          }}
          transition={{
            opacity: { duration: 0.6, delay: 0.4, ease: 'easeOut' },
            scale: { duration: 0.6, delay: 0.4, ease: 'easeOut' },
            y: {
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          }}
        >
          {/* Outer Glow */}
          <motion.div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '364px', // 130% of 280px
              height: '364px',
              background: 'radial-gradient(circle, rgba(140,100,255,0.18) 0%, rgba(45,212,191,0.06) 50%, transparent 100%)',
              borderRadius: '50%',
            }}
            animate={{
              opacity: [1, 0.5, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* Clock Container */}
          <svg width="280" height="280" viewBox="0 0 280 280" style={{ position: 'relative', zIndex: 1 }}>
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
                <stop offset="0%" stopColor="#2DD4BF" />
                <stop offset="33%" stopColor="#A78BFA" />
                <stop offset="66%" stopColor="#FBBF24" />
                <stop offset="100%" stopColor="#2DD4BF" />
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
              stroke="#2DD4BF"
              strokeWidth="1.6"
              strokeLinecap="round"
              filter="drop-shadow(0 0 12px #2DD4BF)"
            />

            {/* Center Cap */}
            <circle
              cx={clockRadius}
              cy={clockRadius}
              r={clockRadius * 0.065}
              fill="#2DD4BF"
              stroke="rgba(255,255,255,0.9)"
              strokeWidth="1.5"
              filter="drop-shadow(0 0 14px #2DD4BF)"
            />
          </svg>
        </motion.div>
      </div>
    </Link>
  );
}