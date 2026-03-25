import { motion } from "motion/react";
import { ReactNode } from "react";
import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CaseStudyCardProps {
  image?: string;
  imageComponent?: ReactNode;
  title: string;
  description: string;
  link: string;
  category: string;
  reverse?: boolean;
  index: number;
  comingSoon?: boolean;
}

export function CaseStudyCard({ image, imageComponent, title, description, link, category, reverse = false, index, comingSoon = false }: CaseStudyCardProps) {
  const CardContent = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={!comingSoon ? { 
        y: -4,
        transition: { duration: 0.2 }
      } : {}}
      className={comingSoon ? "opacity-70" : ""}
    >
      {/* Premium card wrapper */}
      <div className="relative p-[1px] rounded-2xl bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-200 group">
        {/* Professional hover glow */}
        <div className={`absolute inset-0 rounded-2xl bg-teal-500/10 opacity-0 blur-xl transition-opacity duration-300 ${comingSoon ? "" : "group-hover:opacity-100"}`} />
        
        <Card className={`relative overflow-hidden bg-white border-0 transition-all duration-300 rounded-2xl ${comingSoon ? "cursor-default" : "hover:shadow-lg"}`}>
          <div className="block relative">
          <div className={`grid md:grid-cols-2 gap-0 ${reverse ? 'md:grid-flow-col-dense' : ''}`}>
            {/* Image Section */}
            <div className={`relative overflow-hidden bg-neutral-50 ${reverse ? 'md:col-start-2' : ''}`}>
              <div className="aspect-[4/3] relative">
                {imageComponent ? (
                  <div className={`w-full h-full transition-all duration-300 ${comingSoon ? "" : "group-hover:scale-[1.02]"}`}>
                    {imageComponent}
                  </div>
                ) : image ? (
                  <ImageWithFallback
                    src={image}
                    alt={title}
                    className={`w-full h-full object-cover transition-all duration-300 ${comingSoon ? "" : "group-hover:scale-[1.02]"}`}
                  />
                ) : null}
                {!comingSoon && !imageComponent && (
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                {comingSoon && (
                  <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm flex items-center justify-center">
                    <motion.div 
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, duration: 0.4 }}
                      className="bg-teal-600 px-6 py-3 rounded-lg shadow-lg"
                    >
                      <span className="text-white tracking-wide font-medium text-sm">Coming Soon</span>
                    </motion.div>
                  </div>
                )}
              </div>
              
              {/* Professional Badge */}
              <div className="absolute top-6 left-6 z-10">
                <Badge className="bg-white/95 backdrop-blur-sm text-neutral-700 border border-neutral-200 shadow-sm px-4 py-1.5 rounded-full text-sm font-medium">
                  {category}
                </Badge>
              </div>
            </div>

            {/* Content Section */}
            <div className={`flex flex-col justify-center p-8 md:p-12 lg:p-16 bg-white ${reverse ? 'md:col-start-1' : ''}`}>
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className={`text-neutral-900 transition-colors duration-200 text-3xl md:text-4xl font-semibold ${comingSoon ? "" : "group-hover:text-teal-700"}`}>
                    {title}
                  </h3>
                  <p className="text-neutral-600 leading-relaxed text-lg">
                    {description}
                  </p>
                </div>

                {/* Professional CTA button */}
                {!comingSoon && (
                  <div className="pt-4">
                    <button className="group/btn relative inline-flex items-center gap-2.5 px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-all duration-200 ease-out">
                      <span className="text-sm font-medium text-neutral-800 tracking-tight">
                        Read the case
                      </span>
                      <ArrowRight className="w-4 h-4 text-neutral-600 group-hover/btn:translate-x-1 transition-transform duration-200" strokeWidth={2} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        </Card>
      </div>
    </motion.div>
  );

  return comingSoon ? CardContent : (
    <Link to={link}>
      {CardContent}
    </Link>
  );
}