import { ArrowLeft, Smartphone, Brain, Shield, Bell, Clock, Users, Target, Zap, ExternalLink, Check, X, AlertCircle, Search, Lightbulb, Sparkles, Activity, Gauge, UserCircle, FileText, Calendar, Monitor, BarChart3, Bot, Settings, BellRing, XCircle, Scale, CheckCircle, Star, Quote, TrendingUp, ChevronLeft, ChevronRight, PhoneCall, Car, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence, useInView } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { CaseStudyHero } from "./CaseStudyHero";
// Low-fidelity wireframes
import { WireframeScreen1 } from "./wireframes/WireframeScreen1";
import { WireframeScreen2 } from "./wireframes/WireframeScreen2";
import { WireframeScreen3 } from "./wireframes/WireframeScreen3";
import { WireframeScreen4 } from "./wireframes/WireframeScreen4";
import { WireframeScreen5 } from "./wireframes/WireframeScreen5";
import { WireframeScreen6 } from "./wireframes/WireframeScreen6";
// High-fidelity screens
import HiFiScreen1 from "../imports/2-119-38";
import HiFiScreen2 from "../imports/5-119-110";
import HiFiScreen3 from "../imports/13-119-398";
import HiFiScreen4 from "../imports/11-119-1314";
import HiFiScreen5 from "../imports/10-119-1463";
import HiFiScreen6 from "../imports/3-119-980";
import HiFiScreenHowItWorks from "../imports/3-119-1686";
import { MobileMockup } from "./MobileMockup";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { AnimatedHiFiScreen } from "./AnimatedHiFiScreen";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

// Animated Counter Component
function AnimatedCounter({ target, duration = 2 }: { target: number; duration?: number }) {
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
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}</span>;
}

