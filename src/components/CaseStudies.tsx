import { EnhancedSmartDriveCard } from "./EnhancedSmartDriveCard";
import { EnhancedBumperCard } from "./EnhancedBumperCard";
import { ChronoWeaveThumbnail } from "./ChronoWeaveThumbnail";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

function SectionDivider({ number }: { number: number }) {
  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
      >
        {/* Connecting line */}
        <motion.div
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)',
          }}
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
        {/* Number badge */}
        <motion.div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.10)',
            backgroundColor: 'rgba(255,255,255,0.03)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '12px',
            fontWeight: 600,
            color: 'rgba(255,255,255,0.4)',
          }}
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3, type: 'spring', stiffness: 200 }}
        >
          {String(number).padStart(2, '0')}
        </motion.div>
        {/* Connecting line */}
        <motion.div
          style={{
            width: '1px',
            height: '60px',
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.12), transparent)',
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

function ParallaxCard({ children, index }: { children: React.ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [80, 0, 0, -40]);
  const scale = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.92, 1, 1, 0.97]);
  const opacity = useTransform(scrollYProgress, [0, 0.15, 0.8, 1], [0, 1, 1, 0.6]);
  const rotateX = useTransform(scrollYProgress, [0, 0.2], [4, 0]);

  return (
    <motion.div
      ref={ref}
      style={{
        y,
        scale,
        opacity,
        rotateX,
        perspective: '1200px',
        transformOrigin: 'center bottom',
      }}
    >
      {children}
    </motion.div>
  );
}

export function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax for ambient orbs
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -300]);

  return (
    <section
      ref={sectionRef}
      id="case-studies"
      className="relative py-16 sm:py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: '#0A0A0A' }}
    >
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
        {/* Floating ambient orbs */}
        <motion.div
          className="absolute"
          style={{
            top: '10%',
            left: '5%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(45,212,191,0.04) 0%, transparent 70%)',
            borderRadius: '50%',
            y: orb1Y,
          }}
        />
        <motion.div
          className="absolute"
          style={{
            top: '50%',
            right: '0%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(167,139,250,0.03) 0%, transparent 70%)',
            borderRadius: '50%',
            y: orb2Y,
          }}
        />
        {/* Noise texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16 md:mb-24 space-y-4 sm:space-y-6">
          <motion.div
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg mb-6 backdrop-blur-sm"
            style={{
              backgroundColor: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.6)',
                letterSpacing: '0.1em',
              }}
            >
              SELECTED WORK
            </span>
          </motion.div>

          <motion.h2
            className="text-[32px] sm:text-[42px] md:text-[52px]"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 800,
              letterSpacing: '-1.5px',
              color: '#FFFFFF',
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
              color: 'rgba(255,255,255,0.55)',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: 1.7,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            A curated collection of projects where design meets impact
          </motion.p>
        </div>

        {/* Cards with parallax and dividers */}
        <div className="relative">
          <ParallaxCard index={0}>
            <ChronoWeaveThumbnail />
          </ParallaxCard>

          <SectionDivider number={2} />

          <ParallaxCard index={1}>
            <EnhancedSmartDriveCard />
          </ParallaxCard>

          <SectionDivider number={3} />

          <ParallaxCard index={2}>
            <EnhancedBumperCard />
          </ParallaxCard>
        </div>
      </div>
    </section>
  );
}
