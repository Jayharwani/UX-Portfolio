import { EnhancedSmartDriveCard } from "./EnhancedSmartDriveCard";
import { EnhancedBumperCard } from "./EnhancedBumperCard";
import { ChronoWeaveThumbnail } from "./ChronoWeaveThumbnail";
import { motion } from "motion/react";

function SectionDivider({ number }: { number: number }) {
  return (
    <div className="flex items-center justify-center py-10">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(15,23,42,0.18), transparent)',
          }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        <motion.div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid rgba(15,23,42,0.1)',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '12px',
            fontWeight: 700,
            color: '#52525B',
            boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {String(number).padStart(2, '0')}
        </motion.div>
        <motion.div
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(15,23,42,0.18), transparent)',
          }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        />
      </motion.div>
    </div>
  );
}

/* Lightweight reveal — replaces the heavy useScroll ParallaxCard */
function RevealCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function CaseStudies() {
  return (
    <section
      id="case-studies"
      className="relative py-20 sm:py-28 md:py-36 overflow-hidden"
      style={{ backgroundColor: '#F4F3EE' }}
    >
      {/* Static ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '8%',
          left: '5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(15,118,110,0.08) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          right: '0%',
          width: '600px',
          height: '600px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.3) 1px, transparent 1px)`,
          backgroundSize: '96px 96px',
        }}
      />

      {/* Soft grain */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative">

        {/* Section Header */}
        <div className="text-center mb-16 sm:mb-20 md:mb-28">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid rgba(15,23,42,0.1)',
              boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0F766E' }} />
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '12px',
                fontWeight: 600,
                color: '#09090B',
                letterSpacing: '0.12em',
              }}
            >
              02 — SELECTED WORK
            </span>
          </motion.div>

          <motion.h2
            className="text-[36px] sm:text-[52px] md:text-[68px] mb-5"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              color: '#09090B',
              lineHeight: 1.0,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Case Studies
          </motion.h2>

          <motion.p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '17px',
              color: '#52525B',
              maxWidth: '560px',
              margin: '0 auto',
              lineHeight: 1.65,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            Three projects where research turned into intervention — and intervention into measurable behavior change.
          </motion.p>
        </div>

        {/* Cards */}
        <div className="relative">
          <RevealCard>
            <ChronoWeaveThumbnail />
          </RevealCard>

          <SectionDivider number={2} />

          <RevealCard>
            <EnhancedSmartDriveCard />
          </RevealCard>

          <SectionDivider number={3} />

          <RevealCard>
            <EnhancedBumperCard />
          </RevealCard>
        </div>
      </div>
    </section>
  );
}
