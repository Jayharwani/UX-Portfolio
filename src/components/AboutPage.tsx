import { Header } from "./Header";
import { Footer } from "./Footer";
import { motion, useInView } from "motion/react";
import { Sparkles, ExternalLink, Code, Palette, BarChart3 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import userPhoto from "../assets/hero-portrait.png";

export function AboutPage() {
  // Intersection Observer refs for performance
  const heroRef = useRef(null);
  const mainCardRef = useRef(null);
  const experienceRef = useRef(null);
  
  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const mainCardInView = useInView(mainCardRef, { once: true, amount: 0.2 });
  const experienceInView = useInView(experienceRef, { once: true, amount: 0.1 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-white">
      <Header />
      
      <main className="container mx-auto px-6 py-16 md:py-24 max-w-7xl">
        {/* Large ABOUT Title */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: -30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <h1 
            className="text-[20vw] md:text-[15vw] lg:text-[12rem] tracking-tighter leading-none bg-gradient-to-r from-neutral-800 via-neutral-600 to-neutral-800 bg-clip-text text-transparent select-none font-bold"
            style={{ 
              WebkitTextFillColor: 'transparent', 
              WebkitBackgroundClip: 'text'
            }}
          >
            ABOUT
          </h1>
          
          {/* Sparkle Icon - simplified animation */}
          <motion.div
            className="flex justify-center mt-4"
            initial={{ opacity: 0, scale: 0 }}
            animate={heroInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-teal-600" strokeWidth={1.5} />
          </motion.div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          ref={mainCardRef}
          initial={{ opacity: 0, y: 30 }}
          animate={mainCardInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-neutral-200/60 overflow-hidden">
            {/* Decorative top bar */}
            <div className="h-1 bg-gradient-to-r from-teal-600 via-sky-600 to-teal-600" />
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 p-8 md:p-12 lg:p-16">
              {/* Left - Image */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={mainCardInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative group"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-xl">
                  <div className="relative bg-gradient-to-br from-neutral-100 to-neutral-200 rounded-2xl p-1">
                    <img
                      src={userPhoto}
                      alt="Jay Harwani"
                      className="w-full h-full object-cover rounded-xl"
                      loading="eager"
                    />
                  </div>
                  
                  {/* Floating badge - no animation */}
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-teal-600 to-sky-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold">
                    UX Designer
                  </div>
                </div>
              </motion.div>

              {/* Right - Content */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={mainCardInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex flex-col justify-center space-y-6"
              >
                {/* Greeting */}
                <div>
                  <h2 className="text-slate-900 text-lg md:text-xl mb-4 flex items-center gap-2 flex-wrap">
                    HELLO FROM (A PROBABLY MAGICAL) INDIA! 
                    <span className="inline-flex gap-1">
                      <span>🎨</span>
                      <span>🌴</span>
                      <span>✨</span>
                    </span>
                  </h2>

                  {/* Tagline */}
                  <p className="text-slate-700 italic text-2xl md:text-3xl lg:text-4xl leading-snug mb-6">
                    I design, I narrate, and sometimes I over-explain my own prototypes
                  </p>

                  {/* Description */}
                  <div className="space-y-4 text-slate-600 text-base md:text-lg leading-relaxed">
                    {/* Removed espresso line */}
                  </div>
                </div>

                {/* Removed Skills Icons and Resume Link */}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          ref={experienceRef}
          initial={{ opacity: 0, y: 30 }}
          animate={experienceInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto mt-16 md:mt-24"
        >
          {/* Section Header */}
          <div className="flex items-center gap-6 mb-12">
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-teal-600 via-sky-600 to-teal-600 bg-clip-text text-transparent whitespace-nowrap"
              style={{ 
                WebkitTextFillColor: 'transparent', 
                WebkitBackgroundClip: 'text'
              }}
            >
              EXPERIENCE
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-teal-500 via-sky-500 to-transparent" />
          </div>

          {/* Experience Items */}
          <div className="space-y-0">
            {[
              {
                company: "UMBC CARDS Lab",
                position: "UX Designer & Developer",
                date: "Jul '25 – Present",
                tags: "AI | Robotics | Dashboard",
                delay: 0.1
              },
              {
                company: "UMBC Image Research Center",
                position: "UI Designer Volunteer",
                date: "Sept '24 – Jan '25",
                tags: "Visual Design | Accessibility | Research",
                delay: 0.2
              },
              {
                company: "UMBC HCC Research",
                position: "UX & HCC Research Volunteer",
                date: "Sept '24 – Mar '25",
                tags: "AI | Behavior Analysis | Human Factors",
                delay: 0.3
              },
              {
                company: "Welspun GCC",
                position: "UX Designer",
                date: "Jun '23 – Jul '24",
                tags: "E-commerce | B2B | Internal Systems",
                delay: 0.4
              },
              {
                company: "Metafic",
                position: "UX Design Intern",
                date: "Feb '23 – May '23",
                tags: "Product Design | Mobile UX | Cross-Platform",
                delay: 0.5
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                animate={experienceInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: item.delay }}
                className="group relative"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 py-8 border-b border-neutral-200/60 hover:border-teal-300/60 transition-colors">
                  {/* Left - Company & Position */}
                  <div className="md:col-span-5 space-y-1">
                    <h3 className="text-neutral-900 text-xl md:text-2xl font-semibold group-hover:text-teal-700 transition-colors">
                      {item.company}
                    </h3>
                    <p className="text-transparent bg-gradient-to-r from-teal-600 to-sky-600 bg-clip-text text-base md:text-lg font-medium">
                      {item.position}
                    </p>
                  </div>

                  {/* Center - Date */}
                  <div className="md:col-span-4 flex items-center">
                    <div className="flex items-center gap-3 md:justify-center w-full">
                      {/* Timeline dot - simplified */}
                      <div className="hidden md:block w-3 h-3 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 shadow-md" />
                      <p className="text-neutral-600 text-sm md:text-base">
                        {item.date}
                      </p>
                    </div>
                  </div>

                  {/* Right - Tags */}
                  <div className="md:col-span-3 flex items-center md:justify-end">
                    <p className="text-neutral-500 text-sm md:text-base text-right">
                      {item.tags}
                    </p>
                  </div>
                </div>

                {/* Hover gradient line */}
                <div className="absolute bottom-0 left-0 h-px bg-gradient-to-r from-teal-500 via-sky-500 to-teal-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-200" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}