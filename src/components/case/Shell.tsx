import { useEffect, type ReactNode } from "react";
import { Link } from "react-router";
import { useReveal, useScene } from "./useScene";
import "../../styles/case.css";

/* --------------------------------------------------------------------------
   THE CASE STUDY SHELL — CASES.md §2.

   One ground, one type system, one set of chrome, shared by all four. What
   differs per page is the accent and the signature scene; everything here is
   the part that should not differ, and putting it in one place is what stops
   the four pages drifting apart again.
   -------------------------------------------------------------------------- */

export type CaseAccent = "mint" | "cyan" | "violet" | "gold";

export const ACCENTS: Record<CaseAccent, string> = {
  mint: "#5FD8A4",
  cyan: "#5FD3D8",
  violet: "#8B7BE8",
  gold: "#E9C58B",
};

/** Progress hairline. Its scene is the document, so --p is read scroll depth. */
function Rail() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>(".cs-rail");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--p", "1");
      return;
    }
    let raf = 0;
    let armed = false;
    const write = () => {
      armed = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      el.style.setProperty("--p", p.toFixed(4));
    };
    const arm = () => {
      if (armed) return;
      armed = true;
      raf = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", arm, { passive: true });
    window.addEventListener("resize", arm, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", arm);
      window.removeEventListener("resize", arm);
    };
  }, []);

  return (
    <div className="cs-rail" aria-hidden="true">
      <i />
    </div>
  );
}

export function CaseShell({
  accent,
  live,
  children,
}: {
  accent: CaseAccent;
  live?: { href: string; label: string };
  children: ReactNode;
}) {
  /* The page ground is dark. body is white underneath — all four case studies
     used to paint over it with an inner wrapper, so a slow paint flashed white
     before the page landed. Setting it on the element that owns the design and
     restoring it on the way out keeps the flash out without leaking the colour
     into the rest of the site. */
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#05070C";
    window.scrollTo(0, 0);
    return () => {
      document.body.style.backgroundColor = prev;
    };
  }, []);

  return (
    <div className="cs" style={{ ["--accent" as string]: ACCENTS[accent] }}>
      <div className="cs-wash" aria-hidden="true" />
      <div className="cs-grain" aria-hidden="true" />
      <Rail />

      <nav className="cs-nav">
        <Link to="/">
          <span className="arrow">&larr;</span>
          <span className="mono">WORK</span>
        </Link>
        {live ? (
          <a className="live mono" href={live.href} target="_blank" rel="noopener noreferrer">
            <i />
            {live.label}
          </a>
        ) : null}
      </nav>

      <div className="cs-page">{children}</div>
    </div>
  );
}

/* ── hero ── */
export function CaseHero({
  meta,
  title,
  standfirst,
  children,
}: {
  meta: ReactNode;
  title: ReactNode;
  standfirst?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="cs-hero cs-wrap">
      <div className="cs-eyebrow">{meta}</div>
      <h1>{title}</h1>
      {standfirst ? <p className="cs-standfirst">{standfirst}</p> : null}
      {children}
    </header>
  );
}

/* ── a numbered chapter, revealed once ── */
export function Chapter({
  n,
  label,
  children,
  wide,
}: {
  n: string;
  label: string;
  children: ReactNode;
  wide?: boolean;
}) {
  const [ref, seen] = useReveal<HTMLElement>();
  return (
    <section className="cs-chapter" ref={ref}>
      <div className={wide ? "cs-wrap" : "cs-wrap"}>
        <div className={`cs-rv${seen ? " in" : ""}`}>
          <div className="cs-num mono">
            {n} &nbsp;{label}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}

/* ── metrics ── */
export function Metrics({ items }: { items: Array<[string, string]> }) {
  return (
    <div className="cs-metrics">
      {items.map(([value, label]) => (
        <div className="cs-metric" key={label}>
          <b>{value}</b>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── pull quote ── */
export function Quote({ children, cite }: { children: ReactNode; cite: string }) {
  return (
    <blockquote className="cs-quote">
      <p>{children}</p>
      <cite className="mono">{cite}</cite>
    </blockquote>
  );
}

/* --------------------------------------------------------------------------
   THE HANDOFF.

   Replaces the identical plea all four pages used to close on. PRODUCT.md
   rejects that shape twice over — "Generic SaaS landing… one big CTA", and a
   page that pleads "gets read as available rather than desirable". The reader
   has just finished the evidence, so the honest next offer is more evidence.
   Behaves like a row on the work index, including the magnetic indent.
   -------------------------------------------------------------------------- */
export function NextCase({
  to,
  name,
  tag,
  accent,
}: {
  to: string;
  name: string;
  tag: string;
  accent: CaseAccent;
}) {
  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--dx", `${12 + ((e.clientX - r.left) / r.width) * 10}px`);
  };
  const onLeave = (e: React.PointerEvent<HTMLAnchorElement>) => {
    e.currentTarget.style.setProperty("--dx", "0px");
  };

  return (
    <Link
      className="cs-next"
      to={to}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ ["--next-accent" as string]: ACCENTS[accent] }}
    >
      <div className="cs-wrap">
        <span className="lbl mono">NEXT CASE STUDY</span>
        <div className="inner">
          <h2>{name}</h2>
          <span className="tag mono">{tag}</span>
        </div>
      </div>
      <i className="glow" />
    </Link>
  );
}

/* ── foot ──
   The employment signal lives here, which is where PRODUCT.md puts it: in the
   footer, so the page itself never has to plead. */
export function CaseFoot() {
  return (
    <footer className="cs-foot">
      <div className="cs-wrap" style={{ display: "flex", flexWrap: "wrap", gap: "12px 28px", width: "100%" }}>
        <span className="mono">JAY HARWANI</span>
        <span className="mono">OPEN TO PRODUCT DESIGN ROLES</span>
        <a className="mono" href="mailto:harwanijay9498@gmail.com" style={{ marginLeft: "auto" }}>
          harwanijay9498@gmail.com
        </a>
      </div>
    </footer>
  );
}

/* ── a scene whose scroll progress drives CSS ── */
export function Scene({
  className,
  children,
  style,
}: {
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) {
  const ref = useScene<HTMLDivElement>();
  return (
    <div className={className} ref={ref} style={style}>
      {children}
    </div>
  );
}
