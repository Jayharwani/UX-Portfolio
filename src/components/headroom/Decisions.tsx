import { motion, useReducedMotion } from "motion/react";

/* --------------------------------------------------------------------------
   THE DECISIONS — judgement, as choice then consequence.

   Three things removed and what each removal bought. The removal is the
   design; naming what it cost and what it gained is the part that shows
   whether it was reasoned or lucky.

   Icons are drawn here rather than pulled from a set, in one weight, and
   each one shows the thing being refused with a line struck through it.
   -------------------------------------------------------------------------- */

function Cut({ children }: { children: React.ReactNode }) {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true">
      {children}
      <path d="M4.5 21.5 21.5 4.5" stroke="var(--accent-deep)" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

const DECISIONS = [
  {
    icon: (
      <Cut>
        <rect x="4" y="5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
        <rect x="15" y="5" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
        <rect x="4" y="16" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
        <rect x="15" y="16" width="7" height="7" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
      </Cut>
    ),
    choice: "Cut categories",
    benefit: "Sorting every coffee is the chore people quit over. Nothing to maintain means nothing to abandon.",
  },
  {
    icon: (
      <Cut>
        <rect x="4.5" y="10" width="17" height="11" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M9 10V7.5a4 4 0 0 1 8 0V10" stroke="currentColor" strokeWidth="1.4" />
      </Cut>
    ),
    choice: "No bank login",
    benefit: "Nothing to hand over and nothing to breach. Everything stays on the device, so there is no account to make.",
  },
  {
    icon: (
      <Cut>
        <path d="M4.5 20.5V9M10.5 20.5V4.5M16.5 20.5v-8M22 20.5H3.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </Cut>
    ),
    choice: "Removed the charts",
    benefit: "A whole version was forecast graphs. If people can't read it, cut it — every chart went but one.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

export function Decisions() {
  const reduce = useReducedMotion();
  return (
    <ul className="decisions">
      {DECISIONS.map((d, i) => (
        /* the motion goes on the list item itself; a div between ul and li
           is invalid markup and costs the list its semantics */
        <motion.li
          className="decision"
          key={d.choice}
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE, delay: i * 0.08 }}
        >
          <i aria-hidden="true">{d.icon}</i>
          <b>{d.choice}</b>
          <p>{d.benefit}</p>
        </motion.li>
      ))}
    </ul>
  );
}
