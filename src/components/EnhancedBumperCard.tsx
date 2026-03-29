import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";

export function EnhancedBumperCard() {
  const [savingsAmount, setSavingsAmount] = useState(1247);
  const [showPopup, setShowPopup] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 800);
    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver-gated savings interval
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    let interval: ReturnType<typeof setInterval> | null = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        if (entry.isIntersecting && !interval) {
          interval = setInterval(() => {
            setSavingsAmount((prev) => {
              const next = prev + 49;
              return next > 1600 ? 1200 : next;
            });
          }, 3500);
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

  const savingsProgress = (savingsAmount / 1800) * 100;

  return (
    <Link to="/bumper" className="block">
      <div
        ref={cardRef}
        className="relative overflow-hidden mx-auto rounded-[16px] md:rounded-[22px]"
        style={{
          width: '100%',
          maxWidth: '1340px',
          minHeight: '360px',
          background: 'radial-gradient(ellipse at 70% 30%, #1A0E2E 0%, #120B22 50%, #0A0816 100%)',
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
            background: 'radial-gradient(circle, rgba(20,184,166,0.14) 0%, rgba(99,102,241,0.06) 40%, transparent 68%)',
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
              backgroundColor: '#14B8A6',
              filter: 'drop-shadow(0 0 6px #14B8A6)',
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
            Browser Extension • Side Project
          </span>
        </motion.div>

        {/* Content + Visual Layout */}
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:min-h-[700px] min-h-[420px]">

        {/* Left Content */}
        <div
          className="relative z-10 flex flex-col gap-3 md:gap-[18px] p-6 pt-16 md:p-12 md:pt-20 lg:p-[50px] lg:pb-16 lg:absolute lg:bottom-16 lg:left-[50px] lg:max-w-[50%]"
        >
          {/* Title */}
          <motion.h1
            className="text-[32px] sm:text-[56px] md:text-[68px] lg:text-[80px]"
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
            <span style={{ color: '#FFFFFF' }}>Bump</span>
            <span
              style={{
                background: 'linear-gradient(120deg, #14B8A6 0%, #818CF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              er
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
                backgroundColor: 'rgba(20,184,166,0.08)',
                border: '1px solid rgba(20,184,166,0.30)',
                color: '#14B8A6',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10.5px',
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Impulse Guard
            </div>
            <div
              style={{
                padding: '5px 12px',
                borderRadius: '100px',
                backgroundColor: 'rgba(129,140,248,0.08)',
                border: '1px solid rgba(129,140,248,0.30)',
                color: '#818CF8',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10.5px',
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>Save Goals
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
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><path d="M2 8h4l3-5 6 14 3-9h4"/></svg>Smart Nudge
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            className="hidden sm:block"
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
            Stop impulse buys, save for what matters. A browser extension that nudges you to think twice before checkout.
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
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </div>

        {/* Right Side - Floating Browser Extension Popup */}
        <div
          className="relative flex items-center justify-center py-6 lg:absolute lg:py-0 lg:top-1/2 lg:right-[100px] lg:-translate-y-1/2"
          style={{ animation: 'float-y 6s ease-in-out infinite' }}
        >
          {/* Outer Glow — CSS pulse */}
          <div
            className="absolute hidden lg:block"
            style={{
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '380px',
              height: '420px',
              background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, rgba(129,140,248,0.05) 50%, transparent 100%)',
              borderRadius: '50%',
              animation: 'pulse-dot 5s ease-in-out infinite',
            }}
          />

          {/* Extension Popup Card */}
          <div
            className="w-[240px] sm:w-[260px] lg:w-[280px]"
            style={{
              position: 'relative',
              zIndex: 1,
              borderRadius: '20px',
              background: 'rgba(16,12,32,0.92)',
              border: '1.5px solid rgba(255,255,255,0.10)',
              overflow: 'hidden',
              boxShadow: '0 0 60px rgba(20,184,166,0.08), 0 20px 40px rgba(0,0,0,0.4)',
            }}
          >
            {/* Gradient top bar — CSS */}
            <div
              style={{
                height: '3px',
                background: 'linear-gradient(90deg, #14B8A6, #818CF8, #14B8A6)',
                backgroundSize: '200% 100%',
                animation: 'gradient-shift 3s linear infinite',
              }}
            />

            {/* Header */}
            <div style={{ padding: '16px 18px 12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #14B8A6, #818CF8)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
                </svg>
              </div>
              <div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontSize: '14px', fontWeight: 700, color: '#FFFFFF' }}>Bumper</div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>Impulse Guard Active</div>
              </div>
            </div>

            {/* Thinking Emoji + Question */}
            <motion.div
              style={{ padding: '0 18px 14px' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showPopup ? 1 : 0, y: showPopup ? 0 : 10 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <motion.div
                    style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    animate={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.6, delay: 1.5, ease: 'easeInOut' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  </motion.div>
                  <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>
                    Do you really need this?
                  </div>
                </div>
                <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                  You could save $299 toward your goal instead
                </div>
              </div>
            </motion.div>

            {/* Savings Goal */}
            <motion.div
              style={{ padding: '0 18px 14px' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showPopup ? 1 : 0, y: showPopup ? 0 : 10 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <div
                style={{
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: 'rgba(251,191,36,0.06)',
                  border: '1px solid rgba(251,191,36,0.15)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(251,191,36,0.12)',
                      border: '1px solid rgba(251,191,36,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      animation: 'pulse-scale 2s ease-in-out infinite',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '11px', fontWeight: 600, color: '#FBBF24' }}>
                      Trip to Jaipur 2026
                    </div>
                  </div>
                </div>
                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  overflow: 'hidden',
                  marginBottom: '6px',
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      borderRadius: '3px',
                      background: 'linear-gradient(90deg, #14B8A6, #818CF8)',
                    }}
                    animate={{ width: `${savingsProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <motion.div
                  key={savingsAmount}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '10px', color: 'rgba(255,255,255,0.35)' }}
                >
                  ${savingsAmount} / $1,800
                </motion.div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              style={{ padding: '0 18px 18px', display: 'flex', gap: '8px' }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: showPopup ? 1 : 0, y: showPopup ? 0 : 10 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.10)',
                  textAlign: 'center',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                Buy Anyway
              </div>
              <div
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #14B8A6, #818CF8)',
                  textAlign: 'center',
                  fontFamily: 'DM Sans, sans-serif',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  animation: 'pulse-glow 2.5s ease-in-out infinite',
                }}
              >
                Save Instead <svg width="10" height="10" viewBox="0 0 14 14" style={{ display: 'inline', verticalAlign: '-1px', marginLeft: '2px' }}><path d="M2 7L6 11L12 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
              </div>
            </motion.div>
          </div>

          {/* Small floating price tag — CSS float-y */}
          <div
            className="hidden lg:flex"
            style={{
              position: 'absolute',
              top: '-20px',
              right: '-30px',
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(255,71,87,0.12)',
              border: '1px solid rgba(255,71,87,0.25)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '12px',
              fontWeight: 700,
              color: '#FF6B6B',
              zIndex: 2,
              animation: 'float-y 4s ease-in-out infinite',
            }}
          >
            $299
          </div>

          {/* Small floating savings badge — CSS float-y */}
          <div
            className="hidden lg:flex"
            style={{
              position: 'absolute',
              bottom: '-10px',
              left: '-40px',
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: 'rgba(20,184,166,0.12)',
              border: '1px solid rgba(20,184,166,0.25)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '11px',
              fontWeight: 600,
              color: '#14B8A6',
              zIndex: 2,
              animation: 'float-y 5s ease-in-out 1s infinite',
            }}
          >
            <svg width="10" height="10" viewBox="0 0 14 14" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '3px' }}><path d="M2 7L6 11L12 3" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>+$299 saved
          </div>
        </div>
        </div>{/* end content+visual layout */}
      </div>
    </Link>
  );
}
