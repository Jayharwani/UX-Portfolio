import { useState, useCallback, useRef, useEffect } from "react";
import { Link } from "react-router";

/* ──────────────────────────────────────────────────────────────────────────
   THE DATASHEET — the front door.

   Why this replaced a five-thousand-pixel scroll:

   The site's own headline is "I design interfaces that get out of the way.
   Because the ultimate user experience is closing the laptop." The previous
   front door contradicted that sentence three times over. It was long, so it
   did not get out of the way. It was midnight-dark, which is the look of
   staying up coding rather than of closing the laptop. And it asked a visitor
   to sit through a particle assembly and a rotating lattice before reaching
   anything they came for. The copy was the boldest thing on the page and the
   design was the safest, which is the wrong way round.

   A component datasheet is the one document format whose entire job is to fit
   the specifications on a single page and let you leave. That is the claim,
   made operable. One screen, no scroll, four rows of work, an address to write
   to, and an exit that is offered rather than withheld.

   THE COUNTER NEVER GATES. The site that prompted this rebuild locks its exit
   until you have viewed the work, which is a good mechanic for a portfolio
   whose thesis is "stay and play". Here it would be incoherent: you cannot
   hold someone hostage to prove you respect their time. The counter
   acknowledges what has been read and the exit is live from the first second.
   ────────────────────────────────────────────────────────────────────────── */

const EMAIL = "harwanijay9498@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/jay-harwani/";

interface Row {
  slug: string;
  to: string;
  name: string;
  line: string;
  tags: string[];
}

/* Kept in the order a founder would want them: the thing that is live and
   running first, the speculative work last. */
const ROWS: Row[] = [
  {
    slug: "signal",
    to: "/signal",
    name: "Signal",
    line: "A live map of DMV tech events that reads your calendar and shows which ones you can actually make.",
    tags: ["Live", "Maps"],
  },
  {
    slug: "headroom",
    to: "/headroom",
    name: "Headroom",
    line: "A money app that answers one question. Can I spend this, right now. Local-first, no bank login.",
    tags: ["PWA", "On-device"],
  },
  {
    slug: "chronoweave",
    to: "/chronoweave",
    name: "ChronoWeave",
    line: "Multi-sensory nudges that help people with ADHD feel time pass. Haptics, audio, light.",
    tags: ["Mobile", "Haptics"],
  },
  {
    slug: "bumper",
    to: "/bumper",
    name: "Bumper",
    line: "An agentic Chrome extension that catches impulse buys before you regret them.",
    tags: ["Extension", "Agentic"],
  },
];

/* The specification block. It exists because the top-right of the sheet was
   dead space, and because a datasheet without specifications is a poster. Each
   line is something a founder actually screens on and that appears nowhere
   else on the sheet: no repeating the role from the header or the degree from
   the footer. This is also where the old toolchain section survives, as three
   words instead of eleven logos. */
const SPECS: Array<[string, string]> = [
  ["Stack", "React · TypeScript · Motion · Three"],
  ["Tools", "Figma · Claude Code · Cursor"],
  ["Method", "Research → prototype → shipped front-end"],
];

/** a print registration mark, four to a sheet */
function Reg({ where }: { where: "tl" | "tr" | "bl" | "br" }) {
  return (
    <svg className={`ds__reg ds__reg--${where}`} viewBox="0 0 13 13" aria-hidden="true">
      <circle cx="6.5" cy="6.5" r="4" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M6.5 0v13M0 6.5h13" stroke="currentColor" strokeWidth="0.7" />
    </svg>
  );
}

