import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import {
  Figma,
  Search,
  Code,
  Grid3x3,
  Sparkles,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  gradient: string;
  strokeColor: string;
  icon: any;
  skills: string[];
  startAngle: number;
  endAngle: number;
}

const categories: Category[] = [
  {
    id: 1,
    name: "AI",
    gradient: "linear-gradient(135deg, #ec4899 0%, #a855f7 100%)", // Pink to Purple
    strokeColor: "#ec4899",
    icon: Sparkles,
    skills: ["AI-driven design process", "Fast prompting, fast iterations", "Exploring new trending tools"],
    startAngle: 0,
    endAngle: 72,
  },
  {
    id: 2,
    name: "Design",
    gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)", // Purple to Indigo
    strokeColor: "#a855f7",
    icon: Figma,
    skills: ["Figma", "Wireframing", "Prototyping", "UI Design"],
    startAngle: 72,
    endAngle: 144,
  },
  {
    id: 3,
    name: "Research",
    gradient: "linear-gradient(135deg, #0f766e 0%, #0ea5e9 100%)", // Teal to Sky
    strokeColor: "#0f766e",
    icon: Search,
    skills: ["User Research", "Usability Testing", "A/B Testing", "Journey Mapping"],
    startAngle: 144,
    endAngle: 216,
  },
  {
    id: 4,
    name: "Build",
    gradient: "linear-gradient(135deg, #0ea5e9 0%, #3b82f6 100%)", // Sky to Blue
    strokeColor: "#0ea5e9",
    icon: Code,
    skills: ["HTML/CSS", "JavaScript", "Responsive Design", "React"],
    startAngle: 216,
    endAngle: 288,
  },
  {
    id: 5,
    name: "Systems",
    gradient: "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)", // Green to Teal
    strokeColor: "#10b981",
    icon: Grid3x3,
    skills: ["Design Systems", "Information Architecture", "Accessibility", "Components"],
    startAngle: 288,
    endAngle: 360,
  },
];

