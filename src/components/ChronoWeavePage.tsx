import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Clock,
  Lightbulb,
  Vibrate,
  Volume2,
  Sun,
  AlertCircle,
  Smartphone,
  Sparkles,
  Accessibility,
} from "lucide-react";
import { Footer } from "./Footer";
import { ChronoWeaveHeroAnimation } from "./ChronoWeaveHeroAnimation";
import { TodaysRhythmScreen, LiveNudgeScreen, WeeklyInsightsScreen, WeeklyInsightsDetailScreen, CalibrateScreen, TimeFeelScreen } from "./ChronoWeaveMockups";

// ─── Animation Variants ───
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

// ─── Section Label ───
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-purple-400 font-mono text-sm">{number}</span>
        <div className="w-12 h-px bg-gradient-to-r from-purple-500/60 to-transparent" />
      </div>
      <span className="text-purple-300/80 text-sm uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

// ─── Animated Counter ───
function AnimatedCounter({ target, duration = 2, suffix = "" }: { target: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

export function ChronoWeavePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* ─── Fixed Navigation ─── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        /* blur removed — fixed full-width bar, re-blurs every scroll frame */
        style={{ backgroundColor: 'rgba(10,10,10,0.95)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-purple-400 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm sm:text-base">Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Case Study</span>
            <span className="text-xs text-purple-400 font-mono">02</span>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section ─── */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1e] via-[#0d1117] to-[#0a0a1e]" />
          <div
            className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/8 to-transparent rounded-full blur-3xl"
            style={{ animation: 'ambient-pulse 8s ease-in-out infinite' }}
          />
          <div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-teal-500/8 to-transparent rounded-full blur-3xl"
            style={{ animation: 'ambient-pulse 8s ease-in-out 2s infinite' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12 sm:py-20">
          <div className="grid lg:grid-cols-[55%_45%] gap-8 lg:gap-8 items-center">
            {/* Left — Animated Clock Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const }}
              className="relative flex justify-center items-center min-h-[280px] sm:min-h-[400px] lg:min-h-[560px]"
            >
              <ChronoWeaveHeroAnimation />
            </motion.div>

            {/* Right — Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.2 }}
              className="space-y-8 lg:pr-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  ChronoWeave
                </h1>
                <p className="text-base sm:text-lg lg:text-2xl text-slate-300 leading-relaxed">
                  Multi-sensory nudges that help people with ADHD and autism feel time passing — not just see it.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                {["UX Design", "Hackathon (48hrs)", "Mobile App", "Figma AI"].map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/15 transition-colors duration-300"
                  >
                    {tag}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <motion.button
                  onClick={() => document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white rounded-full text-slate-900 font-semibold text-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Explore Design</span>
                  <motion.div
                    className="relative z-10"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </motion.button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="flex items-center gap-3 text-slate-400 text-sm"
              >
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="w-[2px] h-6 bg-gradient-to-b from-transparent via-slate-400 to-transparent rounded-full" />
                </motion.div>
                <span>Scroll to explore</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 01. Project Overview ─── */}
      <section id="overview" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <SectionLabel number="01" label="Project Overview" />

            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              Designing multi-sensory time<br className="hidden sm:block" /> awareness for neurodivergent users
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-3xl mb-12">
              ChronoWeave uses haptics, audio, and light to create "time anchors" — helping people who experience
              time blindness feel the passage of time through their body, not just their eyes.
            </motion.p>

            {/* Project Meta */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "My Role", value: "UX Designer", detail: "Design system & visual design" },
                { label: "Timeline", value: "48 Hours", detail: "FigBuild 2026 Hackathon" },
                { label: "Platform", value: "iOS Mobile", detail: "Built with Figma AI" },
                { label: "Team", value: "4 Designers", detail: "Jay, Fran, Deeksha, Honey" }
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-4 sm:p-5 border border-white/[0.06] bg-white/[0.02]">
                  <p className="text-slate-500 text-xs uppercase tracking-wider mb-1">{item.label}</p>
                  <p className="text-white text-sm sm:text-base font-medium">{item.value}</p>
                  <p className="text-slate-600 text-xs mt-1">{item.detail}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 02. The Challenge ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="space-y-10"
          >
            <div>
              <SectionLabel number="02" label="The Challenge" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Time blindness isn't about being lazy —<br className="hidden sm:block" /> it's a neurological disconnect
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                For people with ADHD and autism, time doesn't "feel" like it passes. Hours vanish without notice.
                Existing solutions — alarms, timers, calendar notifications — all rely on visual/auditory interruptions
                that users habituate to and ignore within days.
              </motion.p>
            </div>

            {/* Problem Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 80, suffix: "%", label: "of adults with ADHD report chronic time management struggles", source: "ADDitude Magazine, 2023" },
                { value: 6, suffix: "x", label: "more likely to miss deadlines due to time perception distortion", source: "Journal of Attention Disorders" },
                { value: 70, suffix: "%", label: "stop using timer apps within 2 weeks due to alert fatigue", source: "UX Research Survey, 2024" }
              ].map((stat, i) => (
                <div key={i} className="rounded-xl p-6 border border-red-500/10 bg-red-500/[0.03]">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-2">{stat.label}</p>
                  <p className="text-slate-600 text-xs">{stat.source}</p>
                </div>
              ))}
            </motion.div>

            {/* How Might We */}
            <motion.div variants={fadeInUp} className="rounded-2xl border border-purple-500/10 bg-purple-500/[0.03] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Lightbulb className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <p className="text-purple-400 text-sm font-medium mb-2 uppercase tracking-wider">How Might We</p>
                  <p className="text-white text-lg sm:text-xl leading-relaxed">
                    Help neurodivergent individuals feel the passage of time through multi-sensory feedback — creating
                    awareness without relying on disruptive alerts they'll eventually ignore?
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 06. The Multi-Sensory System ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="space-y-10"
          >
            <div>
              <SectionLabel number="03" label="Solution Deep-Dive" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Three sensory channels, one unified system
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                The core innovation: instead of one alert type, ChronoWeave layers three sensory
                channels that work together — making time perception tangible and impossible to habituate to.
              </motion.p>
            </div>

            {/* Sensory Channels */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  icon: Vibrate,
                  title: "Haptic Anchors",
                  desc: "Rhythmic vibration patterns that change every 15 minutes — like a gentle tap reminding you time is passing",
                  detail: "Wrist, phone, or smart home integration",
                  color: "teal"
                },
                {
                  icon: Volume2,
                  title: "Audio Cues",
                  desc: "Ambient soundscapes that subtly shift tonality as time passes — a sonic gradient from morning to evening",
                  detail: "Non-intrusive, designed for focus states",
                  color: "purple"
                },
                {
                  icon: Sun,
                  title: "Light Signals",
                  desc: "Screen or smart bulb color temperature changes that mirror natural daylight progression",
                  detail: "Biologically aligned circadian cues",
                  color: "amber"
                }
              ].map((channel, i) => (
                <div key={i} className="rounded-xl p-5 border border-white/[0.06] bg-white/[0.02] relative">
                  <div className={`w-8 h-8 rounded-lg ${
                    channel.color === 'teal' ? 'bg-teal-500/10' :
                    channel.color === 'purple' ? 'bg-purple-500/10' : 'bg-amber-500/10'
                  } flex items-center justify-center mb-3`}>
                    <channel.icon className={`w-4 h-4 ${
                      channel.color === 'teal' ? 'text-teal-400' :
                      channel.color === 'purple' ? 'text-purple-400' : 'text-amber-400'
                    }`} />
                  </div>
                  <h4 className="text-white font-medium mt-1 mb-2">{channel.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mb-2">{channel.desc}</p>
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider">{channel.detail}</p>
                </div>
              ))}
            </motion.div>

            {/* How They Work Together */}
            <motion.div variants={fadeInUp} className="rounded-2xl border border-purple-500/10 bg-purple-500/[0.03] p-6 sm:p-8">
              <h3 className="text-white font-semibold mb-4">Why Multi-Sensory Works</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                Research on interoception (the ability to sense internal body signals) shows that people with ADHD have reduced
                interoceptive awareness. By engaging multiple sensory channels simultaneously, ChronoWeave creates
                redundant time signals that bypass the single-channel habituation problem.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  "Phone buzzes alone → habituated in 5 days",
                  "Visual timers alone → ignored during hyperfocus",
                  "Multi-sensory layering → sustained awareness over weeks"
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                      i === 2 ? 'bg-purple-400' : 'bg-slate-600'
                    }`} />
                    <p className={`text-sm ${i === 2 ? 'text-purple-300 font-medium' : 'text-slate-500 line-through'}`}>{point}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 08. Final Designs ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="space-y-10"
          >
            <div className="max-w-5xl">
              <SectionLabel number="04" label="Final Designs" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                High-fidelity screens
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                Each screen was designed to make abstract time perception tangible — using color-coded sensory channels,
                data visualization, and empathetic copy.
              </motion.p>
            </div>

            {/* Screens Grid with Annotations */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { Screen: TodaysRhythmScreen, label: "Today's Rhythm", annotation: "Visual time blocks show the day as a feeling, not a schedule" },
                { Screen: LiveNudgeScreen, label: "Live Nudge", annotation: "Active multi-sensory feedback with real-time intensity controls" },
                { Screen: WeeklyInsightsScreen, label: "Weekly Insights", annotation: "Drift patterns reveal when users lose time most often" },
                { Screen: WeeklyInsightsDetailScreen, label: "Drift Calendar", annotation: "Granular view of perception accuracy across the week" },
                { Screen: CalibrateScreen, label: "Calibrate", annotation: "5 quick perception tests establish a personal baseline" },
                { Screen: TimeFeelScreen, label: "Time Feel", annotation: "Qualitative assessment captures subjective time experience" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="group flex flex-col items-center"
                >
                  <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto">
                    <div className="relative bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-[3px] sm:p-1 border-2 sm:border-[3px] border-slate-800 overflow-hidden shadow-2xl mb-4 transition-all duration-300 group-hover:shadow-purple-500/10 group-hover:border-slate-700">
                      <div className="relative overflow-hidden rounded-[2.25rem] sm:rounded-[2.75rem]" style={{ aspectRatio: '9 / 16' }}>
                        <div className="p-4 bg-white/5 backdrop-blur-xl h-full">
                          <item.Screen />
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium text-center">{item.label}</p>
                  <p className="text-slate-600 text-xs text-center mt-1 max-w-[280px]">{item.annotation}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 10. Impact & Outcomes ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
            className="space-y-10"
          >
            <div>
              <SectionLabel number="05" label="Impact & Outcomes" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Hackathon results and validation
              </motion.h2>
            </div>

            {/* Impact Metrics */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { value: 48, suffix: "hrs", label: "Concept to prototype", detail: "FigBuild 2026" },
                { value: 6, suffix: "", label: "High-fidelity screens", detail: "Complete user flow" },
                { value: 3, suffix: "", label: "Sensory modalities", detail: "Haptics + Audio + Light" },
                { value: 5, suffix: "", label: "Calibration tests", detail: "Personalized baseline" }
              ].map((metric, i) => (
                <div key={i} className="rounded-xl p-5 sm:p-6 border border-purple-500/10 bg-purple-500/[0.03] text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    <AnimatedCounter target={metric.value} suffix={metric.suffix} />
                  </div>
                  <p className="text-slate-300 text-sm mb-1">{metric.label}</p>
                  <p className="text-slate-600 text-xs">{metric.detail}</p>
                </div>
              ))}
            </motion.div>

            {/* Systems Thinking: Edge Cases */}
            <motion.div variants={fadeInUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
              <h3 className="text-white font-semibold mb-6">Systems Thinking: Edge Cases We Considered</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: AlertCircle,
                    title: "Sensory Overload Protection",
                    description: "If a user is in a high-stimulus environment (detected via ambient noise), nudge intensity automatically reduces to avoid adding to cognitive load."
                  },
                  {
                    icon: Accessibility,
                    title: "Co-occurring Conditions",
                    description: "Many ADHD users also have anxiety. Nudges avoid urgency cues (no red, no alarm sounds) — using gentle gradients and organic tones instead."
                  },
                  {
                    icon: Clock,
                    title: "Hyperfocus Mode",
                    description: "During detected hyperfocus states, nudge frequency increases gradually rather than interrupting — escalating gently from subtle to noticeable."
                  },
                  {
                    icon: Sparkles,
                    title: "Medication Timing",
                    description: "ADHD medication affects time perception. Users can mark medication times, and the system adjusts nudge sensitivity for the 4-6 hour effectiveness window."
                  }
                ].map((edge, i) => (
                  <div key={i} className="rounded-lg p-4 border border-white/[0.04] bg-white/[0.01]">
                    <div className="flex items-center gap-3 mb-2">
                      <edge.icon className="w-4 h-4 text-purple-400" />
                      <h4 className="text-white text-sm font-medium">{edge.title}</h4>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed">{edge.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="rounded-2xl p-8 sm:p-12 text-center border border-white/[0.06] bg-white/[0.02] relative overflow-hidden"
          >
            {/* Subtle gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.03] via-transparent to-teal-500/[0.03]" />

            <div className="relative z-10">
              <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Explore the Interactive Prototype
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Walk through the full multi-sensory concept — onboarding, calibration, and the ambient clock — in the
                interactive Figma prototype.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://revamp-sauna-76244505.figma.site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-slate-900 rounded-full font-semibold hover:shadow-xl hover:shadow-purple-500/10 hover:scale-105 transition-all duration-300 group text-sm sm:text-base"
                >
                  <Smartphone className="w-5 h-5" />
                  View Interactive Prototype
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                </a>
                <Link
                  to="/"
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 border border-white/10 text-white rounded-full hover:bg-white/[0.03] transition-all duration-300 text-sm sm:text-base"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Portfolio
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTopButton />

      <Footer />
    </div>
  );
}

// ─── Back to Top ───
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => setIsVisible(window.scrollY > 500);
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 p-3 sm:p-4 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-white/15 transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Back to top"
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 rotate-90" aria-hidden="true" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
