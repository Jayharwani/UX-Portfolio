import { useEffect } from "react";
import { CaseShell, CaseHero, CaseFoot, Chapter, Figures, NextCase, Statement } from "./case/Shell";
import { Pause } from "./case/Pause";
import { useReveal } from "./case/useScene";

/* --------------------------------------------------------------------------
   BUMPER — CASES.md.

   Gold, and the signature is the pause: the page performs the intervention
   the product performs, on the reader, before its own conclusion. See
   Pause.tsx — including why it is sticky rather than a scroll trap.

   This was the longest of the four at 12,044px, largely because three long
   phone mockups were rebuilt in markup inside it. The mockups that carried an
   argument are kept as the pause scene; the rest is copy, which is what the
   reader came for.
   -------------------------------------------------------------------------- */

const STORE =
  "https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp?utm_source=item-share-cb";

const STATS: Array<[string, string, string?]> = [
  ["62%", "of online purchases are impulse buys", "CreditCards.com"],
  ["$5,400", "average annual impulse spending per person", "Slickdeals"],
  ["88%", "regret impulse purchases within a week", "RetailMeNot"],
];

const RESEARCH: Array<[string, string]> = [
  [
    "User interviews",
    "Spoke with 8 self-identified impulse shoppers about their triggers, regrets, and what happens in the moment before they click Buy.",
  ],
  [
    "Behavioural psychology",
    "Reviewed Kahneman's System 1/2 framework, commitment devices research, and positive friction studies from Stanford Persuasive Tech Lab.",
  ],
  [
    "Competitive audit",
    "Analysed 4 major shopping assistant extensions — Honey, Rakuten, Capital One Shopping — to identify gaps in mindful spending.",
  ],
];

const INSIGHTS: Array<[string, string, string]> = [
  [
    "BEHAVIOUR PATTERN",
    "The impulse window is under 30 seconds",
    "Users described clicking Buy Now within seconds of seeing a product. The impulsive urge peaks immediately and decays rapidly — a brief pause is enough to engage reflective thinking.",
  ],
  [
    "CORE INSIGHT",
    "Abstract savings don't motivate — tangible goals do",
    "Telling someone they'd save $279.99 doesn't change behaviour. But showing that $279.99 is 45% of a flight to Tokyo creates emotional resonance and a concrete comparison.",
  ],
  [
    "USER NEED",
    "Guilt-based interventions backfire",
    "Apps that shame users for spending get uninstalled within days. Users need to feel supported, not judged. The intervention must feel like a friendly nudge.",
  ],
  [
    "MARKET GAP",
    "Existing extensions optimise spending, not mindfulness",
    "Every competing extension helps users spend more efficiently — coupons, cashback. None help users pause and reflect on whether they should spend at all.",
  ],
];

const RIVALS = ["Honey", "Rakuten", "Capital One", "Bumper"];
const MATRIX: Array<[string, boolean[]]> = [
  ["Pre-purchase pause", [false, false, false, true]],
  ["Goal visualisation", [false, false, false, true]],
  ["Impulse detection", [false, false, false, true]],
  ["Savings progress tracking", [false, false, false, true]],
  ["Price comparison", [true, true, true, false]],
  ["Coupon / cashback", [true, true, true, false]],
];

const PRINCIPLES: Array<[string, string, string]> = [
  [
    "Positive friction",
    "The pause should slow you down, not stop you. Users can always proceed with the purchase — but now it's a conscious decision, not an impulse. No blocking, no guilt.",
    "A 30-second timer with a calm countdown, not a locked checkout",
  ],
  [
    "Empathetic framing",
    "Never shame the user for wanting to buy something. Frame the intervention as a supportive reminder of what they're working toward — not a judgment of what they're about to do.",
    "“This could fund 45% of your Tokyo flight”, not “Stop wasting money!”",
  ],
  [
    "Goal-first visualisation",
    "Show tangible dream experiences instead of abstract numbers. “$279 saved” means nothing — “45% closer to Tokyo” means everything.",
    "A visual progress bar toward a flight, not a generic savings counter",
  ],
];

