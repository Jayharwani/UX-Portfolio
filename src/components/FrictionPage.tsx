import { useEffect } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import { Dots } from "./dots/Dots";
import { Gate, LENSES, LensMark, Persona } from "./friction/art";
import { Timeline } from "./friction/Timeline";
import { FrictionCasePage } from "./FrictionCasePage";
import "../styles/friction.css";

/* --------------------------------------------------------------------------
   FRICTION — eight sections, one idea each.

   The old page was ordered by what happened to me: what I tried, what
   broke, what I rebuilt, eleven times. That is a diary, and it answered
   "is the person any good" in the slot where a reader is still asking "is
   this for me". The whole process is one graphic now, in section 07, after
   the product is understood — and the diary itself survives untouched,
   behind the disclosure under it.

   Every explanatory graphic is dots. One dot is one review, and that one
   primitive carries the corpus, the reading, the filter, the grouping and
   the lenses. Screenshots appear in section 06 and nowhere else, which is
   what stops the page reading as assembled.
   -------------------------------------------------------------------------- */

const LIVE = "https://jayharwani.github.io/friction/";
const EASE = [0.34, 0.8, 0.34, 1] as const;

const META = [
  ["ROLE", "Sole designer and builder"],
  ["TIMELINE", "Six days, nine rounds"],
  ["STACK", "Astro · TypeScript · Claude"],
  ["STATUS", "Live · 15 apps · 25 problems"],
];

