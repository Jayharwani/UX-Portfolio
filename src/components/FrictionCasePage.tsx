import { useEffect } from "react";
import {
  CaseShell,
  CaseHero,
  CaseFoot,
  Chapter,
  Colophon,
  Figures,
  NextCase,
  Rejected,
  Statement,
} from "./case/Shell";
import { Funnel } from "./case/Funnel";
import { Verify } from "./case/Verify";
import { Compare, ContactSheet, Figure, type Round } from "./case/Artifact";

/* --------------------------------------------------------------------------
   FRICTION — the fifth case study.

   Rewritten from three sections to eleven. The first version explained what
   the product does three times over; a reader finished it knowing the
   product and nothing about the person. This one is the decisions: a dead
   registration form, a source swapped under duress, a test every friend
   failed, a label that was insulting people, and a screen deleted seventeen
   hours after it was built.

   EVERY FIGURE HERE WAS CHECKED against friction's own git history, and
   several of the numbers are Jay's own measurements quoted from commit
   bodies — 2,521 words, 774 to 101, 161ms. The GummySearch closure is
   checked against its own shutdown notice. Where the source brief and the
   repository disagreed, the repository won; see THE CUT below.

   The signature is still the funnel. See Funnel.tsx for which of its
   numbers are claims and which are pacing.
   -------------------------------------------------------------------------- */

const LIVE = "https://jayharwani.github.io/friction/";

/* §01 — why the free tier is the only version allowed to exist */
const BET: Array<[string, string, string?]> = [
  ["140,000", "Users the category leader had when it closed", "GUMMYSEARCH · 30 NOV 2025"],
  ["0", "Credentials the public store feeds require", "APP STORE · PUBLIC HTTP"],
];

/* §02 — everything ruled out before the assumption itself was */
const RULED_OUT = ["verified email", "ad blockers", "account age", "rate limits"];

/* §07 — the rename, exactly as the commit records it */
const LABELS: Array<[string, string, string]> = [
  [
    "Worth building",
    "Strong signal",
    "The threshold is unchanged: the higher of 70 and the 80th percentile of active scores.",
  ],
  ["Watch", "Recurring", "Same arithmetic, describing the evidence rather than the opportunity."],
  [
    "Too small",
    "Thin evidence",
    "Anything under four distinct reviewers, regardless of score. It was reading as a verdict on the complaint.",
  ],
];

/* §11 */
const DIFFERENTLY: Array<[string, string]> = [
  [
    "Test earlier",
    "I ran the first user test after the site was live. Two rounds of redesign would not have happened if I had shown three people a static screen in week one.",
  ],
  [
    "Cut before polishing",
    "The method page reached 2,521 words and ten sections before I measured it. Every design pass I made on it was polish applied to something that should have been a quarter of the size.",
  ],
  [
    "Build the boring thing first",
    "The 3D terrain came before the homepage explained what the site was. I built the interesting problem instead of the necessary one.",
  ],
];

/** Nine builds of the same homepage, each checked out of git and shot at
    1440x900 by one script, so the only thing differing between frames is the
    design. The two marked `test` are the rounds that happened because three
    people could not tell what the site was. */
