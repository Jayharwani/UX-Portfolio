import { useState } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";

/* ──────────────────────────────────────────────────────────────────────────
   The homepage, rebuilt against a measured read of s32.com.

   What was actually copied is the DISCIPLINE, not the look:
     one typeface, five sizes, two weights
     no images, no video, no canvas
     full-bleed grounds that invert between sections
     a 5.4x jump from display to body, carrying the contrast that glows and
     particles used to be asked to carry

   What was deliberately not copied:

   · s32 inverts to pure white. This inverts to warm stone, so the page gets
     a real temperature clash — the old palette sat entirely between 260 and
     268 degrees — without a white screen in the middle of a dark site.

   · s32 is completely still, which is available to a firm selling conviction
     and not to someone whose claim is that they build the front end. So
     there is exactly ONE moving thing: the work index is bound to a live
     figure, both ways. It is the single interaction on the page and it is
     the thing the reference does not have.

   Everything that used to compete is gone: the particle headline, the WebGL
   lattice, the physics tool blocks. The tools are now a line of words, which
   is denser to read than eleven floating icons and does not cost 27 KB of
   physics engine to hold up.
   ────────────────────────────────────────────────────────────────────────── */

const EMAIL = "harwanijay9498@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/jay-harwani/";

interface Work {
  n: string;
  name: string;
  line: string;
  to: string;
  x: number;
  y: number;
}

const WORK: Work[] = [
  {
    n: "01",
    name: "Signal",
    line: "A live map of DMV tech events that reads your calendar and shows which ones you can actually make.",
    to: "/signal",
    x: 64, y: 18,
  },
  {
    n: "02",
    name: "Headroom",
    line: "A money app that answers one question: can I spend this, right now. Local-first, no bank login.",
    to: "/headroom",
    x: 26, y: 40,
  },
  {
    n: "03",
    name: "ChronoWeave",
    line: "Multi-sensory nudges that help people with ADHD feel time pass. Haptics, audio, light.",
    to: "/chronoweave",
    x: 76, y: 63,
  },
  {
    n: "04",
    name: "Bumper",
    line: "An agentic Chrome extension that catches impulse buys before you regret them.",
    to: "/bumper",
    x: 38, y: 85,
  },
];

/* a shape, not a mesh: four points and four lines read as a figure, every
   pair would read as a net */
const LINKS: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
];

