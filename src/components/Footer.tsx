import { Button } from "./ui/button";
import { Linkedin, FileText } from "lucide-react";
import { motion } from "motion/react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative text-neutral-900 overflow-hidden border-t border-neutral-200/60" style={{ backgroundColor: '#F2EFE9' }}>
      {/* Refined background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle mesh gradient effect */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(at 20% 30%, rgba(15, 118, 110, 0.04) 0px, transparent 50%),
              radial-gradient(at 80% 70%, rgba(14, 165, 233, 0.04) 0px, transparent 50%)
            `
          }}
        />
      </div>
      
      <div className="container mx-auto px-6 md:px-8 py-16 md:py-20 max-w-7xl relative">
        <div className="flex flex-col items-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-center max-w-5xl px-4"
          >
            <h2 className="text-neutral-900 text-center mb-3 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold leading-tight">
              Ready to turn your "We need a designer" into "We hired the right one" 🎯
            </h2>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <a 
              href="https://www.linkedin.com/in/jay-harwani/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[13px] font-medium transition-all hover:opacity-70"
              style={{ 
                border: '1px solid rgba(15, 15, 13, 0.35)',
                backgroundColor: 'transparent',
                color: '#0F0F0D',
                fontFamily: 'DM Sans, sans-serif',
                borderRadius: '100px',
                padding: '7px 18px'
              }}
            >
              LinkedIn
            </a>
            
            <a 
              href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[13px] font-medium transition-all hover:opacity-70"
              style={{ 
                border: '1px solid rgba(15, 15, 13, 0.35)',
                backgroundColor: 'transparent',
                color: '#0F0F0D',
                fontFamily: 'DM Sans, sans-serif',
                borderRadius: '100px',
                padding: '7px 18px'
              }}
            >
              Resume
            </a>
          </motion.div>
          
          <motion.div 
            className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent mt-8"
            initial={{ opacity: 0, scaleX: 0 }}
            whileInView={{ opacity: 1, scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
          
          <motion.p 
            className="text-neutral-500 text-center text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            © {currentYear} Jay Harwani
          </motion.p>
        </div>
      </div>
    </footer>
  );
}