const TRADEOFFS: Array<[string, string, string, string]> = [
  [
    "30-second pause vs. 60-second pause",
    "Research shows longer pauses give more time for reflection, but also increase friction and abandonment.",
    "30 seconds — long enough to engage System 2 thinking but short enough that users don't feel punished. In testing, 60 seconds led to users closing the extension entirely. 30 seconds hit the sweet spot: 73% of users made a different decision than they would have without the pause.",
    "Slightly less reflection time, but dramatically higher retention",
  ],
  [
    "Dream goals vs. generic savings counter",
    "A simple “you've saved $X this month” counter is easier to build. Dream goals require users to set up a specific target.",
    "Dream goals — showing “this purchase is 45% of your Tokyo flight” creates visceral emotional contrast that abstract numbers can't match. The extra onboarding step is worth it because it makes every intervention personally meaningful.",
    "Higher onboarding friction, but 3× higher emotional engagement in testing",
  ],
  [
    "Extension overlay vs. new tab redirect",
    "Opening a new tab gives more screen real estate. An overlay stays on the current page.",
    "Overlay with backdrop blur — redirecting to a new tab breaks the user's context and feels aggressive. An overlay keeps the purchase visible but defocused, maintaining the user's sense of control while removing manipulative UI.",
    "Less room for the intervention, but the user keeps their place",
  ],
];

const EDGES: Array<[string, string]> = [
  [
    "Repeat intent",
    "If a user views the same product 3+ times across sessions, the intervention recognises this as deliberate intent, not impulse — and reduces friction accordingly.",
  ],
  [
    "High-value vs. low-value items",
    "A $15 book and a $500 gadget need different intervention intensities. Bumper scales the pause experience based on purchase amount relative to the user's dream goal.",
  ],
  [
    "Gifts",
    "Buying for others shouldn't trigger the same reflection. Users can mark purchases as gifts, which bypasses the intervention without disabling the extension.",
  ],
  [
    "Extension fatigue prevention",
    "If the user dismisses the intervention 5 times in a row, Bumper backs off for 24 hours — preventing the annoyance that leads to uninstalls.",
  ],
];

const LEARNED = [
  "Positive friction works — users appreciate a pause when it's framed as support, not restriction. 73% chose their dream goal over the impulse buy.",
  "Visual goals are 3× more effective than abstract savings percentages for driving behaviour change. Concrete experiences beat abstract numbers every time.",
  "Material Design 3 familiarity reduced perceived intrusiveness — the extension feels native to Chrome, not like an annoying pop-up.",
  "AI collaboration enabled rapid iteration — shipping a polished product in 6 weeks that would traditionally take 6 months.",
];

const NEXT_TIME = [
  "Run a longitudinal study — 6 weeks of testing doesn't capture whether the intervention effect sustains over months. Do users habituate to the pause?",
  "A/B test the dream goal setup flow — some users found onboarding friction too high. A progressive disclosure approach could lower the barrier.",
  "Build a dashboard for spending patterns — users wanted to see their impulse-vs-intentional ratio over time, which I didn't include in v1.",
];

const SPRINT: Array<[string, string]> = [
  ["Research", "Week 1"],
  ["Define", "Week 2"],
  ["Design", "Weeks 3–4"],
  ["Build", "Week 5"],
  ["Ship", "Week 6"],
];

