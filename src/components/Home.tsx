import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";
import { motion, useReducedMotion } from "motion/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SignalPreview,
  HeadroomPreview,
  ChronoWeavePreview,
  BumperPreview,
} from "./home/previews";

/* ──────────────────────────────────────────────────────────────────────────
   The homepage. Show the work, say almost nothing.

   The previous version borrowed s32.com's structure including its rule of
   having no imagery at all — which is the one rule that cannot transfer. s32
   is a firm selling conviction and has no craft to show. A portfolio is the
   opposite: the work IS the argument, and describing it in paragraphs is how
   a portfolio ends up reading like a corporate site.

   So the text is cut to roughly a quarter, the three paragraphs of "how I
   work" are gone entirely, and the middle of the page is now a pinned stage
   where the four live previews play at size.

   THE PREVIEWS ARE THE POINT. They are not screenshots. They are hand-built,
   animated recreations of four shipped products, which means the evidence
   for "I build the front end" is itself front-end running in the page.

   THE SCROLL. One pinned stage, scrubbed, that advances through four
   projects. Per the ScrollTrigger guidance: the trigger is pinned and the
   animation is a single top-level timeline, nothing animates the pinned
   element itself, instances are killed through a gsap.context() on unmount,
   and a refresh is issued once fonts settle because their metrics move the
   start and end positions.

   Progress drives React state only when the INDEX changes, not on every
   scroll frame — four renders across the whole stage rather than several
   hundred. That distinction is the difference between this being smooth and
   it being the jank this site spent weeks removing.

   prefers-reduced-motion skips the pin completely and renders the four
   projects as a plain stacked list, which is a real layout and not a
   degraded one.
   ────────────────────────────────────────────────────────────────────────── */

const EMAIL = "harwanijay9498@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/jay-harwani/";

const WORK = [
  { n: "01", name: "Signal", line: "A live map of DMV tech events.", to: "/signal", Preview: SignalPreview },
  { n: "02", name: "Headroom", line: "Can I spend this, right now?", to: "/headroom", Preview: HeadroomPreview },
  { n: "03", name: "ChronoWeave", line: "Helping people with ADHD feel time pass.", to: "/chronoweave", Preview: ChronoWeavePreview },
  { n: "04", name: "Bumper", line: "Catches impulse buys before you regret them.", to: "/bumper", Preview: BumperPreview },
];

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={reduce ? { duration: 0.3 } : { duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── the pinned stage ───────────────────────────────────────────────────── */
function WorkStage() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const iRef = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    gsap.registerPlugin(ScrollTrigger);
    /* Dev-only handle. ScrollTrigger updates through gsap.ticker, which is
       requestAnimationFrame-driven, and rAF does not run in a backgrounded
       tab — so automated checks can create the trigger but never see it
       advance. Exposing it in DEV lets a test drive update() by hand and
       verify the pin and the index for real instead of assuming. Stripped
       from production by import.meta.env.DEV. */
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__ST = ScrollTrigger;

    /* gsap.context() scopes every instance created inside it, so one revert()
       on unmount kills the pin, the spacer and the trigger together. Without
       it a client-side route change leaves a pinned spacer behind. */
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrap,
        start: "top top",
        end: "bottom bottom",
        pin: stage,
        pinSpacing: false, // the wrapper already reserves the scroll distance
        scrub: true,
        onUpdate: (self) => {
          /* Index only. Writing state on every scroll frame would be a few
             hundred React renders across this section; this is four. */
          const next = Math.min(WORK.length - 1, Math.floor(self.progress * WORK.length));
          if (next !== iRef.current) {
            iRef.current = next;
            setI(next);
          }
        },
      });
    }, wrap);

    /* Font metrics move the start and end positions, and the page loads three
       families. Refresh once they have settled. */
    let cancelled = false;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      });
    }

    return () => {
      cancelled = true;
      ctx.revert();
    };
  }, [reduce]);

  /* Reduced motion: a real stacked layout, not a broken pinned one. */
  if (reduce) {
    return (
      <div className="stack">
        {WORK.map((w) => (
          <div className="stack__item" key={w.name}>
            <div className="stage__copy">
              <span className="micro">{w.n} / 04</span>
              <h3 className="stage__name">{w.name}</h3>
              <p className="stage__line">{w.line}</p>
              <Link className="stage__go" to={w.to}>View case ↗</Link>
            </div>
            <div className="stage__screen">
              <w.Preview active />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="workwrap" style={{ height: `${WORK.length * 100}vh` }}>
      <div ref={stageRef} className="stage">
        <div className="stage__in">
          <div className="stage__copy">
            <span className="micro">{WORK[i].n} / 04</span>
            {WORK.map((w, k) => (
              <div key={w.name} className={`stage__text${k === i ? " is-on" : ""}`} aria-hidden={k !== i}>
                <h3 className="stage__name">{w.name}</h3>
                <p className="stage__line">{w.line}</p>
                <Link className="stage__go" to={w.to} tabIndex={k === i ? 0 : -1}>
                  View case ↗
                </Link>
              </div>
            ))}
          </div>

          <div className="stage__screen">
            {WORK.map((w, k) => (
              <div key={w.name} className={`stage__slide${k === i ? " is-on" : ""}`} aria-hidden={k !== i}>
                <w.Preview active={k === i} />
              </div>
            ))}
          </div>
        </div>

        <div className="stage__bar" aria-hidden="true">
          {WORK.map((w, k) => (
            <span key={w.name} className={`stage__tick${k === i ? " is-on" : ""}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function Home() {
  return (
    <main className="s32">
      {/* ── hero ── */}
      <section className="band band--ink band--hero">
        <div className="band__in">
          <Reveal className="hero__top">
            <span className="micro">Jay Harwani</span>
            <span className="micro">Baltimore, MD</span>
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
              <p className="lead hero__lead">Designer who ships the front end. Four products, all live.</p>
            </Reveal>
          </div>

          <Reveal delay={0.26} className="hero__bottom">
            <span className="micro">Selected work ↓</span>
            <span className="micro">Open to full-time</span>
          </Reveal>
        </div>
      </section>

      {/* ── work: the whole point ── */}
      <section id="work" aria-label="Selected work">
        <WorkStage />
      </section>

      {/* ── stone: one sentence ── */}
      <section className="band band--stone">
        <div className="band__in">
          <Reveal>
            <h2 className="head" style={{ maxWidth: "20ch" }}>
              Ahmedabad to Baltimore, by way of a Master&rsquo;s in Human-Centered Computing.
            </h2>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="tools">
              <span><b>Figma</b></span><span><b>React</b></span><span><b>TypeScript</b></span>
              <span><b>Claude</b></span><span><b>Cursor</b></span><span><b>GSAP</b></span>
              <span><b>Three.js</b></span><span><b>Tailwind</b></span><span><b>Adobe CC</b></span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── contact ── */}
      <section className="band band--ink" id="contact">
        <div className="band__in">
          <Reveal>
            <h2 className="display" style={{ maxWidth: "12ch" }}>Let&rsquo;s build something.</h2>
          </Reveal>
          <Reveal delay={0.14}>
            <div className="contact__row">
              <a className="big-link" href={`mailto:${EMAIL}`}>Email</a>
              <a className="big-link" href={LINKEDIN} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="foot">
              <span className="micro">UMBC · Human-Centered Computing</span>
              <span className="micro">No sponsorship required</span>
              <span className="micro">© 2026</span>
            </div>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
