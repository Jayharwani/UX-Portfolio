import { motion, useReducedMotion } from "motion/react";

/* --------------------------------------------------------------------------
   SECTION 07 — nine rounds, one graphic.

   Each node is the Friction homepage checked out of git at that commit,
   built, and shot at 1440x900 by one script, so the only thing differing
   between frames is the design. The whole process story is this picture;
   the diary that used to run down the page is behind the disclosure under
   it.

   THE ANNOTATIONS ARE ON THE ROUNDS THEY ACTUALLY HAPPENED ON. The brief
   put them on rounds 1, 4 and 6. Reddit was abandoned before round 1
   existed, the comprehension rebuild is round 2, and the screen deleted
   seventeen hours after it shipped is the wall of voices in round 8.
   -------------------------------------------------------------------------- */

type Node = { n: string; date: string; note: string; mark?: string };

const ROUNDS: Node[] = [
  { n: "01", date: "19 Sep", note: "the first pipeline run" },
  {
    n: "02",
    date: "20 Sep",
    note: "rebuilt around comprehension",
    mark: "Three people could not tell what the site was.",
  },
  { n: "03", date: "20 Sep", note: "Hallmark tokens" },
  {
    n: "04",
    date: "20 Sep",
    note: "the WebGL field",
    mark: "Built a 3D landscape of the data.",
  },
  { n: "05", date: "20 Sep", note: "teach the concept first" },
  { n: "06", date: "21 Sep", note: "the patterns layer" },
  { n: "07", date: "22 Sep", note: "a cool ground" },
  {
    n: "08",
    date: "23 Sep",
    note: "the wall of voices",
    mark: "Deleted seventeen hours after it shipped.",
  },
  { n: "09", date: "24 Sep", note: "current" },
];

const EASE = [0.38, 1.21, 0.22, 1] as const;

export function Timeline() {
  const reduce = useReducedMotion();
  return (
    <div className="timeline">
      <ol>
        {ROUNDS.map((r, i) => (
          <motion.li
            key={r.n}
            className={`${r.mark ? "marked" : ""}${i === ROUNDS.length - 1 ? " now" : ""}`}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.52, ease: EASE, delay: i * 0.07 }}
          >
            <figure>
              <img
                src={`/friction/round-${r.n}.webp`}
                alt={`Friction's homepage on ${r.date}: ${r.note}`}
                width={640}
                height={400}
                loading="lazy"
                decoding="async"
              />
              <figcaption>
                <b className="label">{r.date}</b>
                {i === ROUNDS.length - 1 ? <span className="tag">current</span> : null}
              </figcaption>
            </figure>
            {r.mark ? <p className="mark">{r.mark}</p> : null}
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
