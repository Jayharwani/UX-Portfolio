import { motion, useScroll, useTransform } from "motion/react";
import { useRef, useState, useEffect } from "react";

const manifesto = [
  {
    number: "01",
    title: "Behavior Design",
    italic: "the moments where attention slips",
    body: "I design for the small invisible decisions — distracted glances, impulse taps, broken habits — and intervene with intent.",
    tagline: "Featured in: SmartDrive · Bumper",
  },
  {
    number: "02",
    title: "Accessibility First",
    italic: "for the people the system forgets",
    body: "Neurodivergent users, vulnerable moments, edge-case humans. The default user is a fiction; I design for the actual ones.",
    tagline: "Featured in: ChronoWeave",
  },
  {
    number: "03",
    title: "Human × AI",
    italic: "trust earned, not assumed",
    body: "Researching how AI should disclose, defer, and adapt — so the interface still feels like the user is in the driver's seat.",
    tagline: "Currently: UMBC CARDS Lab",
  },
  {
    number: "04",
    title: "Systems Thinking",
    italic: "design that scales without flattening",
    body: "Patterns, libraries, and tokens that hold their shape across enterprise complexity, accessibility constraints, and real handoff.",
    tagline: "Previously: Welspun GCC",
  },
];

const stats = [
  { value: "5+", label: "Years designing" },
  { value: "3", label: "Featured studies" },
  { value: "MS", label: "HCI from UMBC" },
  { value: "12+", label: "Industries shipped" },
];

/* Animated counter */
function StatCounter({ value, inView }: { value: string; inView: boolean }) {
  const [displayed, setDisplayed] = useState(value);
  const numericValue = parseInt(value.replace(/\D/g, ''));
  const suffix = value.replace(/[\d]/g, '');

  useEffect(() => {
    if (!inView || isNaN(numericValue) || numericValue === 0) {
      setDisplayed(value);
      return;
    }
    let start = 0;
    const duration = 1400;
    const stepTime = 16;
    const increment = numericValue / (duration / stepTime);
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setDisplayed(`${numericValue}${suffix}`);
        clearInterval(timer);
      } else {
        setDisplayed(`${Math.floor(start)}${suffix}`);
      }
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, numericValue, suffix, value]);

  return <>{displayed}</>;
}

export function ApproachStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const orb1Y = useTransform(scrollYProgress, [0, 1], [-100, 100]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setStatsInView(true),
      { threshold: 0.3 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ backgroundColor: '#FAFAF7' }}
    >
      {/* Parallax ambient */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '5%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(15,118,110,0.06) 0%, transparent 65%)',
          y: orb1Y,
          filter: 'blur(60px)',
        }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%',
          right: '-10%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)',
          y: orb2Y,
          filter: 'blur(60px)',
        }}
      />

      {/* Editorial column lines */}
      <div className="absolute inset-0 pointer-events-none hidden lg:flex justify-between max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-px h-full" style={{ backgroundColor: 'rgba(15,23,42,0.04)' }} />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">

        {/* Section header — magazine style */}
        <div className="grid grid-cols-12 gap-6 mb-20 sm:mb-28">
          {/* Left credit column */}
          <motion.div
            className="col-span-12 md:col-span-3 flex flex-col gap-4"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ color: '#71717A', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
            >
              Section //01
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{ color: '#A1A1AA', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
            >
              How I work
            </span>
          </motion.div>

          {/* Right headline */}
          <motion.div
            className="col-span-12 md:col-span-9"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            <h2
              className="text-[36px] sm:text-[52px] md:text-[68px] leading-[1.0] tracking-[-0.035em]"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#09090B' }}
            >
              A working{' '}
              <span
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontStyle: 'italic',
                  fontWeight: 500,
                  color: '#0F766E',
                }}
              >
                manifesto.
              </span>
            </h2>
            <p
              className="text-[15px] md:text-[17px] mt-6 max-w-2xl"
              style={{
                color: '#52525B',
                fontFamily: 'DM Sans, sans-serif',
                lineHeight: 1.65,
              }}
            >
              Four ideas I keep coming back to — across research notebooks,
              design critiques, and 3 a.m. conversations with the people
              I'm designing for.
            </p>
          </motion.div>
        </div>

        {/* Manifesto rows — editorial list */}
        <div className="space-y-px">
          {manifesto.map((item, i) => (
            <motion.div
              key={item.number}
              className="group relative grid grid-cols-12 gap-4 sm:gap-6 py-10 sm:py-14 cursor-default"
              style={{ borderTop: '1px solid rgba(15,23,42,0.1)' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Hover wash */}
              <motion.div
                className="absolute inset-0 -mx-6 sm:-mx-8 lg:-mx-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: 'linear-gradient(90deg, transparent 0%, rgba(15,118,110,0.04) 50%, transparent 100%)',
                }}
              />

              {/* Number — large left */}
              <div className="col-span-3 sm:col-span-2 relative">
                <motion.div
                  className="text-[40px] sm:text-[64px] md:text-[80px] leading-none"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    color: '#0F766E',
                    letterSpacing: '-0.02em',
                  }}
                  whileHover={{ x: 6 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  {item.number}
                </motion.div>
              </div>

              {/* Title + body — middle */}
              <div className="col-span-9 sm:col-span-7 relative">
                <h3
                  className="text-[22px] sm:text-[28px] md:text-[32px] mb-2 leading-tight"
                  style={{
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    color: '#09090B',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {item.title}
                </h3>

                {/* Italic teaser */}
                <p
                  className="text-[15px] sm:text-[17px] mb-4"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: '#0F766E',
                  }}
                >
                  — {item.italic}
                </p>

                {/* Body */}
                <p
                  className="text-[14px] sm:text-[15.5px] max-w-[640px]"
                  style={{
                    color: '#52525B',
                    fontFamily: 'DM Sans, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  {item.body}
                </p>
              </div>

              {/* Tagline — right metadata */}
              <div className="hidden sm:flex col-span-3 flex-col items-end justify-start text-right gap-2 relative">
                <span
                  className="text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: '#A1A1AA', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
                >
                  Reference
                </span>
                <span
                  className="text-[12px] font-medium"
                  style={{ color: '#52525B', fontFamily: 'DM Sans, sans-serif' }}
                >
                  {item.tagline}
                </span>
              </div>

              {/* Mobile reference */}
              <div className="sm:hidden col-span-12 mt-3">
                <span
                  className="text-[11px] font-medium"
                  style={{ color: '#71717A', fontFamily: 'DM Sans, sans-serif' }}
                >
                  → {item.tagline}
                </span>
              </div>
            </motion.div>
          ))}

          {/* Closing border */}
          <div style={{ borderTop: '1px solid rgba(15,23,42,0.1)' }} />
        </div>

        {/* Stats — minimal editorial row */}
        <motion.div
          ref={statsRef}
          className="mt-20 sm:mt-28 grid grid-cols-2 sm:grid-cols-4 gap-y-10 gap-x-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col gap-2"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.2em]"
                style={{ color: '#71717A', fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace' }}
              >
                {String(i + 1).padStart(2, '0')} / {stat.label}
              </span>
              <p
                className="text-[44px] sm:text-[56px] leading-none"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  color: '#09090B',
                  letterSpacing: '-0.04em',
                }}
              >
                <StatCounter value={stat.value} inView={statsInView} />
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
