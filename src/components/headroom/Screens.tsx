import { Reveal } from "./atoms";

/* --------------------------------------------------------------------------
   THE PRODUCT, ANNOTATED.

   Real captures with numbered pins on the parts that matter and a key
   underneath. Labels floating on the screen itself were the first attempt
   and they do not survive the arithmetic: at a 300px phone, a label sized to
   the container renders at roughly 25px, and sized to be legible it covers
   the interface it is pointing at. A pin costs nine pixels and the sentence
   goes where there is room for it.

   Positions are percentages of the 446x1000 captures, measured off the
   images. Every note describes something visible in the shot above it.
   -------------------------------------------------------------------------- */

type Pin = { x: number; y: number; note: string };

const SCREENS: Array<{ src: string; tag: string; alt: string; pins: Pin[] }> = [
  {
    src: "/headroom/today-healthy.png",
    tag: "HOME",
    alt: "Headroom's home screen: $1,730 safe to spend, marked On track, with $87 a day and 20 days to payday, and Rent and Wifi listed under Coming up",
    pins: [
      { x: 37, y: 28, note: "The only number. What's safe to spend today." },
      { x: 78, y: 21.5, note: "Status says On track. It never turns red." },
      { x: 50, y: 54, note: "What's coming, and the day it lands." },
    ],
  },
  {
    src: "/headroom/plan.png",
    tag: "PLAN",
    alt: "Headroom's plan screen: a $2,500 balance, a $5,000 monthly paycheck, and two bills — Rent $650 and Wifi $120",
    pins: [
      { x: 50, y: 26, note: "Your balance, typed in once." },
      { x: 50, y: 34.5, note: "Your paycheck, and when it lands." },
      { x: 50, y: 53, note: "Bills. No categories, no graphs, nothing to file." },
    ],
  },
];

export function Screens() {
  return (
    <div className="annotated">
      {SCREENS.map((s, i) => (
        <Reveal className="annot" key={s.tag} delay={i * 0.08}>
          <div className="shotPhone">
            <div className="frame">
              <div className="screen">
                <img src={s.src} alt={s.alt} width={446} height={1000} loading="lazy" decoding="async" />
                {s.pins.map((p, n) => (
                  <span
                    className="pin"
                    key={p.note}
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    aria-hidden="true"
                  >
                    {n + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <span className="tag mono">{s.tag}</span>
          <ol className="key">
            {s.pins.map((p, n) => (
              <li key={p.note}>
                <b>{n + 1}</b>
                {p.note}
              </li>
            ))}
          </ol>
        </Reveal>
      ))}
    </div>
  );
}
