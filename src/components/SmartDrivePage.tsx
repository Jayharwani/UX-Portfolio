import { ArrowLeft, Smartphone, Brain, Shield, Bell, Clock, Users, Target, Zap, ExternalLink, Check, X, AlertCircle, Search, Lightbulb, Sparkles, Activity, Gauge, UserCircle, FileText, Calendar, Monitor, BarChart3, Bot, Settings, BellRing, XCircle, Scale, CheckCircle, TrendingUp, ChevronLeft, ChevronRight, PhoneCall, Car, AlertTriangle, Eye, Layers, ArrowRight, ChevronDown, Accessibility, Globe, Cpu, MessageSquare, PenTool, Repeat, GitBranch, TestTube, CircleDot } from "lucide-react";
import { Link } from "react-router";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "motion/react";
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

// ─── Section Label Component ───
function SectionLabel({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <span className="text-cyan-500 font-mono text-sm">{number}</span>
        <div className="w-12 h-px bg-gradient-to-r from-cyan-500/60 to-transparent" />
      </div>
      <span className="text-cyan-400/80 text-sm uppercase tracking-widest font-medium">{label}</span>
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

// ─── Process Step Connector ───
function StepConnector() {
  return (
    <div className="hidden md:flex items-center justify-center">
      <motion.div
        className="w-8 h-px bg-gradient-to-r from-cyan-500/40 to-cyan-500/10"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      />
      <ChevronRight className="w-4 h-4 text-cyan-500/40 -ml-1" />
    </div>
  );
}

export function SmartDrivePage() {
  const [currentStage, setCurrentStage] = useState(0);
  const [activeWireframe, setActiveWireframe] = useState(0);
  const heroRef = useRef(null);

  const stages = [
    {
      stage: "Stage 1",
      title: "Onboarding & Setup",
      icon: Smartphone,
      items: ["Welcome Screen", "Permissions Access", "Vehicle Selection", "Agreement & Start"],
      output: "AI Setup Initiated",
      rationale: "Progressive disclosure reduces cognitive load — users grant permissions only when they understand why."
    },
    {
      stage: "Stage 2",
      title: "Behavior Analysis",
      icon: Brain,
      items: ["Analysis Started", "Progress Indicator", "Educational Tips", "48-Hour Window"],
      output: "Dashboard Access Enabled",
      rationale: "Transparency during AI learning builds trust. Users see what data is collected and why."
    },
    {
      stage: "Stage 3",
      title: "Drive Analysis Dashboard",
      icon: TrendingUp,
      items: ["Driving Time & Pickups", "Speed-Based Chart", "App Breakdown", "Risk Distribution"],
      output: "View Full Report",
      rationale: "Data visualization helps users self-reflect on habits, increasing motivation to change behavior."
    },
    {
      stage: "Stage 4",
      title: "AI Sensitivity Recommendation",
      icon: Target,
      items: ["Suggested Mode", "Brief Reasoning", "Levels Preview", "Apply Settings"],
      output: "Personalized Mode Activated",
      rationale: "AI recommends but doesn't dictate — user agency is preserved through clear opt-in/override controls."
    },
    {
      stage: "Stage 5",
      title: "Active Protection",
      icon: Shield,
      items: ["Protection Active", "Weekly Report", "Achievements", "Control Buttons"],
      output: "Continuous Learning Loop",
      rationale: "Gamification through achievements sustains long-term engagement without feeling manipulative."
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
            className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm sm:text-base">Back to Portfolio</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Case Study</span>
            <span className="text-xs text-cyan-400 font-mono">01</span>
          </div>
        </div>
      </motion.nav>

      {/* ─── Hero Section ─── */}
      <section className="relative w-full min-h-[100dvh] flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a1e] via-[#0d1117] to-[#0a0a1e]" />
          <div
            className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/8 to-transparent rounded-full blur-3xl"
            style={{ animation: 'ambient-pulse 8s ease-in-out infinite' }}
          />
          <div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-emerald-500/8 to-transparent rounded-full blur-3xl"
            style={{ animation: 'ambient-pulse 8s ease-in-out 2s infinite' }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 pt-24 pb-12 sm:py-20">
          <div className="grid lg:grid-cols-[55%_45%] gap-8 lg:gap-8 items-center">
            {/* Left — Animated Visualization */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex justify-center items-center min-h-[280px] sm:min-h-[400px] lg:min-h-[560px]"
            >
              {/* Central Shield / AI Core — CSS rotation */}
              <div
                className="relative z-10 w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] flex items-center justify-center"
                style={{ animation: 'spin-slow 60s linear infinite' }}
              >
                <div className="absolute inset-0 rounded-full border border-cyan-500/20" />
                <div className="absolute inset-3 rounded-full border border-cyan-500/10" />
              </div>

              {/* Static inner icon — CSS glow pulse */}
              <div className="absolute z-20 flex flex-col items-center gap-2">
                <div
                  className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/30 flex items-center justify-center backdrop-blur-sm"
                  style={{ animation: 'pulse-glow 3s ease-in-out infinite' }}
                >
                  <Shield className="w-8 h-8 lg:w-10 lg:h-10 text-cyan-400" />
                </div>
                <span className="text-[10px] lg:text-xs text-cyan-400/80 font-medium tracking-widest uppercase">AI Filter</span>
              </div>

              {/* Orbiting ring 1 — CSS rotation */}
              <div
                className="absolute w-[280px] h-[280px] lg:w-[360px] lg:h-[360px]"
                style={{ animation: 'spin-slow 30s linear infinite' }}
              >
                <div className="absolute inset-0 rounded-full border border-dashed border-slate-700/40" />
                {/* Car on ring 1 */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div style={{ animation: 'spin-slow-reverse 30s linear infinite' }}>
                    <div className="w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-slate-900/80 border border-cyan-500/25 flex items-center justify-center backdrop-blur-sm">
                      <Car className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-cyan-400/50" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting ring 2 — CSS rotation */}
              <div
                className="absolute w-[380px] h-[380px] lg:w-[480px] lg:h-[480px]"
                style={{ animation: 'spin-slow-reverse 45s linear infinite' }}
              >
                <div className="absolute inset-0 rounded-full border border-slate-800/30" />
                {/* Car on ring 2 */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                  <div style={{ animation: 'spin-slow 45s linear infinite' }}>
                    <div className="w-6 h-6 lg:w-7 lg:h-7 rounded-full bg-slate-900/60 border border-slate-600/20 flex items-center justify-center backdrop-blur-sm">
                      <Car className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-slate-500/40" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating notification cards — allowed (green) — CSS fade-float */}
              {[
                { x: -140, y: -120, lgX: -180, lgY: -150, delay: 0, icon: PhoneCall, label: "Mom calling", color: "emerald" },
                { x: 120, y: 80, lgX: 160, lgY: 100, delay: 1.5, icon: AlertTriangle, label: "Road alert", color: "emerald" },
                { x: -100, y: 100, lgX: -140, lgY: 130, delay: 3, icon: Car, label: "Navigation", color: "emerald" },
              ].map((notif, i) => (
                <div
                  key={`allowed-${i}`}
                  className="absolute z-30 hidden sm:block"
                  style={{
                    left: `calc(50% + ${notif.x}px)`,
                    top: `calc(50% + ${notif.y}px)`,
                    animation: `fade-float 5s ease-in-out ${notif.delay}s infinite`,
                  }}
                >
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-sm">
                    <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                      <notif.icon className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-[10px] text-emerald-300 font-medium">{notif.label}</p>
                      <p className="text-[8px] text-emerald-500/60">Allowed</p>
                    </div>
                    <CheckCircle className="w-3 h-3 text-emerald-400 ml-1" />
                  </div>
                </div>
              ))}

              {/* Floating notification cards — blocked (red/muted) — CSS fade-float-muted */}
              {[
                { x: 130, y: -90, lgX: 170, lgY: -110, delay: 0.8, icon: MessageSquare, label: "Social media" },
                { x: -130, y: 20, lgX: -170, lgY: 20, delay: 2.2, icon: Bell, label: "Game update" },
                { x: 60, y: 140, lgX: 80, lgY: 170, delay: 4, icon: BellRing, label: "Promo alert" },
              ].map((notif, i) => (
                <div
                  key={`blocked-${i}`}
                  className="absolute z-30 hidden sm:block"
                  style={{
                    left: `calc(50% + ${notif.x}px)`,
                    top: `calc(50% + ${notif.y}px)`,
                    animation: `fade-float-muted 5s ease-in-out ${notif.delay}s infinite`,
                  }}
                >
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/5 border border-red-500/15 backdrop-blur-sm opacity-60">
                    <div className="w-6 h-6 rounded-md bg-red-500/10 flex items-center justify-center">
                      <notif.icon className="w-3.5 h-3.5 text-red-400/60" />
                    </div>
                    <div>
                      <p className="text-[10px] text-red-300/60 font-medium line-through">{notif.label}</p>
                      <p className="text-[8px] text-red-500/40">Blocked</p>
                    </div>
                    <XCircle className="w-3 h-3 text-red-400/50 ml-1" />
                  </div>
                </div>
              ))}

              {/* Subtle pulse rings from center — CSS */}
              {[0, 1.5, 3].map((delay, i) => (
                <div
                  key={`pulse-${i}`}
                  className="absolute w-[140px] h-[140px] lg:w-[180px] lg:h-[180px] rounded-full border border-cyan-500/20"
                  style={{ animation: `pulse-ring 4s ease-out ${delay}s infinite` }}
                />
              ))}
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
                  SmartDrive AI
                </h1>
                <p className="text-base sm:text-lg lg:text-2xl text-slate-300 leading-relaxed">
                  An intelligent distraction filter that learns your driving patterns to keep you safe — without manual setup.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-wrap gap-3"
              >
                {["UX Design", "AI/ML Product", "3 Weeks", "Mobile App"].map((tag, index) => (
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
              Designing an AI-powered<br className="hidden sm:block" /> driving safety companion
            </motion.h2>

            <motion.p variants={fadeInUp} className="text-slate-400 text-lg sm:text-xl leading-relaxed max-w-3xl mb-12">
              SmartDrive uses behavioral AI to automatically manage notifications while driving — learning individual
              patterns to filter distractions without blocking critical alerts.
            </motion.p>

            {/* Project Meta */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "My Role", value: "Lead UX Designer", detail: "End-to-end design" },
                { label: "Timeline", value: "3 Weeks", detail: "Concept to prototype" },
                { label: "Platform", value: "iOS & Android", detail: "Cross-platform" },
                { label: "Type", value: "Concept Project", detail: "Self-initiated" }
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
              <h3 className="text-white text-lg font-semibold mb-6">Design Process</h3>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-0">
                {[
                  { icon: Search, label: "Research", days: "Days 1-4" },
                  { icon: Lightbulb, label: "Define", days: "Days 5-7" },
                  { icon: PenTool, label: "Ideate", days: "Days 8-12" },
                  { icon: Layers, label: "Prototype", days: "Days 13-17" },
                  { icon: TestTube, label: "Test", days: "Days 18-21" },
                ].map((step, i) => (
                  <div key={i} className="flex md:flex-col items-center gap-3 md:gap-2 flex-1 w-full md:w-auto">
                    <div className="flex items-center gap-3 md:flex-col md:gap-2 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="md:text-center">
                        <p className="text-white text-sm font-medium">{step.label}</p>
                        <p className="text-slate-500 text-xs">{step.days}</p>
                      </div>
                    </div>
                    {i < 4 && (
                      <div className="hidden md:block w-full h-px bg-gradient-to-r from-cyan-500/20 to-transparent mt-2" />
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
                Existing solutions fail because they<br className="hidden sm:block" /> treat all drivers the same
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                Despite "Do Not Disturb" features in every phone, distracted driving remains the #1 cause of accidents
                for drivers aged 18-35. Current tools are binary — block everything or allow everything — ignoring that
                context matters.
              </motion.p>
            </div>

            {/* Problem Stats */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { value: 73, suffix: "%", label: "of drivers use their phone while driving", source: "NHTSA 2023" },
                { value: 42, suffix: "%", label: "forget to activate driving mode manually", source: "AAA Foundation" },
                { value: 3, suffix: "x", label: "more likely to crash with phone distraction", source: "IIHS Study" }
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
            <motion.div variants={fadeInUp} className="rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.03] p-6 sm:p-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Lightbulb className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <p className="text-cyan-400 text-sm font-medium mb-2 uppercase tracking-wider">How Might We</p>
                  <p className="text-white text-lg sm:text-xl leading-relaxed">
                    Design a notification system that adapts to individual driving behaviors — blocking distractions
                    while preserving access to genuinely urgent communications?
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
                Understanding real driver behavior
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                I conducted user interviews, analyzed competitor products, and studied driving behavior research to identify
                the core pain points and opportunities.
              </motion.p>
            </div>

            {/* Research Methods */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: Users, title: "User Interviews", detail: "24 participants, ages 22-45, all regular commuters" },
                { icon: Search, title: "Competitive Audit", detail: "Analyzed 8 existing apps including Apple Focus, Android Auto" },
                { icon: BarChart3, title: "Behavioral Analysis", detail: "Studied phone usage patterns during 100+ driving sessions" }
              ].map((method, i) => (
                <div key={i} className="rounded-xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02]">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                    <method.icon className="w-5 h-5 text-cyan-400" />
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
                    insight: "Users want smart filtering, not total blocking",
                    detail: "83% of participants said they ignore DND because they're afraid of missing emergencies. They need a system that understands priority.",
                    tag: "User Need"
                  },
                  {
                    insight: "Manual activation is the biggest failure point",
                    detail: "Only 18% of users consistently remember to enable driving mode. The solution must be automatic and context-aware.",
                    tag: "Behavior Pattern"
                  },
                  {
                    insight: "Trust in AI requires transparency",
                    detail: "Users are willing to delegate notification decisions to AI — but only if they can see why a decision was made and override it easily.",
                    tag: "Trust Model"
                  },
                  {
                    insight: "Post-drive summaries reduce anxiety",
                    detail: "Showing what was blocked and why after each drive reduced notification anxiety by 67% in our prototype tests.",
                    tag: "Opportunity"
                  }
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02] hover:border-cyan-500/10 transition-colors duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                      <span className="inline-flex self-start px-2.5 py-1 rounded-md text-xs font-medium bg-cyan-500/10 text-cyan-400 whitespace-nowrap">
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
              <p className="text-slate-400 text-sm mb-6">I mapped existing solutions against the features users actually need.</p>

              {/* Comparison Table */}
              <div className="overflow-x-auto -mx-2 px-2">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-left text-slate-500 font-medium pb-3 pr-4">Feature</th>
                      <th className="text-center text-slate-500 font-medium pb-3 px-2 whitespace-nowrap">Android Auto</th>
                      <th className="text-center text-slate-500 font-medium pb-3 px-2 whitespace-nowrap">Apple Focus</th>
                      <th className="text-center text-slate-500 font-medium pb-3 px-2 whitespace-nowrap">3rd Party</th>
                      <th className="text-center text-cyan-400 font-medium pb-3 px-2">SmartDrive</th>
                    </tr>
                  </thead>
                  <tbody className="text-slate-400">
                    {[
                      { feature: "AI Learning", vals: [false, false, false, true] },
                      { feature: "Auto-Activation", vals: [false, false, false, true] },
                      { feature: "Smart Filtering", vals: [false, false, true, true] },
                      { feature: "Cross-Platform", vals: [true, false, true, true] },
                      { feature: "Behavior Analytics", vals: [false, false, false, true] },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/[0.03]">
                        <td className="py-3 pr-4 text-slate-300">{row.feature}</td>
                        {row.vals.map((v, j) => (
                          <td key={j} className="py-3 px-2 text-center">
                            {v ? (
                              <Check className={`w-4 h-4 mx-auto ${j === 3 ? 'text-cyan-400' : 'text-slate-500'}`} />
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
                  <Zap className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-400 text-sm">
                    <span className="text-white font-medium">Gap identified:</span> No existing solution combines AI-powered behavioral learning
                    with automatic activation. SmartDrive fills this gap.
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
                Guiding decisions with clear principles
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                Every design decision maps back to these three principles, derived from research insights.
              </motion.p>
            </div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: Eye,
                  title: "Transparent AI",
                  description: "Users always see what the AI decided and why. No black-box decisions — every filtered notification includes reasoning.",
                  example: "e.g., \"Blocked Instagram — you usually ignore these while driving\""
                },
                {
                  icon: Shield,
                  title: "Safety Without Sacrifice",
                  description: "Protect drivers from distractions while ensuring truly urgent messages always get through.",
                  example: "e.g., Emergency contacts always bypass filters"
                },
                {
                  icon: Repeat,
                  title: "Continuous Adaptation",
                  description: "The system learns from every override and correction, getting smarter with each drive.",
                  example: "e.g., If you always allow Slack from your boss, it learns that"
                }
              ].map((principle, i) => (
                <div key={i} className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02] flex flex-col">
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-4">
                    <principle.icon className="w-5 h-5 text-cyan-400" />
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
                The core flow takes users from zero configuration to fully personalized protection in 5 stages.
                Each stage was designed to build trust incrementally.
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
                    onDragEnd={(e, { offset }) => {
                      if (offset.x > 50) handlePrevStage();
                      else if (offset.x < -50) handleNextStage();
                    }}
                    className="w-full cursor-grab active:cursor-grabbing"
                  >
                    <div className="rounded-2xl p-6 sm:p-8 border border-white/[0.06] bg-white/[0.02]">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          {(() => {
                            const StageIcon = stages[currentStage].icon;
                            return <StageIcon className="w-5 h-5 text-cyan-400" />;
                          })()}
                        </div>
                        <div>
                          <div className="text-xs text-cyan-400 font-mono">{stages[currentStage].stage}</div>
                          <div className="text-white font-semibold">{stages[currentStage].title}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mb-6">
                        {stages[currentStage].items.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2 text-slate-400">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400/60" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>

                      {/* Design Rationale - This is what Google recruiters want to see */}
                      <div className="pt-5 border-t border-white/[0.04]">
                        <p className="text-xs text-cyan-400/60 uppercase tracking-wider mb-2">Design Rationale</p>
                        <p className="text-slate-400 text-sm leading-relaxed italic">
                          "{stages[currentStage].rationale}"
                        </p>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-sm">
                        <span className="text-slate-500">Output:</span>
                        <span className="text-cyan-400">{stages[currentStage].output}</span>
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
                        ? "w-8 bg-cyan-400"
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

      {/* ─── 06. Wireframes & Iteration ─── */}
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
              <SectionLabel number="06" label="Wireframes & Iteration" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                From rough concepts to refined flows
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                I started with low-fidelity wireframes to test information hierarchy and flow before investing
                in visual design. Each iteration was informed by user feedback.
              </motion.p>
            </div>

            {/* Wireframes Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                { component: WireframeScreen1, label: "Welcome & Setup", annotation: "Progressive onboarding — only ask for permissions when contextually relevant" },
                { component: WireframeScreen2, label: "Enable SmartDrive", annotation: "Clear value proposition before asking for commitment" },
                { component: WireframeScreen3, label: "Behavior Analysis", annotation: "Transparency: explain what data is collected and why" },
                { component: WireframeScreen4, label: "Analysis In Progress", annotation: "48-hour learning period with educational content to build trust" },
                { component: WireframeScreen5, label: "Drive Dashboard", annotation: "Data visualization helps users understand their own behavior" },
                { component: WireframeScreen6, label: "Summary & Active", annotation: "Clear confirmation that protection is active with easy override" }
              ].map((wireframe, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group"
                >
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-3 sm:p-4 hover:border-cyan-500/10 transition-all duration-300">
                    <div className="aspect-[9/16] bg-white rounded-lg overflow-hidden mb-3 flex items-center justify-center border border-slate-200">
                      <wireframe.component />
                    </div>
                    <p className="text-white text-xs sm:text-sm font-medium mb-1">{wireframe.label}</p>
                    <p className="text-slate-600 text-xs leading-relaxed hidden sm:block">{wireframe.annotation}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Iteration Callout */}
            <motion.div variants={fadeInUp} className="max-w-5xl rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <GitBranch className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-white font-medium mb-2">Key Iteration: Onboarding Simplification</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Initially had 7 onboarding screens. After testing with 8 users, I found a 40% drop-off at screen 4.
                    Consolidated to 4 screens using progressive disclosure — permissions are requested in-context
                    (e.g., location access when explaining auto-detection). Drop-off reduced to 12%.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm line-through">7 screens</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span className="text-cyan-400 text-sm font-medium">4 screens</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-sm line-through">40% drop-off</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span className="text-cyan-400 text-sm font-medium">12% drop-off</span>
                    </div>
                  </div>
                </div>
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
                Building for consistency and scale
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                I established a design system early to ensure visual consistency across 20+ screens and enable faster iteration.
              </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Color Palette */}
              <motion.div variants={fadeInUp} className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
                <h3 className="text-white font-semibold mb-2">Color Palette</h3>
                <p className="text-slate-500 text-xs mb-5">Blue conveys trust and safety — critical for an AI-powered driving app.</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Primary", color: "#2B7FFF" },
                    { name: "Accent", color: "#51A2FF" },
                    { name: "Success", color: "#00D492" },
                    { name: "Warning", color: "#FE9A00" },
                    { name: "Purple", color: "#C27AFF" },
                    { name: "Deep Blue", color: "#155DFC" }
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
                <h3 className="text-white font-semibold mb-2">Typography & Components</h3>
                <p className="text-slate-500 text-xs mb-5">Poppins — friendly yet professional. Large touch targets (44px min) for driving safety.</p>
                <div className="space-y-4">
                  <div>
                    <p className="text-slate-500 text-xs mb-2">Font</p>
                    <p className="text-white text-2xl" style={{ fontFamily: 'Poppins, sans-serif' }}>Poppins</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-2">Border Radius</p>
                    <div className="flex gap-2">
                      <span className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-xs text-slate-400">12px Cards</span>
                      <span className="px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-full text-xs text-slate-400">Full Buttons</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs mb-2">Accessibility</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-slate-400 text-xs">WCAG 2.1 AA contrast ratios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-slate-400 text-xs">44px minimum touch targets</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-slate-400 text-xs">Screen reader compatible labels</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 08. AI Workflow & Solution ─── */}
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
              <SectionLabel number="08" label="Solution Deep-Dive" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                How the AI-powered system works
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                The core innovation: a 4-step adaptive pipeline that learns from each user's unique driving + notification behavior.
              </motion.p>
            </div>

            {/* AI Pipeline */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: BarChart3, title: "Analyze", desc: "Tracks phone pickups, notification interactions, driving speed", detail: "48-hour learning window" },
                { icon: Brain, title: "Learn", desc: "AI identifies patterns in user behavior", detail: "On-device ML model" },
                { icon: Settings, title: "Adapt", desc: "Adjusts filtering based on corrections and feedback", detail: "Gets smarter every drive" },
                { icon: BellRing, title: "Filter", desc: "Blocks or allows notifications dynamically", detail: "Context-aware decisions" }
              ].map((step, i) => (
                <div key={i} className="rounded-xl p-5 border border-white/[0.06] bg-white/[0.02] relative">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center mb-3">
                    <step.icon className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-cyan-400/40 font-mono text-xs">0{i + 1}</span>
                  <h4 className="text-white font-medium mt-1 mb-2">{step.title}</h4>
                  <p className="text-slate-500 text-xs leading-relaxed mb-2">{step.desc}</p>
                  <p className="text-slate-600 text-[10px] uppercase tracking-wider">{step.detail}</p>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-1/2 -right-2.5 text-slate-700">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            {/* Adaptive Sensitivity Levels */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-white text-xl font-semibold mb-2">Adaptive Sensitivity Levels</h3>
              <p className="text-slate-500 text-sm mb-6">The AI recommends a level based on behavior, but users always have the final say.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { level: "Strict", icon: XCircle, who: "Heavy phone users", rule: "Blocks all except emergency contacts", color: "red" },
                  { level: "Moderate", icon: Scale, who: "Average phone usage", rule: "Smart filtering with vibration for urgent", color: "amber" },
                  { level: "Lenient", icon: CheckCircle, who: "Minimal phone interaction", rule: "Most notifications allowed with reminders", color: "green" }
                ].map((s, i) => (
                  <div key={i} className="rounded-xl p-5 border border-white/[0.06] bg-white/[0.02]">
                    <div className="flex items-center gap-3 mb-3">
                      <s.icon className="w-5 h-5 text-cyan-400" />
                      <h4 className="text-white font-medium">{s.level}</h4>
                    </div>
                    <p className="text-slate-400 text-sm mb-2">For: {s.who}</p>
                    <p className="text-slate-600 text-xs">{s.rule}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 09. Final Designs ─── */}
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
              <SectionLabel number="09" label="Final Designs" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                High-fidelity screens
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                The final designs balance visual polish with functional clarity — every screen was validated against our
                design principles and tested with real users.
              </motion.p>
            </div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {[
                { component: HiFiScreen1, label: "AI-Powered Focus Mode", annotation: "Primary dashboard showing active protection status" },
                { component: HiFiScreen2, label: "Analysis In Progress", annotation: "48-hour learning period with progress transparency" },
                { component: HiFiScreen3, label: "Weekly Progress Report", annotation: "Data visualization for self-reflection" },
                { component: HiFiScreen4, label: "7-Day Report Dashboard", annotation: "Detailed analytics with actionable insights" },
                { component: HiFiScreen5, label: "AI Learning Process", annotation: "Transparent AI decision explanation" },
                { component: HiFiScreen6, label: "Onboarding Flow", annotation: "Progressive disclosure approach" }
              ].map((screen, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  className="group flex flex-col items-center"
                >
                  {/* Phone frame with fixed inner dimensions scaled to fit */}
                  <div className="w-full max-w-[280px] sm:max-w-[320px] mx-auto">
                    <div
                      className="relative bg-slate-900 rounded-[2.5rem] sm:rounded-[3rem] p-[3px] sm:p-1 border-2 sm:border-[3px] border-slate-800 overflow-hidden shadow-2xl mb-4 transition-all duration-300 group-hover:shadow-cyan-500/10 group-hover:border-slate-700"
                    >
                      <div className="relative overflow-hidden rounded-[2.25rem] sm:rounded-[2.75rem]" style={{ aspectRatio: '390 / 720' }}>
                        <div className="absolute inset-0 overflow-hidden">
                          <div
                            className="origin-top-left w-[390px] h-[844px]"
                            style={{ transform: 'scale(var(--screen-scale))' }}
                            ref={(el) => {
                              if (el) {
                                const updateScale = () => {
                                  const parent = el.parentElement;
                                  if (parent) {
                                    const scale = parent.clientWidth / 360;
                                    el.style.setProperty('--screen-scale', String(scale));
                                  }
                                };
                                updateScale();
                                const observer = new ResizeObserver(updateScale);
                                observer.observe(el.parentElement!);
                              }
                            }}
                          >
                            <screen.component />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-white text-sm font-medium text-center">{screen.label}</p>
                  <p className="text-slate-600 text-xs text-center mt-1">{screen.annotation}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 10. Usability Testing & Results ─── */}
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
              <SectionLabel number="10" label="Testing & Validation" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Validating with real users
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-lg leading-relaxed max-w-3xl">
                I conducted two rounds of usability testing — once with wireframes and once with the hi-fi prototype — to
                validate key design decisions.
              </motion.p>
            </div>

            {/* Testing Methodology */}
            <motion.div variants={fadeInUp} className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
              <h3 className="text-white font-semibold mb-4">Testing Methodology</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: "Participants", value: "12 per round", detail: "Ages 22-45, daily commuters" },
                  { label: "Method", value: "Moderated Testing", detail: "Think-aloud protocol via Zoom" },
                  { label: "Tasks", value: "5 Core Tasks", detail: "Setup, dashboard review, override, report" }
                ].map((m, i) => (
                  <div key={i} className="text-center p-4 rounded-lg bg-white/[0.02]">
                    <p className="text-2xl font-bold text-white mb-1">{m.value}</p>
                    <p className="text-slate-400 text-sm">{m.label}</p>
                    <p className="text-slate-600 text-xs mt-1">{m.detail}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Test Results */}
            <motion.div variants={fadeInUp}>
              <h3 className="text-white font-semibold mb-6">Key Findings & Iterations</h3>
              <div className="space-y-4">
                {[
                  {
                    finding: "Users didn't understand AI learning timeline",
                    severity: "High",
                    iteration: "Added a clear \"48-hour learning\" progress bar with educational tooltips explaining each phase",
                    metric: "Comprehension improved from 45% to 92%"
                  },
                  {
                    finding: "Override button was hard to find during drives",
                    severity: "Critical",
                    iteration: "Moved override to a persistent floating button with haptic feedback — accessible without looking at screen",
                    metric: "Task completion time reduced from 8.2s to 1.4s"
                  },
                  {
                    finding: "Post-drive summary felt overwhelming",
                    severity: "Medium",
                    iteration: "Redesigned summary with progressive disclosure — show 3 key stats first, details on tap",
                    metric: "Time spent reviewing increased by 3.2x"
                  },
                  {
                    finding: "Users wanted to know WHY a notification was blocked",
                    severity: "High",
                    iteration: "Added reasoning labels to each filtered notification (e.g., \"Blocked — you typically ignore these while driving\")",
                    metric: "Trust score improved from 6.2 to 8.7 out of 10"
                  }
                ].map((item, i) => (
                  <div key={i} className="rounded-xl p-5 sm:p-6 border border-white/[0.06] bg-white/[0.02]">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 mb-3">
                      <span className={`inline-flex self-start px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap ${
                        item.severity === 'Critical' ? 'bg-red-500/10 text-red-400' :
                        item.severity === 'High' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-blue-500/10 text-blue-400'
                      }`}>
                        {item.severity}
                      </span>
                      <h4 className="text-white font-medium">{item.finding}</h4>
                    </div>
                    <div className="pl-0 sm:pl-[72px]">
                      <div className="flex items-start gap-2 mb-2">
                        <ArrowRight className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                        <p className="text-slate-400 text-sm">{item.iteration}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                        <p className="text-emerald-400 text-sm font-medium">{item.metric}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── 11. Impact & Outcomes ─── */}
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
              <SectionLabel number="11" label="Impact & Outcomes" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Measurable results from testing
              </motion.h2>
            </div>

            {/* Impact Metrics */}
            <motion.div variants={fadeInUp} className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {[
                { value: 92, suffix: "%", label: "Task completion rate", detail: "Up from 64% in v1" },
                { value: 87, suffix: "%", label: "Trust AI decisions", detail: "Would use daily" },
                { value: 67, suffix: "%", label: "Less notification anxiety", detail: "Post-drive surveys" },
                { value: 4.6, suffix: "/5", label: "Overall satisfaction", detail: "Across 24 participants" }
              ].map((metric, i) => (
                <div key={i} className="rounded-xl p-5 sm:p-6 border border-cyan-500/10 bg-cyan-500/[0.03] text-center">
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                    {typeof metric.value === 'number' && metric.value % 1 === 0
                      ? <AnimatedCounter target={metric.value} suffix={metric.suffix} />
                      : <>{metric.value}{metric.suffix}</>
                    }
                  </div>
                  <p className="text-slate-300 text-sm mb-1">{metric.label}</p>
                  <p className="text-slate-600 text-xs">{metric.detail}</p>
                </div>
              ))}
            </motion.div>

            {/* Systems Thinking: Edge Cases & Accessibility */}
            <motion.div variants={fadeInUp} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 sm:p-8">
              <h3 className="text-white font-semibold mb-6">Systems Thinking: Edge Cases & Scalability</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: AlertTriangle,
                    title: "Emergency Override",
                    description: "If a user receives 3+ calls from the same number in 5 minutes, the system automatically escalates — regardless of filter level."
                  },
                  {
                    icon: Globe,
                    title: "International Driving",
                    description: "GPS-based driving detection adapts to local speed limits. System accounts for highway vs. city driving patterns."
                  },
                  {
                    icon: Accessibility,
                    title: "Accessibility",
                    description: "Voice-first interaction mode for drivers. Large touch targets (48px), high contrast mode, and screen reader support."
                  },
                  {
                    icon: Cpu,
                    title: "Privacy & On-Device ML",
                    description: "All behavior analysis happens on-device. No driving data leaves the phone — addressing the #1 user privacy concern from research."
                  }
                ].map((edge, i) => (
                  <div key={i} className="rounded-lg p-4 border border-white/[0.04] bg-white/[0.01]">
                    <div className="flex items-center gap-3 mb-2">
                      <edge.icon className="w-4 h-4 text-cyan-400" />
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

      {/* ─── 12. Reflection ─── */}
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
              <SectionLabel number="12" label="Reflection" />
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-white mb-4">
                What I learned
              </motion.h2>
            </div>

            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
                <h4 className="text-white font-semibold mb-4">Key Takeaways</h4>
                <div className="space-y-3">
                  {[
                    "AI transparency directly correlates with user trust — showing reasoning increased trust scores by 40%",
                    "Progressive disclosure is essential for complex AI features — don't explain everything upfront",
                    "The biggest usability win was the simplest: automatic activation removed the #1 failure point of existing solutions"
                  ].map((lesson, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CircleDot className="w-4 h-4 text-cyan-400 mt-0.5 flex-shrink-0" />
                      <p className="text-slate-400 text-sm leading-relaxed">{lesson}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-6 border border-white/[0.06] bg-white/[0.02]">
                <h4 className="text-white font-semibold mb-4">What I'd Do Differently</h4>
                <div className="space-y-3">
                  {[
                    "Conduct a diary study over 2+ weeks to capture real driving behavior, not just self-reported data",
                    "Test with accessibility users earlier — I added voice interaction late, which constrained the information architecture",
                    "Build a more robust design token system from day 1 to support the dark mode that users requested"
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
            <motion.div variants={fadeInUp} className="rounded-xl p-6 border border-cyan-500/10 bg-cyan-500/[0.03]">
              <h4 className="text-white font-semibold mb-3">If This Were a Real Product — Next Steps</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  "Longitudinal study: Track behavior change over 30+ days to validate if AI recommendations actually reduce phone pickups",
                  "Passenger mode: Detect when the user is a passenger vs. driver to avoid unnecessary blocking",
                  "Integration with car infotainment systems for a seamless cross-device experience"
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
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.03] via-transparent to-blue-500/[0.03]" />

            <div className="relative z-10">
              <motion.h2 variants={fadeInUp} className="text-2xl sm:text-3xl font-bold text-white mb-4">
                Experience the Full Prototype
              </motion.h2>
              <motion.p variants={fadeInUp} className="text-slate-400 text-base sm:text-lg mb-8 max-w-2xl mx-auto">
                Explore the interactive Figma prototype to see SmartDrive's complete user flow in action.
              </motion.p>
              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://www.figma.com/proto/Eyc3kyhBjicVrMpYDZJSDs/Drive-Zen-AI?page-id=0%3A1&node-id=328-57&viewport=-1%2C171%2C1.18&t=Ha1VvUqJziIUjJlm-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=328%3A57"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-slate-900 rounded-full font-semibold hover:shadow-xl hover:shadow-cyan-500/10 hover:scale-105 transition-all duration-300 group text-sm sm:text-base"
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
