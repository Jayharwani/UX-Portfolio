import { motion } from "motion/react";
import { ArrowRight, Shield, PhoneCall, AlertTriangle, Car, MessageSquare, Bell, BellRing, CheckCircle, XCircle } from "lucide-react";
import { Link } from "react-router";

export function EnhancedSmartDriveCard() {

  return (
    <Link to="/smartdrive" className="block">
      <div
        className="relative overflow-hidden mx-auto rounded-[16px] md:rounded-[22px]"
        style={{
          width: '100%',
          maxWidth: '1340px',
          minHeight: '360px',
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
          {/* Pulsing Dot — CSS animation */}
          <div
            className="rounded-full"
            style={{
              width: '6px',
              height: '6px',
              backgroundColor: '#00D48A',
              filter: 'drop-shadow(0 0 6px #00D48A)',
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
            Mobile App • AI Feature
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
            <span style={{ color: '#FFFFFF' }}>Smart</span>
            <span
              style={{
                background: 'linear-gradient(120deg, #00D48A 0%, #38BDF8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                backgroundSize: '200% 200%',
                animation: 'gradient-shift 4s ease-in-out infinite',
              }}
            >
              Drive
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
                backgroundColor: 'rgba(0,212,138,0.08)',
                border: '1px solid rgba(0,212,138,0.30)',
                color: '#00D48A',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '10.5px',
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
                fontSize: '10.5px',
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
                fontSize: '10.5px',
                fontWeight: 600,
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: '-1px', marginRight: '4px' }}><path d="M14 16H9m10 0h3v-3.15a1 1 0 0 0-.84-.99L16 11l-2.7-3.6a1 1 0 0 0-.8-.4H5.24a2 2 0 0 0-1.8 1.1l-.8 1.63A6 6 0 0 0 2 12.42V16h2"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>Drive Safe
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
            AI-powered notification filtering that learns your habits to block distractions and keep you focused on the road.
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

        {/* Right Side — AI Filter Orbital Animation */}
        <motion.div
          className="relative flex items-center justify-center py-6 lg:absolute lg:py-0 lg:top-1/2 lg:right-[80px] lg:-translate-y-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Central Shield — CSS rotation */}
          <div
            className="relative z-10 w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] flex items-center justify-center"
            style={{ animation: 'spin-slow 60s linear infinite' }}
          >
            <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
            <div className="absolute inset-2 rounded-full border border-cyan-500/10" />
          </div>

          {/* Static inner icon — CSS glow pulse */}
          <div className="absolute z-20 flex flex-col items-center gap-1.5">
            <div
              className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center backdrop-blur-sm"
              style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
            >
              <Shield className="w-6 h-6 lg:w-7 lg:h-7 text-cyan-400" />
            </div>
            <span className="text-[8px] lg:text-[9px] text-cyan-400/80 font-medium tracking-widest uppercase">AI Filter</span>
          </div>

          {/* Orbiting ring 1 with car — CSS rotation */}
          <div
            className="absolute w-[200px] h-[200px] lg:w-[260px] lg:h-[260px]"
            style={{ animation: 'spin-slow 30s linear infinite' }}
          >
            <div className="absolute inset-0 rounded-full border border-dashed border-slate-700/40" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <div style={{ animation: 'spin-slow-reverse 30s linear infinite' }}>
                <div className="w-6 h-6 rounded-full bg-slate-900/80 border border-cyan-500/25 flex items-center justify-center backdrop-blur-sm">
                  <Car className="w-3 h-3 text-cyan-400/50" />
                </div>
              </div>
            </div>
          </div>

          {/* Orbiting ring 2 with car — CSS rotation */}
          <div
            className="absolute w-[280px] h-[280px] lg:w-[350px] lg:h-[350px]"
            style={{ animation: 'spin-slow-reverse 45s linear infinite' }}
          >
            <div className="absolute inset-0 rounded-full border border-slate-800/30" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
              <div style={{ animation: 'spin-slow 45s linear infinite' }}>
                <div className="w-5 h-5 rounded-full bg-slate-900/60 border border-slate-600/20 flex items-center justify-center backdrop-blur-sm">
                  <Car className="w-2.5 h-2.5 text-slate-500/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Floating allowed notifications — CSS fade-float (hidden on small screens) */}
          {[
            { x: -90, y: -80, delay: 0, icon: PhoneCall, label: "Mom calling" },
            { x: 80, y: 60, delay: 1.5, icon: AlertTriangle, label: "Road alert" },
          ].map((notif, i) => (
            <div
              key={`a-${i}`}
              className="absolute z-30 hidden sm:block"
              style={{
                left: `calc(50% + ${notif.x}px)`,
                top: `calc(50% + ${notif.y}px)`,
                animation: `fade-float 5s ease-in-out ${notif.delay}s infinite`,
              }}
            >
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-sm">
                <div className="w-4 h-4 rounded bg-emerald-500/20 flex items-center justify-center">
                  <notif.icon className="w-2.5 h-2.5 text-emerald-400" />
                </div>
                <p className="text-[8px] text-emerald-300 font-medium">{notif.label}</p>
                <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />
              </div>
            </div>
          ))}

          {/* Floating blocked notifications — CSS fade-float-muted (hidden on small screens) */}
          {[
            { x: 90, y: -60, delay: 0.8, icon: MessageSquare, label: "Social media" },
            { x: -80, y: 50, delay: 2.5, icon: Bell, label: "Game update" },
          ].map((notif, i) => (
            <div
              key={`b-${i}`}
              className="absolute z-30 hidden sm:block"
              style={{
                left: `calc(50% + ${notif.x}px)`,
                top: `calc(50% + ${notif.y}px)`,
                animation: `fade-float-muted 5s ease-in-out ${notif.delay}s infinite`,
              }}
            >
              <div className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg bg-red-500/5 border border-red-500/15 backdrop-blur-sm opacity-60">
                <div className="w-4 h-4 rounded bg-red-500/10 flex items-center justify-center">
                  <notif.icon className="w-2.5 h-2.5 text-red-400/60" />
                </div>
                <p className="text-[8px] text-red-300/60 font-medium line-through">{notif.label}</p>
                <XCircle className="w-2.5 h-2.5 text-red-400/50" />
              </div>
            </div>
          ))}

          {/* Pulse rings — CSS pulse-ring */}
          {[0, 1.5, 3].map((delay, i) => (
            <div
              key={`p-${i}`}
              className="absolute w-[100px] h-[100px] lg:w-[130px] lg:h-[130px] rounded-full border border-cyan-500/15"
              style={{ animation: `pulse-ring 4s ease-out ${delay}s infinite` }}
            />
          ))}
        </motion.div>
        </div>{/* end content+visual layout */}
      </div>
    </Link>
  );
}
