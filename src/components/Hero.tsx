import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Menu, X } from "lucide-react";
import userPhoto from "../assets/hero-portrait.png";

const greetings = ["Bonjour", "Hello", "Hola", "Ciao", "こんにちは"];
const roles = ["UX Researcher", "Product Designer", "Interaction Designer"];

export function Hero() {
  const [currentGreetingIndex, setCurrentGreetingIndex] = useState(0);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToCaseStudies = () => {
    setMobileMenuOpen(false);
    document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Cycle through greetings
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGreetingIndex((prev) => (prev + 1) % greetings.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  // Cycle through roles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full min-h-screen overflow-hidden flex flex-col" style={{ backgroundColor: '#F2EFE9' }}>
      {/* Subtle noise grain texture over entire canvas */}
      <div
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          mixBlendMode: 'multiply'
        }}
      />

      {/* Fixed Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 flex justify-center px-5 sm:px-8 md:px-12" style={{ paddingTop: '24px' }}>
        <div className="w-full flex items-center justify-between" style={{ height: '48px' }}>
          {/* Logo */}
          <Link
            to="/"
            className="text-[15px] font-semibold hover:opacity-70 transition-opacity"
            style={{ color: '#0F0F0D', fontFamily: 'DM Sans, sans-serif' }}
          >
            Jay Harwani
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              to="/about"
              className="text-[14px] font-normal hover:opacity-70 transition-all relative group"
              style={{ color: '#7A7770', fontFamily: 'DM Sans, sans-serif' }}
            >
              About
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: '#0F0F0D' }} />
            </Link>
            <a
              href="#case-studies"
              onClick={(e) => { e.preventDefault(); scrollToCaseStudies(); }}
              className="text-[14px] font-normal hover:opacity-70 transition-all cursor-pointer relative group"
              style={{ color: '#7A7770', fontFamily: 'DM Sans, sans-serif' }}
            >
              Work
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full opacity-100" style={{ backgroundColor: '#0F0F0D' }} />
            </a>
            <a
              href="mailto:harwanijay9498@gmail.com"
              className="text-[14px] font-normal hover:opacity-70 transition-all relative group"
              style={{ color: '#7A7770', fontFamily: 'DM Sans, sans-serif' }}
            >
              Contact
              <div className="absolute bottom-[-8px] left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: '#0F0F0D' }} />
            </a>

            {/* Resume Button */}
            <a
              href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium transition-all hover:opacity-70 ml-4"
              style={{
                border: '1px solid rgba(15, 15, 13, 0.35)',
                backgroundColor: 'transparent',
                color: '#0F0F0D',
                fontFamily: 'DM Sans, sans-serif',
                borderRadius: '100px',
                padding: '7px 18px'
              }}
            >
              Resume
            </a>
          </nav>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" style={{ color: '#0F0F0D' }} />
            ) : (
              <Menu className="w-5 h-5" style={{ color: '#0F0F0D' }} />
            )}
          </button>
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
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-2 mb-1 text-center text-[13px] font-medium transition-all"
                style={{
                  border: '1px solid rgba(15, 15, 13, 0.35)',
                  color: '#0F0F0D',
                  borderRadius: '100px',
                  padding: '10px 18px'
                }}
              >
                Resume
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Two Column Split Layout — stacks on mobile */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-screen w-full relative">
        {/* Left Column - Content */}
        <div
          className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 md:px-[52px] pt-28 pb-12 lg:pt-0 lg:pb-0 flex-shrink-0 order-2 lg:order-1"
          style={{ backgroundColor: '#F2EFE9' }}
        >
          <div className="w-full max-w-[520px]">
            {/* Animated Greeting with Cursor */}
            <div className="relative mb-4 sm:mb-6 h-[60px] sm:h-[80px] md:h-[120px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={currentGreetingIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[56px] sm:text-[72px] md:text-[90px] lg:text-[108px] font-black relative inline-block"
                  style={{
                    color: '#0F0F0D',
                    fontFamily: 'Playfair Display, serif',
                    lineHeight: 0.95,
                    letterSpacing: '-0.02em'
                  }}
                >
                  {greetings[currentGreetingIndex]}
                  {/* Blinking Cursor */}
                  <motion.span
                    className="inline-block ml-1 align-baseline rounded"
                    style={{
                      width: '4px',
                      height: '0.82em',
                      backgroundColor: '#2D9C8A',
                      verticalAlign: 'baseline'
                    }}
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  />
                </motion.h1>
              </AnimatePresence>
            </div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-[15px] sm:text-[17px] font-light mb-3 max-w-[380px]"
              style={{ color: '#0F0F0D', fontFamily: 'DM Sans, sans-serif', lineHeight: 1.5 }}
            >
              Designing intuitive, human-centered digital products.
            </motion.p>

            {/* Role Switcher */}
            <div className="h-8 mb-6 sm:mb-9 flex items-center">
              <AnimatePresence mode="wait">
                <motion.span
                  key={currentRoleIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="text-[14px] font-medium"
                  style={{ color: '#2D9C8A', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {roles[currentRoleIndex]}
                </motion.span>
              </AnimatePresence>
            </div>

            {/* Horizontal Rule */}
            <div className="w-[40px] h-[1.5px] mb-6 sm:mb-9" style={{ backgroundColor: '#0F0F0D' }} />

            {/* Skills with Dividers */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-8 sm:mb-10"
            >
              <span className="text-[11px] sm:text-[12px] font-medium uppercase" style={{ color: '#7A7770', letterSpacing: '0.1em', fontFamily: 'DM Sans, sans-serif' }}>
                Product Designer
              </span>
              <div className="hidden sm:block w-[1px] h-4" style={{ backgroundColor: '#D5D0C8' }} />
              <span className="text-[11px] sm:text-[12px] font-medium" style={{ color: '#7A7770', letterSpacing: '0.02em', fontFamily: 'DM Sans, sans-serif' }}>
                AI-Assisted Experience Design
              </span>
              <span className="hidden sm:inline text-[12px] font-medium" style={{ color: '#7A7770', fontFamily: 'DM Sans, sans-serif' }}>•</span>
              <span className="text-[11px] sm:text-[12px] font-medium" style={{ color: '#7A7770', letterSpacing: '0.02em', fontFamily: 'DM Sans, sans-serif' }}>
                Complex Systems → Simple Experiences
              </span>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex items-center gap-6"
            >
              <button
                onClick={scrollToCaseStudies}
                className="text-[14px] font-medium px-8 py-4 transition-all hover:shadow-teal"
                style={{ backgroundColor: '#0F0F0D', color: '#F2EFE9', borderRadius: '100px', fontFamily: 'DM Sans, sans-serif' }}
              >
                View My Work ↓
              </button>
            </motion.div>
          </div>
        </div>

        {/* Right Column - Full Bleed Portrait */}
        <div
          className="w-full lg:w-1/2 relative flex-shrink-0 order-1 lg:order-2"
          style={{ backgroundColor: '#F2EFE9' }}
        >
          {/* On mobile: show as a cropped banner; on desktop: full height */}
          <div className="relative w-full h-[50vh] sm:h-[55vh] lg:h-full lg:min-h-screen">
            <img
              src={userPhoto}
              alt="Jay Harwani"
              className="w-full h-full object-cover"
              style={{
                objectPosition: 'center 80px',
                filter: 'brightness(0.75) contrast(1.1)',
                display: 'block',
                imageRendering: '-webkit-optimize-contrast',
                WebkitBackfaceVisibility: 'hidden',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Custom hover shadow style */}
      <style>{`
        .hover\\:shadow-teal:hover {
          box-shadow: 0 12px 32px rgba(45, 156, 138, 0.3);
        }

        .resume-button:hover {
          background-color: #0F0F0D !important;
          color: #F2EFE9 !important;
        }
      `}</style>
    </section>
  );
}
