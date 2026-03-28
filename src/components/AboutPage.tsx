import { Footer } from "./Footer";
import { motion, useInView } from "motion/react";
import { ArrowLeft, ArrowUpRight, MapPin, GraduationCap, Briefcase } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router";
import userPhoto from "../assets/hero-portrait.jpeg";

export function AboutPage() {
  const heroRef = useRef(null);
  const bioRef = useRef(null);
  const experienceRef = useRef(null);
  const educationRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const bioInView = useInView(bioRef, { once: true, amount: 0.2 });
  const experienceInView = useInView(experienceRef, { once: true, amount: 0.1 });
  const educationInView = useInView(educationRef, { once: true, amount: 0.2 });

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0A0A0A' }}>
      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{ backgroundColor: 'rgba(10,10,10,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-white/40 hover:text-white transition-all duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="text-sm" style={{ fontFamily: 'DM Sans, sans-serif' }}>Back</span>
          </Link>
          <div className="flex items-center gap-6">
            <a
              href="https://www.linkedin.com/in/jay-harwani/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[13px] font-medium text-white/40 hover:text-white transition-colors"
              style={{ fontFamily: 'DM Sans, sans-serif' }}
            >
              LinkedIn
            </a>
            <a
              href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] font-semibold uppercase tracking-[0.1em] px-5 py-2.5 rounded-full transition-all hover:scale-105"
              style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', border: '1px solid rgba(255,255,255,0.1)', fontFamily: 'DM Sans, sans-serif' }}
            >
              Resume
            </a>
          </div>
        </div>
      </motion.nav>

      {/* Noise texture */}
      <div
        className="fixed inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          opacity: 0.035,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Hero */}
      <section ref={heroRef} className="relative pt-28 sm:pt-36 pb-16 sm:pb-24 px-4 sm:px-6 overflow-hidden">
        {/* Ambient orbs */}
        <div
          className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(45,212,191,0.05) 0%, transparent 70%)',
            animation: 'ambient-pulse 8s ease-in-out infinite',
          }}
        />

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-[340px_1fr] gap-10 lg:gap-16 items-start">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="relative max-w-[340px] mx-auto lg:mx-0">
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <img
                    src={userPhoto}
                    alt="Jay Harwani"
                    className="w-full aspect-[3/4] object-cover object-top"
                    loading="eager"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent" />
                </div>
                {/* Location tag */}
                <div className="flex items-center gap-2 mt-4">
                  <MapPin className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-[13px] text-white/30" style={{ fontFamily: 'DM Sans, sans-serif' }}>Baltimore, MD</span>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="space-y-8"
            >
              <div>
                <h1
                  className="text-[36px] sm:text-[44px] md:text-[52px] font-extrabold leading-[1.05] tracking-[-0.03em] mb-6"
                  style={{ fontFamily: 'Syne, sans-serif', color: '#FFFFFF' }}
                >
                  I'm Jay — a designer<br className="hidden sm:block" />
                  <span style={{ color: 'rgba(255,255,255,0.2)' }}>who thinks in systems.</span>
                </h1>

                <div className="space-y-4">
                  <p
                    className="text-[15px] sm:text-[16px] leading-[1.8]"
                    style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    I design products at the intersection of behavioral science and technology.
                    My work focuses on creating interfaces that feel invisible — where the interaction
                    between human intent and digital response is seamless.
                  </p>
                  <p
                    className="text-[15px] sm:text-[16px] leading-[1.8]"
                    style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'DM Sans, sans-serif' }}
                  >
                    Currently pursuing my Master's in HCI at UMBC, previously designing enterprise
                    systems at Welspun. I bring a research-first mindset to every problem — validating
                    assumptions before committing pixels.
                  </p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: "2+", label: "Years experience" },
                  { value: "10+", label: "Projects shipped" },
                  { value: "MS", label: "HCI @ UMBC" },
                ].map((stat, i) => (
                  <div key={i} className="py-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                    <p className="text-white text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: 'Syne, sans-serif' }}>{stat.value}</p>
                    <p className="text-[12px] text-white/30" style={{ fontFamily: 'DM Sans, sans-serif' }}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "LinkedIn", href: "https://www.linkedin.com/in/jay-harwani/" },
                  { label: "Email", href: "mailto:harwanijay9498@gmail.com" },
                  { label: "Resume", href: "https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing" },
                ].map((link, i) => (
                  <a
                    key={i}
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium px-4 py-2 rounded-full transition-all hover:scale-105"
                    style={{
                      color: 'rgba(255,255,255,0.5)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      fontFamily: 'DM Sans, sans-serif',
                    }}
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Bio / What I do */}
      <section ref={bioRef} className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={bioInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <span className="text-cyan-500 font-mono text-sm">01</span>
              <div className="w-12 h-px bg-gradient-to-r from-cyan-500/60 to-transparent" />
              <span className="text-cyan-400/80 text-sm uppercase tracking-widest font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>What I Do</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "UX Research",
                  description: "User interviews, usability testing, behavioral analysis, and data-driven insights that shape product direction.",
                },
                {
                  title: "Product Design",
                  description: "End-to-end design from wireframes to high-fidelity prototypes. Design systems, interaction patterns, and visual polish.",
                },
                {
                  title: "Prototyping",
                  description: "Interactive prototypes in Figma and code. I bridge the gap between design intent and engineering reality.",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={bioInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="rounded-xl p-6 transition-colors duration-300"
                  style={{
                    border: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <h3 className="text-white text-[15px] font-semibold mb-3" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.title}</h3>
                  <p className="text-white/35 text-[14px] leading-[1.7]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience */}
      <section ref={experienceRef} className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={experienceInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <span className="text-cyan-500 font-mono text-sm">02</span>
              <div className="w-12 h-px bg-gradient-to-r from-cyan-500/60 to-transparent" />
              <span className="text-cyan-400/80 text-sm uppercase tracking-widest font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Experience</span>
            </div>

            <div className="space-y-0">
              {[
                {
                  company: "UMBC CARDS Lab",
                  role: "UX Designer & Developer",
                  period: "Jul 2025 – Present",
                  tags: ["AI", "Robotics", "Dashboard"],
                },
                {
                  company: "Welspun GCC",
                  role: "UX Designer",
                  period: "Jun 2023 – Jul 2024",
                  tags: ["E-commerce", "B2B", "Enterprise"],
                },
                {
                  company: "UMBC Image Research Center",
                  role: "UI Designer Volunteer",
                  period: "Sep 2024 – Jan 2025",
                  tags: ["Visual Design", "Accessibility"],
                },
                {
                  company: "UMBC HCC Research",
                  role: "UX & HCC Research Volunteer",
                  period: "Sep 2024 – Mar 2025",
                  tags: ["AI", "Behavior Analysis"],
                },
                {
                  company: "Metafic",
                  role: "UX Design Intern",
                  period: "Feb 2023 – May 2023",
                  tags: ["Mobile UX", "Cross-Platform"],
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={experienceInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="group py-6 sm:py-7 border-b"
                  style={{ borderColor: 'rgba(255,255,255,0.06)' }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <Briefcase className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                        <h3 className="text-white text-[15px] sm:text-[16px] font-semibold truncate group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'DM Sans, sans-serif' }}>
                          {item.company}
                        </h3>
                      </div>
                      <p className="text-white/40 text-[13px] sm:text-[14px] ml-[26px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.role}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-[26px] sm:ml-0">
                      <div className="flex flex-wrap gap-1.5">
                        {item.tags.map((tag, j) => (
                          <span
                            key={j}
                            className="text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full"
                            style={{
                              color: 'rgba(255,255,255,0.25)',
                              border: '1px solid rgba(255,255,255,0.06)',
                              fontFamily: 'DM Sans, sans-serif',
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-white/20 text-[12px] whitespace-nowrap hidden sm:inline" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.period}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Education */}
      <section ref={educationRef} className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={educationInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-4 mb-10">
              <span className="text-cyan-500 font-mono text-sm">03</span>
              <div className="w-12 h-px bg-gradient-to-r from-cyan-500/60 to-transparent" />
              <span className="text-cyan-400/80 text-sm uppercase tracking-widest font-medium" style={{ fontFamily: 'DM Sans, sans-serif' }}>Education</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  degree: "M.P.S. in Human-Centered Computing",
                  school: "University of Maryland, Baltimore County",
                  year: "2024 – 2026",
                  detail: "Focus on HCI, UX Research, and AI-driven design",
                },
                {
                  degree: "B.Tech in Computer Science",
                  school: "Parul University, India",
                  year: "2019 – 2023",
                  detail: "Foundation in software engineering and design thinking",
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={educationInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                  className="rounded-xl p-6"
                  style={{
                    border: '1px solid rgba(255,255,255,0.06)',
                    backgroundColor: 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <GraduationCap className="w-4 h-4 text-cyan-400/60" />
                    <span className="text-white/20 text-[12px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.year}</span>
                  </div>
                  <h3 className="text-white text-[15px] font-semibold mb-1" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.degree}</h3>
                  <p className="text-white/40 text-[13px] mb-2" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.school}</p>
                  <p className="text-white/25 text-[12px]" style={{ fontFamily: 'DM Sans, sans-serif' }}>{item.detail}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
