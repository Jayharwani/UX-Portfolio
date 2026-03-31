import { Footer } from "./Footer";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  Briefcase,
  Plane,
  Lightbulb,
  FlaskConical,
  Bot,
  Rocket,
  Mail,
  Linkedin,
  FileText,
  Search,
  Palette,
  Code,
  Layers,
  Users,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import userPhoto from "../assets/hero-portrait.jpeg";

/* ------------------------------------------------------------------ */
/*  Animated Counter Hook                                              */
/* ------------------------------------------------------------------ */
function useCounter(end: number, duration: number, inView: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [end, duration, inView]);
  return count;
}

/* ------------------------------------------------------------------ */
/*  3D Tilt Card for Photo                                             */
/* ------------------------------------------------------------------ */
function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState("perspective(1000px) rotateX(0deg) rotateY(0deg)");

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setTransform("perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)");
  }, []);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={{ transform, transition: "transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99)", transformStyle: "preserve-3d" }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Floating Particle Background                                       */
/* ------------------------------------------------------------------ */
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 3 + 1,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 10,
    opacity: Math.random() * 0.15 + 0.05,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            backgroundColor: "rgba(255,255,255,0.6)",
            opacity: p.opacity,
            animation: `float-y ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Section Header                                                     */
/* ------------------------------------------------------------------ */
function SectionHeader({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 mb-12 sm:mb-16">
      <span className="text-cyan-500 font-mono text-sm">{number}</span>
      <div className="w-12 h-px bg-gradient-to-r from-cyan-500/60 to-transparent" />
      <span
        className="text-cyan-400/80 text-sm uppercase tracking-widest font-medium"
        style={{ fontFamily: "DM Sans, sans-serif" }}
      >
        {label}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */
const journeyMilestones = [
  {
    year: "2020",
    title: "The Spark",
    location: "Mumbai, India",
    description:
      "Discovered the magic of design at university. What started as curiosity about why some apps felt effortless quickly became an obsession with human-centered thinking.",
    icon: Lightbulb,
    color: "rgba(251,191,36,0.8)",
    accentBg: "rgba(251,191,36,0.08)",
  },
  {
    year: "2023",
    title: "First Steps into UX",
    location: "Remote, India",
    description:
      "Landed my first UX internship at Metafic. Learned the fundamentals of mobile UX and cross-platform design. Shipped real products for the first time.",
    icon: Palette,
    color: "rgba(167,139,250,0.8)",
    accentBg: "rgba(167,139,250,0.08)",
  },
  {
    year: "2023 – 2024",
    title: "Enterprise at Scale",
    location: "Gujarat, India",
    description:
      "Joined Welspun GCC as a UX Designer. Designed enterprise e-commerce systems serving thousands of B2B users. Learned what it means to design for complexity, stakeholder alignment, and business impact.",
    icon: Briefcase,
    color: "rgba(45,212,191,0.8)",
    accentBg: "rgba(45,212,191,0.08)",
  },
  {
    year: "2024",
    title: "Crossing Oceans",
    location: "Baltimore, USA",
    description:
      "Made the leap to pursue a Master's in Human-Computer Interaction at UMBC. A new continent, a new chapter, and a deeper commitment to design research.",
    icon: Plane,
    color: "rgba(96,165,250,0.8)",
    accentBg: "rgba(96,165,250,0.08)",
  },
  {
    year: "2024 – 2025",
    title: "Research & Discovery",
    location: "UMBC, Baltimore",
    description:
      "Dove deep into AI, robotics, behavior analysis, and accessibility research. Contributed to the Image Research Center and HCC Research groups. Every study sharpened how I think about people.",
    icon: FlaskConical,
    color: "rgba(244,114,182,0.8)",
    accentBg: "rgba(244,114,182,0.08)",
  },
  {
    year: "2025 – Present",
    title: "Building the Future",
    location: "UMBC CARDS Lab",
    description:
      "Designing AI and robotics dashboards at the CARDS Lab. Bridging the gap between cutting-edge technology and intuitive human interaction.",
    icon: Bot,
    color: "rgba(52,211,153,0.8)",
    accentBg: "rgba(52,211,153,0.08)",
  },
  {
    year: "Next",
    title: "What Comes Next",
    location: "Anywhere impact lives",
    description:
      "Seeking a full-time UX role where I can design at scale, advocate for users, and help teams build products that genuinely matter.",
    icon: Rocket,
    color: "rgba(255,255,255,0.8)",
    accentBg: "rgba(255,255,255,0.06)",
  },
];

const skills = [
  {
    title: "UX Research",
    description: "User interviews, usability testing, behavioral analysis, and data-driven insights that shape product direction.",
    icon: Search,
    gradient: "from-cyan-500/20 to-blue-500/20",
  },
  {
    title: "Product Design",
    description: "End-to-end design from wireframes to high-fidelity prototypes. Design systems, interaction patterns, and visual polish.",
    icon: Layers,
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Prototyping",
    description: "Interactive prototypes in Figma and code. I bridge the gap between design intent and engineering reality.",
    icon: Code,
    gradient: "from-teal-500/20 to-emerald-500/20",
  },
  {
    title: "User Advocacy",
    description: "Championing user needs in every sprint, stakeholder meeting, and design review. Making the case for what matters.",
    icon: Users,
    gradient: "from-amber-500/20 to-orange-500/20",
  },
  {
    title: "Data Analysis",
    description: "Translating analytics, heatmaps, and A/B test results into actionable design improvements that move metrics.",
    icon: BarChart3,
    gradient: "from-rose-500/20 to-red-500/20",
  },
  {
    title: "Design Systems",
    description: "Building scalable component libraries, tokens, and guidelines that create consistency across products.",
    icon: Sparkles,
    gradient: "from-indigo-500/20 to-violet-500/20",
  },
];

const experiences = [
  {
    company: "UMBC CARDS Lab",
    role: "UX Designer & Developer",
    period: "Jul 2025 -- Present",
    tags: ["AI", "Robotics", "Dashboard"],
    accent: "rgba(45,212,191,0.6)",
  },
  {
    company: "Welspun GCC",
    role: "UX Designer",
    period: "Jun 2023 -- Jul 2024",
    tags: ["E-commerce", "B2B", "Enterprise"],
    accent: "rgba(96,165,250,0.6)",
  },
  {
    company: "UMBC Image Research Center",
    role: "UI Designer Volunteer",
    period: "Sep 2024 -- Jan 2025",
    tags: ["Visual Design", "Accessibility"],
    accent: "rgba(244,114,182,0.6)",
  },
  {
    company: "UMBC HCC Research",
    role: "UX & HCC Research Volunteer",
    period: "Sep 2024 -- Mar 2025",
    tags: ["AI", "Behavior Analysis"],
    accent: "rgba(167,139,250,0.6)",
  },
  {
    company: "Metafic",
    role: "UX Design Intern",
    period: "Feb 2023 -- May 2023",
    tags: ["Mobile UX", "Cross-Platform"],
    accent: "rgba(251,191,36,0.6)",
  },
];

/* ================================================================== */
/*  ABOUT PAGE                                                         */
/* ================================================================== */
export function AboutPage() {
  /* Refs for sections */
  const heroRef = useRef(null);
  const journeyRef = useRef(null);
  const skillsRef = useRef(null);
  const philosophyRef = useRef(null);
  const experienceRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  /* InView hooks */
  const heroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const journeyInView = useInView(journeyRef, { once: true, amount: 0.1 });
  const skillsInView = useInView(skillsRef, { once: true, amount: 0.15 });
  const philosophyInView = useInView(philosophyRef, { once: true, amount: 0.3 });
  const experienceInView = useInView(experienceRef, { once: true, amount: 0.1 });
  const statsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  /* Parallax for hero */
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0.3]);

  /* Animated counters */
  const yearsCount = useCounter(2, 1500, statsInView);
  const projectsCount = useCounter(10, 1500, statsInView);
  const toolsCount = useCounter(15, 1500, statsInView);

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: "#0A0A0A" }}>
      {/* ============================================================ */}
      {/*  BACKGROUND LAYER: gradient orbs + particles + noise          */}
      {/* ============================================================ */}

      {/* Gradient mesh orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full"
          style={{
            top: "-10%",
            right: "-10%",
            background: "radial-gradient(circle, rgba(45,212,191,0.07) 0%, transparent 70%)",
            animation: "ambient-pulse 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{
            top: "40%",
            left: "-15%",
            background: "radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)",
            animation: "ambient-pulse 10s ease-in-out 2s infinite",
          }}
        />
        <div
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{
            bottom: "5%",
            right: "10%",
            background: "radial-gradient(circle, rgba(244,114,182,0.05) 0%, transparent 70%)",
            animation: "ambient-pulse 12s ease-in-out 4s infinite",
          }}
        />
      </div>

      <FloatingParticles />

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          mixBlendMode: "overlay",
        }}
      />

      {/* ============================================================ */}
      {/*  FIXED NAV                                                    */}
      {/* ============================================================ */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          backgroundColor: "rgba(10,10,10,0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm" style={{ fontFamily: "DM Sans, sans-serif" }}>
              Back to Portfolio
            </span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://www.linkedin.com/in/jay-harwani/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.1em] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all hover:scale-105 flex items-center justify-center"
              style={{
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              LinkedIn
            </a>
            <a
              href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] sm:text-[12px] font-semibold uppercase tracking-[0.1em] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all hover:scale-105 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: "DM Sans, sans-serif",
              }}
            >
              Resume
            </a>
          </div>
        </div>
      </motion.nav>

      {/* ============================================================ */}
      {/*  HERO SECTION                                                 */}
      {/* ============================================================ */}
      <motion.section
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 px-4 sm:px-6 overflow-hidden z-20"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[380px_1fr] gap-12 lg:gap-20 items-center">
            {/* 3D Tilt Photo Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="relative max-w-[380px] mx-auto lg:mx-0 cursor-default">
                <div
                  className="rounded-2xl overflow-hidden relative"
                  style={{
                    border: "1px solid rgba(255,255,255,0.1)",
                    boxShadow: "0 25px 60px -15px rgba(0,0,0,0.5), 0 0 40px rgba(45,212,191,0.06)",
                  }}
                >
                  <img
                    src={userPhoto}
                    alt="Jay Harwani"
                    className="w-full aspect-[3/4] object-cover object-top"
                    loading="eager"
                  />
                  {/* Gradient overlay at bottom */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-32"
                    style={{
                      background: "linear-gradient(to top, #0A0A0A, rgba(10,10,10,0.6), transparent)",
                    }}
                  />
                  {/* Name overlay */}
                  <div className="absolute bottom-4 left-5 right-5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-white/60" />
                      <span
                        className="text-[13px] text-white/60"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        Baltimore, MD
                      </span>
                    </div>
                  </div>
                </div>
                {/* Ambient glow behind card */}
                <div
                  className="absolute -inset-4 rounded-3xl -z-10"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(45,212,191,0.05) 0%, transparent 70%)",
                    animation: "ambient-pulse 6s ease-in-out infinite",
                  }}
                />
              </TiltCard>
            </motion.div>

            {/* Hero Text Content */}
            <div className="space-y-8">
              {/* Animated headline with staggered reveal */}
              <div className="overflow-hidden">
                <motion.div
                  initial={{ opacity: 0, y: 60 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <p
                    className="text-sm uppercase tracking-[0.25em] mb-5"
                    style={{ fontFamily: "DM Sans, sans-serif", color: "rgba(45,212,191,0.7)" }}
                  >
                    UX Designer & Researcher
                  </p>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 60 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[38px] sm:text-[48px] md:text-[58px] lg:text-[64px] font-extrabold leading-[1.02] tracking-[-0.035em]"
                  style={{ fontFamily: "Syne, sans-serif" }}
                >
                  <span style={{ color: "#FFFFFF" }}>I'm Jay </span>
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>--</span>
                  <br className="hidden sm:block" />
                  <span
                    style={{
                      background: "linear-gradient(135deg, rgba(45,212,191,0.9), rgba(96,165,250,0.9), rgba(168,85,247,0.9))",
                      backgroundClip: "text",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundSize: "200% 200%",
                      animation: "gradient-shift 6s ease-in-out infinite",
                    }}
                  >
                    a designer who
                  </span>
                  <br className="hidden md:block" />
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>thinks in systems.</span>
                </motion.h1>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.6 }}
                className="space-y-4 max-w-xl"
              >
                <p
                  className="text-[15px] sm:text-[17px] leading-[1.85]"
                  style={{ color: "rgba(255,255,255,0.65)", fontFamily: "DM Sans, sans-serif" }}
                >
                  I design products at the intersection of behavioral science and technology.
                  My work focuses on creating interfaces that feel invisible -- where the
                  interaction between human intent and digital response is seamless.
                </p>
                <p
                  className="text-[15px] sm:text-[17px] leading-[1.85]"
                  style={{ color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans, sans-serif" }}
                >
                  From enterprise B2B platforms serving thousands to AI-powered research tools,
                  I bring a research-first mindset and a systems-thinking approach to every challenge.
                </p>
              </motion.div>

              {/* Quick action links */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-wrap gap-3 pt-2"
              >
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/jay-harwani/", Icon: Linkedin },
                  { label: "Email", href: "mailto:harwanijay9498@gmail.com", Icon: Mail },
                  {
                    label: "Resume",
                    href: "https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing",
                    Icon: FileText,
                  },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target={link.href.startsWith("mailto") ? undefined : "_blank"}
                    rel={link.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                    className="group inline-flex items-center gap-2 text-[13px] font-medium px-5 py-2.5 rounded-full transition-all duration-300 hover:scale-105"
                    style={{
                      color: "rgba(255,255,255,0.7)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      fontFamily: "DM Sans, sans-serif",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(45,212,191,0.3)";
                      e.currentTarget.style.backgroundColor = "rgba(45,212,191,0.05)";
                      e.currentTarget.style.color = "rgba(255,255,255,0.9)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    <link.Icon className="w-3.5 h-3.5" />
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ============================================================ */}
      {/*  STATS COUNTER SECTION                                        */}
      {/* ============================================================ */}
      <section ref={statsRef} className="relative py-16 sm:py-24 px-4 sm:px-6 z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={statsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          >
            {[
              { value: `${yearsCount}+`, label: "Years of Experience", suffix: "" },
              { value: `${projectsCount}+`, label: "Projects Shipped", suffix: "" },
              { value: "M.S.", label: "HCI at UMBC, 2026", suffix: "" },
              { value: `${toolsCount}+`, label: "Design Tools Mastered", suffix: "" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                className="text-center py-8 sm:py-10 rounded-2xl relative overflow-hidden"
                style={{
                  border: "1px solid rgba(255,255,255,0.06)",
                  backgroundColor: "rgba(255,255,255,0.02)",
                }}
              >
                {/* Subtle gradient glow */}
                <div
                  className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: "radial-gradient(circle at center, rgba(45,212,191,0.04) 0%, transparent 70%)",
                  }}
                />
                <p
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 relative"
                  style={{
                    fontFamily: "Syne, sans-serif",
                    background: "linear-gradient(135deg, #fff 30%, rgba(45,212,191,0.8))",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-[12px] sm:text-[13px] uppercase tracking-wider relative"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "DM Sans, sans-serif" }}
                >
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  LIFE JOURNEY TIMELINE                                        */}
      {/* ============================================================ */}
      <section ref={journeyRef} className="relative py-20 sm:py-32 px-4 sm:px-6 z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={journeyInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <SectionHeader number="01" label="The Journey" />

            <div className="relative">
              {/* Vertical timeline line */}
              <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-px">
                <motion.div
                  className="w-full h-full"
                  style={{
                    background: "linear-gradient(to bottom, transparent, rgba(45,212,191,0.2) 10%, rgba(168,85,247,0.2) 50%, rgba(244,114,182,0.2) 90%, transparent)",
                  }}
                  initial={{ scaleY: 0, transformOrigin: "top" }}
                  animate={journeyInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
              </div>

              {/* Mobile timeline line */}
              <div className="md:hidden absolute left-6 top-0 bottom-0 w-px">
                <motion.div
                  className="w-full h-full"
                  style={{
                    background: "linear-gradient(to bottom, transparent, rgba(45,212,191,0.2) 10%, rgba(168,85,247,0.2) 50%, rgba(244,114,182,0.2) 90%, transparent)",
                  }}
                  initial={{ scaleY: 0 }}
                  animate={journeyInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
              </div>

              {/* Milestones */}
              <div className="space-y-8 md:space-y-16">
                {journeyMilestones.map((milestone, i) => {
                  const isLeft = i % 2 === 0;
                  const IconComponent = milestone.icon;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 40, x: isLeft ? -20 : 20 }}
                      animate={journeyInView ? { opacity: 1, y: 0, x: 0 } : {}}
                      transition={{
                        duration: 0.7,
                        delay: 0.3 + i * 0.15,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="relative"
                    >
                      {/* Desktop layout: alternating sides */}
                      <div className="hidden md:grid md:grid-cols-[1fr_60px_1fr] items-center gap-0">
                        {/* Left content or spacer */}
                        <div className={isLeft ? "pr-8" : ""}>
                          {isLeft && (
                            <div
                              className="p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02] group"
                              style={{
                                border: "1px solid rgba(255,255,255,0.06)",
                                backgroundColor: milestone.accentBg,
                              }}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <span
                                  className="text-[13px] font-bold uppercase tracking-wider"
                                  style={{ color: milestone.color, fontFamily: "Syne, sans-serif" }}
                                >
                                  {milestone.year}
                                </span>
                                <span
                                  className="text-[11px] px-2.5 py-0.5 rounded-full"
                                  style={{
                                    color: "rgba(255,255,255,0.55)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    fontFamily: "DM Sans, sans-serif",
                                  }}
                                >
                                  {milestone.location}
                                </span>
                              </div>
                              <h3
                                className="text-[18px] sm:text-[20px] font-bold text-white mb-2"
                                style={{ fontFamily: "Syne, sans-serif" }}
                              >
                                {milestone.title}
                              </h3>
                              <p
                                className="text-[14px] leading-[1.75]"
                                style={{ color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans, sans-serif" }}
                              >
                                {milestone.description}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Center: milestone marker */}
                        <div className="flex justify-center relative">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                            style={{
                              backgroundColor: milestone.accentBg,
                              border: `2px solid ${milestone.color}`,
                              boxShadow: `0 0 20px ${milestone.color.replace("0.8", "0.15")}`,
                            }}
                          >
                            <IconComponent className="w-5 h-5" style={{ color: milestone.color }} />
                          </div>
                          {/* Pulse ring */}
                          <div
                            className="absolute inset-0 w-12 h-12 rounded-full m-auto"
                            style={{
                              border: `1px solid ${milestone.color}`,
                              animation: "pulse-ring 3s ease-out infinite",
                              animationDelay: `${i * 0.5}s`,
                            }}
                          />
                        </div>

                        {/* Right content or spacer */}
                        <div className={!isLeft ? "pl-8" : ""}>
                          {!isLeft && (
                            <div
                              className="p-6 rounded-2xl transition-all duration-500 hover:scale-[1.02] group"
                              style={{
                                border: "1px solid rgba(255,255,255,0.06)",
                                backgroundColor: milestone.accentBg,
                              }}
                            >
                              <div className="flex items-center gap-3 mb-3">
                                <span
                                  className="text-[13px] font-bold uppercase tracking-wider"
                                  style={{ color: milestone.color, fontFamily: "Syne, sans-serif" }}
                                >
                                  {milestone.year}
                                </span>
                                <span
                                  className="text-[11px] px-2.5 py-0.5 rounded-full"
                                  style={{
                                    color: "rgba(255,255,255,0.55)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    fontFamily: "DM Sans, sans-serif",
                                  }}
                                >
                                  {milestone.location}
                                </span>
                              </div>
                              <h3
                                className="text-[18px] sm:text-[20px] font-bold text-white mb-2"
                                style={{ fontFamily: "Syne, sans-serif" }}
                              >
                                {milestone.title}
                              </h3>
                              <p
                                className="text-[14px] leading-[1.75]"
                                style={{ color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans, sans-serif" }}
                              >
                                {milestone.description}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Mobile layout: all left-aligned */}
                      <div className="md:hidden flex gap-5">
                        {/* Marker */}
                        <div className="flex-shrink-0 relative">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center relative z-10"
                            style={{
                              backgroundColor: milestone.accentBg,
                              border: `2px solid ${milestone.color}`,
                              boxShadow: `0 0 15px ${milestone.color.replace("0.8", "0.1")}`,
                            }}
                          >
                            <IconComponent className="w-5 h-5" style={{ color: milestone.color }} />
                          </div>
                        </div>

                        {/* Content */}
                        <div
                          className="flex-1 p-5 rounded-2xl"
                          style={{
                            border: "1px solid rgba(255,255,255,0.06)",
                            backgroundColor: milestone.accentBg,
                          }}
                        >
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span
                              className="text-[12px] font-bold uppercase tracking-wider"
                              style={{ color: milestone.color, fontFamily: "Syne, sans-serif" }}
                            >
                              {milestone.year}
                            </span>
                            <span
                              className="text-[10px] px-2 py-0.5 rounded-full"
                              style={{
                                color: "rgba(255,255,255,0.55)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                fontFamily: "DM Sans, sans-serif",
                              }}
                            >
                              {milestone.location}
                            </span>
                          </div>
                          <h3
                            className="text-[16px] font-bold text-white mb-1.5"
                            style={{ fontFamily: "Syne, sans-serif" }}
                          >
                            {milestone.title}
                          </h3>
                          <p
                            className="text-[13px] leading-[1.7]"
                            style={{ color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans, sans-serif" }}
                          >
                            {milestone.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  PHILOSOPHY / PULL QUOTE                                      */}
      {/* ============================================================ */}
      <section ref={philosophyRef} className="relative py-20 sm:py-32 px-4 sm:px-6 z-20 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={philosophyInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <p
              className="text-[13px] uppercase tracking-[0.3em] mb-8"
              style={{ color: "rgba(45,212,191,0.6)", fontFamily: "DM Sans, sans-serif" }}
            >
              Design Philosophy
            </p>
            <blockquote>
              <p
                className="text-[28px] sm:text-[36px] md:text-[44px] lg:text-[50px] font-extrabold leading-[1.15] tracking-[-0.03em]"
                style={{ fontFamily: "Syne, sans-serif" }}
              >
                <span
                  style={{
                    background: "linear-gradient(135deg, rgba(45,212,191,0.9) 0%, rgba(96,165,250,0.9) 35%, rgba(168,85,247,0.9) 65%, rgba(244,114,182,0.9) 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundSize: "300% 300%",
                    animation: "gradient-shift 8s ease-in-out infinite",
                  }}
                >
                  The best design disappears.
                </span>{" "}
                <span style={{ color: "rgba(255,255,255,0.45)" }}>
                  I strive to create experiences where users achieve their goals without ever noticing the interface.
                </span>
              </p>
            </blockquote>

            {/* Decorative line */}
            <motion.div
              className="w-24 h-px mx-auto mt-10"
              style={{
                background: "linear-gradient(to right, transparent, rgba(45,212,191,0.4), transparent)",
              }}
              initial={{ scaleX: 0 }}
              animate={philosophyInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  SKILLS SECTION - Glassmorphism Cards                         */}
      {/* ============================================================ */}
      <section ref={skillsRef} className="relative py-20 sm:py-32 px-4 sm:px-6 z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={skillsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <SectionHeader number="02" label="What I Do" />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {skills.map((skill, i) => {
                const IconComp = skill.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={skillsInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                    className="group relative rounded-2xl p-6 sm:p-7 transition-all duration-500 hover:scale-[1.02]"
                    style={{
                      border: "1px solid rgba(255,255,255,0.06)",
                      backgroundColor: "rgba(255,255,255,0.02)",
                      backdropFilter: "blur(10px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                      e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)";
                    }}
                  >
                    {/* Background gradient glow on hover */}
                    <div
                      className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${skill.gradient}`}
                    />

                    <div className="relative">
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                        style={{
                          backgroundColor: "rgba(255,255,255,0.04)",
                          border: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        <IconComp className="w-5 h-5 text-white/70" />
                      </div>
                      <h3
                        className="text-white text-[16px] font-semibold mb-3"
                        style={{ fontFamily: "DM Sans, sans-serif" }}
                      >
                        {skill.title}
                      </h3>
                      <p
                        className="text-[14px] leading-[1.75]"
                        style={{ color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans, sans-serif" }}
                      >
                        {skill.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  EXPERIENCE SECTION                                           */}
      {/* ============================================================ */}
      <section ref={experienceRef} className="relative py-20 sm:py-32 px-4 sm:px-6 z-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={experienceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <SectionHeader number="03" label="Experience" />

            <div className="space-y-0">
              {experiences.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={experienceInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1 }}
                  className="group py-6 sm:py-8 border-b relative overflow-hidden"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  onMouseEnter={(e) => {
                    const bg = e.currentTarget.querySelector(".exp-bg") as HTMLElement;
                    if (bg) bg.style.opacity = "1";
                  }}
                  onMouseLeave={(e) => {
                    const bg = e.currentTarget.querySelector(".exp-bg") as HTMLElement;
                    if (bg) bg.style.opacity = "0";
                  }}
                >
                  {/* Hover background glow */}
                  <div
                    className="exp-bg absolute inset-0 pointer-events-none transition-opacity duration-500"
                    style={{
                      opacity: 0,
                      background: `linear-gradient(90deg, ${item.accent.replace("0.6", "0.03")} 0%, transparent 60%)`,
                    }}
                  />

                  <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        {/* Accent dot */}
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: item.accent }}
                        />
                        <h3
                          className="text-[16px] sm:text-[17px] font-semibold text-white group-hover:text-white transition-colors truncate"
                          style={{ fontFamily: "DM Sans, sans-serif" }}
                        >
                          {item.company}
                        </h3>
                      </div>
                      <p
                        className="text-[13px] sm:text-[14px] ml-5"
                        style={{ color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans, sans-serif" }}
                      >
                        {item.role}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 ml-5 sm:ml-0 flex-wrap">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag, j) => (
                          <span
                            key={j}
                            className="text-[10px] sm:text-[11px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full"
                            style={{
                              color: "rgba(255,255,255,0.6)",
                              border: `1px solid ${item.accent.replace("0.6", "0.15")}`,
                              fontFamily: "DM Sans, sans-serif",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span
                        className="text-[12px] sm:text-[13px] whitespace-nowrap hidden sm:inline"
                        style={{ color: "rgba(255,255,255,0.45)", fontFamily: "DM Sans, sans-serif" }}
                      >
                        {item.period}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  CTA SECTION                                                  */}
      {/* ============================================================ */}
      <section ref={ctaRef} className="relative py-24 sm:py-36 px-4 sm:px-6 z-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <div>
              <p
                className="text-[13px] uppercase tracking-[0.3em] mb-5"
                style={{ color: "rgba(45,212,191,0.6)", fontFamily: "DM Sans, sans-serif" }}
              >
                Get in Touch
              </p>
              <h2
                className="text-[32px] sm:text-[42px] md:text-[52px] font-extrabold leading-[1.1] tracking-[-0.03em]"
                style={{ fontFamily: "Syne, sans-serif", color: "#FFFFFF" }}
              >
                Let's build something{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, rgba(45,212,191,0.9), rgba(168,85,247,0.9))",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  meaningful
                </span>{" "}
                <span style={{ color: "rgba(255,255,255,0.4)" }}>together.</span>
              </h2>
              <p
                className="text-[15px] sm:text-[17px] mt-5 max-w-xl mx-auto leading-[1.8]"
                style={{ color: "rgba(255,255,255,0.55)", fontFamily: "DM Sans, sans-serif" }}
              >
                I'm currently open to full-time UX design roles. If you're building a team that
                cares about users, I'd love to hear from you.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={ctaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <a
                href="https://www.linkedin.com/in/jay-harwani/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-[14px] font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, rgba(45,212,191,0.15), rgba(96,165,250,0.15))",
                  color: "rgba(255,255,255,0.9)",
                  border: "1px solid rgba(45,212,191,0.2)",
                  fontFamily: "DM Sans, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(45,212,191,0.25), rgba(96,165,250,0.25))";
                  e.currentTarget.style.borderColor = "rgba(45,212,191,0.4)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(45,212,191,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, rgba(45,212,191,0.15), rgba(96,165,250,0.15))";
                  e.currentTarget.style.borderColor = "rgba(45,212,191,0.2)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>

              <a
                href="mailto:harwanijay9498@gmail.com"
                className="group inline-flex items-center gap-2.5 text-[14px] font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: "DM Sans, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.color = "rgba(255,255,255,1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }}
              >
                <Mail className="w-4 h-4" />
                Email Me
              </a>

              <a
                href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 text-[14px] font-semibold px-7 py-3.5 rounded-full transition-all duration-300 hover:scale-105"
                style={{
                  color: "rgba(255,255,255,0.8)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  fontFamily: "DM Sans, sans-serif",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
                  e.currentTarget.style.color = "rgba(255,255,255,1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.8)";
                }}
              >
                <FileText className="w-4 h-4" />
                Resume
                <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </a>
            </motion.div>

            {/* Decorative geometric shapes */}
            <div className="relative h-px w-full max-w-xs mx-auto mt-12">
              <motion.div
                className="h-full"
                style={{
                  background: "linear-gradient(to right, transparent, rgba(45,212,191,0.3), transparent)",
                }}
                initial={{ scaleX: 0 }}
                animate={ctaInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============================================================ */}
      {/*  FOOTER                                                       */}
      {/* ============================================================ */}
      <Footer />
    </div>
  );
}
