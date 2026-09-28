import { motion, useReducedMotion } from "motion/react";
import { CountUp } from "./atoms";

/* --------------------------------------------------------------------------
   THE PROBLEM, AS A DIAGRAM.

   Balance, minus the bills that have not left yet, equals the only number
   worth showing. The paragraph this replaces said the same thing in sixty
   words.

   THE ARITHMETIC IS THE APP'S OWN. $2,500 is the balance on its Plan screen,
   Rent $650 and Wifi $120 are the two bills listed under it, and $1,730 is
   what its Today screen shows as safe to spend. The brief proposed $1,200 to
   $885: $885 is real — it is the figure on the onboarding card — but it does
   not belong to this subtraction, and $1,200 appears nowhere in the product.
   Since the brief also says not to invent metrics, this uses the numbers
   that reconcile.
   -------------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

/** Two line icons, drawn for this page. The app uses a house and a message. */
function Home() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.6 6.9 8 2.6l5.4 4.3V13a.6.6 0 0 1-.6.6H3.2a.6.6 0 0 1-.6-.6V6.9Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path d="M6.4 13.6V9.4h3.2v4.2" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function Wifi() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2.4 6.2a8 8 0 0 1 11.2 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M4.7 8.7a4.8 4.8 0 0 1 6.6 0" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="8" cy="11.9" r="1.1" fill="currentColor" />
    </svg>
  );
}

const BILLS = [
  { icon: <Home />, name: "Rent", amount: "$650" },
  { icon: <Wifi />, name: "Wifi", amount: "$120" },
];

export function Problem() {
  const reduce = useReducedMotion();
  const view = { once: true, amount: 0.5 } as const;

  return (
    <div className="diagram">
      <div className="row">
        <motion.div
          className="card"
          initial={reduce ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={view}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <span className="k mono">BALANCE</span>
          <span className="v mono">$2,500</span>
        </motion.div>

        <span className="op" aria-hidden="true">
          &minus;
        </span>

        {/* the bills leave, which is the whole point of the picture */}
        <div className="bills">
          {BILLS.map((b, i) => (
            <motion.div
              className="bill"
              key={b.name}
              initial={reduce ? false : { opacity: 0, x: -10 }}
              whileInView={
                reduce
                  ? { opacity: 1 }
                  : { opacity: [0, 1, 1, 0], x: [-10, 0, 0, 74], y: [0, 0, 0, -16] }
              }
              viewport={view}
              transition={{
                /* 2.5s meant the payoff landed almost three seconds after
                   the section arrived, which is longer than anyone waits
                   mid-scroll. */
                duration: reduce ? 0 : 1.8,
                times: [0, 0.2, 0.58, 1],
                ease: EASE,
                delay: 0.25 + i * 0.13,
              }}
            >
              <i>{b.icon}</i>
              <b>{b.name}</b>
              <span className="mono">{b.amount}</span>
            </motion.div>
          ))}
        </div>

        <span className="op" aria-hidden="true">
          =
        </span>

        <motion.div
          className="card safe"
          initial={reduce ? false : { opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={view}
          transition={{ duration: 0.55, ease: EASE, delay: reduce ? 0 : 1.15 }}
        >
          <span className="k mono">SAFE TO SPEND</span>
          <span className="v mono">
            <CountUp to={1730} duration={1.1} />
          </span>
        </motion.div>
      </div>

      <p className="sr">
        A balance of $2,500, minus Rent $650 and Wifi $120, leaves $1,730 safe to spend. Every
        figure is taken from the running app.
      </p>
    </div>
  );
}
