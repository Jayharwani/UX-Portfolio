import { motion } from "motion/react";
import { Mail, Linkedin, FileText, ArrowUpRight } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#FAFAF7',
        borderTop: '1px solid rgba(15,23,42,0.08)',
      }}
    >
      {/* Ambient gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(at 50% 0%, rgba(15,118,110,0.06) 0%, transparent 50%)`,
        }}
      />

      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.3) 1px, transparent 1px)`,
          backgroundSize: '96px 96px',
        }}
      />

      <div className="container mx-auto px-6 md:px-8 py-20 md:py-28 max-w-7xl relative">
        <div className="flex flex-col items-center space-y-10">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <span
              className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
              style={{ color: '#71717A', fontFamily: 'DM Sans, sans-serif' }}
            >
              03 — Let's connect
            </span>
            <div className="w-12 h-px" style={{ backgroundColor: 'rgba(15,23,42,0.2)' }} />
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-[28px] sm:text-[40px] md:text-[52px] text-center max-w-3xl leading-[1.05]"
            style={{
              fontFamily: 'Syne, sans-serif',
              fontWeight: 700,
              color: '#09090B',
              letterSpacing: '-0.035em',
            }}
          >
            Ready to turn your{' '}
            <span style={{ color: '#71717A' }}>"We need a designer"</span>{' '}
            into{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #0F766E 0%, #7C3AED 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              "We hired the right one."
            </span>
          </motion.h2>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <a
              href="mailto:harwanijay9498@gmail.com"
              className="group inline-flex items-center gap-2 text-[14px] font-semibold px-7 py-3.5 rounded-full transition-all hover:scale-[1.03]"
              style={{
                backgroundColor: '#09090B',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, sans-serif',
                boxShadow: '0 12px 24px -10px rgba(9,9,11,0.4)',
              }}
            >
              <Mail className="w-4 h-4" strokeWidth={2.5} />
              <span>Get in touch</span>
            </a>

            <a
              href="https://www.linkedin.com/in/jay-harwani/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[14px] font-semibold px-7 py-3.5 rounded-full transition-all hover:bg-black/[0.04]"
              style={{
                color: '#09090B',
                border: '1px solid rgba(15,23,42,0.15)',
                backgroundColor: 'rgba(255,255,255,0.6)',
                fontFamily: 'DM Sans, sans-serif',
                backdropFilter: 'blur(12px)',
              }}
            >
              <Linkedin className="w-4 h-4" strokeWidth={2.5} />
              <span>LinkedIn</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
            </a>

            <a
              href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[14px] font-semibold px-7 py-3.5 rounded-full transition-all hover:bg-black/[0.04]"
              style={{
                color: '#09090B',
                border: '1px solid rgba(15,23,42,0.15)',
                backgroundColor: 'rgba(255,255,255,0.6)',
                fontFamily: 'DM Sans, sans-serif',
                backdropFilter: 'blur(12px)',
              }}
            >
              <FileText className="w-4 h-4" strokeWidth={2.5} />
              <span>Resume</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
            </a>
          </motion.div>

          {/* Availability strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full"
            style={{
              backgroundColor: 'rgba(15,118,110,0.06)',
              border: '1px solid rgba(15,118,110,0.18)',
            }}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#0F766E' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#0F766E' }} />
            </span>
            <span className="text-[12px] font-medium" style={{ color: '#134E4A', fontFamily: 'DM Sans, sans-serif' }}>
              Open to full-time roles · No sponsorship required · Baltimore, MD
            </span>
          </motion.div>

          {/* Divider */}
          <motion.div
            className="w-full max-w-md h-px mt-4"
            style={{ background: 'linear-gradient(to right, transparent, rgba(15,23,42,0.15), transparent)' }}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />

          {/* Footer meta row */}
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
          >
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: '#71717A',
              }}
            >
              &copy; {currentYear} Jay Harwani
            </p>
            <span className="hidden sm:block w-px h-3" style={{ backgroundColor: 'rgba(15,23,42,0.15)' }} />
            <p
              style={{
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                color: '#71717A',
              }}
            >
              Designed & built with Claude Code
            </p>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
