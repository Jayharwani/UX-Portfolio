import { motion } from "motion/react";
import { 
  Figma, 
  Code2, 
  Palette, 
  Database,
  Layers,
  PenTool,
  FileCode,
  BarChart3,
  MessageSquare,
  Box,
  Layout,
  Zap
} from "lucide-react";

const toolCategories = [
  {
    category: "Design",
    icon: Palette,
    color: "from-pink-500 to-rose-500",
    bgColor: "from-pink-50 to-rose-50",
    tools: [
      { name: "Figma", icon: Figma },
      { name: "Sketch", icon: PenTool },
      { name: "Adobe XD", icon: Layout },
      { name: "Framer", icon: Box },
    ]
  },
  {
    category: "Development",
    icon: Code2,
    color: "from-cyan-500 to-blue-500",
    bgColor: "from-cyan-50 to-blue-50",
    tools: [
      { name: "JavaScript", icon: FileCode },
      { name: "HTML/CSS", icon: Layout },
      { name: "Flutter", icon: Code2 },
      { name: "Webflow", icon: Zap },
    ]
  },
  {
    category: "Research & Analytics",
    icon: BarChart3,
    color: "from-violet-500 to-purple-500",
    bgColor: "from-violet-50 to-purple-50",
    tools: [
      { name: "UX Research", icon: MessageSquare },
      { name: "Power BI", icon: BarChart3 },
      { name: "Tableau", icon: BarChart3 },
      { name: "Analytics", icon: Database },
    ]
  },
  {
    category: "Prototyping",
    icon: Layers,
    color: "from-amber-500 to-orange-500",
    bgColor: "from-amber-50 to-orange-50",
    tools: [
      { name: "Prototyping", icon: Layers },
      { name: "Wireframing", icon: PenTool },
      { name: "Miro", icon: Layout },
      { name: "Notion", icon: FileCode },
    ]
  }
];

export function ToolsSection() {
  return (
    <section className="py-16 sm:py-24 md:py-32 bg-gradient-to-b from-slate-50 to-white overflow-hidden relative">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-30" />
      
      {/* Static gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-64 sm:w-96 h-64 sm:h-96 bg-cyan-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-64 sm:w-96 h-64 sm:h-96 bg-purple-400/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative">
        {/* Header */}
        <motion.div 
          className="text-center mb-12 sm:mb-16 space-y-3 sm:space-y-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-full mb-4 sm:mb-6">
            <Zap className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-cyan-600" />
            <span className="text-cyan-700 text-[10px] sm:text-xs tracking-wide">TOOLKIT</span>
          </div>
          <h2 className="text-foreground text-2xl sm:text-3xl md:text-4xl">
            Tools & Technologies
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base px-4">
            A curated collection of tools I use to transform ideas into impactful digital experiences
          </p>
        </motion.div>

        {/* Tool Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {toolCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                duration: 0.6, 
                delay: categoryIndex * 0.1,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <motion.div
                className="relative bg-white rounded-2xl p-8 shadow-sm border border-slate-200/60 h-full overflow-hidden group"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                {/* Gradient background */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${category.bgColor} rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-500`} />
                
                {/* Category Header */}
                <div className="relative flex items-center gap-3 mb-6">
                  <motion.div 
                    className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}
                    whileHover={{ rotate: 5, scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <category.icon className="w-5 h-5 text-white" strokeWidth={2} />
                  </motion.div>
                  <div>
                    <h3 className="text-slate-900">{category.category}</h3>
                    <div className={`h-0.5 w-12 rounded-full bg-gradient-to-r ${category.color} mt-1`} />
                  </div>
                </div>

                {/* Tools Grid */}
                <div className="relative grid grid-cols-2 gap-3">
                  {category.tools.map((tool, toolIndex) => (
                    <motion.div
                      key={tool.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.4, 
                        delay: categoryIndex * 0.1 + toolIndex * 0.05,
                        ease: [0.22, 1, 0.36, 1]
                      }}
                      whileHover={{ scale: 1.05, y: -2 }}
                      className="group/tool"
                    >
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-200/50 group-hover/tool:bg-white group-hover/tool:border-slate-300 group-hover/tool:shadow-sm transition-all duration-200">
                        <motion.div
                          className={`p-2 rounded-lg bg-gradient-to-br ${category.color}`}
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <tool.icon className="w-4 h-4 text-white" strokeWidth={2} />
                        </motion.div>
                        <span className="text-slate-700 text-sm group-hover/tool:text-slate-900 transition-colors">
                          {tool.name}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Hover glow effect */}
                <motion.div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl`}
                  style={{
                    background: `radial-gradient(circle at center, transparent 40%, rgba(6, 182, 212, 0.03) 100%)`
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-center"
        >
          {[
            { label: "Tools Mastered", value: "16+" },
            { label: "Years Experience", value: "3+" },
            { label: "Projects Delivered", value: "20+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="relative group/stat"
            >
              <div className="px-6 py-4 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200/60 shadow-sm">
                <div className="text-slate-900 mb-1">{stat.value}</div>
                <div className="text-slate-500 text-sm">{stat.label}</div>
              </div>
              {/* Subtle glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10 rounded-xl opacity-0 group-hover/stat:opacity-100 transition-opacity duration-300 -z-10 blur-xl" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}