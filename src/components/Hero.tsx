import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu, X, ArrowDown, Linkedin, Mail } from "lucide-react";
import userPhoto from "../assets/hero-portrait.png";

const roles = ["UX Researcher", "Product Designer", "Interaction Designer"];

export function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToCaseStudies = () => {
    setMobileMenuOpen(false);
    document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: '#F2EFE9' }}>
      {/* Fixed Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40">
        <div className="mx-auto px-6 sm:px-8 lg:px-12 py-5">
          <div className="flex items-center justify-between">
            <Link
              to="/"
              className="text-[15px] font-semibold hover:opacity-70 transition-opacity"
              style={{ color: '#0F0F0D', fontFamily: 'DM Sans, sans-serif' }}
            >
              Jay Harwani
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/about" className="text-[13px] font-medium uppercase tracking-widest hover:opacity-60 transition-all" style={{ color: '#7A7770', fontFamily: 'DM Sans, sans-serif' }}>
                About
              </Link>
              <a href="#case-studies" onClick={(e) => { e.preventDefault(); scrollToCaseStudies(); }} className="text-[13px] font-medium uppercase tracking-widest hover:opacity-60 transition-all cursor-pointer" style={{ color: '#7A7770', fontFamily: 'DM Sans, sans-serif' }}>
                Work
              </a>
              <a href="mailto:harwanijay9498@gmail.com" className="text-[13px] font-medium uppercase tracking-widest hover:opacity-60 transition-all" style={{ color: '#7A7770', fontFamily: 'DM Sans, sans-serif' }}>
                Contact
              </a>
              <a
                href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium transition-all hover:scale-105"
                style={{
                  backgroundColor: '#0F0F0D',
                  color: '#F2EFE9',
                  fontFamily: 'DM Sans, sans-serif',
                  borderRadius: '100px',
                  padding: '8px 20px',
                }}
              >
                Resume
              </a>
            </nav>

            {/* Mobile Hamburger */}
            <button className="md:hidden p-2 -mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-5 h-5" style={{ color: '#0F0F0D' }} /> : <Menu className="w-5 h-5" style={{ color: '#0F0F0D' }} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden mx-5"
          >
            <nav
              className="flex flex-col gap-1 rounded-2xl p-4 shadow-xl border border-neutral-200/60"
              style={{ backgroundColor: 'rgba(242, 239, 233, 0.97)', backdropFilter: 'blur(20px)', fontFamily: 'DM Sans, sans-serif' }}
            >
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/5 transition-colors" style={{ color: '#0F0F0D' }}>About</Link>
              <a href="#case-studies" onClick={(e) => { e.preventDefault(); scrollToCaseStudies(); }} className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/5 transition-colors" style={{ color: '#0F0F0D' }}>Work</a>
              <a href="mailto:harwanijay9498@gmail.com" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/5 transition-colors" style={{ color: '#0F0F0D' }}>Contact</a>
              <a
                href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-2 mb-1 text-center text-[13px] font-medium"
                style={{ backgroundColor: '#0F0F0D', color: '#F2EFE9', borderRadius: '100px', padding: '10px 18px' }}
              >
                Resume
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Content */}
      <div className="relative min-h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-12 pt-20 pb-16">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Content — spans 7 columns */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-6"
              >
                <div className="inline-flex items-center gap-3">
                  <div className="w-8 h-[1.5px]" style={{ backgroundColor: '#2D9C8A' }} />
                  <span className="text-[12px] font-semibold uppercase tracking-[0.2em]" style={{ color: '#2D9C8A', fontFamily: 'DM Sans, sans-serif' }}>
                    Portfolio 2025
                  </span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
              >
                <h1
                  className="text-[40px] sm:text-[52px] md:text-[64px] lg:text-[72px] xl:text-[80px] font-bold leading-[1.05] mb-6"
                  style={{
                    color: '#0F0F0D',
                    fontFamily: 'Syne, sans-serif',
                    letterSpacing: '-0.03em',
                  }}
                >
                  Designing
                  <br />
                  <span style={{ color: '#2D9C8A' }}>intuitive</span> digital
                  <br />
                  experiences
                </h1>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="text-[16px] sm:text-[17px] font-normal mb-4 max-w-[480px] leading-relaxed"
                style={{ color: '#5C5B56', fontFamily: 'DM Sans, sans-serif' }}
              >
                I craft human-centered products that bridge complexity and simplicity — making technology feel effortless.
              </motion.p>

              {/* Role Switcher */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="h-7 mb-10 flex items-center gap-3"
              >
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2D9C8A' }} />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentRoleIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[14px] font-medium"
                    style={{ color: '#0F0F0D', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {roles[currentRoleIndex]}
                  </motion.span>
                </AnimatePresence>
              </motion.div>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={scrollToCaseStudies}
                  className="inline-flex items-center gap-3 text-[14px] font-semibold px-7 py-4 transition-all hover:scale-[1.03] active:scale-[0.98]"
                  style={{
                    backgroundColor: '#0F0F0D',
                    color: '#F2EFE9',
                    borderRadius: '100px',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  View My Work
                  <ArrowDown className="w-4 h-4" strokeWidth={2} />
                </button>
                <a
                  href="https://www.linkedin.com/in/jay-harwani/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full border transition-all hover:scale-[1.06] hover:bg-black/5"
                  style={{ borderColor: 'rgba(15,15,13,0.2)' }}
                >
                  <Linkedin className="w-[18px] h-[18px]" style={{ color: '#0F0F0D' }} strokeWidth={1.8} />
                </a>
                <a
                  href="mailto:harwanijay9498@gmail.com"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-full border transition-all hover:scale-[1.06] hover:bg-black/5"
                  style={{ borderColor: 'rgba(15,15,13,0.2)' }}
                >
                  <Mail className="w-[18px] h-[18px]" style={{ color: '#0F0F0D' }} strokeWidth={1.8} />
                </a>
              </motion.div>
            </div>

            {/* Right — Portrait (5 columns) */}
            <motion.div
              className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div
                className="relative w-full max-w-[420px] lg:max-w-none"
              >
                {/* Decorative frame */}
                <div
                  className="absolute -inset-3 sm:-inset-4 rounded-[28px] sm:rounded-[32px]"
                  style={{
                    border: '1.5px solid rgba(45, 156, 138, 0.15)',
                    background: 'linear-gradient(135deg, rgba(45,156,138,0.04) 0%, transparent 60%)',
                  }}
                />

                {/* Image container */}
                <div className="relative rounded-[22px] sm:rounded-[26px] overflow-hidden aspect-[3/4]">
                  <img
                    src={userPhoto}
                    alt="Jay Harwani"
                    className="w-full h-full object-cover"
                    style={{
                      objectPosition: 'center 20%',
                      filter: 'brightness(0.92) contrast(1.05) saturate(0.95)',
                    }}
                  />

                  {/* Bottom gradient overlay */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-1/3"
                    style={{ background: 'linear-gradient(to top, rgba(15,15,13,0.5) 0%, transparent 100%)' }}
                  />

                  {/* Name badge on image */}
                  <div className="absolute bottom-5 left-5 right-5">
                    <div
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                      style={{
                        backgroundColor: 'rgba(255,255,255,0.12)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255,255,255,0.15)',
                      }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#2DD4BF', boxShadow: '0 0 8px #2DD4BF' }} />
                      <span className="text-white text-[13px] font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                        Available for opportunities
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4" style={{ color: '#7A7770' }} strokeWidth={1.5} />
          </motion.div>
          <span className="text-[11px] font-medium uppercase tracking-[0.15em]" style={{ color: '#7A7770', fontFamily: 'DM Sans, sans-serif' }}>
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
