import { useEffect } from "react";
import {
  CaseShell,
  CaseHero,
  CaseFoot,
  Chapter,
  Colophon,
  Figures,
  NextCase,
  Statement,
} from "./case/Shell";
import { Drift } from "./case/Drift";
import { useReveal, useTilt } from "./case/useScene";

import TodaysRhythm from "../assets/chronoweave-todaysrhythm.webp";
import LiveNudge from "../assets/chronoweave-livenudge.webp";
import WeeklyInsights from "../assets/chronoweave-weeklyinsights.webp";
import DriftMap from "../assets/chronoweave-driftmap.webp";
import Calibrate from "../assets/chronoweave-calibrate.webp";
import TimeFeel from "../assets/chronoweave-timefeel.webp";

/* --------------------------------------------------------------------------
   CHRONOWEAVE — CASES.md.

   Violet, the accent its row lights on the work index. The signature is the
   drift: two clocks that disagree while the reader scrolls evenly, which is
   the case study's premise delivered as an experience rather than a sentence.
   See Drift.tsx.

   THE TEAM IS NAMED IN THE HERO, not buried in a metadata block. This was a
   four-person hackathon and the other three did real work; a portfolio that
   quietly lets a reader assume otherwise is the kind of thing PRODUCT.md's
   "precise, evidence-first" personality exists to rule out.
   -------------------------------------------------------------------------- */

const PROTOTYPE = "https://revamp-sauna-76244505.figma.site";

const RESEARCH: Array<[string, string, string?]> = [
  ["80%", "of adults with ADHD report chronic time management struggles", "ADDitude Magazine, 2023"],
  ["6×", "more likely to miss deadlines due to time perception distortion", "Journal of Attention Disorders"],
  ["70%", "stop using timer apps within 2 weeks due to alert fatigue", "UX Research Survey, 2024"],
];

const CHANNELS: Array<[string, string, string]> = [
  [
    "Haptic anchors",
    "Rhythmic vibration patterns that change every 15 minutes — like a gentle tap reminding you time is passing.",
    "WRIST, PHONE, OR SMART HOME INTEGRATION",
  ],
  [
    "Audio cues",
    "Ambient soundscapes that subtly shift tonality as time passes — a sonic gradient from morning to evening.",
    "NON-INTRUSIVE, DESIGNED FOR FOCUS STATES",
  ],
  [
    "Light signals",
    "Screen or smart bulb colour temperature changes that mirror natural daylight progression.",
    "BIOLOGICALLY ALIGNED CIRCADIAN CUES",
  ],
];

const HABITUATION = [
  "Phone buzzes alone — habituated in 5 days",
  "Visual timers alone — ignored during hyperfocus",
  "Multi-sensory layering — sustained awareness over weeks",
];

const SCREENS: Array<[string, string, string]> = [
  [TodaysRhythm, "Today's Rhythm", "Visual time blocks show the day as a feeling, not a schedule"],
  [LiveNudge, "Live Nudge", "Active multi-sensory feedback with real-time intensity controls"],
  [WeeklyInsights, "Weekly Insights", "Drift patterns reveal when users lose time most often"],
  [DriftMap, "Drift Calendar", "Granular view of perception accuracy across the week"],
  [Calibrate, "Calibrate", "5 quick perception tests establish a personal baseline"],
  [TimeFeel, "Time Feel", "Qualitative assessment captures subjective time experience"],
];

const EDGES: Array<[string, string]> = [
  [
    "Sensory overload protection",
    "If a user is in a high-stimulus environment (detected via ambient noise), nudge intensity automatically reduces to avoid adding to cognitive load.",
  ],
  [
    "Co-occurring conditions",
    "Many ADHD users also have anxiety. Nudges avoid urgency cues — no red, no alarm sounds — using gentle gradients and organic tones instead.",
  ],
  [
    "Hyperfocus mode",
    "During detected hyperfocus states, nudge frequency increases gradually rather than interrupting — escalating gently from subtle to noticeable.",
  ],
  [
    "Medication timing",
    "ADHD medication affects time perception. Users can mark medication times, and the system adjusts nudge sensitivity for the 4–6 hour effectiveness window.",
  ],
];

function Screen({ src, title, body }: { src: string; title: string; body: string }) {
  const ref = useTilt<HTMLDivElement>(7);
  return (
    <figure className="cw-screen">
      <div className="cs-slab" ref={ref}>
        <div>
          <img className="cs-lift" src={src} alt={`ChronoWeave — ${title}`} loading="lazy" decoding="async" />
        </div>
      </div>
      <figcaption>
        <h3>{title}</h3>
        <p>{body}</p>
      </figcaption>
    </figure>
  );
}

