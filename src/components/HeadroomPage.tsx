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
import { Subtract } from "./case/Subtract";
import { useReveal, useTilt } from "./case/useScene";

/* --------------------------------------------------------------------------
   HEADROOM — rebuilt on its own ground.

   This page was black, like the other four, and that was inherited rather
   than argued for. Headroom is a warm off-white app with a deep emerald and
   a great deal of air, whose entire manner is calm and unshaming; a case
   study about it set in a dark terminal was describing one thing while
   looking like another. It is printed on the product's own skin now.

   THE SPINE IS SUBTRACTION. The product's claim is not that it does more,
   it is that it refuses nearly everything the category treats as mandatory
   and shows one number instead. So the page performs the refusals — see
   Subtract.tsx — rather than asserting them, and the chapter count came down
   from four to three on the same principle.

   Every figure is the running product's: $2,500 in the account, $770 of
   bills in Rent and Wifi, $1,730 safe to spend. Open the app and they are
   the numbers on the first screen.
   -------------------------------------------------------------------------- */

const LIVE = "https://headroom-opal.vercel.app";

const SCREENS = [
  {
    src: "/headroom/today-healthy.png",
    title: "One number",
    body: "Open it, see what's safe. No setup ritual before you get value.",
  },
  {
    src: "/headroom/plan.png",
    title: "Enter bills once",
    body: "Set your money once; it does the forward maths every day after.",
  },
  {
    src: "/headroom/add-sheet.png",
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
        <img
          className="cs-lift"
          src={src}
          alt={alt}
          width={446}
          height={1000}
          loading="lazy"
          decoding="async"
        />
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
    <CaseShell accent="emerald" theme="light" live={{ href: LIVE, label: "LIVE" }}>
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
        standfirst="It shows a number that feels spendable. Then rent lands and you're short. Headroom shows the one number that is actually yours."
        spec={[
          ["ROLE", "Sole designer and builder"],
          ["SCOPE", "Zero to a shipped PWA"],
          ["VERSIONS", "Six. Five thrown away."],
          ["STATE", "Live, installable, on-device"],
          ["DATE", "2026"],
        ]}
        cta={{ href: LIVE, label: "Open Headroom" }}
      />

      <Chapter n="01" label="THE LIE">
        <h2>Your account says $2,500. Seven hundred of it is already spent.</h2>
        <p>
          The problem was never arithmetic. It&rsquo;s timing — money disappearing between payday
          and the end of the month, against a number that looks available and isn&rsquo;t.
        </p>

        <div className="cs-bleed">
          <Runway />
        </div>

        <p>
          Every rival optimises the same thing: a beautiful ledger of the past. YNAB, Monarch and
          Copilot all ask for categories, rules and upkeep before they tell you anything. Mint
          simply shut down. <strong>None of them lead with a single forward number.</strong>
        </p>
      </Chapter>

      <Chapter n="02" label="THE REFUSALS">
        <h2>Simplicity is a series of refusals.</h2>
        <p>
          Not a coat of paint. Every feature I didn&rsquo;t build is a decision I had to defend,
          and this is the list.
        </p>

        <Subtract />

        <div className="hr-refusals mono">
          <span>FULLY ON-DEVICE</span>
          <span>NO ACCOUNTS</span>
          <span>INSTALLABLE PWA</span>
          <span>WORKS OFFLINE</span>
        </div>

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
      </Chapter>

      <Chapter n="03" label="SIX VERSIONS">
        <h2>I threw away five designs to find the sixth.</h2>
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

        <Statement cite="ON WHAT THE WORK ACTUALLY WAS">
          The hardest work wasn&rsquo;t the interface. It was deciding what to leave out.
        </Statement>

        <Figures items={LIGHTHOUSE} accent />

        <h3 style={{ marginTop: 34 }}>What I&rsquo;d test next</h3>
        <p>
          Whether the heads-up before you dip actually changes behaviour — the one claim I
          can&rsquo;t validate without real users.
        </p>

        <p style={{ marginTop: 34 }}>
          <a className="cs-btn" href={LIVE} target="_blank" rel="noopener noreferrer">
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
