import { useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import {
  SignalPreview,
  HeadroomPreview,
  ChronoWeavePreview,
  BumperPreview,
} from "./previews";

/* ──────────────────────────────────────────────────────────────────────────
   The hero, rebuilt out of the page's own parts.

   The previous one was a particle field over a WebGL lattice, and the note on
   it was that it felt like a different website from everything below. That is
   exactly right, and it is the same fault the broadsheet plate had: a hero
   that does not share a vocabulary with its page reads as two sites stacked,
   which is worse than either on its own.

   So this is built from the SAME classes the rest of the homepage uses —
   .band, .band__in, .micro, .display, .lead, .hair, and .stage__screen for
   the frame. Not lookalikes: the identical rules. Consistency by
   construction rather than by resemblance, which means it cannot drift when
   one of them is edited later.

   THE ANATOMY IS THE WORK STAGE'S. Copy on the left, a framed live surface on
   the right, asymmetric. A visitor meets the same object in the first screen
   that they will scroll through below, so the page teaches its own layout
   once and then repeats it.

   THE INTERACTION IS THE PAGE'S TOO. Hovering a project in the index swaps
   what is running in the frame and tints it to that project's accent — the
   same index-and-surface binding the work stage uses, introduced here first.
   Nothing auto-cycles: it answers a hover, which is the rule the rest of the
   page now follows.

   WHAT WENT, and it is worth being plain about it: the particle assembly and
   the 3D lattice. Both were liked, and both are what made this section belong
   to a different design. They can come back the moment the whole page moves
   toward that language, but they cannot sit on top of a quiet editorial page
   and be consistent with it.
   ────────────────────────────────────────────────────────────────────────── */

const WORK = [
  { n: "01", name: "Signal", to: "/signal", accent: "#1F9D55", Preview: SignalPreview },
  { n: "02", name: "Headroom", to: "/headroom", accent: "#34D399", Preview: HeadroomPreview },
  { n: "03", name: "ChronoWeave", to: "/chronoweave", accent: "#A78BFA", Preview: ChronoWeavePreview },
  { n: "04", name: "Bumper", to: "/bumper", accent: "#14B8A6", Preview: BumperPreview },
];

function Rise({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduce ? { duration: 0.3 } : { duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  const reduce = !!useReducedMotion();
  /* which project is showing in the frame. Defaults to the first rather than
     cycling on a timer — the page's rule is that motion answers the reader. */
  const [i, setI] = useState(0);
  const live = WORK[i];

  return (
    <section
      className="band band--ink herox"
      aria-label="Introduction"
      style={{ ["--ac" as string]: live.accent }}
    >
      <div className="band__in herox__in">
        <Rise className="herox__top">
          <span className="micro">Jay Harwani</span>
          <span className="micro">Baltimore, MD</span>
        </Rise>
        <Rise delay={0.04}>
          <hr className="hair" />
        </Rise>

        {/* The headline spans, the way every other band's head does. It was
            briefly inside the left column and the measurement killed that
            immediately: the longer line needs 1122px at display size and the
            column is 492, so it would have had to drop to 45px — smaller than
            the section heads below it, which is the wrong hierarchy. */}
        <Rise delay={0.1}>
          <h1 className="display herox__head">
            I design interfaces
            <br />
            that get out of the way.
          </h1>
        </Rise>
        <Rise delay={0.18}>
          <p className="lead herox__sub">
            Designer who ships the front end. Four products, all live.
          </p>
        </Rise>

        <div className="herox__grid">
          <div className="herox__copy">
            <Rise delay={0.26}>
              <ul className="herox__index">
                {WORK.map((w, k) => (
                  <li key={w.name}>
                    <Link
                      to={w.to}
                      className={`hrow${k === i ? " hrow--on" : ""}`}
                      style={{ ["--ac" as string]: w.accent }}
                      onMouseEnter={() => setI(k)}
                      onFocus={() => setI(k)}
                    >
                      <span className="hrow__n">{w.n}</span>
                      <span className="hrow__name">{w.name}</span>
                      <span className="hrow__go" aria-hidden="true">
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Rise>
          </div>

          {/* The same frame the work stage uses — .stage__screen is reused
              verbatim so the two sections cannot drift apart. */}
          <Rise delay={0.22} className="herox__frame">
            <div className="stage__screen herox__screen">
              {WORK.map((w, k) => (
                <div
                  key={w.name}
                  className={`stage__slide${k === i ? " is-on" : ""}`}
                  aria-hidden={k !== i}
                >
                  <w.Preview active={k === i && !reduce} />
                </div>
              ))}
            </div>
          </Rise>
        </div>

        <Rise delay={0.34}>
          <hr className="hair" />
        </Rise>
        <Rise delay={0.38} className="herox__foot">
          <span className="micro">Selected work ↓</span>
          <span className="micro">Open to full-time</span>
        </Rise>
      </div>
    </section>
  );
}
