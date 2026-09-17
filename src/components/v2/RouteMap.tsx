import { useEffect, useRef, useState } from "react";
import { ROUTE } from "../../data/projects";
import { useReveal } from "./useReveal";

/* --------------------------------------------------------------------------
   THE ROUTE — SPEC §7, BUILD step 5.

   Ahmedabad to Baltimore. One 2.4s exponential ease drives three things at
   once: the arc's dash offset, a light travelling the path via
   getPointAtLength, and the counter ticking to 12,382 km.

   THE LIGHT IS A REAL LIGHT. It carries backdrop-filter: brightness(2.6), so
   the dot grid genuinely brightens under it and falls dark behind. SPEC calls
   this out as the effect that makes the section and says not to replace it
   with a drawn glow, which would be a picture of a light rather than one.

   12,382 km is the verified great-circle distance. The figure the old site
   carried was wrong.

   FIRES ONCE, ON ENTRY. The observer unobserves itself, so scrolling back up
   does not replay it — an animation that re-runs every time it re-enters the
   viewport stops being an event and becomes a loop.
   -------------------------------------------------------------------------- */

const TOOLS = [
  { t: "Figma", d: ["M8.5 3h3.5v6H8.5a3 3 0 0 1 0-6Z", "M12 3h3.5a3 3 0 0 1 0 6H12V3Z", "M8.5 9H12v6H8.5a3 3 0 0 1 0-6Z", "M8.5 15H12v3a3 3 0 1 1-3.5-3Z"], c: { cx: 15.5, cy: 12, r: 3 } },
  { t: "Vercel", d: ["M12 4 21.5 20H2.5L12 4Z"] },
  { t: "Claude", d: ["M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4"] },
  { t: "Cursor", d: ["M5 3 19 11.5l-6.4 1.3L9.6 19 5 3Z"] },
];

export function RouteMap() {
  const map = useRef<HTMLDivElement>(null);
  const arc = useRef<SVGPathElement>(null);
  const glow = useRef<SVGPathElement>(null);
  const torch = useRef<HTMLDivElement>(null);
  const spark = useRef<HTMLDivElement>(null);
  const km = useRef<HTMLSpanElement>(null);
  const [section, revealed] = useReveal<HTMLElement>();

  /* `in` lands on the SECTION, not on the map. The rules it drives are all
     descendant selectors, and one of them — `.in .tools i` — is aimed at the
     tool glyphs, which are a sibling of the map inside .rgrid. Putting the
     class on the map leaves those four icons at opacity 0 permanently.
     It still fires on the MAP's threshold, so the arc, the travelling light
     and the counter stay one synchronised event. */
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = map.current;
    const path = arc.current;
    if (!el || !path || !km.current) return;

    /* pathLength is measured, not guessed, so nudging the curve in the data
       cannot silently desynchronise the dash from the travelling light */
    const LEN = path.getTotalLength();
    for (const p of [arc.current, glow.current]) p?.style.setProperty("--L", String(LEN));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const land = () => {
      setStarted(true);
      if (km.current) km.current.textContent = ROUTE.km.toLocaleString();
      if (torch.current) torch.current.style.opacity = "0";
      if (spark.current) spark.current.style.opacity = "0";
    };

    if (reduced) {
      land();
      return;
    }

    let raf = 0;
    let done = false;
    const run = () => {
      if (done) return;
      done = true;
      setStarted(true);
      let t0: number | null = null;
      const step = (ts: number) => {
        if (t0 === null) t0 = ts;
        const p = Math.min(Math.max(ts - t0 - 200, 0) / 2400, 1);
        const e = 1 - Math.pow(1 - p, 4);
        const pt = path.getPointAtLength(LEN * e);
        const lx = `${(pt.x / ROUTE.viewBox.w) * 100}%`;
        const ly = `${(pt.y / ROUTE.viewBox.h) * 100}%`;
        for (const n of [torch.current, spark.current]) {
          if (!n) continue;
          n.style.left = lx;
          n.style.top = ly;
        }
        if (km.current) km.current.textContent = Math.round(ROUTE.km * e).toLocaleString();
        if (p < 1) raf = requestAnimationFrame(step);
        else {
          if (torch.current) torch.current.style.opacity = "0";
          if (spark.current) spark.current.style.opacity = "0";
        }
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            io.unobserve(e.target);
            run();
          }
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);

    /* If the observer never speaks, the section is a dotted grid with a 0 on
       it. Land it rather than leave it. */
    const failsafe = window.setTimeout(() => {
      if (!done) {
        done = true;
        land();
      }
    }, 4000);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <section
      className={`route${revealed ? " rv" : ""}${started ? " in" : ""}`}
      id="route"
      ref={section}
    >
      <div className="eyebrow">
        <span>THE ROUTE</span>
      </div>
      <div className="rgrid">
        <div className="map" id="map" ref={map}>
          <div className="dots" />
          <svg viewBox={`0 0 ${ROUTE.viewBox.w} ${ROUTE.viewBox.h}`} preserveAspectRatio="none" aria-hidden="true">
            <path ref={glow} className="arcGlow" d={ROUTE.path} />
            <path ref={arc} className="arc" d={ROUTE.path} />
          </svg>
          <div className="torch" ref={torch} />
          <div className="spark" ref={spark} />
          <div className="pin a" style={{ left: "12.6%", top: "80%" }}>
            <div className="halo" />
            <div className="ring" />
            <span className="nm">{ROUTE.from}</span>
          </div>
          <div className="pin b" style={{ left: "87.4%", top: "30.5%" }}>
            <div className="halo" />
            <div className="ring" />
            <span className="nm">{ROUTE.to}</span>
          </div>
          <div className="dist" style={{ left: "41%", top: "40%" }}>
            <span ref={km}>0</span> KM
          </div>
        </div>

        <div>
          <p className="deg">Master&rsquo;s in Human-Centered Computing, UMBC.</p>
          <div className="tools" id="tools">
            {TOOLS.map((tool, i) => (
              <i key={tool.t} style={{ ["--i" as string]: i }} title={tool.t}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
                  {tool.d.map((d, k) => (
                    <path key={k} d={d} />
                  ))}
                  {tool.c ? <circle cx={tool.c.cx} cy={tool.c.cy} r={tool.c.r} /> : null}
                </svg>
              </i>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
