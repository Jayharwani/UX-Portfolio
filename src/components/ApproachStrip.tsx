import { motion } from "motion/react";
import { Brain, Accessibility, Sparkles, Workflow } from "lucide-react";

const approaches = [
  {
    icon: Brain,
    title: "Behavior Design",
    body: "Designing the moments where attention slips, decisions falter, and habits break — and intervening with intent.",
    accent: "#2DD4BF",
  },
  {
    icon: Accessibility,
    title: "Accessibility First",
    body: "Building for the people the system forgets: neurodivergent users, vulnerable moments, and edge-case humans.",
    accent: "#A78BFA",
  },
  {
    icon: Sparkles,
    title: "Human × AI",
    body: "Researching how AI should disclose, defer, and adapt — so trust is earned, not assumed.",
    accent: "#F472B6",
  },
  {
    icon: Workflow,
    title: "Systems Thinking",
    body: "Designing scalable patterns and design systems that hold up across enterprise complexity.",
    accent: "#5EEAD4",
  },
];

const stats = [
  { value: "5+", label: "Years designing" },
  { value: "3", label: "Featured studies" },
  { value: "MS", label: "HCI in progress" },
  { value: "12+", label: "Industries shipped" },
];

export function ApproachStrip() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: '#0A0A0A',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '96px 96px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20 sm:py-28">
        {/* Section eyebrow + headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 sm:mb-20">
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
                style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'DM Sans, sans-serif' }}
              >
                01 — How I work
              </span>
              <div className="w-12 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
            </motion.div>

            <motion.h2
              className="text-[32px] sm:text-[40px] md:text-[48px] leading-[1.05] tracking-[-0.03em]"
              style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#FFFFFF' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              Design as a tool for{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #2DD4BF 0%, #A78BFA 100%)',
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
              color: 'rgba(255,255,255,0.6)',
              fontFamily: 'DM Sans, sans-serif',
              lineHeight: 1.6,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            I work at the intersection of behavioral science, accessibility,
            and emerging tech. Every project starts with one question: what is the
            user trying to do, and what's getting in their way?
          </motion.p>
        </div>

        {/* Approach grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
          {approaches.map((item, i) => (
            <motion.div
              key={item.title}
              className="group relative p-7 sm:p-8 transition-colors hover:bg-white/[0.02]"
              style={{ backgroundColor: '#0A0A0A' }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Index */}
              <span
                className="absolute top-7 right-7 text-[11px] font-mono"
                style={{ color: 'rgba(255,255,255,0.25)' }}
              >
                0{i + 1}
              </span>

              {/* Icon */}
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-7 transition-transform group-hover:scale-110"
                style={{
                  backgroundColor: `${item.accent}10`,
                  border: `1px solid ${item.accent}25`,
                }}
              >
                <item.icon className="w-5 h-5" strokeWidth={1.75} style={{ color: item.accent }} />
              </div>

              {/* Title */}
              <h3
                className="text-[17px] mb-3"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.95)',
                  letterSpacing: '-0.01em',
                }}
              >
                {item.title}
              </h3>

              {/* Body */}
              <p
                className="text-[13.5px]"
                style={{
                  color: 'rgba(255,255,255,0.55)',
                  fontFamily: 'DM Sans, sans-serif',
                  lineHeight: 1.6,
                }}
              >
                {item.body}
              </p>

              {/* Bottom accent line on hover */}
              <div
                className="absolute left-0 right-0 bottom-0 h-px transition-opacity opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(to right, transparent, ${item.accent}50, transparent)`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <motion.div
          className="mt-12 sm:mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="px-6 py-7 text-center sm:text-left"
              style={{ backgroundColor: '#0A0A0A' }}
            >
              <p
                className="text-[36px] sm:text-[44px] leading-none mb-2"
                style={{
                  fontFamily: 'Syne, sans-serif',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.95)',
                  letterSpacing: '-0.04em',
                }}
              >
                {stat.value}
              </p>
              <p
                className="text-[11px] uppercase tracking-[0.15em]"
                style={{
                  fontFamily: 'DM Sans, sans-serif',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
