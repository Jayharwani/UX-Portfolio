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
import { Funnel } from "./case/Funnel";
import { Verify } from "./case/Verify";

/* --------------------------------------------------------------------------
   FRICTION — the fifth case study.

   Two chapters and an opening shot. The brief was that a recruiter should
   have the project in ten seconds and be finished in twenty, which rules out
   the five-chapter shape the other four use: what is left is the ratio, and
   the constraint that makes the ratio trustworthy.

   The signature is the funnel — the page runs the sieve the product runs.
   See Funnel.tsx for which of its numbers are claims and which are pacing.

   Every figure, quote and date on this page is taken from the live site.
   -------------------------------------------------------------------------- */

const LIVE = "https://jayharwani.github.io/friction/";

const SCALE: Array<[string, string, string?]> = [
  ["9,994", "Reviews read in the last scan", "FRICTION · 20 SEPT 2026"],
  ["150", "The cap on what reaches a model", "FRICTION · HOW IT WORKS"],
  ["25", "Recurring challenges on record", "FRICTION · ACROSS 15 APPS"],
];

export function FrictionCasePage() {
  useEffect(() => {
    document.title = "Friction — Product design case study";
  }, []);

  return (
    <CaseShell accent="teal" live={{ href: LIVE, label: "LIVE" }}>
      <CaseHero
        backdrop={<Funnel />}
        meta={
          <>
            <b className="mono">FRICTION</b>
            <span data-sep>PRODUCT DESIGN</span>
            <span data-sep>SELF-INITIATED</span>
            <span data-sep>LIVE</span>
          </>
        }
        title={
          <>
            {/* Numerals, and short ones. Spelled out, either line overran its
                own measure and wrapped to three lines against a headline
                written for two — and the figure is the argument here anyway. */}
            10,000 complaints.
            <br />
            <em>25 that repeat.</em>
          </>
        }
        standfirst="Friction reads ten thousand public app store reviews a week and groups the ones that repeat. Every number on it is calculated in code; almost nothing is written."
        spec={[
          ["ROLE", "Sole designer and builder"],
          ["SCOPE", "Pipeline, site, and the rules the model runs under"],
          ["BUILD", "Astro and TypeScript, written with Claude Code"],
          ["STATE", "Live · 15 apps · 25 challenges"],
          ["DATE", "2026"],
        ]}
        cta={{ href: LIVE, label: "Open Friction" }}
      />

      <Chapter n="01" label="THE FUNNEL">
        <h2>Ten thousand in, a hundred out.</h2>
        <p>
          Almost every review is noise: too old, too short, a star rating with no sentence attached,
          or praise. Five screens run in TypeScript and throw those away{" "}
          <strong>before a model is allowed to look at anything.</strong>
        </p>
        <p>
          What survives is capped at 150. The model never sees the pile, only the shortlist — which
          is the difference between a tool that reads reviews and a tool that summarises a vibe.
        </p>

        <Figures items={SCALE} accent />

        {/* the product, running. Not a screenshot of it. */}
        <div className="cs-bleed">
          <div className="sg-embed">
            <div className="bar">
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="mono url">jayharwani.github.io/friction</span>
              <a className="mono go" href={LIVE} target="_blank" rel="noopener noreferrer">
                OPEN &#8599;
              </a>
            </div>
            <div className="view">
              <iframe
                src={LIVE}
                title="Friction — the live site"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
        <p className="cs-cap">
          The running product, embedded. Filter by app, switch lens, press &#8984;K to search.
        </p>
      </Chapter>

      <Chapter n="02" label="THE RESTRAINT">
        <h2>It may group and quote. It may not score, rank, or prioritise.</h2>
        <p>
          A tool that ranks complaints is handing you its judgement and asking you to trust it.
          Friction&rsquo;s value is that it has none. The model is allowed two jobs, and the rest of
          the site is arithmetic over the reviews themselves.
        </p>

        <div className="fr-gate">
          <div className="does">
            <span className="lbl mono">THE MODEL DOES</span>
            <ul>
              <li>Group reviews describing the same struggle</li>
              <li>Copy one short verbatim quote from each</li>
            </ul>
          </div>
          <div className="never">
            <span className="lbl mono">THE MODEL NEVER</span>
            <ul>
              <li>Produces a score</li>
              <li>Produces a rank</li>
              <li>Produces a priority</li>
            </ul>
          </div>
        </div>

        <p>
          That constraint only holds if the quotes are real, so every one is checked against its
          source before it is allowed on the page.
        </p>

        <div className="cs-bleed">
          <Verify />
        </div>

        <Statement cite="FRICTION, ON ITS OWN METHOD">
          Every number here is calculated; almost nothing is written.
        </Statement>

        <p>
          The few written sentences carry a badge and a date, so a reader can tell at a glance which
          line a person wrote and which the arithmetic produced.
        </p>
      </Chapter>

      <Colophon
        rows={[
          ["DESIGN", "Mine, end to end — the site, and the rules the pipeline runs under."],
          ["BUILD", "Astro and TypeScript, written with Claude Code. Source is public."],
          ["DATA", "Public app store reviews only. No accounts, no ads, no payments."],
          ["THE MODEL", "Groups and quotes. Never scores, ranks or prioritises."],
          ["MEASURED", "9,994 reviews read in the scan of 20 September 2026."],
        ]}
      />

      <NextCase to="/headroom" name="Headroom" tag="LOCAL-FIRST FINANCE · REACT" accent="mint" />
      <CaseFoot />
    </CaseShell>
  );
}

export default FrictionCasePage;
