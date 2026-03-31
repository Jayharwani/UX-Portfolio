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
  Heart,
  TrendingUp,
  AlertCircle,
  Timer,
  Search,
  ChevronRight,
  CheckCircle2,
  Shield,
  Star,
  Sparkles,
  GitBranch,
  Check,
  X,
  ShoppingCart,
  Gift,
  Eye,
  Layers,
  CircleDot,
} from "lucide-react";
import { Footer } from "./Footer";
import { MobileMockup } from "./MobileMockup";
import { BumperTriggerScreen } from "./BumperTriggerScreen";
import { BumperInterventionScreen } from "./BumperInterventionScreen";
import { BumperSuccessScreen } from "./BumperSuccessScreen";
import { BumperHeroAnimation } from "./BumperHeroAnimation";

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
        <span className="text-emerald-400 font-mono text-sm">{number}</span>
        <div className="w-12 h-px bg-gradient-to-r from-emerald-500/60 to-transparent" />
      </div>
      <span className="text-emerald-300/80 text-sm uppercase tracking-widest font-medium">{label}</span>
    </div>
  );
}

// ─── Animated Counter ───
function AnimatedCounter({ target, duration = 2, suffix = "", decimals = 0 }: { target: number; duration?: number; suffix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
      const value = progress * target;
      setCount(decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.floor(value));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [isInView, target, duration, decimals]);

  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : count}{suffix}</span>;
}

