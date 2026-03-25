import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Link } from "react-router";
import { 
  ArrowLeft, 
  ExternalLink, 
  Clock, 
  Target, 
  Zap, 
  Users, 
  Lightbulb, 
  Brain, 
  Calendar,
  Activity,
  Vibrate,
  Volume2,
  Sun,
  BarChart3,
  TrendingUp,
  MessageCircle,
  AlertCircle,
  Timer,
  Shuffle,
  CheckCircle2,
  Search,
  FileText,
  Layers
} from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { Badge } from "./ui/badge";
import { TodaysRhythmScreen, LiveNudgeScreen, WeeklyInsightsScreen, WeeklyInsightsDetailScreen, CalibrateScreen, TimeFeelScreen } from "./ChronoWeaveMockups";
import { ChronoWeaveHeroAnimation } from "./ChronoWeaveHeroAnimation";

export function ChronoWeavePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black">
      <Header />

      {/* HERO SECTION */}
      <motion.section 
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-28 overflow-hidden"
      >
        {/* Pure black background */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Mesh gradient overlay - more vibrant on black */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/30 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-pink-500/30 rounded-full blur-[80px]" />
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          {/* Back button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              to="/#case-studies" 
              className="inline-flex items-center gap-2 text-[#94A3B8] hover:text-[#2DD4BF] transition-colors mb-12 sm:mb-16 group"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" strokeWidth={2} />
              <span className="text-sm sm:text-base">Back to Portfolio</span>
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center">
            {/* Left: Title & Info */}
            <motion.div
              className="space-y-6 sm:space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="space-y-4 sm:space-y-6">
                <Badge className="px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs tracking-wide">
                  FigBuild 2026 Hackathon
                </Badge>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
                  <span className="bg-gradient-to-r from-[#2DD4BF] via-[#A78BFA] to-[#F472B6] bg-clip-text text-transparent">
                    ChronoWeave
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
                  Multi-sensory nudges for time blindness
                </p>

                <p className="text-base sm:text-lg text-gray-400 leading-relaxed max-w-xl">
                  A 48-hour hackathon project exploring how haptics, audio, and light can help people with ADHD and autism perceive time passing
                </p>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <span className="px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 text-purple-200 text-sm rounded-full">
                  Figma AI
                </span>
                <span className="px-4 py-2 bg-teal-500/20 backdrop-blur-sm border border-teal-500/30 text-teal-200 text-sm rounded-full">
                  Mobile App
                </span>
                <span className="px-4 py-2 bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 text-pink-200 text-sm rounded-full">
                  48hr Sprint
                </span>
              </div>

              {/* Prototype Button */}
              <motion.a
                href="https://revamp-sauna-76244505.figma.site"
                target="_blank"
                rel="noopener noreferrer"
                className="relative inline-flex items-center gap-4 px-12 py-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold text-xl rounded-2xl shadow-lg shadow-black/20 overflow-hidden group"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Shimmer sweep effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                />
                
                {/* Glow on hover */}
                <motion.div
                  className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"
                />
                
                {/* Pulsing border glow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl"
                  animate={{
                    boxShadow: [
                      '0 0 0px rgba(255,255,255,0)',
                      '0 0 20px rgba(255,255,255,0.1)',
                      '0 0 0px rgba(255,255,255,0)',
                    ],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
                
                {/* Rotating gradient border on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 0%', '200% 0%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />
                
                <ExternalLink className="w-7 h-7 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-3 relative z-10" strokeWidth={2} />
                <span className="relative z-10">Launch Prototype</span>
              </motion.a>
            </motion.div>

            {/* Right: Hero mockup with glow */}
            <motion.div
              className="relative hidden lg:flex items-center justify-center overflow-visible"
              style={{ minHeight: '600px' }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Glow effect behind animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 bg-gradient-to-br from-teal-500/30 via-purple-500/30 to-pink-500/30 rounded-full blur-3xl" />
              </div>

              {/* Animation at full scale with proper height */}
              <div className="relative z-10 w-full h-full" style={{ minHeight: '600px' }}>
                <ChronoWeaveHeroAnimation />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* PROBLEM SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            {/* Section title */}
            <div className="text-center mb-16 sm:mb-20">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                The Problem
              </h2>
            </div>

            {/* Visual Problem Statement with Image */}
            <div className="max-w-6xl mx-auto mb-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Image */}
                <motion.div
                  className="relative h-[400px] rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-teal-500/20" />
                  <img
                    src="https://images.unsplash.com/photo-1698184861703-a76b104a43a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbG9jayUyMHRpbWUlMjBwZXJjZXB0aW9uJTIwYWJzdHJhY3R8ZW58MXx8fHwxNzczNTI3NDM5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Time perception abstract"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </motion.div>

                {/* Right: Core insight */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-3 px-5 py-3 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full">
                    <AlertCircle className="w-5 h-5 text-purple-300" strokeWidth={2} />
                    <span className="text-purple-200 font-semibold">Time Blindness</span>
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-bold text-white">
                    Time doesn't always feel the way it moves
                  </h3>
                  
                  <p className="text-lg text-gray-300 leading-relaxed">
                    People lose track of time, misjudge duration, and feel disconnected from the clock—creating stress, missed deadlines, and poor planning.
                  </p>

                  <div className="pt-4">
                    <div className="inline-flex items-center gap-2 text-gray-400 text-sm">
                      <Users className="w-4 h-4" strokeWidth={2} />
                      <span>Common in ADHD/autism, but universally relatable</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Impact metrics - visual icons with numbers */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {[
                { 
                  icon: Shuffle,
                  label: "Missed transitions", 
                  desc: "Switching tasks",
                  gradient: "from-purple-500/20 to-purple-500/5",
                  border: "border-purple-500/30",
                  iconColor: "text-purple-400"
                },
                { 
                  icon: Timer,
                  label: "Poor estimates", 
                  desc: "Misjudging time",
                  gradient: "from-teal-500/20 to-teal-500/5",
                  border: "border-teal-500/30",
                  iconColor: "text-teal-400"
                },
                { 
                  icon: AlertCircle,
                  label: "Daily stress", 
                  desc: "Time anxiety",
                  gradient: "from-pink-500/20 to-pink-500/5",
                  border: "border-pink-500/30",
                  iconColor: "text-pink-400"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`p-8 bg-gradient-to-br ${item.gradient} backdrop-blur-xl border ${item.border} rounded-3xl`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} strokeWidth={2} />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{item.label}</h4>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* DISCOVERY SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/4 right-1/3 w-[450px] h-[450px] bg-teal-500/25 rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[100px]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Discovery
              </h2>
            </div>

            {/* Visual discovery flow with images */}
            <div className="max-w-6xl mx-auto mb-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Image */}
                <motion.div
                  className="relative h-[400px] rounded-3xl overflow-hidden order-2 lg:order-1"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-pink-500/20" />
                  <img
                    src="https://images.unsplash.com/photo-1576153192281-d558108925bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ24lMjB0aGlua2luZyUyMGJyYWluc3Rvcm0lMjBzdGlja3klMjBub3Rlc3xlbnwxfHx8fDE3NzM1Mjc0Mzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Research and brainstorming"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </motion.div>

                {/* Right: Core insight */}
                <motion.div
                  className="space-y-6 order-1 lg:order-2"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="inline-flex items-center gap-3 px-5 py-3 bg-teal-500/20 backdrop-blur-sm border border-teal-500/30 rounded-full">
                    <Search className="w-5 h-5 text-teal-300" strokeWidth={2} />
                    <span className="text-teal-200 font-semibold">Research Phase</span>
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-bold text-white">
                    From online forums to research papers
                  </h3>
                  
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Deeksha explored Reddit threads and personal accounts about time struggles. We found a pattern: people with ADHD described not feeling time pass—not just distraction, but genuine inability to sense hours going by.
                  </p>

                  <p className="text-base text-gray-400">
                    The broader experience extended beyond ADHD/autism communities—giving us a meaningful direction within our 48-hour window.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Discovery process cards */}
            <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
              {[
                {
                  icon: Search,
                  title: "Initial Research",
                  desc: "Online communities & personal stories",
                  gradient: "from-purple-500/20 to-purple-500/5",
                  border: "border-purple-500/30",
                  iconColor: "text-purple-400"
                },
                {
                  icon: FileText,
                  title: "Team Discussion",
                  desc: "Research papers & firsthand accounts",
                  gradient: "from-teal-500/20 to-teal-500/5",
                  border: "border-teal-500/30",
                  iconColor: "text-teal-400"
                },
                {
                  icon: CheckCircle2,
                  title: "Problem Framing",
                  desc: "Time blindness as design challenge",
                  gradient: "from-pink-500/20 to-pink-500/5",
                  border: "border-pink-500/30",
                  iconColor: "text-pink-400"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`p-8 bg-gradient-to-br ${item.gradient} backdrop-blur-xl border ${item.border} rounded-3xl`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} strokeWidth={2} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 48 HOUR HACKATHON SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-purple-500/25 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                48 Hour Hackathon
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Working within strict time constraints
              </p>
            </div>

            {/* Timeline */}
            <div className="max-w-5xl mx-auto mb-16">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 right-0 top-12 h-1 bg-gradient-to-r from-purple-500/50 via-teal-500/50 to-pink-500/50" />
                
                {/* Timeline points */}
                <div className="relative grid grid-cols-4 gap-4">
                  {[
                    { hour: "0h", label: "Kickoff", desc: "Problem discovery" },
                    { hour: "12h", label: "First Prototype", desc: "Initial screens" },
                    { hour: "36h", label: "Testing", desc: "Team feedback" },
                    { hour: "48h", label: "Submission", desc: "Final polish" },
                  ].map((milestone, i) => (
                    <motion.div
                      key={i}
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.15 }}
                    >
                      <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 flex flex-col items-center justify-center mb-4 shadow-lg shadow-purple-500/20">
                        <span className="text-2xl font-bold text-white">{milestone.hour}</span>
                      </div>
                      <p className="text-sm font-semibold text-white mb-1">{milestone.label}</p>
                      <p className="text-xs text-gray-500">{milestone.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Constraints vs Approach */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <motion.div
                className="p-8 bg-gradient-to-br from-purple-500/10 to-purple-500/5 backdrop-blur-xl border border-purple-500/20 rounded-3xl"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Constraints</h3>
                <ul className="space-y-4">
                  {["Limited time for full design process", "No extensive user testing", "Fast iteration cycles required"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                className="p-8 bg-gradient-to-br from-teal-500/10 to-teal-500/5 backdrop-blur-xl border border-teal-500/20 rounded-3xl"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-white mb-6">Our Approach</h3>
                <ul className="space-y-4">
                  {["Focused on working concept", "Designed and iterated simultaneously", "Team collaboration key"].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-teal-400 mt-2 shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* DESIGN PROCESS SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        
        {/* Subtle gradient glow */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute bottom-1/3 right-1/4 w-[450px] h-[450px] bg-teal-500/25 rounded-full blur-[120px]" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Process
              </h2>
            </div>

            {/* Visual process with image */}
            <div className="max-w-6xl mx-auto mb-16">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Left: Core narrative */}
                <motion.div
                  className="space-y-6"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <div className="inline-flex items-center gap-3 px-5 py-3 bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 rounded-full">
                    <Layers className="w-5 h-5 text-pink-300" strokeWidth={2} />
                    <span className="text-pink-200 font-semibold">Fast & Collaborative</span>
                  </div>
                  
                  <h3 className="text-3xl sm:text-4xl font-bold text-white">
                    48 hours, no predefined flow
                  </h3>
                  
                  <p className="text-lg text-gray-300 leading-relaxed">
                    Fran and Honey built prototype structure early on. Later, Deeksha and I refined visual design and hierarchy. We iterated constantly—tweaks, redesigns, complete pivots—keeping clarity as our north star.
                  </p>

                  <p className="text-base text-gray-400">
                    Regular check-ins, clear roles, and strategic breaks helped us avoid burnout and make better decisions.
                  </p>
                </motion.div>

                {/* Right: Image */}
                <motion.div
                  className="relative h-[400px] rounded-3xl overflow-hidden"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20" />
                  <img
                    src="https://images.unsplash.com/photo-1739298061740-5ed03045b280?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHdvcmtzcGFjZSUyMG1eXRpdHJ1bmc8ZW58MXx8fHwxNzczNTI3NDM5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Team collaboration"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </motion.div>
              </div>
            </div>

            {/* Process highlights grid */}
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
              {[
                {
                  icon: Users,
                  title: "Early Team Contribution",
                  desc: "Fran & Honey: prototype flow",
                  gradient: "from-purple-500/10 to-purple-500/5",
                  border: "border-purple-500/20",
                  iconColor: "text-purple-400"
                },
                {
                  icon: Layers,
                  title: "Later Refinement",
                  desc: "Deeksha & I: visual polish",
                  gradient: "from-teal-500/10 to-teal-500/5",
                  border: "border-teal-500/20",
                  iconColor: "text-teal-400"
                },
                {
                  icon: Target,
                  title: "Focus on Clarity",
                  desc: "Optimized for judges",
                  gradient: "from-pink-500/10 to-pink-500/5",
                  border: "border-pink-500/20",
                  iconColor: "text-pink-400"
                },
                {
                  icon: Shuffle,
                  title: "Rapid Cycles",
                  desc: "Tweaks to redesigns",
                  gradient: "from-blue-500/10 to-blue-500/5",
                  border: "border-blue-500/20",
                  iconColor: "text-blue-400"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`p-8 bg-gradient-to-br ${item.gradient} backdrop-blur-xl border ${item.border} rounded-3xl`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center mb-6`}>
                    <item.icon className={`w-7 h-7 ${item.iconColor}`} strokeWidth={2} />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-3">{item.title}</h4>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROTOTYPE SCREENS SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-black" />
        
        {/* Floating gradient blobs */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              High Fidelity UI
            </h2>
            <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
              Key screens that bring time awareness to life
            </p>
          </motion.div>

          {/* Screens grid */}
          <div className="space-y-20">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { Screen: TodaysRhythmScreen, title: "Drift Map", desc: "Track time perception patterns" },
                { Screen: LiveNudgeScreen, title: "Live Nudge", desc: "Multi-sensory feedback modes" },
                { Screen: WeeklyInsightsScreen, title: "Today's Rhythm", desc: "Time stability forecast" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  {/* Glass card wrapper */}
                  <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                    <item.Screen />
                  </div>
                  <div className="text-center px-4">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {[
                { Screen: WeeklyInsightsDetailScreen, title: "Weekly Insights", desc: "Drift calendar view" },
                { Screen: CalibrateScreen, title: "Calibrate", desc: "5 quick tests" },
                { Screen: TimeFeelScreen, title: "Time Feel", desc: "Perception assessment" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="space-y-6"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                    <item.Screen />
                  </div>
                  <div className="text-center px-4">
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ITERATIONS SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111A3A] to-[#1A1F4F]" />
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Iterations
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Quick iterations, major improvements
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { 
                  type: "Minor Changes",
                  desc: "Color & spacing refinements",
                  gradient: "from-purple-500/20 to-purple-500/5",
                  border: "border-purple-500/30"
                },
                { 
                  type: "Major Changes",
                  desc: "Layout & hierarchy overhauls",
                  gradient: "from-teal-500/20 to-teal-500/5",
                  border: "border-teal-500/30"
                },
                { 
                  type: "Complete Redesigns",
                  desc: "Full concept pivots",
                  gradient: "from-pink-500/20 to-pink-500/5",
                  border: "border-pink-500/30"
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className={`p-8 bg-gradient-to-br ${item.gradient} backdrop-blur-xl border ${item.border} rounded-3xl`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-3">{item.type}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* LEARNINGS SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1A1F4F] to-[#0B1020]" />
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                Learnings
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Key takeaways from the sprint
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {[
                { icon: Users, title: "Team Collaboration", desc: "Building trust with new teammates" },
                { icon: Brain, title: "Design Opinions", desc: "Balancing different perspectives" },
                { icon: Target, title: "Role Assignment", desc: "Clear ownership prevents overlap" },
                { icon: Clock, title: "Communication", desc: "Regular check-ins kept us aligned" },
                { icon: Zap, title: "Taking Breaks", desc: "Prevented burnout, better decisions" },
                { icon: Lightbulb, title: "Figma AI", desc: "Accelerated prototyping workflows" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500/20 to-teal-500/20 border border-white/20 flex items-center justify-center mb-6">
                    <item.icon className="w-6 h-6 text-[#E5E7EB]" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B1020] to-[#111A3A]" />
        
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                The Team
              </h2>
              <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto">
                Built live at FigBuild 2026
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { initial: "J", name: "Jay", role: "Design System, UX", gradient: "from-purple-500 to-purple-600" },
                { initial: "F", name: "Fran", role: "Video, Demo Polish", gradient: "from-teal-500 to-teal-600" },
                { initial: "D", name: "Deeksha", role: "Ideation, Narrative", gradient: "from-pink-500 to-pink-600" },
                { initial: "H", name: "Honey", role: "Recording, Animation", gradient: "from-blue-500 to-blue-600" },
              ].map((member, i) => (
                <motion.div
                  key={i}
                  className="p-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white text-3xl font-bold mx-auto mb-6 shadow-lg`}>
                    {member.initial}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-20 sm:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#111A3A] to-[#0B1020]" />
        
        {/* Giant gradient blob */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/20 via-teal-500/20 to-pink-500/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative z-10 text-center">
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white">
              Ready to Experience It?
            </h2>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore the full interactive prototype
            </p>
            
            {/* CTA Button */}
            <motion.a
              href="https://revamp-sauna-76244505.figma.site"
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center gap-4 px-12 py-6 bg-white/10 backdrop-blur-xl border border-white/20 text-white font-semibold text-xl rounded-2xl shadow-lg shadow-black/20 overflow-hidden group"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Shimmer sweep effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              
              {/* Glow on hover */}
              <motion.div
                className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"
              />
              
              {/* Pulsing border glow */}
              <motion.div
                className="absolute inset-0 rounded-2xl"
                animate={{
                  boxShadow: [
                    '0 0 0px rgba(255,255,255,0)',
                    '0 0 20px rgba(255,255,255,0.1)',
                    '0 0 0px rgba(255,255,255,0)',
                  ],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Rotating gradient border on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                  backgroundSize: '200% 100%',
                }}
                animate={{
                  backgroundPosition: ['0% 0%', '200% 0%'],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              
              <ExternalLink className="w-7 h-7 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:rotate-3 relative z-10" strokeWidth={2} />
              <span className="relative z-10">Launch Prototype</span>
            </motion.a>

            {/* Feature tags */}
            <div className="flex flex-wrap justify-center gap-6 pt-6">
              {["Full User Flow", "Interactive Animations", "Production Ready"].map((tag, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-400">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-purple-400" />
                  <span className="text-sm font-medium">{tag}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}