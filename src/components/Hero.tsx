import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useScroll } from "motion/react";
import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router";
import { Menu, X, ArrowDown, ArrowUpRight, Sparkles } from "lucide-react";
import userPhoto from "../assets/hero-portrait.jpeg";

/* ------------------------------------------------------------- */
/*  3D Tilt Photo Card                                            */
/* ------------------------------------------------------------- */
function TiltPhoto() {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [9, -9]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9, 9]), { stiffness: 200, damping: 20 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }, [x, y]);

  const handleLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ perspective: 1200, transformStyle: "preserve-3d" }}
      className="relative"
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative"
      >
        {/* Floating decorative chips behind photo */}
        <motion.div
          style={{ transform: 'translateZ(-40px)' }}
          className="absolute -top-6 -right-8 z-0 hidden lg:block"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div
            className="px-3.5 py-2 rounded-full backdrop-blur-md flex items-center gap-2"
            style={{
              backgroundColor: 'rgba(15,118,110,0.08)',
              border: '1px solid rgba(15,118,110,0.18)',
              boxShadow: '0 8px 24px -8px rgba(15,118,110,0.18)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#0F766E' }} strokeWidth={2.2} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#134E4A', fontFamily: 'DM Sans, sans-serif' }}>
              MS HCI
            </span>
          </div>
        </motion.div>

        <motion.div
          style={{ transform: 'translateZ(-40px)' }}
          className="absolute -bottom-4 -left-6 z-0 hidden lg:block"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div
            className="px-3.5 py-2 rounded-full backdrop-blur-md flex items-center gap-2"
            style={{
              backgroundColor: 'rgba(167,139,250,0.10)',
              border: '1px solid rgba(167,139,250,0.22)',
              boxShadow: '0 8px 24px -8px rgba(167,139,250,0.20)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#7C3AED' }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.12em]" style={{ color: '#5B21B6', fontFamily: 'DM Sans, sans-serif' }}>
              Open to work
            </span>
          </div>
        </motion.div>

        {/* Photo card */}
        <div
          className="relative overflow-hidden rounded-[28px] z-10"
          style={{
            transformStyle: 'preserve-3d',
            boxShadow: '0 30px 80px -20px rgba(15,23,42,0.25), 0 0 0 1px rgba(15,23,42,0.04)',
          }}
        >
          <img
            src={userPhoto}
            alt="Jay Harwani"
            className="w-full h-full object-cover"
            style={{
              width: 360,
              height: 460,
              objectPosition: 'center 22%',
            }}
          />
          {/* Subtle gradient overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.18) 100%)',
            }}
          />
          {/* Bottom name plaque */}
          <div
            className="absolute bottom-4 left-4 right-4 rounded-2xl px-4 py-3 backdrop-blur-xl flex items-center justify-between"
            style={{
              backgroundColor: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 8px 24px -8px rgba(0,0,0,0.18)',
            }}
          >
            <div>
              <p className="text-[13px] font-semibold leading-tight" style={{ color: '#09090B', fontFamily: 'DM Sans, sans-serif' }}>
                Jay Harwani
              </p>
              <p className="text-[11px] mt-0.5" style={{ color: '#52525B', fontFamily: 'DM Sans, sans-serif' }}>
                Product Designer
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#0F766E' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#0F766E' }} />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#0F766E', fontFamily: 'DM Sans, sans-serif' }}>
                Available
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------- */
/*  Magnetic CTA Button                                           */
/* ------------------------------------------------------------- */
function MagneticButton({
  children,
  onClick,
  href,
  variant = 'primary',
  external = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  href?: string;
  variant?: 'primary' | 'secondary';
  external?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });
  const y = useSpring(useMotionValue(0), { stiffness: 300, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = e.clientX - rect.left - rect.width / 2;
    const cy = e.clientY - rect.top - rect.height / 2;
    x.set(cx * 0.18);
    y.set(cy * 0.25);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const baseClasses = "group inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full transition-colors";
  const primaryStyle = {
    backgroundColor: '#09090B',
    color: '#FFFFFF',
    fontFamily: 'DM Sans, sans-serif',
    boxShadow: '0 12px 24px -10px rgba(9,9,11,0.4)',
  };
  const secondaryStyle = {
    backgroundColor: 'rgba(255,255,255,0.6)',
    color: '#09090B',
    border: '1px solid rgba(15,23,42,0.12)',
    fontFamily: 'DM Sans, sans-serif',
    backdropFilter: 'blur(12px)',
  };

  const inner = (
    <motion.div
      style={{ x, y }}
      className={baseClasses}
    >
      {children}
    </motion.div>
  );

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
      className="cursor-pointer"
    >
      {href ? (
        <a href={href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined} style={variant === 'primary' ? primaryStyle : secondaryStyle} className={baseClasses}>
          {inner}
        </a>
      ) : (
        <button style={variant === 'primary' ? primaryStyle : secondaryStyle} className={baseClasses}>
          {inner}
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------- */
/*  Marquee scroll strip — credentials                            */
/* ------------------------------------------------------------- */
function MarqueeStrip() {
  const items = [
    "Behavior Design", "·", "Accessibility", "·", "Human × AI",
    "·", "Design Systems", "·", "Research-driven", "·", "Prototyping",
    "·", "Cross-platform", "·", "Enterprise UX", "·", "Cognitive UX",
  ];

  return (
    <div className="relative w-full overflow-hidden py-4" style={{ borderTop: '1px solid rgba(15,23,42,0.06)', borderBottom: '1px solid rgba(15,23,42,0.06)', backgroundColor: 'rgba(255,255,255,0.4)' }}>
      <motion.div
        className="flex items-center gap-6 whitespace-nowrap"
        animate={{ x: [0, -1200] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <span
            key={i}
            className="text-[13px] font-medium uppercase tracking-[0.18em]"
            style={{ color: item === '·' ? 'rgba(15,23,42,0.25)' : 'rgba(15,23,42,0.55)', fontFamily: 'DM Sans, sans-serif' }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------- */
/*  Hero — main component                                         */
/* ------------------------------------------------------------- */
export function Hero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  // Scroll-driven parallax
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const orb1Y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [0, -180]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0.3]);

  const scrollToCaseStudies = () => {
    setMobileMenuOpen(false);
    document.getElementById('case-studies')?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen overflow-hidden"
      style={{ backgroundColor: '#FAFAF7' }}
    >
      {/* Layered background — paper texture + ambient orbs */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(at 20% 10%, rgba(15,118,110,0.05) 0%, transparent 45%), radial-gradient(at 80% 0%, rgba(167,139,250,0.06) 0%, transparent 50%), radial-gradient(at 50% 100%, rgba(56,189,248,0.05) 0%, transparent 50%)`,
        }}
      />

      {/* Soft grain noise */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.04,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Subtle editorial grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.3) 1px, transparent 1px)`,
          backgroundSize: '96px 96px',
        }}
      />

      {/* Parallax floating orbs */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '8%',
          right: '-5%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(15,118,110,0.10) 0%, transparent 70%)',
          y: orb1Y,
          filter: 'blur(40px)',
        }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: '10%',
          left: '-8%',
          width: '450px',
          height: '450px',
          background: 'radial-gradient(circle, rgba(167,139,250,0.10) 0%, transparent 70%)',
          y: orb2Y,
          filter: 'blur(40px)',
        }}
      />

      {/* Navigation — refined, sticky with blur on scroll */}
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
              className="text-[15px] font-semibold transition-opacity group-hover:opacity-70"
              style={{ color: '#09090B', fontFamily: 'DM Sans, sans-serif', letterSpacing: '-0.01em' }}
            >
              Jay Harwani
            </span>
            <span
              className="hidden sm:inline-block text-[10.5px] font-semibold tracking-[0.2em] uppercase"
              style={{ color: '#71717A', fontFamily: 'DM Sans, sans-serif' }}
            >
              Portfolio · '26
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/about"
              className="text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:bg-black/[0.04]"
              style={{ color: '#52525B', fontFamily: 'DM Sans, sans-serif' }}
            >
              About
            </Link>
            <a
              href="https://www.linkedin.com/in/jay-harwani/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:bg-black/[0.04]"
              style={{ color: '#52525B', fontFamily: 'DM Sans, sans-serif' }}
            >
              LinkedIn
            </a>
            <a
              href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-[0.08em] px-4 py-2 rounded-full transition-all hover:scale-[1.03]"
              style={{
                backgroundColor: '#09090B',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, sans-serif',
              }}
            >
              Resume
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
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/[0.04]" style={{ color: '#09090B' }}>
                About
              </Link>
              <a
                href="https://www.linkedin.com/in/jay-harwani/"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 rounded-xl text-[15px] font-medium hover:bg-black/[0.04]"
                style={{ color: '#09090B' }}
              >
                LinkedIn
              </a>
              <a
                href="https://docs.google.com/document/d/1XNBHnLUtPLExp9zibtkigSb1N1eiY_VN1FIRBaOiwqw/edit?usp=sharing"
                target="_blank" rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="mx-2 mt-2 mb-1 text-center text-[13px] font-semibold rounded-full py-3"
                style={{ backgroundColor: '#09090B', color: '#FFFFFF' }}
              >
                Resume
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Hero Content */}
      <motion.div
        className="relative min-h-screen flex flex-col justify-center px-6 sm:px-8 lg:px-12 z-20 pt-32 pb-32"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="w-full max-w-7xl mx-auto">

          {/* Top: Status badge */}
          <motion.div
            className="flex items-center gap-2 mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={loaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                backgroundColor: 'rgba(15,118,110,0.06)',
                border: '1px solid rgba(15,118,110,0.18)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: '#0F766E' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: '#0F766E' }} />
              </span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.1em]" style={{ color: '#134E4A', fontFamily: 'DM Sans, sans-serif' }}>
                Open to full-time roles
              </span>
              <span className="w-px h-3" style={{ backgroundColor: 'rgba(15,118,110,0.2)' }} />
              <span className="text-[12px] font-medium" style={{ color: '#0F766E', fontFamily: 'DM Sans, sans-serif' }}>
                No sponsorship required
              </span>
            </div>
          </motion.div>

          {/* Two-column layout: text + photo */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

            {/* Left: Headline + Subhead + CTAs */}
            <div className="lg:col-span-7 order-2 lg:order-1">
              {/* HEADLINE — word-by-word reveal */}
              <div className="mb-10">
                <div className="overflow-hidden">
                  <motion.h1
                    initial={{ y: '110%' }}
                    animate={loaded ? { y: '0%' } : {}}
                    transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[13vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.2vw] xl:text-[6.5vw] leading-[0.92] tracking-[-0.045em]"
                    style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#09090B' }}
                  >
                    Designing
                  </motion.h1>
                </div>

                <div className="overflow-hidden mt-1">
                  <motion.h1
                    initial={{ y: '110%' }}
                    animate={loaded ? { y: '0%' } : {}}
                    transition={{ duration: 1, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[13vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.2vw] xl:text-[6.5vw] leading-[0.92] tracking-[-0.045em]"
                    style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700 }}
                  >
                    <span style={{ color: '#52525B' }}>where </span>
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #0F766E 0%, #14B8A6 50%, #7C3AED 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      AI
                    </span>
                  </motion.h1>
                </div>

                <div className="overflow-hidden mt-1">
                  <motion.h1
                    initial={{ y: '110%' }}
                    animate={loaded ? { y: '0%' } : {}}
                    transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="text-[13vw] sm:text-[10vw] md:text-[8.5vw] lg:text-[7.2vw] xl:text-[6.5vw] leading-[0.92] tracking-[-0.045em]"
                    style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#09090B' }}
                  >
                    meets humans<span style={{ color: '#0F766E' }}>.</span>
                  </motion.h1>
                </div>
              </div>

              {/* Subhead */}
              <motion.p
                className="text-[16px] sm:text-[18px] md:text-[19px] max-w-[600px] mb-10"
                style={{
                  color: '#52525B',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1.55,
                  letterSpacing: '-0.005em',
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 1.0 }}
              >
                Product designer focused on{' '}
                <span style={{ color: '#09090B', fontWeight: 600 }}>behavior change, accessibility, and human-AI interaction</span>
                {' '}— building interfaces that intervene at the right moment, for the people the system often forgets.
              </motion.p>

              {/* CTAs */}
              <motion.div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 1.15 }}
              >
                <MagneticButton onClick={scrollToCaseStudies} variant="primary">
                  <span>View selected work</span>
                  <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" strokeWidth={2.5} />
                </MagneticButton>

                <Link
                  to="/about"
                  className="group inline-flex items-center justify-center gap-2.5 text-[14px] font-semibold px-7 py-4 rounded-full transition-all hover:bg-black/[0.04]"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    color: '#09090B',
                    border: '1px solid rgba(15,23,42,0.15)',
                    backgroundColor: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <span>About me</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.5} />
                </Link>
              </motion.div>

              {/* Currently / Previously trust bar */}
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 pt-8"
                style={{ borderTop: '1px solid rgba(15,23,42,0.08)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={loaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 1.35 }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10.5px] font-semibold uppercase tracking-[0.2em] flex-shrink-0"
                    style={{ color: '#71717A', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Currently
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(15,23,42,0.1)',
                        color: '#09090B',
                        fontFamily: 'DM Sans, sans-serif',
                        boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#0F766E' }} />
                      UMBC CARDS Lab
                    </span>
                    <span
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium"
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid rgba(15,23,42,0.1)',
                        color: '#09090B',
                        fontFamily: 'DM Sans, sans-serif',
                        boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
                      }}
                    >
                      MS HCI · UMBC
                    </span>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-6" style={{ backgroundColor: 'rgba(15,23,42,0.1)' }} />

                <div className="flex items-center gap-3">
                  <span
                    className="text-[10.5px] font-semibold uppercase tracking-[0.2em] flex-shrink-0"
                    style={{ color: '#71717A', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Previously
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium"
                      style={{
                        backgroundColor: 'rgba(15,23,42,0.04)',
                        color: '#52525B',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      Welspun GCC
                    </span>
                    <span
                      className="inline-flex items-center px-3 py-1.5 rounded-full text-[12px] font-medium"
                      style={{
                        backgroundColor: 'rgba(15,23,42,0.04)',
                        color: '#52525B',
                        fontFamily: 'DM Sans, sans-serif',
                      }}
                    >
                      Metafic
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: 3D Photo */}
            <motion.div
              className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={loaded ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltPhoto />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden lg:flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={loaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.8 }}
        >
          <span
            className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
            style={{ color: '#71717A', fontFamily: 'DM Sans, sans-serif' }}
          >
            Scroll
          </span>
          <div
            className="w-[1px] h-10"
            style={{
              background: 'linear-gradient(to bottom, rgba(15,23,42,0.4), transparent)',
              animation: 'scroll-bounce 2.5s ease-in-out infinite',
            }}
          />
        </motion.div>
      </motion.div>

      {/* Marquee strip at bottom of hero */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <MarqueeStrip />
      </div>
    </section>
  );
}
