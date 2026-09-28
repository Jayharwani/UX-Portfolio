import { motion, useReducedMotion } from "motion/react";
import { CountUp } from "./atoms";

/* --------------------------------------------------------------------------
   THE DETAILS — four things you feel and never notice, shown rather than
   described. Each loops quietly once it is on screen; none of them loops
   under reduced motion, where they settle into the state that matters.

   The amber is the point of the second one: the product never goes red at
   the person. Getting tight is information, not a telling-off.
   -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;
const view = { once: false, amount: 0.6 } as const;

export function Demos() {
  const reduce = useReducedMotion();
  const loop = (extra: object) =>
    reduce ? {} : { ...extra, transition: { duration: 2.6, ease: EASE, repeat: Infinity, repeatDelay: 0.8 } };

  return (
    <div className="demos">
      <div className="demo">
        <span className="big mono">
          <CountUp to={1730} duration={1.6} />
        </span>
        <span className="cap mono">FIGURES NEVER JUMP</span>
      </div>

      <div className="demo">
        <motion.span
          className="pill"
          initial={reduce ? false : { opacity: 0.35, y: 6 }}
          whileInView={reduce ? { opacity: 1 } : { opacity: [0.35, 1, 1, 0.35], y: [6, 0, 0, 6] }}
          viewport={view}
          {...loop({})}
        >
          Getting tight
        </motion.span>
        <span className="cap mono">AMBER, NEVER RED</span>
      </div>

      <div className="demo" style={{ justifyContent: "flex-end" }}>
        <motion.div
          className="sheet"
          initial={reduce ? false : { y: 62 }}
          whileInView={reduce ? { y: 0 } : { y: [62, 0, 0, 62] }}
          viewport={view}
          {...loop({})}
        />
        <span className="cap mono" style={{ marginTop: 16 }}>
          SHEETS SLIDE, NEVER POP
        </span>
      </div>

      <div className="demo">
        <motion.span
          className="press"
          initial={false}
          whileInView={reduce ? {} : { scale: [1, 0.955, 1, 1] }}
          viewport={view}
          {...loop({})}
        >
          Add
        </motion.span>
        <span className="cap mono">PRESS HAS WEIGHT</span>
      </div>
    </div>
  );
}