export function SmartDrivePage() {
  const [currentStage, setCurrentStage] = useState(0);
  
  const stages = [
    {
      stage: "Stage 1",
      title: "Onboarding & Setup",
      icon: Smartphone,
      items: ["Welcome Screen", "Permissions Access", "Vehicle Selection", "Agreement & Start"],
      output: "AI Setup Initiated"
    },
    {
      stage: "Stage 2",
      title: "Behavior Analysis (Active Learning)",
      icon: Brain,
      items: ["Analysis Started", "Progress Indicator", "Educational Tips", "48-Hour Window"],
      output: "Dashboard Access Enabled"
    },
    {
      stage: "Stage 3",
      title: "Drive Analysis Dashboard",
      icon: TrendingUp,
      items: ["Driving Time & Pickups", "Speed-Based Chart", "App Breakdown", "Risk Distribution"],
      output: "View Full Report"
    },
    {
      stage: "Stage 4",
      title: "AI Sensitivity Recommendation",
      icon: Target,
      items: ["Suggested Mode", "Brief Reasoning", "Levels Preview", "Apply Settings"],
      output: "Personalized Mode Activated"
    },
    {
      stage: "Stage 5",
      title: "Active Protection Dashboard",
      icon: Shield,
      items: ["Protection Active", "Weekly Report", "Achievements", "Control Buttons"],
      output: "Continuous Learning Loop"
    }
  ];

  const handlePrevStage = () => {
    setCurrentStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1));
  };

  const handleNextStage = () => {
    setCurrentStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Fixed Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-b border-slate-200 z-50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-slate-600 hover:text-cyan-600 transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Back to Portfolio</span>
          </Link>
        </div>
      </motion.nav>

      {/* New Full-Width Hero */}
      <CaseStudyHero
        title="SmartDrive AI App"
        subtitle="An intelligent AI-powered distraction filter that learns your driving patterns to keep you safe on the road."
        tags={["UX Design", "Prototyping", "6 Months", "iOS/Android"]}
        phoneContent={
          <div className="w-full h-full scale-[0.85] origin-top">
            <HiFiScreen1 />
          </div>
        }
        onExploreClick={() => {
          document.getElementById('project-overview')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }}
      />

      {/* Project Overview Section */}
      <section id="project-overview" className="pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.p 
              variants={fadeInUp}
              className="text-slate-600 text-xl md:text-2xl max-w-3xl leading-relaxed"
            >
              An AI-powered notification management system designed to help users stay focused while driving.
            </motion.p>

            {/* Project Meta Cards */}
            <motion.div 
              variants={fadeInUp}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6"
            >
              {[
                { icon: UserCircle, label: "Role", value: "UX Designer" },
                { icon: FileText, label: "Type", value: "Concept Project" },
                { icon: Calendar, label: "Duration", value: "3 Weeks" },
                { icon: Monitor, label: "Platform", value: "Mobile (iOS/Android)" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-cyan-300 hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <item.icon className="w-4 h-4 text-cyan-600" />
                    <p className="text-slate-500 text-sm">{item.label}</p>
                  </div>
                  <p className="text-slate-900">{item.value}</p>
                </motion.div>
              ))}
            </motion.div>


          </motion.div>
        </div>
      </section>

      {/* Core Competencies */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            <motion.h2 variants={fadeInUp} className="text-slate-900 mb-10">
              Core Competencies
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: "AI-Powered Learning",
                  description: "Adapts to individual driving patterns and notification behaviors over time"
                },
                {
                  icon: Shield,
                  title: "Intelligent Filtering",
                  description: "Categorizes notifications based on priority and context automatically"
                },
                {
                  icon: Bell,
                  title: "Zero Manual Setup",
                  description: "Automatically activates while driving—no need to toggle on or off"
                }
              ].map((competency, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group bg-white rounded-2xl p-8 border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className="w-14 h-14 rounded-xl bg-cyan-50 flex items-center justify-center mb-5 group-hover:bg-cyan-100 transition-colors duration-300">
                    <competency.icon className="w-7 h-7 text-cyan-600" />
                  </div>
                  <h3 className="text-slate-900 mb-3">{competency.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{competency.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement - Enhanced Interactive */}
      <section className="py-16 px-6 lg:px-8 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-64 h-64 bg-red-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: [0.5, 0.3, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            {/* Header with Pulse Animation */}
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <div className="relative">
                <motion.div
                  className="absolute inset-0 bg-red-500/20 rounded-xl blur-lg"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 0.8, 0.5],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <h2 className="text-slate-900">The Problem</h2>
            </motion.div>

            {/* Main Problem Card with Gradient */}
            <motion.div 
              variants={fadeInUp}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/10 to-cyan-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative bg-gradient-to-br from-white via-slate-50 to-white rounded-3xl p-10 border border-slate-200 hover:border-slate-300 shadow-lg hover:shadow-xl transition-all duration-500">
                {/* Floating Icons */}
                <div className="absolute top-6 right-6 flex gap-3">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shadow-md"
                  >
                    <PhoneCall className="w-6 h-6 text-red-500" />
                  </motion.div>
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, -5, 0]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                    className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shadow-md"
                  >
                    <Car className="w-6 h-6 text-slate-600" />
                  </motion.div>
                </div>

                <p className="text-slate-700 text-lg leading-relaxed mb-8 pr-32">
                  Despite existing "Do Not Disturb" features, drivers still face constant interruptions from their phones. 
                  Current solutions are either too restrictive (blocking everything) or too lenient (allowing too many 
                  distractions). There's a critical need for an intelligent solution that understands context and priority.
                </p>

                {/* Animated Stats Grid */}
                <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-200">
                  {/* Stat 1 */}
                  <motion.div 
                    className="relative group/stat overflow-hidden h-full"
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    <div className="relative bg-gradient-to-br from-cyan-50 via-blue-50 to-cyan-50 rounded-2xl p-6 border border-cyan-200 group-hover/stat:border-transparent transition-all duration-500 h-full flex flex-col">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center group-hover/stat:scale-110 transition-transform duration-300">
                          <AlertTriangle className="w-6 h-6 text-cyan-600 group-hover/stat:text-cyan-700" />
                        </div>
                        <div className="flex-1">
                          <div className="text-3xl sm:text-4xl md:text-5xl text-cyan-600 group-hover/stat:text-white transition-colors duration-300">
                            <AnimatedCounter target={73} />%
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700 group-hover/stat:text-white transition-colors duration-300">
                        of drivers admit using their phone while driving
                      </p>
                    </div>
                  </motion.div>

                  {/* Stat 2 */}
                  <motion.div 
                    className="relative group/stat overflow-hidden h-full"
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500 rounded-2xl" />
                    <div className="relative bg-gradient-to-br from-orange-50 via-red-50 to-orange-50 rounded-2xl p-6 border border-orange-200 group-hover/stat:border-transparent transition-all duration-500 h-full flex flex-col">
                      <div className="flex items-start gap-4 mb-3">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center group-hover/stat:scale-110 transition-transform duration-300">
                          <XCircle className="w-6 h-6 text-orange-600 group-hover/stat:text-orange-700" />
                        </div>
                        <div className="flex-1">
                          <div className="text-3xl sm:text-4xl md:text-5xl text-orange-600 group-hover/stat:text-white transition-colors duration-300">
                            <AnimatedCounter target={42} />%
                          </div>
                        </div>
                      </div>
                      <p className="text-slate-700 group-hover/stat:text-white transition-colors duration-300">
                        forget to activate driving mode, rendering existing solutions ineffective
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Competitor Analysis */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Search className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-slate-900">Competitor Analysis</h2>
                <p className="text-slate-600">How SmartDrive compares to existing solutions</p>
              </div>
            </motion.div>

            {/* Interactive Comparison Cards */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { name: "Android Auto", score: 4 },
                  { name: "Apple Focus", score: 5 },
                  { name: "Third-Party", score: 3 }
                ].map((competitor, index) => (
                  <div key={index} className="text-center">
                    <div className="relative w-20 h-20 mx-auto mb-3">
                      <svg className="transform -rotate-90" viewBox="0 0 80 80">
                        <circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#e2e8f0"
                          strokeWidth="8"
                          fill="none"
                        />
                        <motion.circle
                          cx="40"
                          cy="40"
                          r="32"
                          stroke="#0891b2"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${(competitor.score / 10) * 201} 201`}
                          initial={{ strokeDasharray: "0 201" }}
                          whileInView={{ strokeDasharray: `${(competitor.score / 10) * 201} 201` }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-slate-900">{competitor.score}/10</span>
                      </div>
                    </div>
                    <h4 className="text-slate-900 mb-1">{competitor.name}</h4>
                  </div>
                ))}
              </div>

              {/* Feature Comparison Table */}
              <div className="space-y-3">
                {[
                  { feature: "AI Learning", android: false, apple: false, thirdParty: false, smartDrive: true },
                  { feature: "Auto-Activation", android: false, apple: false, thirdParty: false, smartDrive: true },
                  { feature: "Smart Filtering", android: false, apple: false, thirdParty: true, smartDrive: true },
                  { feature: "Cross-Platform", android: true, apple: false, thirdParty: true, smartDrive: true },
                  { feature: "Customization", android: false, apple: false, thirdParty: true, smartDrive: true }
                ].map((row, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="grid grid-cols-5 gap-4 items-center py-3 px-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200"
                  >
                    <div className="col-span-1 text-slate-700 text-sm">{row.feature}</div>
                    <div className="text-center">
                      {row.android ? (
                        <Check className="w-5 h-5 text-cyan-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </div>
                    <div className="text-center">
                      {row.apple ? (
                        <Check className="w-5 h-5 text-cyan-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </div>
                    <div className="text-center">
                      {row.thirdParty ? (
                        <Check className="w-5 h-5 text-cyan-600 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-slate-300 mx-auto" />
                      )}
                    </div>
                    <div className="text-center">
                      {row.smartDrive && (
                        <div className="flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-center gap-8 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-400" />
                  <span className="text-slate-600">Competitors</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500" />
                  <span className="text-slate-900">SmartDrive</span>
                </div>
              </div>
            </motion.div>

            {/* Key Differentiator */}
            <motion.div 
              variants={fadeInUp}
              className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200 hover:border-cyan-300 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-slate-900 mb-2">Key Differentiator</h4>
                  <p className="text-slate-700">SmartDrive is the only solution that combines AI-powered learning with automatic activation, eliminating manual setup while providing intelligent, context-aware filtering.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Solution Overview */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-10"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Lightbulb className="w-6 h-6 text-cyan-600" />
              </div>
              <h2 className="text-slate-900">Solution Overview</h2>
            </motion.div>

            {/* AI Workflow */}
            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
              <h3 className="text-slate-900 mb-8">AI-Powered Workflow</h3>
              <div className="grid md:grid-cols-4 gap-5">
                {[
                  { icon: BarChart3, title: "Analyze", description: "Tracks phone pickups, notification interactions, and driving speed" },
                  { icon: Bot, title: "Learn", description: "AI identifies patterns in user behavior over 48 hours" },
                  { icon: Settings, title: "Adapt", description: "Adjusts filtering rules based on user corrections and feedback" },
                  { icon: BellRing, title: "Filter", description: "Blocks or allows notifications dynamically during drives" }
                ].map((step, index) => (
                  <motion.div 
                    key={index} 
                    className="relative"
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:border-cyan-300 transition-all duration-300 h-full">
                      <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center mb-4">
                        <step.icon className="w-6 h-6 text-cyan-600" />
                      </div>
                      <h4 className="text-slate-900 mb-2">{step.title}</h4>
                      <p className="text-slate-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                    {index < 3 && (
                      <div className="hidden md:block absolute top-1/2 -right-2.5 w-5 h-px bg-gradient-to-r from-slate-300 to-transparent transform -translate-y-1/2" />
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Sensitivity Levels */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-slate-900 mb-6">Adaptive Sensitivity Levels</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { level: "Strict", icon: XCircle, description: "For heavy phone users who need maximum focus", detail: "Blocks all notifications except emergency contacts" },
                  { level: "Moderate", icon: Scale, description: "For balanced phone usage patterns", detail: "Smart filtering with vibration for important alerts" },
                  { level: "Lenient", icon: CheckCircle, description: "For minimal phone interaction while driving", detail: "Allows most notifications with gentle reminders" }
                ].map((sensitivity, index) => (
                  <motion.div 
                    key={index} 
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                    whileHover={{ y: -4 }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                        <sensitivity.icon className="w-6 h-6 text-cyan-600" />
                      </div>
                      <h4 className="text-slate-900">{sensitivity.level}</h4>
                    </div>
                    <p className="text-slate-600 mb-2">{sensitivity.description}</p>
                    <p className="text-slate-500 text-sm">{sensitivity.detail}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Information Architecture - Swipable Cards */}
      <section className="py-16 px-6 lg:px-8 bg-gradient-to-br from-white via-slate-50 to-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <h2 className="text-slate-900 mb-3">Information Architecture</h2>
              <p className="text-slate-600">User journey from onboarding to continuous learning</p>
            </motion.div>

            {/* Swipable Card Container */}
            <div className="relative">
              {/* Navigation Buttons */}
              <button
                onClick={handlePrevStage}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-12 z-10 w-12 h-12 rounded-full bg-white border border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-50 flex items-center justify-center transition-all duration-300 group shadow-md"
                aria-label="Previous stage"
              >
                <ChevronLeft className="w-6 h-6 text-cyan-600 group-hover:text-cyan-700" />
              </button>

              <button
                onClick={handleNextStage}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-12 z-10 w-12 h-12 rounded-full bg-white border border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-50 flex items-center justify-center transition-all duration-300 group shadow-md"
                aria-label="Next stage"
              >
                <ChevronRight className="w-6 h-6 text-cyan-600 group-hover:text-cyan-700" />
              </button>

              {/* Card Display Area */}
              <div className="relative overflow-hidden min-h-[400px] flex items-center">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentStage}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipeThreshold = 50;
                      if (offset.x > swipeThreshold) {
                        handlePrevStage();
                      } else if (offset.x < -swipeThreshold) {
                        handleNextStage();
                      }
                    }}
                    className="w-full cursor-grab active:cursor-grabbing"
                  >
                    <div className="bg-slate-800 rounded-2xl p-8 border border-cyan-500/20 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                          {(() => {
                            const StageIcon = stages[currentStage].icon;
                            return <StageIcon className="w-6 h-6 text-cyan-400" />;
                          })()}
                        </div>
                        <div>
                          <div className="text-xs text-cyan-400">{stages[currentStage].stage}</div>
                          <div className="text-white">{stages[currentStage].title}</div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-6">
                        {stages[currentStage].items.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-300">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-6 border-t border-slate-700 text-center">
                        <div className="text-xs text-slate-400 mb-2">Output</div>
                        <div className="text-cyan-400">→ {stages[currentStage].output}</div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Stage Indicators */}
              <div className="flex justify-center gap-2 mt-8">
                {stages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStage(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentStage 
                        ? "w-8 bg-cyan-400" 
                        : "w-2 bg-slate-600 hover:bg-slate-500"
                    }`}
                    aria-label={`Go to stage ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Learning Cycle Note */}
            <motion.div variants={fadeInUp} className="text-center pt-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 rounded-full border border-cyan-500/30">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300 text-sm">Learn → Analyze → Recommend → Apply → Improve</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* User Study */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Users className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-slate-900">User Study</h2>
                <p className="text-slate-600">Research findings from beta testing with real drivers</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: "Participants", value: "24" },
                { label: "Age Range", value: "22-45" },
                { label: "Regular Drivers", value: "100%" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="bg-white rounded-2xl p-8 border border-slate-200 text-center hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                  whileHover={{ y: -4 }}
                >
                  <div className="text-3xl sm:text-4xl md:text-5xl text-cyan-600 mb-3">{stat.value}</div>
                  <p className="text-slate-600">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300">
              <h3 className="text-slate-900 mb-6">Key Insights</h3>
              <div className="space-y-4">
                {[
                  "Users want smart filtering that lets important calls through (family emergencies, work urgency)",
                  "Manual configuration of 'Do Not Disturb' is too complex and often forgotten",
                  "Drivers want automatic detection of when they're driving without needing to enable it manually",
                  "Post-drive summaries help users feel less anxious about missed notifications",
                  "Trust in AI decision-making requires transparency and easy override options"
                ].map((insight, index) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                    <p className="text-slate-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Design Process */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-slate-900">Design Process</h2>
                <p className="text-slate-600">Research, design tools, and iteration methodology</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Research */}
              <motion.div 
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h3 className="text-slate-900">Research</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Activity className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-900 mb-1">Behavioral pattern learning</p>
                      <p className="text-slate-600 text-sm">Studied driving behaviors and phone usage patterns</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Gauge className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-slate-900 mb-1">Phone activity + driving speed analysis</p>
                      <p className="text-slate-600 text-sm">Analyzed correlation between speed and distraction</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Design Tools */}
              <motion.div 
                variants={fadeInUp}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-cyan-600" />
                  </div>
                  <h3 className="text-slate-900">Design</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 38 57" fill="none">
                        <path d="M19 28.5L19 0H0L0 57H38V28.5H19Z" fill="#1ABCFE"/>
                        <path d="M19 28.5L19 57H38V28.5H19Z" fill="#0ACF83"/>
                        <path d="M19 0L19 28.5H38V0H19Z" fill="#FF7262"/>
                        <path d="M0 0H19V28.5H0V0Z" fill="#F24E1E"/>
                        <path d="M0 28.5H19V57H0V28.5Z" fill="#A259FF"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-900">Figma</p>
                      <p className="text-slate-600 text-sm">Wireframing & high-fidelity design</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-slate-900">Google Stitch</p>
                      <p className="text-slate-600 text-sm">Prototyping & user testing</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Style Guide */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <h2 className="text-slate-900">Style Guide</h2>
                <p className="text-slate-600">Visual language and design system</p>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Colors */}
              <motion.div 
                variants={fadeInUp} 
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="text-slate-900 mb-6">Color Palette</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: "Primary Blue", color: "#2B7FFF", bg: "bg-[#2B7FFF]" },
                    { name: "Accent Blue", color: "#51A2FF", bg: "bg-[#51A2FF]" },
                    { name: "Success Green", color: "#00D492", bg: "bg-[#00D492]" },
                    { name: "Warning Orange", color: "#FE9A00", bg: "bg-[#FE9A00]" },
                    { name: "Accent Purple", color: "#C27AFF", bg: "bg-[#C27AFF]" },
                    { name: "Dark Blue", color: "#155DFC", bg: "bg-[#155DFC]" }
                  ].map((item, index) => (
                    <motion.div 
                      key={index} 
                      className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors duration-300"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className={`w-full h-16 rounded-lg ${item.bg} shadow-md`} />
                      <div className="text-center">
                        <p className="text-slate-900 text-sm">{item.name}</p>
                        <p className="text-slate-500 text-xs font-mono">{item.color}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <p className="text-slate-600 text-sm mb-3">Background & Text</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-[#0A0A0A] shadow-md" />
                      <div>
                        <p className="text-slate-900 text-xs">Background</p>
                        <p className="text-slate-500 text-xs font-mono">#0A0A0A</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-lg bg-[#A1A1A1] shadow-md" />
                      <div>
                        <p className="text-slate-900 text-xs">Text Gray</p>
                        <p className="text-slate-500 text-xs font-mono">#A1A1A1</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Typography */}
              <motion.div 
                variants={fadeInUp} 
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:border-cyan-300 hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -4 }}
              >
                <h3 className="text-slate-900 mb-6">Typography & UI</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-600 text-sm mb-2">Font Family</p>
                    <p className="text-slate-900 text-xl">Poppins</p>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-2">Border Radius</p>
                    <div className="flex gap-2">
                      <span className="px-4 py-2 bg-slate-100 rounded-xl text-sm text-slate-900">12-21px</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-600 text-sm mb-2">Design Style</p>
                    <p className="text-slate-700">Clean, rounded, modern with subtle shadows</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Low-Fidelity Wireframes */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-slate-900 mb-3">Low-Fidelity Wireframes</h2>
              <p className="text-slate-600">Early-stage mockups exploring key user flows and interactions</p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { component: WireframeScreen1, label: "Welcome & Setup Introduction" },
                { component: WireframeScreen2, label: "Enable SmartDrive Mode" },
                { component: WireframeScreen3, label: "Behavior Analysis Explanation" },
                { component: WireframeScreen4, label: "Analysis In Progress" },
                { component: WireframeScreen5, label: "Drive Analysis Dashboard" },
                { component: WireframeScreen6, label: "Summary & Mode Active" }
              ].map((wireframe, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group bg-slate-100 rounded-2xl p-6 border-2 border-slate-300 hover:border-slate-400 hover:shadow-xl transition-all duration-300"
                  whileHover={{ y: -6 }}
                >
                  <div className="aspect-[9/16] bg-white rounded-xl overflow-hidden mb-4 flex items-center justify-center border-2 border-slate-300 shadow-sm">
                    <wireframe.component />
                  </div>
                  <p className="text-slate-700 text-center text-sm">{wireframe.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* High-Fidelity Screens */}
      <section className="py-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-slate-900 mb-3">High-Fidelity Screens</h2>
              <p className="text-slate-600">Final polished designs with complete visual hierarchy and branding</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
              {[
                { component: HiFiScreen1, label: "AI-Powered Focus Mode" },
                { component: HiFiScreen2, label: "Analysis In Progress" },
                { component: HiFiScreen3, label: "Weekly Progress Report" },
                { component: HiFiScreen4, label: "7-Day Report Dashboard" },
                { component: HiFiScreen5, label: "AI Learning Process" },
                { component: HiFiScreen6, label: "Onboarding Flow" }
              ].map((screen, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group flex flex-col items-center"
                  whileHover={{ y: -8 }}
                >
                  <div className="w-[390px] h-[844px] bg-slate-900 rounded-[40px] overflow-hidden shadow-2xl border-8 border-slate-800 mb-6 transition-all duration-300 group-hover:shadow-cyan-500/20 group-hover:border-cyan-800 relative">
                    <div className="absolute inset-0 w-[390px] h-[844px]">
                      <screen.component />
                    </div>
                  </div>
                  <p className="text-slate-900 text-center">{screen.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* User Reviews */}
      <section className="py-16 px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div variants={fadeInUp} className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 rounded-full mb-4">
                <Users className="w-4 h-4 text-cyan-600" />
                <span className="text-cyan-600">Design Feedback</span>
              </div>
              <h2 className="text-slate-900 mb-3">What Users Think</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Honest feedback from early design reviews</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Chen",
                  role: "UX Researcher",
                  avatar: "https://images.unsplash.com/photo-1761243892035-c3e13829115a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhc2lhbiUyMHdvbWFuJTIwcHJvZmVzc2lvbmFsJTIwaGVhZHNob3R8ZW58MXx8fHwxNzYxNjE5MjAwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  rating: 5,
                  review: "The interface feels balanced and easy to read. The use of spacing and card layouts makes the information clear even on a small screen.",
                  highlight: "Visual Hierarchy",
                  isPositive: true
                },
                {
                  name: "Marcus Johnson",
                  role: "Product Manager",
                  avatar: "https://images.unsplash.com/photo-1652471943570-f3590a4e52ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibGFjayUyMG1hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MTU5MDcxNHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  rating: 5,
                  review: "I like how the app focuses on safety without overcomplicating things. The AI explanation feels reassuring and builds user trust.",
                  highlight: "Concept Clarity",
                  isPositive: true
                },
                {
                  name: "Priya Patel",
                  role: "UI Designer",
                  avatar: "https://images.unsplash.com/photo-1653671832574-029b950a5749?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjB3b21hbiUyMHByb2Zlc3Npb25hbCUyMGhlYWRzaG90fGVufDF8fHx8MTc2MTYyMzUwNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
                  rating: 3,
                  review: "The dashboard looks a bit static. Adding small animations or data transitions could make it feel more alive and modern.",
                  highlight: "Visual Engagement",
                  isPositive: false
                }
              ].map((user, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="relative group"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${user.isPositive ? 'from-cyan-200 via-blue-200 to-slate-200' : 'from-slate-200 via-slate-300 to-slate-200'} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                  <div className={`relative bg-white rounded-3xl p-8 shadow-lg border ${user.isPositive ? 'border-slate-200 group-hover:border-cyan-300' : 'border-slate-300 group-hover:border-slate-400'} transition-all duration-300`}>
                    {/* Quote Icon */}
                    <div className={`absolute -top-4 -right-4 w-12 h-12 ${user.isPositive ? 'bg-gradient-to-br from-cyan-500 to-blue-600' : 'bg-gradient-to-br from-slate-500 to-slate-600'} rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-300`}>
                      <Quote className="w-6 h-6 text-white" />
                    </div>

                    {/* Avatar & Info */}
                    <div className="flex items-center gap-4 mb-4">
                      <ImageWithFallback 
                        src={user.avatar}
                        alt={user.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 shadow-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-slate-900">{user.name}</h3>
                        <p className="text-slate-500 text-sm">{user.role}</p>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < user.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-slate-300"
                          }`}
                        />
                      ))}
                    </div>

                    {/* Review */}
                    <p className="text-slate-700 mb-4 leading-relaxed">"{user.review}"</p>

                    {/* Highlight Badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 ${user.isPositive ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200' : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-300'} rounded-full border`}>
                      <Sparkles className={`w-3 h-3 ${user.isPositive ? 'text-cyan-600' : 'text-slate-600'}`} />
                      <span className={`text-sm ${user.isPositive ? 'text-cyan-700' : 'text-slate-700'}`}>{user.highlight}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="bg-gradient-to-br from-cyan-600 to-blue-600 rounded-3xl p-12 text-center text-white"
          >
            <motion.h2 variants={fadeInUp} className="text-white mb-4">
              Experience the Full Prototype
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
              Explore the interactive prototype to see SmartDrive Mode in action
            </motion.p>
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://www.figma.com/proto/Eyc3kyhBjicVrMpYDZJSDs/Drive-Zen-AI?page-id=0%3A1&node-id=328-57&viewport=-1%2C171%2C1.18&t=Ha1VvUqJziIUjJlm-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=328%3A57"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-cyan-600 rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <Smartphone className="w-5 h-5" />
                View Interactive Prototype
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
              </a>
              <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-2xl hover:bg-white/20 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Portfolio
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Back to Top Button */}
      <BackToTopButton />
    </div>
  );
}

// Back to Top Button Component
function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300 group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.div
            animate={{
              y: [0, -3, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <ArrowLeft className="w-6 h-6 rotate-90" />
          </motion.div>
          
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
