import { Reveal, Tilt } from "./atoms";

/* --------------------------------------------------------------------------
   WHAT I BUILT — the product doing its job.

   Three real screens, each with the one sentence that says what it does and
   why that helps. The previous pass showed these with nothing but a title,
   which told a stranger nothing: a screenshot is evidence, not an
   explanation, and it needs a line to become either.

   Every line describes something visible in the image above it. The status
   pill really does read "On track" in green on the home screen, which is
   where the never-red claim comes from; there is no separate alert capture,
   so the third screen is described as what it actually is — the sheet for
   logging a spend — rather than as a warning screen I do not have.
   -------------------------------------------------------------------------- */

const SCREENS = [
  {
    src: "/headroom/today-healthy.png",
    tag: "HOME",
    line: "One number, what's coming next, and a status that never turns red.",
    alt: "Headroom's home screen: $1,730 safe to spend, marked On track, with $87 a day and 20 days to payday, and Rent and Wifi listed under Coming up",
  },
  {
    src: "/headroom/plan.png",
    tag: "PLAN",
    line: "Set your balance, paycheck and bills once. No graphs, no categories.",
    alt: "Headroom's plan screen: a $2,500 balance, a $5,000 monthly paycheck, and two bills — Rent $650 and Wifi $120",
  },
  {
    src: "/headroom/add-sheet.png",
    tag: "LOG A SPEND",
    line: "Adding something is one sheet and three fields, over the number it changes.",
    alt: "Headroom's log a spend sheet, slid up over the safe-to-spend number, with name, amount and date fields",
  },
];

export function Screens() {
  return (
    <div className="screens">
      {SCREENS.map((s, i) => (
        <Reveal className="screen" key={s.tag} delay={i * 0.08}>
          <Tilt className="phone" max={6}>
            <img src={s.src} alt={s.alt} width={446} height={1000} loading="lazy" decoding="async" />
          </Tilt>
          <span className="tag mono">{s.tag}</span>
          <p className="what">{s.line}</p>
        </Reveal>
      ))}
    </div>
  );
}
