import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll } from "motion/react";
import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { Menu, X, ArrowDown, ArrowUpRight } from "lucide-react";
import userPhoto from "../assets/hero-portrait.jpeg";

/* ------------------------------------------------------------- */
/*  Real-time clock — Baltimore                                   */
/* ------------------------------------------------------------- */
function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const t = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "America/New_York",
      });
      setTime(t);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.04em' }}>
      {time}
    </span>
  );
}

/* ------------------------------------------------------------- */
/*  Marquee strip — credentials                                   */
/* ------------------------------------------------------------- */
function MarqueeStrip() {
  const items = [
    "Behavior Design", "★", "Accessibility", "★", "Human × AI",
    "★", "Design Systems", "★", "Research-driven", "★", "Prototyping",
    "★", "Cross-platform", "★", "Enterprise UX", "★", "Cognitive UX",
  ];

  return (
    <div
      className="relative w-full overflow-hidden py-3.5"
      style={{
        borderTop: '1px solid rgba(15,23,42,0.08)',
        borderBottom: '1px solid rgba(15,23,42,0.08)',
        backgroundColor: 'rgba(255,255,255,0.5)',
      }}
    >
      <motion.div
        className="flex items-center gap-7 whitespace-nowrap"
        animate={{ x: [0, -1400] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className={item === '★' ? "text-[10px]" : "text-[12px]"}
            style={{
              color: item === '★' ? '#0F766E' : 'rgba(15,23,42,0.7)',
              fontFamily: item === '★' ? 'Playfair Display, serif' : 'DM Sans, sans-serif',
              fontWeight: item === '★' ? 400 : 600,
              letterSpacing: item === '★' ? '0' : '0.18em',
              textTransform: item === '★' ? 'none' : 'uppercase',
            }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------- */
/*  Hero — editorial composition                                  */
/* ------------------------------------------------------------- */
export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Cursor-tracked subtle parallax on hero text (1-2px range — refined)
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);
  const smoothX = useSpring(mouseX, { stiffness: 30, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 30, damping: 25 });
  const textShiftX = useTransform(smoothX, [0, 1], [-8, 8]);
  const textShiftY = useTransform(smoothY, [0, 1], [-4, 4]);

  // Scroll-driven hero fade
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.94]);

  const scrollToCaseStudies = () => {
    setMobileMenuOpen(false);
    document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
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

  const today = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: '#FAFAF7' }}
    >
      {/* Soft ambient gradient washes */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(at 15% 100%, rgba(15,118,110,0.06) 0%, transparent 50%), radial-gradient(at 90% 10%, rgba(124,58,237,0.05) 0%, transparent 45%)`,
        }}
      />

      {/* Paper grain */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.05,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Editorial baseline grid (4 columns) */}
      <div className="absolute inset-0 pointer-events-none hidden lg:flex justify-between max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-px h-full" style={{ backgroundColor: 'rgba(15,23,42,0.04)' }} />
        ))}
      </div>

      {/* Navigation */}
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(250,250,247,0.85)' : 'transparent',
          backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(15,23,42,0.06)' : '1px solid transparent',
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <span
              className="text-[14.5px] font-semibold transition-opacity group-hover:opacity-70"
              style={{ color: '#09090B', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.01em' }}
            >
              Jay Harwani
            </span>
            <span
              className="hidden sm:inline-block text-[10px] font-mono tracking-[0.15em]"
              style={{ color: '#71717A', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
            >
              ©2026 / v4.0
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={scrollToCaseStudies}
              className="text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:bg-black/[0.04]"
              style={{ color: '#52525B', fontFamily: 'DM Sans, sans-serif' }}
            >
              Work
            </button>
            <Link
              to="/about"
              className="text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:bg-black/[0.04]"
              style={{ color: '#52525B', fontFamily: 'DM Sans, sans-serif' }}
            >
              About
            </Link>
            <a
              href="https://www.linkedin.com/in/jay-harwani/"
              target="_blank" rel="noopener noreferrer"
              className="text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:bg-black/[0.04]"
              style={{ color: '#52525B', fontFamily: 'DM Sans, sans-serif' }}
            >
              LinkedIn
            </a>
            <a
              href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
              target="_blank" rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] px-4 py-2 rounded-full transition-all hover:scale-[1.03]"
              style={{ backgroundColor: '#09090B', color: '#FFFFFF', fontFamily: 'DM Sans, sans-serif' }}
            >
              CV
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </a>
          </nav>

          <div className="md:hidden">
            <button className="p-2 -mr-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="w-5 h-5" style={{ color: '#09090B' }} /> : <Menu className="w-5 h-5" style={{ color: '#09090B' }} />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-0 top-[68px] z-50 md:hidden mx-5"
          >
            <nav
              className="flex flex-col gap-1 rounded-2xl p-4 shadow-2xl"
              style={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(15,23,42,0.08)',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              <button onClick={() => { scrollToCaseStudies(); setMobileMenuOpen(false); }} className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/[0.04] text-left" style={{ color: '#09090B' }}>
                Work
              </button>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/[0.04]" style={{ color: '#09090B' }}>
                About
              </Link>
              <a href="https://www.linkedin.com/in/jay-harwani/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/[0.04]" style={{ color: '#09090B' }}>
                LinkedIn
              </a>
              <a
                href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-2 mt-2 mb-1 text-center text-[13px] font-semibold rounded-full py-3"
                style={{ backgroundColor: '#09090B', color: '#FFFFFF' }}
              >
                Curriculum Vitae
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo expand backdrop */}
      <AnimatePresence>
        {photoOpen && (
          <motion.div
            className="fixed inset-0 bg-black/45 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() => setPhotoOpen(false)}
            onClick={() => setPhotoOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* MAIN HERO — editorial composition */}
      <motion.div
        className="relative min-h-screen flex flex-col z-20 pt-28 pb-32"
        style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
      >
        <div className="flex-1 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 flex flex-col">

          {/* TOP ROW — profile (left) + edition stamp (right) */}
          <div className="flex items-start justify-between mb-12 sm:mb-16">

            {/* TOP-LEFT: Profile chip with hover-expand photo */}
            <motion.div
              className="flex items-center gap-4 relative"
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <div
                className="relative cursor-pointer"
                onMouseEnter={() => !isTouchDevice && setPhotoOpen(true)}
                onClick={() => isTouchDevice && setPhotoOpen(!photoOpen)}
              >
                <motion.div
                  className="relative z-50 overflow-hidden"
                  onMouseLeave={() => setPhotoOpen(false)}
                  animate={photoOpen ? {
                    width: 300,
                    height: 380,
                    borderRadius: 20,
                  } : {
                    width: 64,
                    height: 64,
                    borderRadius: 100,
                  }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    boxShadow: photoOpen
                      ? '0 40px 90px -20px rgba(15,23,42,0.45), 0 0 0 1px rgba(15,23,42,0.06)'
                      : '0 0 0 1.5px rgba(15,23,42,0.1), 0 6px 16px -6px rgba(15,23,42,0.18)',
                  }}
                >
                  <motion.img
                    src={userPhoto}
                    alt="Jay Harwani"
                    className="w-full h-full object-cover"
                    animate={photoOpen ? { scale: 1, objectPosition: 'center 28%' } : { scale: 1.2, objectPosition: 'center 22%' }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <AnimatePresence>
                    {photoOpen && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                      >
                        <p className="text-white font-semibold text-[14px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          Jay Harwani — Baltimore, MD
                        </p>
                        <p className="text-[13px] mt-0.5" style={{ color: '#5EEAD4', fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
                          Product Designer & MS HCI
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Name plate */}
              <div>
                <p
                  className="text-[14px] font-semibold leading-tight"
                  style={{ color: '#09090B', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.01em' }}
                >
                  Jay Harwani
                </p>
                <p
                  className="text-[12px] mt-0.5"
                  style={{ color: '#52525B', fontFamily: 'DM Sans, sans-serif' }}
                >
                  Product Designer · <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', color: '#0F766E' }}>MS HCI</span>
                </p>
              </div>
            </motion.div>

            {/* TOP-RIGHT: Edition stamp */}
            <motion.div
              className="hidden sm:flex flex-col items-end text-right"
              initial={{ opacity: 0, y: 20 }}
              animate={loaded ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.25em] mb-1"
                style={{ color: '#71717A', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              >
                Edition N°. 04
              </span>
              <span
                className="text-[10px] uppercase tracking-[0.25em]"
                style={{ color: '#A1A1AA', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              >
                Spring / 2026
              </span>
            </motion.div>
          </div>

          {/* CENTER: HEADLINE — fills the page, mixed type */}
          <motion.div
            className="flex-1 flex flex-col justify-center"
            style={{ x: textShiftX, y: textShiftY }}
          >
            <div className="max-w-[1100px]">
              {/* "Hi, I'm Jay" — small intro */}
              <motion.p
                className="text-[14px] mb-6 sm:mb-8 flex items-center gap-2"
                style={{ color: '#52525B', fontFamily: 'DM Sans, sans-serif' }}
                initial={{ opacity: 0, y: 10 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <span className="inline-block w-8 h-px" style={{ backgroundColor: '#0F766E' }} />
                <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontSize: '15px' }}>Hi, I'm Jay</span>
                <span style={{ color: '#A1A1AA' }}>— a designer at the intersection of:</span>
              </motion.p>

              {/* HEADLINE — 3 lines, mixed Syne + Playfair italic */}
              <div className="mb-8 sm:mb-10">
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: '110%' }}
                    animate={loaded ? { y: '0%' } : {}}
                    transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[9vw] xl:text-[8vw] leading-[0.92] tracking-[-0.045em]"
                    style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#09090B' }}
                  >
                    behavior,
                  </motion.h1>
                </div>

                <div className="overflow-hidden mt-1">
                  <motion.h1
                    initial={{ y: '110%' }}
                    animate={loaded ? { y: '0%' } : {}}
                    transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[9vw] xl:text-[8vw] leading-[0.92] tracking-[-0.045em]"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontStyle: 'italic',
                      fontWeight: 500,
                      color: '#0F766E',
                    }}
                  >
                    artificial intelligence,
                  </motion.h1>
                </div>

                <div className="overflow-hidden mt-1">
                  <motion.h1
                    initial={{ y: '110%' }}
                    animate={loaded ? { y: '0%' } : {}}
                    transition={{ duration: 1, delay: 0.95, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[14vw] sm:text-[12vw] md:text-[10vw] lg:text-[9vw] xl:text-[8vw] leading-[0.92] tracking-[-0.045em]"
                    style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#09090B' }}
                  >
                    & accessibility<span style={{ color: '#0F766E', fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 400 }}>.</span>
                  </motion.h1>
                </div>
              </div>

              {/* Standfirst — magazine subtitle */}
              <motion.p
                className="text-[15px] sm:text-[17px] max-w-[580px] mb-10"
                style={{
                  color: '#52525B',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1.6,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.15 }}
              >
                Building interfaces that intervene at the right moment — for the people the system often forgets. Currently designing AI &amp; robotics tools at <span style={{ color: '#09090B', fontWeight: 600 }}>UMBC CARDS Lab</span>.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 1.25 }}
              >
                <button
                  onClick={scrollToCaseStudies}
                  className="group inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: '#09090B',
                    color: '#FFFFFF',
                    fontFamily: 'DM Sans, sans-serif',
                    boxShadow: '0 12px 24px -10px rgba(9,9,11,0.4)',
                  }}
                >
                  <span>See selected work</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" strokeWidth={2.5} />
                </button>

                <Link
                  to="/about"
                  className="group inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full transition-all hover:bg-black/[0.04]"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#09090B',
                    border: '1px solid rgba(15,23,42,0.18)',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <span style={{ fontFamily: 'Playfair Display, serif', fontStyle: 'italic', fontWeight: 500 }}>About</span>
                  <span>me</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* BOTTOM ROW — editorial credit line */}
          <motion.div
            className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mt-16 sm:mt-20 pt-6"
            style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 1.4 }}
          >
            {/* Left: status */}
            <div className="flex flex-col gap-2">
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: '#A1A1AA', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              >
                Status / Availability
              </span>
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#0F766E' }} />
                  <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#0F766E' }} />
                </span>
                <span className="text-[13px] font-medium" style={{ color: '#09090B', fontFamily: 'DM Sans, sans-serif' }}>
                  Open to full-time roles
                </span>
                <span className="text-[12px]" style={{ color: '#52525B', fontFamily: 'Playfair Display, serif', fontStyle: 'italic' }}>
                  · no sponsorship needed
                </span>
              </div>
            </div>

            {/* Center: location + clock */}
            <div className="flex flex-col gap-2 sm:items-center">
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: '#A1A1AA', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              >
                Local Time / Baltimore
              </span>
              <span
                className="text-[14px] font-medium"
                style={{ color: '#09090B', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              >
                <LiveClock /> EST
              </span>
            </div>

            {/* Right: updated stamp */}
            <div className="flex flex-col gap-2 sm:items-end">
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: '#A1A1AA', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              >
                Last Updated
              </span>
              <span
                className="text-[13px] font-medium"
                style={{ color: '#09090B', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              >
                {today}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Marquee at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <MarqueeStrip />
      </div>
    </section>
  );
}