export default function HomeDatasheet() {
  const [seen, setSeen] = useState<Set<string>>(() => new Set());
  const [copied, setCopied] = useState(false);
  const timers = useRef<Record<string, number>>({});

  /* A row counts as read after the pointer has rested on it, or the moment it
     is focused or opened. Hovering past on the way to something else is not
     reading, and a counter that ticks on a stray mouse path is a counter
     nobody trusts. */
  const markSoon = useCallback((slug: string) => {
    if (timers.current[slug]) return;
    timers.current[slug] = window.setTimeout(() => {
      delete timers.current[slug];
      setSeen((s) => (s.has(slug) ? s : new Set(s).add(slug)));
    }, 550);
  }, []);

  const cancel = useCallback((slug: string) => {
    window.clearTimeout(timers.current[slug]);
    delete timers.current[slug];
  }, []);

  const markNow = useCallback((slug: string) => {
    setSeen((s) => (s.has(slug) ? s : new Set(s).add(slug)));
  }, []);

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach((id) => window.clearTimeout(id));
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked: the mailto link beside this still works */
    }
  }, []);

  const done = seen.size === ROWS.length;

  return (
    <main className="ds">
      <Reg where="tl" />
      <Reg where="tr" />
      <Reg where="bl" />
      <Reg where="br" />

      {/* ── the part number line ── */}
      <header className="ds__band ds__head">
        <span className="ds__name">Jay Harwani</span>
        <span className="ds__mono ds__hideNarrow">Product Designer · Design Engineer</span>
        <span className="ds__spacer" />
        <Link to="/about" className="ds__mono ds__link">
          About
        </Link>
        <span className="ds__mono ds__status">
          <i aria-hidden="true" />
          Open to work
        </span>
      </header>

      <div className="ds__body">
        <div className="ds__claimWrap">
          <div className="ds__claimMain">
            <h1 className="ds__claim">
              I design interfaces that get <em>out of the way</em>.
            </h1>
            <p className="ds__claimSub">
              Because the ultimate user experience is closing the laptop. Stopping at Figma is for
              cowards, so I take products from raw research straight into shipped, front-end reality.
            </p>
          </div>

          <dl className="ds__specs ds__hideNarrow">
            {SPECS.map(([k, v]) => (
              <div className="ds__spec" key={k}>
                <dt className="ds__mono">{k}</dt>
                <dd className="ds__specVal">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── the specification table ── */}
        <section className="ds__table" aria-labelledby="ds-work">
          <div className="ds__tableHead">
            <span className="ds__mono" id="ds-work">
              Selected work
            </span>
            <span className="ds__spacer" />
            <span className="ds__mono ds__hideNarrow">Four shipped things</span>
          </div>

          <div className="ds__rows">
            {ROWS.map((r, i) => (
              <Link
                key={r.slug}
                to={r.to}
                className={`ds__row${seen.has(r.slug) ? " ds__row--seen" : ""}`}
                onMouseEnter={() => markSoon(r.slug)}
                onMouseLeave={() => cancel(r.slug)}
                onFocus={() => markNow(r.slug)}
                onClick={() => markNow(r.slug)}
              >
                <span className="ds__idx">{String(i + 1).padStart(2, "0")}</span>
                <span className="ds__rowMain">
                  <span className="ds__rowName">{r.name}</span>
                  <span className="ds__rowLine">{r.line}</span>
                </span>
                <span className="ds__rowEnd">
                  <span className="ds__tags">
                    {r.tags.map((t) => (
                      <span className="ds__tag" key={t}>
                        {t}
                      </span>
                    ))}
                  </span>
                  <span className="ds__arrow" aria-hidden="true">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── where to write, and the way out ── */}
      <footer className="ds__band ds__foot">
        <span className="ds__mono ds__hideNarrow">MSc Human-Centered Computing, UMBC · Baltimore</span>
        <span className="ds__spacer" />

        <button type="button" className="ds__mono ds__link" onClick={copyEmail}>
          {copied ? "Copied" : "Copy email"}
        </button>
        <a
          className="ds__mono ds__link"
          href={LINKEDIN}
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>

        <span className="ds__count" aria-live="polite">
          {seen.size} of {ROWS.length} read
        </span>

        <a className={`ds__exit${done ? " ds__exit--done" : ""}`} href={`mailto:${EMAIL}`}>
          {done ? "That is all of it. Close the laptop" : "Seen enough? Write to me"}
          <span aria-hidden="true">→</span>
        </a>
      </footer>
    </main>
  );
}
