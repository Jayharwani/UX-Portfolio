import { motion } from "motion/react";
import DriftMapImage from "../assets/chronoweave-driftmap.png";
import LiveNudgeImage from "../assets/chronoweave-livenudge.png";
import TodaysRhythmImage from "../assets/chronoweave-todaysrhythm.png";
import WeeklyInsightsImage from "../assets/chronoweave-weeklyinsights.png";
import CalibrateImage from "../assets/chronoweave-calibrate.png";
import TimeFeelImage from "../assets/chronoweave-timefeel.png";

// Screen 1: Drift Map
export function TodaysRhythmScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0 }}
      className="flex justify-center w-full"
    >
      <div className="relative w-full max-w-[280px]">
        <img 
          src={DriftMapImage} 
          alt="Drift Map screen showing time perception patterns"
          className="w-full h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}

// Screen 2: Live Nudge
export function LiveNudgeScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex justify-center w-full"
    >
      <div className="relative w-full max-w-[280px]">
        <img 
          src={LiveNudgeImage} 
          alt="Live Nudge screen showing sensory feedback modes"
          className="w-full h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}

// Screen 3: Today's Rhythm
export function WeeklyInsightsScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="flex justify-center w-full"
    >
      <div className="relative w-full max-w-[280px]">
        <img 
          src={TodaysRhythmImage} 
          alt="Today's Rhythm screen showing time stability forecast"
          className="w-full h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}

// Screen 4: Weekly Insights Detail
export function WeeklyInsightsDetailScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0 }}
      className="flex justify-center w-full"
    >
      <div className="relative w-full max-w-[280px]">
        <img 
          src={WeeklyInsightsImage} 
          alt="Weekly Insights screen with drift calendar"
          className="w-full h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}

// Screen 5: Calibrate
export function CalibrateScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex justify-center w-full"
    >
      <div className="relative w-full max-w-[280px]">
        <img 
          src={CalibrateImage} 
          alt="Calibrate Your Time Sense screen"
          className="w-full h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}

// Screen 6: Time Feel
export function TimeFeelScreen() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: 0.4 }}
      className="flex justify-center w-full"
    >
      <div className="relative w-full max-w-[280px]">
        <img 
          src={TimeFeelImage} 
          alt="How does time feel to you screen"
          className="w-full h-auto object-contain"
        />
      </div>
    </motion.div>
  );
}