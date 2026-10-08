import { useCallback, useEffect, useRef, useState } from "react";
import { flagship } from "../../content/home";
import { Project } from "./Project";
import "../../styles/showcase.css";

/* --------------------------------------------------------------------------
   SELECTED WORK.

   ONE DOM, TWO LAYOUTS. Below 1024, or under reduced motion at any width,
   every project is a row and its own Spec / Shipped control owns its state.
   Above that the four rows stack into one sticky cell and the scroll engine
   owns it instead. The markup does not change between them, which is the only
   reason a frame cannot end up in two states at once.

   THE ENGINE ARRIVES LATE AND ON PURPOSE. GSAP and ScrollTrigger are imported
   when the section comes within one and a half viewports, so they are never
   on the path to first paint and never fetched at all by a reader who does
   not scroll (§11.2).
   -------------------------------------------------------------------------- */

const PINNED = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

export function Showcase() {
  const section = useRef<HTMLElement>(null);
  const [pinned, setPinned] = useState(
    () => typeof window !== "undefined" && window.matchMedia(PINNED).matches
  );
  const [shipped, setShipped] = useState<number[]>([]);
  const [active, setActive] = useState(0);

  /* The layout question is asked once and watched: a reader who turns reduced
     motion on, or rotates a tablet, moves between the two. */
  useEffect(() => {
    const mq = window.matchMedia(PINNED);
    const onChange = () => setPinned(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const onShip = useCallback((i: number) => {
    setShipped((prev) => (prev.includes(i) ? prev : [...prev, i]));
  }, []);

  useEffect(() => {
    /* The stacked layout has no engine, so it has no reason to fetch one. A
       reader on a phone, or one who asked for less motion, was downloading
       46KB of GSAP that gsap.matchMedia would then decline to use. */
    if (!pinned) return;
    const el = section.current;
    if (!el) return;

    let destroy: (() => void) | undefined;
    let io: IntersectionObserver | undefined;
    let cancelled = false;

    const observe = () => {
      if (cancelled) return;
      io = new IntersectionObserver(
        async ([entry]) => {
          if (!entry.isIntersecting) return;
          io?.disconnect();
          const { mountShowcaseMotion } = await import("./showcaseMotion");
          if (cancelled) return;
          destroy = mountShowcaseMotion(
            {
              section: el,
              projects: [...el.querySelectorAll<HTMLElement>(".project")],
              fills: [...el.querySelectorAll<HTMLElement>(".progress .fill")],
              names: [...el.querySelectorAll<HTMLElement>(".progress button")],
            },
            onShip,
            setActive
          );
        },
        { rootMargin: "150% 0px" }
      );
      io.observe(el);
    };

    /* A 150% root margin reaches 1350px past a 900px fold and the showcase
       starts about 120px below it, so the observer fired at once and the
       chunk was being fetched 116ms in: during the critical path rather than
       after it (§11.1).

       Waiting for `load` was not enough either. On a local server the load
       event fires at 29ms, before React has painted anything, so "after load"
       put the fetch at 134ms and FCP at 188ms: still ahead of the paint it
       was supposed to follow. The only thing that reliably means LCP has
       happened is the LCP entry itself, buffered so an already-past paint
       still counts. The timeout is for a browser that never reports one. */
    let started = false;
    const go = () => {
      if (started || cancelled) return;
      started = true;
      if (window.requestIdleCallback) window.requestIdleCallback(observe, { timeout: 1000 });
      else window.setTimeout(observe, 1);
    };

    /* LCP is reported as a run of candidates, not one entry: the headline
       paints first and the subline overtakes it. Starting on the first entry
       put the fetch at 367ms against a final LCP of 464ms, which is still
       before the paint it is meant to follow. So wait for the candidates to
       stop arriving, then go. */
    let settle: number | undefined;
    let po: PerformanceObserver | undefined;
    try {
      po = new PerformanceObserver(() => {
        window.clearTimeout(settle);
        settle = window.setTimeout(() => {
          po?.disconnect();
          go();
        }, 250);
      });
      po.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {
      /* no LCP entries in this browser; the cap below covers it */
    }
    const cap = window.setTimeout(go, 2500);

    return () => {
      cancelled = true;
      window.clearTimeout(cap);
      window.clearTimeout(settle);
      po?.disconnect();
      io?.disconnect();
      destroy?.();
    };
  }, [pinned, onShip]);

  return (
    <section
      id="work"
      className="showcase"
      aria-labelledby="work-title"
      ref={section}
      style={{ ["--n" as string]: flagship.length }}
    >
      <a className="skip-inline" href="#more-work">
        Skip past selected work
      </a>

      <div className="stage">
        <h2 id="work-title" className="stage-label">
          Selected work
        </h2>

        <div className="stage-copy">
          {flagship.map((p, i) => (
            <Project
              key={p.slug}
              project={p}
              index={i}
              pinned={pinned}
              shipped={shipped.includes(i)}
            />
          ))}
        </div>

        <nav className="progress" aria-label="Selected work progress">
          {flagship.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              data-index={i}
              aria-current={i === active ? "true" : undefined}
            >
              {p.name}
              <i className="track" aria-hidden="true">
                <i className="fill" />
              </i>
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
