import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect, useRef } from "react";

export function HeadroomCard() {
  const [count, setCount] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          const target = 1730;
          const duration = 1400;
          let start: number | null = null;
          const step = (t: number) => {
            if (start === null) start = t;
            const p = Math.min((t - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link to="/headroom" className="block">
      <div
        ref={cardRef}
        className="relative overflow-hidden mx-auto rounded-[16px] md:rounded-[22px]"
        style={{
          width: "100%",
          maxWidth: "1340px",
          minHeight: "360px",
          background: "radial-gradient(ellipse at 70% 30%, #0C2A20 0%, #0A1F18 50%, #07140F 100%)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute"
          style={{
            top: "-8%",
            right: "8%",
            width: "48%",
            aspectRatio: "1",
            background: "radial-gradient(circle, rgba(14,158,107,0.16) 0%, rgba(16,185,129,0.06) 40%, transparent 68%)",
          }}
        />

        {/* Top-left badge */}
        <motion.div
          className="absolute flex items-center gap-2"
          style={{
            top: "24px",
            left: "24px",
            padding: "6px 14px",
            borderRadius: "100px",
            backgroundColor: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        >
          <div
            className="rounded-full"
            style={{
              width: "6px",
              height: "6px",
              backgroundColor: "#0E9E6B",
              filter: "drop-shadow(0 0 6px #0E9E6B)",
              animation: "pulse-dot 2.2s ease-in-out infinite",
            }}
          />
          <span
            style={{
              fontFamily: "DM Sans, sans-serif",
              fontSize: "13px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "0.05em",
            }}
          >
            PWA · Safe-to-Spend Money App
          </span>
        </motion.div>

        {/* Content + visual */}
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:min-h-[700px] min-h-[420px]">

          {/* Left content */}
          <div className="relative z-10 flex flex-col gap-3 md:gap-[18px] p-6 pt-16 md:p-12 md:pt-20 lg:p-[50px] lg:pb-16 lg:absolute lg:bottom-16 lg:left-[50px] lg:max-w-[52%]">
            {/* Title */}
            <motion.h1
              className="text-[32px] sm:text-[56px] md:text-[68px] lg:text-[80px]"
              style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, lineHeight: 0.93, letterSpacing: "-2px" }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            >
              <span style={{ color: "#FFFFFF" }}>Head</span>
              <span
                style={{
                  background: "linear-gradient(120deg, #0E9E6B 0%, #34D399 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  backgroundSize: "200% 200%",
                  animation: "gradient-shift 4s ease-in-out infinite",
                }}
              >
                room
              </span>
            </motion.h1>

            {/* Feature pills */}
            <motion.div
              className="flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.32, ease: "easeOut" }}
            >
              {[
                { label: "Safe to Spend", color: "#0E9E6B", bg: "rgba(14,158,107,0.08)", border: "rgba(14,158,107,0.30)" },
                { label: "On-Device", color: "#34D399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.30)" },
                { label: "No Bank Login", color: "#FBBF24", bg: "rgba(251,191,36,0.08)", border: "rgba(251,191,36,0.30)" },
              ].map((pill) => (
                <div
                  key={pill.label}
                  style={{
                    padding: "5px 12px",
                    borderRadius: "100px",
                    backgroundColor: pill.bg,
                    border: `1px solid ${pill.border}`,
                    color: pill.color,
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: "10.5px",
                    fontWeight: 600,
                  }}
                >
                  {pill.label}
                </div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              className="hidden sm:block"
              style={{ fontFamily: "DM Sans, sans-serif", fontSize: "15.5px", fontWeight: 400, color: "rgba(255,255,255,0.58)", lineHeight: 1.72 }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.42, ease: "easeOut" }}
            >
              The world doesn't need another budgeting app. So I didn't build one. Headroom answers the one question the others ignore — can I spend this, right now?
            </motion.p>

            {/* CTA */}
            <motion.button
              className="inline-flex items-center gap-2"
              style={{ padding: "10px 18px", borderRadius: "100px", backgroundColor: "#FFFFFF", color: "#07140F", fontFamily: "DM Sans, sans-serif", fontSize: "12px", fontWeight: 700, width: "fit-content" }}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.52, ease: "easeOut" }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Read case study</span>
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </motion.button>
          </div>

          {/* Right visual — recreated phone with safe-to-spend number */}
          <motion.div
            className="relative flex items-center justify-center py-6 lg:absolute lg:py-0 lg:top-1/2 lg:right-[90px] lg:-translate-y-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {/* Outer glow */}
            <div
              className="absolute hidden lg:block"
              style={{
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "380px",
                height: "420px",
                background: "radial-gradient(circle, rgba(14,158,107,0.14) 0%, rgba(52,211,153,0.05) 50%, transparent 100%)",
                borderRadius: "50%",
                animation: "pulse-dot 5s ease-in-out infinite",
              }}
            />

            {/* Phone */}
            <div
              className="w-[210px] sm:w-[230px] lg:w-[250px]"
              style={{ position: "relative", zIndex: 1, borderRadius: "30px", background: "#0C120E", padding: "8px", boxShadow: "0 0 60px rgba(14,158,107,0.12), 0 20px 40px rgba(0,0,0,0.4)" }}
            >
              <div className="relative overflow-hidden" style={{ borderRadius: "24px", backgroundColor: "#FFFFFF", aspectRatio: "393 / 760" }}>
                {/* mini today screen */}
                <div className="absolute inset-0 flex flex-col p-5">
                  <span className="text-[10px] uppercase tracking-[0.16em]" style={{ color: "#97A09B", fontFamily: "ui-monospace, monospace" }}>
                    Safe to spend
                  </span>
                  <div className="flex items-start mt-1" style={{ whiteSpace: "nowrap" }}>
                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 16, color: "#10160F", marginTop: 4 }}>$</span>
                    <span style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 40, lineHeight: 1, color: "#10160F", letterSpacing: "-0.03em", fontVariantNumeric: "tabular-nums" }}>
                      {count.toLocaleString()}
                    </span>
                  </div>
                  <span className="mt-1.5 text-[11px]" style={{ color: "#0A7A52", fontFamily: "DM Sans, sans-serif", fontWeight: 600 }}>
                    ≈ $87/day · 20 days
                  </span>
                  <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "#E6F5EE" }}>
                    <div className="h-full rounded-full" style={{ width: "69%", backgroundColor: "#0E9E6B" }} />
                  </div>

                  <span className="mt-5 text-[9px] uppercase tracking-[0.14em]" style={{ color: "#97A09B", fontFamily: "ui-monospace, monospace" }}>
                    What's coming
                  </span>
                  {[
                    { label: "Rent", val: "$650" },
                    { label: "Wifi", val: "$120" },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2" style={{ borderBottom: "1px solid #E7EBE8" }}>
                      <span className="text-[11px] font-semibold" style={{ color: "#10160F", fontFamily: "DM Sans, sans-serif" }}>{row.label}</span>
                      <span className="text-[11px] font-semibold" style={{ color: "#5B6560", fontFamily: "DM Sans, sans-serif", fontVariantNumeric: "tabular-nums" }}>{row.val}</span>
                    </div>
                  ))}

                  <div className="mt-auto flex items-center justify-around pt-3" style={{ borderTop: "1px solid #E7EBE8" }}>
                    {["Today", "Plan", "Menu"].map((t, i) => (
                      <span key={t} className="text-[9.5px] font-semibold" style={{ color: i === 0 ? "#0E9E6B" : "#97A09B", fontFamily: "DM Sans, sans-serif" }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </Link>
  );
}
