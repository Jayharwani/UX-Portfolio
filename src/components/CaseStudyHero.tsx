import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import exampleImage from '../assets/casestudy-hero-bg.png';

interface CaseStudyHeroProps {
  backgroundImage?: string;
  title: string;
  subtitle: string;
  tags: string[];
  phoneContent: React.ReactNode;
  onExploreClick?: () => void;
}

export function CaseStudyHero({
  backgroundImage = exampleImage,
  title,
  subtitle,
  tags,
  phoneContent,
  onExploreClick
}: CaseStudyHeroProps) {
  return (
    <section className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {/* Blurred Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: 'blur(8px)',
            transform: 'scale(1.1)'
          }}
        />
        
        {/* Dark Purple-Blue Overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 10, 30, 0.85) 0%, rgba(30, 30, 63, 0.75) 100%)'
          }}
        />

        {/* Subtle Gradient Accents */}
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-purple-500/10 to-transparent rounded-full blur-3xl"
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
        <div className="grid lg:grid-cols-[60%_40%] gap-12 lg:gap-16 items-center">
          {/* Left Side - iPhone Mockup (60%) */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex justify-center lg:justify-start"
          >
            {/* Glow Effect Behind Phone */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{
                opacity: [0.2, 0.4, 0.2],
                scale: [0.9, 1.05, 0.9],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="w-[400px] h-[500px] bg-gradient-to-br from-cyan-400/30 via-blue-500/20 to-purple-600/30 rounded-full blur-3xl" />
            </motion.div>

            {/* iPhone Mockup */}
            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              {/* Phone Frame with Soft Shadow */}
              <div 
                className="relative bg-slate-900 rounded-[3.5rem] p-3 border-[3px] border-slate-800"
                style={{
                  boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.5), 0 0 80px rgba(6, 182, 212, 0.15)'
                }}
              >
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-3xl z-20" />
                
                {/* Screen */}
                <div className="relative bg-black rounded-[3rem] overflow-hidden aspect-[9/19.5] w-[340px]">
                  {/* Content */}
                  <div className="w-full h-full">
                    {phoneContent}
                  </div>
                  
                  {/* Screen Glare */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"
                    animate={{
                      opacity: [0.05, 0.15, 0.05],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Content (40%) */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="space-y-8 lg:pr-8"
          >
            {/* Project Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight">
                {title}
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl lg:text-2xl text-slate-300 leading-relaxed">
                {subtitle}
              </p>
            </motion.div>

            {/* Tags/Chips */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-3"
            >
              {tags.map((tag, index) => (
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

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
            >
              <motion.button
                onClick={onExploreClick}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white rounded-full text-slate-900 font-semibold text-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Button Glow Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                />
                
                <span className="relative z-10">Explore Design</span>
                <motion.div
                  className="relative z-10"
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.div>
              </motion.button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.6 }}
              className="flex items-center gap-3 text-slate-400 text-sm"
            >
              <motion.div
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex flex-col gap-1"
              >
                <div className="w-[2px] h-6 bg-gradient-to-b from-transparent via-slate-400 to-transparent rounded-full" />
              </motion.div>
              <span>Scroll to explore</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
