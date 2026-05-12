import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

/* ────────────────────────────────────────────────────────── */
/*  Practice areas — concrete topics, not values manifesto    */
/* ────────────────────────────────────────────────────────── */
const practiceAreas = [
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
            "radial-gradient(circle, rgba(15,118,110,0.06) 0%, transparent 65%)",
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
            "radial-gradient(circle, rgba(124,58,237,0.06) 0%, transparent 65%)",
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

        {/* ── Header: eyebrow + single hard claim ── */}
        <div className="grid grid-cols-12 gap-6">
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
              Currently
            </span>

            {/* Live indicator — visually anchors the "currently" */}
            <div className="flex items-center gap-2 mt-3">
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ backgroundColor: "#0F766E" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ backgroundColor: "#0F766E" }}
                />
              </span>
              <span
                className="text-[10.5px] uppercase tracking-[0.2em]"
                style={{
                  color: "#134E4A",
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                }}
              >
                Active
              </span>
            </div>
          </motion.div>

          <motion.div
            className="col-span-12 md:col-span-9"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            <h2
              className="leading-[1.0] tracking-[-0.035em]"
              style={{
                fontFamily: "Syne, sans-serif",
                fontWeight: 700,
                color: "#09090B",
                fontSize: "clamp(34px, 5.8vw, 78px)",
              }}
            >
              Designing AI &amp; robotics
              <br />
              interfaces at the{" "}
              <span
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontStyle: "italic",
                  fontWeight: 500,
                  color: "#0F766E",
                }}
              >
                UMBC CARDS Lab
              </span>
              <span style={{ color: "#52525B" }}>
                {" "}— studying how
              </span>
              <br />
              <span style={{ color: "#52525B" }}>humans &amp; machines</span>
              <br />
              <span style={{ color: "#52525B" }}>build trust over time.</span>
            </h2>

            <p
              className="text-[15px] md:text-[17px] mt-8 max-w-2xl"
              style={{
                color: "#27272A",
                fontFamily: "DM Sans, sans-serif",
                lineHeight: 1.65,
              }}
            >
              My research focuses on the design language of explainability —
              how an autonomous system should disclose uncertainty, defer to a
              user, and adapt when the answer is wrong. The interfaces
              connect{" "}
              <span style={{ color: "#09090B", fontWeight: 600 }}>
                ML researchers, roboticists, and end-users
              </span>{" "}
              who have never sat in the same room.
            </p>
          </motion.div>
        </div>

        {/* ── Practice marquee — single horizontal ticker, no card grid ── */}
        <motion.div
          className="mt-20 sm:mt-28"
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
              {String(practiceAreas.length).padStart(2, "0")} domains
            </span>
          </div>

          <div className="relative overflow-hidden" style={{ height: "44px" }}>
            {/* Edge fades */}
            <div
              className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to right, #FAFAF7, transparent)" }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
              style={{ background: "linear-gradient(to left, #FAFAF7, transparent)" }}
            />

            <motion.div
              className="flex items-center gap-8 absolute whitespace-nowrap"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
              {[...practiceAreas, ...practiceAreas].map((area, i) => (
                <span
                  key={i}
                  className="flex items-center gap-8 flex-shrink-0"
                >
                  <span
                    className="text-[16px] sm:text-[18px]"
                    style={{
                      color: "#09090B",
                      fontFamily: "Syne, sans-serif",
                      fontWeight: 700,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {area}
                  </span>
                  <span
                    style={{
                      color: "#0F766E",
                      fontFamily: "Playfair Display, serif",
                      fontStyle: "italic",
                      fontSize: "16px",
                    }}
                  >
                    ✦
                  </span>
                </span>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* ── Closing: directional hint to the work ── */}
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
