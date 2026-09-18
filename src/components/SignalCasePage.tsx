import { useEffect } from "react";
import { CaseShell, CaseHero, CaseFoot, Chapter, NextCase, Statement } from "./case/Shell";
import { Coverage } from "./case/Coverage";
import { useReveal } from "./case/useScene";

/* --------------------------------------------------------------------------
   SIGNAL — CASES.md.

   The only one of the four that is live and embeddable, so the hero is the
   running product rather than a picture of it. PRODUCT.md asks for evidence
   adjacent to every claim; here the evidence is the claim.

   The signature is the coverage gap — see Coverage.tsx.
   -------------------------------------------------------------------------- */

const LIVE = "https://jayharwani.github.io/dmv-map/";

const WHAT: Array<[string, string]> = [
  [
    "One map, the whole region",
    "Tech, design, and AI events across DC, Northern Virginia, and Baltimore — searchable and filterable by category.",
  ],
  [
    "Fit — what you can actually make",
    "Connect a calendar and every event is marked open, tight, or a conflict, weighing real travel between your commitments. Read in your browser, never uploaded.",
  ],
  [
    "Always current, on its own",
    "A scheduled pipeline pulls from event sources every few hours and republishes the map. No dashboard to tend, no recurring cost.",
  ],
];

const INTERFACE: Array<[string, string]> = [
  [
    "Events first, tools second",
    "My first build buried the list behind the calendar controls. I inverted it — events became the permanent content and setup moved behind a single button. Same feature, different hierarchy.",
  ],
  [
    "One card, one decision",
    "Category, day and time, venue, organizer, and a register link — everything needed to commit, without opening anything.",
  ],
  [
    "Freshness stated plainly",
    "The footer says when the data last refreshed and how many events are live, so you never wonder whether the map is stale.",
  ],
];

const STACK = [
  "React + Vite",
  "MapLibre GL",
  "Protomaps tiles",
  "Scheduled ingest",
  "Local-first, no backend",
];

const FIT: Array<[string, string]> = [
  ["open", "OPEN"],
  ["tight", "TIGHT"],
  ["conflict", "CONFLICT"],
];

function Numbered({ items }: { items: Array<[string, string]> }) {
  const [ref, seen] = useReveal<HTMLOListElement>();
  return (
    <ol className={`cs-index cs-rv${seen ? " in" : ""}`} ref={ref}>
      {items.map(([title, body], i) => (
        <li key={title}>
          <div>
            <span className="k">{String(i + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
          </div>
          <p>{body}</p>
        </li>
      ))}
    </ol>
  );
}

export function SignalCasePage() {
  useEffect(() => {
    document.title = "Signal — Product design case study";
  }, []);

  return (
    <CaseShell accent="cyan" live={{ href: LIVE, label: "LIVE" }}>
      <CaseHero
        meta={
          <>
            <b className="mono">SIGNAL</b>
            <span data-sep>CASE STUDY</span>
            <span data-sep>DESIGN &amp; BUILD</span>
            <span data-sep>2026</span>
          </>
        }
        title={
          <>
            A live map of the
            <br />
            <em>whole DMV.</em>
          </>
        }
        standfirst="Tech, design, and AI events across DC, Northern Virginia, and Baltimore — with a layer that shows which ones you can actually make."
        spec={[
          ["COVERAGE", "3 metros, 6 categories"],
          ["REFRESH", "Every few hours, unattended"],
          ["STACK", "MapLibre, Protomaps, scheduled ingest"],
          ["COST", "No backend, no recurring spend"],
        ]}
      />

      <div className="cs-wrap">
        {/* the product, running. Not a screenshot of it. */}
        <div className="sg-embed">
          <div className="bar">
            <span className="dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span className="mono url">jayharwani.github.io/dmv-map</span>
            <a className="mono go" href={LIVE} target="_blank" rel="noopener noreferrer">
              OPEN &#8599;
            </a>
          </div>
          <div className="view">
            <iframe
              src={LIVE}
              title="Signal — the live DMV tech events map"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <p className="cs-cap">The running product, embedded. Pan it, filter it, load a calendar.</p>
      </div>

      <Chapter n="01" label="WHY I BUILT IT">
        <h2>SF and NYC have their startup maps. The DMV had none.</h2>
        <p>
          And <strong>Baltimore gets quietly dropped from almost every regional list.</strong>
        </p>

        <div className="cs-bleed">
          <Coverage />
        </div>

        <p style={{ marginTop: 40 }}>
          So the harder question became the interesting one. A directory tells you where events are.
          It never tells you which ones fit the week you already have. That&rsquo;s the layer I
          wanted to build.
        </p>
      </Chapter>

      <Chapter n="02" label="WHAT IT DOES">
        <h2>One map, the whole region — and a layer for your week.</h2>
        <Numbered items={WHAT} />

        <div className="sg-legend">
          <span className="mono lbl">FIT</span>
          {FIT.map(([k, label]) => (
            <span className={`chip ${k}`} key={k}>
              <i />
              <span className="mono">{label}</span>
            </span>
          ))}
        </div>
      </Chapter>

      <Chapter n="03" label="THE INTERFACE">
        <h2>Three decisions that made the panel work.</h2>
        <Numbered items={INTERFACE} />
      </Chapter>

      <Chapter n="04" label="BUILT WITH">
        <h2>Local-first, no backend, no recurring cost.</h2>
        <ul className="sg-stack">
          {STACK.map((s) => (
            <li className="mono" key={s}>
              {s}
            </li>
          ))}
        </ul>

        <Statement cite="ON WHAT THE WORK ACTUALLY WAS">
          Designed and built solo. Claude Code did much of the typing; the product decisions were
          the real work.
        </Statement>

        <p style={{ marginTop: 30 }}>
          <a className="cs-btn" href={LIVE} target="_blank" rel="noopener noreferrer">
            <span>View live</span>
            <span aria-hidden="true">&#8599;</span>
          </a>
        </p>
      </Chapter>

      <NextCase
        to="/chronoweave"
        name="ChronoWeave"
        tag="ADHD TIME BLINDNESS · MOBILE"
        accent="violet"
      />
      <CaseFoot />
    </CaseShell>
  );
}

export default SignalCasePage;