export function StatsSection() {
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredSlice, setHoveredSlice] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-32 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Glass Container */}
        <motion.div
          className="relative mx-auto max-w-4xl"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="relative bg-white/5 backdrop-blur-[20px] rounded-3xl border border-white/10 p-8 md:p-16 shadow-2xl">
            {/* Floating Cube */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <FloatingCube />
            </div>

            {/* Title Below Center */}
            <div className="text-center mb-8 md:mb-12 mt-12 md:mt-16">
              <motion.h2
                className="text-white text-3xl md:text-4xl font-bold tracking-tight"
                style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Skills & Toolkit
              </motion.h2>
              <motion.p
                className="text-white/60 text-sm mt-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                End‑to‑end product workflow
              </motion.p>
            </div>

            {/* Circle Container */}
            <div className="flex items-center justify-center">
              <RotatingCircle
                categories={categories}
                isPaused={isPaused}
                setIsPaused={setIsPaused}
                hoveredSlice={hoveredSlice}
                setHoveredSlice={setHoveredSlice}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FloatingCube() {
  return (
    <div className="relative" style={{ perspective: "1000px" }}>
      <motion.div
        className="w-16 h-16 md:w-20 md:h-20"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{
          rotateY: [0, 360],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {/* Cube Faces */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-violet-500 to-fuchsia-500 opacity-80 backdrop-blur-sm border border-white/20"
          style={{
            transform: "translateZ(40px)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 opacity-80 backdrop-blur-sm border border-white/20"
          style={{
            transform: "rotateY(90deg) translateZ(40px)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-pink-500 to-rose-500 opacity-80 backdrop-blur-sm border border-white/20"
          style={{
            transform: "rotateY(180deg) translateZ(40px)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 opacity-80 backdrop-blur-sm border border-white/20"
          style={{
            transform: "rotateY(-90deg) translateZ(40px)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-green-500 opacity-80 backdrop-blur-sm border border-white/20"
          style={{
            transform: "rotateX(90deg) translateZ(40px)",
            backfaceVisibility: "hidden",
          }}
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 opacity-80 backdrop-blur-sm border border-white/20"
          style={{
            transform: "rotateX(-90deg) translateZ(40px)",
            backfaceVisibility: "hidden",
          }}
        />
      </motion.div>
    </div>
  );
}

interface RotatingCircleProps {
  categories: Category[];
  isPaused: boolean;
  setIsPaused: (paused: boolean) => void;
  hoveredSlice: number | null;
  setHoveredSlice: (id: number | null) => void;
}

function RotatingCircle({
  categories,
  isPaused,
  setIsPaused,
  hoveredSlice,
  setHoveredSlice,
}: RotatingCircleProps) {
  const [isMobile, setIsMobile] = useState(false);

  useState(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  });

  const circleSize = isMobile ? 340 : 500;
  const radius = circleSize / 2;
  const center = radius;

  return (
    <div
      className="relative"
      style={{ 
        width: circleSize, 
        height: circleSize,
        perspective: "1200px",
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setHoveredSlice(null);
      }}
    >
      {/* Shimmer Outer Ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            from 0deg,
            transparent 0%,
            rgba(255, 255, 255, 0.3) 10%,
            transparent 20%,
            transparent 100%
          )`,
          filter: "blur(2px)",
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Main Rotating Circle */}
      <motion.div
        className="absolute inset-0"
        style={{
          transformStyle: "preserve-3d",
        }}
        animate={{ 
          rotate: isPaused ? undefined : 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <svg
          width={circleSize}
          height={circleSize}
          viewBox={`0 0 ${circleSize} ${circleSize}`}
          className="absolute inset-0 drop-shadow-2xl"
          style={{
            filter: "drop-shadow(0 10px 40px rgba(0, 0, 0, 0.5))",
          }}
        >
          {/* Pie Slices with 3D effect */}
          {categories.map((category) => (
            <Slice3D
              key={category.id}
              category={category}
              center={center}
              radius={radius}
              isHovered={hoveredSlice === category.id}
              onHover={() => setHoveredSlice(category.id)}
              isMobile={isMobile}
            />
          ))}

          {/* Metallic Outer Stroke */}
          <circle
            cx={center}
            cy={center}
            r={radius - 3}
            fill="none"
            stroke="url(#metallic-gradient)"
            strokeWidth="2"
            className="opacity-60"
          />

          {/* Gradient Definitions */}
          <defs>
            <linearGradient id="metallic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#d1d5db" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Tooltip on Hover */}
      <AnimatePresence>
        {hoveredSlice !== null && (
          <Tooltip
            category={categories.find((c) => c.id === hoveredSlice)!}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface Slice3DProps {
  category: Category;
  center: number;
  radius: number;
  isHovered: boolean;
  onHover: () => void;
  isMobile: boolean;
}

function Slice3D({
  category,
  center,
  radius,
  isHovered,
  onHover,
  isMobile,
}: Slice3DProps) {
  // Calculate pie slice path
  const startAngle = (category.startAngle - 90) * (Math.PI / 180);
  const endAngle = (category.endAngle - 90) * (Math.PI / 180);

  const outerRadius = radius - 5;
  const innerRadius = 0;

  const startXOuter = center + outerRadius * Math.cos(startAngle);
  const startYOuter = center + outerRadius * Math.sin(startAngle);
  const endXOuter = center + outerRadius * Math.cos(endAngle);
  const endYOuter = center + outerRadius * Math.sin(endAngle);

  const largeArcFlag = category.endAngle - category.startAngle > 180 ? 1 : 0;

  const pathData = `
    M ${center} ${center}
    L ${startXOuter} ${startYOuter}
    A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endXOuter} ${endYOuter}
    Z
  `;

  // Icon and text positions
  const iconRadius = outerRadius * 0.5;
  const textRadius = outerRadius * 0.7;
  const midAngle = ((category.startAngle + category.endAngle) / 2 - 90) * (Math.PI / 180);

  const iconX = center + iconRadius * Math.cos(midAngle);
  const iconY = center + iconRadius * Math.sin(midAngle);
  const textX = center + textRadius * Math.cos(midAngle);
  const textY = center + textRadius * Math.sin(midAngle);

  const iconSize = isMobile ? 28 : 32;

  // Create unique gradient ID
  const gradientId = `slice-gradient-${category.id}`;

  return (
    <g
      onMouseEnter={onHover}
      className="cursor-pointer transition-all duration-300"
      style={{
        filter: isHovered ? "brightness(1.2)" : "brightness(1)",
      }}
    >
      {/* Gradient Definition */}
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={category.gradient.match(/#[0-9a-f]{6}/gi)?.[0] || "#000"} />
          <stop offset="100%" stopColor={category.gradient.match(/#[0-9a-f]{6}/gi)?.[1] || "#000"} />
        </linearGradient>
      </defs>

      {/* Main Slice with Gradient */}
      <motion.path
        d={pathData}
        fill={`url(#${gradientId})`}
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="1"
        initial={false}
        animate={{
          scale: isHovered ? 1.05 : 1,
          opacity: isHovered ? 1 : 0.95,
        }}
        transition={{ duration: 0.3 }}
        style={{
          transformOrigin: `${center}px ${center}px`,
          filter: "drop-shadow(0 4px 12px rgba(0, 0, 0, 0.4))",
        }}
      />

      {/* Bevel Highlight (top edge) */}
      <path
        d={pathData}
        fill="none"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="2"
        opacity="0.6"
        style={{
          filter: "blur(1px)",
        }}
      />

      {/* Icon */}
      <motion.g
        transform={`translate(${iconX - iconSize / 2}, ${iconY - iconSize / 2})`}
        initial={false}
        animate={{
          scale: isHovered ? 1.2 : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <foreignObject width={iconSize} height={iconSize}>
          <div className="flex items-center justify-center w-full h-full">
            <category.icon
              size={iconSize}
              color="white"
              strokeWidth={2}
              className="drop-shadow-lg"
            />
          </div>
        </foreignObject>
      </motion.g>

      {/* Category Name with Colored Stroke */}
      <text
        x={textX}
        y={textY}
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-base md:text-xl font-bold pointer-events-none"
        fill="white"
        stroke={category.strokeColor}
        strokeWidth="1"
        style={{ 
          fontFamily: "Inter, system-ui, sans-serif",
          paintOrder: "stroke fill",
          filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.5))",
        }}
      >
        {category.name}
      </text>
    </g>
  );
}

// Tooltip Component
interface TooltipProps {
  category: Category;
}

function Tooltip({ category }: TooltipProps) {
  return (
    <motion.div
      className="absolute z-50 pointer-events-none"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ opacity: 0, scale: 0.85, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 10 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-white/20 p-5 md:p-6 min-w-[240px] md:min-w-[280px] shadow-2xl"
        style={{
          boxShadow: `0 20px 60px rgba(0, 0, 0, 0.5), 0 0 0 1px ${category.strokeColor}40`,
        }}
      >
        {/* Header */}
        <h3
          className="font-bold text-lg md:text-xl mb-4 text-white"
          style={{ 
            fontFamily: "Inter, system-ui, sans-serif",
            textShadow: `0 0 20px ${category.strokeColor}80`,
          }}
        >
          {category.name}
        </h3>

        {/* Skills List */}
        <ul className="space-y-2">
          {category.skills.map((skill, index) => (
            <motion.li
              key={index}
              className="flex items-center gap-3 text-white/90 text-sm md:text-base"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ 
                  background: category.strokeColor,
                  boxShadow: `0 0 8px ${category.strokeColor}`,
                }}
              />
              {skill}
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}