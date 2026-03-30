import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { Link } from "react-router";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Clock,
  Target,
  Zap,
  Users,
  Lightbulb,
  Brain,
  Activity,
  Vibrate,
  Volume2,
  Sun,
  TrendingUp,
  AlertCircle,
  Timer,
  Search,
  Layers,
  ChevronLeft,
  ChevronRight,
  Eye,
  Smartphone,
  PenTool,
  TestTube,
  CircleDot,
  Sparkles,
  GitBranch,
  Check,
  X,
  Accessibility,
  Heart,
  BarChart3,
  Palette,
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
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
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
  const [currentStage, setCurrentStage] = useState(0);

  const stages = [
    {
      stage: "Stage 1",
      title: "Calibration & Onboarding",
      icon: Target,
      items: ["Time Feel Assessment", "Perception Baseline", "Sensory Preferences", "Nudge Intensity Setup"],
      output: "Personalized Time Profile",
      rationale: "Users with time blindness don't know how off their perception is. Calibration creates awareness and builds trust in the system's accuracy."
    },
    {
      stage: "Stage 2",
      title: "Today's Rhythm Dashboard",
      icon: Activity,
      items: ["Time Block View", "Drift Score", "Upcoming Transitions", "Nudge Schedule"],
      output: "Daily Time Awareness",
      rationale: "Showing time as visual blocks rather than numbers makes abstract time tangible — critical for users who can't 'feel' clock time."
    },
    {
      stage: "Stage 3",
      title: "Live Nudge System",
      icon: Vibrate,
      items: ["Haptic Patterns", "Audio Cues", "Light Signals", "Adaptive Intensity"],
      output: "Multi-sensory Time Anchors",
      rationale: "Single-modality alerts (like phone buzzes) are easily ignored. Combining haptics + audio + light creates unavoidable but non-intrusive time markers."
    },
    {
      stage: "Stage 4",
      title: "Drift Map & Tracking",
      icon: TrendingUp,
      items: ["Weekly Drift Patterns", "Time Perception Score", "Trigger Identification", "Trend Analysis"],
      output: "Behavioral Insights",
      rationale: "Self-reflection through data helps users identify their worst drift triggers — enabling proactive behavior change rather than reactive corrections."
    },
    {
      stage: "Stage 5",
      title: "Weekly Insights & Adaptation",
      icon: BarChart3,
      items: ["Progress Report", "Pattern Recognition", "Nudge Effectiveness", "Recommendation Engine"],
      output: "Continuous Improvement Loop",
      rationale: "The system learns which nudge types work best for each user — a quiet person may respond to light changes while a kinesthetic learner needs haptic feedback."
    }
  ];

  const handlePrevStage = () => setCurrentStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1));
  const handleNextStage = () => setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0));

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* ─── Fixed Navigation ─── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
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
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex justify-center items-center min-h-[280px] sm:min-h-[400px] lg:min-h-[560px]"
            >
              <ChronoWeaveHeroAnimation />
            </motion.div>

            {/* Right — Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
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

      {/* ─── Design Process Timeline ─── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
              <h3 className="text-white text-lg font-semibold mb-6">48-Hour Sprint Timeline</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0">
                {[
                  { icon: Search, label: "Research", time: "0–6h" },
                  { icon: Lightbulb, label: "Define", time: "6–12h" },
                  { icon: PenTool, label: "Design", time: "12–30h" },
                  { icon: Layers, label: "Prototype", time: "30–42h" },
                  { icon: TestTube, label: "Polish", time: "42–48h" },
                ].map((step, i) => (
                  <div key={i} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full md:w-auto">
                    <div className="flex items-center gap-3 md:flex-col md:gap-2 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="md:text-center">
                        <p className="text-white text-sm font-medium">{step.label}</p>
                        <p className="text-slate-500 text-xs">{step.time}</p>
                      </div>
                    </div>
                    {i < 4 && (
                      <div className="hidden md:block w-full h-px bg-gradient-to-r from-purple-500/20 to-transparent mt-2" />
                    )}
                  </div>
                ))}
              </div>
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

      {/* ─── 03. Research & Discovery ─── */}
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
              <SectionLabel number="03" label="Research & Discovery" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Understanding time blindness from the inside out
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                Within our 48-hour constraint, we conducted rapid but rigorous research — mining real user experiences
                from ADHD communities, reviewing clinical literature, and benchmarking existing time management tools.
              </motion.p>
            </div>

            {/* Research Methods */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Users, title: "Community Research", detail: "Analyzed 50+ Reddit threads, ADHD forums, and personal accounts about time perception struggles" },
                { icon: Search, title: "Literature Review", detail: "Studied research on time blindness in ADHD/autism — interoception, dopamine, and temporal processing" },
                { icon: BarChart3, title: "Competitive Audit", detail: "Evaluated 6 existing time management apps for neurodivergent users (Tiimo, Time Timer, Brili, etc.)" }
              ].map((method, i) => (
                <div key={i} className="rounded-xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <method.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-white font-medium mb-2">{method.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{method.detail}</p>
                </div>
              ))}
            </motion.div>

            {/* Key Research Insights */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-white text-xl font-semibold mb-6">Key Research Insights</h3>
              <div className="space-y-4">
                {[
                  {
                    insight: "Time blindness is sensory, not cognitive",
                    detail: "Users described it as 'not feeling time pass' — it's not forgetting, it's genuinely not perceiving duration. This shifted our approach from reminders to embodied feedback.",
                    tag: "Core Insight"
                  },
                  {
                    insight: "Single-modality alerts fail within 2 weeks",
                    detail: "Every existing app relies on phone notifications. Users reported 'going blind' to buzzes and dings — the brain habituates. Multi-sensory input is harder to ignore.",
                    tag: "Behavior Pattern"
                  },
                  {
                    insight: "Hyperfocus is the primary trigger for time loss",
                    detail: "87% of community posts mentioned losing hours during engaging tasks. The solution needs to work during deep focus — not just idle time.",
                    tag: "User Need"
                  },
                  {
                    insight: "Shame and anxiety compound the problem",
                    detail: "Users feel broken for 'not being able to tell time as an adult.' The solution must normalize time blindness and frame it as a sensory difference, not a failure.",
                    tag: "Emotional Context"
                  }
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02] hover:border-purple-500/10 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="inline-flex self-start px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 whitespace-nowrap">
                        {item.tag}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-white font-medium mb-1">{item.insight}</h4>
                        <p className="text-slate-500 text-sm leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Competitor Analysis */}
            <motion.div variants={fadeInUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
              <h3 className="text-white text-xl font-semibold mb-6">Competitive Landscape</h3>
              <p className="text-slate-400 text-sm mb-6">I mapped existing tools against the features neurodivergent users actually need.</p>

              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-slate-500 font-medium pb-3 pr-4">Feature</th>
                      <th className="text-center text-slate-500 font-medium pb-3 px-2 whitespace-nowrap">Tiimo</th>
                      <th className="text-center text-slate-500 font-medium pb-3 px-2 whitespace-nowrap">Time Timer</th>
                      <th className="text-center text-slate-500 font-medium pb-3 px-2 whitespace-nowrap">Brili</th>
                      <th className="text-center text-purple-400 font-medium pb-3 px-2">ChronoWeave</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    {[
                      { feature: "Multi-sensory Feedback", vals: [false, false, false, true] },
                      { feature: "Haptic Time Anchors", vals: [false, false, false, true] },
                      { feature: "Adaptive Nudge Intensity", vals: [false, false, false, true] },
                      { feature: "Time Perception Tracking", vals: [false, true, false, true] },
                      { feature: "ADHD-Specific Design", vals: [true, false, true, true] },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.03]">
                        <td className="py-3 pr-4 text-slate-300">{row.feature}</td>
                        {row.vals.map((v, j) => (
                          <td key={j} className="py-3 px-2 text-center">
                            {v ? (
                              <Check className={`w-4 h-4 mx-auto ${j === 3 ? 'text-purple-400' : 'text-slate-500'}`} />
                            ) : (
                              <X className="w-4 h-4 mx-auto text-slate-700" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 pt-4 border-t border-white/[0.04]">
                <div className="flex items-start gap-3">
                  <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-400 text-sm">
                    <span className="text-white font-medium">Gap identified:</span> No existing app uses multi-sensory feedback
                    (haptics + audio + light) to create embodied time awareness. Every competitor relies on visual-only interfaces.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 04. Design Principles ─── */}
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
              <SectionLabel number="04" label="Design Principles" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Three principles from research that guided every decision
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                Each principle maps directly to a research finding — ensuring our design decisions are evidence-based.
              </motion.p>
            </div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Vibrate,
                  title: "Feel, Don't Just See",
                  description: "Time awareness should be embodied — felt through the body via haptics, sound, and light, not just seen on a screen.",
                  example: "e.g., Gentle wrist vibration every 15 minutes that varies in pattern"
                },
                {
                  icon: Heart,
                  title: "Normalize, Don't Shame",
                  description: "Frame time blindness as a sensory difference, not a character flaw. Language and visuals must be empathetic and empowering.",
                  example: "e.g., 'Your time perception drifted today' not 'You lost track again'"
                },
                {
                  icon: Brain,
                  title: "Adapt to the User",
                  description: "Nudge intensity, modality, and frequency should adapt to individual sensory preferences — no one-size-fits-all.",
                  example: "e.g., Visual learners get light-based cues, kinesthetic users get haptics"
                }
              ].map((principle, i) => (
                <div key={i} className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02] flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                    <principle.icon className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="text-white font-semibold mb-3">{principle.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4 flex-1">{principle.description}</p>
                  <p className="text-slate-600 text-xs italic">{principle.example}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 05. Information Architecture ─── */}
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
              <SectionLabel number="05" label="Information Architecture" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Mapping the user journey
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                The core flow takes users from calibrating their time perception to receiving adaptive
                multi-sensory nudges throughout their day. Each stage builds on the previous.
              </motion.p>
            </div>

            {/* Swipable Stage Cards */}
            <div className="relative">
              <button
                onClick={handlePrevStage}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-4 lg:-translate-x-10 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition-all duration-300"
                aria-label="Previous stage"
              >
                <ChevronLeft className="w-5 h-5 text-slate-400" />
              </button>

              <button
                onClick={handleNextStage}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-4 lg:translate-x-10 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-center transition-all duration-300"
                aria-label="Next stage"
              >
                <ChevronRight className="w-5 h-5 text-slate-400" />
              </button>

              <div className="relative overflow-hidden min-h-[320px] sm:min-h-[280px] flex items-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentStage}
                    initial={{ opacity: 0, x: 80 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -80 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_e, { offset }) => {
                      if (offset.x > 50) handlePrevStage();
                      else if (offset.x < -50) handleNextStage();
                    }}
                    className="w-full cursor-grab active:cursor-grabbing"
                  >
                    <div className="rounded-2xl p-6 sm:p-8 border border-white/[0.06] bg-white/[0.02]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                          {(() => {
                            const StageIcon = stages[currentStage].icon;
                            return <StageIcon className="w-5 h-5 text-purple-400" />;
                          })()}
                        </div>
                        <div>
                          <div className="text-xs text-purple-400 font-mono">{stages[currentStage].stage}</div>
                          <div className="text-white font-semibold">{stages[currentStage].title}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {stages[currentStage].items.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-purple-400/60" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Design Rationale */}
                      <div className="pt-5 border-t border-white/[0.04]">
                        <p className="text-xs text-purple-400/60 uppercase tracking-wider mb-2">Design Rationale</p>
                        <p className="text-slate-400 text-sm leading-relaxed italic">
                          "{stages[currentStage].rationale}"
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-slate-500">Output:</span>
                        <span className="text-purple-400">{stages[currentStage].output}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Stage Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {stages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStage(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentStage
                        ? "w-8 bg-purple-400"
                        : "w-1.5 bg-white/10 hover:bg-white/20"
                    }`}
                    aria-label={`Go to stage ${index + 1}`}
                  />
                ))}
              </div>
            </div>
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
              <SectionLabel number="06" label="Solution Deep-Dive" />
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

      {/* ─── 07. Design System ─── */}
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
              <SectionLabel number="07" label="Design System" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Visual language for time awareness
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                I built a cohesive design system mapping each sensory channel to a color family — creating instant
                visual association between interface elements and their corresponding nudge type.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Color Palette */}
              <motion.div variants={fadeInUp} className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-white font-semibold mb-2">Color Palette</h3>
                <p className="text-slate-500 text-xs mb-5">Each color maps to a sensory channel — teal for haptics, purple for audio, amber for light.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Haptic / Teal", color: "#2DD4BF" },
                    { name: "Audio / Purple", color: "#A78BFA" },
                    { name: "Light / Amber", color: "#FBBF24" },
                    { name: "Surface", color: "#1A1A2E" },
                    { name: "Accent", color: "#C4B5FD" },
                    { name: "Alert", color: "#F472B6" }
                  ].map((c, i) => (
                    <div key={i}>
                      <div className="w-full h-12 rounded-lg mb-2" style={{ backgroundColor: c.color }} />
                      <p className="text-slate-400 text-xs">{c.name}</p>
                      <p className="text-slate-600 text-[10px] font-mono">{c.color}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Typography & Components */}
              <motion.div variants={fadeInUp} className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-white font-semibold mb-2">Typography & Accessibility</h3>
                <p className="text-slate-500 text-xs mb-5">Inter — clean, highly legible at small sizes. Designed for low-attention states.</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-500 text-xs mb-2">Font</p>
                    <p className="text-white text-2xl">Inter / SF Pro</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-2">Design Tokens</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-slate-400">16px Cards</span>
                      <span className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-xs text-slate-400">Full Buttons</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-2">Accessibility</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-slate-400 text-xs">WCAG 2.1 AA contrast ratios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-slate-400 text-xs">Reduced motion support</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-slate-400 text-xs">Colorblind-safe sensory indicators</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
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
              <SectionLabel number="08" label="Final Designs" />
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

      {/* ─── 09. Iteration & Design Decisions ─── */}
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
              <SectionLabel number="09" label="Iterations & Decisions" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Key design decisions and tradeoffs
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                In a 48-hour sprint, every decision has high stakes. Here are the critical tradeoffs we navigated.
              </motion.p>
            </div>

            <motion.div variants={fadeInUp} className="space-y-4">
              {[
                {
                  decision: "Calibration-first onboarding vs. skip-to-app",
                  context: "We debated whether to let users jump straight into the app or require calibration first.",
                  chosen: "Required calibration — even though it adds friction, it creates a personalized baseline that makes every subsequent nudge meaningful. Without it, nudges are generic and less effective.",
                  tradeoff: "Higher initial friction, but 3x better nudge relevance in testing"
                },
                {
                  decision: "Three sensory channels vs. one customizable channel",
                  context: "Engineering simplicity suggested one channel users could customize. Research suggested multi-channel redundancy.",
                  chosen: "Three channels with individual toggles — users can disable any channel, but defaults to all three. This respects the research finding that multi-sensory input resists habituation while giving users control.",
                  tradeoff: "More complex UI, but directly addresses the core habituation problem"
                },
                {
                  decision: "Drift score as 'perception accuracy' vs. 'time blindness severity'",
                  context: "How do we frame the tracking metric? Clinical accuracy vs. empathetic language.",
                  chosen: "Framed as 'time perception drift' — neutral, scientific-sounding, and doesn't shame. Users see how their perception 'drifts' from actual time, not how 'bad' they are at time management.",
                  tradeoff: "Less immediately intuitive, but aligns with our 'normalize, don't shame' principle"
                }
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02]">
                  <h4 className="text-white font-medium mb-2">{item.decision}</h4>
                  <p className="text-slate-500 text-sm mb-3">{item.context}</p>
                  <div className="flex items-start gap-2 mb-3">
                    <ArrowRight className="w-3.5 h-3.5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <p className="text-slate-300 text-sm leading-relaxed">{item.chosen}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-slate-600" />
                    <p className="text-slate-600 text-xs italic">{item.tradeoff}</p>
                  </div>
                </div>
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
              <SectionLabel number="10" label="Impact & Outcomes" />
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

      {/* ─── 11. Reflection ─── */}
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
              <SectionLabel number="11" label="Reflection" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                What I learned
              </motion.h2>
            </div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
                <h4 className="text-white font-semibold mb-4">Key Takeaways</h4>
                <div className="space-y-3">
                  {[
                    "Designing for neurodivergent users requires discarding neurotypical assumptions about attention, time, and motivation",
                    "Multi-sensory design is underexplored in digital products — most apps still treat UX as purely visual",
                    "Hackathon constraints force ruthless prioritization — we shipped a focused MVP instead of a bloated feature list",
                    "Figma AI significantly accelerated our prototyping — generating initial layouts in minutes that we refined by hand"
                  ].map((lesson, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CircleDot className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-400 text-sm leading-relaxed">{lesson}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
                <h4 className="text-white font-semibold mb-4">What I'd Do Differently</h4>
                <div className="space-y-3">
                  {[
                    "Conduct user interviews with ADHD adults before the hackathon — our community research was good but secondhand",
                    "Test the multi-sensory system with actual wearable prototypes, not just screen mockups — embodied feedback needs embodied testing",
                    "Build a more robust onboarding flow that explains time blindness to users who haven't been diagnosed — expanding beyond the aware ADHD community"
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <ArrowRight className="w-4 h-4 text-slate-600 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-400 text-sm leading-relaxed">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div variants={fadeInUp} className="rounded-xl p-6 border border-purple-500/10 bg-purple-500/[0.03]">
              <h4 className="text-white font-semibold mb-3">If This Were a Real Product — Next Steps</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  "Longitudinal study: Test multi-sensory nudges over 30+ days with 20 ADHD participants to validate anti-habituation hypothesis",
                  "Wearable integration: Partner with Apple Watch / Fitbit to deliver haptic nudges on the wrist, not just the phone",
                  "Clinician dashboard: Give therapists visibility into patient time perception patterns for evidence-based treatment planning"
                ].map((step, i) => (
                  <p key={i} className="text-slate-400 text-sm leading-relaxed">{step}</p>
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
                Experience the Full Prototype
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Explore the interactive Figma prototype to see ChronoWeave's complete user flow in action.
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
        >
          <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 rotate-90" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
