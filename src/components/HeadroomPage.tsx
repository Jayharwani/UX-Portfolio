import { useEffect, useState } from "react";
import { Link } from "react-router";
import { CountUp, Reveal, Sphere } from "./headroom/atoms";
import { Problem } from "./headroom/Problem";
import { Screens } from "./headroom/Screens";
import { Decisions } from "./headroom/Decisions";
import { Mistakes } from "./headroom/Mistakes";
import "../styles/headroom.css";

/* --------------------------------------------------------------------------
   HEADROOM — seven beats, each one explained.

   The previous pass went too far the other way. It was one picture and no
   sentence, which reads as confident and communicates nothing: a lone
   "$1,730" over a floating sphere tells a stranger neither what the product
   is nor why the number matters. A visual without meaning is worse than a
   sentence, so every beat here states its one idea and then shows it.

   The order is the order a reader's questions arrive in: what is this, who
   hurts and why, what is the idea, what did you build, what did you decide,
   what went wrong, would I trust you.

   Cut on the way: the micro-interaction demos and the design-system tiles.
   Both were craft aimed at other designers — the tiles said "ONE ACCENT
   #0A7A52" to people who do not know what an accent is — and neither
   answered a reader question. The never-red decision they carried now lives
   on the home screen's line, where the green status pill is visible above it.

   NUMBERS. $2,500, Rent $650, Wifi $120 and $1,730 are read off the running
   app's Plan and Today screens. The brief's line said "rent, wifi and three
   bills"; the app lists two, so the line says two.
   -------------------------------------------------------------------------- */

const LIVE = "https://headroom-opal.vercel.app/";

export function HeadroomPage() {
  /* The nav carries a pale scrim so it stays legible. The ink section runs
     under it for several screens, where that scrim is a white smear. A
     one-pixel observer band at the nav line says which ground is under it. */
  const [onInk, setOnInk] = useState(false);

  useEffect(() => {
    const el = document.querySelector(".hd-dark");
    if (!el) return;
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

      {/* 1 · what it is */}
      <header className="beat hero">
        <Sphere className="sphere" depth={70} />
        <Reveal y={22}>
          <span className="eyebrow">HEADROOM · PRODUCT DESIGN</span>
          <h1>Know what you can actually spend.</h1>
          <p className="line">
            A money app that shows what&rsquo;s safe to spend today &mdash; before payday.
          </p>
          <div className="figure">
            <span className="amount mono">
              <CountUp to={1730} duration={2} />
            </span>
            <span className="under mono">SAFE TO SPEND TODAY, NOT THE $2,500 IN THE ACCOUNT</span>
          </div>
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

      {/* 2 · who hurts, and why */}
      <section className="beat">
        <Reveal>
          <h2>Your balance lies.</h2>
          <p className="line wide">
            Your bank says <b>$2,500</b>. But rent and wifi are due before your next paycheck.
            Most apps still show you the $2,500 &mdash; so you spend it, and come up short.
          </p>
        </Reveal>
        <Problem />
      </section>

      {/* 3 · the idea */}
      <section className="beat insight">
        <Reveal>
          <h2>People don&rsquo;t need a budget.</h2>
          <p className="line wide">
            They need to know what&rsquo;s safe to spend today. So I designed the whole app around
            one number &mdash; not categories, not charts.
          </p>
        </Reveal>
      </section>

      {/* 4 · what I built */}
      <section className="beat">
        <Reveal>
          <h2>Three screens, one job each.</h2>
          <p className="line wide">
            The whole product is here. Nothing to set up before it tells you something useful.
          </p>
        </Reveal>
        <Screens />
      </section>

      {/* 5 · what I decided */}
      <section className="beat">
        <Reveal>
          <h2>What I chose to leave out.</h2>
          <p className="line wide">
            Every rival asks for these before it will help you. Removing them was the design.
          </p>
        </Reveal>
        <Decisions />
      </section>

      {/* 6 · what went wrong */}
      <Mistakes />

      {/* 7 · would I trust you */}
      <section className="beat end">
        <Sphere className="sphere" depth={40} />
        <Reveal>
          <h2>A real app, not a mockup.</h2>
          <p className="line">
            Shipped as a live, installable app. Built solo, using AI to write the code &mdash;
            every design decision mine. Self-initiated, so there are no user numbers to quote yet.
          </p>
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
