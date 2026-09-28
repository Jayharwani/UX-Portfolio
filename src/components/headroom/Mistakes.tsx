import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import { CountUp } from "./atoms";
import { Skin } from "./Skin";

/* --------------------------------------------------------------------------
   THE MISTAKES — the centrepiece, on ink.

   The section class is `hd-dark`, not `dark`: globals.css ships a bare
   shadcn `.dark` block that sets --accent to a dark grey, so a section named
   `dark` painted its own accent invisible.

   Five thrown away and the sixth kept, one at a time, while the section is
   pinned. This is the part of the page that demonstrates judgement rather
   than asserting it, so it gets the most scroll and the only dark ground.

   WHAT THESE PICTURES ARE. The originals were not kept and there is no
   public repository to recover them from, so the five rejected directions
   are reconstructions built from their own version notes — a neon glass
   panel, a purple mesh, an ink-and-jade scheme carrying too many accents, a
   screen buried in charts, a layout that behaved like a web page. They are
   labelled as reconstructions on the page. The sixth is the real screenshot,
   because that one still exists.
   -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Names are the originals; verdicts are the short form. */
const VERSIONS = [
  ["Glassmorphic neon", "Too toy-like."],
  ["Candy-purple mesh", "Looked like every AI app."],
  ["Ink + jade", "No colour discipline."],
  ["Forecast graphs everywhere", "Nobody could read them."],
  ["Felt like a website", "Not an app."],
  ["White + emerald, locked", "One job per screen."],
] as const;

/** the share of the scroll spent on the headline before the sequence starts */
const INTRO = 0.13;

export function Mistakes() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const k = (p - INTRO) / (1 - INTRO);
    const next = Math.max(0, Math.min(VERSIONS.length - 1, Math.floor(k * VERSIONS.length)));
    setI((prev) => (prev === next ? prev : next));
  });

  /* Reduced motion gets all six at once, in order, with no pin and no
     crossfade. The section stops being a scroll mechanism and becomes a list,
     which is the same information without the machinery. */
  if (reduce) {
    return (
      <section className="hd-dark" ref={ref}>
        <div className="stick">
          <span className="eyebrow">SIX VERSIONS</span>
          <div className="count mono">6</div>
          <h2>I redesigned it six times.</h2>
          <div className="versions">
            {VERSIONS.map(([name, verdict], n) => (
              <div className="version" key={name}>
                <Skin n={n + 1} />
                <div>
                  <span className="no mono">{String(n + 1).padStart(2, "0")}</span>
                  <p className="verdict">{verdict}</p>
                  <span className="name mono">{name.toUpperCase()}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="recon mono">ONE TO FIVE ARE RECONSTRUCTIONS. THE ORIGINALS WERE NOT KEPT.</p>
        </div>
      </section>
    );
  }

  const [name, verdict] = VERSIONS[i];

  return (
    <section className="hd-dark" ref={ref}>
      <div className="stick">
        <span className="eyebrow">SIX VERSIONS</span>
        <div className="count mono">
          <CountUp to={6} format={(n) => String(Math.round(n))} duration={1.4} />
        </div>
        <h2>I redesigned it six times.</h2>

        <div className="versions">
          <AnimatePresence mode="wait">
            <motion.div
              className="version"
              key={name}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <Skin n={i + 1} />
              <div>
                <span className="no mono">{String(i + 1).padStart(2, "0")} OF 06</span>
                <p className="verdict">{verdict}</p>
                <span className="name mono">{name.toUpperCase()}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="recon mono">
          {i === VERSIONS.length - 1
            ? "THE ONE THAT SHIPPED. REAL SCREENSHOT."
            : "RECONSTRUCTED FROM THE VERSION NOTES. THE ORIGINALS WERE NOT KEPT."}
        </p>
      </div>
    </section>
  );
}