export function ChronoWeavePage() {
  useEffect(() => {
    document.title = "ChronoWeave — Product design case study";
  }, []);

  const [screensRef, screensSeen] = useReveal<HTMLDivElement>();
  const [edgesRef, edgesSeen] = useReveal<HTMLDivElement>();

  return (
    <CaseShell accent="violet">
      <CaseHero
        meta={
          <>
            <b className="mono">CHRONOWEAVE</b>
            <span data-sep>UX DESIGN</span>
            <span data-sep>48-HOUR HACKATHON</span>
            <span data-sep>IOS</span>
          </>
        }
        title={
          <>
            Hours vanish
            <br />
            <em>without notice.</em>
          </>
        }
        standfirst="Multi-sensory nudges that help people with ADHD and autism feel time passing — not just see it."
        spec={[
          ["ROLE", "UX designer, design system and visual"],
          ["TIME", "48 hours, FigBuild 2026"],
          ["TEAM", "Jay, Fran, Deeksha, Honey"],
          ["TOOLS", "Figma AI"],
          ["DATE", "FigBuild 2026"],
        ]}
        cta={{ href: PROTOTYPE, label: "View the prototype" }}
      />

      <Chapter n="01" label="THE CHALLENGE">
        <h2>Time blindness isn&rsquo;t about being lazy — it&rsquo;s a neurological disconnect.</h2>
        <p>
          For people with ADHD and autism, time doesn&rsquo;t &ldquo;feel&rdquo; like it passes.
          Hours vanish without notice. Existing solutions — alarms, timers, calendar notifications —
          all rely on visual and auditory interruptions that{" "}
          <strong>users habituate to and ignore within days.</strong>
        </p>

        <div className="cs-bleed">
          <Drift />
        </div>

        <Figures accent items={RESEARCH} />

        <Statement cite="HOW MIGHT WE">
          Help neurodivergent individuals feel the passage of time through multi-sensory feedback —
          creating awareness without relying on disruptive alerts they&rsquo;ll eventually ignore?
        </Statement>
      </Chapter>

      <Chapter n="02" label="THE SOLUTION">
        <h2>Three sensory channels, one unified system.</h2>
        <p>
          The core innovation: instead of one alert type, ChronoWeave layers three sensory channels
          that work together — making time perception tangible and impossible to habituate to.
        </p>

        <div className="cs-index">
          {CHANNELS.map(([t, b, f], i) => (
            <div key={t}>
              <div>
                <span className="k">0{i + 1}</span>
                <h3>{t}</h3>
              </div>
              <p>{b}</p>
              <span className="foot">{f}</span>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: 50 }}>Why multi-sensory works</h3>
        <p>
          Research on interoception — the ability to sense internal body signals — shows that people
          with ADHD have reduced interoceptive awareness. By engaging multiple sensory channels
          simultaneously, ChronoWeave creates redundant time signals that bypass the single-channel
          habituation problem.
        </p>
        <ul className="cw-habit">
          {HABITUATION.map((h, i) => (
            <li key={h} className={i === HABITUATION.length - 1 ? "win" : undefined}>
              {h}
            </li>
          ))}
        </ul>
      </Chapter>

      <Chapter n="03" label="FINAL DESIGNS">
        <h2>Six screens that make abstract time tangible.</h2>
        <p>
          Each screen was designed to make abstract time perception tangible — using colour-coded
          sensory channels, data visualisation, and empathetic copy.
        </p>
        <div className={`cw-screens cs-rv${screensSeen ? " in" : ""}`} ref={screensRef}>
          {SCREENS.map(([src, t, b]) => (
            <Screen key={t} src={src} title={t} body={b} />
          ))}
        </div>
      </Chapter>

      <Chapter n="04" label="SYSTEMS THINKING">
        <h2>Edge cases we designed for.</h2>
        <div className={`cs-index cs-rv${edgesSeen ? " in" : ""}`} ref={edgesRef}>
          {EDGES.map(([t, b]) => (
            <div key={t}>
              <h3>{t}</h3>
              <p>{b}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter n="05" label="OUTCOMES">
        <h2>Concept to prototype in a weekend.</h2>
        <Figures
          items={[
            ["48hrs", "Concept to prototype", "FIGBUILD 2026"],
            ["6", "High-fidelity screens", "COMPLETE USER FLOW"],
            ["3", "Sensory modalities", "HAPTICS, AUDIO, LIGHT"],
            ["5", "Calibration tests", "PERSONALISED BASELINE"],
          ]}
        />
        <p style={{ marginTop: 34 }}>
          Walk through the full multi-sensory concept — onboarding, calibration, and the ambient
          clock — in the interactive Figma prototype.
        </p>
        <p>
          <a className="cs-btn" href={PROTOTYPE} target="_blank" rel="noopener noreferrer">
            <span>View interactive prototype</span>
            <span aria-hidden="true">&#8599;</span>
          </a>
        </p>
      </Chapter>

      <Colophon
        rows={[
          ["MY ROLE", "UX design, the design system and the visual design."],
          ["TEAM", "Four designers: Jay, Fran, Deeksha, Honey. This was not solo work."],
          ["TOOLS", "Figma AI."],
          ["SCOPE", "Six high-fidelity screens and a full flow, in 48 hours."],
        ]}
      />

      <NextCase to="/bumper" name="Bumper" tag="BEHAVIOURAL · EXTENSION" accent="gold" />
      <CaseFoot />
    </CaseShell>
  );
}

export default ChronoWeavePage;
