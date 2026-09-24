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
import { Runway } from "./case/Runway";
import { useReveal, useTilt } from "./case/useScene";

/* --------------------------------------------------------------------------
   HEADROOM — CASES.md.

   Redesigned onto the shared case-study system: the homepage's ground, Geist,
   and mint, which is the accent the work index already lights this row with.
   The copy is carried over sentence for sentence; what changed is everything
   around it.

   The signature is the runway — the page performs the subtraction the product
   exists to perform. See Runway.tsx.
   -------------------------------------------------------------------------- */

const SHOT = {
  today: "/headroom/today-healthy.png",
  plan: "/headroom/plan.png",
  add: "/headroom/add-sheet.png",
};

const SCREENS = [
  {
    src: SHOT.today,
    title: "One number",
    body: "Open it, see what's safe. No setup ritual before you get value.",
  },
  {
    src: SHOT.plan,
    title: "Enter bills once",
    body: "Set your money once; it does the forward maths every day after.",
  },
  {
    src: SHOT.add,
    title: "Never shaming",
    body: "No streaks, no red alarms — just a heads-up before you dip.",
  },
];

/** The five thrown away, and the sixth. Titles and lessons are the originals. */
const VERSIONS: Array<[string, string, string]> = [
  ["01", "Glassmorphic neon", "Premium isn't decoration. Restraint reads as expensive."],
  ["02", "Candy-purple mesh", 'The default "AI app" purple looked unserious. Commit to one meaningful accent.'],
  ["03", "Ink + jade", "Colour discipline: one accent, exactly two state colours."],
  ["04", "Forecast graphs everywhere", "If users can't read it, cut it. Every chart went but one."],
  ["05", "Felt like a website", "Native feel is structure, not skin: shell, tab bar, sheets, gestures."],
  ["06", "White + emerald, locked", "The last 20% — what you remove and harden — is the design."],
];

const LIGHTHOUSE: Array<[string, string, string?]> = [
  ["92", "Performance", "LIGHTHOUSE · MOBILE"],
  ["95", "Accessibility", "LIGHTHOUSE · MOBILE"],
  ["100", "Best practices", "LIGHTHOUSE · MOBILE"],
];

/** A phone screenshot that sits off the surface of its card. */
function Phone({ src, alt }: { src: string; alt: string }) {
  const ref = useTilt<HTMLDivElement>(9);
  return (
    <div className="cs-slab hr-phone" ref={ref}>
      <div>
        <img className="cs-lift" src={src} alt={alt} loading="lazy" decoding="async" />
      </div>
    </div>
  );
}

export function HeadroomPage() {
  useEffect(() => {
    document.title = "Headroom — Product design case study";
  }, []);

  const [screensRef, screensSeen] = useReveal<HTMLDivElement>();

  return (
    <CaseShell accent="mint" live={{ href: "https://headroom-opal.vercel.app", label: "LIVE" }}>
      <CaseHero
        meta={
          <>
            <b className="mono">HEADROOM</b>
            <span data-sep>PRODUCT DESIGN</span>
            <span data-sep>SELF-INITIATED</span>
            <span data-sep>SHIPPED</span>
          </>
        }
        title={
          <>
            Your bank balance
            <br />
            <em>is lying to you.</em>
          </>
        }
        standfirst="It shows a number that feels spendable — then rent lands and you're short. Headroom answers the only question that matters: what can I actually spend today?"
        spec={[
          ["ROLE", "Sole designer and builder"],
          ["SCOPE", "Zero to a shipped PWA"],
          ["BUILD", "Design through Claude Code"],
          ["STATE", "Live, installable, on-device"],
          ["DATE", "2026"],
        ]}
      />

      <Chapter n="01" label="THE PROBLEM">
        <h2>70% quit budgeting within two months. Not bad with money — badly served by software.</h2>
        <p>
          The problem was never arithmetic. It's timing — money disappearing between payday and the
          end of the month.
        </p>
        <p>
          Every rival optimises the same thing: a beautiful ledger of the past. YNAB, Monarch and
          Copilot all ask for categories, rules and upkeep first. Mint simply shut down.{" "}
          <strong>None of them lead with a single forward number.</strong>
        </p>

        <div className="cs-bleed">
          <Runway />
        </div>

        <p className="cs-cap">
          Categories to maintain. Bank linking required. Backward-looking. Three things Headroom
          refuses to ask for.
        </p>
      </Chapter>

      <Chapter n="02" label="WHAT IT DOES">
        <h2>Three screens. No categories, no bank login, no chore.</h2>
        <div className={`hr-screens cs-rv${screensSeen ? " in" : ""}`} ref={screensRef}>
          {SCREENS.map((s) => (
            <figure key={s.title}>
              <Phone src={s.src} alt={`Headroom — ${s.title}`} />
              <figcaption>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </figcaption>
            </figure>
          ))}
        </div>
        <div className="hr-refusals mono">
          <span>FULLY ON-DEVICE</span>
          <span>NO ACCOUNTS</span>
          <span>INSTALLABLE PWA</span>
          <span>WORKS OFFLINE</span>
        </div>
      </Chapter>

      <Chapter n="03" label="SIX VERSIONS">
        <h2>I threw away five designs to find the sixth.</h2>
        {/* five of these were thrown away. Marking which is the whole
            point of the section, and it was reading as a neutral list. */}
        <ol className="cs-index hr-versions">
          {VERSIONS.map(([n, t, l], i) => (
            <li key={n} className={i === VERSIONS.length - 1 ? "shipped" : "binned"}>
              <div>
                <span className="k">{n}</span>
                <h3>{t}</h3>
                <span className="status mono">
                  {i === VERSIONS.length - 1 ? "SHIPPED" : "THROWN AWAY"}
                </span>
              </div>
              <p>{l}</p>
            </li>
          ))}
        </ol>
      </Chapter>

      <Chapter n="04" label="OUTCOME">
        <h2>Shipped, installable, and fully on-device.</h2>
        <p>
          Designed and built end-to-end — design through Claude Code — into a working PWA you can
          install from the browser. No accounts, no bank linking, no server holding your money data.
        </p>

        <Statement cite="ON WHAT THE WORK ACTUALLY WAS">
          The hardest work wasn&rsquo;t the interface. It was deciding what to leave out: simplicity
          is a series of refusals, not a coat of paint.
        </Statement>

        <Figures items={LIGHTHOUSE} />

        <h3 style={{ marginTop: 34 }}>What I'd test next</h3>
        <p>
          Whether the heads-up before you dip actually changes behaviour — the one claim I can't
          validate without real users.
        </p>

        <p style={{ marginTop: 34 }}>
          <a
            className="cs-btn"
            href="https://headroom-opal.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Open Headroom</span>
            <span aria-hidden="true">&#8599;</span>
          </a>
        </p>
        <p className="cs-cap" style={{ marginTop: 16 }}>
          Open it on your phone and add it to your home screen — it installs like a native app.
        </p>
      </Chapter>

      <Colophon
        rows={[
          ["DESIGN", "Mine, end to end. Six versions; the sixth shipped."],
          ["BUILD", "React PWA, written with Claude Code."],
          ["DATA", "On device only. No accounts, no bank linking, no server."],
          ["MEASURED", "Lighthouse 92 performance, 95 accessibility, 100 best practices, mobile."],
        ]}
      />

      <NextCase to="/signal" name="Signal" tag="LIVE EVENT MAP · MAPLIBRE" accent="cyan" />
      <CaseFoot />
    </CaseShell>
  );
}

export default HeadroomPage;
