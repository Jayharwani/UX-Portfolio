import { motion } from "motion/react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden" style={{ backgroundColor: '#0A0A0A', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="container mx-auto px-6 md:px-8 py-16 md:py-20 max-w-7xl relative">
        <div className="flex flex-col items-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-center max-w-3xl px-4"
          >
            <h2
              className="text-[22px] sm:text-[26px] md:text-[28px]"
              style={{
                fontFamily: 'Syne, sans-serif',
                fontWeight: 700,
                color: 'rgba(255,255,255,0.85)',
                lineHeight: 1.4,
                letterSpacing: '-0.5px',
              }}
            >
              Ready to turn your "We need a designer" into "We hired the right one"
            </h2>
          </motion.div>

          <motion.div
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <a
              href="https://www.linkedin.com/in/jay-harwani/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: '100px',
                padding: '7px 18px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}
            >
              LinkedIn
            </a>

            <a
              href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                border: '1px solid rgba(255,255,255,0.15)',
                backgroundColor: 'transparent',
                color: 'rgba(255,255,255,0.6)',
                fontFamily: 'DM Sans, sans-serif',
                fontSize: '13px',
                fontWeight: 500,
                borderRadius: '100px',
                padding: '7px 18px',
                transition: 'all 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.9)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
              }}
            >
              Resume
            </a>
          </motion.div>

          <motion.div
            className="w-full max-w-xs h-px mt-8"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.12), transparent)' }}
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />

          <motion.p
            style={{
              fontFamily: 'DM Sans, sans-serif',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.25)',
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            &copy; {currentYear} Jay Harwani
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
