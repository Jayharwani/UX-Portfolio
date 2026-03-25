import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";

// SVG icon components for notifications
const NotifIcon = ({ type }: { type: string }) => {
  const icons: Record<string, JSX.Element> = {
    message: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,140,150,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    camera: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,140,150,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
    map: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D48A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
    music: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,140,150,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>,
    phone: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#00D48A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
    bell: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,140,150,0.9)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  };
  return icons[type] || icons.bell;
};

// Notification data for the animated phone
const notifications = [
  { id: 1, type: 'blocked', iconType: 'message', app: 'iMessage', color: '#FF4757' },
  { id: 2, type: 'blocked', iconType: 'camera', app: 'Instagram', color: '#FF4757' },
  { id: 3, type: 'allowed', iconType: 'map', app: 'Maps', color: '#00D48A' },
  { id: 4, type: 'blocked', iconType: 'music', app: 'Spotify', color: '#FF4757' },
  { id: 5, type: 'allowed', iconType: 'phone', app: 'Mom', color: '#00D48A' },
  { id: 6, type: 'blocked', iconType: 'bell', app: 'Twitter', color: '#FF4757' },
];

export function EnhancedSmartDriveCard() {
  const [currentNotif, setCurrentNotif] = useState(0);
  const [showNotif, setShowNotif] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowNotif(false);
      setTimeout(() => {
        setCurrentNotif((prev) => (prev + 1) % notifications.length);
        setShowNotif(true);
      }, 600);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const notif = notifications[currentNotif];
  const isAllowed = notif.type === 'allowed';

  return (
    <Link to="/smartdrive" className="block">
      <div
        className="relative overflow-hidden mx-auto"
        style={{
          width: '100%',
          maxWidth: '1340px',
          height: '700px',
          borderRadius: '22px',
          background: 'radial-gradient(ellipse at 70% 30%, #0D1B2A 0%, #0B1120 50%, #080E1A 100%)',
        }}
      >
        {/* Ambient Glow */}
        <div
          className="absolute"
          style={{
            top: '-8%',
            right: '8%',
            width: '48%',
            aspectRatio: '1',
            background: 'radial-gradient(circle, rgba(0,212,138,0.14) 0%, rgba(56,189,248,0.06) 40%, transparent 68%)',
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
              backgroundColor: '#00D48A',
              filter: 'drop-shadow(0 0 6px #00D48A)',
            }}
            animate={{ opacity: [1, 0.2, 1] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
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
            Mobile App • AI Feature
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
            <span style={{ color: '#FFFFFF' }}>Smart</span>
            <motion.span
              style={{
                background: 'linear-gradient(120deg, #00D48A 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
              }}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              Drive
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
                backgroundColor: 'rgba(0,212,138,0.08)',
                border: '1px solid rgba(0,212,138,0.30)',
                color: '#00D48A',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>AI Filter
            </div>
            <div
              style={{
                padding: '5px 12px',
                borderRadius: '100px',
                backgroundColor: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.30)',
                color: '#38BDF8',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '11.5px',
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>Focus Mode
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>Drive Safe
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
            AI-powered notification filtering that learns your habits to block distractions and keep you focused on the road.
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

        {/* Right Side - Floating Phone with Notification Filtering */}
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
            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          {/* Outer Glow */}
          <motion.div
            className="absolute"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '340px',
              height: '440px',
              background: 'radial-gradient(circle, rgba(0,212,138,0.15) 0%, rgba(56,189,248,0.05) 50%, transparent 100%)',
              borderRadius: '50%',
            }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Phone Frame */}
          <div
            style={{
              position: 'relative',
              zIndex: 1,
              width: '220px',
              height: '420px',
              borderRadius: '32px',
              background: 'rgba(10,8,26,0.92)',
              border: '1.5px solid rgba(255,255,255,0.10)',
              overflow: 'hidden',
              boxShadow: '0 0 60px rgba(0,212,138,0.08), 0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            {/* Status Bar */}
            <div
              style={{
                padding: '12px 16px 8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>
                9:41
              </span>
              <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                <div style={{ width: '12px', height: '7px', borderRadius: '2px', border: '1px solid rgba(255,255,255,0.3)' }}>
                  <div style={{ width: '8px', height: '5px', borderRadius: '1px', backgroundColor: '#00D48A', margin: '0.5px' }} />
                </div>
              </div>
            </div>

            {/* Notch */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '24px',
                backgroundColor: '#000',
                borderRadius: '0 0 16px 16px',
              }}
            />

            {/* SmartDrive Header */}
            <div style={{ padding: '20px 16px 12px', textAlign: 'center' }}>
              <div style={{
                fontFamily: 'Syne, sans-serif',
                fontSize: '16px',
                fontWeight: 700,
                color: '#FFFFFF',
                marginBottom: '4px',
              }}>
                SmartDrive
              </div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '100px',
                backgroundColor: 'rgba(0,212,138,0.12)',
                border: '1px solid rgba(0,212,138,0.25)',
              }}>
                <motion.div
                  style={{
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: '#00D48A',
                  }}
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', fontWeight: 600, color: '#00D48A' }}>
                  Drive Mode Active
                </span>
              </div>
            </div>

            {/* Notification Feed */}
            <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <AnimatePresence mode="wait">
                {showNotif && (
                  <motion.div
                    key={notif.id}
                    initial={{ x: 60, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={isAllowed ? { y: -20, opacity: 0 } : { x: -100, opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      backgroundColor: isAllowed ? 'rgba(0,212,138,0.10)' : 'rgba(255,71,87,0.08)',
                      border: `1px solid ${isAllowed ? 'rgba(0,212,138,0.25)' : 'rgba(255,71,87,0.20)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div style={{ width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><NotifIcon type={notif.iconType} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: isAllowed ? '#00D48A' : 'rgba(255,140,150,0.9)',
                      }}>
                        {notif.app}
                      </div>
                      <div style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: '9px',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.4)',
                        marginTop: '1px',
                      }}>
                        {isAllowed ? 'Allowed through' : 'Blocked by AI'}
                      </div>
                    </div>
                    <div
                      style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        backgroundColor: isAllowed ? 'rgba(0,212,138,0.15)' : 'rgba(255,71,87,0.12)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {isAllowed ? (
                        <svg width="10" height="10" viewBox="0 0 14 14">
                          <path d="M2 7L6 11L12 3" stroke="#00D48A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                        </svg>
                      ) : (
                        <svg width="10" height="10" viewBox="0 0 14 14">
                          <path d="M3 3L11 11M11 3L3 11" stroke="rgba(255,71,87,0.8)" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stats Row */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                <div style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, color: '#FF4757' }}>12</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '8px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Blocked</div>
                </div>
                <div style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, color: '#00D48A' }}>3</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '8px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Allowed</div>
                </div>
                <div style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  textAlign: 'center',
                }}>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '18px', fontWeight: 800, color: '#38BDF8' }}>24m</div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '8px', color: 'rgba(255,255,255,0.35)', marginTop: '2px' }}>Focused</div>
                </div>
              </div>

              {/* AI Confidence Bar */}
              <div style={{ marginTop: '4px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '4px',
                }}>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: 'rgba(255,255,255,0.35)' }}>AI Confidence</span>
                  <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '9px', color: '#00D48A', fontWeight: 600 }}>94%</span>
                </div>
                <div style={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      borderRadius: '2px',
                      background: 'linear-gradient(90deg, #00D48A, #38BDF8)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: '94%' }}
                    transition={{ duration: 1.5, delay: 0.8, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            {/* Bottom Home Indicator */}
            <div
              style={{
                position: 'absolute',
                bottom: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'rgba(255,255,255,0.15)',
              }}
            />
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
