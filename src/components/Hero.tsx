import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { Menu, X, ArrowDown } from "lucide-react";
import userPhoto from "../assets/hero-portrait.png";
import { ThemeToggle } from "./ThemeToggle";

const roles = ["UX Researcher", "Product Designer", "Interaction Designer", "Design Thinker"];

export function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for interactive gradient
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const gradientX = useTransform(smoothX, [0, 1], [30, 70]);
  const gradientY = useTransform(smoothY, [0, 1], [30, 70]);

  const scrollToCaseStudies = () => {
    setMobileMenuOpen(false);
    document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section ref={heroRef} className="relative w-full min-h-screen overflow-hidden" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Interactive gradient background that follows cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            [gradientX, gradientY],
            ([x, y]) => `radial-gradient(ellipse 800px 600px at ${x}% ${y}%, rgba(45,156,138,0.08) 0%, transparent 70%)`
          ),
        }}
      />

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Noise texture */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="mx-auto px-6 sm:px-8 lg:px-12 py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <div className="flex items-center justify-between">
            <Link to="/" className="text-[15px] font-semibold transition-opacity hover:opacity-70" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'DM Sans, sans-serif' }}>
              Jay Harwani
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {['About', 'Work', 'Contact'].map((item, i) => (
                item === 'About' ? (
                  <Link key={item} to="/about" className="text-[13px] font-medium uppercase tracking-[0.15em] transition-all hover:text-white" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                    {item}
                  </Link>
                ) : item === 'Work' ? (
                  <a key={item} href="#case-studies" onClick={(e) => { e.preventDefault(); scrollToCaseStudies(); }} className="text-[13px] font-medium uppercase tracking-[0.15em] transition-all hover:text-white cursor-pointer" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                    {item}
                  </a>
                ) : (
                  <a key={item} href="mailto:harwanijay9498@gmail.com" className="text-[13px] font-medium uppercase tracking-[0.15em] transition-all hover:text-white" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'DM Sans, sans-serif' }}>
                    {item}
                  </a>
                )
              ))}
              <a
                href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing"
                target="_blank" rel="noopener noreferrer"
                className="text-[12px] font-semibold uppercase tracking-[0.1em] px-5 py-2.5 rounded-full transition-all hover:scale-105"
                style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'DM Sans, sans-serif' }}
              >
                Resume
              </a>
              <ThemeToggle />
            </nav>

            <div className="md:hidden flex items-center gap-3">
              <ThemeToggle />
              <button className="p-2 -mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
            </button>
            </div>
          </div>
        </motion.div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[72px] z-50 md:hidden mx-5"
          >
            <nav className="flex flex-col gap-1 rounded-2xl p-4 shadow-2xl border border-white/10" style={{ backgroundColor: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(20px)', fontFamily: 'DM Sans, sans-serif' }}>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors">About</Link>
              <a href="#case-studies" onClick={(e) => { e.preventDefault(); scrollToCaseStudies(); }} className="px-4 py-3 rounded-xl text-[15px] font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors">Work</a>
              <a href="mailto:harwanijay9498@gmail.com" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors">Contact</a>
              <a href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="mx-4 mt-2 mb-1 text-center text-[13px] font-semibold rounded-full py-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.1)' }}>
                Resume
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hero Content */}
      <div className="relative min-h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-12 z-20">
        <div className="w-full max-w-7xl mx-auto">

          {/* Top: Photo + Status */}
          <motion.div
            className="flex items-center gap-5 mb-10 sm:mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Portrait Circle */}
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-white/10 ring-offset-2 ring-offset-black">
                <img src={userPhoto} alt="Jay Harwani" className="w-full h-full object-cover" style={{ objectPosition: 'center 20%' }} />
              </div>
              {/* Online indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#0A0A0A] flex items-center justify-center">
                <motion.div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: '#2DD4BF' }}
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </div>

            {/* Status text */}
            <div>
              <p className="text-[13px] sm:text-[14px] font-medium" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'DM Sans, sans-serif' }}>
                Jay Harwani
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[12px] sm:text-[13px]" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}>
                  Open to opportunities
                </span>
              </div>
            </div>
          </motion.div>

          {/* Giant Headline — the star of the show */}
          <div className="overflow-hidden mb-8 sm:mb-10">
            <motion.h1
              initial={{ y: '110%' }}
              animate={loaded ? { y: '0%' } : {}}
              transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw] font-extrabold leading-[0.9] tracking-[-0.04em]"
              style={{ fontFamily: 'Syne, sans-serif' }}
            >
              <span style={{ color: '#FFFFFF' }}>I design </span>
              <span
                style={{
                  background: 'linear-gradient(135deg, #2DD4BF 0%, #5EEAD4 40%, #A78BFA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                products
              </span>
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-8 sm:mb-10">
            <motion.h1
              initial={{ y: '110%' }}
              animate={loaded ? { y: '0%' } : {}}
              transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw] font-extrabold leading-[0.9] tracking-[-0.04em]"
              style={{ fontFamily: 'Syne, sans-serif', color: '#FFFFFF' }}
            >
              people{' '}
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>actually</span>
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-12 sm:mb-16">
            <motion.h1
              initial={{ y: '110%' }}
              animate={loaded ? { y: '0%' } : {}}
              transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] sm:text-[10vw] md:text-[9vw] lg:text-[8vw] xl:text-[7vw] font-extrabold leading-[0.9] tracking-[-0.04em]"
              style={{ fontFamily: 'Syne, sans-serif', color: 'rgba(255,255,255,0.2)' }}
            >
              love to use<span style={{ color: '#2DD4BF' }}>.</span>
            </motion.h1>
          </div>

          {/* Bottom row: Role ticker + CTA */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
            initial={{ opacity: 0, y: 30 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 1.1 }}
          >
            {/* Left: Role + Tags */}
            <div className="flex flex-col gap-4">
              {/* Animated Role */}
              <div className="flex items-center gap-3 h-7">
                <div className="w-6 h-[1px]" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentRoleIndex}
                    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -12, filter: 'blur(4px)' }}
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="text-[14px] font-medium"
                    style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    {roles[currentRoleIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

              {/* Skill pills */}
              <div className="flex flex-wrap items-center gap-2">
                {['UX Research', 'AI Design', 'Prototyping', 'Design Systems'].map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={loaded ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 1.3 + i * 0.08 }}
                    className="text-[11px] font-medium uppercase tracking-[0.08em] px-3.5 py-1.5 rounded-full"
                    style={{
                      color: 'rgba(255,255,255,0.4)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Right: CTA */}
            <motion.button
              onClick={scrollToCaseStudies}
              className="group relative inline-flex items-center gap-3 text-[14px] font-semibold px-8 py-4 rounded-full overflow-hidden"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Button gradient background */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, #2DD4BF 0%, #14B8A6 50%, #0D9488 100%)',
                }}
              />
              {/* Shimmer effect on hover */}
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)',
                }}
              />
              <span className="relative z-10" style={{ color: '#0A0A0A' }}>See My Work</span>
              <ArrowDown className="relative z-10 w-4 h-4 group-hover:translate-y-0.5 transition-transform" style={{ color: '#0A0A0A' }} strokeWidth={2.5} />
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
        >
          <motion.div
            className="w-[1px] h-12"
            style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)' }}
            animate={{ scaleY: [0.5, 1, 0.5], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* Ambient orbs */}
      <motion.div
        className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[10%] left-[5%] w-[350px] h-[350px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)' }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
    </section>
  );
}
