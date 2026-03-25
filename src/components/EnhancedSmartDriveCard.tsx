import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import smartDriveBg from "../assets/smartdrive-bg.png";

// Notification data
const notifications = [
  { id: 1, type: 'bad', icon: '💬', app: 'iMessage', message: 'Yo you free tonight?', color: '#FF4757' },
  { id: 2, type: 'bad', icon: '📸', app: 'Instagram', message: 'Jake liked your photo', color: '#FF4757' },
  { id: 3, type: 'bad', icon: '🎵', app: 'Spotify', message: 'New mix just for you', color: '#FF4757' },
  { id: 4, type: 'good', icon: '🗺️', app: 'Maps', message: 'Turn left in 200m', color: '#00D48A' },
  { id: 5, type: 'bad', icon: '📧', app: 'Gmail', message: 'Your receipt from Amazon', color: '#FF4757' },
  { id: 6, type: 'bad', icon: '🎮', app: 'Game', message: 'Your lives are full!', color: '#FF4757' },
  { id: 7, type: 'bad', icon: '🐦', app: 'Twitter', message: '10 new notifications', color: '#FF4757' },
  { id: 8, type: 'good', icon: '📞', app: 'Mom', message: 'Incoming call...', color: '#00D48A' },
];

// Notification banner component
function NotificationBanner({ notification, onComplete }: { notification: typeof notifications[0], onComplete: () => void }) {
  const isBad = notification.type === 'bad';
  const pauseDuration = isBad ? 900 : 1800;

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 500 + pauseDuration + (isBad ? 500 : 900)); // slide in + pause + slide out
    return () => clearTimeout(timer);
  }, [pauseDuration, isBad, onComplete]);

  return (
    <motion.div
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={isBad ? { x: -300, opacity: 0 } : { y: -20, opacity: 0 }}
      transition={{
        initial: { duration: 0.5, ease: "easeOut" },
        exit: { duration: isBad ? 0.5 : 0.9 }
      }}
      className="absolute"
      style={{
        top: '9%',
        left: '4%',
        width: '36%',
        maxWidth: '420px',
        height: '9%',
        maxHeight: '74px',
        minHeight: '60px',
        borderRadius: '14px',
        backgroundColor: isBad ? 'rgba(18,12,20,0.96)' : 'rgba(10,20,16,0.96)',
        border: `1.2px solid ${isBad ? 'rgba(255,71,87,0.30)' : 'rgba(0,212,138,0.30)'}`,
        backdropFilter: 'blur(10px)',
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      {/* Left accent bar */}
      <div
        style={{
          width: '3px',
          height: '60%',
          backgroundColor: notification.color,
          borderRadius: '2px',
          flexShrink: 0
        }}
      />

      {/* Icon circle */}
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          backgroundColor: isBad ? 'rgba(255,71,87,0.12)' : 'rgba(0,212,138,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0
        }}
      >
        {notification.icon}
      </div>

      {/* Text content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            fontWeight: 700,
            color: isBad ? 'rgba(255,140,150,0.9)' : 'rgba(100,255,180,0.9)',
            marginBottom: '2px'
          }}
        >
          {notification.app}
        </div>
        <div
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.55)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {notification.message}
        </div>
      </div>

      {/* Right indicator badge */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: isBad ? 'rgba(255,71,87,0.15)' : 'rgba(0,212,138,0.15)',
          border: `1.2px solid ${isBad ? 'rgba(255,71,87,0.5)' : 'rgba(0,212,138,0.5)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        {isBad ? (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M2 2L12 12M12 2L2 12" stroke="rgba(255,71,87,0.9)" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M2 7L6 11L12 3" stroke="#00D48A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        )}
      </div>
    </motion.div>
  );
}

// Driving scene for hover state
function DrivingScene() {
  const [currentNotifIndex, setCurrentNotifIndex] = useState(0);
  const [showNotif, setShowNotif] = useState(true);

  const handleNotificationComplete = () => {
    setShowNotif(false);
    setTimeout(() => {
      setCurrentNotifIndex((prev) => (prev + 1) % notifications.length);
      setShowNotif(true);
    }, 2500);
  };

  return (
    <div className="absolute inset-0" style={{ backgroundColor: '#07090F' }}>
      {/* Sky layer (top 46%) */}
      <div 
        className="absolute top-0 left-0 right-0"
        style={{
          height: '46%',
          background: 'linear-gradient(to bottom, #08091C 0%, #0E1230 100%)'
        }}
      >
        {/* Stars */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${1 + Math.random()}px`,
              height: `${1 + Math.random()}px`,
              backgroundColor: 'rgba(255,255,240,0.5)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: 0.4 + Math.random() * 0.2
            }}
          />
        ))}
      </div>

      {/* Road layer (bottom 54%) */}
      <div 
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '54%',
          background: 'linear-gradient(to bottom, #0B0E22 0%, #08090F 100%)'
        }}
      >
        {/* Road trapezoid */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1340 442" preserveAspectRatio="none">
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#111428" />
              <stop offset="100%" stopColor="#0C0F1E" />
            </linearGradient>
          </defs>
          {/* Road surface */}
          <path
            d={`M ${1340 * 0.36} 0 L ${1340 * 0.64} 0 L 1340 442 L 0 442 Z`}
            fill="url(#roadGradient)"
          />
          {/* Left road edge */}
          <line
            x1={1340 * 0.36}
            y1="0"
            x2="0"
            y2="442"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="2.5"
          />
          {/* Right road edge */}
          <line
            x1={1340 * 0.64}
            y1="0"
            x2="1340"
            y2="442"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="2.5"
          />
        </svg>

        {/* Center dashed line with animation */}
        <motion.div
          className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2"
          style={{ width: '1px' }}
          animate={{ y: [0, 200] }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => {
            const progress = i / 15;
            const width = 0.5 + progress * 4.5;
            const opacity = 0.25 + progress * 0.3;
            return (
              <div
                key={i}
                className="absolute left-1/2 -translate-x-1/2"
                style={{
                  top: `${i * 50}px`,
                  width: `${width}px`,
                  height: `${20 + progress * 30}px`,
                  backgroundColor: 'rgba(245,197,24,' + opacity + ')',
                  borderRadius: '2px'
                }}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Steering wheel */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          bottom: '10%',
          width: '200px',
          height: '200px'
        }}
        animate={{
          rotate: [0, -4, 4, 0]
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <defs>
            <filter id="wheelGlow">
              <feGaussianBlur stdDeviation="2" />
            </filter>
          </defs>
          {/* Outer rim with glow */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="3"
            filter="url(#wheelGlow)"
          />
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="24"
          />
          {/* Three spokes */}
          {[0, 120, 240].map((angle) => (
            <line
              key={angle}
              x1="100"
              y1="100"
              x2={100 + 80 * Math.cos((angle - 90) * Math.PI / 180)}
              y2={100 + 80 * Math.sin((angle - 90) * Math.PI / 180)}
              stroke="rgba(255,255,255,0.10)"
              strokeWidth="16"
            />
          ))}
          {/* Hub */}
          <circle
            cx="100"
            cy="100"
            r="28"
            fill="rgba(255,255,255,0.07)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="2"
          />
        </svg>
      </motion.div>

      {/* HUD Overlay */}
      {/* Speed (bottom left) */}
      <div
        className="absolute"
        style={{
          bottom: '60px',
          left: '60px'
        }}
      >
        <div
          style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: '44px',
            fontWeight: 800,
            color: 'rgba(255,255,255,0.7)',
            lineHeight: 1
          }}
        >
          68
        </div>
        <div
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '16px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.3)',
            marginTop: '4px'
          }}
        >
          mph
        </div>
      </div>

      {/* AI Status pill (bottom right) */}
      <div
        className="absolute"
        style={{
          bottom: '60px',
          right: '60px'
        }}
      >
        <div
          style={{
            width: '190px',
            height: '40px',
            borderRadius: '20px',
            backgroundColor: 'rgba(0,212,138,0.10)',
            border: '1.5px solid rgba(0,212,138,0.40)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <motion.div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: '#00D48A',
              boxShadow: '0 0 6px #00D48A'
            }}
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <span
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              color: 'rgba(0,212,138,0.85)'
            }}
          >
            AI Filtering ON
          </span>
        </div>
      </div>

      {/* Notification banners */}
      <AnimatePresence mode="wait">
        {showNotif && (
          <NotificationBanner
            key={notifications[currentNotifIndex].id}
            notification={notifications[currentNotifIndex]}
            onComplete={handleNotificationComplete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function EnhancedSmartDriveCard() {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
      onHoverStart={() => setIsFlipped(true)}
      onHoverEnd={() => setIsFlipped(false)}
      style={{ perspective: '2000px' }}
    >
      <Link to="/smartdrive">
        <div 
          className="relative w-full overflow-hidden mx-auto"
          style={{
            maxWidth: '1340px',
            height: '700px',
            borderRadius: '22px'
          }}
        >
          {/* Card flip container */}
          <motion.div
            className="relative w-full h-full"
            style={{
              transformStyle: 'preserve-3d',
            }}
            animate={{
              rotateY: isFlipped ? 180 : 0
            }}
            transition={{
              duration: 1.0,
              ease: [0.645, 0.045, 0.355, 1.0]
            }}
          >
            {/* FRONT FACE */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              {/* Background image with treatment */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${smartDriveBg})`,
                  filter: 'brightness(0.45) saturate(0.85)',
                  transform: 'scale(1.04)'
                }}
              />
              
              {/* Gradient overlays */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(12,16,26,0.97) 0%, rgba(12,16,26,0.5) 25%, transparent 75%)'
                }}
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, rgba(12,16,26,0.5) 0%, transparent 55%)'
                }}
              />

              {/* Top badge */}
              <div 
                className="absolute"
                style={{
                  top: '34px',
                  left: '52px'
                }}
              >
                <div
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.11)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'rgba(255,255,255,0.82)',
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '13px',
                    fontWeight: 500,
                    padding: '7px 16px',
                    borderRadius: '100px'
                  }}
                >
                  Mobile Setting Feature
                </div>
              </div>

              {/* Bottom content */}
              <div 
                className="absolute bottom-0 left-0"
                style={{ padding: '52px' }}
              >
                {/* Title */}
                <h1
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontSize: '74px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    letterSpacing: '-1.5px',
                    lineHeight: '1.0',
                    maxWidth: '780px',
                    marginBottom: '16px'
                  }}
                >
                  AI-powered focus for safer driving
                </h1>

                {/* Description */}
                <p
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: '16px',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.62)',
                    lineHeight: '1.68',
                    maxWidth: '600px',
                    marginBottom: '24px'
                  }}
                >
                  SmartDrive learns your habits to filter distractions and keep you focused on the road
                </p>

                {/* CTA Button */}
                <button
                  className="inline-flex items-center gap-2 text-[15px] font-semibold transition-all duration-300 hover:opacity-90"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.94)',
                    color: '#0C1018',
                    fontFamily: 'DM Sans, sans-serif',
                    padding: '15px 28px',
                    borderRadius: '100px'
                  }}
                >
                  <span>Go to project</span>
                  <ArrowRight className="w-[15px] h-[15px]" style={{ strokeWidth: 1.8 }} />
                </button>
              </div>
            </div>

            {/* BACK FACE */}
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)'
              }}
            >
              <DrivingScene />
            </div>
          </motion.div>
        </div>
      </Link>
    </motion.div>
  );
}
