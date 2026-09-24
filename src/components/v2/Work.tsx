import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { MOCKUPS, type MockupKey } from "../../data/mockups";
import { useReveal } from "./useReveal";

/* --------------------------------------------------------------------------
   WORK — SPEC §7, BUILD step 6.

   A typographic index, not a card grid. Hovering a row indents it toward the
   cursor, draws an accent hairline, dims every other title, and cross-fades
   that project's live mockup into the sticky panel on the right.

   THE MOCKUPS REPLAY ON EVERY ACTIVATION. Their animations are CSS keyframes
   tied to an `.on` class, so playing one again means re-creating its nodes —
   the reference does that by re-assigning innerHTML, this does it with a key.
   The README names this as one of the three things most likely to go wrong,
   and "they only play once" is exactly what a stale key looks like.

   THE COUNTERS AND THE CLOCK ARE DRIVEN FROM HERE, not from the markup. Each
   mockup declares what it wants — data-count="412", data-clock — and this
   animates it after the nodes land. That keeps the markup a description of a
   product rather than a program.

   Below 1000px the sticky panel is dropped and each mockup stacks under its
   own row; the CSS handles the layout, an observer starts the animation.
   -------------------------------------------------------------------------- */

type Item = {
  key: MockupKey;
  idx: string;
  title: string;
  tag: string;
  href: string;
  rgb: [number, number, number];
  /** the running thing, not the write-up about it */
  live?: { href: string; label: string };
  year: string;
};

const ITEMS: Item[] = [
  {
    key: "headroom",
    idx: "01",
    title: "Headroom",
    tag: "Local-first finance · React",
    href: "/headroom",
    rgb: [95, 216, 164],
    live: { href: "https://headroom-opal.vercel.app", label: "OPEN APP" },
    year: "2026",
  },
  {
    key: "signal",
    idx: "02",
    title: "Signal",
    tag: "Live event map · MapLibre",
    href: "/signal",
    rgb: [95, 211, 216],
    live: { href: "https://jayharwani.github.io/dmv-map/", label: "OPEN MAP" },
    year: "2026",
  },
  {
    key: "chrono",
    idx: "03",
    title: "ChronoWeave",
    tag: "ADHD time blindness · Mobile",
    href: "/chronoweave",
    rgb: [139, 123, 232],
    live: { href: "https://revamp-sauna-76244505.figma.site", label: "PROTOTYPE" },
    year: "2026",
  },
  {
    key: "bumper",
    idx: "04",
    title: "Bumper",
    tag: "Behavioural · Extension",
    href: "/bumper",
    rgb: [233, 197, 139],
    live: {
      href: "https://chromewebstore.google.com/detail/flnbabigjodkpgapnpeaiepdmganifmp?utm_source=item-share-cb",
      label: "CHROME STORE",
    },
    year: "2026",
  },
];

/** ease a number to `to` over `d` ms, quartic out, writing into the node */
function count(el: HTMLElement, to: number, d: number) {
  let t0: number | null = null;
  let raf = 0;
  const step = (ts: number) => {
    if (t0 === null) t0 = ts;
    const p = Math.min((ts - t0) / d, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))).toLocaleString();
    if (p < 1) raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(step);
  return () => cancelAnimationFrame(raf);
}

/** 24:00 counting down in real seconds, for as long as its shot is on */
function clock(el: HTMLElement) {
  let t0: number | null = null;
  let raf = 0;
  const tick = (ts: number) => {
    if (t0 === null) t0 = ts;
    const v = Math.max(1440 - Math.floor((ts - t0) / 1000), 0);
    el.textContent = `${String(Math.floor(v / 60)).padStart(2, "0")}:${String(v % 60).padStart(2, "0")}`;
    if (el.closest(".shot")?.classList.contains("on")) raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

/** start whatever the freshly-mounted markup asked for */
function play(root: HTMLElement | null) {
  if (!root) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  const stops: Array<() => void> = [];
  root.querySelectorAll<HTMLElement>("[data-count]").forEach((n) => {
    stops.push(count(n, Number(n.dataset.count), 1600));
  });
  const ck = root.querySelector<HTMLElement>("[data-clock]");
  if (ck) stops.push(clock(ck));
  return () => stops.forEach((s) => s());
}

/** one mockup, remounted whenever `beat` changes so its keyframes restart */
function Shot({ k, on, beat }: { k: MockupKey; on: boolean; beat: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!on) return;
    return play(ref.current);
  }, [on, beat]);
  return (
    <div
      ref={ref}
      className={`shot${on ? " on" : ""}`}
      dangerouslySetInnerHTML={{ __html: MOCKUPS[k] }}
    />
  );
}

