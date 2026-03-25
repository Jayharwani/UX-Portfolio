import { CaseStudyCard } from "./CaseStudyCard";
import { EnhancedSmartDriveCard } from "./EnhancedSmartDriveCard";
import { EnhancedBumperCard } from "./EnhancedBumperCard";
import { ChronoWeaveThumbnail } from "./ChronoWeaveThumbnail";
import { motion } from "motion/react";
import smartDriveThumbnail from "../assets/smartdrive-thumbnail.png";

const caseStudies = [
  {
    id: 3,
    image: ChronoWeaveThumbnail,
    title: "ChronoWeave",
    description: "Multi-sensory nudges for time blindness. AI-powered app from FigBuild 2026",
    category: "Mobile App",
    link: "/chronoweave",
    comingSoon: false
  },
  {
    id: 1,
    image: smartDriveThumbnail,
    title: "SmartDrive Mode",
    description: "An AI-driven phone feature that learns your driving habits to filter distractions and keep you focused on the road",
    category: "Mobile Setting Feature",
    link: "/smartdrive",
    comingSoon: false
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1618128587777-c472aa97d836?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYWlwdXIlMjBwYWxhY2UlMjBnb2xkZW4lMjBzdW5zZXR8ZW58MXx8fHwxNzcwNDAxODExfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    title: "Bumper Extension",
    description: "A browser extension that helps you resist impulse purchases by visualizing what you could do with that money instead — like saving for your dream trip to Jaipur",
    category: "Browser Extension",
    link: "#bumper",
    comingSoon: true
  }
];

export function CaseStudies() {
  return (
    <section id="case-studies" className="relative py-32 overflow-hidden" style={{ backgroundColor: '#F2EFE9' }}>
      {/* Refined background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle mesh gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 30% 20%, rgba(15, 118, 110, 0.04) 0px, transparent 50%),
              radial-gradient(at 70% 80%, rgba(14, 165, 233, 0.04) 0px, transparent 50%)
            `
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 max-w-7xl relative">
        <motion.div 
          className="text-center mb-24 space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-teal-50 to-sky-50 border border-teal-200/50 rounded-lg mb-6 backdrop-blur-sm shadow-sm">
            <span className="text-teal-700 text-sm tracking-wide font-semibold">SELECTED WORK</span>
          </div>
          <h2 className="text-neutral-900 text-4xl md:text-5xl font-bold tracking-tight">
            Case Studies
          </h2>
          <p className="text-neutral-600 max-w-2xl mx-auto text-lg md:text-xl">
            A curated collection of projects where design meets impact
          </p>
        </motion.div>
        
        <div className="space-y-32 relative">
          {caseStudies.map((study, index) => (
            <div key={study.id} className="relative">
              {study.id === 1 ? (
                <EnhancedSmartDriveCard />
              ) : study.id === 2 ? (
                <EnhancedBumperCard />
              ) : study.id === 3 ? (
                <ChronoWeaveThumbnail />
              ) : (
                <CaseStudyCard
                  image={study.image}
                  title={study.title}
                  description={study.description}
                  category={study.category}
                  link={study.link}
                  reverse={index % 2 !== 0}
                  index={index}
                  comingSoon={study.comingSoon}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}