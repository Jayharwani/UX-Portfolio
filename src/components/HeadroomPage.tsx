import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { CountUp, Reveal, Sphere, Tilt } from "./headroom/atoms";
import { Problem } from "./headroom/Problem";
import { Mistakes } from "./headroom/Mistakes";
import { Demos } from "./headroom/Demos";
import "../styles/headroom.css";

/* --------------------------------------------------------------------------
   HEADROOM — seven beats.

   Off the shared .cs chapter system, which is an essay format: numbered
   chapters, a standfirst, columns of prose. This is one picture and at most
   one line per screen, which is a different shape, so it has its own scope.

   NUMBERS. $2,500, Rent $650, Wifi $120 and $1,730 are all read off the
   running app's Plan and Today screens. The brief asked for $1,200 counting
   to $885: $885 is real — it is the figure on the onboarding card — but it
   is not the result of this subtraction, and $1,200 is in the product
   nowhere. The brief also says not to invent metrics, so the page uses the
   set that reconciles.
   -------------------------------------------------------------------------- */

const LIVE = "https://headroom-opal.vercel.app/";

const CHIPS = [
  ["no categories", "M3 8h10M3 12h10M3 16h6"],
  ["no bank login", "M4 8h12v9H4zM7 8V6a3 3 0 0 1 6 0v2"],
  ["on-device", "M6 3h8v14H6zM9 15h2"],
] as const;

export function HeadroomPage() {
  /* The nav carries a pale scrim so it stays legible over the page. The ink
     section runs under it for five screens, where that scrim is a white
     smear. A one-pixel observer band at the nav line says which ground is
     under it, which costs nothing and needs no scroll listener. */
  const ink = useRef<HTMLElement | null>(null);
  const [onInk, setOnInk] = useState(false);

  useEffect(() => {
    const el = document.querySelector(".hd-dark");
    if (!el) return;
    ink.current = el as HTMLElement;
    const NAV = 54;
    const io = new IntersectionObserver(([e]) => setOnInk(e.isIntersecting), {
      rootMargin: `-${NAV}px 0px -${Math.max(0, window.innerHeight - NAV - 1)}px 0px`,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.title = "Headroom — Product design case study";
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#F7F8F7";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  return (
    <div className="hd">
      <nav className={`nav${onInk ? " on-ink" : ""}`}>
        <Link to="/">
          <span aria-hidden="true">&larr;</span> <span className="mono">WORK</span>
        </Link>
        <a className="live mono" href={LIVE} target="_blank" rel="noopener noreferrer">
          TRY IT LIVE
        </a>
      </nav>

      {/* 0 · hero */}
      <header className="beat hero">
        <Sphere className="sphere" depth={70} />
        <Reveal y={22}>
          <span className="eyebrow">HEADROOM · PRODUCT DESIGN</span>
          <span className="amount mono">
            <CountUp to={1730} duration={2} />
          </span>
          <span className="under mono">SAFE TO SPEND TODAY</span>
          <h1 className="line" style={{ maxWidth: "22ch", color: "var(--ink)", fontSize: "clamp(1.2rem,2.4vw,1.75rem)" }}>
            A money app that answers one question.
          </h1>
          <div className="btns">
            <a className="btn" href={LIVE} target="_blank" rel="noopener noreferrer">
              Try it live <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </Reveal>
        <span className="cue mono" aria-hidden="true">
          <i />
          SCROLL
        </span>
      </header>

      {/* 1 · the problem */}
      <section className="beat">
        <Reveal>
          <h2>Your balance lies.</h2>
          <p className="line">So I built the number it hides.</p>
        </Reveal>
        <Problem />
      </section>

      {/* 2 · the idea */}
      <section className="beat idea">
        <Reveal>
          <h2>One number. No chores.</h2>
          <div className="chips">
            {CHIPS.map(([label, d]) => (
              <span className="chip" key={label}>
                <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d={d} stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {label}
              </span>
            ))}
          </div>
        </Reveal>
        <Tilt className="phone" max={8}>
          <img
            src="/headroom/today-healthy.png"
            alt="Headroom's home screen: $1,730 safe to spend, $87 a day, 20 days to payday, with Rent and Wifi listed under Coming up"
            width={446}
            height={1000}
            loading="lazy"
            decoding="async"
          />
        </Tilt>
      </section>

      {/* 3 · the mistakes */}
      <Mistakes />

      {/* 4 · the details */}
      <section className="beat">
        <Reveal>
          <h2>The stuff you feel but never notice.</h2>
        </Reveal>
        <Demos />
      </section>

      {/* 5 · the system */}
      <section className="beat">
        <Reveal>
          <h2>One identity, everywhere.</h2>
        </Reveal>
        <div className="tiles">
          <Reveal className="tile" delay={0.05}>
            <div className="sw" />
            <span className="cap mono">ONE ACCENT. #0A7A52.</span>
          </Reveal>
          <Reveal className="tile" delay={0.12}>
            <span className="spec mono">$1,730</span>
            <span className="cap mono">TABULAR FIGURES ALWAYS.</span>
          </Reveal>
          <Reveal className="tile" delay={0.19}>
            <div className="track">
              <i style={{ width: "62%" }} />
            </div>
            <span className="cap mono">ONE CURVE. 300&ndash;700MS.</span>
          </Reveal>
        </div>
      </section>

      {/* 6 · try it */}
      <section className="beat end">
        <Sphere className="sphere" depth={40} />
        <Reveal>
          <h2>Headroom — what you can actually spend.</h2>
          <p className="line">A real, installable app. Built solo with AI. Every design call mine.</p>
          <div className="btns" style={{ justifyContent: "center" }}>
            <a className="btn" href={LIVE} target="_blank" rel="noopener noreferrer">
              Try it live <span aria-hidden="true">&#8599;</span>
            </a>
            <Link className="btn ghost" to="/friction">
              Next case study
            </Link>
          </div>
        </Reveal>
      </section>

      <footer className="foot">
        <span className="mono">JAY HARWANI</span>
        <span className="mono">OPEN TO PRODUCT DESIGN ROLES</span>
        <a className="mono" href="mailto:harwanijay9498@gmail.com" style={{ marginLeft: "auto" }}>
          harwanijay9498@gmail.com
        </a>
      </footer>
    </div>
  );
}

export default HeadroomPage;