export function Work({ onHue }: { onHue?: (rgb: [number, number, number]) => void }) {
  const [active, setActive] = useState<MockupKey>("headroom");
  const [beat, setBeat] = useState(0);
  const [shown, setShown] = useState<boolean[]>(() => ITEMS.map(() => false));
  const preview = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [section, revealed] = useReveal<HTMLElement>();

  const activate = useCallback(
    (it: Item) => {
      setActive((prev) => {
        if (prev === it.key) return prev;
        setBeat((b) => b + 1);
        return it.key;
      });
      /* On the page root, NOT on documentElement. The reference declares
         --accent in :root, so an inline property on <html> outranks it there.
         Here the tokens are scoped to .v2, which is a descendant — an inline
         value on <html> would be inherited and then immediately overridden by
         the .v2 rule, and the accent would never move off mint. */
      const rgb = `rgb(${it.rgb.join(",")})`;
      list.current?.closest<HTMLElement>(".v2")?.style.setProperty("--accent", rgb);
      const tint = preview.current?.querySelector<HTMLElement>(".tint");
      if (tint) {
        tint.style.background = `radial-gradient(90% 70% at 50% 40%, rgba(${it.rgb.join(",")},.13), transparent 70%)`;
      }
      onHue?.(it.rgb);
    },
    [onHue]
  );

  /* Rows arrive staggered. THE REVEAL IS STATE. Adding `in` with classList
     works until the next render — and this component re-renders on every
     hover, because `active` moves. React then writes the className prop back
     over the element and the row that had revealed disappears again, one row
     per project hovered, until the whole list is gone. Rendering the class is
     the only version of this that survives its own component. */
  useEffect(() => {
    const root = list.current;
    if (!root) return;
    const rows = Array.from(root.querySelectorAll<HTMLElement>(".item"));
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = rows.indexOf(e.target as HTMLElement);
          io.unobserve(e.target);
          if (i >= 0) setShown((prev) => (prev[i] ? prev : prev.map((v, k) => k === i || v)));
        }
      },
      { threshold: 0.15 }
    );
    rows.forEach((r) => io.observe(r));
    const failsafe = window.setTimeout(() => setShown(ITEMS.map(() => true)), 2500);
    return () => {
      io.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const onRowMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const inner = e.currentTarget.querySelector<HTMLElement>(".inner");
    if (!inner) return;
    inner.style.setProperty("--dx", `${18 + ((e.clientX - r.left) / r.width) * 10}px`);
    inner.style.setProperty("--dy", `${((e.clientY - r.top) / r.height - 0.5) * 8}px`);
  };
  const onRowLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    const inner = e.currentTarget.querySelector<HTMLElement>(".inner");
    inner?.style.setProperty("--dx", "0px");
    inner?.style.setProperty("--dy", "0px");
  };

  /* the panel tilts what is inside it toward the cursor */
  const onPanelMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    e.currentTarget.querySelectorAll<HTMLElement>(".shot>*").forEach((n) => {
      n.style.setProperty("--ry", `${dx * 13}deg`);
      n.style.setProperty("--rx", `${-dy * 13}deg`);
    });
  };
  const onPanelLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.querySelectorAll<HTMLElement>(".shot>*").forEach((n) => {
      n.style.setProperty("--ry", "0deg");
      n.style.setProperty("--rx", "0deg");
    });
  };

  return (
    <section className={`v2work${revealed ? " v2rv" : ""}`} id="work" ref={section}>
      <div className="eyebrow">
        <span>SELECTED WORK</span>
      </div>
      <div className="grid">
        <div className="list" id="list" ref={list}>
          {ITEMS.map((it, i) => (
            /* A WRAPPER, NOT A LINK AROUND A LINK. The row used to be one
               <Link> over everything, which leaves nowhere to put a second
               destination: an anchor inside an anchor is invalid and browsers
               resolve it by dropping one. The row keeps the case study; the
               live product gets its own control beside it. */
            <div
              key={it.key}
              className={`item${active === it.key ? " act" : ""}${shown[i] ? " in" : ""}`}
              style={{ transitionDelay: `${i * 70}ms` }}
              onPointerEnter={() => activate(it)}
              onPointerMove={onRowMove}
              onPointerLeave={onRowLeave}
            >
              <div className="inner">
                <Link className="hit" to={it.href} onFocus={() => activate(it)}>
                  <span>
                    <span className="idx">{it.idx}</span>
                    <h3>{it.title}</h3>
                  </span>
                </Link>
                <span className="tag">
                  <span className="yr mono">{it.year}</span>
                  {it.tag}
                  <em>Case study</em>
                  {it.live ? (
                    <a
                      className="live mono"
                      href={it.live.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      onFocus={() => activate(it)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {it.live.label}
                      <span aria-hidden="true">&#8599;</span>
                    </a>
                  ) : null}
                </span>
              </div>
              <i className="glow" />
              {/* stacked under its own row below 1000px; the panel takes over
                  above that and the CSS decides which is visible */}
              <div className="m-shot">
                <Shot k={it.key} on beat={0} />
              </div>
            </div>
          ))}
        </div>

        <div
          className="preview"
          id="preview"
          ref={preview}
          onPointerMove={onPanelMove}
          onPointerLeave={onPanelLeave}
        >
          <div className="tint" />
          {ITEMS.map((it) => (
            <Shot
              key={`${it.key}-${active === it.key ? beat : "off"}`}
              k={it.key}
              on={active === it.key}
              beat={beat}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