const TOOLS = [
  "Figma", "React", "TypeScript", "Claude", "Cursor", "Framer Motion",
  "Three.js", "Tailwind", "Vite", "Adobe CC", "Git",
];

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={
        reduce
          ? { duration: 0.3 }
          : { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}

export function Home() {
  const [active, setActive] = useState<string | null>(null);
  const activeIdx = WORK.findIndex((w) => w.name === active);

  return (
    <main className="s32">
      {/* ── hero ───────────────────────────────────────────────────────── */}
      <section className="band band--ink band--hero">
        <div className="band__in">
          <Reveal className="hero__top">
            <span className="micro">Jay Harwani</span>
            <span className="micro">Product Designer · Design Engineer</span>
          </Reveal>

          <div className="hero__mid">
            <Reveal delay={0.08}>
              <h1 className="display">
                I design interfaces
                <br />
                that get out of the way.
              </h1>
            </Reveal>
            <Reveal delay={0.18}>
              <p className="lead hero__lead">
                Because the ultimate user experience is closing the laptop. I take products from raw
                research into shipped, front-end reality — not a handoff, the actual thing.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.26} className="hero__bottom">
            <span className="micro">Baltimore, MD · Open to full-time</span>
            <span className="micro">Scroll ↓</span>
          </Reveal>
        </div>
      </section>

      {/* ── approach ───────────────────────────────────────────────────── */}
      <section className="band band--slate">
        <div className="band__in">
          <Reveal>
            <span className="micro">How I work</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="head" style={{ marginTop: 18, maxWidth: "18ch" }}>
              Research, design, and the actual code.
            </h2>
          </Reveal>

          <div className="threeup">
            {[
              {
                n: "01",
                t: "Research first",
                b: "HCI research at UMBC. I start with people, not screens — interviews, diary studies, and the unglamorous work of finding out what the problem actually is before drawing anything.",
              },
              {
                n: "02",
                t: "Design with constraints",
                b: "Every decision has a reason I can defend: contrast measured, motion budgeted, hierarchy argued. Taste is judgement under constraint, not decoration applied afterwards.",
              },
              {
                n: "03",
                t: "Ship it myself",
                b: "React, TypeScript, real front-end. Four products live, not four prototypes. Stopping at Figma means someone else decides what your design actually becomes.",
              },
            ].map((c, i) => (
              <Reveal key={c.n} delay={0.1 + i * 0.07}>
                <span className="micro threeup__n">{c.n}</span>
                <span className="threeup__t">{c.t}</span>
                <p className="body">{c.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── work: the one interaction ──────────────────────────────────── */}
      <section className="band band--ink" id="work" style={{ scrollMarginTop: 0 }}>
        <div className="band__in">
          <Reveal>
            <span className="micro">Selected work</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="head" style={{ marginTop: 18, maxWidth: "16ch" }}>
              Four products, all shipped.
            </h2>
          </Reveal>

          <div className="work">
            <Reveal delay={0.1}>
              <ul className="wlist">
                {WORK.map((w) => {
                  const on = active === w.name;
                  return (
                    <li key={w.name}>
                      <Link
                        to={w.to}
                        className={`wrow${on ? " wrow--on" : ""}`}
                        onMouseEnter={() => setActive(w.name)}
                        onMouseLeave={() => setActive(null)}
                        onFocus={() => setActive(w.name)}
                        onBlur={() => setActive(null)}
                      >
                        <span className="wrow__n">{w.n}</span>
                        <span>
                          <span className="wrow__name">{w.name}</span>
                          <span className="wrow__line">{w.line}</span>
                        </span>
                        <span className="wrow__go" aria-hidden="true">
                          View ↗
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="figbox">
                <div className="figbox__fig">
                  <svg
                    className="figbox__svg"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    {LINKS.map(([a, b], i) => {
                      const on = activeIdx === a || activeIdx === b;
                      return (
                        <line
                          key={i}
                          x1={WORK[a].x}
                          y1={WORK[a].y}
                          x2={WORK[b].x}
                          y2={WORK[b].y}
                          vectorEffect="non-scaling-stroke"
                          className={on ? "fline fline--on" : "fline"}
                        />
                      );
                    })}
                  </svg>

                  {WORK.map((w) => {
                    const on = active === w.name;
                    return (
                      <span
                        key={w.name}
                        className={`fstar${on ? " fstar--on" : ""}`}
                        style={{ left: `${w.x}%`, top: `${w.y}%` }}
                        onMouseEnter={() => setActive(w.name)}
                        onMouseLeave={() => setActive(null)}
                        aria-hidden="true"
                      >
                        <span className="fstar__d" />
                        <span className="fstar__t">{w.name}</span>
                      </span>
                    );
                  })}
                </div>
                <div className="figbox__cap">
                  <span className="micro">
                    {active ? `Fig. 1 — ${active}` : "Fig. 1 — Hover a project"}
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── stone: the inversion ───────────────────────────────────────── */}
      <section className="band band--stone">
        <div className="band__in">
          <Reveal>
            <span className="micro">About</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="head" style={{ marginTop: 18, maxWidth: "14ch" }}>
              Ahmedabad to Baltimore.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="body" style={{ marginTop: 24, maxWidth: "58ch" }}>
              I grew up in Ahmedabad and came to UMBC for a Master&rsquo;s in Human-Centered
              Computing. I like problems where the research and the build are the same job, films
              with a good third act, and interfaces that know when to get out of the way.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div style={{ marginTop: 56 }}>
              <span className="micro">What I build with</span>
              <div className="tools">
                {TOOLS.map((t, i) => (
                  <span key={t}>
                    <b>{t}</b>
                    {i < TOOLS.length - 1 ? "" : ""}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── contact ────────────────────────────────────────────────────── */}
      <section className="band band--ink" id="contact">
        <div className="band__in">
          <Reveal>
            <span className="micro">Contact</span>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="display" style={{ marginTop: 20, maxWidth: "12ch" }}>
              Let&rsquo;s build something.
            </h2>
          </Reveal>

          <Reveal delay={0.14}>
            <div className="contact__row">
              <a className="big-link" href={`mailto:${EMAIL}`}>
                Email
              </a>
              <a className="big-link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">
                LinkedIn ↗
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="foot">
              <span className="micro">Master&rsquo;s in Human-Centered Computing, UMBC</span>
              <span className="micro">Open to full-time · No sponsorship required</span>
              <span className="micro">© 2026</span>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
