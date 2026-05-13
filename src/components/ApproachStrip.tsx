import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

const SUIT_RED_DEEP = "#B91C1C";

const PRACTICE_AREAS = [
  "Behavior design",
  "AI explainability",
  "Accessibility-first patterns",
  "Design systems",
  "Human–robot collaboration",
  "Trust calibration",
  "Production handoff",
  "Research → prototype",
  "Component libraries",
  "Enterprise UX",
  "Prototyping in code",
];

export function ApproachStrip() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: "#FAFAF7" }}
    >
      {/* Static ambient orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "5%",
          left: "-10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(185,28,28,0.08) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: "10%",
          right: "-10%",
          width: "550px",
          height: "550px",
          background:
            "radial-gradient(circle, rgba(180,83,9,0.08) 0%, transparent 65%)",
          filter: "blur(60px)",
        }}
      />

      {/* Editorial column lines */}
      <div className="absolute inset-0 pointer-events-none hidden lg:flex justify-between max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="w-px h-full"
            style={{ backgroundColor: "rgba(15,23,42,0.04)" }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-24 sm:py-32">

        {/* Header */}
        <div className="grid grid-cols-12 gap-6 mb-16 sm:mb-20">
          <motion.div
            className="col-span-12 md:col-span-3 flex flex-col gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{
                color: "#71717A",
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              }}
            >
              Section //01
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.25em]"
              style={{
                color: "#A1A1AA",
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              }}
            >
              How I work
            </span>
          </motion.div>

          <motion.div
            className="col-span-12 md:col-span-9"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2
              className="leading-[1.0] tracking-[-0.035em]"
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                color: "#09090B",
                fontSize: "clamp(38px, 6.5vw, 84px)",
              }}
            >
              From{" "}
              <span
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: SUIT_RED_DEEP,
                }}
              >
                spark
              </span>{" "}
              to ship.
            </h2>
            <p
              className="mt-4 text-[12px] sm:text-[13px]"
              style={{
                color: "#52525B",
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              end-to-end · solo · production-ready
            </p>
          </motion.div>
        </div>

        {/* Practice areas marquee */}
        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          <div
            className="flex items-baseline justify-between mb-5 pb-3"
            style={{ borderBottom: "1px solid rgba(15,23,42,0.1)" }}
          >
            <span
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{
                color: "#71717A",
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              }}
            >
              Practice areas
            </span>
            <span
              className="text-[10px] uppercase tracking-[0.22em]"
              style={{
                color: "#A1A1AA",
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              }}
            >
              {String(PRACTICE_AREAS.length).padStart(2, "0")} domains
            </span>
          </div>

          <div className="relative overflow-hidden" style={{ height: 44 }}>
            <div
              className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(to right, #FAFAF7, transparent)",
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{
                background: "linear-gradient(to left, #FAFAF7, transparent)",
              }}
            />

            <motion.div
              className="flex items-center gap-8 absolute whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {[...PRACTICE_AREAS, ...PRACTICE_AREAS].map((area, i) => (
                <span
                  key={i}
                  className="flex items-center gap-8 flex-shrink-0"
                >
                  <span
                    style={{
                      color: "#09090B",
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                      fontSize: "clamp(15px, 1.5vw, 18px)",
                    }}
                  >
                    {area}
                  </span>
                  <span
                    style={{
                      color: SUIT_RED_DEEP,
                      fontFamily: "Playfair Display, serif",
                      fontStyle: "italic",
                      fontSize: 16,
                    }}
                  >
                    ✦
                  </span>
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="mt-20 sm:mt-24 flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
        >
          <span
            className="text-[10px] uppercase tracking-[0.25em] mb-4"
            style={{
              color: "#71717A",
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            }}
          >
            Selected work
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown
              className="w-5 h-5"
              style={{ color: "#09090B" }}
              strokeWidth={2}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
