import { motion } from "motion/react";

interface MobileMockupProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function MobileMockup({ children, className = "", animate = false }: MobileMockupProps) {
  const mockup = (
    <div className={`relative ${className}`} style={{ width: '100%', maxWidth: '393px', margin: '0 auto' }}>
      {/* Mobile device frame */}
      <div 
        className="relative bg-slate-900 rounded-[3rem] p-3 shadow-2xl"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.1)'
        }}
      >
        {/* Camera/Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-slate-900 rounded-b-2xl px-6 pt-2 pb-4 flex items-center justify-center gap-2">
            <div className="w-14 h-4 bg-slate-800 rounded-full" />
          </div>
        </div>

        {/* Screen */}
        <div 
          className="relative bg-white rounded-[2.5rem] overflow-hidden"
          style={{
            aspectRatio: '393 / 852',
          }}
        >
          {/* Screen content */}
          <div className="absolute inset-0">
            {children}
          </div>
        </div>

        {/* Side buttons */}
        <div className="absolute -left-1 top-24 w-1 h-8 bg-slate-800 rounded-l-sm" />
        <div className="absolute -left-1 top-36 w-1 h-12 bg-slate-800 rounded-l-sm" />
        <div className="absolute -left-1 top-52 w-1 h-12 bg-slate-800 rounded-l-sm" />
        <div className="absolute -right-1 top-40 w-1 h-16 bg-slate-800 rounded-r-sm" />
      </div>
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {mockup}
      </motion.div>
    );
  }

  return mockup;
}