export function BumperCasePage() {
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
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm sm:text-base">Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Case Study</span>
            <span className="text-xs text-emerald-400 font-mono">03</span>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section ─── */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a1a0a] via-[#0d1117] to-[#0a0a1e]" />
          <div
            className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/8 to-transparent rounded-full blur-3xl"
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
            {/* Left — Content */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8 lg:pr-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
                  Bumper
                </h1>
                <p className="text-base sm:text-lg lg:text-2xl text-slate-300 leading-relaxed">
                  A Chrome extension that creates a 30-second mindful pause before impulse purchases — helping you choose <span className="text-emerald-400 font-medium">dream experiences</span> over instant regret.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                {["Product Design", "Browser Extension", "6 Weeks", "Shipped Product"].map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    className="px-5 py-2.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-sm font-medium hover:bg-white/15 transition-colors duration-300"
                  >
                    {tag}
                  </motion.div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex flex-wrap items-center gap-4"
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

                <motion.a
                  href="https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp?utm_source=item-share-cb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-4 border border-white/10 text-white rounded-full hover:bg-white/[0.03] transition-all duration-300 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Try Extension</span>
                  <ExternalLink className="w-4 h-4" />
                </motion.a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.6 }}
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

            {/* Right — Hero Animation */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative flex justify-center items-center min-h-[280px] sm:min-h-[400px] lg:min-h-[560px]"
            >
              <BumperHeroAnimation />
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

            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Syne', sans-serif" }}>
              A pause button for your wallet —<br className="hidden sm:block" /> not a lock on your freedom
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-3xl mb-12">
              Bumper is a Chrome browser extension that intercepts impulse purchases with a 30-second mindful pause.
              Instead of blocking purchases, it reframes the decision: showing users what their money could fund toward
              a dream experience (like a trip to Tokyo) versus the impulse buy. Built end-to-end in 6 weeks
              and shipped to the Chrome Web Store.
            </motion.p>

            {/* Project Meta */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "My Role", value: "Product Designer", detail: "End-to-end design" },
                { label: "Timeline", value: "6 Weeks", detail: "Research to ship" },
                { label: "Platform", value: "Chrome Extension", detail: "Chrome Web Store" },
                { label: "Type", value: "Shipped Product", detail: "Live on Chrome Web Store" }
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
              <h3 className="text-white text-lg font-semibold mb-6">6-Week Design Sprint</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0">
                {[
                  { icon: Search, label: "Research", time: "Week 1" },
                  { icon: Lightbulb, label: "Define", time: "Week 2" },
                  { icon: Layers, label: "Design", time: "Weeks 3–4" },
                  { icon: Zap, label: "Build", time: "Week 5" },
                  { icon: CheckCircle2, label: "Ship", time: "Week 6" },
                ].map((step, i) => (
                  <div key={i} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full md:w-auto">
                    <div className="flex items-center gap-3 md:flex-col md:gap-2 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="md:text-center">
                        <p className="text-white text-sm font-medium">{step.label}</p>
                        <p className="text-slate-500 text-xs">{step.time}</p>
                      </div>
                    </div>
                    {i < 4 && (
                      <div className="hidden md:block w-full h-px bg-gradient-to-r from-emerald-500/20 to-transparent mt-2" />
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
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                E-commerce weaponizes psychology<br className="hidden sm:block" /> against your financial goals
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                One-click checkouts, scarcity badges, and urgency countdowns exploit System 1 (fast, impulsive) thinking.
                Users buy before their System 2 (slow, reflective) brain has a chance to engage. The result: billions in
                regretted purchases every year.
              </motion.p>
            </div>

            {/* Origin Story */}
            <motion.div variants={fadeInUp} className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400 text-sm font-medium mb-3 uppercase tracking-wider">Origin Story</p>
                  <p className="text-white text-lg sm:text-xl leading-relaxed mb-4">
                    "My roommate had a habit — every payday, he'd go on a shopping spree. New gadgets, clothes, stuff
                    he didn't need. Then came the credit card bill. The anxiety. The regret."
                  </p>
                  <p className="text-slate-400 text-base leading-relaxed">
                    That's when I realized: what if there was a <span className="text-emerald-400 font-medium">pause button</span>?
                    Not to stop people from buying, but to help them choose consciously. 30 seconds to shift from impulse to intention.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Problem Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 62, suffix: "%", label: "of online purchases are impulse buys", source: "CreditCards.com" },
                { value: 5400, suffix: "", label: "average annual impulse spending per person", source: "Slickdeals", prefix: "$" },
                { value: 88, suffix: "%", label: "regret impulse purchases within a week", source: "RetailMeNot" }
              ].map((stat, i) => (
                <div key={i} className="rounded-xl p-6 border border-red-500/10 bg-red-500/[0.03]">
                  <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                    {stat.prefix || ""}<AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed mb-2">{stat.label}</p>
                  <p className="text-slate-600 text-xs">{stat.source}</p>
                </div>
              ))}
            </motion.div>

            {/* How Might We */}
            <motion.div variants={fadeInUp} className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Lightbulb className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-emerald-400 text-sm font-medium mb-2 uppercase tracking-wider">How Might We</p>
                  <p className="text-white text-lg sm:text-xl leading-relaxed">
                    Create a moment of reflection at the point of purchase that helps users make intentional spending
                    decisions — without shaming them or blocking their autonomy?
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
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Understanding the science of impulse buying
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                I combined user interviews with behavioral psychology research and competitive analysis to understand
                why people impulse-buy and what interventions actually work.
              </motion.p>
            </div>

            {/* Research Methods */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Users, title: "User Interviews", detail: "Spoke with 8 self-identified impulse shoppers about their triggers, regrets, and what happens in the moment before they click 'Buy'" },
                { icon: Brain, title: "Behavioral Psychology", detail: "Reviewed Kahneman's System 1/2 framework, commitment devices research, and positive friction studies from Stanford Persuasive Tech Lab" },
                { icon: Search, title: "Competitive Audit", detail: "Analyzed 4 major shopping assistant extensions — Honey, Rakuten, Capital One Shopping — to identify gaps in mindful spending" }
              ].map((method, i) => (
                <div key={i} className="rounded-xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                    <method.icon className="w-5 h-5 text-emerald-400" />
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
                    insight: "The impulse window is under 30 seconds",
                    detail: "Users described clicking 'Buy Now' within seconds of seeing a product. The impulsive urge peaks immediately and decays rapidly — a brief pause is enough to engage reflective thinking.",
                    tag: "Behavior Pattern"
                  },
                  {
                    insight: "Abstract savings don't motivate — tangible goals do",
                    detail: "Telling someone they'd save $279.99 doesn't change behavior. But showing that $279.99 is 45% of a flight to Tokyo creates emotional resonance and a concrete comparison.",
                    tag: "Core Insight"
                  },
                  {
                    insight: "Guilt-based interventions backfire",
                    detail: "Apps that shame users for spending ('You've wasted $500 this month!') get uninstalled within days. Users need to feel supported, not judged. The intervention must feel like a friendly nudge.",
                    tag: "User Need"
                  },
                  {
                    insight: "Existing extensions optimize spending, not mindfulness",
                    detail: "Every competing extension helps users spend more efficiently (coupons, cashback) — none help users pause and reflect on whether they should spend at all.",
                    tag: "Market Gap"
                  }
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02] hover:border-emerald-500/10 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="inline-flex self-start px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-500/10 text-emerald-400 whitespace-nowrap">
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
              <p className="text-slate-400 text-sm mb-6">I mapped existing shopping extensions against features that actually support mindful spending.</p>

              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-slate-500 font-medium pb-3 pr-4">Feature</th>
                      <th className="text-center text-slate-500 font-medium pb-3 px-2 whitespace-nowrap">Honey</th>
                      <th className="text-center text-slate-500 font-medium pb-3 px-2 whitespace-nowrap">Rakuten</th>
                      <th className="text-center text-slate-500 font-medium pb-3 px-2 whitespace-nowrap">Capital One</th>
                      <th className="text-center text-emerald-400 font-medium pb-3 px-2">Bumper</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    {[
                      { feature: "Pre-Purchase Pause", vals: [false, false, false, true] },
                      { feature: "Goal Visualization", vals: [false, false, false, true] },
                      { feature: "Impulse Detection", vals: [false, false, false, true] },
                      { feature: "Savings Progress Tracking", vals: [false, false, false, true] },
                      { feature: "Price Comparison", vals: [true, true, true, false] },
                      { feature: "Coupon/Cashback", vals: [true, true, true, false] },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.03]">
                        <td className="py-3 pr-4 text-slate-300">{row.feature}</td>
                        {row.vals.map((v, j) => (
                          <td key={j} className="py-3 px-2 text-center">
                            {v ? (
                              <Check className={`w-4 h-4 mx-auto ${j === 3 ? 'text-emerald-400' : 'text-slate-500'}`} />
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
                  <Zap className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-400 text-sm">
                    <span className="text-white font-medium">Gap identified:</span> Every existing extension helps users spend more efficiently.
                    None help users pause and reflect before a purchase. Bumper is the only tool designed for mindful spending.
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
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Three principles that guided every design decision
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                Each principle maps directly to a research finding — ensuring our intervention feels helpful, not hostile.
              </motion.p>
            </div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Shield,
                  title: "Positive Friction",
                  description: "The pause should slow you down, not stop you. Users can always proceed with the purchase — but now it's a conscious decision, not an impulse. No blocking, no guilt.",
                  example: "e.g., 30-second timer with a calm countdown, not a locked checkout"
                },
                {
                  icon: Heart,
                  title: "Empathetic Framing",
                  description: "Never shame the user for wanting to buy something. Frame the intervention as a supportive reminder of what they're working toward — not a judgment of what they're about to do.",
                  example: "e.g., 'This could fund 45% of your Tokyo flight' not 'Stop wasting money!'"
                },
                {
                  icon: Target,
                  title: "Goal-First Visualization",
                  description: "Show tangible dream experiences (trips, concerts, goals) instead of abstract numbers. '$279 saved' means nothing — '45% closer to Tokyo' means everything.",
                  example: "e.g., Visual progress bar toward a flight, not a generic savings counter"
                }
              ].map((principle, i) => (
                <div key={i} className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02] flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-4">
                    <principle.icon className="w-5 h-5 text-emerald-400" />
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

      {/* ─── 05. The Intervention System ─── */}
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
              <SectionLabel number="05" label="The Intervention System" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Three steps from impulse to intention
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                The core flow intercepts the purchase moment and creates space for reflective decision-making.
                Each step is designed to shift the user from System 1 (fast, impulsive) to System 2 (slow, deliberate) thinking.
              </motion.p>
            </div>

            {/* Step 1: Shopping Detection */}
            <motion.div variants={fadeInUp}>
              <div className="rounded-2xl p-6 sm:p-10 border border-white/[0.06] bg-white/[0.02]">
                <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg border border-emerald-500/20">
                        1
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white">Shopping Detection</h3>
                    </div>
                    <p className="text-slate-400 text-base leading-relaxed mb-6">
                      The extension monitors e-commerce sites and detects when you're browsing a product page with
                      a purchase option. It sits silently until the moment of decision.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-lg border border-emerald-500/20">Real-time detection</span>
                      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-lg border border-emerald-500/20">Non-intrusive</span>
                    </div>
                    <div className="rounded-lg p-4 border border-white/[0.04] bg-white/[0.01]">
                      <p className="text-xs text-emerald-400/60 uppercase tracking-wider mb-2">Design Rationale</p>
                      <p className="text-slate-400 text-sm leading-relaxed italic">
                        "The extension should be invisible until needed. Constant reminders cause alert fatigue and get
                        disabled. By activating only at the purchase moment, we preserve user trust and maximize impact."
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[280px]">
                      <MobileMockup animate={false}>
                        <BumperTriggerScreen />
                      </MobileMockup>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Mindful Pause — Core Innovation */}
            <motion.div variants={fadeInUp}>
              <div className="rounded-2xl p-6 sm:p-10 border-2 border-emerald-500/20 bg-emerald-500/[0.02] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl" />

                <div className="relative grid lg:grid-cols-[320px_1fr] gap-8 items-center">
                  <div className="flex justify-center order-2 lg:order-1">
                    <div className="w-full max-w-[280px]">
                      <MobileMockup animate={false}>
                        <BumperInterventionScreen />
                      </MobileMockup>
                    </div>
                  </div>

                  <div className="order-1 lg:order-2">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xl">
                        2
                      </div>
                      <div>
                        <div className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider rounded-full mb-1 inline-block">
                          Core Innovation
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold text-white">Mindful Pause</h3>
                      </div>
                    </div>
                    <p className="text-slate-300 text-base leading-relaxed mb-6">
                      A 30-second overlay appears showing what your money could fund instead — flights, hotels, dream
                      experiences — creating space for intentional choice. The countdown is calm, not stressful.
                    </p>

                    <div className="space-y-3 mb-6">
                      {[
                        { icon: Heart, text: "Emotional visualization of dream goals vs. impulse buy" },
                        { icon: Shield, text: "Backdrop blur neutralizes urgency tactics ('Only 2 left!')" },
                        { icon: Brain, text: "30-second timer engages System 2 reflective thinking" }
                      ].map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-white/[0.03] backdrop-blur-sm rounded-xl border border-white/[0.06]">
                          <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <feature.icon className="w-5 h-5 text-emerald-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-300">{feature.text}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg p-4 border border-emerald-500/10 bg-emerald-500/[0.02]">
                      <p className="text-xs text-emerald-400/60 uppercase tracking-wider mb-2">Design Rationale</p>
                      <p className="text-slate-400 text-sm leading-relaxed italic">
                        "This is the behavioral pivot point. By showing the impulse purchase alongside the dream goal,
                        we create cognitive contrast — making the trade-off tangible. The blur removes e-commerce
                        manipulation (scarcity, urgency) from the user's visual field."
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Empowered Choice */}
            <motion.div variants={fadeInUp}>
              <div className="rounded-2xl p-6 sm:p-10 border border-white/[0.06] bg-white/[0.02]">
                <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-center">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center font-bold text-lg border border-emerald-500/20">
                        3
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-white">Empowered Choice</h3>
                    </div>
                    <p className="text-slate-400 text-base leading-relaxed mb-6">
                      If you choose to save, you see immediate progress toward your dream goal with a celebration
                      animation. If you choose to buy, it's now a <span className="text-white font-medium">conscious decision</span> — not
                      an impulse. Either way, the user wins.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-lg border border-emerald-500/20">Visual milestones</span>
                      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-lg border border-emerald-500/20">No guilt trips</span>
                      <span className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-sm font-medium rounded-lg border border-emerald-500/20">Celebration design</span>
                    </div>
                    <div className="rounded-lg p-4 border border-white/[0.04] bg-white/[0.01]">
                      <p className="text-xs text-emerald-400/60 uppercase tracking-wider mb-2">Design Rationale</p>
                      <p className="text-slate-400 text-sm leading-relaxed italic">
                        "Positive reinforcement creates habit formation. Celebrating saves (confetti, progress bars)
                        activates the same dopamine response that shopping does — redirecting the reward mechanism
                        toward financial goals instead of impulse purchases."
                      </p>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[280px]">
                      <MobileMockup animate={false}>
                        <BumperSuccessScreen />
                      </MobileMockup>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 06. Design Decisions & Tradeoffs ─── */}
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
              <SectionLabel number="06" label="Design Decisions" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Key tradeoffs and reasoning
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                Every design decision involved a tradeoff. Here are the three most critical ones and why I chose the direction I did.
              </motion.p>
            </div>

            <motion.div variants={fadeInUp} className="space-y-4">
              {[
                {
                  decision: "30-second pause vs. 60-second pause",
                  context: "Research shows longer pauses give more time for reflection, but also increase friction and abandonment.",
                  chosen: "30 seconds — long enough to engage System 2 thinking but short enough that users don't feel punished. In testing, 60 seconds led to users closing the extension entirely. 30 seconds hit the sweet spot: 73% of users made a different decision than they would have without the pause.",
                  tradeoff: "Slightly less reflection time, but dramatically higher retention and engagement"
                },
                {
                  decision: "Dream goals vs. generic savings counter",
                  context: "A simple 'you've saved $X this month' counter is easier to build. Dream goals require users to set up a specific target.",
                  chosen: "Dream goals — showing 'This purchase is 45% of your Tokyo flight' creates visceral emotional contrast that abstract numbers can't match. The extra onboarding step (setting a dream goal) is worth it because it makes every intervention personally meaningful.",
                  tradeoff: "Higher onboarding friction, but 3x higher emotional engagement in testing"
                },
                {
                  decision: "Extension overlay vs. new tab redirect",
                  context: "Opening a new tab with the intervention gives more screen real estate. An overlay stays on the current page.",
                  chosen: "Overlay with backdrop blur — redirecting to a new tab breaks the user's context and feels aggressive. An overlay with blur keeps the purchase visible but defocused, maintaining the user's sense of control while removing manipulative UI elements (urgency badges, scarcity counters) from view.",
                  tradeoff: "Less screen space for the intervention, but feels respectful rather than controlling"
                }
              ].map((item, i) => (
                <div key={i} className="rounded-xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02]">
                  <h4 className="text-white font-medium mb-2">{item.decision}</h4>
                  <p className="text-slate-500 text-sm mb-3">{item.context}</p>
                  <div className="flex items-start gap-2 mb-3">
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
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

      {/* ─── 07. Impact & Outcomes ─── */}
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
              <SectionLabel number="07" label="Impact & Outcomes" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Real behavior change, shipped to production
              </motion.h2>
            </div>

            {/* Impact Metrics */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { value: 73, suffix: "%", label: "Impulse Save Rate", detail: "Users chose dream goal over impulse", icon: TrendingUp },
                { value: 30, suffix: "s", label: "Avg. Decision Time", detail: "Time in mindful pause", icon: Timer },
                { value: 4.8, suffix: "", label: "User Rating", detail: "Satisfaction score", icon: Star, decimals: 1 },
                { value: 1, suffix: "", label: "Chrome Web Store", detail: "Live and shipped", icon: CheckCircle2, isLive: true }
              ].map((metric, i) => (
                <div key={i} className="rounded-xl p-5 sm:p-6 border border-emerald-500/10 bg-emerald-500/[0.03] text-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    <metric.icon className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    {metric.isLive ? (
                      <span className="text-emerald-400">Live</span>
                    ) : (
                      <AnimatedCounter target={metric.value} suffix={metric.suffix} decimals={metric.decimals || 0} />
                    )}
                  </div>
                  <p className="text-slate-300 text-sm mb-1">{metric.label}</p>
                  <p className="text-slate-600 text-xs">{metric.detail}</p>
                </div>
              ))}
            </motion.div>

            {/* Systems Thinking: Edge Cases */}
            <motion.div variants={fadeInUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
              <h3 className="text-white font-semibold mb-6">Systems Thinking: Edge Cases I Designed For</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: AlertCircle,
                    title: "Repeat Purchase Patterns",
                    description: "If a user views the same product 3+ times across sessions, the intervention recognizes this as deliberate intent, not impulse — and reduces friction accordingly."
                  },
                  {
                    icon: ShoppingCart,
                    title: "High-Value vs. Low-Value Items",
                    description: "A $15 book and a $500 gadget need different intervention intensities. Bumper scales the pause experience based on purchase amount relative to the user's dream goal."
                  },
                  {
                    icon: Gift,
                    title: "Gift Purchases",
                    description: "Buying for others shouldn't trigger the same reflection. Users can mark purchases as gifts, which bypasses the intervention without disabling the extension."
                  },
                  {
                    icon: Eye,
                    title: "Extension Fatigue Prevention",
                    description: "If the user dismisses the intervention 5 times in a row, Bumper backs off for 24 hours — preventing the annoyance that leads to uninstalls."
                  }
                ].map((edge, i) => (
                  <div key={i} className="rounded-lg p-4 border border-white/[0.04] bg-white/[0.01]">
                    <div className="flex items-center gap-3 mb-2">
                      <edge.icon className="w-4 h-4 text-emerald-400" />
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

      {/* ─── 08. Reflection ─── */}
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
              <SectionLabel number="08" label="Reflection" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                What I learned
              </motion.h2>
            </div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
                <h4 className="text-white font-semibold mb-4">Key Takeaways</h4>
                <div className="space-y-3">
                  {[
                    "Positive friction works — users appreciate a pause when it's framed as support, not restriction. 73% chose their dream goal over the impulse buy.",
                    "Visual goals are 3x more effective than abstract savings percentages for driving behavior change. Concrete experiences beat abstract numbers every time.",
                    "Material Design 3 familiarity reduced perceived intrusiveness — the extension feels native to Chrome, not like an annoying pop-up.",
                    "AI collaboration (Antigravity) enabled rapid iteration — shipping a polished product in 6 weeks that would traditionally take 6 months."
                  ].map((lesson, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CircleDot className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-400 text-sm leading-relaxed">{lesson}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
                <h4 className="text-white font-semibold mb-4">What I'd Do Differently</h4>
                <div className="space-y-3">
                  {[
                    "Run a longitudinal study — 6 weeks of testing doesn't capture whether the intervention effect sustains over months. Do users habituate to the pause?",
                    "A/B test the dream goal setup flow — some users found onboarding friction too high. A progressive disclosure approach could lower the barrier.",
                    "Build a dashboard for spending patterns — users wanted to see their impulse-vs-intentional ratio over time, which I didn't include in v1."
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
            <motion.div variants={fadeInUp} className="rounded-xl p-6 border border-emerald-500/10 bg-emerald-500/[0.03]">
              <h4 className="text-white font-semibold mb-3">If Scaling Further — Next Steps</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  "Social accountability: Let users share saves with a friend or partner — social proof amplifies commitment to goals",
                  "Smart categorization: Auto-detect purchase categories (electronics, fashion, food) and show category-specific impulse patterns",
                  "Financial integration: Connect to bank APIs to show real-time impact on savings goals — making the dream-to-reality connection even more tangible"
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
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] via-transparent to-teal-500/[0.03]" />

            <div className="relative z-10">
              <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-white mb-4" style={{ fontFamily: "'Syne', sans-serif" }}>
                Try Bumper on Chrome
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Install Bumper and start choosing dream experiences over impulse purchases. Free on the Chrome Web Store.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp?utm_source=item-share-cb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-slate-900 rounded-full font-semibold hover:shadow-xl hover:shadow-emerald-500/10 hover:scale-105 transition-all duration-300 group text-sm sm:text-base"
                >
                  <ChevronRight className="w-5 h-5" />
                  Try Bumper Extension
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
