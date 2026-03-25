import { Linkedin, FileText, User } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { useLocation, Link } from "react-router";
import { Button } from "./ui/button";

export function Header() {
  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/60">
      {/* Refined progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-600 via-sky-500 to-teal-600"
        style={{ 
          width: progressWidth,
          boxShadow: '0 0 8px rgba(15, 118, 110, 0.3)'
        }}
      />
      
      <div className="container mx-auto px-6 md:px-8 py-4 md:py-5 flex items-center justify-between max-w-7xl">
        <div className="flex items-center">
          <Link to="/" className="group cursor-pointer transition-all duration-200">
            <h1 className="text-neutral-900 text-xl md:text-2xl font-semibold tracking-tight group-hover:text-teal-700 transition-colors">
              Jay Harwani
            </h1>
          </Link>
        </div>
        
        <nav className="flex items-center gap-2 md:gap-3">
          <Button 
            variant="ghost" 
            size="sm"
            className={`gap-2 rounded-lg hover:bg-neutral-100 transition-all duration-200 px-4 border border-transparent ${
              isAboutPage ? 'bg-teal-50 text-teal-700 border-teal-200' : 'text-neutral-600 hover:text-neutral-900'
            }`}
            asChild
          >
            <Link to="/about">
              <User className="w-4 h-4" strokeWidth={2} />
              <span className="hidden sm:inline text-sm font-medium">About</span>
            </Link>
          </Button>
          <Button 
            variant="ghost"
            size="sm" 
            className="gap-2 rounded-lg hover:bg-neutral-100 transition-all duration-200 text-neutral-600 hover:text-neutral-900 px-4 border border-transparent hover:border-neutral-200"
            asChild
          >
            <a href="https://www.linkedin.com/in/jay-harwani/" target="_blank" rel="noopener noreferrer">
              <Linkedin className="w-4 h-4" strokeWidth={2} />
              <span className="hidden sm:inline text-sm font-medium">LinkedIn</span>
            </a>
          </Button>
          
          {/* Premium Resume Button */}
          <a 
            href="https://drive.google.com/file/d/10YSDOZ6-UznxpgavfH3EU4ukdyF5EmwE/view?usp=sharing" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="relative rounded-lg px-4 md:px-5 py-2 md:py-2.5 flex items-center gap-2 bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 transition-all duration-200 shadow-sm hover:shadow-md">
              <FileText className="w-4 h-4 text-white relative z-10" strokeWidth={2} />
              <span className="hidden sm:inline text-sm font-medium text-white relative z-10">
                Resume
              </span>
            </div>
          </a>
        </nav>
      </div>
    </header>
  );
}