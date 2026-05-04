import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { Menu, X, ArrowDown, ArrowUpRight } from "lucide-react";
import userPhoto from "../assets/hero-portrait.jpeg";

export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for ambient gradient
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  const gradientX = useTransform(smoothX, [0, 1], [25, 75]);
  const gradientY = useTransform(smoothY, [0, 1], [25, 75]);

  const scrollToCaseStudies = () => {
    setMobileMenuOpen(false);
    document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
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
      {/* Interactive ambient gradient that follows cursor */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: useTransform(
            [gradientX, gradientY],
            ([x, y]) => `radial-gradient(ellipse 900px 700px at ${x}% ${y}%, rgba(45,212,191,0.06) 0%, transparent 65%)`
          ),
        }}
      />

      {/* Subtle editorial grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '96px 96px',
        }}
      />

      {/* Noise texture for film-like depth */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <motion.div
          className="mx-auto px-6 sm:px-8 lg:px-12 py-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <div className="flex items-center justify-between">
            {/* Logo + index */}
            <Link to="/" className="flex items-center gap-3 group">
              <span
                className="text-[14px] font-semibold transition-opacity group-hover:opacity-70"
                style={{ color: 'rgba(255,255,255,0.92)', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.01em' }}
              >
                Jay Harwani
              </span>
              <span
                className="hidden sm:inline-block text-[11px] font-medium tracking-[0.18em] uppercase"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}
              >
                Portfolio · '26
              </span>
            </Link>

            {/* Right side nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/about"
                className="text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:bg-white/[0.04]"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}
              >
                About
              </Link>
              <a
                href="https://www.linkedin.com/in/jay-harwani/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:bg-white/[0.04]"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'DM Sans, sans-serif' }}
              >
                LinkedIn
              </a>
              <a
                href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] px-4 py-2 rounded-full transition-all hover:scale-[1.03]"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  color: '#0A0A0A',
                  fontFamily: 'DM Sans, sans-serif',
                }}
              >
                Resume
                <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
              </a>
            </nav>

            <div className="md:hidden flex items-center">
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
            <nav
              className="flex flex-col gap-1 rounded-2xl p-4 shadow-2xl border border-white/10"
              style={{ backgroundColor: 'rgba(20,20,20,0.95)', backdropFilter: 'blur(20px)', fontFamily: 'DM Sans, sans-serif' }}
            >
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                About
              </Link>
              <a
                href="https://www.linkedin.com/in/jay-harwani/"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-[15px] font-medium text-white/80 hover:text-white hover:bg-white/5 transition-colors"
              >
                LinkedIn
              </a>
              <a
                href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-4 mt-2 mb-1 text-center text-[13px] font-semibold rounded-full py-3"
                style={{ backgroundColor: 'rgba(255,255,255,0.95)', color: '#0A0A0A' }}
              >
                Resume
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hero Content — editorial grid layout */}
      <div className="relative min-h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-12 z-20 pt-32 pb-24">
        <div className="w-full max-w-7xl mx-auto">

          {/* Top meta row: Status pill + Profile micro-card */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-6 mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            {/* Backdrop overlay when photo is expanded */}
            <AnimatePresence>
              {photoOpen && (
                <motion.div
                  className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  onMouseEnter={() => setPhotoOpen(false)}
                  onClick={() => setPhotoOpen(false)}
                />
              )}
            </AnimatePresence>

            {/* Profile chip */}
            <div
              className="flex items-center gap-3 group cursor-pointer"
              onMouseEnter={() => !isTouchDevice && setPhotoOpen(true)}
              onClick={() => isTouchDevice && setPhotoOpen(!photoOpen)}
            >
              {/* Photo with cinematic expand */}
              <motion.div
                className="relative z-50 overflow-hidden flex-shrink-0"
                onMouseLeave={() => setPhotoOpen(false)}
                animate={photoOpen ? {
                  width: 280,
                  height: 340,
                  borderRadius: 24,
                } : {
                  width: 56,
                  height: 56,
                  borderRadius: 100,
                }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  boxShadow: photoOpen
                    ? '0 40px 80px -20px rgba(0,0,0,0.8), 0 0 60px rgba(45,212,191,0.18)'
                    : '0 0 0 1.5px rgba(255,255,255,0.12), 0 8px 24px -8px rgba(0,0,0,0.6)',
                }}
              >
                <motion.img
                  src={userPhoto}
                  alt="Jay Harwani"
                  className="w-full h-full object-cover"
                  animate={photoOpen ? {
                    scale: 1,
                    objectPosition: 'center 30%',
                  } : {
                    scale: 1.2,
                    objectPosition: 'center 22%',
                  }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                />

                <AnimatePresence>
                  {photoOpen && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <p className="text-white font-semibold text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>Jay Harwani</p>
                      <p className="text-[#5EEAD4] text-xs">Product Designer · MS HCI '26</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Name + role */}
              <div>
                <p className="text-[14px] font-semibold leading-tight" style={{ color: 'rgba(255,255,255,0.95)', fontFamily: 'DM Sans, sans-serif' }}>
                  Jay Harwani
                </p>
                <p className="text-[12px] mt-0.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}>
                  Product Designer · Baltimore
                </p>
              </div>
            </div>

            {/* Divider on desktop */}
            <div className="hidden sm:block w-px h-8" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

            {/* Availability pill */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full self-start sm:self-auto"
              style={{
                backgroundColor: 'rgba(45,212,191,0.06)',
                border: '1px solid rgba(45,212,191,0.2)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#2DD4BF' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#2DD4BF' }} />
              </span>
              <span className="text-[12px] font-medium" style={{ color: 'rgba(255,255,255,0.85)', fontFamily: 'DM Sans, sans-serif' }}>
                Available · Summer '26 internships & full-time
              </span>
            </div>
          </motion.div>

          {/* HEADLINE — opinionated, specific to his work */}
          <div className="mb-10 sm:mb-12">
            <div className="overflow-hidden">
              <motion.h1
                initial={{ y: '110%' }}
                animate={loaded ? { y: '0%' } : {}}
                transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-[12vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.5vw] xl:text-[6.5vw] leading-[0.92] tracking-[-0.045em]"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#FFFFFF' }}
              >
                Designing where
              </motion.h1>
            </div>

            <div className="overflow-hidden mt-1">
              <motion.h1
                initial={{ y: '110%' }}
                animate={loaded ? { y: '0%' } : {}}
                transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="text-[12vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.5vw] xl:text-[6.5vw] leading-[0.92] tracking-[-0.045em]"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
              >
                <span
                  style={{
                    background: 'linear-gradient(135deg, #2DD4BF 0%, #5EEAD4 35%, #A78BFA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  AI meets
                </span>{' '}
                <span style={{ color: 'rgba(255,255,255,0.3)' }}>the</span>
              </motion.h1>
            </div>

            <div className="overflow-hidden mt-1">
              <motion.h1
                initial={{ y: '110%' }}
                animate={loaded ? { y: '0%' } : {}}
                transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-[12vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.5vw] xl:text-[6.5vw] leading-[0.92] tracking-[-0.045em]"
                style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#FFFFFF' }}
              >
                way humans behave<span style={{ color: '#2DD4BF' }}>.</span>
              </motion.h1>
            </div>
          </div>

          {/* Subhead — concrete positioning */}
          <motion.p
            className="text-[16px] sm:text-[18px] md:text-[19px] max-w-[640px] mb-12 sm:mb-14"
            style={{
              color: 'rgba(255,255,255,0.65)',
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.55,
              letterSpacing: '-0.005em',
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            I'm a product designer focused on{' '}
            <span style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 500 }}>behavior change, accessibility, and human-AI interaction</span>
            {' '}— building interfaces that intervene at the right moment, for people the system often forgets.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 1.15 }}
          >
            <button
              onClick={scrollToCaseStudies}
              className="group relative inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full overflow-hidden transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ fontFamily: 'DM Sans, sans-serif', backgroundColor: '#FFFFFF', color: '#0A0A0A' }}
            >
              <span>View selected work</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" strokeWidth={2.5} />
            </button>

            <Link
              to="/about"
              className="group inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full transition-all hover:bg-white/[0.04]"
              style={{
                fontFamily: 'DM Sans, sans-serif',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <span>About me</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
            </Link>
          </motion.div>

          {/* Currently / Previously — TRUST BAR */}
          <motion.div
            className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 pt-8"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 1.35 }}
          >
            <div className="flex items-center gap-3">
              <span
                className="text-[10.5px] font-semibold uppercase tracking-[0.18em] flex-shrink-0"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}
              >
                Currently
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#2DD4BF' }} />
                  UMBC CARDS Lab
                </span>
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  MS HCI · UMBC
                </span>
              </div>
            </div>

            <div className="hidden sm:block w-px h-6" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} />

            <div className="flex items-center gap-3">
              <span
                className="text-[10.5px] font-semibold uppercase tracking-[0.18em] flex-shrink-0"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}
              >
                Previously
              </span>
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Welspun GCC
                </span>
                <span
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.7)',
                    fontFamily: 'DM Sans, sans-serif',
                  }}
                >
                  Metafic
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator — bottom right */}
        <motion.div
          className="absolute bottom-8 right-6 sm:right-12 hidden lg:flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
        >
          <span
            className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'DM Sans, sans-serif' }}
          >
            Scroll
          </span>
          <div
            className="w-[1px] h-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)',
              animation: 'scroll-bounce 2.5s ease-in-out infinite',
            }}
          />
        </motion.div>
      </div>

      {/* Ambient orbs */}
      <div
        className="absolute top-[20%] right-[8%] w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(45,212,191,0.06) 0%, transparent 70%)',
          animation: 'ambient-pulse 8s ease-in-out infinite',
        }}
      />
      <div
        className="absolute bottom-[10%] left-[5%] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(167,139,250,0.05) 0%, transparent 70%)',
          animation: 'ambient-pulse 10s ease-in-out 2s infinite',
        }}
      />
    </section>
  );
}