const ROUNDS: Round[] = [
  { n: "01", date: "19 Sep", note: "the first pipeline run" },
  { n: "02", date: "20 Sep", note: "rebuilt around comprehension", test: true },
  { n: "03", date: "20 Sep", note: "Hallmark tokens, OKLCH" },
  { n: "04", date: "20 Sep", note: "the WebGL field" },
  { n: "05", date: "20 Sep", note: "teach the concept first", test: true },
  { n: "06", date: "21 Sep", note: "the patterns layer" },
  { n: "07", date: "22 Sep", note: "a cool ground" },
  { n: "08", date: "23 Sep", note: "the wall of voices" },
  { n: "09", date: "24 Sep", note: "current" },
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
            10,000 complaints.
            <br />
            <em>25 that repeat.</em>
          </>
        }
        standfirst="Friction reads ten thousand public app store reviews a week and groups the ones that repeat. It took two data sources, nine rounds of redesign, and deleting the homepage's best screen seventeen hours after building it."
        spec={[
          ["ROLE", "Sole designer and builder"],
          ["SCOPE", "Pipeline, site, and the rules the model runs under"],
          ["BUILD", "Astro and TypeScript, written with Claude Code"],
          ["REDESIGNS", "9 rounds, 2 of them after user testing failed"],
          ["STATE", "Live · 15 apps · 25 challenges"],
          ["DATE", "2026"],
        ]}
        cta={{ href: LIVE, label: "Open Friction" }}
      />

      <Chapter n="01" label="THE BET">
        <h2>The market leader had just died. That was the interesting part.</h2>
        <p>
          I started from a paid tool that finds startup ideas in public complaints. It hides its
          evidence behind a paywall and scores each idea 0 to 100 with no visible rubric — two
          quotes and a number in the nineties.
        </p>
        <p>
          While researching it I found that the largest tool in the category had shut down in
          November 2025. Not for lack of demand. It could not reach terms that fit Reddit&rsquo;s
          data policies, and a commercial licence made continuous scanning uneconomic for a small
          operation.
        </p>
        <p>
          That reframed the project.{" "}
          <strong>
            The free, non-commercial tier is the only version of this tool structurally allowed to
            exist right now.
          </strong>{" "}
          My constraint was my position.
        </p>

        <Figures items={BET} accent />
      </Chapter>

      <Chapter n="02" label="THE WALL">
        <h2>I lost a day to a registration form.</h2>
        <p>
          The plan was Reddit. Free tier, non-commercial use, a hundred queries a minute — enough
          for a weekly scan of fifteen communities.
        </p>
        <p>
          I could not create the app. Registration kept failing, and after working through every
          cause I could think of, I still had no credentials. At that point the choice was to keep
          fighting the form or to question the assumption underneath it.
        </p>

        <div className="fr-dead">
          <span className="lbl mono">RULED OUT, IN ORDER</span>
          <ul className="mono">
            {RULED_OUT.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p className="mono out">still no credentials</p>
        </div>

        <p>
          I had assumed forums were the best source of complaints{" "}
          <strong>because that is where the competitors look.</strong>
        </p>
      </Chapter>

      <Chapter n="03" label="THE PIVOT">
        <h2>The second-choice source turned out to be the better one.</h2>
        <p>
          App Store review feeds are public HTTP. No credentials, no approval, no registration.
          Google Play reads from public pages, so I built it as an optional enhancement — if it
          fails, the scan still completes on Apple data alone.
        </p>
        <p>Then the thing I had not planned for.</p>

        <div className="fr-gate fr-src">
          <div className="never">
            <span className="lbl mono">A FORUM POST GIVES YOU</span>
            <ul>
              <li>That someone was annoyed</li>
            </ul>
          </div>
          <div className="does">
            <span className="lbl mono">A STORE REVIEW GIVES YOU</span>
            <ul>
              <li>A star rating</li>
              <li>The app version</li>
              <li>The country</li>
              <li>The date</li>
            </ul>
          </div>
        </div>

        <p>
          That metadata answers questions a forum-based tool structurally cannot: did this start
          after a specific release, is it one platform or both, is it getting worse.{" "}
          <strong>Those are the questions that decide whether a problem is worth anyone&rsquo;s time.</strong>
        </p>
      </Chapter>

      <Chapter n="04" label="THE COST">
        <h2>Store reviews have no permanent link. I decided not to hide that.</h2>
        <p>
          Neither store gives an individual review a stable public URL. I could have linked to
          something plausible and hoped nobody checked.
        </p>
        <p>
          Instead every quote is labelled as a snapshot with the date it was captured, the link goes
          to the app&rsquo;s review listing rather than the review, and the limitation is stated on
          the method page rather than buried.
        </p>

        <div className="cs-bleed">
          <Verify />
        </div>

        <p>
          The site&rsquo;s entire argument is that you can check its work.{" "}
          <strong>A single faked link would have cost more than the feature was worth.</strong>
        </p>
      </Chapter>

      <Chapter n="05" label="THE TEST THAT FAILED">
        <h2>I had to explain my own product to everyone who opened it.</h2>
        <p>
          I put the first working version in front of friends. Every one of them either opened the
          About page or asked me what they were looking at.
        </p>
        <p>
          The cause was not visual. The homepage led with an unlabelled heatmap and used ridges,
          problems, scores, verdicts and &ldquo;the last scan&rdquo; — every one a term I had never
          defined. I had built an internal tool and forgotten that nobody else had been in the room.
        </p>

        <Compare
          before="/friction/home-before.webp"
          after="/friction/home-after.webp"
          beforeAlt="Friction's homepage on 19 September: an unlabelled heatmap above the words Last scan, Methodology and Archive"
          afterAlt="Friction's homepage on 20 September, rebuilt: a plain sentence saying what the site does, three counted figures, then one challenge shown whole"
          w={1100}
          h={688}
          caption="Drag. Left is the version nobody could read."
        />

        <p>
          The fix was ordering. The first screen now teaches the unit before it shows any output:
          reviews come in, repeats get grouped, the group gets four ways to act on it. The WebGL
          terrain I was proudest of moved off the front door to the method page, because{" "}
          <strong>the first screen is not where you put the thing that needs explaining.</strong>
        </p>
      </Chapter>

      <Chapter n="06" label="THE CUT">
        <h2>I deleted the homepage&rsquo;s best screen seventeen hours after building it.</h2>
        <p>
          The wall of voices: twenty-seven real quotes on a curved CSS-3D wall, the promise over it,
          the first thing anyone saw. It was the best screen on the site.
        </p>
        <p>
          It was blamed for freezing the tab. I could never reproduce the freeze, and the first five
          reports of it predate the wall existing — so I had no evidence against it and cut it
          anyway. It made the site&rsquo;s one job, measurement, harder to read, and that is worth
          more than the effect.
        </p>

        <Figure
          src="/friction/wall-of-voices.webp"
          alt="The deleted wall of voices: twenty-seven real app store complaints on a curved three-dimensional wall behind the headline Thousands of people already told you what to build"
          w={1280}
          h={800}
          width="full"
          past
          caption="Rebuilt from the commit that deleted it. Twenty-seven real quotes."
        />

        <div className="fr-cut">
          <div>
            <span className="mono when">23 SEPT · 02:45</span>
            <b>the wall of voices, and three screens behind it</b>
          </div>
          <div className="gone">
            <span className="mono when">23 SEPT · 19:42</span>
            <b>the cut — four sections, one door, and the wall deleted</b>
          </div>
          <p className="mono note">Home went from 774 words to 101 in the same commit.</p>
        </div>

        <Statement cite="ON WHAT THE JOB ACTUALLY IS">
          A screen that makes the measurement harder to read is not paying for itself, however good
          it is.
        </Statement>
      </Chapter>

      <Chapter n="07" label="THE WORDS">
        <h2>One label was quietly insulting people.</h2>
        <p>Reading the live site, I hit this row:</p>

        <p className="fr-row mono">
          Refunds are refused, delayed, or issued as credit that cannot be used
          <span>Too small</span>
        </p>

        <p>
          The verdict is a statement about how much evidence exists. Read cold, next to a real
          complaint, it looks like the site judging the complaint as unimportant.
        </p>

        <Rejected items={LABELS} label="RENAMED, SAME ARITHMETIC" />

        <p>
          Same thresholds, same numbers, four characters of schema migration.{" "}
          <strong>The words now describe the evidence rather than the person.</strong>
        </p>
      </Chapter>

      <Chapter n="08" label="THE MISSING HALF">
        <h2>It told you what was broken and never what to do about it.</h2>
        <p>
          Someone looking at the site asked what they were supposed to build from any of it. There
          was no answer, because the site was an archive of problems with no opportunity layer.
        </p>
        <p>
          Two things closed it. Patterns — computed, not written — surface a complaint category
          appearing across several apps. <strong>A complaint in one app is a bug; the same complaint
          across seven is a market.</strong> And every challenge now carries four lenses.
        </p>

        <div className="fr-lens">
          <div className="hd">
            <span className="mono k">BUILD IT</span>
            <span className="mono n">3 points</span>
          </div>
          <ul>
            <li>Write each keystroke to local storage, not only on save</li>
            <li>Restore the caret and scroll position after a forced restart</li>
            <li>Start with the close-and-reopen path reviewers keep describing</li>
          </ul>
          <p className="lim">
            <span className="mono lbl">WHY IT MIGHT NOT WORK</span>
            A mobile OS can kill a backgrounded app before it finishes writing anything to disk.
          </p>
        </div>

        <p>
          Each lens ends with why it might not work.{" "}
          <strong>
            Four cards of enthusiasm is what every AI idea generator produces, and why none of them
            are trusted.
          </strong>
        </p>
      </Chapter>

      <Chapter n="09" label="THE CONSTRAINT">
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

        <Statement cite="FRICTION, ON ITS OWN METHOD">
          Every number here is calculated; almost nothing is written.
        </Statement>

        <p>
          Every quote is verified character by character against its source before publishing.{" "}
          <strong>One failure stops the run and last week&rsquo;s data stays up.</strong>
        </p>
      </Chapter>

      <Chapter n="10" label="THE FUNNEL">
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

        <Figures
          items={[
            ["9,994", "Reviews read in the last scan", "FRICTION · 20 SEPT 2026"],
            ["150", "The cap on what reaches a model", "FRICTION · HOW IT WORKS"],
            ["25", "Recurring challenges on record", "FRICTION · ACROSS 15 APPS"],
          ]}
          accent
        />

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

      <Chapter n="11" label="NINE ROUNDS">
        <h2>Every portfolio claims iteration. This is nine builds of one page.</h2>
        <p>
          Each frame is the Friction homepage checked out of git at that commit, built, and
          screenshotted at 1440&thinsp;&times;&thinsp;900 by the same script.{" "}
          <strong>The only thing that changes between frames is the design.</strong>
        </p>

        <ContactSheet
          rounds={ROUNDS}
          caption="Nine rounds. Two of them because three people could not tell what the site was."
        />
      </Chapter>

      <Chapter n="12" label="WHAT I'D DO DIFFERENTLY">
        <h2>Three things.</h2>
        <ol className="cs-index fr-diff">
          {DIFFERENTLY.map(([t, body]) => (
            <li key={t}>
              <div>
                <h3>{t}</h3>
              </div>
              <p>{body}</p>
            </li>
          ))}
        </ol>
      </Chapter>

      <Colophon
        rows={[
          ["DESIGN", "Mine, end to end — the site, and the rules the pipeline runs under."],
          ["BUILD", "Astro and TypeScript, written with Claude Code. Source is public."],
          ["DATA", "Public app store reviews only. No accounts, no ads, no payments."],
          ["THE MODEL", "Groups and quotes. Never scores, ranks or prioritises."],
          ["TESTED", "3 rounds of informal user testing. All three changed the product."],
          ["MEASURED", "9,994 reviews read in the scan of 20 September 2026."],
        ]}
      />

      <NextCase to="/headroom" name="Headroom" tag="LOCAL-FIRST FINANCE · REACT" accent="mint" />
      <CaseFoot />
    </CaseShell>
  );
}

export default FrictionCasePage;