export function BumperCasePage() {
  useEffect(() => {
    document.title = "Bumper — Product design case study";
  }, []);

  const [insightsRef, insightsSeen] = useReveal<HTMLDivElement>();
  const [edgeRef, edgeSeen] = useReveal<HTMLDivElement>();

  return (
    <CaseShell accent="gold" live={{ href: STORE, label: "CHROME STORE" }}>
      <CaseHero
        meta={
          <>
            <b className="mono">BUMPER</b>
            <span data-sep>PRODUCT DESIGN</span>
            <span data-sep>BROWSER EXTENSION</span>
            <span data-sep>SHIPPED</span>
          </>
        }
        title={
          <>
            A pause button for your wallet —
            <br />
            <em>not a lock on your freedom.</em>
          </>
        }
        standfirst="A Chrome extension that creates a 30-second mindful pause before impulse purchases — helping you choose dream experiences over instant regret."
        spec={[
          ["ROLE", "Product designer, end to end"],
          ["SPRINT", "6 weeks, research to ship"],
          ["PLATFORM", "Chrome extension"],
          ["STATE", "Live on the Chrome Web Store"],
        ]}
      />

      <div className="cs-wrap">
        <ol className="bp-sprint">
          {SPRINT.map(([phase, when], i) => (
            <li key={phase} style={{ ["--i" as string]: i }}>
              <span className="mono w">{when}</span>
              <b>{phase}</b>
            </li>
          ))}
        </ol>
      </div>

      <Chapter n="01" label="THE CHALLENGE">
        <h2>E-commerce weaponises psychology against your financial goals.</h2>
        <p>
          One-click checkouts, scarcity badges, and urgency countdowns exploit System 1 — fast,
          impulsive — thinking. Users buy before their System 2, slow and reflective, brain has a
          chance to engage. <strong>The result: billions in regretted purchases every year.</strong>
        </p>

        <Statement cite="ORIGIN STORY">
          My roommate had a habit — every payday, he&rsquo;d go on a shopping spree. New gadgets,
          clothes, stuff he didn&rsquo;t need. Then came the credit card bill. The anxiety. The
          regret.
        </Statement>

        <p>
          That&rsquo;s when I realised: what if there was a pause button? Not to stop people from
          buying, but to help them choose consciously. 30 seconds to shift from impulse to
          intention.
        </p>

        <Figures accent items={STATS} />

        <Statement cite="HOW MIGHT WE">
          Create a moment of reflection at the point of purchase that helps users make intentional
          spending decisions — without shaming them or blocking their autonomy?
        </Statement>
      </Chapter>

      <Chapter n="02" label="RESEARCH">
        <h2>Understanding the science of impulse buying.</h2>
        <div className="cs-index">
          {RESEARCH.map(([t, b], i) => (
            <div key={t}>
              <div>
                <span className="k">0{i + 1}</span>
                <h3>{t}</h3>
              </div>
              <p>{b}</p>
            </div>
          ))}
        </div>

        <h3 style={{ marginTop: 52 }}>Key research insights</h3>
        <div className={`cs-index cs-rv${insightsSeen ? " in" : ""}`} ref={insightsRef}>
          {INSIGHTS.map(([k, t, b]) => (
            <div key={t}>
              <div>
                <span className="k">{k}</span>
                <h3>{t}</h3>
              </div>
              <p>{b}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter n="03" label="COMPETITIVE LANDSCAPE">
        <h2>Every rival helps you spend more efficiently. None help you not spend.</h2>
        <div className="bp-table-wrap">
          <table className="bp-table">
            <thead>
              <tr>
                <th scope="col">Feature</th>
                {RIVALS.map((r) => (
                  <th scope="col" key={r} className={r === "Bumper" ? "us" : undefined}>
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map(([feature, vals]) => (
                <tr key={feature}>
                  <th scope="row">{feature}</th>
                  {vals.map((v, i) => (
                    <td key={RIVALS[i]} className={RIVALS[i] === "Bumper" ? "us" : undefined}>
                      <span className={v ? "yes" : "no"}>{v ? "✓" : "—"}</span>
                      <span className="cs-vh">{v ? "yes" : "no"}</span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="cs-cap">
          The gap: Bumper is the only one of the four designed for mindful spending rather than
          efficient spending.
        </p>
      </Chapter>

      <Chapter n="04" label="DESIGN PRINCIPLES">
        <h2>Three principles that guided every decision.</h2>
        <p>
          Each principle maps directly to a research finding — ensuring the intervention feels
          helpful, not hostile.
        </p>
        <div className="cs-index">
          {PRINCIPLES.map(([t, b, eg], i) => (
            <div key={t}>
              <div>
                <span className="k">0{i + 1}</span>
                <h3>{t}</h3>
              </div>
              <p>{b}</p>
              <span className="foot">{eg}</span>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter n="05" label="THE INTERVENTION">
        <h2>Three steps from impulse to intention.</h2>
        <p>
          The core flow intercepts the purchase moment and creates space for reflective
          decision-making. Step one is silence: the extension monitors product pages and{" "}
          <strong>sits invisible until the moment of decision</strong>, because constant reminders
          cause alert fatigue and get disabled.
        </p>
        <p>
          Step two is the pause itself. It is below, and it works the way it works in the product —
          the urgency goes out of focus, the clock runs, and the choice waits.
        </p>
      </Chapter>

      {/* the page performs the product's own intervention on the reader */}
      <Pause />

      <Chapter n="06" label="AFTER THE PAUSE">
        <h2>Either way, the user wins.</h2>
        <p>
          If you choose to save, you see immediate progress toward your dream goal with a
          celebration animation. If you choose to buy, it&rsquo;s now a conscious decision — not an
          impulse.
        </p>
        <Statement cite="DESIGN RATIONALE">
          Positive reinforcement creates habit formation. Celebrating saves activates the same
          dopamine response that shopping does — redirecting the reward mechanism toward financial
          goals instead of impulse purchases.
        </Statement>
      </Chapter>

      <Chapter n="07" label="DESIGN DECISIONS">
        <h2>Key tradeoffs, and the reasoning.</h2>
        <div className="bp-tradeoffs">
          {TRADEOFFS.map(([t, tension, chose, cost]) => (
            <div key={t}>
              <h3>{t}</h3>
              <p className="tension">{tension}</p>
              <p className="chose">
                <strong>{chose}</strong>
              </p>
              <span className="mono cost">TRADEOFF &middot; {cost}</span>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter n="08" label="IMPACT">
        <h2>Real behaviour change, shipped to production.</h2>
        <Figures
          items={[
            ["73%", "Impulse save rate", "CHOSE THE DREAM GOAL"],
            ["30s", "Average decision time", "INSIDE THE PAUSE"],
            ["4.8", "User satisfaction", "OUT OF 5"],
            ["Live", "Chrome Web Store", "SHIPPED"],
          ]}
        />

        <h3 style={{ marginTop: 44 }}>Systems thinking: edge cases I designed for</h3>
        <div className={`cs-index cs-rv${edgeSeen ? " in" : ""}`} ref={edgeRef}>
          {EDGES.map(([t, b]) => (
            <div key={t}>
              <h3>{t}</h3>
              <p>{b}</p>
            </div>
          ))}
        </div>
      </Chapter>

      <Chapter n="09" label="REFLECTION">
        <h2>What I learned.</h2>
        <ul className="cw-habit">
          {LEARNED.map((l) => (
            <li key={l} className="win">
              {l}
            </li>
          ))}
        </ul>

        <h3 style={{ marginTop: 44 }}>What I&rsquo;d do next</h3>
        <ul className="cw-habit">
          {NEXT_TIME.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>

        <p style={{ marginTop: 40 }}>
          <a className="cs-btn" href={STORE} target="_blank" rel="noopener noreferrer">
            <span>Try Bumper on Chrome</span>
            <span aria-hidden="true">&#8599;</span>
          </a>
        </p>
      </Chapter>

      <NextCase to="/headroom" name="Headroom" tag="LOCAL-FIRST FINANCE · REACT" accent="mint" />
      <CaseFoot />
    </CaseShell>
  );
}

export default BumperCasePage;
