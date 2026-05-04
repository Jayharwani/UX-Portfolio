import { motion, useScroll, useTransform, useMotionValue, useSpring } from "motion/react";
import { useRef, useState, useEffect } from "react";
import { Brain, Accessibility, Sparkles, Workflow } from "lucide-react";

const approaches = [
  {
    icon: Brain,
    title: "Behavior Design",
    body: "Designing the moments where attention slips, decisions falter, and habits break — and intervening with intent.",
    accent: "#0F766E",
    bg: "rgba(15,118,110,0.06)",
    border: "rgba(15,118,110,0.18)",
  },
  {
    icon: Accessibility,
    title: "Accessibility First",
    body: "Building for the people the system forgets: neurodivergent users, vulnerable moments, and edge-case humans.",
    accent: "#7C3AED",
    bg: "rgba(124,58,237,0.06)",
    border: "rgba(124,58,237,0.18)",
  },
  {
    icon: Sparkles,
    title: "Human × AI",
    body: "Researching how AI should disclose, defer, and adapt — so trust is earned, not assumed.",
    accent: "#DB2777",
    bg: "rgba(219,39,119,0.06)",
    border: "rgba(219,39,119,0.18)",
  },
  {
    icon: Workflow,
    title: "Systems Thinking",
    body: "Designing scalable patterns and design systems that hold up across enterprise complexity.",
    accent: "#0EA5E9",
    bg: "rgba(14,165,233,0.06)",
    border: "rgba(14,165,233,0.18)",
  },
];

const stats = [
  { value: "5+", label: "Years designing" },
  { value: "3", label: "Featured studies" },
  { value: "MS", label: "HCI from UMBC" },
  { value: "12+", label: "Industries shipped" },
];

/* 3D Tilt Card — rotates with cursor */
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 1200, ...style }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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

  const headlineY = useTransform(scrollYProgress, [0, 1], [60, -60]);
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
      {/* Parallax ambient orbs */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          top: '5%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(15,118,110,0.06) 0%, transparent 65%)',
          y: orb1Y,
          filter: 'blur(50px)',
        }}
      />
      <motion.div
        className="absolute pointer-events-none"
        style={{
          bottom: '5%',
          right: '-10%',
          width: '550px',
          height: '550px',
          background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 65%)',
          y: orb2Y,
          filter: 'blur(50px)',
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(15,23,42,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.3) 1px, transparent 1px)`,
          backgroundSize: '96px 96px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">
        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 sm:mb-20"
          style={{ y: headlineY }}
        >
          <div className="max-w-2xl">
            <motion.div
              className="flex items-center gap-3 mb-5"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span
                className="text-[10.5px] font-semibold uppercase tracking-[0.2em]"
                style={{ color: '#71717A', fontFamily: 'DM Sans, sans-serif' }}
              >
                01 — How I work
              </span>
              <div className="w-12 h-px" style={{ backgroundColor: 'rgba(15,23,42,0.2)' }} />
            </motion.div>

            <motion.h2
              className="text-[32px] sm:text-[42px] md:text-[52px] leading-[1.05] tracking-[-0.035em]"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#09090B' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Design as a tool for{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #0F766E 0%, #7C3AED 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                human attention.
              </span>
            </motion.h2>
          </div>

          <motion.p
            className="text-[15px] md:text-[16px] max-w-md"
            style={{
              color: '#52525B',
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.65,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            I work at the intersection of behavioral science, accessibility,
            and emerging tech. Every project starts with one question:
            what is the user trying to do, and what's getting in their way?
          </motion.p>
        </motion.div>

        {/* Approach grid — 3D tilt cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {approaches.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              <TiltCard
                className="group relative p-7 rounded-[20px] cursor-pointer h-full"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid rgba(15,23,42,0.08)',
                  boxShadow: '0 1px 3px rgba(15,23,42,0.04), 0 0 0 1px rgba(15,23,42,0.02)',
                }}
              >
                {/* Hover glow background */}
                <div
                  className="absolute inset-0 rounded-[20px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${item.bg} 0%, transparent 70%)`,
                  }}
                />

                {/* Index */}
                <span
                  className="absolute top-7 right-7 text-[11px] font-mono"
                  style={{ color: '#A1A1AA' }}
                >
                  0{i + 1}
                </span>

                {/* 3D Floating icon */}
                <div
                  className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-7 transition-transform group-hover:scale-110 group-hover:-rotate-6"
                  style={{
                    backgroundColor: item.bg,
                    border: `1px solid ${item.border}`,
                    transform: 'translateZ(40px)',
                    boxShadow: `0 8px 20px -8px ${item.border}`,
                  }}
                >
                  <item.icon className="w-5 h-5" strokeWidth={2} style={{ color: item.accent }} />
                </div>

                {/* Title */}
                <h3
                  className="text-[18px] mb-3 relative"
                  style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontWeight: 700,
                    color: '#09090B',
                    letterSpacing: '-0.012em',
                  }}
                >
                  {item.title}
                </h3>

                {/* Body */}
                <p
                  className="text-[13.5px] relative"
                  style={{
                    color: '#52525B',
                    fontFamily: 'DM Sans, sans-serif',
                    lineHeight: 1.6,
                  }}
                >
                  {item.body}
                </p>

                {/* Bottom accent line */}
                <div
                  className="absolute left-7 right-7 bottom-7 h-px transition-all duration-500"
                  style={{
                    background: `linear-gradient(to right, ${item.accent}40, transparent)`,
                    transform: 'scaleX(0.3)',
                    transformOrigin: 'left',
                  }}
                />
              </TiltCard>
            </motion.div>
          ))}
        </div>

        {/* Stats — animated counters */}
        <motion.div
          ref={statsRef}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-[20px] overflow-hidden"
          style={{
            backgroundColor: 'rgba(15,23,42,0.08)',
            boxShadow: '0 1px 3px rgba(15,23,42,0.04)',
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="px-6 py-8 text-center sm:text-left relative overflow-hidden group"
              style={{ backgroundColor: '#FFFFFF' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.08 }}
            >
              {/* Hover gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle at top, rgba(15,118,110,0.04) 0%, transparent 60%)',
                }}
              />
              <p
                className="text-[40px] sm:text-[52px] leading-none mb-2 relative"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  color: '#09090B',
                  letterSpacing: '-0.04em',
                }}
              >
                <StatCounter value={stat.value} inView={statsInView} />
              </p>
              <p
                className="text-[11px] uppercase tracking-[0.18em] relative"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: '#71717A',
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
