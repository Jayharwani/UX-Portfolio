import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

/* ────────────────────────────────────────────────────────── */
/*  Facts                                                      */
/* ────────────────────────────────────────────────────────── */
const FACTS = [
  "I love watching sitcoms.",
  "I love NYC.",
  "Never watched a single episode of Game of Thrones.",
  "I code too — and build dashboards in Power BI and Tableau.",
  "Photography lover. Saving up for a real camera (it's been 5 years).",
  "5+ years in Figma. It's my second language.",
  "I can relocate anywhere in the US if you give me a job.",
  "Reach me at harwanijay9498@gmail.com — say hi!",
];

const HELMET_APPEAR_DELAY = 1500;
const FIRST_BUBBLE_DELAY = 7000;
const BUBBLE_SHOW_DURATION = 9000;
const BUBBLE_REPEAT_INTERVAL = 30000;

/* ══════════════════════════════════════════════════════════ */
/*  IronManAssistant                                          */
/* ══════════════════════════════════════════════════════════ */
export function IronManAssistant() {
  const [helmetVisible, setHelmetVisible] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const dismissedRef = useRef(false);

  /* Helmet appears 1.5s after page load */
  useEffect(() => {
    const t = setTimeout(() => setHelmetVisible(true), HELMET_APPEAR_DELAY);
    return () => clearTimeout(t);
  }, []);

  /* Bubble cycle */
  useEffect(() => {
    let cancelled = false;
    let showTimer: ReturnType<typeof setTimeout> | null = null;
    let hideTimer: ReturnType<typeof setTimeout> | null = null;

    const scheduleShow = (delay: number) => {
      showTimer = setTimeout(() => {
        if (cancelled || dismissedRef.current) return;
        setBubbleVisible(true);
        hideTimer = setTimeout(() => {
          if (cancelled) return;
          setBubbleVisible(false);
          setFactIndex((i) => (i + 1) % FACTS.length);
          if (!dismissedRef.current) {
            const gap = Math.max(0, BUBBLE_REPEAT_INTERVAL - BUBBLE_SHOW_DURATION);
            scheduleShow(gap);
          }
        }, BUBBLE_SHOW_DURATION);
      }, delay);
    };

    scheduleShow(FIRST_BUBBLE_DELAY);

    return () => {
      cancelled = true;
      if (showTimer) clearTimeout(showTimer);
      if (hideTimer) clearTimeout(hideTimer);
    };
  }, []);

  const handleDismiss = () => {
    dismissedRef.current = true;
    setBubbleVisible(false);
  };

  const handleHelmetClick = () => {
    if (bubbleVisible) return;
    dismissedRef.current = false;
    setBubbleVisible(true);
    setTimeout(() => {
      setBubbleVisible(false);
      setFactIndex((i) => (i + 1) % FACTS.length);
    }, BUBBLE_SHOW_DURATION);
  };

  return (
    <div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 pointer-events-none flex items-end gap-3"
      style={{ zIndex: 60 }}
    >
      {/* ── Speech bubble (left) — FIXED width container ── */}
      <div
        className="flex justify-end"
        style={{
          width: "min(280px, calc(100vw - 120px))",
          alignSelf: "flex-end",
          marginBottom: 24, // lift bubble so tail aligns with helmet's upper-mid
        }}
      >
        <AnimatePresence mode="wait">
          {bubbleVisible && (
            <motion.div
              key={`bubble-${factIndex}`}
              className="pointer-events-auto w-full"
              initial={{ opacity: 0, scale: 0.5, y: 14, rotate: -3 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.75, y: 6 }}
              transition={{
                opacity: { duration: 0.3 },
                scale: { type: "spring", stiffness: 260, damping: 14 },
                y: { type: "spring", stiffness: 260, damping: 14 },
                rotate: { type: "spring", stiffness: 260, damping: 14 },
              }}
              style={{ transformOrigin: "bottom right" }}
            >
              <SpeechBubble fact={FACTS[factIndex]} onDismiss={handleDismiss} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Helmet (right) ── */}
      <div className="pointer-events-none" style={{ perspective: 800 }}>
        <AnimatePresence>
          {helmetVisible && (
            <motion.button
              type="button"
              onClick={handleHelmetClick}
              aria-label="Jay's Iron Man assistant"
              className="relative pointer-events-auto block focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-400/50 rounded-full"
              initial={{ opacity: 0, scale: 0, y: 40, rotate: -25 }}
              animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.93 }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* 3D continuous float */}
              <motion.div
                animate={{
                  rotateY: [-14, 14, -14],
                  rotateX: [-5, 5, -5],
                  y: [0, -5, 0],
                }}
                transition={{
                  rotateY: { duration: 5.2, repeat: Infinity, ease: "easeInOut" },
                  rotateX: { duration: 4.4, repeat: Infinity, ease: "easeInOut" },
                  y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{
                  transformStyle: "preserve-3d",
                  filter:
                    "drop-shadow(0 10px 18px rgba(220, 38, 38, 0.45)) drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                  willChange: "transform",
                }}
              >
                <IronManHelmet />
              </motion.div>

              {/* Idle pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: "1.5px solid rgba(251, 191, 36, 0.4)" }}
                animate={{ scale: [1, 1.18, 1], opacity: [0, 0.5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  SpeechBubble                                               */
/* ────────────────────────────────────────────────────────── */
function SpeechBubble({ fact, onDismiss }: { fact: string; onDismiss: () => void }) {
  return (
    <div className="relative w-full">
      <motion.div
        animate={{ rotate: [-0.5, 0.5, -0.5], y: [0, -2, 0] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        <div
          className="relative rounded-2xl"
          style={{
            backgroundColor: "#FFFFFF",
            border: "2px solid #0A0606",
            boxShadow: "5px 5px 0 #DC2626, 0 14px 30px -10px rgba(220, 38, 38, 0.3)",
            padding: "12px 14px",
          }}
        >
          {/* Dismiss */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            aria-label="Dismiss"
            className="absolute w-6 h-6 rounded-full flex items-center justify-center transition-colors hover:bg-zinc-100 active:scale-90"
            style={{ top: 6, right: 6 }}
          >
            <X className="w-3.5 h-3.5" style={{ color: "#52525B" }} strokeWidth={2.5} />
          </button>

          <div style={{ paddingRight: 24 }}>
            <span
              style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 10,
                color: "#B91C1C",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 700,
                display: "block",
                marginBottom: 4,
                whiteSpace: "nowrap",
              }}
            >
              Did you know?
            </span>
            <p
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 13.5,
                lineHeight: 1.45,
                color: "#09090B",
                margin: 0,
              }}
            >
              {fact}
            </p>
          </div>
        </div>

        {/* Tail pointing right (toward helmet) */}
        <svg
          className="absolute"
          style={{ right: -13, bottom: 12 }}
          width="22"
          height="22"
          viewBox="0 0 22 22"
        >
          <path
            d="M0 5 L22 13 L4 16 Z"
            fill="#FFFFFF"
            stroke="#0A0606"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────── */
/*  IronManHelmet                                              */
/* ────────────────────────────────────────────────────────── */
function IronManHelmet() {
  const size = 78;
  return (
    <svg
      viewBox="0 0 100 116"
      width={size}
      height={size * 1.16}
      style={{ display: "block" }}
    >
      <defs>
        <filter id="ima-eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" />
        </filter>
        <radialGradient id="ima-gloss" cx="32%" cy="22%">
          <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.85" />
          <stop offset="55%" stopColor="#DC2626" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ima-rimLight" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBBF24" stopOpacity="0" />
          <stop offset="80%" stopColor="#FBBF24" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Helmet base */}
      <path
        d="M50 8 Q72 8, 80 28 Q86 46, 84 60 L82 74 Q78 90, 68 100 Q60 108, 50 110 Q40 108, 32 100 Q22 90, 18 74 L16 60 Q14 46, 20 28 Q28 8, 50 8 Z"
        fill="#DC2626"
        stroke="#FBBF24"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Gloss highlight */}
      <path
        d="M50 8 Q72 8, 80 28 Q86 46, 84 60 L82 74 Q78 90, 68 100 Q60 108, 50 110 Q40 108, 32 100 Q22 90, 18 74 L16 60 Q14 46, 20 28 Q28 8, 50 8 Z"
        fill="url(#ima-gloss)"
      />

      {/* Rim light */}
      <path
        d="M50 8 Q72 8, 80 28 Q86 46, 84 60 L82 74 Q78 90, 68 100 Q60 108, 50 110 Q40 108, 32 100 Q22 90, 18 74 L16 60 Q14 46, 20 28 Q28 8, 50 8 Z"
        fill="none"
        stroke="url(#ima-rimLight)"
        strokeWidth="1"
        opacity="0.7"
      />

      <line
        x1="50" y1="26" x2="50" y2="104"
        stroke="#FBBF24"
        strokeWidth="0.6"
        opacity="0.35"
      />
      <path d="M24 46 Q50 40, 76 46" fill="none" stroke="#FBBF24" strokeWidth="0.9" opacity="0.55" />
      <path d="M22 64 Q30 76, 34 86" fill="none" stroke="#FBBF24" strokeWidth="0.7" opacity="0.42" />
      <path d="M78 64 Q70 76, 66 86" fill="none" stroke="#FBBF24" strokeWidth="0.7" opacity="0.42" />

      <ellipse cx="34" cy="56" rx="13" ry="5" fill="#FCD34D" opacity="0.55" filter="url(#ima-eyeGlow)" />
      <ellipse cx="66" cy="56" rx="13" ry="5" fill="#FCD34D" opacity="0.55" filter="url(#ima-eyeGlow)" />

      <path d="M26 52 L44 52 L40 62 L26 62 Z" fill="#FCD34D" />
      <path d="M56 52 L74 52 L74 62 L60 62 Z" fill="#FCD34D" />

      <motion.g
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M28 54 L40 54 L37 58 L28 58 Z" fill="#FFFFFF" opacity="0.65" />
        <path d="M58 54 L70 54 L70 58 L60 58 Z" fill="#FFFFFF" opacity="0.65" />
      </motion.g>

      <line x1="32" y1="82" x2="68" y2="82" stroke="#FBBF24" strokeWidth="1.2" />
      <line x1="34" y1="86" x2="66" y2="86" stroke="#FBBF24" strokeWidth="0.9" opacity="0.75" />
      <line x1="36" y1="90" x2="64" y2="90" stroke="#FBBF24" strokeWidth="0.6" opacity="0.5" />
      <path d="M40 102 Q50 108, 60 102" fill="none" stroke="#FBBF24" strokeWidth="0.6" opacity="0.35" />
    </svg>
  );
}