/** headline then body, 90ms apart */
function Say({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.62, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function FrictionPage() {
  useEffect(() => {
    document.title = "Friction — Product design case study";
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#0f131b";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  return (
    <div className="fr">
      <nav className="nav">
        <Link to="/">
          <span aria-hidden="true">&larr;</span> <span className="label">WORK</span>
        </Link>
        <a className="live label" href={LIVE} target="_blank" rel="noopener noreferrer">
          OPEN FRICTION
        </a>
      </nav>

      {/* 00 · is this for me? */}
      <header className="beat hook">
        <Dots
          className="bleed"
          preset="field"
          count={9994}
          label="A field of ten thousand dim dots, one for every review read this week."
        />
        <Say>
          <h1>Finding a real problem is the hardest part of building one.</h1>
          <p className="sub">
            Friction reads ten thousand app store reviews a week and returns the twenty-five
            problems people keep running into.
          </p>
          <a className="btn" href="#how">
            How it works
          </a>
        </Say>
        <dl className="meta">
          {META.map(([k, v]) => (
            <div key={k}>
              <dt className="label">{k}</dt>
              <dd className="secondary">{v}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* 01 · why does this exist? */}
      <section className="beat">
        <Dots
          className="bleed"
          preset="highlight"
          count={9994}
          keep={25}
          duration={2.4}
          label="The same field, with twenty-five dots lit: the problems that repeat."
        />
        <Say>
          <h2>The evidence already exists. Nobody has time to read it.</h2>
          <p>
            Every app store holds years of public, dated, free complaints, already sorted by the
            people who wrote them. Reading ten thousand of anything is nobody&rsquo;s job, so teams
            guess instead.
          </p>
        </Say>
      </section>

      {/* 02 · what does it do? */}
      <section className="beat" id="how">
        <Say>
          <h2>Throw away ninety-eight percent of it. Automatically.</h2>
          <p>
            Five screens run in TypeScript before any model sees anything: too old, too short, no
            sentence in it, praise, or a duplicate. Rules, not judgement. It runs every Monday.
          </p>
        </Say>
        <figure className="plate">
          <Dots
            preset="filter"
            count={6000}
            bands={[0.332, 0.015]}
            duration={2.4}
            label="Dots falling through narrowing bands: ten thousand, then three thousand, then one hundred and fifty."
          />
          <figcaption className="label">9,994 &rarr; 3,319 &rarr; 150</figcaption>
        </figure>
      </section>

      {/* 03 · in detail */}
      <section className="beat">
        <Say>
          <h2>The same complaint, from different people, over months.</h2>
          <p>
            One angry review is noise. Seven people describing the same thing across six weeks, on
            both stores, is a signal. What survives is grouped by what repeats, and nothing else.
          </p>
        </Say>
        <figure className="plate">
          <Dots
            preset="cluster"
            count={900}
            groups={[44, 31, 24, 19, 14, 10]}
            duration={2}
            label="Survivors converging into six clusters of visibly different density."
          />
          <figcaption className="label">DENSER IS STRONGER EVIDENCE</figcaption>
        </figure>
      </section>

      {/* 04 · why would I use it? */}
      <section className="beat">
        <Say>
          <h2>Four ways to use one complaint.</h2>
          <p>
            Build it, start it, study it, or write about it. Each lens gives three specifics and
            ends with why it might not work &mdash; because four cards of enthusiasm is what every
            idea generator produces.
          </p>
        </Say>
        <figure className="plate short">
          <Dots
            preset="fan"
            count={680}
            groups={[1, 1, 1, 1]}
            duration={1.6}
            label="One cluster splitting into four, each taking its own hue."
          />
        </figure>
        <ul className="lenses">
          {LENSES.map((l, i) => (
            <motion.li
              key={l.key}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, ease: EASE, delay: i * 0.07 }}
            >
              <Persona kind={l.key} hue={l.hue} />
              <span className="mark">
                <LensMark kind={l.key} hue={l.hue} />
              </span>
              <b style={{ color: l.hue }}>{l.title}</b>
              <span className="secondary">{l.who}</span>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* 05 · should I believe this? */}
      <section className="beat">
        <Say>
          <h2>The model never produces a number.</h2>
          <p>
            It may group reviews and copy a quote. It may not score, rank or prioritise. Every quote
            is checked character by character against its source, and one failure stops the run.
          </p>
        </Say>
        <Gate />
      </section>

      {/* 06 · show me — the only screenshots on the page */}
      <section className="beat">
        <Say>
          <h2>Twenty-five problems, updated every Monday.</h2>
          <p>
            Fifteen apps tracked, twenty-five recurring problems on record, every quote carrying its
            platform, version, country and date. Open it and check any one of them.
          </p>
          <a className="btn" href={LIVE} target="_blank" rel="noopener noreferrer">
            Open Friction <span aria-hidden="true">&#8599;</span>
          </a>
        </Say>
        <div className="screens">
          {[
            ["challenge", "A challenge page: the headline, the spread, and the quotes behind it"],
            ["lenses", "The four lenses, opened to their specifics and their limitation"],
            ["patterns", "Patterns: the same complaint appearing across several apps"],
            ["index", "The index of all twenty-five, filterable by app and by lens"],
          ].map(([k, alt], i) => (
            <motion.figure
              key={k}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.07 }}
            >
              <img
                src={`/friction/screen-${k}.webp`}
                alt={alt}
                width={1100}
                height={764}
                loading="lazy"
                decoding="async"
              />
            </motion.figure>
          ))}
        </div>
      </section>

      {/* 07 · is the person any good? */}
      <section className="beat">
        <Say>
          <h2>Nine rounds. The useful ones were the failures.</h2>
          <p>
            Reddit was the plan until its CAPTCHA never passed. The homepage was rebuilt twice
            because three people could not tell what the site was. The best screen on it was deleted
            seventeen hours after it shipped.
          </p>
        </Say>
        <Timeline />

        <details className="long">
          <summary>
            <span>The long version</span>
            <span className="label">THE WHOLE WRITE-UP, UNCHANGED</span>
          </summary>
          <div className="longBody">
            <FrictionCasePage embedded />
          </div>
        </details>
      </section>

      <footer className="foot">
        <span className="label">JAY HARWANI</span>
        <span className="label">OPEN TO PRODUCT DESIGN ROLES</span>
        <a className="label" href="mailto:harwanijay9498@gmail.com" style={{ marginLeft: "auto" }}>
          harwanijay9498@gmail.com
        </a>
      </footer>
    </div>
  );
}

export default FrictionPage;
