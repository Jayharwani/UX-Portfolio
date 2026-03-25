import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { ArrowLeft, Sparkles, Brain, Target, Zap, TrendingUp, Heart, Eye, ChevronRight, CheckCircle2, Shield, Timer, Star, Award, Compass } from "lucide-react";
import { Link } from "react-router";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileMockup } from "./MobileMockup";
import { BumperTriggerScreen } from "./BumperTriggerScreen";
import { BumperInterventionScreen } from "./BumperInterventionScreen";
import { BumperSuccessScreen } from "./BumperSuccessScreen";
import { BumperHeroAnimation } from "./BumperHeroAnimation";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
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
    transition: {
      staggerChildren: 0.12
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

export function BumperCasePage() {
  const approachRef = useRef(null);
  const solutionRef = useRef(null);
  const impactRef = useRef(null);
  
  const isApproachInView = useInView(approachRef, { once: true, margin: "-100px" });
  const isSolutionInView = useInView(solutionRef, { once: true, margin: "-100px" });
  const isImpactInView = useInView(impactRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-[#F2EFE9]">
      <Header />
      
      {/* Hero Section - Modern Asymmetric Layout */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-400/20 to-purple-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-400/15 to-teal-400/15 rounded-full blur-3xl" />
        
        <div className="relative container mx-auto max-w-7xl">
          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full transition-all shadow-sm hover:shadow-md group"
            >
              <ArrowLeft className="w-4 h-4 text-slate-700 group-hover:-translate-x-0.5 transition-transform" strokeWidth={2} />
              <span className="text-sm font-medium text-slate-700">Back to work</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center">
            {/* Left: Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {/* Category Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-full mb-6">
                <Sparkles className="w-4 h-4 text-indigo-600" strokeWidth={2} />
                <span className="text-sm font-semibold text-indigo-700">Browser Extension · Behavioral Design</span>
              </div>

              {/* Title */}
              <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-slate-900 mb-6 tracking-tight">
                Bumper
              </h1>

              {/* Subtitle */}
              <p className="text-xl sm:text-2xl text-slate-700 leading-relaxed mb-8 max-w-2xl">
                A mindful spending companion that helps you choose <span className="font-semibold text-slate-900">dream experiences</span> over impulse purchases
              </p>

              {/* Stats Row */}
              <div className="flex flex-wrap gap-8 mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Role</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Product Designer</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Timeline</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">6 Weeks</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Platform</p>
                  </div>
                  <p className="text-lg font-semibold text-slate-900">Chrome</p>
                </div>
              </div>

              {/* CTA Button */}
              <motion.a
                href="https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp?utm_source=item-share-cb" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-semibold">Try the Extension</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.5} />
              </motion.a>
            </motion.div>

            {/* Right: Feature Preview */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="relative"
            >
              <div className="relative pt-16">
                {/* Animated Hero Preview */}
                <BumperHeroAnimation />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Challenge Section - Premium Card */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          {/* Origin Story - Featured Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <div className="relative p-12 rounded-[2rem] bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 shadow-xl border border-orange-200 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl" />
              
              <div className="relative">
                {/* Label */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 text-sm font-bold uppercase tracking-wider rounded-full mb-6">
                  <Sparkles className="w-4 h-4" strokeWidth={2.5} />
                  Origin Story
                </div>

                {/* Quote Mark */}
                <div className="text-8xl text-orange-300 font-serif leading-none mb-4">"</div>

                {/* Story */}
                <div className="max-w-4xl">
                  <p className="text-2xl sm:text-3xl font-medium text-slate-800 leading-relaxed mb-8">
                    My roommate had a habit—every time his salary got credited, he'd go on an online shopping spree. New gadgets, clothes, stuff he didn't really need. 
                  </p>
                  <p className="text-2xl sm:text-3xl font-medium text-slate-800 leading-relaxed mb-8">
                    Then came the credit card bill. The anxiety. The regret. <span className="text-orange-600 font-semibold">"How will I pay for all this?"</span>
                  </p>
                  <p className="text-xl text-slate-700 leading-relaxed mb-10">
                    That's when I realized: what if there was a pause button? A moment to think before clicking "Buy Now." Not to stop people from buying, but to help them choose consciously.
                  </p>

                  {/* Author Attribution */}
                  <div className="flex items-center gap-4 pt-6 border-t border-orange-200">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <Brain className="w-6 h-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">The Insight</p>
                      <p className="text-sm text-slate-600">30 seconds can change a purchase from impulse to intention</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* The Challenge Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative p-12 rounded-[2rem] bg-white shadow-xl border border-slate-200 overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-red-500/10 to-orange-500/10 rounded-full blur-3xl" />
              
              <div className="relative grid lg:grid-cols-[auto_1fr] gap-8 items-start">
                {/* Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Target className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>

                <div>
                  {/* Label */}
                  <div className="inline-block px-4 py-2 bg-red-100 text-red-700 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
                    The Challenge
                  </div>

                  {/* Title */}
                  <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                    E-commerce weaponizes psychology against your goals
                  </h2>

                  {/* Description */}
                  <p className="text-xl text-slate-600 leading-relaxed mb-8 max-w-3xl">
                    Platforms use scarcity tactics, one-click checkouts, and urgency triggers to exploit System 1 thinking—making you buy before you can reflect on what truly matters.
                  </p>

                  {/* Pain Points Grid */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { icon: Timer, label: "Urgency Tricks", text: "Only 2 left!" },
                      { icon: Zap, label: "Frictionless Buy", text: "One-click checkout" },
                      { icon: Eye, label: "Social Proof", text: "2,847 reviews" }
                    ].map((item, idx) => (
                      <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <item.icon className="w-5 h-5 text-slate-400 mb-2" strokeWidth={2} />
                        <p className="text-sm font-semibold text-slate-900 mb-1">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solution Approach - 3-Step Visual */}
      <section ref={approachRef} className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isApproachInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-indigo-100 text-indigo-700 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              My Approach
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              Positive friction at the right moment
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A 30-second pause that reframes purchasing as choosing between instant gratification and meaningful experiences
            </p>
          </motion.div>

          {/* Journey Flow */}
          <motion.div
            initial="hidden"
            animate={isApproachInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="space-y-6"
          >
            {/* Step 1: Trigger */}
            <motion.div variants={fadeInUp}>
              <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-center p-10 rounded-[2rem] bg-gradient-to-br from-blue-50 to-indigo-50 border border-indigo-200 shadow-lg">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                      1
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">Shopping Detection</h3>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    Extension monitors e-commerce sites and detects when you're about to make a purchase
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-white/80 text-indigo-700 text-sm font-semibold rounded-lg border border-indigo-200">Real-time detection</span>
                    <span className="px-3 py-1.5 bg-white/80 text-indigo-700 text-sm font-semibold rounded-lg border border-indigo-200">Non-intrusive</span>
                  </div>
                </div>
                <div className="relative">
                  <MobileMockup animate={false}>
                    <BumperTriggerScreen />
                  </MobileMockup>
                  {/* Animated cursor */}
                  <motion.div
                    className="absolute pointer-events-none text-3xl"
                    style={{ bottom: '35%', right: '40%' }}
                    animate={{ scale: [1, 0.9, 1], y: [0, 3, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 0.5 }}
                  >
                    👆
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Step 2: Intervention - Featured */}
            <motion.div variants={fadeInUp}>
              <div className="grid lg:grid-cols-[400px_1fr] gap-8 items-center p-12 rounded-[2rem] bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 border-2 border-purple-300 shadow-2xl relative overflow-hidden">
                {/* Glow */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
                
                <div className="relative order-2 lg:order-1">
                  <MobileMockup animate={false}>
                    <BumperInterventionScreen />
                  </MobileMockup>
                </div>
                
                <div className="relative order-1 lg:order-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-xl">
                      2
                    </div>
                    <div>
                      <div className="px-3 py-1 bg-purple-200 text-purple-800 text-xs font-bold uppercase tracking-wider rounded-full mb-1">
                        Core Intervention
                      </div>
                      <h3 className="text-4xl font-bold text-slate-900">Mindful Pause</h3>
                    </div>
                  </div>
                  <p className="text-xl text-slate-700 leading-relaxed mb-6">
                    A beautiful overlay shows what your money could fund instead—flights, hotels, experiences—creating space for intentional choice
                  </p>
                  
                  {/* Key Features */}
                  <div className="space-y-3">
                    {[
                      { icon: Heart, text: "Emotional visualization of dream goals" },
                      { icon: Shield, text: "Neutralizes urgency with calm design" },
                      { icon: Brain, text: "Engages System 2 thinking" }
                    ].map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 bg-white/60 backdrop-blur-sm rounded-xl border border-purple-200">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <feature.icon className="w-5 h-5 text-purple-600" strokeWidth={2} />
                        </div>
                        <p className="text-sm font-medium text-slate-700">{feature.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Step 3: Outcome */}
            <motion.div variants={fadeInUp}>
              <div className="grid lg:grid-cols-[1fr_400px] gap-8 items-center p-10 rounded-[2rem] bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 shadow-lg">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center font-bold text-lg shadow-lg">
                      3
                    </div>
                    <h3 className="text-3xl font-bold text-slate-900">Empowered Progress</h3>
                  </div>
                  <p className="text-lg text-slate-700 leading-relaxed mb-4">
                    If you save, see immediate progress toward your goal. If you buy, it's now a conscious decision—not an impulse
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 bg-white/80 text-emerald-700 text-sm font-semibold rounded-lg border border-emerald-200">Visual milestones</span>
                    <span className="px-3 py-1.5 bg-white/80 text-emerald-700 text-sm font-semibold rounded-lg border border-emerald-200">No guilt trips</span>
                    <span className="px-3 py-1.5 bg-white/80 text-emerald-700 text-sm font-semibold rounded-lg border border-emerald-200">Celebration</span>
                  </div>
                </div>
                <div className="relative">
                  <MobileMockup animate={false}>
                    <BumperSuccessScreen />
                  </MobileMockup>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Design Decisions - Icon Grid */}
      <section ref={solutionRef} className="py-24 px-6 bg-[#F2EFE9]">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isSolutionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-purple-100 text-purple-700 text-sm font-bold uppercase tracking-wider rounded-full mb-4">
              Key Decisions
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6">
              Behavioral design principles
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Evidence-backed choices that make mindful spending effortless
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={isSolutionInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: Shield,
                color: "indigo",
                title: "Backdrop Blur",
                tag: "Visual Shield",
                description: "Neutralizes urgency tactics like 'Only 2 left!' to help users focus on true priorities"
              },
              {
                icon: Heart,
                color: "rose",
                title: "Empathetic Tone",
                tag: "Microcopy",
                description: "Uses conversational language instead of guilt-tripping to build trust and partnership"
              },
              {
                icon: Compass,
                color: "emerald",
                title: "Goal Visualization",
                tag: "Milestones",
                description: "Replaces abstract percentages with tangible experiences to drive emotional resonance"
              },
              {
                icon: Timer,
                color: "amber",
                title: "30-Second Pause",
                tag: "Timing",
                description: "Research-backed duration that engages System 2 without causing frustration"
              },
              {
                icon: Sparkles,
                color: "purple",
                title: "Celebration Design",
                tag: "Rewards",
                description: "Positive reinforcement when users choose to save, creating habit formation"
              },
              {
                icon: Eye,
                color: "blue",
                title: "Material Design 3",
                tag: "UI System",
                description: "Familiar, premium aesthetic that feels like a trusted companion, not blocker"
              }
            ].map((item, idx) => (
              <motion.div key={idx} variants={scaleIn}>
                <div className="relative p-8 rounded-2xl bg-white border border-slate-200 shadow-md hover:shadow-xl transition-all h-full group">
                  {/* Icon */}
                  <div className={`w-14 h-14 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-xl flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7 text-white" strokeWidth={2} />
                  </div>

                  {/* Tag */}
                  <div className={`inline-block px-3 py-1 bg-${item.color}-100 text-${item.color}-700 text-xs font-bold uppercase tracking-wider rounded-full mb-3`}>
                    {item.tag}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Impact & Results */}
      <section ref={impactRef} className="py-24 px-6 bg-slate-900 text-white">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isImpactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-block px-4 py-2 bg-white/10 text-white text-sm font-bold uppercase tracking-wider rounded-full mb-4 backdrop-blur-sm">
              Impact
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold mb-6">
              Real behavior change
            </h2>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Early testing shows meaningful shifts in spending patterns
            </p>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial="hidden"
            animate={isImpactInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            {[
              { value: "73%", label: "Impulse Save Rate", icon: TrendingUp, color: "emerald" },
              { value: "30s", label: "Avg. Decision Time", icon: Timer, color: "indigo" },
              { value: "4.8", label: "User Rating", icon: Star, color: "amber" }
            ].map((stat, idx) => (
              <motion.div key={idx} variants={scaleIn}>
                <div className="relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                  <div className={`w-12 h-12 bg-${stat.color}-500/20 rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-400`} strokeWidth={2} />
                  </div>
                  <p className="text-5xl font-bold mb-2">{stat.value}</p>
                  <p className="text-slate-400 font-medium">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Key Learnings */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isImpactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-10 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10"
          >
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-8 h-8 text-purple-400" strokeWidth={2} />
              <h3 className="text-2xl font-bold">Key Learnings</h3>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                "Positive friction works—users appreciate the pause when it's framed as support, not restriction",
                "Visual goals are 3x more effective than abstract savings percentages for behavior change",
                "Material Design 3 familiarity reduced perceived intrusiveness by making the extension feel native",
                "AI collaboration (Antigravity) enabled rapid iteration—6 weeks vs. 6 months traditional timeline"
              ].map((learning, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-slate-300 leading-relaxed">{learning}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Ready to spend mindfully?
            </h2>
            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
              Install Bumper and start choosing experiences over impulses
            </p>
            <motion.a
              href="https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp?utm_source=item-share-cb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-2xl shadow-2xl hover:shadow-xl transition-all font-bold text-lg group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>Try Bumper Extension</span>
              <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </motion.a>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}